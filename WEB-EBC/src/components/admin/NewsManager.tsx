import { useState, useEffect } from 'react';
import { Save, Trash2, Edit, Plus, X, Upload } from 'lucide-react';

interface News {
    id: number;
    title: string;
    headerImg?: string;
    headerContent?: string;
    mainImg?: string;
    mainContent: string;
    footerImg?: string;
    footerContent?: string;
    createdAt: string;
}

interface NewsFormData {
    title: string;
    headerImg: string;
    headerContent: string;
    mainImg: string;
    mainContent: string;
    footerImg: string;
    footerContent: string;
    
    // For file uploads
    headerImgFile?: File | null;
    mainImgFile?: File | null;
    footerImgFile?: File | null;
}

export default function NewsManager() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        headerImg: '',
        headerContent: '',
        mainImg: '',
        mainContent: '',
        footerImg: '',
        footerContent: ''
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
    try {
        setLoading(true);

        const token = localStorage.getItem('admin_token');
        if (!token) {
            window.location.href = '/admin';
            return;
        }

        const response = await fetch(
            'https://ebc-biotech.com/api/news',
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

        const data = await response.json();
        setNews(data);
    } catch (error) {
        console.error('Lỗi khi lấy tin tức:', error);
    } finally {
        setLoading(false);
    }
};


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'headerImgFile' | 'mainImgFile' | 'footerImgFile') => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                [field]: e.target.files![0]
            }));
            
            // Clear the URL input when file is selected
            if (field === 'headerImgFile') {
                setFormData(prev => ({ ...prev, headerImg: '' }));
            } else if (field === 'mainImgFile') {
                setFormData(prev => ({ ...prev, mainImg: '' }));
            } else if (field === 'footerImgFile') {
                setFormData(prev => ({ ...prev, footerImg: '' }));
            }
        }
    };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = '/admin';
        return;
    }

    const url = editingId
        ? `https://ebc-biotech.com/api/news/${editingId}`
        : 'https://ebc-biotech.com/api/news';

    const method = editingId ? 'PUT' : 'POST';

    try {
        const formDataToSend = new FormData();

        formDataToSend.append('Title', formData.title);
        formDataToSend.append('HeaderContent', formData.headerContent);
        formDataToSend.append('MainContent', formData.mainContent);
        formDataToSend.append('FooterContent', formData.footerContent);

        // URL images (nếu không upload file)
        if (formData.headerImg && !formData.headerImgFile) {
            formDataToSend.append('HeaderImg', formData.headerImg);
        }
        if (formData.mainImg && !formData.mainImgFile) {
            formDataToSend.append('MainImg', formData.mainImg);
        }
        if (formData.footerImg && !formData.footerImgFile) {
            formDataToSend.append('FooterImg', formData.footerImg);
        }

        // Upload files
        if (formData.headerImgFile) {
            formDataToSend.append('HeaderImgFile', formData.headerImgFile);
        }
        if (formData.mainImgFile) {
            formDataToSend.append('MainImgFile', formData.mainImgFile);
        }
        if (formData.footerImgFile) {
            formDataToSend.append('FooterImgFile', formData.footerImgFile);
        }

        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formDataToSend
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin';
            return;
        }

        const result = await response.json();

        if (!response.ok) {
            const errorMessage = result.errors
                ? Object.values(result.errors).join('\n')
                : result.message || 'Có lỗi xảy ra';
            throw new Error(errorMessage);
        }

        fetchNews();
        resetForm();
        alert(editingId ? 'Cập nhật thành công!' : 'Thêm thành công!');

    } catch (err: any) {
        console.error('Lỗi:', err);
        alert(err.message || 'Có lỗi xảy ra');
    }
};

    const handleEdit = (newsItem: News) => {
        setEditingId(newsItem.id);
        setFormData({
            title: newsItem.title,
            headerImg: newsItem.headerImg || '',
            headerContent: newsItem.headerContent || '',
            mainImg: newsItem.mainImg || '',
            mainContent: newsItem.mainContent,
            footerImg: newsItem.footerImg || '',
            footerContent: newsItem.footerContent || '',
            headerImgFile: null,
            mainImgFile: null,
            footerImgFile: null
        });
        setIsAdding(true);
    };
