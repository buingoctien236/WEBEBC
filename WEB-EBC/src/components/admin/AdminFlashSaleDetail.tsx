import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Tag, 

  CheckCircle, 
  XCircle, 
  AlertCircle,
  ShoppingBag,
  Percent,
  DollarSign,
  Package
} from 'lucide-react';

interface FlashSaleProduct {
  id: number;
  productId: number;
  productName: string;
  originalPrice: number;
  flashSalePrice: number;
  discountPercent: number;
  productImage: string;
  productCategory: string;
}

interface FlashSaleDetail {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  isExpired: boolean;
  isRunning: boolean;
  timeRemainingFormatted: string;
  products: FlashSaleProduct[];
}

const FlashSaleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flashSale, setFlashSale] = useState<FlashSaleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    fetchFlashSaleDetail();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (flashSale?.isRunning && !flashSale.isExpired) {
      interval = setInterval(() => {
        updateTimeRemaining();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [flashSale]);

  const fetchFlashSaleDetail = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/admin');
        return;
      }

      const response = await fetch(`https://ebc-biotech.com/api/flashsale/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin_token');
          navigate('/admin');
          return;
        }
        throw new Error('Không tìm thấy flash sale');
      }

      const data = await response.json();
      if (data.success) {
        setFlashSale(data.flashsale);
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin flash sale');
      console.error('Error fetching flash sale:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeRemaining = () => {
    if (!flashSale) return;
    
    const now = new Date();
    const endTime = new Date(flashSale.endTime);
    const diffMs = endTime.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      setFlashSale(prev => prev ? { ...prev, isExpired: true, isRunning: false } : null);
      return;
    }
    
    const diffSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;
    
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    setTimeRemaining(formatted);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string, isExpired: boolean, isRunning: boolean) => {
    if (isExpired) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          <XCircle className="w-4 h-4 mr-1" />
          Đã kết thúc
        </span>
      );
    }
    
    if (isRunning) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Đang diễn ra
        </span>
      );
    }
    
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Đang chờ
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-4 h-4 mr-1" />
            Tắt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-4 h-4 mr-1" />
            {status}
          </span>
        );
    }
  };

  const handleGoBack = () => {
    navigate('/admin/flashsales');
  };

  const handleEditFlashSale = () => {
    navigate(`/admin/flashsale/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin flash sale...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">Lỗi</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!flashSale) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy flash sale</h3>
        <p className="text-gray-600 mb-6">Flash sale bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{flashSale.name}</h1>
            <p className="text-gray-600">{flashSale.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {getStatusBadge(flashSale.status, flashSale.isExpired, flashSale.isRunning)}
          <button
            onClick={handleEditFlashSale}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Tag className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </button>
        </div>
      </div>

      {/* Flash Sale Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Thời gian</h3>
              <p className="text-sm text-gray-600">Flash sale</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bắt đầu:</span>
              <span className="font-medium">{formatDateTime(flashSale.startTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Kết thúc:</span>
              <span className="font-medium">{formatDateTime(flashSale.endTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Thời gian còn lại:</span>
              <span className={`font-bold ${
                flashSale.isRunning ? 'text-green-600' : 'text-red-600'
              }`}>
                {flashSale.isRunning ? timeRemaining || flashSale.timeRemainingFormatted : flashSale.timeRemainingFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sản phẩm</h3>
              <p className="text-sm text-gray-600">Tổng số sản phẩm</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {flashSale.products.length}
            </div>
            <p className="text-sm text-gray-600">sản phẩm tham gia</p>
          </div>
        </div>

        {/* Discount Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Giảm giá trung bình</h3>
              <p className="text-sm text-gray-600">Trên tất cả sản phẩm</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {flashSale.products.length > 0 
                ? Math.round(
                    flashSale.products.reduce((sum, p) => sum + p.discountPercent, 0) / 
                    flashSale.products.length
                  )
                : 0}%
            </div>
            <p className="text-sm text-gray-600">giảm giá trung bình</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Sản phẩm tham gia</h2>
          <p className="text-gray-600 mt-1">
            Danh sách {flashSale.products.length} sản phẩm tham gia flash sale
          </p>
        </div>

        {flashSale.products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có sản phẩm nào tham gia flash sale này</p>
            <button
              onClick={handleEditFlashSale}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Tag className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá gốc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá sale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giảm giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flashSale.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {product.productImage ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.productImage}
                              alt={product.productName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {product.productId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.productCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                        {product.originalPrice.toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">
                        {product.flashSalePrice.toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Percent className="w-4 h-4 mr-1 text-green-600" />
                        <span className="text-sm font-bold text-green-600">
                          -{product.discountPercent}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Tiết kiệm: {(product.originalPrice - product.flashSalePrice).toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/admin/product/${product.productId}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Xem sản phẩm
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ID Flash Sale:</span>
              <span className="font-medium">{flashSale.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày tạo:</span>
              <span className="font-medium">{formatDateTime(flashSale.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái kích hoạt:</span>
              <span className={`font-medium ${
                flashSale.isActive ? 'text-green-600' : 'text-red-600'
              }`}>
                {flashSale.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sản phẩm có giảm giá cao nhất:</span>
              <span className="font-medium text-red-600">
                {flashSale.products.length > 0
                  ? Math.max(...flashSale.products.map(p => p.discountPercent)) + '%'
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sản phẩm có giảm giá thấp nhất:</span>
              <span className="font-medium text-green-600">
                {flashSale.products.length > 0
                  ? Math.min(...flashSale.products.map(p => p.discountPercent)) + '%'
                  : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền giảm giá:</span>
              <span className="font-medium text-purple-600">
                {flashSale.products.length > 0
                  ? flashSale.products
                      .reduce((sum, p) => sum + (p.originalPrice - p.flashSalePrice), 0)
                      .toLocaleString('vi-VN') + 'đ'
                  : '0đ'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleDetail;