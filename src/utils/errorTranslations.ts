/**
 * Translates Supabase error messages from English to Romanian
 * @param error - The error object from Supabase
 * @returns Translated error message in Romanian
 */
export const translateSupabaseError = (error: any): string => {
    const errorMessage = error?.message?.toLowerCase() || '';

    const translations: Record<string, string> = {
        // Authentication errors
        'invalid login credentials': 'Date de autentificare invalide',
        'invalid email or password': 'Email sau parolă invalidă',
        'email not confirmed': 'Email-ul nu a fost confirmat',
        'user not found': 'Utilizatorul nu a fost găsit',
        'password should be at least 6 characters': 'Parola trebuie să aibă cel puțin 6 caractere',
        'email already registered': 'Email-ul este deja înregistrat',
        'signup disabled': 'Înregistrarea este dezactivată',
        'email rate limit exceeded': 'Limita de email-uri depășită',
        'invalid refresh token': 'Token de reîmprospătare invalid',
        'session expired': 'Sesiunea a expirat',
        'user already registered': 'Utilizatorul este deja înregistrat',
        'weak password': 'Parola este prea slabă',
        'invalid email': 'Email invalid',
        'password too short': 'Parola este prea scurtă',
        'email already exists': 'Email-ul există deja',
        'phone already exists': 'Numărul de telefon există deja',
        'invalid phone': 'Număr de telefon invalid',

        // Database errors
        'duplicate key value violates unique constraint': 'Această înregistrare există deja',
        'foreign key constraint': 'Referință invalidă la date existente',
        'not null violation': 'Câmpurile obligatorii nu pot fi goale',
        'check constraint': 'Datele introduse nu respectă restricțiile',
        'permission denied': 'Nu aveți permisiunea să accesați această resursă',
        'row level security': 'Nu aveți permisiunea să accesați aceste date',

        // Network and server errors
        'network error': 'Eroare de rețea',
        'fetch error': 'Eroare de conexiune',
        'timeout': 'Timpul de așteptare a expirat',
        'unauthorized': 'Neautorizat',
        'forbidden': 'Interzis',
        'not found': 'Nu a fost găsit',
        'internal server error': 'Eroare internă de server',
        'service unavailable': 'Serviciul nu este disponibil',
        'bad gateway': 'Eroare de gateway',
        'gateway timeout': 'Timeout la gateway',

        // Database connection errors
        'connection refused': 'Conexiunea a fost refuzată',
        'connection timeout': 'Timeout la conexiune',
        'database unavailable': 'Baza de date nu este disponibilă',

        // Generic errors
        'something went wrong': 'Ceva nu a mers bine',
        'an error occurred': 'A apărut o eroare',
        'unexpected error': 'Eroare neașteptată',
        'invalid request': 'Cerere invalidă',
        'bad request': 'Cerere invalidă',
        'invalid data': 'Date invalide',
        'missing required field': 'Câmp obligatoriu lipsă',
        'invalid format': 'Format invalid',

        // Custom application errors
        'appointment conflict': 'Conflict de programare',
        'time slot unavailable': 'Intervalul de timp nu este disponibil',
        'professional not found': 'Specialistul nu a fost găsit',
        'client not found': 'Clientul nu a fost găsit',
        'appointment not found': 'Programarea nu a fost găsită',
        'invalid time slot': 'Interval de timp invalid',
        'past date not allowed': 'Nu se pot face programări în trecut',
    };

    // Check for exact matches first
    for (const [english, romanian] of Object.entries(translations)) {
        if (errorMessage.includes(english)) {
            return romanian;
        }
    }

    // Check for partial matches for common patterns
    if (errorMessage.includes('rate limit')) {
        return 'Prea multe încercări. Vă rugăm să așteptați și să încercați din nou.';
    }

    if (errorMessage.includes('constraint') || errorMessage.includes('violate')) {
        return 'Datele introduse nu sunt valide sau există deja în sistem.';
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        return 'Timpul de așteptare a expirat. Vă rugăm să încercați din nou.';
    }

    if (errorMessage.includes('connection') || errorMessage.includes('network')) {
        return 'Probleme de conexiune. Verificați conexiunea la internet și încercați din nou.';
    }

    if (errorMessage.includes('permission') || errorMessage.includes('unauthorized') || errorMessage.includes('forbidden')) {
        return 'Nu aveți permisiunea să efectuați această acțiune.';
    }

    // Return original message if no translation found, but make it more user-friendly
    const originalMessage = error?.message || 'A apărut o eroare neașteptată';

    // If it's a technical error message, provide a generic user-friendly message
    if (originalMessage.length > 100 || originalMessage.includes('Error:') || originalMessage.includes('Exception:')) {
        return 'A apărut o eroare tehnică. Vă rugăm să încercați din nou sau să contactați suportul.';
    }

    return originalMessage;
};

/**
 * Translates any error to Romanian with optional fallback message
 * @param error - The error object or string
 * @param fallbackMessage - Optional custom fallback message
 * @returns Translated error message in Romanian
 */
export const translateError = (error: any, fallbackMessage?: string): string => {
    if (typeof error === 'string') {
        return translateSupabaseError({ message: error });
    }

    if (error?.message) {
        return translateSupabaseError(error);
    }

    return fallbackMessage || 'A apărut o eroare neașteptată';
};
