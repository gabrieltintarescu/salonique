import { AppRoutes } from '@/AppRouter';
import { PageLoader, withMinimumDelay } from "@/components/animations/LoadingComponents";
import { fadeIn, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import Footer from "@/components/homepage/footer";
import { ro } from 'date-fns/locale';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ScheduleMeeting, type StartTimeEventEmit } from 'react-schedule-meeting';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { supabase } from '../../lib/supabase';
import {
    addMinutes,
    createRomaniaDate,
    formatTime,
    fromDatabaseToRomaniaTime,
    nowInRomania,
    toUTCForDatabase
} from '../../utils/dateUtils';

interface Appointment {
    id: string;
    start_time: string;
    end_time: string;
    professional_id: string;
}

export default function RequestAppointment() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [availableTimeslots, setAvailableTimeslots] = useState<any[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<Date | null>(null);
    const [professionalExists, setProfessionalExists] = useState<boolean | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const professionalId = searchParams.get('professionalId');
    const [professionalName, setProfessionalName] = useState<string | null>(null);
    const { handleSupabaseError, handleSuccess } = useErrorHandler();

    // Validate if professional exists
    const validateProfessional = async (profId: string) => {
        try {
            const { data, error } = await supabase
                .from('professionals')
                .select('id, name')
                .eq('id', profId)
                .single();

            if (error || !data) {
                return false;
            }

            setProfessionalName(data.name);
            return true;
        } catch (error) {
            console.error('Error validating professional:', error);
            return false;
        }
    };

    // Fetch appointments for the professional
    const fetchAppointments = async (profId: string) => {
        try {
            // Get current time in Romania timezone for filtering
            const currentRomaniaTime = nowInRomania();
            const currentUTC = toUTCForDatabase(currentRomaniaTime);

            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('professional_id', profId)
                .eq('status', 'confirmed') // Only fetch confirmed appointments
                .gte('start_time', currentUTC);

            if (error) {
                console.error('Error fetching appointments:', error);
                return [];
            }

            // Convert database times to Romania timezone
            return (data || []).map(appointment => ({
                ...appointment,
                start_time: fromDatabaseToRomaniaTime(appointment.start_time).toISOString(),
                end_time: fromDatabaseToRomaniaTime(appointment.end_time).toISOString()
            }));
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    };

    // Calculate available time slots based on working hours and existing appointments
    const calculateAvailableSlots = (existingAppointments: Appointment[]) => {
        const slots = [];
        const workingHourStart = 8; // 8 AM
        const workingHourEnd = 18; // 6 PM
        const slotDurationMinutes = 90; // 1.5 hours as per eventDurationInMinutes

        // Generate slots for the next 30 days
        for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
            // Create date in Romania timezone
            const currentRomaniaTime = nowInRomania();
            const currentDate = createRomaniaDate(
                currentRomaniaTime.getFullYear(),
                currentRomaniaTime.getMonth(),
                currentRomaniaTime.getDate() + dayOffset,
                workingHourStart,
                0,
                0
            );

            const dayEnd = createRomaniaDate(
                currentRomaniaTime.getFullYear(),
                currentRomaniaTime.getMonth(),
                currentRomaniaTime.getDate() + dayOffset,
                workingHourEnd,
                0,
                0
            );

            // Generate time slots for this day
            const currentTime = new Date(currentDate);

            while (currentTime < dayEnd) {
                const slotEnd = addMinutes(currentTime, slotDurationMinutes);

                // Check if this time slot conflicts with existing appointments
                const hasConflict = existingAppointments.some(appointment => {
                    const appointmentStart = new Date(appointment.start_time);
                    const appointmentEnd = new Date(appointment.end_time);

                    return (
                        (currentTime >= appointmentStart && currentTime < appointmentEnd) ||
                        (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
                        (currentTime <= appointmentStart && slotEnd >= appointmentEnd)
                    );
                });

                // Only add the slot if there's no conflict and it doesn't exceed working hours
                if (!hasConflict && slotEnd <= dayEnd) {
                    slots.push({
                        id: slots.length,
                        startTime: new Date(currentTime),
                        endTime: new Date(slotEnd),
                    });
                }

                // Move to next possible slot (every 30 minutes for flexibility)
                currentTime.setMinutes(currentTime.getMinutes() + 30);
            }
        }

        return slots;
    };

    useEffect(() => {
        const loadAppointments = async () => {
            if (!professionalId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            // Create the data loading promise
            const loadData = async () => {
                // Validate professional existence
                const isProfessionalValid = await validateProfessional(professionalId);
                setProfessionalExists(isProfessionalValid);

                if (!isProfessionalValid) {
                    return;
                }

                const appointments = await fetchAppointments(professionalId);
                console.log('Fetched appointments:', appointments);

                const slots = calculateAvailableSlots(appointments);
                setAvailableTimeslots(slots);
            };

            try {
                // Apply minimum delay to the load operation
                await withMinimumDelay(loadData());
            } catch (error) {
                console.error('Error loading appointments:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAppointments();
    }, [professionalId]); const handleTimeSelect = (startTimeEventEmit: StartTimeEventEmit) => {


        // Store the selected time slot and show confirmation dialog
        setSelectedTimeSlot(startTimeEventEmit.startTime);
        setShowConfirmDialog(true);
    };

    const handleConfirmBooking = async () => {
        if (!selectedTimeSlot || !professionalId) return;

        try {
            // Get current user session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                // Store the current URL with query params for redirect after login
                const currentUrl = `${window.location.pathname}${window.location.search}`;
                navigate(`${AppRoutes.CLIENT_LOGIN}?redirectUrl=${encodeURIComponent(currentUrl)}`);
                return;
            }

            // Get client record to get the client_id
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('id')
                .eq('user_id', session.user.id)
                .single();

            if (clientError || !clientData) {
                handleSupabaseError(clientError, 'Nu vă putem găsi profilul de client. Vă rugăm să contactați suportul.');
                return;
            }

            // Convert Romania time to UTC for database storage
            const startTimeUTC = toUTCForDatabase(selectedTimeSlot);
            const endTimeSlot = addMinutes(selectedTimeSlot, 90);
            const endTimeUTC = toUTCForDatabase(endTimeSlot);

            const appointmentData = {
                professional_id: professionalId,
                client_id: clientData.id,
                start_time: startTimeUTC,
                end_time: endTimeUTC,
                status: 'requested'
            };

            const { error } = await supabase
                .from('appointments')
                .insert([appointmentData])
                .select();

            if (error) {
                handleSupabaseError(error, 'Rezervarea nu a putut fi efectuată. Vă rugăm să încercați din nou.');
                return;
            }

            handleSuccess('Rezervarea a fost trimisă cu succes! Veți fi notificat când va fi confirmată.');
            navigateToMyAppointments();
            return;
        } catch (error) {
            handleSupabaseError(error, 'Rezervarea nu a putut fi efectuată. Vă rugăm să încercați din nou.');
        } finally {
            setShowConfirmDialog(false);
            setSelectedTimeSlot(null);
        }
    };

    const handleCancelBooking = () => {
        setShowConfirmDialog(false);
        setSelectedTimeSlot(null);
    };

    // Helper function to navigate to MyAppointments without showing invalid page
    const navigateToMyAppointments = () => {
        setIsNavigating(true);
        navigate(AppRoutes.MY_APPOINTMENTS, { replace: true });
    };

    if (!professionalId && !isNavigating) {
        // Show invalid professional ID state
        return (
            <div className="min-h-screen w-full gradient-bg relative overflow-hidden">
                {/* Floating decorative elements */}
                <motion.div
                    className="absolute top-20 left-8 w-16 h-16 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden md:flex backdrop-blur-sm"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="max-w-md mx-auto text-center floating-card rounded-3xl p-12 shadow-purple"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="mb-8" variants={staggerItem}>
                            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <svg
                                    className="w-10 h-10 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Link invalid
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Linkul pe care l-ați accesat nu este valid sau este incomplet. Vă rugăm să verificați linkul sau să alegeți un specialist din lista noastră.
                            </p>
                        </motion.div>
                        <motion.div className="space-y-3" variants={staggerItem}>
                            <motion.button
                                onClick={navigateToMyAppointments}
                                className="w-full btn-gradient rounded-full px-8 py-3 font-medium shadow-purple"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Înapoi la programările mele
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(-1)}
                                className="w-full bg-gray-100 text-gray-700 rounded-full px-8 py-3 hover:bg-gray-200 transition-all duration-200 font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Înapoi la pagina anterioară
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <Footer />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen w-full gradient-bg relative overflow-hidden">
                <PageLoader message="Se încarcă intervalele de timp disponibile..." />
                <Footer />
            </div>
        );
    }

    // Show professional not found state
    if (professionalExists === false) {
        return (
            <div className="min-h-screen w-full gradient-bg relative overflow-hidden">
                {/* Floating decorative elements */}
                <motion.div
                    className="absolute top-24 right-16 w-20 h-20 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden md:flex backdrop-blur-sm"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="max-w-md mx-auto text-center floating-card rounded-3xl p-12 shadow-purple"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="mb-8" variants={staggerItem}>
                            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg
                                    className="w-10 h-10 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Specialist negăsit
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Ne pare rău, dar specialistul pe care îl căutați nu a fost găsit sau nu mai este disponibil pentru programări.
                            </p>
                        </motion.div>
                        <motion.div className="space-y-3" variants={staggerItem}>
                            <motion.button
                                onClick={navigateToMyAppointments}
                                className="w-full btn-gradient rounded-full px-8 py-3 font-medium shadow-purple"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Înapoi la programările mele
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(-1)}
                                className="w-full bg-gray-100 text-gray-700 rounded-full px-8 py-3 hover:bg-gray-200 transition-all duration-200 font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Înapoi la pagina anterioară
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <Footer />
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen w-full gradient-bg relative overflow-hidden"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
        >
            {/* Floating decorative elements */}
            <motion.div
                className="absolute top-16 left-8 w-16 h-16 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden md:flex backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </motion.div>

            <motion.div
                className="absolute top-24 right-16 w-20 h-20 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden md:flex backdrop-blur-sm"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </motion.div>

            <motion.div
                className="absolute bottom-32 left-20 w-12 h-12 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden lg:flex backdrop-blur-sm"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </motion.div>

            <div className="relative z-10">
                {/* Header Section */}
                <motion.div
                    className="bg-white/90 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50 shadow-sm"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <motion.div
                            className="flex items-center gap-4 mb-8"
                            variants={staggerItem}
                        >
                            <motion.button
                                onClick={navigateToMyAppointments}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full px-4 py-2 hover:bg-gray-100"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Înapoi
                            </motion.button>
                        </motion.div>

                        <motion.div
                            className="text-center max-w-4xl mx-auto"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 bg-gradient-purple-soft text-purple-700 rounded-full px-4 py-2 text-sm font-medium mb-6"
                                variants={staggerItem}
                            >
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                Rezervare online
                            </motion.div>

                            <motion.h1
                                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-6"
                                variants={staggerItem}
                            >
                                Programează-te cu{" "}
                                {professionalName && (
                                    <span className="text-gradient">
                                        {professionalName}
                                    </span>
                                )}
                            </motion.h1>

                            <motion.p
                                className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8"
                                variants={staggerItem}
                            >
                                Alege intervalul de timp perfect pentru tine. Programarea este simplă, rapidă și sigură.
                            </motion.p>

                            <motion.div
                                className="flex flex-wrap justify-center gap-6 text-sm text-gray-600"
                                variants={staggerItem}
                            >
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-soft">
                                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    90 minute / sesiune
                                </div>
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-soft">
                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Program: 08:00 - 18:00
                                </div>
                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-soft">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirmare rapidă
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    {availableTimeslots.length === 0 ? (
                        <motion.div
                            className="max-w-2xl mx-auto"
                            variants={staggerItem}
                        >
                            <div className="floating-card rounded-3xl p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                                    className="mb-8"
                                >
                                    <div className="w-24 h-24 mx-auto bg-gradient-purple-soft rounded-full flex items-center justify-center mb-6">
                                        <svg
                                            className="w-12 h-12 text-purple-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                </motion.div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nu sunt intervale disponibile</h3>
                                <p className="text-gray-600 mb-8 text-lg">
                                    Ne pare rău, dar nu sunt intervale de timp disponibile pentru acest specialist în următoarele 30 de zile.
                                </p>
                                <button
                                    onClick={navigateToMyAppointments}
                                    className="btn-gradient rounded-full px-8 py-3 font-medium shadow-purple"
                                >
                                    Înapoi la programările mele
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="floating-card rounded-3xl overflow-hidden shadow-purple"
                            variants={staggerItem}
                        >
                            <div className="calendar-wrapper">
                                <ScheduleMeeting
                                    borderRadius={5}
                                    primaryColor="#8b5cf6"
                                    startTimeListStyle="scroll-list"
                                    eventDurationInMinutes={90}
                                    availableTimeslots={availableTimeslots}
                                    onStartTimeSelect={handleTimeSelect}
                                    locale={ro}
                                    format_selectedDateDayTitleFormatString="cccc, d MMMM yyyy"
                                    format_selectedDateMonthTitleFormatString="MMMM yyyy"
                                    format_startTimeFormatString="HH:mm"
                                    lang_cancelButtonText="Anulează"
                                    lang_confirmButtonText="Confirmă"
                                    lang_emptyListText="Nu sunt ore disponibile"
                                    lang_goToNextAvailableDayText="Următoarele disponibile"
                                    lang_noFutureTimesText="Nu sunt ore disponibile în viitor"
                                    lang_selectedButtonText="Selectat:"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Custom Styles for Calendar */}
            <style jsx>{`
                .calendar-wrapper {
                    --rsm-primary-color: #8b5cf6;
                    --rsm-border-radius: 12px;
                }
                .calendar-wrapper .rsm-calendar {
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    border-radius: 0px !important;
                }
                .calendar-wrapper .rsm-calendar-day {
                    border-radius: 12px !important;
                    transition: all 0.3s ease !important;
                    border: 1px solid #e5e7eb !important;
                    background: white !important;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
                }
                .calendar-wrapper .rsm-calendar-day:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15) !important;
                    border-color: #8b5cf6 !important;
                }
                .calendar-wrapper .rsm-time-slot {
                    border-radius: 8px !important;
                    transition: all 0.2s ease !important;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
                    border: 1px solid #e5e7eb !important;
                    background: white !important;
                    margin: 4px 0 !important;
                }
                .calendar-wrapper .rsm-time-slot:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2) !important;
                    border-color: #8b5cf6 !important;
                }
                .calendar-wrapper .rsm-time-slot.selected {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%) !important;
                    color: white !important;
                    border-color: #7c3aed !important;
                    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4) !important;
                }
                .rsm-calendar {
                    padding: 20px !important;
                    margin: 0 !important;
                }
                .rsm-calendar-header {
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%) !important;
                    border-radius: 12px !important;
                    padding: 12px !important;
                    margin-bottom: 16px !important;
                }
            `}</style>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent className="left-4 right-4 top-[50%] translate-x-0 translate-y-[-50%] w-auto max-w-sm mx-auto rounded-2xl floating-card border-none shadow-purple">
                    <AlertDialogHeader className="text-center pb-2">
                        <div className="w-12 h-12 mx-auto bg-gradient-purple-soft rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <AlertDialogTitle className="text-lg font-bold text-gray-900 mb-2">
                            Confirmă rezervarea
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 text-sm">
                            {selectedTimeSlot && professionalName && (
                                <div className="space-y-3">
                                    <div className="bg-gradient-purple-soft p-4 rounded-xl border border-purple-100">
                                        <div className="text-left space-y-2">
                                            <div className="flex items-center gap-2 text-purple-900">
                                                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <span className="font-bold text-sm">{professionalName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-purple-900">
                                                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium text-sm">
                                                    {selectedTimeSlot.toLocaleDateString('ro-RO', {
                                                        timeZone: 'Europe/Bucharest',
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-purple-900">
                                                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium text-sm">
                                                    {formatTime(selectedTimeSlot)} - {formatTime(addMinutes(selectedTimeSlot, 90))} (90 min)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 pt-3">
                        <AlertDialogCancel
                            onClick={handleCancelBooking}
                            className="w-full sm:w-auto rounded-full px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm"
                        >
                            Anulează
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmBooking}
                            className="w-full sm:w-auto btn-gradient rounded-full px-6 py-2 font-medium shadow-purple text-sm"
                        >
                            Confirmă rezervarea
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}
