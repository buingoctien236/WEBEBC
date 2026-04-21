// pages/AdminFlashSaleList.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Trash2,  Clock, Package, 
  Play, StopCircle, Eye, RefreshCw
} from 'lucide-react';

interface FlashSale {
  id: number;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'active' | 'ended';
  isActive: boolean;
  createdAt: string;
  isExpired: boolean;
  isRunning: boolean;
  timeRemainingFormatted: string;
  productCount: number;
}

export default function AdminFlashSaleList() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlashSales();
  }, []);

 const fetchFlashSales = async () => {
  try {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin';
      return;
    }

    const response = await fetch(
      'https://ebc-biotech.com/api/flashsale/admin',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      setFlashSales(data.flashsales || []);
    } else {
      setError(data.message || 'Có lỗi xảy ra');
    }
  } catch (err) {
    console.error('Error fetching flash sales:', err);
    setError('Không thể tải danh sách flash sale');
  } finally {
    setLoading(false);
  }
};


 const handleUpdateStatus = async (id: number, action: 'start' | 'end' | 'cancel') => {
  if (!confirm('Bạn có chắc chắn?')) return;

  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/admin';
    return;
  }

  try {
    const response = await fetch(
      `https://ebc-biotech.com/api/flashsale/${id}/status?action=${action}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
      return;
    }

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      fetchFlashSales();
    } else {
      alert(data.message || 'Có lỗi xảy ra');
    }
  } catch (err) {
    console.error(err);
    alert('Có lỗi xảy ra khi cập nhật trạng thái');
  }
};


  const handleDeleteFlashSale = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa flash sale này?')) return;

  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/admin';
    return;
  }

  try {
    const response = await fetch(
      `https://ebc-biotech.com/api/flashsale/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
      return;
    }

    const data = await response.json();

    if (data.success) {
      alert('Xóa flash sale thành công!');
      fetchFlashSales();
    } else {
      alert(data.message || 'Có lỗi xảy ra');
    }
  } catch (err) {
    console.error(err);
    alert('Có lỗi xảy ra khi xóa flash sale');
  }
};

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode; text: string }> = {
      active: { color: 'bg-green-100 text-green-800', icon: <Play className="w-3 h-3" />, text: 'Đang chạy' },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" />, text: 'Chờ bắt đầu' },
      ended: { color: 'bg-gray-100 text-gray-800', icon: <StopCircle className="w-3 h-3" />, text: 'Đã kết thúc' }
    };

    const cfg = config[status] || config.ended;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
        {cfg.icon}
        {cfg.text}
      </span>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách flash sale...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-medium mb-2">Lỗi: {error}</div>
          <button
            onClick={fetchFlashSales}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Danh sách Flash Sale</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi các đợt flash sale</p>
        </div>
        <Link
          to="/admin/flashsalecreate"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo Flash Sale mới
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng số Flash Sale</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{flashSales.length}</p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đang chạy</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {flashSales.filter(fs => fs.status === 'active').length}
              </p>
            </div>
            <Play className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sắp diễn ra</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {flashSales.filter(fs => fs.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Flash Sale List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {flashSales.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Chưa có flash sale nào</h3>
            <p className="text-gray-500 mb-6">Hãy tạo flash sale đầu tiên của bạn</p>
            
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Flash Sale</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[200px]">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian còn lại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {flashSales.map((flashSale) => {
                  const startTime = formatDateTime(flashSale.startTime);
                  const endTime = formatDateTime(flashSale.endTime);
                  
                  return (
                    <tr key={flashSale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{flashSale.id}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(flashSale.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{flashSale.name}</div>
                        {flashSale.description && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{flashSale.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-blue-600">
                           
                            <span>{startTime.date} --{startTime.time}</span>
                          </div>
                          <div className="text-sm text-red-600 mt-1">
                            {endTime.date} --{endTime.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium">{flashSale.productCount} sản phẩm</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(flashSale.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">
                          {flashSale.timeRemainingFormatted}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/flashsales/${flashSale.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          
                          
                          {flashSale.status === 'active' && (
                            <button
                              onClick={() => handleUpdateStatus(flashSale.id, 'end')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Kết thúc"
                            >
                              <StopCircle className="w-4 h-4" />
                            </button>
                          )}
                          

                          
                          <button
                            onClick={() => handleDeleteFlashSale(flashSale.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}