
import { useState } from 'react';
import {
    Home, Menu, X, Package, Tag, Newspaper,
    Image, ChevronRight, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState<string>('dashboard');
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/');
    };
    const menuItems = [

        {
            key: 'products',
            label: 'Sản phẩm',
            icon: <Package className="w-5 h-5" />,
            subItems: [
                { label: 'Danh sách sản phẩm', path: '/admin/productlist' },
                { label: 'Thêm sản phẩm', path: '/admin/addproduct' }
            ]
        },


        {
            key: 'promotions',
            label: 'Flash Sale',
            icon: <Tag className="w-5 h-5" />,
            subItems: [
                { label: 'Danh sách flash sale', path: '/admin/flashsales' },
                { label: 'Tạo flash sale', path: '/admin/flashsalecreate' }
            ]
        },
        {
            key: 'news',
            label: 'Tin tức',
            icon: <Newspaper className="w-5 h-5" />,
            path: '/admin/news'

        },
        {
            key: 'banner',
            label: 'Banner',
            icon: <Image className="w-5 h-5" />,
            path: '/admin/banner'
        },
        {
            key: 'spotlights',
            label: 'Edit SP tiêu biểu',
            icon: <Image className="w-5 h-5" />,
            path: '/admin/spotlights'


        }, {
            key: 'imgnewproduct',
            label: 'Edit SP mới',
            icon: <Image className="w-5 h-5" />,
            path: '/admin/imgnewproduct'


        },

        {
            key: 'logs',
            label: 'Log hoạt động',
            icon: <Star className="w-5 h-5" />,
            path: '/admin/adminlogs'
        }
    ];



    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>

                            <div className="ml-4 lg:ml-0">
                                <h1 className="text-xl font-bold text-gray-800">Mr.KIT Admin</h1>
                                <p className="text-sm text-gray-500 hidden sm:block">Quản trị hệ thống</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleGoHome}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span>Quay lại trang chính</span>
                            </button>


                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed lg:static inset-y-0 left-0 z-30
            w-64 bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-in-out
            lg:translate-x-0 lg:flex lg:flex-shrink-0
            overflow-y-auto
            `}>
                    <nav className="h-full py-4">
                        <div className="px-4 space-y-1">
                            {menuItems.map((item) => (
                                <div key={item.key}>
                                    {item.path ? (
                                        <a
                                            href={item.path}
                                            className={`
                            flex items-center px-4 py-3 text-sm font-medium rounded-lg
                            ${activeMenu === item.key
                                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }
                        `}
                                            onClick={() => setActiveMenu(item.key)}
                                        >
                                            <span className="mr-3">{item.icon}</span>
                                            {item.label}
                                        </a>
                                    ) : (
                                        <>
                                            <button
                                                className={`
                            flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg
                            ${activeMenu === item.key
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                    }
                            `}
                                                onClick={() => setActiveMenu(item.key === activeMenu ? '' : item.key)}
                                            >
                                                <div className="flex items-center">
                                                    <span className="mr-3">{item.icon}</span>
                                                    {item.label}
                                                </div>
                                                <ChevronRight className={`
                            w-4 h-4 transform transition-transform
                            ${activeMenu === item.key ? 'rotate-90' : ''}
                            `} />
                                            </button>

                                            {activeMenu === item.key && item.subItems && (
                                                <div className="ml-8 mt-1 space-y-1">
                                                    {item.subItems.map((subItem, index) => (
                                                        <a
                                                            key={index}
                                                            href={subItem.path}
                                                            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                                        >
                                                            <ChevronRight className="w-3 h-3 mr-2" />
                                                            {subItem.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>


                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                            {/* Content */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}