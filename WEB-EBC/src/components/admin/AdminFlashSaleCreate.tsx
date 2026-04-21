// pages/AdminFlashSaleCreate.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Trash2, Package, 
  Save
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  category: string;
  images?: string;
}

interface FlashSaleProduct {
  productId: number;
  flashSalePrice: number;
  product?: Product;
}

export default function AdminFlashSaleCreate() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
  });
  
  const [selectedProducts, setSelectedProducts] = useState<FlashSaleProduct[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchProduct.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
        p.category.toLowerCase().includes(searchProduct.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchProduct, products]);

 const fetchProducts = async () => {
  try {
    setLoading(true);
    const response = await fetch('https://ebc-biotech.com/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Kiểm tra xem response có phải là array không
    if (Array.isArray(data)) {
      // Trường hợp API trả về array trực tiếp
      setProducts(data);
      setFilteredProducts(data);
    } else if (data.products && Array.isArray(data.products)) {
      // Trường hợp API trả về object có property "products"
      setProducts(data.products);
      setFilteredProducts(data.products);
    } else if (data.data && Array.isArray(data.data)) {
      // Trường hợp API trả về object có property "data"
      setProducts(data.data);
      setFilteredProducts(data.data);
    } else {
      // Fallback: thử parse từng kiểu
      console.log('API Response format:', data);
      setProducts([]);
      setFilteredProducts([]);
    }
    
    console.log('Products loaded:', products.length);
  } catch (error) {
    console.error('Error fetching products:', error);
    setError('Không thể tải danh sách sản phẩm');
  } finally {
    setLoading(false);
  }
};

const handleCreateFlashSale = async (e: React.FormEvent) => {
  e.preventDefault();

  setError(null);

  if (!formData.name.trim()) {
    alert('Vui lòng nhập tên flash sale');
    return;
  }

  if (!formData.startTime || !formData.endTime) {
    alert('Vui lòng chọn đầy đủ thời gian');
    return;
  }

  if (selectedProducts.length === 0) {
    alert('Vui lòng chọn ít nhất 1 sản phẩm');
    return;
  }

  const startDateTime = new Date(formData.startTime);
  const endDateTime = new Date(formData.endTime);

  if (endDateTime <= startDateTime) {
    alert('Thời gian kết thúc phải sau thời gian bắt đầu');
    return;
  }

  if (endDateTime <= new Date()) {
    alert('Thời gian kết thúc phải ở tương lai');
    return;
  }

  for (const item of selectedProducts) {
    if (!item.product) continue;
    if (item.flashSalePrice <= 0 || item.flashSalePrice >= item.product.price) {
      alert(`Giá flash sale của "${item.product.name}" không hợp lệ`);
      return;
    }
  }

  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/admin';
    return;
  }

  const payload = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    startTime: startDateTime.toISOString(),
    endTime: endDateTime.toISOString(),
    products: selectedProducts.map(p => ({
      productId: p.productId,
      flashSalePrice: p.flashSalePrice
    }))
  };

  try {
    setSubmitting(true);

    const response = await fetch('https://ebc-biotech.com/api/flashsale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
      return;
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Tạo flash sale thất bại');
    }

    alert('Tạo flash sale thành công!');
    window.location.href = '/admin/flashsales';

  } catch (err: any) {
    setError(err.message || 'Có lỗi xảy ra');
  } finally {
    setSubmitting(false);
  }
};

