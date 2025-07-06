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
            <div className="min-h-screen bg-background">
                <motion.div
                    className="flex flex-col items-center justify-center min-h-screen px-6"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="max-w-md mx-auto text-center bg-card rounded-xl border border-border p-8 shadow-sm"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="mb-6" variants={staggerItem}>
                            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                                <svg
                                    className="w-10 h-10 text-destructive"
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
                            <h2 className="text-2xl font-bold text-foreground mb-3">
                                Link invalid
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Linkul pe care l-ați accesat nu este valid sau este incomplet. Vă rugăm să verificați linkul sau să alegeți un specialist din lista noastră.
                            </p>
                        </motion.div>
                        <motion.div className="space-y-3" variants={staggerItem}>
                            <motion.button
                                onClick={navigateToMyAppointments}
                                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Înapoi la programările mele
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(-1)}
                                className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-all duration-200 font-medium"
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
            <div className="min-h-screen bg-background">
                <PageLoader message="Se încarcă intervalele de timp disponibile..." />
                <Footer />
            </div>
        );
    }

    // Show professional not found state
    if (professionalExists === false) {
        return (
            <div className="min-h-screen bg-background">
                <motion.div
                    className="flex flex-col items-center justify-center min-h-screen px-6"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="max-w-md mx-auto text-center bg-card rounded-xl border border-border p-8 shadow-sm"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className="mb-6" variants={staggerItem}>
                            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                                <svg
                                    className="w-10 h-10 text-muted-foreground"
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
                            <h2 className="text-2xl font-bold text-foreground mb-3">
                                Specialist negăsit
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Ne pare rău, dar specialistul pe care îl căutați nu a fost găsit sau nu mai este disponibil pentru programări.
                            </p>
                        </motion.div>
                        <motion.div className="space-y-3" variants={staggerItem}>
                            <motion.button
                                onClick={navigateToMyAppointments}
                                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Înapoi la programările mele
                            </motion.button>
                            <motion.button
                                onClick={() => navigate(-1)}
                                className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-all duration-200 font-medium"
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
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <motion.div
                className="bg-muted/20 border-b border-border relative overflow-hidden"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
            >
                {/* Subtle background decoration */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-(--breakpoint-xl) mx-auto px-6 py-16">
                    <motion.div
                        className="flex items-center gap-4 mb-8"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            variants={staggerItem}
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
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6"
                            variants={staggerItem}
                        >
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            Rezervare online
                        </motion.div>

                        <motion.h1
                            className="text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold leading-[1.2]! tracking-tight mb-6"
                            variants={staggerItem}
                        >
                            Programează-te cu{" "}
                            {professionalName && (
                                <span className="text-primary">
                                    {professionalName}
                                </span>
                            )}
                        </motion.h1>

                        <motion.p
                            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
                            variants={staggerItem}
                        >
                            Alege intervalul de timp perfect pentru tine. Programarea este simplă, rapidă și sigură.
                        </motion.p>

                        <motion.div
                            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
                            variants={staggerItem}
                        >
                            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                90 minute / sesiune
                            </div>
                            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Program: 08:00 - 18:00
                            </div>
                            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Confirmare rapidă
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div>
                {availableTimeslots.length === 0 ? (
                    <motion.div
                        className="flex items-center justify-center py-20"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="max-w-md mx-auto text-center bg-card rounded-xl border border-border p-8"
                            variants={staggerItem}
                        >
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-8 h-8 text-muted-foreground"
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
                            <h3 className="text-xl font-semibold text-foreground mb-3">
                                Nu sunt intervale disponibile
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Ne pare rău, dar nu sunt intervale de timp disponibile pentru acest specialist în următoarele 30 de zile.
                            </p>
                            <button
                                onClick={navigateToMyAppointments}
                                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
                            >
                                Înapoi la programările mele
                            </button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        className="bg-background"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Calendar Header */}
                        <motion.div
                            className="bg-muted/30 border-b border-border px-6 py-4"
                            variants={staggerItem}
                        >
                            <div className="max-w-(--breakpoint-xl) mx-auto flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">
                                        Selectează data și ora
                                    </h3>
                                    <p className="text-muted-foreground mt-1">
                                        Toate orele sunt afișate în fusul orar România (EET/EEST)
                                    </p>
                                </div>
                                <motion.button
                                    onClick={navigateToMyAppointments}
                                    className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all duration-200"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Calendar Body */}
                        <motion.div
                            className="bg-background"
                            variants={staggerItem}
                        >
                            <div>
                                <ScheduleMeeting
                                    borderRadius={5}
                                    primaryColor="#0f0f0f"
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
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <Footer />

            {/* Custom Styles for Calendar */}
            <style jsx>{`
                .calendar-wrapper {
                    --rsm-primary-color: hsl(var(--primary));
                    --rsm-border-radius: 0px;
                }
                .calendar-wrapper .rsm-calendar {
                    border: none !important;
                    box-shadow: none !important;
                    background: transparent !important;
                }
                .calendar-wrapper .rsm-calendar-day {
                    border-radius: 8px !important;
                    transition: all 0.2s ease !important;
                }
                .calendar-wrapper .rsm-calendar-day:hover {
                    transform: scale(1.02) !important;
                }
                .calendar-wrapper .rsm-time-slot {
                    border-radius: 6px !important;
                    transition: all 0.2s ease !important;
                    box-shadow: none !important;
                }
                .calendar-wrapper .rsm-time-slot:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
                }
                .rsm-calendar {
                    padding: 0 !important;
                    margin: 0 !important;
                }
            `}</style>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent className="left-4 right-4 top-[50%] translate-x-0 translate-y-[-50%] w-auto max-w-md mx-auto rounded-xl shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold">
                            Confirmă rezervarea programării
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedTimeSlot && (
                                <div className="space-y-4 mt-4">
                                    <p className="text-muted-foreground">
                                        Sunteți sigur că doriți să rezervați o programare pentru:
                                    </p>
                                    <div className="bg-muted/50 p-4 rounded-xl border border-border">
                                        {professionalName && (
                                            <div className="flex items-center gap-3 mb-3 text-foreground">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium">{professionalName}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 mb-3 text-foreground">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">
                                                {selectedTimeSlot?.toLocaleDateString('ro-RO', {
                                                    timeZone: 'Europe/Bucharest',
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-3 text-foreground">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">
                                                {formatTime(selectedTimeSlot)} - {formatTime(addMinutes(selectedTimeSlot, 90))}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-foreground">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <span className="font-medium">Durata: 90 minute</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel
                            onClick={handleCancelBooking}
                            className="px-6 py-2 rounded-lg transition-all duration-200"
                        >
                            Anulează
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmBooking}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
                        >
                            Confirmă rezervarea
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
