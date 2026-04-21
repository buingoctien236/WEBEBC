import gioithieu from '../imgs/gioithieu.png';
import gioithieu2 from '../imgs/gioithieu2.png';
export default function AboutPage() {

  return (
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
      {/* Hero Section */}
      <section className="py-16 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="mb-8 bg-green-600 px-6 py-2 rounded-xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold ">
              Giới Thiệu Về EBC
            </h1>
          </div>
          <img
            src={gioithieu}
            alt=""
            className="mx-auto"
          />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center pt-8">
            <div className="mb-8 bg-green-600 px-6 py-4 rounded-xl text-white">

              <h1 className="text-2xl md:text-4xl font-bold ">
                Hiệu Quả Vượt Trội
              </h1>

            </div>
            <div className="mb-8 bg-green-600 px-6 py-4 rounded-xl text-white">

              <h1 className="text-2xl md:text-4xl font-bold">
                An Toàn Tuyệt Đối
              </h1>

            </div>
            <div className="mb-8 bg-green-600 px-6 py-4 rounded-xl text-white">

              <h1 className="text-2xl md:text-4xl font-bold">
                100% Thuần Chay
              </h1>

            </div>
          </div>
          <img
            src={gioithieu2}
            alt=""
            className="mx-auto"
          />
        </div>

      </section>






    </div>
  );
}