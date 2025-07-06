import { useCallback } from 'react';
import { toast } from 'sonner';
import { translateError, translateSupabaseError } from '../utils/errorTranslations';

/**
 * Custom hook for handling errors with Romanian translations
 */
export const useErrorHandler = () => {
    const handleError = useCallback((error: any, customMessage?: string, title: string = 'Eroare') => {
        const translatedMessage = translateError(error, customMessage);

        toast(title, {
            description: translatedMessage,
        });
    }, []);

    const handleSupabaseError = useCallback((error: any, customMessage?: string, title: string = 'Eroare') => {
        const translatedMessage = translateSupabaseError(error) || customMessage || 'A apărut o eroare neașteptată';

        toast(title, {
            description: translatedMessage,
        });
    }, []);

    const handleSuccess = useCallback((message: string, title: string = 'Succes') => {
        toast(title, {
            description: message,
        });
    }, []);

    return {
        handleError,
        handleSupabaseError,
        handleSuccess,
        translateError,
        translateSupabaseError
    };
};