const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;

    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = '/admin';
        return;
    }

    try {
        const response = await fetch(
            `https://ebc-biotech.com/api/news/${id}`,
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

        if (response.ok) {
            fetchNews();
            alert('Xóa thành công!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra!');
    }
};


    const resetForm = () => {
        setFormData({
            title: '',
            headerImg: '',
            headerContent: '',
            mainImg: '',
            mainContent: '',
            footerImg: '',
            footerContent: ''
        });
        setEditingId(null);
        setIsAdding(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Tin tức</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAdding(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Thêm tin tức
                </button>
            </div>

            {/* Form thêm/sửa */}
            {isAdding && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">
                            {editingId ? 'Sửa tin tức' : 'Thêm tin tức mới'}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Header Image */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Ảnh tiêu đề</label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="headerImg"
                                        value={formData.headerImg}
                                        onChange={handleInputChange}
                                        placeholder="Hoặc nhập URL ảnh"
                                        className="flex-1 px-3 py-2 border rounded"
                                        disabled={!!formData.headerImgFile}
                                    />
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 cursor-pointer">
                                        <Upload size={16} />
                                        Upload
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'headerImgFile')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {formData.headerImgFile && (
                                    <div className="text-sm text-green-600">
                                        Đã chọn: {formData.headerImgFile.name}
                                    </div>
                                )}
                                {formData.headerImg && (
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-500 mb-1">Xem trước:</div>
                                        <img 
                                            src={formData.headerImg} 
                                            alt="Preview" 
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Mở đầu :</label>
                            <textarea
                                name="headerContent"
                                value={formData.headerContent}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Main Image */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Ảnh chính (sau phẩn mở đầu)</label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="mainImg"
                                        value={formData.mainImg}
                                        onChange={handleInputChange}
                                        placeholder="Hoặc nhập URL ảnh"
                                        className="flex-1 px-3 py-2 border rounded"
                                        disabled={!!formData.mainImgFile}
                                    />
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 cursor-pointer">
                                        <Upload size={16} />
                                        Upload
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'mainImgFile')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {formData.mainImgFile && (
                                    <div className="text-sm text-green-600">
                                        Đã chọn: {formData.mainImgFile.name}
                                    </div>
                                )}
                                {formData.mainImg && (
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-500 mb-1">Xem trước:</div>
                                        <img 
                                            src={formData.mainImg} 
                                            alt="Preview" 
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nội dung chính *</label>
                            <textarea
                                name="mainContent"
                                value={formData.mainContent}
                                onChange={handleInputChange}
                                required
                                rows={5}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        {/* Footer Image */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Ảnh phụ (sau nội dung chính)</label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="footerImg"
                                        value={formData.footerImg}
                                        onChange={handleInputChange}
                                        placeholder="Hoặc nhập URL ảnh"
                                        className="flex-1 px-3 py-2 border rounded"
                                        disabled={!!formData.footerImgFile}
                                    />
                                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded hover:bg-gray-200 cursor-pointer">
                                        <Upload size={16} />
                                        Upload
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'footerImgFile')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {formData.footerImgFile && (
                                    <div className="text-sm text-green-600">
                                        Đã chọn: {formData.footerImgFile.name}
                                    </div>
                                )}
                                {formData.footerImg && (
                                    <div className="mt-2">
                                        <div className="text-sm text-gray-500 mb-1">Xem trước:</div>
                                        <img 
                                            src={formData.footerImg} 
                                            alt="Preview" 
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Kết bài</label>
                            <textarea
                                name="footerContent"
                                value={formData.footerContent}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                <Save size={18} />
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Danh sách tin tức */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {news.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{item.id}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        {item.headerImg && (
                                            <div className="relative group">
                                                <img 
                                                    src={item.headerImg} 
                                                    alt="Header"
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black text-white text-xs p-1 rounded">
                                                    Header
                                                </div>
                                            </div>
                                        )}
                                        {item.mainImg && (
                                            <div className="relative group">
                                                <img 
                                                    src={item.mainImg} 
                                                    alt="Main"
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black text-white text-xs p-1 rounded">
                                                    Main
                                                </div>
                                            </div>
                                        )}
                                        {item.footerImg && (
                                            <div className="relative group">
                                                <img 
                                                    src={item.footerImg} 
                                                    alt="Footer"
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-black text-white text-xs p-1 rounded">
                                                    Footer
                                                </div>
                                            </div>
                                        )}
                                        {!item.headerImg && !item.mainImg && !item.footerImg && (
                                            <span className="text-xs text-gray-400">Không có ảnh</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(item.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                        >
                                            <Edit size={14} />
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                        >
                                            <Trash2 size={14} />
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}