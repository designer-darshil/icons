import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GRIDFRAME_ICONS } from '../src/data/icons/gridframe-catalog';
import { ICON_CATEGORIES } from '../src/data/categories';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://gridframe.dev';

export function generateSitemapXml(): string {
  const currentDate = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/icons', changefreq: 'daily', priority: '0.9' },
    { loc: '/categories', changefreq: 'weekly', priority: '0.8' },
    { loc: '/styles', changefreq: 'weekly', priority: '0.8' },
    { loc: '/favorites', changefreq: 'monthly', priority: '0.5' },
    { loc: '/collections', changefreq: 'weekly', priority: '0.7' },
    { loc: '/about', changefreq: 'monthly', priority: '0.6' },
    { loc: '/privacy', changefreq: 'monthly', priority: '0.4' },
    { loc: '/terms', changefreq: 'monthly', priority: '0.4' },
  ];

  const categoryRoutes = ICON_CATEGORIES.map((c) => ({
    loc: `/categories/${c.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  const styleRoutes = ['regular', 'filled', 'duotone'].map((s) => ({
    loc: `/styles/${s}`,
    changefreq: 'weekly',
    priority: '0.7',
  }));

  const iconRoutes = GRIDFRAME_ICONS.map((icon) => ({
    loc: `/icons/${icon.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
  }));

  const allUrls = [
    ...staticRoutes,
    ...categoryRoutes,
    ...styleRoutes,
    ...iconRoutes,
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const url of allUrls) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${url.loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

const sitemapContent = generateSitemapXml();
const targetPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(targetPath, sitemapContent, 'utf-8');
console.log(`✅ Sitemap generated at ${targetPath} with ${GRIDFRAME_ICONS.length + 25} URLs.`);
