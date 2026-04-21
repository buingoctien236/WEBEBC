import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, Filter, X, ArrowUpDown } from 'lucide-react';
import { Helmet } from "react-helmet-async";

const banners = [
    {
        id: 1,
        title: 'Công nghệ xanh cho cuộc sống an lành',
        description: 'Sản phẩm vệ sinh an toàn, thân thiện môi trường',
        image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=1920',
        bgColor: 'from-green-500 to-emerald-600'
    },
    {
        id: 2,
        title: 'Hệ sinh thái sản phẩm sinh học EBC',
        description: 'Đa dạng sản phẩm cho mọi nhu cầu gia đình',
        image: 'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=1920',
        bgColor: 'from-blue-500 to-cyan-600'
    },
    {
        id: 3,
        title: 'Ưu đãi đặc biệt',
        description: 'Sản phẩm chất lượng với giá tốt nhất',
        image: 'https://images.pexels.com/photos/5217882/pexels-photo-5217882.jpeg?auto=compress&cs=tinysrgb&w=1920',
        bgColor: 'from-orange-500 to-red-600'
    }
];

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    salePrice?: number | null;
    status: string;
    category: string;
    stock: number;
    images: string[];
    detailedSpecs?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface PriceRange {
    id: string;
    label: string;
    min?: number;
    max?: number;
}

// Sort options
interface SortOption {
    id: string;
    label: string;
    key: string;
    order: 'asc' | 'desc';
}

