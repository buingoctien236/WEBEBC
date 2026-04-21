import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from "react-helmet-async";

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
    category?: string;
    views?: number;
}

export default function NewsListLarge() {
    const [news, setNews] = useState<News[]>([]);
    const [filteredNews, setFilteredNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const itemsPerPage = 9;

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        filterNews();
    }, [news, searchTerm, selectedCategory]);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://ebc-biotech.com/api/news');
            if (response.ok) {
                const data = await response.json();
                setNews(data);
                setFilteredNews(data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy tin tức:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterNews = () => {
        let filtered = [...news];

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(term) ||
                item.headerContent?.toLowerCase().includes(term) ||
                item.mainContent.toLowerCase().includes(term)
            );
        }

        // Lọc theo danh mục
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        setFilteredNews(filtered);
        setCurrentPage(1); // Reset về trang 1 khi filter
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Hôm qua';
        if (diffDays < 7) return `${diffDays} ngày trước`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
        return formatDate(dateString);
    };



    // Phân trang
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNews = filteredNews.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải tin tức...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Tin tức & Sự kiện | MR.KIT – Công nghệ sinh học EBC</title>

                <meta
                    name="description"
                    content="Cập nhật tin tức, sự kiện và kiến thức mới nhất về công nghệ sinh học, sản phẩm MR.KIT và giải pháp tẩy rửa an toàn từ EBC Biotech."
                />

                <link rel="canonical" href="https://ebc-biotech.com/newlistlarge" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Tin tức & Sự kiện | MR.KIT – EBC Biotech" />
                <meta
                    property="og:description"
                    content="Tin tức, sự kiện và thông tin chuyên sâu về sản phẩm MR.KIT và công nghệ sinh học từ EBC."
                />
                <meta property="og:url" content="https://ebc-biotech.com/newlistlarge" />


                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <div className="bg-white px-4 md:px-20 py-2">
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
                            <span>Trang Chủ</span>
                        </a>
                        <span className="mx-2 text-gray-400">{'>'}</span>
                    </li>
                    <li className="text-gray-700">Giới Thiệu</li>
                </ul>
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tin Tức & Sự Kiện</h1>
                            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                                Cập nhật những thông tin mới nhất về công nghệ sinh học và sản phẩm MR.KIT
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tin tức..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-8">

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-gray-600">
                            Tìm thấy <span className="font-bold text-green-600">{filteredNews.length}</span> bài viết
                        </p>
                    </div>

                    {/* News Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {currentNews.map((item) => (
                            <article
                                key={item.id}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Image */}
                                <Link to={`/news/${item.id}`} className="block">
                                    <div className="relative h-48 overflow-hidden">
                                        {item.headerImg ? (
                                            <img
                                                src={item.headerImg}
                                                alt={item.title}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                                <div className="text-green-600">
                                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        {item.category && (
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold rounded-full">
                                                    {item.category}
                                                </span>
                                            </div>
                                        )}

                                        {/* Time Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                {getTimeAgo(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="mb-3">
                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            <span>{formatDate(item.createdAt)}</span>
                                            {item.views && (
                                                <>
                                                    <span className="mx-2">•</span>
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    <span>{item.views} lượt xem</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                                        <Link
                                            to={`/news/${item.id}`}
                                            className="hover:text-green-600 transition-colors"
                                        >
                                            {item.title}
                                        </Link>
                                    </h2>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {item.headerContent || item.mainContent.substring(0, 200)}...
                                    </p>

                                    <Link
                                        to={`/news/${item.id}`}
                                        className="inline-flex items-center text-green-600 font-medium hover:text-green-700 group"
                                    >
                                        Đọc tiếp
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
                            <div className="text-gray-600">
                                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredNews.length)} trên {filteredNews.length} bài viết
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
                                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === pageNum
                                                    ? 'bg-green-600 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
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
                    )}



                    {/* No Results */}
                    {filteredNews.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy bài viết</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                Không có bài viết nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử với từ khóa khác hoặc xem tất cả tin tức.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                }}
                                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Xem tất cả tin tức
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}