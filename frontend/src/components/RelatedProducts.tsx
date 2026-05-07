import { useEffect, useState } from 'react';
import api from '../lib/api';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
    currentProductId: string;
    categorySlug: string;
}

export default function RelatedProducts({ currentProductId, categorySlug }: RelatedProductsProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const { data } = await api.get(`/products?category=${categorySlug}&limit=5`);
                // Filter out the current product
                const filtered = data.products.filter((p: any) => p._id !== currentProductId).slice(0, 4);
                setProducts(filtered);
            } catch (error) {
                console.error('Error fetching related products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categorySlug) {
            fetchRelated();
        }
    }, [currentProductId, categorySlug]);

    if (loading) return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-sm" />
            ))}
        </div>
    );

    if (products.length === 0) return null;

    return (
        <section className="space-y-12 pt-20 border-t border-gray-100">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-4">
                    <span className="h-px w-8 bg-gray-200"></span>
                    <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">You May Also Like</span>
                    <span className="h-px w-8 bg-gray-200"></span>
                </div>
                <h2 className="text-3xl lg:text-5xl font-serif text-gray-900 tracking-tight uppercase">
                    Complete The Look
                </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}
