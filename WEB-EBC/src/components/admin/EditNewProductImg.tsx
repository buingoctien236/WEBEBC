import { useState, useEffect } from 'react';
import { Save, Search } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    images?: string[];
}

export default function EditNewProductImg() {
    const [productId, setProductId] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Lấy danh sách sản phẩm
    useEffect(() => {
        fetchProducts();
        
        // Lấy ID đã lưu
        const savedId = localStorage.getItem('mainNewProductId');
        if (savedId) {
            setProductId(savedId);
        }
    }, []);

    const fetchProducts = async () => {
    try {
        setLoading(true);
            const response = await fetch('https://ebc-biotech.com/api/products');
            if (response.ok) {




















        const data = await response.json();
        setProducts(data);
            }
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);

    } finally {
        setLoading(false);
    }
};

    const handleSave = () => {

    const idNum = parseInt(productId);

    if (!productId || isNaN(idNum) || idNum <= 0) {


        return;
    }

        // Kiểm tra sản phẩm có tồn tại không
    const productExists = products.some(p => p.id === idNum);
    if (!productExists) {
        setError(`Sản phẩm ID ${idNum} không tồn tại`);
        return;
    }








        setSaving(true);
        setError('');

        // Lưu vào localStorage
        localStorage.setItem('mainNewProductId', productId);










        setTimeout(() => {
            setSaving(false);
            setSuccess(`Đã cập nhật sản phẩm chính thành ID: ${productId}`);









        setTimeout(() => setSuccess(''), 3000);
        }, 500);





};

    // Lọc sản phẩm theo tên hoặc ID
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm)
    );

    // Lấy sản phẩm được chọn
    const selectedProduct = products.find(p => p.id === parseInt(productId || '0'));

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Cấu hình Sản phẩm Mới (Item 1)</h1>
            <p className="text-gray-600 mb-6">Chọn sản phẩm chính hiển thị lớn trên trang chủ</p>
            
            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
                    ✅ {success}
                </div>
            )}
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    ⚠️ {error}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form chọn sản phẩm */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            ID Sản phẩm chính
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                                min="1"
                                className="flex-1 px-3 py-2 border rounded"
                                placeholder="Nhập ID sản phẩm"
                            />
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {saving ? 'Đang lưu...' : 'Lưu'}
                            </button>
                        </div>
                    </div>
                    
                    {/* Xem trước */}
                    {selectedProduct && (
                        <div className="border rounded-lg p-4">
                            <h3 className="font-medium mb-2">Xem trước sản phẩm:</h3>
                            <div className="flex items-center gap-3">
                                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                    <img 
                                        src={selectedProduct.images[0]} 
                                        alt={selectedProduct.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                        <span className="text-gray-500">No image</span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">{selectedProduct.name}</p>
                                    <p className="text-sm text-gray-600">ID: {selectedProduct.id}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Danh sách sản phẩm */}
                <div className="border rounded-lg">
                    <div className="p-3 border-b">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border rounded"
                            />
                        </div>
                    </div>
                    
                    <div className="h-64 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">Đang tải...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">Không tìm thấy sản phẩm</div>
                        ) : (
                            <div className="divide-y">
                                {filteredProducts.slice(0, 20).map(product => (
                                    <div 
                                        key={product.id}
                                        className={`p-3 cursor-pointer hover:bg-gray-50 ${
                                            parseInt(productId) === product.id ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => setProductId(product.id.toString())}
                                    >
                                        <div className="flex items-center gap-3">
                                            {product.images && product.images.length > 0 ? (
                                                <img 
                                                    src={product.images[0]} 
                                                    alt={product.name}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded"></div>
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-sm truncate">{product.name}</p>
                                                <p className="text-xs text-gray-500">ID: {product.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                    <strong>Chú ý:</strong> Chỉ Item 1 (sản phẩm chính) là dynamic. 
                    Item 2 và 3 vẫn sử dụng ảnh cố định từ file <code>bannner2.jpg</code>
                </p>
            </div>
        </div>
    );
}