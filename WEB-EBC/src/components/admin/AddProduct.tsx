import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Image as ImageIcon, 
  Trash2, Save, ArrowLeft,
  DollarSign, Package, Tag, AlertCircle
} from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailedSpecs: '',
    price: '',
    salePrice: '',
    status: 'not_sale',
    category: '',
  });
  
  // Image state
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên sản phẩm';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Vui lòng nhập mô tả ngắn';
    }
    
    if (!formData.detailedSpecs.trim()) {
      errors.detailedSpecs = 'Vui lòng nhập thông số chi tiết';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Vui lòng nhập giá sản phẩm hợp lệ';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Vui lòng nhập danh mục';
    }
    
    if (formData.status === 'sale' && (!formData.salePrice || parseFloat(formData.salePrice) <= 0)) {
      errors.salePrice = 'Vui lòng nhập giá khuyến mãi khi chọn trạng thái "sale"';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} không phải là hình ảnh hợp lệ`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`File ${file.name} vượt quá 5MB`);
        return false;
      }
      
      return true;
    });
    
    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };
  
  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setValidationErrors({});

  if (!validateForm()) return;

  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/admin';
    return;
  }

  setLoading(true);

  try {
    const formDataToSend = new FormData();

    formDataToSend.append('Name', formData.name.trim());
    formDataToSend.append('Description', formData.description.trim());
    formDataToSend.append('DetailedSpecs', formData.detailedSpecs.trim());
    formDataToSend.append('Price', formData.price);
    formDataToSend.append('Status', formData.status);
    formDataToSend.append('Category', formData.category.trim());

    if (formData.status === 'sale' && formData.salePrice) {
      formDataToSend.append('SalePrice', formData.salePrice);
    }

    images.forEach(file => {
      formDataToSend.append('Files', file);
    });

    const response = await fetch(
      'https://ebc-biotech.com/api/products',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      }
    );

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin';
      return;
    }

    const data = await response.json();

    if (response.ok && data.success) {
      setSuccess('Thêm sản phẩm thành công! Đang chuyển hướng...');

      setFormData({
        name: '',
        description: '',
        detailedSpecs: '',
        price: '',
        salePrice: '',
        status: 'not_sale',
        category: '',
      });

      setImages([]);
      setPreviewUrls([]);

      setTimeout(() => {
        navigate('/admin/productlist');
      }, 100);
    } else {
      throw new Error(data.message || 'Có lỗi xảy ra');
    }
  } catch (err: any) {
    setError(`Lỗi: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
          <p className="text-gray-600 mt-1">Thêm sản phẩm mới vào hệ thống</p>
        </div>
        
        <button
          onClick={() => navigate('/admin/productlist')}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </button>
      </div>
      
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập tên sản phẩm"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
            </div>
            
            {/* Description - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mô tả ngắn về sản phẩm"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>
            
            {/* Detailed Specifications - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thông số chi tiết *
              </label>
              <textarea
                name="detailedSpecs"
                value={formData.detailedSpecs}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.detailedSpecs ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Mỗi thông số trên một dòng"
              />
              {validationErrors.detailedSpecs && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.detailedSpecs}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Nhập mỗi thông số trên một dòng riêng
              </p>
            </div>
            
            {/* Price Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Giá gốc *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                </div>
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                )}
              </div>
              
              {/* Sale Price - Conditional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Giá khuyến mãi {formData.status === 'sale' && '*'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors.salePrice ? 'border-red-500' : 'border-gray-300'
                    } ${formData.status !== 'sale' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="0"
                    disabled={formData.status !== 'sale'}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                </div>
                {validationErrors.salePrice && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.salePrice}</p>
                )}
              </div>
            </div>
            
            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category - Required, free text input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Danh mục *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập danh mục"
                />
                {validationErrors.category && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                )}
              </div>
              
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="not_sale"
                      checked={formData.status === 'not_sale'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Bình thường</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="sale"
                      checked={formData.status === 'sale'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-red-600 font-medium">Đang khuyến mãi</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Images */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Hình ảnh sản phẩm
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Tải lên hình ảnh sản phẩm. Ảnh đầu tiên sẽ là ảnh đại diện.
                </p>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-600">Kéo thả ảnh vào đây hoặc click để chọn</p>
                    <p className="text-sm text-gray-400 mt-1">Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa 5MB)</p>
                  </label>
                </div>
                
                {/* Image Previews */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {previewUrls.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>Chưa có ảnh nào được chọn</p>
                    </div>
                  ) : (
                    previewUrls.map((url, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Ảnh {index + 1}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px]">
                              {images[index]?.name}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Thêm sản phẩm
                  </>
                )}
              </button>
              
              {/* Form requirements note */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium mb-1">Lưu ý:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-1">*</span>
                    <span>Các trường có dấu * là bắt buộc</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-1">*</span>
                    <span>Danh mục: Nhập tùy ý (ví dụ: SC-1000, bọt rửa tay, nước rửa tay...)</span>
                  </li>
                  <li>Ảnh sản phẩm: Không bắt buộc, có thể thêm sau</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}