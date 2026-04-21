import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Upload, Save, Image as ImageIcon, RefreshCw, Eye, X } from 'lucide-react';

interface Banner {
  Id: number;
  Banner1: string;
  Banner2: string;
  Banner3: string;
  BannersList: string[];
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

export default function AdminBanner() {
  const [banner, setBanner] = useState<Banner>({
    Id: 0,
    Banner1: '',
    Banner2: '',
    Banner3: '',
    BannersList: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });
  const [files, setFiles] = useState<{ [key: number]: File | null }>({
    1: null,
    2: null,
    3: null
  });
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    url: '',
    title: ''
  });

  useEffect(() => {
    fetchBanner();
  }, []);

  const getToken = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin';
      return null;
    }
    return token;
  };

  const fetchBanner = async () => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) return;

      const response = await fetch('https://ebc-biotech.com/api/banner/admin', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin';
        return;
      }

      const data = await response.json();

      if (data.success && data.banners) {
        const b = data.banners;
        setBanner({
          Id: b.Id || b.id || 0,
          Banner1: b.Banner1 || b.banner1 || '',
          Banner2: b.Banner2 || b.banner2 || '',
          Banner3: b.Banner3 || b.banner3 || '',
          BannersList: b.BannersList || b.bannersList || []
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'Lỗi khi tải banner' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (bannerNumber: number, file: File | null) => {
    setFiles(prev => ({ ...prev, [bannerNumber]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBanner(prev => ({
          ...prev,
          [`Banner${bannerNumber}`]: reader.result as string
        }) as Banner);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (bannerNumber: number, url: string) => {
    setBanner(prev => ({
      ...prev,
      [`Banner${bannerNumber}`]: url
    }) as Banner);

    setFiles(prev => ({ ...prev, [bannerNumber]: null }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const token = getToken();
      if (!token) return;

      const formData = new FormData();

      if (files[1]) formData.append('File1', files[1]);
      else if (banner.Banner1.startsWith('http')) formData.append('Banner1', banner.Banner1);

      if (files[2]) formData.append('File2', files[2]);
      else if (banner.Banner2.startsWith('http')) formData.append('Banner2', banner.Banner2);

      if (files[3]) formData.append('File3', files[3]);
      else if (banner.Banner3.startsWith('http')) formData.append('Banner3', banner.Banner3);

      const endpoint =
        banner.Id > 0
          ? `https://ebc-biotech.com/api/banner/${banner.Id}`
          : 'https://ebc-biotech.com/api/banner';

      const method = banner.Id > 0 ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin';
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setFiles({ 1: null, 2: null, 3: null });
        fetchBanner();
      } else {
        setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Lỗi khi lưu banner' });
    } finally {
      setSaving(false);
    }
  };
  const openPreview = (url: string, title: string) => {
    if (url && url.trim() !== '') {
      setPreviewModal({
        isOpen: true,
        url,
        title
      });
    }
  };



  const BannerItem = ({ number, title }: { number: 1 | 2 | 3, title: string }) => {
    const getBannerValue = () => {
      if (number === 1) return banner.Banner1;
      if (number === 2) return banner.Banner2;
      if (number === 3) return banner.Banner3;
      return '';
    };

    const bannerValue = getBannerValue();
    const currentFile = files[number];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            Banner {number}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">Preview</h4>
              {bannerValue && (
                <button
                  type="button"
                  onClick={() => openPreview(bannerValue, `Banner ${number}`)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4" />
                  Xem ảnh gốc
                </button>
              )}
            </div>
            <div className="relative h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              {bannerValue || currentFile ? (
                bannerValue ? (
                  <img
                    src={bannerValue}
                    alt={`Banner ${number}`}
                    className="w-full h-full object-cover"
                  />
                ) : currentFile ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                    <Upload className="w-12 h-12 mb-2" />
                    <p className="text-sm">Đã chọn: {currentFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : null
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">Chưa có ảnh</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload ảnh mới
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleFileChange(number, e.target.files?.[0] || null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {currentFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Đã chọn: {currentFile.name}
                  <button
                    type="button"
                    onClick={() => handleFileChange(number, null)}
                    className="ml-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    (xóa)
                  </button>
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hoặc nhập URL ảnh
              </label>
              <input
                type="url"
                placeholder="https://example.com/banner.jpg"
                value={bannerValue?.startsWith('http') ? bannerValue : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleUrlChange(number, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập URL ảnh từ Cloudinary hoặc dịch vụ lưu trữ ảnh
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // Thêm phần thông tin chi tiết từ API
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">


        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}



        <form onSubmit={handleSave}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cập nhật banner mới</h2>
            
          </div>

          <BannerItem number={1} title="Banner chính 1" />
          <BannerItem number={2} title="Banner chính 2" />
          <BannerItem number={3} title="Banner chính 3" />

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={fetchBanner}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy thay đổi
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>

     

        {/* Modal xem ảnh gốc */}
        {previewModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{previewModal.title}</h3>
                <button
                  onClick={() => setPreviewModal({ isOpen: false, url: '', title: '' })}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                <img
                  src={previewModal.url}
                  alt={previewModal.title}
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    img.parentElement!.innerHTML = `
                      <div class="text-center py-12">
                        <div class="text-red-400 mb-4">
                          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                        </div>
                        <h4 class="text-lg font-medium text-gray-700 mb-2">Không thể tải ảnh</h4>
                        <p class="text-sm text-gray-500 mb-4">URL có thể không hợp lệ hoặc ảnh đã bị xóa</p>
                        <p class="text-xs text-gray-400 break-all bg-gray-100 p-3 rounded">${previewModal.url}</p>
                      </div>
                    `;
                  }}
                />
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">URL ảnh:</h4>
                  <p className="text-sm text-gray-600 break-all">{previewModal.url}</p>
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(previewModal.url);
                        alert('Đã copy URL vào clipboard!');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}