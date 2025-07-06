export interface SitemapUrl {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
    const urlEntries = urls.map(url => {
        return `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

export const sitemapUrls: SitemapUrl[] = [
    {
        loc: 'https://salonique.com/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 1.0
    },
    {
        loc: 'https://salonique.com/client/login',
        changefreq: 'monthly',
        priority: 0.3
    },
    {
        loc: 'https://salonique.com/client/register',
        changefreq: 'monthly',
        priority: 0.3
    },
    {
        loc: 'https://salonique.com/professional/login',
        changefreq: 'monthly',
        priority: 0.3
    },
    {
        loc: 'https://salonique.com/professional/register',
        changefreq: 'monthly',
        priority: 0.5
    }
];

// Generate and save sitemap (this would typically be done at build time)
export const saveSitemap = () => {
    const sitemapXml = generateSitemap(sitemapUrls);

    // In a real application, you would save this to public/sitemap.xml
    // For now, we'll just return it
    return sitemapXml;
};
