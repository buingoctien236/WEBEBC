import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../imgs/logo.png';

// Interface cho kết quả tìm kiếm
interface SearchResult {
  id: number;
  title: string;
  type: 'product' | 'news';
  image?: string;
  price?: number;
  description?: string;
  link: string;
}

// Interface cho Cart Item
interface CartItem {
  id: number;
  quantity: number;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load cart từ localStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          
          // Tính tổng số lượng sản phẩm
          const totalItems = parsedCart.reduce(
            (total: number, item: CartItem) => total + (item.quantity || 1),
            0
          );
          setCartCount(totalItems);
        } else {
          setCartItems([]);
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
        setCartCount(0);
      }
    };

    // Load cart ngay khi component mount
    loadCart();

    // Lắng nghe sự kiện storage để cập nhật real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCart();
      }
    };

    // Lắng nghe sự kiện custom để cập nhật cart
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Polling để cập nhật cart (fallback cho các tab khác nhau)
    const interval = setInterval(loadCart, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  // Đóng kết quả tìm kiếm khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Hàm tìm kiếm
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Tìm kiếm sản phẩm và tin tức đồng thời
      const [productsResponse, newsResponse] = await Promise.allSettled([
        fetch(`https://ebc-biotech.com/api/products/search?term=${encodeURIComponent(term)}`),
        fetch(`https://ebc-biotech.com/api/news/search?term=${encodeURIComponent(term)}`)
      ]);

      const results: SearchResult[] = [];

      // Xử lý kết quả sản phẩm
      if (productsResponse.status === 'fulfilled' && productsResponse.value.ok) {
        const products = await productsResponse.value.json();
        products.forEach((product: any) => {
          // Sử dụng slug nếu có, nếu không thì dùng ID
          const productLink = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;
          
          results.push({
            id: product.id,
            title: product.name || 'Sản phẩm',
            type: 'product',
            image: product.image || `http://localhost:5107/Images/Products/${product.image}`,
            price: product.price,
            description: product.description,
            link: productLink
          });
        });
      }

      // Xử lý kết quả tin tức
      if (newsResponse.status === 'fulfilled' && newsResponse.value.ok) {
        const news = await newsResponse.value.json();
        news.forEach((newsItem: any) => {
          results.push({
            id: newsItem.id,
            title: newsItem.title || 'Tin tức',
            type: 'news',
            image: newsItem.headerImg,
            description: newsItem.headerContent || newsItem.mainContent?.substring(0, 100),
            link: `/news/${newsItem.id}`
          });
        });
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Xử lý khi nhập tìm kiếm (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Xử lý submit form tìm kiếm
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setShowResults(false);
      setSearchTerm('');
    }
  };

  // Xử lý click vào kết quả tìm kiếm
  const handleResultClick = (result: SearchResult) => {
    navigate(result.link);
    setSearchOpen(false);
    setShowResults(false);
    setSearchTerm('');
  };

  // Xử lý click vào giỏ hàng
  const handleCartClick = () => {
    navigate('/cart');
  };



  // Hiển thị giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Hiển thị ảnh sản phẩm - sửa URL nếu cần
  const getImageUrl = (image: string | undefined, type: 'product' | 'news') => {
    if (!image) return undefined;
    
    // Nếu là sản phẩm và image chỉ là tên file, thêm đường dẫn
    if (type === 'product' && !image.startsWith('http')) {
      return `http://localhost:5107/Images/Products/${image}`;
    }
    
    return image;
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <a href="/">
                <img
                  src={logo}
                  className="h-12 w-auto object-contain"
                  alt="logo"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6 font-bold">
              <a href="/" className="text-gray-700 hover:text-green-600 transition-colors">
                TRANG CHỦ
              </a>
              <a href="/shops" className="text-gray-700 hover:text-green-600 transition-colors">
                CỬA HÀNG
              </a>
              <a href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
                GIỚI THIỆU
              </a>
              <a href="/newlistlarge" className="text-gray-700 hover:text-green-600 transition-colors">
                TIN TỨC
              </a>
              <a href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
                LIÊN HỆ
              </a>
             
            </nav>
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            {/* Search Desktop */}
            {!searchOpen ? (
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            ) : (
              <div ref={searchRef} className="relative w-80">
                <form onSubmit={handleSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm, tin tức..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Xóa tìm kiếm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Đóng tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>

                {/* Kết quả tìm kiếm */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                    {isSearching ? (
                      <div className="p-4 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                        <p className="mt-2 text-gray-500">Đang tìm kiếm...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="p-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-700">
                            {searchResults.length} kết quả tìm thấy
                          </p>
                        </div>
                        {searchResults.map((result) => {
                          const imageUrl = getImageUrl(result.image, result.type);
                          
                          return (
                            <button
                              key={`${result.type}-${result.id}`}
                              onClick={() => handleResultClick(result)}
                              className="w-full p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="flex items-start space-x-3">
                                {/* Hình ảnh */}
                                <div className="flex-shrink-0">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={result.title}
                                      className="w-12 h-12 object-cover rounded"
                                      onError={(e) => {
                                        // Nếu ảnh lỗi, thay bằng placeholder
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement!.innerHTML = `
                                          <div class="w-12 h-12 rounded flex items-center justify-center ${
                                            result.type === 'product' ? 'bg-green-100' : 'bg-blue-100'
                                          }">
                                            ${
                                              result.type === 'product' 
                                                ? '<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>'
                                                : '<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>'
                                            }
                                          </div>
                                        `;
                                      }}
                                    />
                                  ) : (
                                    <div className={`w-12 h-12 rounded flex items-center justify-center ${
                                      result.type === 'product' ? 'bg-green-100' : 'bg-blue-100'
                                    }`}>
                                      {result.type === 'product' ? (
                                        <ShoppingCart className="w-6 h-6 text-green-600" />
                                      ) : (
                                        <Search className="w-6 h-6 text-blue-600" />
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Thông tin */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                      result.type === 'product' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {result.type === 'product' ? 'Sản phẩm' : 'Tin tức'}
                                    </span>
                                    {result.price && (
                                      <span className="text-sm font-bold text-green-600">
                                        {formatPrice(result.price)}
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-medium text-gray-800 truncate">
                                    {result.title}
                                  </p>
                                  {result.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                      {result.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </>
                    ) : searchTerm ? (
                      <div className="p-4 text-center text-gray-500">
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>Không tìm thấy kết quả cho "{searchTerm}"</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* Cart */}
<div className="relative">
  <button 
    onClick={handleCartClick}
    className="p-2 hover:bg-gray-100 rounded-full relative transition-colors group"
    aria-label={`Giỏ hàng (${cartCount} sản phẩm)`}
  >
    <ShoppingCart className="w-5 h-5 text-gray-600" />
    {cartCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
        {cartCount > 99 ? '99+' : cartCount}
      </span>
    )}
  </button>
  
  {/* Tooltip cho cart - đặt ngoài button chính */}
  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
    {cartCount === 0 ? (
      <div className="text-center py-2">
        <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Giỏ hàng trống</p>
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">
            {cartCount} sản phẩm
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleCartClick();
            }}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Xem giỏ hàng
          </button>
        </div>
        
        <div className="max-h-40 overflow-y-auto space-y-2 mb-3">
          {cartItems.slice(0, 3).map((item: any) => (
            <div key={item.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {item.name}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Số lượng: {item.quantity}
                  </span>
                  <span className="text-xs font-bold text-red-600">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {cartItems.length > 3 && (
            <div className="text-center py-1">
              <span className="text-xs text-gray-500">
                +{cartItems.length - 3} sản phẩm khác
              </span>
            </div>
          )}
        </div>
        
        <div className="border-t pt-2">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-bold text-red-600">
              {formatPrice(
                cartItems.reduce(
                  (total: number, item: any) => total + (item.price * item.quantity),
                  0
                )
              )}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCartClick();
            }}
            className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Đặt hàng ngay
          </button>
        </div>
      </>
    )}
  </div>
</div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col space-y-3">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <form onSubmit={handleSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm, tin tức..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </form>
                
                {/* Mobile search results */}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50">
                    {searchResults.slice(0, 5).map((result) => {
                      const imageUrl = getImageUrl(result.image, result.type);
                      
                      return (
                        <button
                          key={`mobile-${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full p-3 hover:bg-gray-50 text-left border-b border-gray-100"
                        >
                          <div className="flex items-center space-x-3">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={result.title}
                                className="w-8 h-8 object-cover rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                result.type === 'product' ? 'bg-green-100' : 'bg-blue-100'
                              }`}>
                                {result.type === 'product' ? (
                                  <ShoppingCart className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Search className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate text-sm">
                                {result.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {result.type === 'product' ? 'Sản phẩm' : 'Tin tức'}
                                {result.price && ` • ${formatPrice(result.price)}`}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile menu items */}
              <a href="/" className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors">
                TRANG CHỦ
              </a>
              <a href="/shops" className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors">
                CỬA HÀNG
              </a>
              <a href="/about" className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors">
                GIỚI THIỆU
              </a>
              <a href="/newlistlarge" className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors">
                TIN TỨC
              </a>
              <a href="/contact" className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors">
                LIÊN HỆ
              </a>
              
              
              {/* Mobile Cart Info */}
              <div className="border-t pt-4 mt-2">
                <button 
                  onClick={handleCartClick}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <ShoppingCart className="w-6 h-6 text-gray-600" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-gray-800">Giỏ hàng</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="text-red-600 font-bold">
                      {formatPrice(
                        cartItems.reduce(
                          (total: number, item: any) => total + (item.price * item.quantity),
                          0
                        )
                      )}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}