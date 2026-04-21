import { useState, useEffect } from 'react';
import anhnen2 from '../imgs/bannner2.jpg';
import defaultImage from '../imgs/spnen1.jpg';
import anhnen1 from '../imgs/banner1.png';
interface Product {
  id: number;
  name: string;
  mainImage?: string;
  images?: string[];
}

export default function NewProducts() {
  const [mainProduct, setMainProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchMainProduct();
  }, []);

  const fetchMainProduct = async () => {
    const savedId = localStorage.getItem('mainNewProductId') || '1';

    try {
      const response = await fetch(
        `https://ebc-biotech.com/api/products/main-image/${savedId}`
      );

      if (!response.ok) {
        useDefaultImage(savedId);
        return;
      }

      const data = await response.json();

      if (data.success && data.product) {
        setMainProduct(data.product);
      } else {
        useDefaultImage(savedId);
      }
    } catch {
      useDefaultImage(savedId);
    }
  };

  const useDefaultImage = (id: string) => {
    setMainProduct({
      id: parseInt(id),
      name: 'Sản phẩm mới',
      mainImage: defaultImage,
    });
  };

  const getImageUrl = () => {
    if (!mainProduct) return defaultImage;
    if (mainProduct.mainImage) return mainProduct.mainImage;
    if (mainProduct.images && mainProduct.images.length > 0)
      return mainProduct.images[0];
    return defaultImage;
  };

  const getProductName = () => mainProduct?.name || 'Sản phẩm mới';
  const getProductId = () => mainProduct?.id || 1;

 return (
  <section className="max-w-7xl mx-auto px-4 py-10">
    {/* Title */}
    <div className="text-center mb-8 sm:mb-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
        SẢN PHẨM MỚI
      </h2>
      <div className="w-16 sm:w-20 h-1 bg-green-600 mx-auto" />
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
      {/* Main product */}
      <div className="sm:row-span-2">
        <a
          href={`/products/${getProductId()}`}
          className="block w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden"
        >
          <img
            src={getImageUrl()}
            alt={getProductName()}
            className="w-full h-full object-contain p-4
                       transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
          />
        </a>
      </div>

      {/* Right banners */}
      <div className="flex flex-col gap-4">
        <a
          href="/collections"
          className="relative w-full aspect-[2/1] bg-gray-100 rounded-2xl overflow-hidden"
        >
          <img
            src={anhnen2}
            alt="Banner 2"
            className="absolute inset-0 w-full h-full object-cover
                       transition-transform duration-300 hover:scale-105"
          />
        </a>

        <a
          href="/collections"
          className="relative w-full aspect-[2/1] bg-gray-100 rounded-2xl overflow-hidden"
        >
          <img
            src={anhnen1}
            alt="Banner 3"
            className="absolute inset-0 w-full h-full object-cover
                       transition-transform duration-300 hover:scale-105"
          />
        </a>
      </div>
    </div>
  </section>
);

}
