import {
    generateBreadcrumbStructuredData,
    generateBusinessStructuredData,
    generateServiceStructuredData,
    generateWebsiteStructuredData
} from '@/utils/structuredData';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://salonique.com';

export const defaultSEO = {
    siteName: 'Salonique',
    siteDescription: 'Platforma completă pentru gestionarea programărilor în saloane de înfrumusețare și servicii profesionale. Programează-te rapid și ușor, gestionează clienții și optimizează activitatea.',
    defaultTitle: 'Salonique - Gestionarea Programărilor pentru Saloane și Servicii Profesionale',
    titleTemplate: '%s | Salonique',
    defaultImage: `${baseUrl}/og-image.jpg`,
    siteUrl: baseUrl,
    language: 'ro',
    locale: 'ro_RO',
    type: 'website'
};

export const seoConfigs = {
    home: {
        title: 'Salonique - Soluția Completă pentru Gestionarea Programărilor',
        description: 'Platformă modernă pentru gestionarea programărilor în saloane de înfrumusețare. Programează-te rapid, gestionează clienții și optimizează-ți activitatea. Totul într-un singur loc!',
        keywords: 'programări salon, gestionare clienți, rezervări online, salon management, programări coafor, programări frumusețe, servicii profesionale',
        structuredData: [
            generateWebsiteStructuredData(baseUrl, 'Salonique'),
            generateBusinessStructuredData({
                name: 'Salonique',
                description: 'Platforma completă pentru gestionarea programărilor în saloane de înfrumusețare și servicii profesionale',
                url: baseUrl,
                priceRange: '$$',
                image: [`${baseUrl}/og-image.jpg`],
                sameAs: [
                    // Add social media URLs when available
                ]
            })
        ]
    },

    clientLogin: {
        title: 'Conectare Clienți - Accesează Contul Tău',
        description: 'Conectează-te la contul tău Salonique pentru a vedea programările, a face rezervări noi și a gestiona profilul personal.',
        keywords: 'conectare client, login salon, cont personal, programări online',
        noIndex: true // Login pages shouldn't be indexed
    },

    clientRegister: {
        title: 'Înregistrare Clienți - Creează Cont Nou',
        description: 'Creează un cont nou pe Salonique pentru a putea face programări online la saloanele tale preferate și a gestiona rezervările.',
        keywords: 'înregistrare client, cont nou salon, register client',
        noIndex: true
    },

    professionalLogin: {
        title: 'Conectare Profesioniști - Accesează Dashboard-ul',
        description: 'Conectează-te la contul de profesionist pentru a gestiona programările, clienții și serviciile oferite.',
        keywords: 'conectare profesionist, login salon owner, dashboard management',
        noIndex: true
    },

    professionalRegister: {
        title: 'Înregistrare Profesioniști - Alătură-te Platformei',
        description: 'Înregistrează-te ca profesionist pe Salonique și începe să gestionezi programările și clienții în mod eficient.',
        keywords: 'înregistrare profesionist, salon registration, business account',
        noIndex: true
    },

    dashboard: {
        title: 'Dashboard Profesionist - Gestionează Activitatea',
        description: 'Vizualizează și gestionează toate programările, clienții și serviciile dintr-un singur loc. Dashboard complet pentru profesioniști.',
        keywords: 'dashboard salon, management programări, gestionare clienți',
        noIndex: true // Private area
    },

    appointments: {
        title: 'Programările Mele - Vizualizează și Gestionează Rezervările',
        description: 'Vezi toate programările tale, modifică rezervările existente și programează-te la servicii noi.',
        keywords: 'programările mele, rezervări salon, istoric programări',
        noIndex: true // Private area
    },

    requestAppointment: {
        title: 'Solicită Programare - Rezervă Servicii Profesionale',
        description: 'Programează-te rapid la serviciile tale preferate. Alege data, ora și tipul de serviciu dorit.',
        keywords: 'programare nouă, rezervare salon, booking servicii',
        structuredData: [
            generateServiceStructuredData({
                name: 'Servicii de Programare Online',
                description: 'Sistem de rezervări online pentru saloane de înfrumusețare și servicii profesionale',
                provider: {
                    name: 'Salonique',
                    url: baseUrl
                },
                serviceType: 'Appointment Booking',
                areaServed: 'România'
            })
        ]
    },

    profile: {
        title: 'Profilul Meu - Gestionează Informațiile Personale',
        description: 'Actualizează informațiile profilului, preferințele și setările contului tău.',
        keywords: 'profil client, setări cont, informații personale',
        noIndex: true // Private area
    },

    notFound: {
        title: 'Pagina Nu A Fost Găsită - 404',
        description: 'Pagina pe care o căutați nu există. Reveniți la pagina principală pentru a explora serviciile disponibile.',
        keywords: '404, pagina nu există, eroare',
        noIndex: true
    }
};

export const generatePageBreadcrumbs = (pathname: string) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Acasă', url: baseUrl }];

    let currentPath = '';
    pathSegments.forEach(segment => {
        currentPath += `/${segment}`;

        // Map segments to readable names
        const segmentNames: Record<string, string> = {
            'appointments': 'Programări',
            'profile': 'Profil',
            'dashboard': 'Dashboard',
            'request': 'Solicită Programare',
            'client': 'Client',
            'professional': 'Profesionist',
            'login': 'Conectare',
            'register': 'Înregistrare'
        };

        const name = segmentNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ name, url: `${baseUrl}${currentPath}` });
    });

    return generateBreadcrumbStructuredData(breadcrumbs);
};
