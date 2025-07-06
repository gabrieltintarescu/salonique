import { AppRoutes } from '@/AppRouter';
import { PageLoader, withMinimumDelay } from "@/components/animations/LoadingComponents";
import { fadeIn, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/homepage/ui/avatar';
import { Badge } from '@/components/homepage/ui/badge';
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
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { motion } from "framer-motion";
import { Calendar, CalendarX, Clock, LockKeyhole, Menu, Trash2, User } from 'lucide-react';
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

export default function MyAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
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
                    .select('id')
                    .eq('user_id', session.user.id)
                    .single();

                if (clientError || !clientData) {
                    toast.error('Nu s-a putut găsi profilul clientului. Te rugăm să te reconectezi.');
                    handleLogout();
                    return;
                }

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
            <div className="hidden md:block bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        {/* Left: Logo/Title */}
                        <h2 className="text-lg font-semibold text-gray-900">Salonique</h2>
                        {/* Right: Links */}
                        <div className="flex items-center space-x-6">
                            <Button
                                variant={'ghost'}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer hidden"
                            >
                                <User className="w-4 h-4" />
                                <span>Profilul meu</span>
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant={'ghost'}
                                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                <LockKeyhole className="w-4 h-4" />
                                <span>Deconectează-te</span>
                            </Button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Salonique</h2>
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <VisuallyHidden>
                                <SheetTitle>Menu navigare</SheetTitle>
                            </VisuallyHidden>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="p-2">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <div className="py-6">
                                    <nav className="space-y-4">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleLogout()}
                                            className="flex items-center space-x-3 p-3 rounded-lg over:bg-gray-50 text-gray-700 font-medium cursor-pointer hidden" >
                                            <User className="w-5 h-5" />
                                            <span>Profilul meu</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleLogout()}
                                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors cursor-pointer"
                                        >
                                            <LockKeyhole className="w-5 h-5" />
                                            <span>Deconectează-te</span>
                                        </Button>
                                    </nav>
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
            <div className="min-h-screen bg-background">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardContent className="p-8 text-center">
                            <p className="text-destructive mb-6">{error}</p>
                            <Button onClick={fetchAppointments} variant="outline" className="rounded-full">
                                Încearcă din nou
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-background"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
        >
            <AppointmentsNavigation />
            <motion.div
                className="max-w-4xl mx-auto px-6 py-8 space-y-8"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    variants={staggerItem}
                >
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Programările mele</h1>
                        <p className="text-muted-foreground mt-2">Gestionează programările tale viitoare și din trecut</p>
                    </div>
                </motion.div>

                {/* Empty State */}
                {appointments.length === 0 && (
                    <motion.div variants={staggerItem}>
                        <Card className="border-dashed border-2 border-muted-foreground/20">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                                >
                                    <CalendarX className="w-16 h-16 text-muted-foreground/50 mb-6" />
                                </motion.div>
                                <h3 className="text-xl font-semibold mb-2">Încă nu ai programări</h3>
                                <p className="text-muted-foreground mb-8 max-w-md">
                                    Încă nu ai rezervat nicio programare. Începe prin a-ți rezerva prima programare cu unul dintre profesioniștii noștri.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Upcoming Appointments */}
                {upcomingAppointments.length > 0 && (
                    <motion.div
                        className="space-y-6"
                        variants={staggerItem}
                    >
                        <h2 className="text-2xl font-semibold tracking-tight flex items-center">
                            <Calendar className="w-6 h-6 mr-3" />
                            Programări viitoare ({upcomingAppointments.length})
                        </h2>
                        <motion.div
                            className="grid gap-4"
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
                                    <Card className="relative overflow-hidden border border-gray-100/60 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-gray-200/80 transition-all duration-300 rounded-lg">
                                        <CardContent className="p-6">
                                            {/* Status badge */}
                                            <Badge
                                                variant={getStatusVariant(appointment.status)}
                                                className="absolute top-4 right-4 px-3 py-1 text-xs font-medium flex items-center gap-1.5 shadow-sm"
                                            >
                                                {getStatusIcon(appointment.status)}
                                                <span>{getStatusText(appointment.status)}</span>
                                            </Badge>

                                            {/* Main content */}
                                            <div className="flex items-start space-x-4 pr-20">
                                                <Avatar className="w-14 h-14 ring-2 ring-white shadow-sm">
                                                    <AvatarImage
                                                        src={appointment.professional.profile_image_url}
                                                        alt={appointment.professional.name}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-700 font-semibold">
                                                        {appointment.professional.name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0 space-y-3">
                                                    {/* Professional name */}
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                        {appointment.professional.name}
                                                    </h3>

                                                    {/* Date and time info */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium">{formatDate(appointment.start_time)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Notes */}
                                                    {(appointment.notes || appointment.public_notes) && (
                                                        <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100">
                                                            <p className="text-sm text-gray-600 line-clamp-2">
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
                                                className="absolute bottom-4 right-4 p-3 h-auto text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 shadow-sm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                    <motion.div
                        className="space-y-6"
                        variants={staggerItem}
                    >
                        <h2 className="text-2xl font-semibold tracking-tight flex items-center">
                            <Clock className="w-6 h-6 mr-3" />
                            Programări din trecut ({pastAppointments.length})
                        </h2>
                        <motion.div
                            className="grid gap-4"
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
                                    <Card className="relative overflow-hidden border border-gray-100/40 bg-gray-50/60 backdrop-blur-sm shadow-md hover:shadow-lg hover:border-gray-200/60 transition-all duration-300 rounded-lg">
                                        <CardContent className="p-6">
                                            {/* Status badge */}
                                            <Badge
                                                variant="outline"
                                                className="absolute top-4 right-4 px-3 py-1 text-xs font-medium flex items-center gap-1.5 border-gray-300/60 bg-white/80 text-gray-600 shadow-sm"
                                            >
                                                {getStatusIcon('completed')}
                                                <span>Finalizat</span>
                                            </Badge>

                                            {/* Main content */}
                                            <div className="flex items-start space-x-4">
                                                <Avatar className="w-14 h-14 ring-2 ring-white/60 shadow-sm">
                                                    <AvatarImage
                                                        src={appointment.professional.profile_image_url}
                                                        alt={appointment.professional.name}
                                                        className="object-cover opacity-90"
                                                    />
                                                    <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-semibold">
                                                        {appointment.professional.name?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0 space-y-3">
                                                    {/* Professional name */}
                                                    <h3 className="text-lg font-semibold text-gray-700 truncate">
                                                        {appointment.professional.name}
                                                    </h3>

                                                    {/* Date and time info */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium">{formatDate(appointment.start_time)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <span>{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Notes */}
                                                    {(appointment.notes || appointment.public_notes) && (
                                                        <div className="bg-white/60 rounded-lg p-3 border border-gray-200/60">
                                                            <p className="text-sm text-gray-500 line-clamp-2">
                                                                {appointment.public_notes || appointment.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="left-4 right-4 top-[50%] translate-x-0 translate-y-[-50%] w-auto max-w-md mx-auto rounded-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Șterge programarea</AlertDialogTitle>
                        <AlertDialogDescription>
                            {appointmentToDelete && (
                                <div className="space-y-2">
                                    <p>
                                        Ești sigur că vrei să ștergi această programare?
                                    </p>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="font-semibold">
                                            👨‍💼 {appointmentToDelete.professional.name}
                                        </p>
                                        <p className="font-semibold">
                                            📅 {formatDate(appointmentToDelete.start_time)}
                                        </p>
                                        <p className="font-semibold">
                                            🕐 {formatTime(appointmentToDelete.start_time)} - {formatTime(appointmentToDelete.end_time)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium">
                                        ⚠️ Această acțiune nu poate fi anulată. ⚠️
                                    </p>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeleting}>
                            Anulează
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Se șterge...' : 'Șterge programarea'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}
