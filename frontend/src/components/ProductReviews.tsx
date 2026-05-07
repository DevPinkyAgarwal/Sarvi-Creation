import { Star, User, ThumbsUp } from 'lucide-react';

const MOCK_REVIEWS = [
    {
        id: 1,
        user: 'Aria Sharma',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Absolutely stunning piece. The craftsmanship is beyond words. It looks even more beautiful in person.',
        likes: 12
    },
    {
        id: 2,
        user: 'Rohan Mehra',
        rating: 4,
        date: '1 month ago',
        comment: 'Great quality and fast delivery. The packaging was very premium. My wife loved it!',
        likes: 5
    }
];

export default function ProductReviews({ product }: { product: any }) {
    return (
        <section className="space-y-16 py-20 border-t border-gray-100">
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
                {/* Summary */}
                <div className="w-full md:w-1/3 space-y-6">
                    <h2 className="text-3xl font-serif text-gray-900 uppercase">Client Reviews</h2>
                    <div className="flex items-center gap-6">
                        <span className="text-6xl font-light text-gray-900">{product.ratingsAverage || '4.8'}</span>
                        <div>
                            <div className="flex items-center mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.ratingsAverage || 5) ? 'text-black fill-black' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Based on {product.ratingsQuantity || '17'} reviews</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-gray-900 w-4">{star}</span>
                                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-black" 
                                        style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '0%' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full h-14 border border-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all">
                        Write A Review
                    </button>
                </div>

                {/* Reviews List */}
                <div className="flex-1 space-y-12">
                    {MOCK_REVIEWS.map((review) => (
                        <div key={review.id} className="space-y-4 pb-12 border-b border-gray-50 last:border-0">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{review.user}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-black fill-black' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium">{review.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 font-light leading-relaxed max-w-2xl italic">
                                "{review.comment}"
                            </p>
                            <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                                <ThumbsUp className="w-3 h-3" /> Helpful ({review.likes})
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
