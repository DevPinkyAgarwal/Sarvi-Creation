import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MetaTags from '../components/MetaTags';
import { ShieldCheck, Truck, RefreshCcw, ScrollText, Sparkles } from 'lucide-react';

const LEGAL_CONTENT: Record<string, any> = {
    'shipping': {
        title: 'Shipping Info',
        icon: Truck,
        content: `
            <p>At Sarvi Creation, we ensure that your precious pieces reach you with the utmost care and security. Every shipment is fully insured and handled by our premium logistics partners.</p>
            <h3>Domestic Shipping (India)</h3>
            <ul>
                <li>Complimentary insured shipping on all prepaid orders across India.</li>
                <li>Delivery timeline: 3-7 business days for ready-to-ship items.</li>
                <li>Bespoke or custom orders may take 15-20 business days for craftsmanship and delivery.</li>
            </ul>
            <h3>International Shipping</h3>
            <ul>
                <li>We ship to over 50 countries globally. International shipping rates are calculated at checkout.</li>
                <li>Delivery timeline: 7-14 business days.</li>
                <li>Please note that custom duties or local taxes are to be borne by the recipient.</li>
            </ul>
        `
    },
    'returns': {
        title: 'Returns & Exchanges',
        icon: RefreshCcw,
        content: `
            <p>We take immense pride in our craftsmanship. However, if you are not entirely satisfied with your purchase, we are here to help.</p>
            <h3>Return Policy</h3>
            <ul>
                <li>Items must be returned within 14 days of delivery.</li>
                <li>The jewelry must be in its original, unworn condition with all security tags and original packaging intact.</li>
                <li>Custom-made or engraved pieces are not eligible for returns.</li>
            </ul>
            <h3>Exchange Process</h3>
            <ul>
                <li>You may exchange your piece for any other item of equal or higher value.</li>
                <li>Contact our concierge at care@sarvicreation.com to initiate an exchange.</li>
            </ul>
        `
    },
    'privacy': {
        title: 'Privacy Policy',
        icon: ShieldCheck,
        content: `
            <p>Your privacy is of paramount importance to Sarvi Creation. This policy outlines how we handle your personal data.</p>
            <h3>Data Collection</h3>
            <ul>
                <li>We collect information you provide during checkout, account creation, or newsletter subscription.</li>
                <li>This includes name, email, shipping address, and phone number.</li>
            </ul>
            <h3>Data Usage</h3>
            <ul>
                <li>Your data is used solely for order fulfillment, customer support, and personalized communications.</li>
                <li>We do not sell or share your personal information with third-party marketers.</li>
            </ul>
            <h3>Security</h3>
            <ul>
                <li>We use industry-standard SSL encryption to protect your data during transmission.</li>
            </ul>
        `
    },
    'terms': {
        title: 'Terms of Service',
        icon: ScrollText,
        content: `
            <p>By accessing and using the Sarvi Creation website, you agree to the following terms and conditions.</p>
            <h3>Website Usage</h3>
            <ul>
                <li>The content on this website is for your personal, non-commercial use.</li>
                <li>All designs, logos, and imagery are the intellectual property of Sarvi Creation Private Limited.</li>
            </ul>
            <h3>Pricing & Availability</h3>
            <ul>
                <li>We strive for accuracy in pricing, but reserves the right to correct errors or update information at any time.</li>
                <li>Order acceptance is subject to availability and verification.</li>
            </ul>
            <h3>Governing Law</h3>
            <ul>
                <li>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai.</li>
            </ul>
        `
    },
    'care-guide': {
        title: 'Care Guide',
        icon: Sparkles,
        content: `
            <p>Fine jewelry is meant to last a lifetime. Proper care ensures that your Sarvi Creation pieces maintain their brilliance for generations.</p>
            <h3>General Care</h3>
            <ul>
                <li>Store each piece separately in its original Sarvi pouch to prevent scratching.</li>
                <li>Remove jewelry before swimming, exercising, or applying lotions and perfumes.</li>
            </ul>
            <h3>Cleaning Tips</h3>
            <ul>
                <li>For gold and diamonds, use a soft-bristled brush and mild soapy water. Rinse thoroughly and pat dry with a lint-free cloth.</li>
                <li>We recommend professional servicing once a year to check for loose settings or wear.</li>
            </ul>
        `
    }
};

export default function LegalPage() {
    const { slug } = useParams();
    const pageData = LEGAL_CONTENT[slug || 'privacy'];

    if (!pageData) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <h2 className="text-3xl font-serif">Page Not Found</h2>
                <Link to="/" className="text-sm border-b border-black pb-1 uppercase tracking-widest font-bold">Back to Home</Link>
            </div>
        );
    }

    const Icon = pageData.icon;

    return (
        <div className="min-h-screen bg-white">
            <MetaTags title={`${pageData.title} | Sarvi Creation`} />
            
            <div className="max-w-[1000px] mx-auto px-6 sm:px-10 py-20 lg:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-16"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center text-gray-900">
                            <Icon className="w-6 h-6 stroke-[1.2]" />
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 tracking-tight uppercase">
                                {pageData.title}
                            </h1>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">Sarvi Creation Private Limited</p>
                        </div>
                        <div className="w-12 h-px bg-gray-200" />
                    </div>

                    {/* Content */}
                    <div 
                        className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-normal prose-h3:text-2xl prose-h3:mt-12 prose-p:text-gray-600 prose-p:font-light prose-p:leading-relaxed prose-li:text-gray-600 prose-li:font-light prose-li:mb-2"
                        dangerouslySetInnerHTML={{ __html: pageData.content }}
                    />

                    {/* Footer Note */}
                    <div className="pt-20 border-t border-gray-100 flex flex-col items-center text-center space-y-4">
                        <p className="text-sm text-gray-400 font-light italic">
                            Have more questions? Our concierge is available 24/7.
                        </p>
                        <Link to="/contact" className="text-[10px] font-bold uppercase tracking-[0.3em] text-black border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
