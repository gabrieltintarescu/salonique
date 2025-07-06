import { insertStructuredData, removeStructuredData } from '@/utils/structuredData';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'profile' | 'business.business';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    structuredData?: object | object[];
    noIndex?: boolean;
    noFollow?: boolean;
    canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
    structuredData,
    noIndex = false,
    noFollow = false,
    canonical
}) => {
    const location = useLocation();
    const baseUrl = window.location.origin;
    const currentUrl = url || `${baseUrl}${location.pathname}`;
    const canonicalUrl = canonical || currentUrl;

    // Default image if none provided
    const defaultImage = `${baseUrl}/og-image.jpg`;
    const ogImage = image || defaultImage;

    // Construct robots content
    const robotsContent = [];
    if (noIndex) robotsContent.push('noindex');
    if (noFollow) robotsContent.push('nofollow');
    const robots = robotsContent.length > 0 ? robotsContent.join(', ') : 'index, follow';

    useEffect(() => {
        // Handle structured data
        if (structuredData) {
            if (Array.isArray(structuredData)) {
                structuredData.forEach((data, index) => {
                    insertStructuredData(data, `structured-data-${index}`);
                });
            } else {
                insertStructuredData(structuredData, 'structured-data');
            }
        }

        // Cleanup structured data on unmount
        return () => {
            if (structuredData) {
                if (Array.isArray(structuredData)) {
                    structuredData.forEach((_, index) => {
                        removeStructuredData(`structured-data-${index}`);
                    });
                } else {
                    removeStructuredData('structured-data');
                }
            }
        };
    }, [structuredData]);

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={title} />
            <meta property="og:site_name" content="Salonique" />
            <meta property="og:locale" content="ro_RO" />

            {/* Article specific Open Graph tags */}
            {author && <meta property="article:author" content={author} />}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {section && <meta property="article:section" content={section} />}
            {tags && tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Additional meta tags */}
            <meta name="format-detection" content="telephone=no" />
            <meta name="theme-color" content="#000000" />
        </Helmet>
    );
};

export default SEO;
