// SEO Testing and Validation Utilities

/**
 * Test SEO implementation in browser console
 * Run this in the browser console to validate SEO setup
 */
export const testSEO = () => {
    console.group('🔍 SEO Validation Report');

    // Test basic meta tags
    console.group('📋 Meta Tags');
    const requiredMeta = [
        'title',
        'description',
        'viewport',
        'robots',
        'og:title',
        'og:description',
        'og:type',
        'og:url',
        'og:image',
        'twitter:card',
        'twitter:title',
        'twitter:description'
    ];

    requiredMeta.forEach(tag => {
        let element;
        if (tag === 'title') {
            element = document.querySelector('title');
            console.log(`✅ ${tag}: ${element?.textContent || 'MISSING'}`);
        } else {
            element = document.querySelector(`meta[name="${tag}"], meta[property="${tag}"]`);
            const content = element?.getAttribute('content');
            console.log(`${content ? '✅' : '❌'} ${tag}: ${content || 'MISSING'}`);
        }
    });
    console.groupEnd();

    // Test structured data
    console.group('🏗️ Structured Data');
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    console.log(`Found ${structuredDataScripts.length} structured data scripts`);

    structuredDataScripts.forEach((script, index) => {
        try {
            const data = JSON.parse(script.textContent || '');
            console.log(`📊 Script ${index + 1}:`, data);

            if (!data['@context']) console.warn(`⚠️ Script ${index + 1} missing @context`);
            if (!data['@type']) console.warn(`⚠️ Script ${index + 1} missing @type`);
        } catch (error) {
            console.error(`❌ Script ${index + 1} invalid JSON:`, error);
        }
    });
    console.groupEnd();

    // Test canonical URL
    console.group('🔗 Canonical URL');
    const canonical = document.querySelector('link[rel="canonical"]');
    console.log(`${canonical ? '✅' : '❌'} Canonical: ${canonical?.getAttribute('href') || 'MISSING'}`);
    console.groupEnd();

    // Test page performance basics
    console.group('⚡ Performance');
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');

    console.log(`📏 Title length: ${title.length}/60 ${title.length > 60 ? '❌' : '✅'}`);
    if (description) {
        console.log(`📏 Description length: ${description.length}/160 ${description.length > 160 ? '❌' : description.length < 120 ? '⚠️' : '✅'}`);
    } else {
        console.log('❌ No description found');
    }
    console.groupEnd();

    console.groupEnd();

    return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        structuredDataCount: structuredDataScripts.length
    };
};

// Add to window for easy access in browser console
if (typeof window !== 'undefined') {
    (window as any).testSEO = testSEO;
}

/**
 * Generate SEO report for current page
 */
export const generateSEOReport = () => {
    const report = {
        url: window.location.href,
        title: document.title,
        titleLength: document.title.length,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        descriptionLength: document.querySelector('meta[name="description"]')?.getAttribute('content')?.length || 0,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
        ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
        twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
        structuredData: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(script => {
            try {
                return JSON.parse(script.textContent || '');
            } catch {
                return null;
            }
        }).filter(Boolean),
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
        language: document.documentElement.lang,
        charset: document.charset,
        viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content')
    };

    return report;
};

/**
 * SEO recommendations based on current page
 */
export const getSEORecommendations = () => {
    const recommendations = [];

    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');

    if (!title || title.length === 0) {
        recommendations.push('❌ Add a page title');
    } else if (title.length > 60) {
        recommendations.push(`⚠️ Shorten title (${title.length}/60 characters)`);
    }

    if (!description) {
        recommendations.push('❌ Add a meta description');
    } else if (description.length > 160) {
        recommendations.push(`⚠️ Shorten description (${description.length}/160 characters)`);
    } else if (description.length < 120) {
        recommendations.push(`⚠️ Expand description (${description.length}/120-160 characters)`);
    }

    if (!document.querySelector('link[rel="canonical"]')) {
        recommendations.push('❌ Add canonical URL');
    }

    if (!document.querySelector('meta[property="og:image"]')) {
        recommendations.push('⚠️ Add Open Graph image');
    }

    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    if (structuredData.length === 0) {
        recommendations.push('⚠️ Consider adding structured data');
    }

    const h1 = document.querySelectorAll('h1');
    if (h1.length === 0) {
        recommendations.push('❌ Add an H1 heading');
    } else if (h1.length > 1) {
        recommendations.push('⚠️ Use only one H1 per page');
    }

    if (recommendations.length === 0) {
        recommendations.push('✅ All basic SEO requirements met!');
    }

    return recommendations;
};

// Console commands for easy testing
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔍 SEO Testing Tools Available:');
    console.log('- testSEO() - Run complete SEO validation');
    console.log('- generateSEOReport() - Get detailed SEO report');
    console.log('- getSEORecommendations() - Get improvement suggestions');
}
