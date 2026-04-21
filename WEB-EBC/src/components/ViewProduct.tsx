import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ShoppingCart, Share2, ChevronLeft, ChevronRight,
    Truck, Shield, RotateCcw, Package, CheckCircle, X
} from 'lucide-react';

interface ProductData {
    id: number;
    name: string;
    description: string;
    detailedSpecs: string;
    price: number;
    salePrice?: number;
    status: string;
    category: string;
    images: string[];
    mainImage: string;
    isOnSale: boolean;
    discountPercent: number;
    createdAt: string;
    updatedAt: string;
}

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'specs' | 'manufacturer'>('specs');
    const [toasts, setToasts] = useState<Toast[]>([]);
    
    // State
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showMore, setShowMore] = useState(false);

    // Fetch product data
    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`https://ebc-biotech.com/api/products/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Không tìm thấy sản phẩm');
                }
                throw new Error('Lỗi khi tải thông tin sản phẩm');
            }

            const data = await response.json();
            setProduct(data);

        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Handle quantity change
    const handleQuantityChange = (value: number) => {
        if (value < 1) return;
        setQuantity(value);
    };

    // Add to cart with toast notification
    const handleAddToCart = () => {
        if (!product) return;

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.isOnSale ? product.salePrice! : product.price,
            quantity,
            image: product.images?.[0] || product.mainImage,
            discountPercent: product.discountPercent
        };

        // Save to localStorage (or call API)
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

        if (existingItemIndex >= 0) {
            currentCart[existingItemIndex].quantity += quantity;
            showToast('success', `Đã cập nhật ${product.name} trong giỏ hàng (${currentCart[existingItemIndex].quantity} sản phẩm)`);
        } else {
            currentCart.push(cartItem);
            showToast('success', ` ${quantity} ${product.name} đã thêm vào giỏ hàng`);
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));

        // Trigger cart update event for header
        const event = new CustomEvent('cartUpdated');
        window.dispatchEvent(event);
    };

    // Buy now
    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };

    // Share product
    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            showToast('success', 'Đã copy link sản phẩm vào clipboard!');
        } catch {
            showToast('error', 'Không thể copy link');
        }
    };

    // Show toast notification
    const showToast = (type: 'success' | 'error', message: string) => {
        const id = Date.now();
        const newToast: Toast = { id, message, type };
        
        setToasts(prev => [...prev, newToast]);
        
        // Auto remove toast after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    // Remove toast
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Navigate images
    const nextImage = () => {
        if (!product?.images) return;
        setSelectedImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        if (!product?.images) return;
        setSelectedImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    // Render loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error || !product) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 text-red-400 mx-auto mb-4">
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
                <p className="text-gray-600 mb-6">{error || `Sản phẩm với ID ${id} không tồn tại.`}</p>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Về trang chủ
                </button>
            </div>
        );
    }

    const mainImage = product.images?.[selectedImageIndex] || product.mainImage || '';
    const specsArray = product.detailedSpecs?.split('\n').filter(spec => spec.trim()) || [];
    const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;

    return (
        <div className="bg-white px-4 sm:px-6 lg:px-20 py-2">
            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center justify-between max-w-md p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                            toast.type === 'success' 
                                ? 'bg-green-50 border border-green-200 text-green-800' 
                                : 'bg-red-50 border border-red-200 text-red-800'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1 rounded-full ${
                                toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                                {toast.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <X className="w-5 h-5 text-red-600" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium">{toast.message}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className={`ml-4 p-1 rounded-full hover:bg-opacity-20 ${
                                toast.type === 'success' 
                                    ? 'hover:bg-green-800 text-green-600' 
                                    : 'hover:bg-red-800 text-red-600'
                            }`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Breadcrumb */}
            <ul className="flex items-center m-0 text-sm bg-gray-100 rounded-lg p-2 mb-4">
                <li className="flex items-center">
                    <a
                        href="/"
                        title="Trang chủ"
                        className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                    >
                        <svg width="14" height="14">
                            <use href="#svg-home" />
                        </svg>
                        <span>Trang chủ</span>
                    </a>
                    <span className="mx-2 text-gray-400">{'>'}</span>
                </li>
                <li className="text-gray-700">Cửa Hàng</li>
            </ul>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 mb-8">
                {/* Product Images */}
                <div>
                    <div className="relative mb-4">
                        <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4">
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Package className="w-20 h-20 text-gray-400" />
                                </div>
                            )}
                        </div>

                        {/* Image Navigation */}
                        {product.images && product.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                                    aria-label="Ảnh trước"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                                    aria-label="Ảnh sau"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                                        selectedImageIndex === index
                                            ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                                            : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                                    }`}
                                    aria-label={`Xem ảnh ${index + 1}`}
                                >
                                    <img
                                        src={img}
                                        alt={`Ảnh ${index + 1} của ${product.name}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    {/* Product Name and Status */}
                    <div className="mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                    </div>

                    {/* Short Description */}
                    <div className="mb-6 space-y-3">
                        {/* Tình trạng */}
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium w-32">Tình trạng:</span>
                            <span className="text-green-600 font-semibold flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Còn hàng
                            </span>
                        </div>

                        {/* Thương hiệu */}
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium w-32">Thương hiệu:</span>
                            <span className="text-gray-800 font-semibold">Mr. Kit Pro</span>
                        </div>

                        {/* Phân loại */}
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium w-32">Phân loại:</span>
                            <span className="text-gray-800 font-semibold">{product.category}</span>
                        </div>

                        {/* Mô tả ngắn */}
                        <div className="pt-4 border-t">
                            <p className="text-gray-700 leading-relaxed font-medium">
                                {product.description.length > 150 && !showMore
                                    ? `${product.description.substring(0, 150)}...`
                                    : product.description}
                                {product.description.length > 150 && (
                                    <button
                                        onClick={() => setShowMore(!showMore)}
                                        className="ml-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        {showMore ? 'Thu gọn' : 'Xem thêm'}
                                    </button>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700 font-medium">Số lượng:</span>
                            <div className="flex items-center h-[42px] border border-gray-300 rounded-lg">
                                <button 
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                    className="px-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    className="w-16 text-center focus:outline-none"
                                />
                                <button 
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="px-3 text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 h-[42px] px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            aria-label="Chia sẻ sản phẩm"
                        >
                            <Share2 className="w-5 h-5" />
                            Chia sẻ
                        </button>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-red-600">
                                {formatPrice(displayPrice)}
                            </span>
                            {product.isOnSale && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="px-3 py-1 bg-red-100 text-red-800 font-bold rounded-full text-sm">
                                        -{product.discountPercent}%
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:shadow-lg"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:shadow-lg"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Giao hàng nhanh</p>
                                    <p className="text-xs text-gray-600">2-4 ngày làm việc</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Bảo hành chính hãng</p>
                                    <p className="text-xs text-gray-600">12 tháng</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Đổi trả dễ dàng</p>
                                    <p className="text-xs text-gray-600">7 ngày đổi trả</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Đóng gói cẩn thận</p>
                                    <p className="text-xs text-gray-600">Dễ dàng vận chuyển</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                                activeTab === 'specs'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Thông số kỹ thuật
                        </button>
                        <button
                            onClick={() => setActiveTab('manufacturer')}
                            className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                                activeTab === 'manufacturer'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Đơn vị sản xuất
                        </button>
                    </nav>
                </div>

                <div className="py-6">
                    {/* Tab content: Thông số kỹ thuật */}
                    {activeTab === 'specs' && (
                        <div className="prose max-w-none animate-fadeIn">
                            {/* Mô tả sản phẩm */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mô tả sản phẩm:</h3>
                                <div className="whitespace-pre-line text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    {product.description}
                                </div>
                            </div>

                            {/* Thông số chi tiết */}
                            {specsArray.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết sản phẩm:</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <ul className="space-y-3">
                                            {specsArray.map((spec, index) => (
                                                <li key={index} className="flex items-start group">
                                                    <span className="text-blue-600 mr-3 mt-1">•</span>
                                                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                                                        {spec.trim()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab content: Đơn vị sản xuất */}
                    {activeTab === 'manufacturer' && (
                        <div className="prose max-w-none animate-fadeIn">
                            <div className="bg-white rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6">Thông tin nhà sản xuất</h3>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Thông tin công ty */}
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="bg-blue-100 p-2 rounded-lg mr-4">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">Công ty TNHH Công nghệ EBC</h4>
                                                <p className="text-gray-600 mt-1">Chuyên sản xuất và phân phối sản phẩm vệ sinh sinh học</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-green-100 p-2 rounded-lg mr-4">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">Địa chỉ</h4>
                                                <p className="text-gray-600 mt-1">
                                                    131 phố Âu Cơ, Tây Hồ, Hà Nội
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-purple-100 p-2 rounded-lg mr-4">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800">Hotline hỗ trợ</h4>
                                                <p className="text-gray-600 mt-1">
                                                    <a href="tel:0766652886" className="text-blue-600 hover:text-blue-800 font-medium">
                                                        0766652886
                                                    </a> (Zalo)
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chứng nhận và tiêu chuẩn */}
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 pt-1 rounded-lg border border-gray-200">
                                            <h4 className="font-semibold text-gray-800 mb-3">Sản phẩm của chúng tôi:</h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                                    <span>Nhập khẩu từ USA</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                                    <span>Hiệu suất tẩy dầu mỡ cao</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                                    <span>Sản phẩm có nguồn gốc 100% từ Thực vật</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                                    <span>Tiết kiệm nước sạch</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                                    <span>Tiết kiệm thời gian làm sạch</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                                    <span>Không độc hại với môi trường</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                                    <span>Không có phản ứng phụ với Da tay và bề mặt cần làm sạch</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-semibold text-gray-800 mb-3">Cam kết của nhà sản xuất</h4>
                                            <p className="text-gray-600 text-sm">
                                                Sản phẩm được sản xuất trên dây chuyền công nghệ hiện đại,
                                                không chứa hóa chất độc hại, thân thiện với môi trường và an toàn cho sức khỏe người tiêu dùng.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg z-40">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-500">Tổng cộng:</div>
                        <div className="font-bold text-red-600">{formatPrice(displayPrice * quantity)}</div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Thêm vào giỏ
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}