import { Helmet } from "react-helmet-async";

export default function HomeSEO() {
  return (
    <Helmet>
      <title>Mr.KIT – Công nghệ xanh cho cuộc sống an lành | EBC Biotech</title>
      <meta
        name="description"
        content="Mr.KIT là thương hiệu công nghệ xanh của EBC Biotech, cung cấp các sản phẩm tẩy rửa sinh học an toàn, thân thiện môi trường cho gia đình và doanh nghiệp EBC, Mr.Kit, SC-1000."
      />
      <link rel="canonical" href="https://ebc-biotech.com/" />
    </Helmet>
  );
}