export default function Shops() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
    const [selectedSort, setSelectedSort] = useState<string>('default');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Price ranges
    const priceRanges: PriceRange[] = [
        { id: 'all', label: 'Tất cả giá' },
        { id: '0-100000', label: 'Dưới 100.000đ', max: 100000 },
        { id: '100000-500000', label: '100.000đ - 500.000đ', min: 100000, max: 500000 },
        { id: '500000-1000000', label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
        { id: '1000000-2000000', label: '1.000.000đ - 2.000.000đ', min: 1000000, max: 2000000 },
        { id: '2000000+', label: 'Trên 2.000.000đ', min: 2000000 }
    ];

    // Sort options
    const sortOptions: SortOption[] = [
        { id: 'default', label: 'Mặc định', key: 'id', order: 'asc' },
        { id: 'price-asc', label: 'Giá tăng dần', key: 'price', order: 'asc' },
        { id: 'price-desc', label: 'Giá giảm dần', key: 'price', order: 'desc' },
        { id: 'created-asc', label: 'Mới nhất', key: 'createdAt', order: 'desc' },
        { id: 'name-asc', label: 'Tên A-Z', key: 'name', order: 'asc' },
        { id: 'name-desc', label: 'Tên Z-A', key: 'name', order: 'desc' }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [selectedCategories, selectedPriceRange, selectedSort, products]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://ebc-biotech.com/api/products');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
           

            // Nếu API trả về dạng { products: [], totalCount: x }
            const productsData = data.products || data;

            setProducts(productsData);
            setFilteredProducts(productsData);

            // Extract unique categories
            const uniqueCategories = Array.from(
                new Set(productsData.map((p: Product) => p.category))
            ).filter(
                (category): category is string =>
                    typeof category === 'string' && category.trim() !== ''
            );

            setCategories(uniqueCategories);


        } catch (error: any) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortProducts = () => {
        let filtered = [...products];

        // Filter by category
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // Filter by price range
        if (selectedPriceRange) {
            const range = priceRanges.find(r => r.id === selectedPriceRange);
            if (range && range.id !== 'all') {
                filtered = filtered.filter(product => {
                    const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

                    if (range.min !== undefined && range.max !== undefined) {
                        return price >= range.min && price <= range.max;
                    } else if (range.max !== undefined && range.min === undefined) {
                        return price <= range.max;
                    } else if (range.min !== undefined && range.max === undefined) {
                        return price >= range.min;
                    }
                    return true;
                });
            }
        }

        // Sort products
        filtered = sortProducts(filtered, selectedSort);

        setFilteredProducts(filtered);
    };

    const sortProducts = (productsToSort: Product[], sortType: string) => {
        const sortOption = sortOptions.find(option => option.id === sortType);
        if (!sortOption || sortType === 'default') {
            return productsToSort;
        }

        return [...productsToSort].sort((a, b) => {
            let valueA, valueB;

            switch (sortOption.key) {
                case 'price':
                    valueA = a.salePrice && a.salePrice > 0 ? a.salePrice : a.price;
                    valueB = b.salePrice && b.salePrice > 0 ? b.salePrice : b.price;
                    break;
                case 'createdAt':
                    valueA = new Date(a.createdAt || '').getTime();
                    valueB = new Date(b.createdAt || '').getTime();
                    break;
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                default:
                    valueA = a.id;
                    valueB = b.id;
            }

            if (sortOption.order === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const handlePriceRangeChange = (rangeId: string) => {
        setSelectedPriceRange(prev => prev === rangeId ? '' : rangeId);
    };

    const handleSortChange = (sortId: string) => {
        setSelectedSort(sortId);
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedPriceRange('');
        setSelectedSort('default');
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <>
            <Helmet>
        <title>Cửa hàng | Mr.KIT – Công nghệ xanh cho cuộc sống an lành</title>
        <meta
            name="description"
            content="Khám phá cửa hàng Mr.KIT với các sản phẩm công nghệ xanh, an toàn, thân thiện môi trường, giá tốt cho gia đình Việt."
        />
        </Helmet>
        <section id="products" className="bg-white px-4 md:px-20 py-2">
            {/* Breadcrumb */}
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
                        <span>Trang chủ</span>
                    </a>
                    <span className="mx-2 text-gray-400">{'>'}</span>
                </li>
                <li className="text-gray-700">Cửa Hàng</li>
            </ul>

            {/* Banner Slider */}
            <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-[10px] mb-8">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-90`} />
                        <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white px-4">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h2>
                                <p className="text-lg md:text-xl mb-8">{banner.description}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex justify-between items-center">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Filter className="w-4 h-4" />
                    Bộ lọc
                </button>

                {/* Mobile Sort Dropdown */}
                <div className="relative">
                    <select
                        value={selectedSort}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {sortOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Filters */}
                <div className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-full lg:w-1/4 bg-white z-50 lg:z-auto transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto`}>
                    <div className="bg-gray-50 flex flex-col p-4 lg:p-6 rounded-xl border border-gray-200">
                        {/* Mobile Close Button */}
                        <div className="lg:hidden flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Bộ lọc</h2>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Bộ lọc</h2>
                            <p className="text-gray-600 text-sm">Giúp bạn tìm kiếm sản phẩm nhanh hơn</p>
                        </div>

                        {/* Selected Filters */}
                        {(selectedCategories.length > 0 || selectedPriceRange || selectedSort !== 'default') && (
                            <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">

                                <div className="flex flex-wrap gap-2">
                                    {selectedCategories.map(category => (
                                        <span key={category} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {category}
                                            <button
                                                onClick={() => handleCategoryChange(category)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    {selectedPriceRange && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                                            <button
                                                onClick={() => handlePriceRangeChange(selectedPriceRange)}
                                                className="text-green-500 hover:text-green-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                    {selectedSort !== 'default' && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                            {sortOptions.find(s => s.id === selectedSort)?.label}
                                            <button
                                                onClick={() => handleSortChange('default')}
                                                className="text-purple-500 hover:text-purple-700"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Price Filter */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Giá từ</h3>
                            <div className="space-y-2">
                                {priceRanges.map(range => (
                                    <div key={range.id} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`price-${range.id}`}
                                            name="price-range"
                                            checked={selectedPriceRange === range.id}
                                            onChange={() => handlePriceRangeChange(range.id)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`price-${range.id}`}
                                            className={`flex items-center cursor-pointer p-2 rounded-lg w-full ${selectedPriceRange === range.id ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedPriceRange === range.id ? 'border-blue-500' : 'border-gray-300'
                                                }`}>
                                                {selectedPriceRange === range.id && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                )}
                                            </div>
                                            <span>{range.label}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Danh mục</h3>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <div key={category} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`category-${category}`}
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`category-${category}`}
                                            className={`flex items-center cursor-pointer p-2 rounded-lg w-full ${selectedCategories.includes(category) ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${selectedCategories.includes(category) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                                }`}>
                                                {selectedCategories.includes(category) && (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span>{category}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600">
                                Hiển thị <span className="font-bold text-gray-800">{filteredProducts.length}</span> sản phẩm
                                {selectedCategories.length > 0 && (
                                    <span> trong <span className="font-bold text-gray-800">{selectedCategories.length}</span> danh mục</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1">
                    {/* Header with Sort Options for Desktop */}
                    <div className="hidden lg:flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">


                        {/* Sort Options for Desktop */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 font-medium">Sắp xếp:</span>
                                <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                                    {sortOptions.map(option => (
                                        <div key={option.id} className="relative">
                                            <input
                                                type="radio"
                                                id={`sort-${option.id}`}
                                                name="sort-by"
                                                checked={selectedSort === option.id}
                                                onChange={() => handleSortChange(option.id)}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor={`sort-${option.id}`}
                                                className={`inline-block px-4 py-2 cursor-pointer transition-all ${selectedSort === option.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {(selectedCategories.length > 0 || selectedPriceRange || selectedSort !== 'default') && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Products */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-lg mb-4">Không tìm thấy sản phẩm nào</p>
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Sort Options for Mobile (below products count) */}
                            <div className="lg:hidden mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-xl font-bold text-gray-800">Sản phẩm</h2>
                                    <p className="text-gray-600">
                                        <span className="font-bold text-blue-600">{filteredProducts.length}</span> sản phẩm
                                    </p>
                                </div>

                                {/* Horizontal Scroll Sort for Mobile */}
                                <div className="overflow-x-auto pb-2">
                                    <ul className="flex items-center gap-1 mb-0 min-w-max">
                                        {sortOptions.map(option => (
                                            <li key={option.id} className="filter-item">
                                                <label className="d-flex align-items-baseline pt-1 pb-1 m-0">
                                                    <input
                                                        type="radio"
                                                        className="d-none"
                                                        name="sortBy"
                                                        checked={selectedSort === option.id}
                                                        onChange={() => handleSortChange(option.id)}
                                                    />
                                                    <span className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${selectedSort === option.id
                                                        ? 'bg-blue-600 text-white border border-blue-600'
                                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        }`}>
                                                        {option.label}
                                                    </span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        salePrice={product.salePrice}
                                        images={product.images || []}
                                        status={product.status}
                                        category={product.category}
                                        stock={product.stock}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Overlay for mobile filter */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}
        </section>
        </>
    );
}