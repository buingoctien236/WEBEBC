import { useState, useEffect } from 'react';
import { Save, Star, RefreshCw, Search, AlertCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  category: string;
  status: string;
  images: string[];
}

export default function SpotlightManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    idsp1: '',
    idsp2: '',
    idsp3: '',
    idsp4: '',
    idsp5: '',
    idsp6: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
    try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('admin_token');
        if (!token) {
            window.location.href = '/admin';
            return;
        }

        const productsRes = await fetch(
            'https://ebc-biotech.com/api/products/admin',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (productsRes.status === 401 || productsRes.status === 403) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin';
            return;
        }

        const productsData = await productsRes.json();
        setProducts(productsData);

       const spotlightRes = await fetch(
    'https://ebc-biotech.com/api/spotlight',
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);


        if (spotlightRes.status === 401 || spotlightRes.status === 403) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin';
            return;
        }

        const spotlightData = await spotlightRes.json();

        if (spotlightData.success && spotlightData.spotlight) {
            setFormData({
                idsp1: spotlightData.spotlight.idsp1.toString(),
                idsp2: spotlightData.spotlight.idsp2.toString(),
                idsp3: spotlightData.spotlight.idsp3.toString(),
                idsp4: spotlightData.spotlight.idsp4.toString(),
                idsp5: spotlightData.spotlight.idsp5.toString(),
                idsp6: spotlightData.spotlight.idsp6.toString()
            });
        }

    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};



  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = '/admin';
        return;
    }

    const ids = Object.values(formData).map(id => parseInt(id));
    const invalidIds = ids.filter(id => isNaN(id) || id <= 0);

    if (invalidIds.length > 0) {
        setError('Vui lòng nhập ID sản phẩm hợp lệ (số nguyên dương)');
        return;
    }

    const missingIds = ids.filter(id => !products.some(p => p.id === id));
    if (missingIds.length > 0) {
        setError(`Không tìm thấy sản phẩm với ID: ${missingIds.join(', ')}`);
        return;
    }

    try {
        setSaving(true);
        setError('');
        setSuccess('');

        const response = await fetch(
            'https://ebc-biotech.com/api/spotlight/update',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    idsp1: parseInt(formData.idsp1),
                    idsp2: parseInt(formData.idsp2),
                    idsp3: parseInt(formData.idsp3),
                    idsp4: parseInt(formData.idsp4),
                    idsp5: parseInt(formData.idsp5),
                    idsp6: parseInt(formData.idsp6)
                })
            }
        );

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin';
            return;
        }

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Lỗi khi cập nhật spotlight');
        }

        setSuccess('Đã cập nhật sản phẩm tiêu biểu thành công!');
        fetchData();

    } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra');
    } finally {
        setSaving(false);
    }
};


  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get product details for spotlight
  const getProductById = (id: number) => {
    return products.find(p => p.id === id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />
            Quản lý Sản phẩm Tiêu biểu
          </h1>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Tải lại
          </button>
        </div>
        <p className="text-gray-600">
          Cập nhật 6 sản phẩm tiêu biểu sẽ hiển thị trên trang chủ
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {/* Product List Table with Fixed Height and Scroll */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-green-400 mb-3">
                Danh sách sản phẩm
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Fixed height container with scroll */}
            <div className="h-[400px] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Tên sản phẩm
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Danh mục
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        {searchTerm ? 'Không tìm thấy sản phẩm phù hợp' : 'Không có sản phẩm'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr 
                        key={product.id} 
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 border-r border-gray-100">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            #{product.id}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-100">
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {product.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r border-gray-100">
                          <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-900 font-medium">
                            {formatPrice(product.price)}
                          </div>
                          {product.salePrice && product.salePrice > 0 && (
                            <div className="text-xs text-red-600 font-bold">
                              {formatPrice(product.salePrice)}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600">
                  Hiển thị {filteredProducts.length} sản phẩm
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Xóa tìm kiếm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spotlight Form */}
        <div className="space-y-6">
  {/* Main Card */}
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
    <h2 className="text-base font-semibold text-green-600 mb-5 flex items-center gap-2">
      <Star className="w-5 h-5 text-yellow-500" />
      Cập nhật sản phẩm tiêu biểu
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <div
          key={num}
          className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition"
        >
          {/* Index */}
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
            {num}
          </div>

          {/* Input */}
          <input
            type="number"
            name={`idsp${num}`}
            value={formData[`idsp${num}` as keyof typeof formData]}
            onChange={handleInputChange}
            min="1"
            placeholder="ID"
            className="w-20 text-center px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Product name */}
          <div className="flex-1 px-3 py-2 rounded-md bg-gray-100 text-sm text-gray-700 truncate">
            {(() => {
              const id = parseInt(formData[`idsp${num}` as keyof typeof formData]);
              const product = getProductById(id);
              return product ? (
                <span title={product.name}>{product.name}</span>
              ) : (
                <span className="text-gray-400">
                  {id ? 'Không tìm thấy sản phẩm' : 'Chưa nhập ID'}
                </span>
              );
            })()}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Nhập đúng ID sản phẩm</p>
          <p>• Thứ tự 1 → 6 hiển thị ngoài trang chủ</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>
    </form>
  </div>

  {/* Instructions */}
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
    <h3 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      Hướng dẫn
    </h3>

    <ol className="list-decimal pl-5 space-y-1 text-xs text-yellow-700">
      <li>Lấy ID từ danh sách sản phẩm</li>
      <li>Nhập ID vào từng ô tương ứng</li>
      <li>Kiểm tra tên hiển thị</li>
      <li>Nhấn Lưu để cập nhật</li>
    </ol>
  </div>
</div>

      </div>
    </div>
  );
}