import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerItem {
  id: number;
  image: string;
}

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  const fetchBanners = async () => {
    try {
      setError(null);
      setBanners([]);

      const response = await fetch('https://ebc-biotech.com/api/banner');
      const data = await response.json();
     

      if (!data.success || !data.banners) {
        throw new Error('Dữ liệu banner không hợp lệ');
      }

      let bannerList: string[] = [];

      // Nhận cả PascalCase và camelCase
      if (data.banners.BannersList && data.banners.BannersList.length > 0) {
        bannerList = data.banners.BannersList;
      } else if (data.banners.bannersList && data.banners.bannersList.length > 0) {
        bannerList = data.banners.bannersList;
      } else {
        // Nhận cả hai trường hợp
        const banner1 = data.banners.Banner1 || data.banners.banner1 || '';
        const banner2 = data.banners.Banner2 || data.banners.banner2 || '';
        const banner3 = data.banners.Banner3 || data.banners.banner3 || '';
        
        bannerList = [banner1, banner2, banner3];
      }

     

      bannerList = bannerList.filter(url => url && url.trim() !== '');

      if (bannerList.length === 0) {
        setError('Không có banner nào để hiển thị');
        return;
      }

      setBanners(
        bannerList.map((image, index) => ({
          id: index + 1,
          image,
        }))
      );
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError(err instanceof Error ? err.message : 'Lỗi tải banner');
    }
  };

  if (error) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-[20px] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-3">⚠️ {error}</p>
          <button
            onClick={fetchBanners}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

return (
  <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl
                  aspect-[16/9] sm:aspect-auto
                  h-[220px] sm:h-[360px] md:h-[420px] lg:h-[500px]">

    {banners.map((banner, index) => (
      <div
        key={banner.id}
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        <img
          src={banner.image}
          alt={`Banner ${banner.id}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
          }}
        />
      </div>
    ))}

    {banners.length > 1 && (
      <>
        {/* Nút trái – ẩn trên mobile */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
          }
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2
                     bg-white/90 p-3 rounded-full shadow
                     hover:scale-110 transition z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Nút phải – ẩn trên mobile */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % banners.length)
          }
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2
                     bg-white/90 p-3 rounded-full shadow
                     hover:scale-110 transition z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2
                        flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 sm:h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-6 sm:w-8 bg-white'
                  : 'w-2.5 sm:w-3 bg-white/60'
              }`}
            />
          ))}
        </div>
      </>
    )}
  </div>
);

}