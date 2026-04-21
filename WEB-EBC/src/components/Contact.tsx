"use client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://ebc-biotech.com/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("Gửi thất bại");
      alert("Đã gửi liên hệ thành công!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      alert("Không gửi được liên hệ");
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
    <Helmet>
      <title>Liên hệ | EBC Biotech – MR.KIT Công nghệ sinh học</title>

      <meta
        name="description"
        content="Liên hệ Công ty TNHH Công nghệ sinh học EBC – MR.KIT. Địa chỉ, hotline, email hỗ trợ khách hàng và bản đồ chỉ đường."
      />

      <link rel="canonical" href="https://ebc-biotech.com/contact" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Liên hệ | EBC Biotech – MR.KIT" />
      <meta
        property="og:description"
        content="Thông tin liên hệ chính thức của Công ty TNHH Công nghệ sinh học EBC – MR.KIT."
      />
      <meta property="og:url" content="https://ebc-biotech.com/contact" />
      <meta
        property="og:image"
        content="https://ebc-biotech.com/favicon.ico"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
    <div className="bg-white px-6 lg:px-20 py-6">
      <ul className="flex items-center m-0 text-sm bg-gray-100 rounded-lg p-2 mb-6">
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
          <span className="mx-2 text-gray-400">{">"}</span>
        </li>
        <li className="text-gray-700">Liên hệ</li>
      </ul>

      <section className="py-4 lg:py-7">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">LIÊN HỆ</h1>

          <div className="bg-white rounded-xl p-6 shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Thông tin liên hệ + form */}
              <div>
                <address className="not-italic mb-6 space-y-2 text-gray-700">
                  <p><b>Địa chỉ:</b> 131 Âu Cơ, Tây Hồ, Hà Nội</p>
                  <p>
                    <b>Hotline:</b>{" "}
                    <a href="tel:0766652886" className="text-blue-600">
                      0766 652 886
                    </a>
                  </p>
                  <p>
                    <b>Email:</b>{" "}
                    <a href="mailto:hotrokhachhang@ebc-biotech.com" className="text-blue-600">
                      hotrokhachhang@ebc-biotech.com
                    </a>
                  </p>
                  <p className="mt-2">
                    Công ty TNHH Công nghệ sinh học EBC
                    <br />
                    GPKD số 0110958109 cấp ngày 18/02/2025 tại Sở tài chính thành phố Hà Nội
                    <br />
                    MR.KIT - SẠCH SÂU LÀNH TÍNH
                  </p>
                </address>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên *"
                    required
                    className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email *"
                    required
                    className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Nội dung *"
                    required
                    className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span className="block text-sm text-gray-500">
                    <span className="text-red-500">*</span> Thông tin bắt buộc
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 font-bold text-white hover:bg-blue-700 transition"
                  >
                    {loading ? "Đang gửi..." : "Gửi"}
                  </button>
                </form>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-xl overflow-hidden w-full h-[500px]">
                <iframe
                  src="https://maps.google.com/maps?q=131%20%C3%82u%20C%C6%A1,%20T%C3%A2y%20H%E1%BB%93,%20H%C3%A0%20N%E1%BB%99i&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ công ty EBC"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
