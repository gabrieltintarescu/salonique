export interface BusinessStructuredData {
    name: string;
    description: string;
    url: string;
    telephone?: string;
    email?: string;
    address?: {
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
    };
    openingHours?: string[];
    priceRange?: string;
    image?: string[];
    sameAs?: string[];
}

export interface ServiceStructuredData {
    name: string;
    description: string;
    provider: {
        name: string;
        url: string;
    };
    areaServed?: string;
    serviceType?: string;
    url?: string;
}

export interface AppointmentStructuredData {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    location?: {
        name: string;
        address: string;
    };
    organizer?: {
        name: string;
        url: string;
    };
    offers?: {
        price: string;
        priceCurrency: string;
        availability: string;
    };
}

export const generateBusinessStructuredData = (data: BusinessStructuredData) => {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": data.url,
        "name": data.name,
        "description": data.description,
        "url": data.url,
        "telephone": data.telephone,
        "email": data.email,
        "address": data.address ? {
            "@type": "PostalAddress",
            "streetAddress": data.address.streetAddress,
            "addressLocality": data.address.addressLocality,
            "addressRegion": data.address.addressRegion,
            "postalCode": data.address.postalCode,
            "addressCountry": data.address.addressCountry
        } : undefined,
        "openingHours": data.openingHours,
        "priceRange": data.priceRange,
        "image": data.image,
        "sameAs": data.sameAs
    };
};

export const generateServiceStructuredData = (data: ServiceStructuredData) => {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": data.name,
        "description": data.description,
        "provider": {
            "@type": "Organization",
            "name": data.provider.name,
            "url": data.provider.url
        },
        "areaServed": data.areaServed,
        "serviceType": data.serviceType,
        "url": data.url
    };
};

export const generateAppointmentStructuredData = (data: AppointmentStructuredData) => {
    return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": data.name,
        "description": data.description,
        "startDate": data.startDate,
        "endDate": data.endDate,
        "location": data.location ? {
            "@type": "Place",
            "name": data.location.name,
            "address": data.location.address
        } : undefined,
        "organizer": data.organizer ? {
            "@type": "Organization",
            "name": data.organizer.name,
            "url": data.organizer.url
        } : undefined,
        "offers": data.offers ? {
            "@type": "Offer",
            "price": data.offers.price,
            "priceCurrency": data.offers.priceCurrency,
            "availability": data.offers.availability
        } : undefined
    };
};

export const generateWebsiteStructuredData = (siteUrl: string, siteName: string) => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "url": siteUrl,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
};

export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{ name: string; url: string }>) => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
        }))
    };
};

export const insertStructuredData = (data: object, id?: string) => {
    const scriptId = id || 'structured-data';

    // Remove existing script if it exists
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
        existingScript.remove();
    }

    // Create new script
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
};

export const removeStructuredData = (id: string) => {
    const script = document.getElementById(id);
    if (script) {
        script.remove();
    }
};
