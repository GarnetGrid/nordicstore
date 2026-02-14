import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>
                <div className="relative container text-center z-10 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                        Minimalist Essentials
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
                        Elevate your everyday with our curated collection of premium goods.
                    </p>
                    <div className="flex gap-4 justify-center mt-8">
                        <Link to="/catalog" className="btn btn-primary bg-white text-black hover:bg-gray-200 border-none px-8 py-4 text-lg">
                            Shop Now
                        </Link>
                        <Link to="/about" className="btn btn-outline border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                            Our Story
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="h2">Featured Collections</h2>
                        <Link to="/catalog" className="friend text-sm font-bold border-b border-black flex items-center gap-1 hover:text-gray-600 transition-colors">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link to="/catalog?category=apparel" className="group relative h-96 overflow-hidden rounded-lg">
                            <img
                                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
                                alt="Apparel"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <h3 className="text-3xl font-bold text-white">Apparel</h3>
                            </div>
                        </Link>
                        <Link to="/catalog?category=footwear" className="group relative h-96 overflow-hidden rounded-lg">
                            <img
                                src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"
                                alt="Footwear"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <h3 className="text-3xl font-bold text-white">Footwear</h3>
                            </div>
                        </Link>
                        <Link to="/catalog?category=accessories" className="group relative h-96 overflow-hidden rounded-lg">
                            <img
                                src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=800&q=80"
                                alt="Accessories"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <h3 className="text-3xl font-bold text-white">Accessories</h3>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
