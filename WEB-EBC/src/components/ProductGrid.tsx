import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  status: string;
  category: string;
  stock: number;
  images: string[];
  detailedSpecs?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto slide effect - chạy tự động từ trái qua phải
  useEffect(() => {
    if (products.length <= 5) return; // Không cần auto slide nếu ≤ 5 sản phẩm
    
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 2); // Chỉ có 2 slides vì 6 sản phẩm
    }, 2000);
    
    return () => clearInterval(timer);
  }, [products.length]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ebc-biotech.com/api/spotlight/user');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      
      const productsData = data.products || data;
      setProducts(productsData);
    } catch (error: any) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (products.length <= 5) return;
    setCurrentSlide(prev => (prev + 1) % 2);
  };

  const prevSlide = () => {
    if (products.length <= 5) return;
    setCurrentSlide(prev => (prev - 1 + 2) % 2);
  };

  // Lấy sản phẩm cho slide hiện tại (luôn 5 sản phẩm)
  const getCurrentProducts = () => {
    if (products.length === 0) return [];
    
    if (products.length <= 5) {
      // Nếu có ≤ 5 sản phẩm, hiển thị tất cả
      return products;
    }
    
    // Với 6 sản phẩm: chia thành 2 slides
    if (currentSlide === 0) {
      // Slide 1: 5 sản phẩm đầu
      return products.slice(0, 5);
    } else {
      // Slide 2: sản phẩm thứ 6 + 4 sản phẩm đầu (cho đủ 5)
      return [
        products[5],           // Sản phẩm thứ 6
        ...products.slice(0, 4) // 4 sản phẩm đầu
      ];
    }
  };

  if (loading) {
    return (
      <section id="products" className=" bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">SẢN PHẨM NỔI BẬT</h2>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Các sản phẩm chất lượng từ Mr.KIT</p>
          </div>
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentProducts = getCurrentProducts();

  return (
    <section id="products" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">SẢN PHẨM NỔI BẬT</h2>
          <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Các sản phẩm chất lượng từ Mr.KIT</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">Chưa có sản phẩm nào</p>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons - Chỉ hiện khi có > 5 sản phẩm */}
            {products.length > 5 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-[30%] -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-gray-200 transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-[30%] -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10 border border-gray-200 transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Products Grid - Luôn hiển thị 5 sản phẩm */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-2 sm:px-4">
              {currentProducts.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${currentSlide}-${index}`}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  salePrice={product.salePrice}
                  images={product.images || []}
                  status={product.status}
                  category={product.category}
                  stock={product.stock}
                />
              ))}
            </div>

            {/* Dots Indicator - Chỉ hiện khi có > 5 sản phẩm */}
            {products.length > 5 && (
              <div className="flex justify-center mt-6 space-x-3">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-green-600 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Chuyển đến slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

           
          </div>
        )}
      </div>
    </section>
  );
}