import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FlashSale {
  id: number;
  name: string;
  description: string;
  startTime: string; // ISO string (Vietnam time)
  endTime: string;   // ISO string (Vietnam time)
  status: 'pending' | 'active' | 'ended';
  timeRemainingFormatted: string;
  timeRemainingSeconds?: number;
  products: FlashSaleProduct[];
}

interface FlashSaleProduct {
  productId: number;
  productName: string;
  originalPrice: number;
  flashSalePrice: number;
  discountPercent: number;
  mainImage: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export default function FlashSaleCountdown() {
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });

  // Tính thời gian còn lại từ API response (đã tính sẵn timezone)
 const calculateTimeLeft = (endTime: string): TimeRemaining => {
    // EndTime từ API đã là Vietnam time
    const end = new Date(endTime);
    const now = new Date(); // Local time (Vietnam)
    
    console.log('Calculate time left:', {
        endTime: endTime,
        endLocal: end.toString(),
        now: now.toString(),
        diff: end.getTime() - now.getTime()
    });
    
    const totalSeconds = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
    
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { days, hours, minutes, seconds, totalSeconds };
};

  // Countdown timer
  useEffect(() => {
    if (!flashSale) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = Math.max(0, prev.totalSeconds - 1);
        
        if (totalSeconds <= 0) {
          clearInterval(timer);
          // Có thể fetch lại data để cập nhật trạng thái
          return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
        }
        
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return { days, hours, minutes, seconds, totalSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSale]);

  // Fetch active flash sale
  useEffect(() => {
    fetchActiveFlashSale();
  }, []);

  const fetchActiveFlashSale = async () => {
  try {
    setLoading(true);
    
    console.log('Fetching active flash sale...');
    console.log('Current local time:', new Date().toString());
    
    const response = await fetch('https://ebc-biotech.com/api/flashsale/active');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.success && data.flashsales && data.flashsales.length > 0) {
      const activeFlashSale = data.flashsales[0];
      console.log('Flash Sale:', {
        name: activeFlashSale.name,
        startTime: activeFlashSale.startTime,
        endTime: activeFlashSale.endTime,
        timeRemainingFormatted: activeFlashSale.timeRemainingFormatted,
        nowVietnam: activeFlashSale.nowVietnam
      });
      
      setFlashSale(activeFlashSale);
      setTimeLeft(calculateTimeLeft(activeFlashSale.endTime));
    } else {
      console.log('No active flash sale found');
      setFlashSale(null);
    }
  } catch (error: any) {
    console.error('Error fetching flash sale:', error);
    setFlashSale(null);
  } finally {
    setLoading(false);
  }
  };
  // Auto slide effect - chỉ khi có hơn 5 sản phẩm
  useEffect(() => {
    if (!flashSale || flashSale.products.length <= 5) return;
    
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.ceil(flashSale.products.length / 5));
    }, 5000);
    
    return () => clearInterval(timer);
  }, [flashSale]);

  const nextSlide = () => {
    if (!flashSale || flashSale.products.length <= 5) return;
    const totalSlides = Math.ceil(flashSale.products.length / 5);
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (!flashSale || flashSale.products.length <= 5) return;
    const totalSlides = Math.ceil(flashSale.products.length / 5);
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  // Lấy sản phẩm cho slide hiện tại (mỗi slide 5 sản phẩm)
  const getCurrentProducts = () => {
    if (!flashSale) return [];
    
    if (flashSale.products.length <= 5) {
      return flashSale.products;
    }
    
    const start = currentSlide * 5;
    const end = start + 5;
    return flashSale.products.slice(start, end);
  };

  // Format số với 2 chữ số
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Nếu đang loading và chưa có flash sale
  if (loading) {
    return (
      <section id="flash-sale" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">FLASH SALE</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Đang tải flash sale...</p>
          </div>
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Nếu không có flash sale active, không render gì cả
  if (!flashSale) {
    return null;
  }

  const currentProducts = getCurrentProducts();
  const totalSlides = Math.ceil(flashSale.products.length / 5);

  return (
    <section id="flash-sale" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header với countdown và tên flash sale */}
        <div className="text-center mb-10">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
             FLASH SALE
            </h2>
            {flashSale.description && (
              <p className="text-gray-600 max-w-2xl mx-auto">
                {flashSale.name}
              </p>
            )}
          </div>
          
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          
          <div className="mt-4">
            <p className="text-green-600 font-bold mb-3 flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 animate-pulse" />
              KẾT THÚC TRONG
            </p>
            
            <div className="flex justify-center items-center gap-2">
              {/* Days - chỉ hiển thị nếu có ngày */}
              {timeLeft.days > 0 && (
                <>
                  <div className="bg-blue-600 text-white rounded-lg p-2 min-w-[60px]">
                    <div className="text-2xl font-bold tracking-wider">
                      {formatNumber(timeLeft.days)}
                    </div>
                    <div className="text-xs opacity-80">NGÀY</div>
                  </div>
                  <div className="text-blue-600 text-2xl font-bold">:</div>
                </>
              )}
              
              {/* Hours */}
              <div className="bg-blue-600 text-white rounded-lg p-2 min-w-[60px]">
                <div className="text-2xl font-bold tracking-wider">
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className="text-xs opacity-80">GIỜ</div>
              </div>
              
              <div className="text-blue-600 text-2xl font-bold">:</div>
              
              {/* Minutes */}
              <div className="bg-blue-600 text-white rounded-lg p-2 min-w-[60px]">
                <div className="text-2xl font-bold tracking-wider">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className="text-xs opacity-80">PHÚT</div>
              </div>
              
              <div className="text-blue-600 text-2xl font-bold">:</div>
              
              {/* Seconds */}
              <div className="bg-blue-600 text-white rounded-lg p-2 min-w-[60px]">
                <div className="text-2xl font-bold tracking-wider">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className="text-xs opacity-80">GIÂY</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="max-w-md mx-auto mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, (1 - timeLeft.totalSeconds / (24 * 3600)) * 100)}%` 
                  }}
                ></div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Sản phẩm flash sale */}
        <div className="relative">
          {/* Navigation Buttons - Chỉ hiện khi có > 5 sản phẩm */}
          {flashSale.products.length > 5 && (
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

          {/* Products Grid - Hiển thị 5 sản phẩm mỗi slide */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-2 sm:px-4">
            {currentProducts.map((product, index) => (
              <Link key={`${product.productId}-${currentSlide}-${index}`} to={`/products/${product.productId}`} className="block">
                <div className="bg-white transition-all duration-300 overflow-hidden group relative hover:shadow-xl rounded-[20px]">
                  
                  {/* Flash Sale Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      -{product.discountPercent}%
                    </div>
                  </div>

                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-[20px]">
                    <img
                      src={product.mainImage || '/imgs/default.jpg'}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/imgs/default.jpg';
                      }}
                    />
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    {/* Product name */}
                    <h3
                      className="font-bold text-gray-700 mb-2 line-clamp-2 max-h-[45px] text-left overflow-hidden hover:text-blue-600"
                      title={product.productName}
                    >
                      {product.productName}
                    </h3>

                    {/* Price section */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(product.flashSalePrice)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-2">
                      <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded">
                        FLASH SALE
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots Indicator - Chỉ hiện khi có > 5 sản phẩm */}
          {flashSale.products.length > 5 && totalSlides > 1 && (
            <div className="flex justify-center mt-6 space-x-3">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Chuyển đến slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Info */}
          {flashSale.products.length > 5 && totalSlides > 1 && (
            <div className="text-center mt-2 text-sm text-gray-500">
              {currentSlide + 1} / {totalSlides}
            </div>
          )}
        </div>

       
      </div>
    </section>
  );
}