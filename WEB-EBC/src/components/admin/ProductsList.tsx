import { useState, useEffect } from 'react';
import { 
  Search, Edit, Trash2, Eye, Plus, 
  ChevronLeft, ChevronRight, Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number;
  status: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [itemsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  const navigate = useNavigate();

  // Fetch products từ API
  useEffect(() => {
    fetchProducts();
  }, []);

 const fetchProducts = async () => {
  try {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin';
      return;
    }

    const response = await fetch(
      'https://ebc-biotech.com/api/products/admin',
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
      throw new Error('Không thể tải danh sách sản phẩm');
    }

    const data = await response.json();
    setProducts(data);
    setFilteredProducts(data);
  } catch (err: any) {
    setError(err.message || 'Lỗi tải sản phẩm');
  } finally {
    setLoading(false);
  }
};


  // Lọc sản phẩm
  useEffect(() => {
    let result = products;

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset về trang đầu khi lọc
  }, [searchTerm, selectedCategory, products]);

  // Lấy danh mục duy nhất từ sản phẩm
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Xử lý chọn/bỏ chọn sản phẩm
  const handleSelectProduct = (id: number) => {
    setSelectedProducts(prev =>
      prev.includes(id)
        ? prev.filter(productId => productId !== id)
        : [...prev, id]
    );
  };

  // Xử lý chọn tất cả
  const handleSelectAll = () => {
    if (selectedProducts.length === currentItems.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentItems.map(p => p.id));
    }
  };

  // Xử lý xóa sản phẩm
 const handleDelete = async (id: number) => {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/admin';
    return;
  }

  try {
    const response = await fetch(
      `https://ebc-biotech.com/api/products/${id}`,
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

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Xóa thất bại');
    }

    setProducts(prev => prev.filter(p => p.id !== id));
    setSelectedProducts(prev => prev.filter(pid => pid !== id));
    alert('Xóa sản phẩm thành công!');
  } catch (err: any) {
    alert(err.message);
  }
};


  // Xóa nhiều sản phẩm
const handleDeleteSelected = async () => {
  if (selectedProducts.length === 0) {
    alert('Vui lòng chọn ít nhất một sản phẩm');
    return;
  }

  if (!confirm(`Xóa ${selectedProducts.length} sản phẩm đã chọn?`)) return;

  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/admin';
    return;
  }

  try {
    await Promise.all(
      selectedProducts.map(id =>
        fetch(`https://ebc-biotech.com/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      )
    );

    setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    alert('Xóa sản phẩm thành công!');
  } catch (err: any) {
    alert('Lỗi khi xóa sản phẩm');
  }
};


  // Định dạng số tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-gray-600 mt-1">Tổng số sản phẩm: {products.length}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/admin/addproduct')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </button>
          
          {selectedProducts.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Xóa đã chọn ({selectedProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tìm kiếm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm sản phẩm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tên sản phẩm, danh mục..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Lọc danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lọc theo danh mục
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Tất cả danh mục' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === currentItems.length && currentItems.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                   
                   
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{product.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  {product.salePrice && product.salePrice > 0 ? (
    <>
      <div className="font-semibold text-red-600">
        {formatPrice(product.salePrice)}
      </div>
      <div className="text-gray-400 line-through text-xs">
        {formatPrice(product.price)}
      </div>
    </>
  ) : (
    <div className="font-medium">
      {formatPrice(product.price)}
    </div>
  )}
</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                            product.status === 'sale' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {product.status === 'active' ? 'Đang bán' : 
                           product.status === 'sale' ? 'Khuyến mãi' : 
                           product.status}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Xem"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
              {currentItems.map((product) => (
                <div key={product.id} className="border-b border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">#{product.id} - {product.name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                            {product.category}
                          </span>
                          <span className="text-gray-600">Tồn: {product.stock}</span>
                        </div>
                        <div className="text-sm font-bold mt-1">{formatPrice(product.price)}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full
                        ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {product.status}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="p-1 text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredProducts.length)}
                    </span>{' '}
                    trong tổng số <span className="font-medium">{filteredProducts.length}</span> sản phẩm
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg border ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Không có sản phẩm */}
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}