
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SitemapPage = () => {
  const [sitemapData, setSitemapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isXmlRoute = location.pathname === '/sitemap.xml';

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        const response = await fetch('/sitemap.json');
        const data = await response.json();
        setSitemapData(data);
        
        if (isXmlRoute) {
          // Generate XML sitemap
          const xmlContent = generateXmlSitemap(data);
          
          // Set proper content type and serve XML
          const blob = new Blob([xmlContent], { type: 'application/xml' });
          const url = URL.createObjectURL(blob);
          
          // For XML route, we'll display the XML content
          document.documentElement.innerHTML = `
            <pre style="font-family: monospace; white-space: pre-wrap; margin: 20px;">
              ${escapeHtml(xmlContent)}
            </pre>
          `;
        }
      } catch (error) {
        console.error('Error loading sitemap:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, [isXmlRoute]);

  const generateXmlSitemap = (data: any) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    data.urls.forEach((url: any) => {
      xml += '  <url>\n';
      xml += `    <loc>${url.url}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  if (loading) {
    return <div className="p-4">Loading sitemap...</div>;
  }

  if (isXmlRoute) {
    // XML content is handled in useEffect
    return null;
  }

  // For JSON route, return the JSON data
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Sitemap</h1>
        <pre className="bg-white p-4 rounded shadow overflow-auto">
          {JSON.stringify(sitemapData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default SitemapPage;
