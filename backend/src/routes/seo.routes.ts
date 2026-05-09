import { Router } from 'express';
import { Product } from '../models/Product.model';
import { Category } from '../models/Category.model';

const router = Router();

const generateSitemap = async () => {
    const products = await Product.find({ isActive: true }).select('slug updatedAt');
    const categories = await Category.find({ isActive: true }).select('slug updatedAt');

    const baseUrl = process.env.FRONTEND_URL || 'https://sarvicreation.com';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Home
    xml += `  <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
    
    // Static Pages
    const staticPages = ['products', 'about', 'contact', 'experience'];
    staticPages.forEach(page => {
        xml += `  <url><loc>${baseUrl}/${page}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    });

    // Categories
    categories.forEach(cat => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
        xml += `    <lastmod>${cat.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
    });

    // Products
    products.forEach(prod => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/product/${prod.slug}</loc>\n`;
        xml += `    <lastmod>${prod.updatedAt.toISOString().split('T')[0]}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;
        xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
};

// Original path: /api/seo/sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
    try {
        const xml = await generateSitemap();
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
});

export default router;
