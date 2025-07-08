import { AppRoutes } from '@/AppRouter';
import { PageLoader, withMinimumDelay } from "@/components/animations/LoadingComponents";
import { fadeIn, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import Footer from '@/components/homepage/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/homepage/ui/avatar';
import { Badge } from '@/components/homepage/ui/badge';
import { Button } from '@/components/homepage/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/homepage/ui/sheet';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { supabase } from '@/lib/supabase';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion } from "framer-motion";
import { Calendar, CalendarX, Clock, Home, LockKeyhole, Menu, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AppointmentStatus = 'requested' | 'confirmed';

interface Appointment {
    id: string;
    start_time: string;
    end_time: string;
    status: AppointmentStatus;
    public_notes?: string;
    notes?: string;
    private_notes?: string;
    professional: {
        id: string;
        name: string;
        profile_image_url?: string;
    };
}



interface ClientInfo {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profilePicture?: string;
}

export default function MyAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);

            // Create the data fetching promise
            const fetchData = async () => {
                // Get current user
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) {
                    navigate(`${AppRoutes.CLIENT_LOGIN}?redirectUrl=${encodeURIComponent(window.location.pathname)}`);
                    return;
                }

                // Get client record
                const { data: clientData, error: clientError } = await supabase
                    .from('clients')
                    .select('id, name, email, phone')
                    .eq('user_id', session.user.id)
                    .single();

                if (clientError || !clientData) {
                    toast.error('Nu s-a putut găsi profilul clientului. Te rugăm să te reconectezi.');
                    handleLogout();
                    return;
                }

                // Get Google profile picture from user metadata if available
                const googleProfilePicture = session.user.user_metadata?.picture;

                // Store client info in state with profile picture
                setClientInfo({
                    ...clientData,
                    profilePicture: googleProfilePicture
                });

                // Fetch appointments with professional details
                const { data, error: appointmentsError } = await supabase
                    .from('appointments')
                    .select(`
        id,
        start_time,
        end_time,
        status,
        professional:professional_id (
          id,
          name,
          profile_image_url
        )
      `)
                    .eq('client_id', clientData.id)
                    .order('start_time', { ascending: true });

                if (appointmentsError) {
                    setError(appointmentsError.message);
                    return;
                }

                const appointments = data.map((item: any) => {
                    if (!item.professional || item.professional.length === 0) {
                        console.warn(`No professional data for appointment id ${item.id}`);
                    }
                    return {
                        id: item.id,
                        start_time: item.start_time, // Keep as UTC string for database consistency
                        end_time: item.end_time,     // Keep as UTC string for database consistency  
                        status: item.status as AppointmentStatus,
                        professional: item.professional,
                        public_notes: item.public_notes,
                        private_notes: item.private_notes,
                    };
                });
                setAppointments(appointments);
            };

            // Apply minimum delay to the fetch operation
            await withMinimumDelay(fetchData());
        } catch (err) {
            setError('A apărut o eroare neașteptată');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = (appointment: Appointment) => {
        setAppointmentToDelete(appointment);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!appointmentToDelete) return;

        try {
            setIsDeleting(true);

            const { error } = await supabase
                .from('appointments')
                .delete()
                .eq('id', appointmentToDelete.id);

            if (error) {
                setError('Nu s-a putut șterge programarea. Încearcă din nou.');
                return;
            }

            // Remove the appointment from local state
            setAppointments(prev => prev.filter(apt => apt.id !== appointmentToDelete.id));
            setShowDeleteDialog(false);
            setAppointmentToDelete(null);
        } catch (err) {
            setError('A apărut o eroare neașteptată');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
        setAppointmentToDelete(null);
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmat';
            case 'requested':
                return 'Solicitat';
            case 'cancelled':
                return 'Anulat';
            case 'completed':
                return 'Finalizat';
            default:
                return 'Solicitat';
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'default';
            case 'requested':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            case 'completed':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Calendar className="w-4 h-4" />;
            case 'requested':
                return <Clock className="w-4 h-4" />;
            case 'cancelled':
                return <CalendarX className="w-4 h-4" />;
            case 'completed':
                return <Calendar className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('ro-RO', {
            timeZone: 'Europe/Bucharest',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleTimeString('ro-RO', {
            timeZone: 'Europe/Bucharest',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isPastAppointment = (dateString: string) => {
        const appointmentTime = new Date(dateString);
        const currentTime = new Date();
        return appointmentTime < currentTime;
    };

    const upcomingAppointments = appointments.filter(apt => !isPastAppointment(apt.start_time));
    const pastAppointments = appointments.filter(apt => isPastAppointment(apt.start_time));

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate(AppRoutes.ROOT);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Local Navigation Component
    const AppointmentsNavigation = () => (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:block bg-white/90 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        {/* Left: Logo/Title */}
                        <h2 className="text-xl font-bold text-gradient">Salonique</h2>
                        {/* Right: Links */}
                        <div className="flex items-center space-x-6">
                            <Button
                                variant={'ghost'}
                                onClick={() => navigate(AppRoutes.ROOT)}
                                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer rounded-full px-4 py-2"
                            >
                                <Home className="w-4 h-4" />
                                <span>Acasă</span>
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant={'ghost'}
                                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer rounded-full px-4 py-2"
                            >
                                <LockKeyhole className="w-4 h-4" />
                                <span>Ieșire</span>
                            </Button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden bg-white/90 backdrop-blur-lg border-b border-gray-100/50 sticky top-0 z-50 shadow-sm">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gradient">Salonique</h2>
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <VisuallyHidden>
                                <SheetTitle>Menu</SheetTitle>
                            </VisuallyHidden>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="rounded-full">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 p-0 bg-white">
                                <div className="flex flex-col h-full">
                                    {/* Header with user info */}
                                    <div className="bg-gradient-purple-soft border-b border-purple-100 px-6 py-6">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="w-12 h-12 ring-2 ring-purple-200 shadow-soft">
                                                <AvatarImage
                                                    src={clientInfo?.profilePicture || ""}
                                                    alt={clientInfo?.name || "User"}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-semibold">
                                                    {clientInfo?.name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-semibold text-purple-900 truncate">
                                                    {clientInfo?.name || 'Utilizator'}
                                                </h3>
                                                <p className="text-purple-700 text-sm truncate">
                                                    {clientInfo?.email || 'Email nespecificat'}
                                                </p>
                                                {clientInfo?.phone && (
                                                    <p className="text-purple-600 text-xs truncate mt-0.5">
                                                        {clientInfo.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 px-6 py-6">
                                        <div className="space-y-4">
                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    navigate(AppRoutes.ROOT);
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full justify-start rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                            >
                                                <Home className="w-5 h-5 mr-3" />
                                                Acasă
                                            </Button>

                                            {/* Current page indicator */}
                                            <div className="w-full justify-start rounded-xl bg-purple-100 text-purple-800 px-3 py-2 text-sm font-medium">
                                                <Calendar className="w-5 h-5 mr-3 inline" />
                                                Programările mele
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Statistici rapide</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Programări viitoare</span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 bg-purple-100 px-2 py-1 rounded-full">
                                                        {appointments.filter(apt => !isPastAppointment(apt.start_time)).length}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Programări finalizate</span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                                                        {appointments.filter(apt => isPastAppointment(apt.start_time)).length}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }}
                                            variant="ghost"
                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                        >
                                            <LockKeyhole className="w-5 h-5 mr-3" />
                                            Ieșire
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </>
    );

    if (loading) {
        return <PageLoader message="Încărcăm programările tale..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen w-full gradient-bg relative overflow-hidden flex items-center justify-center">
                <AppointmentsNavigation />
                <div className="max-w-2xl mx-auto px-6 py-12">
                    <div className="floating-card rounded-3xl p-12 text-center">
                        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <CalendarX className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">A apărut o eroare</h3>
                        <p className="text-red-600 mb-8 leading-relaxed">{error}</p>
                        <Button
                            onClick={fetchAppointments}
                            className="btn-gradient rounded-full px-8 py-3"
                        >
                            Încearcă din nou
                        </Button>
                    </div>
                </div>
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
                <Calendar className="w-8 h-8 text-purple-500" />
            </motion.div>

            <motion.div
                className="absolute top-24 right-16 w-20 h-20 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden md:flex backdrop-blur-sm"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <Clock className="w-10 h-10 text-gray-600" />
            </motion.div>

            <motion.div
                className="absolute bottom-32 left-20 w-12 h-12 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden lg:flex backdrop-blur-sm"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <User className="w-6 h-6 text-purple-500" />
            </motion.div>

            <AppointmentsNavigation />
            <motion.div
                className="max-w-7xl mx-auto px-6 py-16 space-y-12 relative z-10"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                {/* Hero Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto"
                    variants={staggerItem}
                >
                    <motion.h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-6"
                        variants={fadeIn}
                        transition={{ delay: 0.2 }}
                    >
                        Programările{" "}
                        <span className="text-gradient">tale</span>
                    </motion.h1>
                    <motion.p
                        className="text-lg lg:text-xl text-gray-700 leading-relaxed"
                        variants={fadeIn}
                        transition={{ delay: 0.4 }}
                    >
                        Gestionează și monitorizează toate programările tale într-un singur loc
                    </motion.p>
                </motion.div>

                {/* Empty State */}
                {appointments.length === 0 && (
                    <motion.div
                        variants={staggerItem}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="floating-card rounded-3xl p-12 text-center">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                                className="mb-8"
                            >
                                <div className="w-24 h-24 mx-auto bg-gradient-purple-soft rounded-full flex items-center justify-center mb-6">
                                    <CalendarX className="w-12 h-12 text-purple-500" />
                                </div>
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Încă nu ai programări</h3>
                            <p className="text-gray-600 mb-8 text-lg">
                                Începe prin a-ți rezerva prima programare cu unul dintre profesioniștii noștri.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                    <motion.div
                        className="space-y-8"
                        variants={staggerItem}
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                                <Calendar className="w-8 h-8 mr-3 text-purple-500" />
                                Programări viitoare
                            </h2>
                            <div className="w-24 h-1 bg-gradient-purple mx-auto rounded-full mb-2"></div>
                            <p className="text-gray-600">
                                {upcomingAppointments.length} {upcomingAppointments.length === 1 ? 'programare' : 'programări'} viitoare
                            </p>
                        </div>
                        <motion.div
                            className="grid gap-6 max-w-4xl mx-auto"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {upcomingAppointments.map((appointment, index) => (
                                <motion.div
                                    key={appointment.id}
                                    variants={staggerItem}
                                    custom={index}
                                    className="group"
                                >
                                    <div className="floating-card rounded-2xl p-4 sm:p-6 hover:shadow-purple transition-all duration-300 relative overflow-hidden">
                                        {/* Status badge */}
                                        <Badge
                                            variant={getStatusVariant(appointment.status)}
                                            className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 shadow-soft rounded-full"
                                        >
                                            {getStatusIcon(appointment.status)}
                                            <span>{getStatusText(appointment.status)}</span>
                                        </Badge>

                                        {/* Main content */}
                                        <div className="flex items-start space-x-3 sm:space-x-6 pr-16 sm:pr-24">
                                            <div className="relative flex-shrink-0">
                                                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 ring-2 sm:ring-4 ring-white shadow-soft">
                                                    <AvatarImage
                                                        src={appointment.professional.profile_image_url}
                                                        alt={appointment.professional.name}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-gradient-purple-soft text-purple-700 font-bold text-sm sm:text-lg">
                                                        {appointment.professional.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4 sm:w-6 sm:h-6" />}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                                                {/* Professional name */}
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                                                    {appointment.professional.name}
                                                </h3>

                                                {/* Date and time info */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-50/80 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs sm:text-sm text-gray-500 font-medium">Data</p>
                                                            <p className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{formatDate(appointment.start_time)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-50/80 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs sm:text-sm text-gray-500 font-medium">Ora</p>
                                                            <p className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                {(appointment.notes || appointment.public_notes) && (
                                                    <div className="bg-gradient-purple-soft rounded-xl p-4 border border-purple-100">
                                                        <p className="text-purple-800 leading-relaxed">
                                                            {appointment.public_notes || appointment.notes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Delete button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteAppointment(appointment)}
                                            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 p-2 sm:p-3 h-auto text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 shadow-soft"
                                        >
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                    <motion.div
                        className="space-y-8"
                        variants={staggerItem}
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                                <Clock className="w-8 h-8 mr-3 text-gray-500" />
                                Istoric programări
                            </h2>
                            <div className="w-24 h-1 bg-gradient-neutral mx-auto rounded-full mb-2"></div>
                            <p className="text-gray-600">
                                {pastAppointments.length} {pastAppointments.length === 1 ? 'programare finalizată' : 'programări finalizate'}
                            </p>
                        </div>
                        <motion.div
                            className="grid gap-6 max-w-4xl mx-auto"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {pastAppointments.map((appointment, index) => (
                                <motion.div
                                    key={appointment.id}
                                    variants={staggerItem}
                                    custom={index}
                                    className="group"
                                >
                                    <div className="stat-card rounded-2xl p-4 sm:p-6 relative overflow-hidden opacity-80 hover:opacity-100 transition-all duration-300">
                                        {/* Status badge */}
                                        <Badge
                                            variant="outline"
                                            className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 border-gray-300 bg-gray-50 text-gray-600 rounded-full"
                                        >
                                            {getStatusIcon('completed')}
                                            <span>Finalizat</span>
                                        </Badge>

                                        {/* Main content */}
                                        <div className="flex items-start space-x-3 sm:space-x-6">
                                            <div className="relative flex-shrink-0">
                                                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 ring-2 sm:ring-4 ring-gray-200 shadow-soft">
                                                    <AvatarImage
                                                        src={appointment.professional.profile_image_url}
                                                        alt={appointment.professional.name}
                                                        className="object-cover opacity-90"
                                                    />
                                                    <AvatarFallback className="bg-gray-100 text-gray-600 font-bold text-sm sm:text-lg">
                                                        {appointment.professional.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4 sm:w-6 sm:h-6" />}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                                                {/* Professional name */}
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-700 leading-tight">
                                                    {appointment.professional.name}
                                                </h3>

                                                {/* Date and time info */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs sm:text-sm text-gray-500 font-medium">Data</p>
                                                            <p className="font-semibold text-gray-700 text-sm sm:text-base leading-tight">{formatDate(appointment.start_time)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs sm:text-sm text-gray-500 font-medium">Ora</p>
                                                            <p className="font-semibold text-gray-700 text-sm sm:text-base leading-tight">{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                {(appointment.notes || appointment.public_notes) && (
                                                    <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                                                        <p className="text-gray-600 leading-relaxed">
                                                            {appointment.public_notes || appointment.notes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="left-4 right-4 top-[50%] translate-x-0 translate-y-[-50%] w-auto max-w-xs mx-auto rounded-xl floating-card border-none shadow-purple">
                    <AlertDialogHeader className="text-center pb-1">
                        <div className="w-6 h-6 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-1">
                            <Trash2 className="w-3 h-3 text-red-500" />
                        </div>
                        <AlertDialogTitle className="text-base font-bold text-gray-900 mb-0.5">
                            Șterge programarea
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 text-[10px]">
                            Această acțiune nu poate fi anulată.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {appointmentToDelete && (
                        <div className="space-y-1.5 py-0.5">
                            <div className="bg-gradient-purple-soft p-2 rounded-lg border border-purple-100">
                                <div className="flex items-center gap-1.5">
                                    <Avatar className="w-6 h-6 ring-1 ring-purple-200 flex-shrink-0">
                                        <AvatarImage
                                            src={appointmentToDelete.professional.profile_image_url}
                                            alt={appointmentToDelete.professional.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-[10px]">
                                            {appointmentToDelete.professional.name?.charAt(0)?.toUpperCase() || <User className="w-2 h-2" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-purple-900 text-xs mb-0.5">
                                            {appointmentToDelete.professional.name}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-0.5">
                                                <Calendar className="w-2 h-2 text-purple-600" />
                                                <span className="font-medium text-purple-800 text-[10px]">
                                                    {formatDate(appointmentToDelete.start_time)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <Clock className="w-2 h-2 text-purple-600" />
                                                <span className="font-medium text-purple-800 text-[10px]">
                                                    {formatTime(appointmentToDelete.start_time)} - {formatTime(appointmentToDelete.end_time)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-red-50 p-1.5 rounded border border-red-200 flex items-center gap-1">
                                <div className="w-3 h-3 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-600 text-[8px]">⚠️</span>
                                </div>
                                <span className="text-red-700 font-medium text-[10px]">
                                    Acțiune permanentă
                                </span>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-1.5 pt-1">
                        <AlertDialogCancel
                            onClick={handleCancelDelete}
                            disabled={isDeleting}
                            className="w-full sm:w-auto rounded-full px-3 py-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-[10px]"
                        >
                            Anulează
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 rounded-full px-3 py-1 font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-[10px]"
                        >
                            {isDeleting ? (
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    Se șterge...
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <Trash2 className="w-2 h-2" />
                                    Șterge
                                </div>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Footer />

        </motion.div>

    );
}
