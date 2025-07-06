import { AppRoutes } from '@/AppRouter';
import { ro } from 'date-fns/locale';
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

            // Validate professional existence
            const isProfessionalValid = await validateProfessional(professionalId);
            setProfessionalExists(isProfessionalValid);

            if (!isProfessionalValid) {
                setLoading(false);
                return;
            }

            const appointments = await fetchAppointments(professionalId);
            console.log('Fetched appointments:', appointments);

            const slots = calculateAvailableSlots(appointments);
            setAvailableTimeslots(slots);
            setLoading(false);
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
            navigate(AppRoutes.MY_APPOINTMENTS);
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

    if (!professionalId) {
        // Show invalid professional ID state
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
                <div className="max-w-md mx-auto">
                    <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-10 h-10 text-red-400"
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
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Link invalid
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Linkul pe care l-ați accesat nu este valid sau este incomplet. Vă rugăm să verificați linkul sau să alegeți un specialist din lista noastră.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(AppRoutes.MY_APPOINTMENTS)}
                            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
                        >
                            Înapoi la programările mele
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                        >
                            Înapoi la pagina anterioară
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-lg text-gray-600">Se încarcă intervalele de timp disponibile...</p>
            </div>
        );
    }

    // Show professional not found state
    if (professionalExists === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
                <div className="max-w-md mx-auto">
                    <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-10 h-10 text-gray-400"
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
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Specialist negăsit
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Ne pare rău, dar specialistul pe care îl căutați nu a fost găsit sau nu mai este disponibil.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(AppRoutes.MY_APPOINTMENTS)}
                            className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
                        >
                            Înapoi la programările mele
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                        >
                            Înapoi la pagina anterioară
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {availableTimeslots.length === 0 ? (
                <div className="text-center text-gray-600">
                    <p>Nu s-au găsit intervale de timp disponibile pentru acest specialist.</p>
                    <p className="mt-2">Vă rugăm să încercați din nou mai târziu sau să contactați specialistul direct.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Calendar topbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                            Selectează o programare
                        </h3>
                        <button
                            onClick={() => navigate(AppRoutes.MY_APPOINTMENTS)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
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
                        </button>
                    </div>

                    {/* Calendar content */}
                    <div className="p-4" style={{ textTransform: 'capitalize' }}>
                        <ScheduleMeeting
                            borderRadius={8}
                            primaryColor="#4a5568"
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
                </div>
            )}

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent className="left-4 right-4 top-[50%] translate-x-0 translate-y-[-50%] w-auto max-w-md mx-auto rounded-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmă rezervarea programării</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedTimeSlot && (
                                <div className="space-y-2">
                                    <p>
                                        Sunteți sigur că doriți să rezervați o programare pentru:
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        {professionalName &&
                                            <p className="font-semibold">
                                                👩🏻‍⚕️ Nume: {professionalName}
                                            </p>
                                        }
                                        <p className="font-semibold">
                                            📅 {selectedTimeSlot?.toLocaleDateString('ro-RO', {
                                                timeZone: 'Europe/Bucharest',
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="font-semibold">
                                            🕐 {formatTime(selectedTimeSlot)} - {formatTime(addMinutes(selectedTimeSlot, 90))}
                                        </p>
                                        <p className="font-semibold">
                                            ⏱️ Durata: 90 minute
                                        </p>
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelBooking} className='cursor-pointer'>
                            Anulează
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmBooking} className='cursor-pointer'>
                            Confirmă rezervarea
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
