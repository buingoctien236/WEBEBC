import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  images: string[];  // Thay vì imageUrl
  status: string;    // 'sale' hoặc 'not_sale'
  category?: string;
  stock?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  salePrice,
  images,
  status,
}: ProductCardProps) {
  
  // Lấy ảnh đầu tiên hoặc ảnh mặc định
  const mainImage = images && images.length > 0 
    ? images[0] 
    : '/imgs/default.jpg';
  
  // Kiểm tra có đang sale không
  const isSale = status === 'sale' && salePrice !== null && salePrice !== undefined;
  
  // Tính % giảm giá
  const discountPercent = isSale && salePrice && price > 0
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Link to={`/products/${id}`} className="block">
      <div className="bg-white transition-all duration-300 overflow-hidden group relative hover:shadow-xl rounded-[20px]">
        
        {/* Badge Sale */}
        {isSale && discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercent}%
            </div>
          </div>
        )}

        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-[20px]">
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Product info */}
        <div className="p-4">
          {/* Product name */}
          <h3
            className="font-bold text-gray-700 mb-2 line-clamp-2 max-h-[45px] text-left overflow-hidden hover:text-blue-600"
            title={name}
          >
            {name}
          </h3>

          {/* Price section */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {/* Sale price */}
              {isSale && salePrice ? (
                <>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(salePrice)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}