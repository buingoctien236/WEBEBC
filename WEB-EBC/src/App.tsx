import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import ProductGrid from './components/ProductGrid';
import ImageUpload from './components/ImageUpload';
import AboutPage from './components/AboutPage';
import FlashSaleCountdown from './components/FlashSaleCountdown';

import Contact from './components/Contact';
import Shops from './components/Shops';
import MarqueeBanner from './components/MarqueeBanner';
import AdminLogin from './components/AdminLogin';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import Layout from './components/Layout';
import ProductsList from './components/admin/ProductsList';
import AddProduct from './components/admin/AddProduct';
import EditProduct from './components/admin/EditProduct';
import ViewProduct from './components/ViewProduct';
import Spotlight from './components/admin/Spotlight';
import NewProducts from './components/NewProduct';
import EditNewProductImg from './components/admin/EditNewProductImg';
import NewsList from './components/NewsList';
import NewsManager from './components/admin/NewsManager';
import NewsDetail from './components/NewDetail';
import NewsListLarge from './components/NewsListLarge';
import AdminBanner from './components/admin/AdminBanner';
import AdminLogs from './components/admin/AdminLogs';
import AdminFlashSaleCreate from './components/admin/AdminFlashSaleCreate';
import AdminFlashSaleDetail from './components/admin/AdminFlashSaleDetail';
import AdminFlashSaleList from './components/admin/AdminFlashSaleList';
import Cart from './components/Cart';
import { HelmetProvider } from "react-helmet-async";
import HomeSEO from "./components/seo/HomeSEO";

function App() {
  return (
        <HelmetProvider>

    <Router>
      <div className="min-h-screen bg-[#e7ece9] pt-2 p-4 ">
        <div className='rounded-[10px] pl-[10px] pr-[10px] bg-white'>
          {/* Xóa Header và Footer từ đây */}
          <Routes>
            {/* Trang chủ - Có Header và Footer */}
            <Route path="/" element={
              <Layout>
                    <HomeSEO />
                <div className="px-7">
                  <Banner />
                </div>
                <NewProducts />
                <ProductGrid />
                <MarqueeBanner />
                <FlashSaleCountdown />
                <NewsList />




                <section className="max-w-7xl mx-auto pl-[120px] py-16">
                  <div className="max-w-3xl">
                    {/* Icon quote */}
                    <svg
                      width="100"
                      height="100"
                      className="text-green-600 mb-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.17 6A5.001 5.001 0 0 0 3 11v7h7v-7H6.83A3.001 3.001 0 0 1 9 8.17V6H7.17zm10 0A5.001 5.001 0 0 0 13 11v7h7v-7h-3.17A3.001 3.001 0 0 1 19 8.17V6h-1.83z" />
                    </svg>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      Mr.KIT CHÀO BẠN!
                    </h2>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                      Mr.KIT mong muốn trở thành người bạn đồng hành của mọi gia đình và doanh nghiệp,
                      mang tới không gian sạch – xanh, giúp bạn yên tâm tận hưởng cuộc sống.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                      Chúng tôi phát triển hệ sinh thái sản phẩm đa dạng mang đến sự hài lòng không gian
                      sống sạch – sống xanh – sống hiện đại của gia đình Việt.
                    </p>

                    <p className="text-green-600 font-semibold mt-6 text-lg">
                      Mr.KIT – CÔNG NGHỆ XANH CHO CUỘC SỐNG AN LÀNH
                    </p>

                    {/* Button */}
                    <div className="mt-8">
                      <a
                        href="/about"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
                      >
                        Xem thêm
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M6 3l4 5-4 5" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </section>




              </Layout>
            } />

            {/* Trang giới thiệu - Có Header và Footer */}
            <Route path="/about" element={
              <Layout>
                <AboutPage />
              </Layout>
            } />
            {/* Trang giới thiệu - Có Header và Footer */}
            <Route path="/cart" element={
              <Layout>
                <Cart />
              </Layout>
            } />
               {/* Trang giới thiệu - Có Header và Footer */}
            <Route path="/news/:id" element={
              <Layout>
                <NewsDetail />
              </Layout>
            } />
           
            

            {/* Trang Liên hệ - Có Header và Footer */}
            <Route path="/contact" element={
              <Layout>
                <Contact />
              </Layout>
            } />
 <Route path="/newlistlarge" element={
              <Layout>
                <NewsListLarge />
              </Layout>
            } />
            {/* Trang Cửa hàng - Có Header và Footer */}
            <Route path="/shops" element={
              <Layout>
                <Shops />
              </Layout>
            } />
            <Route path="/products/:id" element={
              <Layout>
                <ViewProduct />
              </Layout>
            } />

            {/* Trang admin - KHÔNG có Header và Footer */}
            <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLogin />} />

            <Route
              path="/admin/upload"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ImageUpload />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/banner"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminBanner />
                  </AdminLayout>
                </AdminRoute>
              }
            />
           
            <Route
              path="/admin/productlist"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ProductsList />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/addproduct"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AddProduct />
                  </AdminLayout>
                </AdminRoute>
              }




            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRoute>
                  <AdminLayout title="Sửa sản phẩm">
                    <EditProduct />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/flashsale/:id"
              element={
                <AdminRoute>
                  <AdminLayout title="Xem chi tiết Flash Sale">
                    <AdminFlashSaleDetail />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/spotlights"
              element={
                <AdminRoute>
                  <AdminLayout title="SP tiêu biểu">
                    <Spotlight />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/imgnewproduct"
              element={
                <AdminRoute>
                  <AdminLayout title="Cập nhật ảnh SP mới">
                    <EditNewProductImg />
                  </AdminLayout>
                </AdminRoute>
              }
            />
             <Route
              path="/admin/news"
              element={
                <AdminRoute>
                  <AdminLayout title="Quản lý tin tức">
                    <NewsManager />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/flashsales"
              element={
                <AdminRoute>
                  <AdminLayout title="Quản lý flash sales">
                    <AdminFlashSaleList />
                  </AdminLayout>
                </AdminRoute>
              }
            />
             <Route
              path="/admin/flashsales"
              element={
                <AdminRoute>
                  <AdminLayout title="Quản lý flash sales">
                    <AdminFlashSaleList />
                  </AdminLayout>
                </AdminRoute>
              }
            />
             <Route
              path="/admin/flashsalecreate"
              element={
                <AdminRoute>
                  <AdminLayout title="Quản lý flash sales">
                    <AdminFlashSaleCreate />
                  </AdminLayout>
                </AdminRoute>
              }
            />
             <Route
              path="/admin/adminlogs"
              element={
                <AdminRoute>
                  <AdminLayout title="Quản lý nhật ký hoạt động">
                    <AdminLogs />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/flashsales/:id "
              element={
                <AdminRoute>
                  <AdminLayout title="Quản lý flash sales">
                    <AdminFlashSaleDetail/>
                  </AdminLayout>
                </AdminRoute>
              }
            />

          </Routes>

        </div>
      </div>
    </Router>
        </HelmetProvider>
  );
}

export default App;