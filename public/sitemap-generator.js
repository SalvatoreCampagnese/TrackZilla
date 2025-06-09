
// Sitemap generator script for TrackZilla
// Run this script to generate sitemap.xml

const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://trackzilla.cv';
const LAST_MOD = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
const CHANGE_FREQ = 'weekly'; // Set crawler frequency to weekly as requested
const PRIORITY_HOME = '1.0';
const PRIORITY_MAIN = '0.8';

// Define all pages/routes in your application
const routes = [
  {
    url: '/',
    priority: PRIORITY_HOME,
    changefreq: CHANGE_FREQ
  }
  // Add more routes here when you create new pages
  // Example:
  // {
  //   url: '/about',
  //   priority: PRIORITY_MAIN,
  //   changefreq: CHANGE_FREQ
  // }
];

// Generate sitemap XML content
function generateSitemap() {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${DOMAIN}${route.url}</loc>\n`;
    sitemap += `    <lastmod>${LAST_MOD}</lastmod>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  return sitemap;
}

// Write sitemap to file
function writeSitemap() {
  const sitemapContent = generateSitemap();
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('✅ Sitemap generated successfully at:', sitemapPath);
  console.log('📅 Last modified:', LAST_MOD);
  console.log('🔄 Change frequency:', CHANGE_FREQ);
  console.log('🌐 Domain:', DOMAIN);
}

// Generate JSON version for /sitemap endpoint
function generateSitemapJson() {
  const sitemapData = {
    domain: DOMAIN,
    lastModified: LAST_MOD,
    changeFrequency: CHANGE_FREQ,
    urls: routes.map(route => ({
      url: `${DOMAIN}${route.url}`,
      lastmod: LAST_MOD,
      changefreq: route.changefreq,
      priority: route.priority
    }))
  };
  
  const jsonPath = path.join(__dirname, 'sitemap.json');
  fs.writeFileSync(jsonPath, JSON.stringify(sitemapData, null, 2), 'utf8');
  console.log('✅ Sitemap JSON generated successfully at:', jsonPath);
}

// Run the generator
if (require.main === module) {
  writeSitemap();
  generateSitemapJson();
}

module.exports = { generateSitemap, writeSitemap, generateSitemapJson };
