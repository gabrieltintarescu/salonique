import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOData {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
}

export const useSEO = (seoData: SEOData) => {
    const location = useLocation();

    useEffect(() => {
        // Update page title
        document.title = seoData.title;

        // Update meta description
        updateMetaTag('description', seoData.description);

        // Update meta keywords if provided
        if (seoData.keywords) {
            updateMetaTag('keywords', seoData.keywords);
        }

        // Update canonical URL
        const canonicalUrl = seoData.url || `${window.location.origin}${location.pathname}`;
        updateLinkTag('canonical', canonicalUrl);

        // Update Open Graph tags
        updateMetaProperty('og:title', seoData.title);
        updateMetaProperty('og:description', seoData.description);
        updateMetaProperty('og:url', canonicalUrl);
        updateMetaProperty('og:type', seoData.type || 'website');

        if (seoData.image) {
            updateMetaProperty('og:image', seoData.image);
            updateMetaProperty('og:image:alt', seoData.title);
        }

        // Update Twitter Card tags
        updateMetaName('twitter:card', 'summary_large_image');
        updateMetaName('twitter:title', seoData.title);
        updateMetaName('twitter:description', seoData.description);

        if (seoData.image) {
            updateMetaName('twitter:image', seoData.image);
        }

        // Update article-specific tags if applicable
        if (seoData.author) {
            updateMetaProperty('article:author', seoData.author);
        }

        if (seoData.publishedTime) {
            updateMetaProperty('article:published_time', seoData.publishedTime);
        }

        if (seoData.modifiedTime) {
            updateMetaProperty('article:modified_time', seoData.modifiedTime);
        }

        if (seoData.section) {
            updateMetaProperty('article:section', seoData.section);
        }

        if (seoData.tags) {
            // Remove existing article:tag meta tags
            removeMetaProperty('article:tag');
            // Add new tags
            seoData.tags.forEach(tag => {
                addMetaProperty('article:tag', tag);
            });
        }

    }, [seoData, location.pathname]);
};

const updateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;

    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }

    meta.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;

    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
    }

    meta.content = content;
};

const updateMetaName = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;

    if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
    }

    meta.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

    if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
    }

    link.href = href;
};

const removeMetaProperty = (property: string) => {
    const metas = document.querySelectorAll(`meta[property="${property}"]`);
    metas.forEach(meta => meta.remove());
};

const addMetaProperty = (property: string, content: string) => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.content = content;
    document.head.appendChild(meta);
};
