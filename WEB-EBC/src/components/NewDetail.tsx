import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, ChevronLeft } from 'lucide-react';

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

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNewsDetail();
    }, [id]);

    const fetchNewsDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://ebc-biotech.com/api/news/${id}`);
            if (response.ok) {
                const data = await response.json();
                setNews(data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết tin tức:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Không tìm thấy tin tức</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <a 
                href="/news"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Quay lại danh sách
            </a>
{/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {news.title}
            </h1>

            {/* Date */}
            <div className="flex items-center text-gray-500 mb-6">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(news.createdAt)}</span>
            </div>
            {/* Header Image */}
            {news.headerImg && (
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img 
                        src={news.headerImg} 
                        alt={news.title}
                        className="w-full h-auto max-h-[500px] object-cover"
                    />
                </div>
            )}

            

            {/* Header Content */}
            {news.headerContent && (
                <div className="mb-8">
                    <div dangerouslySetInnerHTML={{ __html: news.headerContent }} />
                </div>
            )}

            {/* Main Image */}
            {news.mainImg && (
                <div className="my-8">
                    <img 
                        src={news.mainImg} 
                        alt="Main content"
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            )}

            {/* Main Content */}
            <div className="mb-8">
                <div dangerouslySetInnerHTML={{ __html: news.mainContent }} />
            </div>

            {/* Footer Image */}
            {news.footerImg && (
                <div className="my-8">
                    <img 
                        src={news.footerImg} 
                        alt="Footer"
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            )}

            {/* Footer Content */}
            {news.footerContent && (
                <div className="mt-8 pt-6 border-t">
                    <div dangerouslySetInnerHTML={{ __html: news.footerContent }} />
                </div>
            )}
        </div>
    );
}