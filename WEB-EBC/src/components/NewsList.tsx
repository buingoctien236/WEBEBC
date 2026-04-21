import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

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

export default function NewsList() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://ebc-biotech.com/api/news');
            if (response.ok) {
                const data = await response.json();
                setNews(data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy tin tức:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // Hiển thị 5 bài viết đầu tiên
    const displayedNews = news.slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Tiêu đề */}
            <div className="mb-6 pl-[10px]">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    <Link 
                        to="/news" 
                        className="hover:text-green-600 transition-colors"
                        title="Tin tức"
                    >
                        Tin tức
                    </Link>
                </h2>
            </div>

            {/* Danh sách tin tức */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedNews.map((item) => (
                    <div key={item.id} className="mb-4">
                        <article className="flex items-start bg-white p-3 rounded-xl  hover:shadow-md transition-shadow h-full">
                            {/* Ảnh */}
                            <div className="flex-shrink-0 w-1/3 pr-3">
                                <Link 
                                    to={`/news/${item.id}`}
                                    className="block rounded-lg overflow-hidden aspect-square"
                                    title={item.title}
                                >
                                    {item.headerImg ? (
                                        <img 
                                            src={item.headerImg}
                                            alt={item.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center aspect-square">
                                            <div className="text-gray-400 text-sm">No image</div>
                                        </div>
                                    )}
                                </Link>
                            </div>

                            {/* Nội dung */}
                            <div className="flex-1 min-w-0">
                                {/* Tiêu đề */}
                                <h3 className="font-bold mb-1">
                                    <Link 
                                        to={`/news/${item.id}`}
                                        className="text-sm md:text-base text-gray-800 hover:text-green-600 transition-colors line-clamp-2"
                                        title={item.title}
                                    >
                                        {item.title}
                                    </Link>
                                </h3>

                                {/* Ngày đăng */}
                                <div className="mb-2">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                                        <span>{formatDate(item.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Tóm tắt */}
                                <div className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                    {item.headerContent 
                                        ? (item.headerContent.length > 100 
                                            ? item.headerContent.substring(0, 100) + '...' 
                                            : item.headerContent)
                                        : (item.mainContent.length > 100 
                                            ? item.mainContent.substring(0, 100) + '...' 
                                            : item.mainContent)}
                                </div>
                            </div>
                        </article>
                    </div>
                ))}

                {/* Xem thêm */}
                <div className="mb-4">
                    <Link 
                        to="/news"
                        title="Xem thêm"
                        className="flex flex-col items-center justify-center h-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all group"
                    >
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                                <ChevronRight className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-green-600 font-medium text-lg">Xem thêm</span>
                            <p className="text-gray-500 text-sm mt-2">Xem tất cả tin tức</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Nếu không có tin tức */}
            {news.length === 0 && (
                <div className="text-center py-10">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <p className="text-gray-500">Chưa có tin tức nào</p>
                </div>
            )}
        </div>
    );
}