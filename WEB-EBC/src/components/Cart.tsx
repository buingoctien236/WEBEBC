import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  X,
  Package,

  Phone,

  ShoppingBag,
  Home
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discountPercent?: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      setCartItems(parsed);
      setSelectedItems(parsed.map((i: CartItem) => i.id));
    }
    setLoading(false);
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const calculateTotal = () => {
    return cartItems
      .filter(i => selectedItems.includes(i.id))
      .reduce((sum, i) => sum + i.price * i.quantity, 0);
  };

  const total = calculateTotal();

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1 || quantity > 100) return;

    const updated = cartItems.map(i =>
      i.id === id ? { ...i, quantity } : i
    );

    setCartItems(updated);
    saveCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter(i => i.id !== id);
    setCartItems(updated);
    setSelectedItems(prev => prev.filter(x => x !== id));
    saveCart(updated);
  };

  const removeSelectedItems = () => {
    if (selectedItems.length === 0) return;
    
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedItems.length} sản phẩm đã chọn?`)) {
      return;
    }
    
    const updated = cartItems.filter(i => !selectedItems.includes(i.id));
    setCartItems(updated);
    setSelectedItems([]);
    saveCart(updated);
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(i => i.id));
    }
  };

  // Toast notification system
  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    const newToast: Toast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleCheckout = async () => {
    if (!fullName || !phone || selectedItems.length === 0) {
      showToast('error', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Phone validation
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone)) {
      showToast('error', 'Số điện thoại không hợp lệ');
      return;
    }

    // Email validation (optional)
    if (email && !email.includes('@')) {
      showToast('error', 'Email không hợp lệ');
      return;
    }

    setIsSubmitting(true);

    const items = cartItems
      .filter(i => selectedItems.includes(i.id))
      .map(i => ({
        productName: i.name,
        quantity: i.quantity,
        price: i.price,
      }));

    const payload = {
      fullName,
      phone,
      email: email || `${phone}@mrkit.vn`, // Default email if not provided
      items,
      total,
    };

    try {
      const res = await fetch("https://ebc-biotech.com/api/order/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đặt hàng thất bại');
      }

      if (data.success) {
        showToast('success', data.message || 'Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        
        // Remove purchased items from cart
        const remainingItems = cartItems.filter(i => !selectedItems.includes(i.id));
        setCartItems(remainingItems);
        setSelectedItems([]);
        saveCart(remainingItems);
        
        // Trigger cart update event
        const event = new CustomEvent('cartUpdated');
        window.dispatchEvent(event);
        
        // Reset form
        setFullName("");
        setPhone("");
        setEmail("");
        
        // Show success modal for 3 seconds
        setTimeout(() => {
          if (remainingItems.length === 0) {
            navigate('/');
          }
        }, 3000);
      } else {
        throw new Error(data.message || 'Đặt hàng thất bại');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Không gửi được đơn hàng');
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (!loading && cartItems.length === 0) {
    return (
      <div className="bg-white px-4 sm:px-6 lg:px-20 py-2">
        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`flex items-center justify-between max-w-md p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                toast.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1 rounded-full ${toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {toast.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{toast.message}</p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`ml-4 p-1 rounded-full hover:bg-opacity-20 ${
                  toast.type === 'success' 
                    ? 'hover:bg-green-800 text-green-600' 
                    : 'hover:bg-red-800 text-red-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Breadcrumb */}
        <ul className="flex items-center m-0 text-sm bg-gray-100 rounded-lg p-2 mb-4">
          <li className="flex items-center">
            <a
              href="/"
              title="Trang chủ"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </a>
            <span className="mx-2 text-gray-400">{'>'}</span>
          </li>
          <li className="text-gray-700">Giỏ hàng</li>
        </ul>

        {/* Empty Cart */}
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
            <ShoppingCart className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá cửa hàng và thêm sản phẩm yêu thích nhé!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shops")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              Tiếp tục mua sắm
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-20 py-2">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between max-w-md p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
              toast.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-full ${toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                {toast.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-4 p-1 rounded-full hover:bg-opacity-20 ${
                toast.type === 'success' 
                  ? 'hover:bg-green-800 text-green-600' 
                  : 'hover:bg-red-800 text-red-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      <ul className="flex items-center m-0 text-sm bg-gray-100 rounded-lg p-2 mb-4">
        <li className="flex items-center">
          <a
            href="/"
            title="Trang chủ"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </a>
          <span className="mx-2 text-gray-400">{'>'}</span>
        </li>
        <li className="text-gray-700">Giỏ hàng</li>
      </ul>

      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn</h1>
        <p className="text-gray-600">
          Bạn đang có <span className="font-semibold text-blue-600">{cartItems.length}</span> sản phẩm trong giỏ hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2">
          {/* Cart Header */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Chọn tất cả ({cartItems.length} sản phẩm)
                </label>
              </div>
              
              {selectedItems.length > 0 && (
                <button
                  onClick={removeSelectedItems}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa đã chọn
                </button>
              )}
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="flex-shrink-0 w-24 h-24">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-2">
                          <span className="text-xl font-bold text-red-600">
                            {formatPrice(item.price)}
                          </span>
                          {item.discountPercent && item.discountPercent > 0 && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                              -{item.discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-gray-700 mr-4">Số lượng:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center py-1 focus:outline-none border-x border-gray-300"
                          />
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 100}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Total Price for this item */}
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Thành tiền:</div>
                        <div className="text-lg font-bold text-red-600">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/shops")}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            {/* Order Summary Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin đặt hàng</h2>
              
              <div className="space-y-4">
                {/* Customer Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                   
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Họ tên *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ tên"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Số điện thoại *</label>
                    <div className="flex items-center">

                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                        required
                        className="flex-1 rounded-r-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email (tùy chọn)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email để nhận xác nhận"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Số sản phẩm:</span>
                    <span className="font-medium">{selectedItems.length}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Tổng tiền:</span>
                      <div className="text-right">
                        <div className="text-2xl lg:text-3xl font-bold text-red-600">
                          {formatPrice(total)}
                        </div>
                        {selectedItems.length > 0 && (
                          <div className="text-sm text-gray-500 mt-1">
                            ({selectedItems.length} sản phẩm)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0 || isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold text-white transition-colors mt-4 ${
                    selectedItems.length === 0 || isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Đặt hàng ngay
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-gray-500 mt-2">
                  Bằng cách đặt hàng, bạn đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
                </div>
              </div>
            </div>

            {/* Order Note */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">Hỗ trợ đặt hàng</p>
                    <p className="text-sm text-gray-600">Gọi ngay: 0766 652 886</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-2">Sau khi đặt hàng:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Nhận email xác nhận đơn hàng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Nhân viên gọi điện xác nhận trong 15 phút</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Giao hàng tận nơi trong 2-4 ngày</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Tổng tiền:</div>
            <div className="text-xl font-bold text-red-600">{formatPrice(total)}</div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={selectedItems.length === 0 || isSubmitting}
            className={`px-6 py-3 rounded-lg font-bold text-white ${
              selectedItems.length === 0 || isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSubmitting ? 'Đang xử lý...' : `Đặt hàng (${selectedItems.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}