const addProductToFlashSale = (product: Product) => {
  if (selectedProducts.find(p => p.productId === product.id)) {
    alert('Sản phẩm đã được thêm vào flash sale');
    return;
  }

  setSelectedProducts([
    ...selectedProducts,
    {
      productId: product.id,
      flashSalePrice: product.price, // Mặc định là giá gốc, không giảm
      product: product
    }
  ]);
};


  const removeProductFromFlashSale = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  };

  const updateProductPrice = (productId: number, price: number) => {
    setSelectedProducts(selectedProducts.map(p => 
      p.productId === productId ? { ...p, flashSalePrice: price } : p
    ));
  };

  const formatDateTimeLocal = (date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

const parseImages = (images?: string | string[]): string[] => {
  if (!images) return [];
  
  try {
    // Nếu images đã là array
    if (Array.isArray(images)) {
      return images;
    }
    
    // Nếu images là string, parse JSON
    if (typeof images === 'string') {
      // Xử lý trường hợp string đã là array literal
      if (images.startsWith('[') && images.endsWith(']')) {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
      }
      // Hoặc có thể là string URL đơn
      return [images];
    }
    
    return [];
  } catch {
    console.error('Error parsing images:', images);
    return [];
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/flashsales"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tạo Flash Sale mới</h1>
          <p className="text-gray-600 mt-1">Thiết lập flash sale với các sản phẩm giảm giá</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleCreateFlashSale}>
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên flash sale *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ví dụ: Flash Sale Black Friday"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả ngắn về flash sale..."
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">Tối đa 500 ký tự</p>
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Thời gian diễn ra</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={formatDateTimeLocal(new Date())}
                />
                <p className="text-sm text-gray-500 mt-1">Chọn ngày và giờ bắt đầu</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian kết thúc *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={formData.startTime || formatDateTimeLocal(new Date())}
                />
                <p className="text-sm text-gray-500 mt-1">Chọn ngày và giờ kết thúc</p>
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Chọn sản phẩm</h2>
            
            {/* Search Product */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm sản phẩm
              </label>
              <input
                type="text"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                placeholder="Nhập tên sản phẩm hoặc danh mục..."
                className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Tìm thấy {filteredProducts.length} sản phẩm
              </p>
            </div>

            {/* Product List */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-700 mb-3">Danh sách sản phẩm</h3>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                  <p className="text-sm text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                  {filteredProducts.map((product) => {
                    const images = parseImages(product.images);
                    const isSelected = selectedProducts.some(p => p.productId === product.id);
                    
                    return (
                      <div
                        key={product.id}
                        className={`border rounded-lg p-4 hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          {images.length > 0 && (
                            <img
                              src={images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-800">
                                {product.price.toLocaleString('vi-VN')}₫
                              </span>
                              <button
                                type="button"
                                onClick={() => addProductToFlashSale(product)}
                                disabled={isSelected}
                                className={`px-3 py-1 rounded text-sm ${
                                  isSelected
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                {isSelected ? 'Đã thêm' : 'Thêm'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Products */}
{selectedProducts.map((item) => {
  const images = parseImages(item.product?.images);
  const discountPercent = item.product 
    ? Math.round((item.product.price - item.flashSalePrice) / item.product.price * 100)
    : 0;
  
  return (
    <div key={item.productId} className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hiển thị ảnh lớn hơn và có thể xem nhiều ảnh */}
          <div className="relative">
            {images.length > 0 ? (
              <div className="flex items-center gap-2">
                <img
                  src={images[0]}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/imgs/default.jpg';
                  }}
                />
                {/* Hiển thị số lượng ảnh nếu có nhiều hơn 1 */}
                {images.length > 1 && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    +{images.length - 1}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="font-medium text-gray-900">{item.product?.name}</div>
            <div className="text-sm text-gray-500 mb-1">{item.product?.category}</div>
            
            {/* Giá gốc */}
            <div className="text-sm text-gray-500">
              Giá gốc: <span className="line-through">{item.product?.price.toLocaleString('vi-VN')}₫</span>
            </div>
            
            {/* Nếu có nhiều ảnh, hiển thị gallery nhỏ */}
            {images.length > 1 && (
              <div className="flex gap-1 mt-2">
                {images.slice(0, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${item.product?.name} ${idx + 1}`}
                    className="w-8 h-8 object-cover rounded border cursor-pointer hover:opacity-80"
                    onClick={() => {
                      // Có thể thêm modal xem ảnh lớn ở đây
                      const mainImg = document.getElementById(`main-img-${item.productId}`);
                      if (mainImg) {
                        mainImg.setAttribute('src', img);
                      }
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/imgs/default.jpg';
                    }}
                  />
                ))}
                {images.length > 3 && (
                  <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-600">
                    +{images.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right min-w-[180px]">
            {/* Input giá sale */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Giá sale:</span>
                <input
                  type="number"
                  value={item.flashSalePrice}
                  onChange={(e) => updateProductPrice(item.productId, parseFloat(e.target.value) || 0)}
                  className="w-32 px-2 py-1 border rounded text-right"
                  min="1"
                />
                <span className="text-sm">₫</span>
              </div>
              
              {/* Các nút giảm giá nhanh */}
              {item.product && (
                <div className="flex gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => updateProductPrice(item.productId, Math.round(item.product!.price * 0.9))}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    -10%
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProductPrice(item.productId, Math.round(item.product!.price * 0.8))}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    -20%
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProductPrice(item.productId, Math.round(item.product!.price * 0.7))}
                    className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    -30%
                  </button>
                </div>
              )}
              
              {/* Hiển thị phần trăm giảm giá */}
              {item.product && (
                <div className={`text-sm font-medium mt-1 ${
                  discountPercent > 0 ? 'text-green-600' : 
                  discountPercent < 0 ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {discountPercent > 0 ? `Giảm ${discountPercent}%` :
                   discountPercent < 0 ? `Tăng ${Math.abs(discountPercent)}%` :
                   'Không thay đổi giá'}
                </div>
              )}
              
              {/* Hiển thị giá sau giảm */}
              <div className="text-lg font-bold text-blue-600 mt-1">
                {item.flashSalePrice.toLocaleString('vi-VN')}₫
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => removeProductFromFlashSale(item.productId)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Xóa sản phẩm"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
})}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Link
              to="/admin/flashsales"
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </Link>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {selectedProducts.length} sản phẩm đã chọn
              </div>
              <button
                type="submit"
                disabled={submitting || selectedProducts.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors ${
                  submitting || selectedProducts.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Tạo Flash Sale
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}