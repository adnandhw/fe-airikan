import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {


  const socialMedia = [
    {
      name: "Instagram",
      link: "https://www.instagram.com/airikan2021/",
      icon: "bi-instagram",
      color: "#E1306C",
    },
    {
      name: "Facebook",
      link: "https://www.facebook.com/robert.tanujaya.7",
      icon: "bi-facebook",
      color: "#1877F2",
    },
    {
      name: "TikTok",
      link: "https://www.tiktok.com/@air_ikan",
      icon: "bi-tiktok",
      color: "#000000",
    },
  ];

  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-title text-center d-flex flex-column align-items-center mb-3">
          <h2 className="main-title">Tentang Kami</h2>
          <p className="text-muted mt-2" style={{ maxWidth: '600px' }}>
            Memperkenalkan Air Ikan Store sebagai usaha yang tumbuh dari hobi dan kecintaan terhadap ikan hias dan ikan predator,
            serta komitmen kami dalam melayani para pecinta ikan.
          </p>
        </div>

        <div className="row g-3">

          {/* Left Column: Contact Info & Map */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
              {/* History Section (Replaces Map) */}
              <div className="p-4 border-bottom">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                    <i className="bi bi-shop-window fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-0">Tentang Kami</h4>
                </div>
                <p className="text-secondary mx-2" style={{ lineHeight: "1.8", textAlign: "justify" }}>
                  Air Ikan Store merupakan usaha mikro yang bergerak di bidang penjualan ikan hias dan ikan predator air tawar.
                  Usaha ini berdiri sejak tahun 2021 sebagai bentuk respon terhadap meningkatnya minat masyarakat terhadap hobi memelihara ikan hias dan ikan predator,
                  baik sebagai sarana hiburan, elemen dekorasi, maupun koleksi pribadi.</p>
                <p className="text-secondary mx-2" style={{ lineHeight: "1.8", textAlign: "justify" }}>
                  Berlokasi di wilayah Otista, Jakarta Timur, serta di Pasar Ikan Hias Jatinegara Jakarta Timur Lapak No. 139, Air Ikan Store hadir untuk menyediakan beragam pilihan ikan berkualitas dengan perawatan yang baik dan sehat.
                  Selain itu, Air Ikan Store berkomitmen menghadirkan ikan dengan kualitas terbaik melalui perawatan yang optimal dan terpercaya.</p>
                <p className="text-secondary mx-2" style={{ lineHeight: "1.8", textAlign: "justify" }}>
                  Dengan mengutamakan kualitas produk dan kepuasan pelanggan, Air Ikan Store berkomitmen untuk menjadi mitra terpercaya bagi para pecinta ikan hias dan ikan predator,
                  baik pemula maupun penghobi berpengalaman.</p>
              </div>

              <div className="card-body p-4 border-top">
                <Link to="/keunggulan" className="d-flex align-items-center gap-3 text-decoration-none text-dark">
                  <div className="bg-warning p-3 rounded-circle text-white">
                    <i className="bi bi-star-fill fs-4 "></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Keunggulan Kami</h5>
                    <p className="text-secondary mb-0">Kenapa memilih Air Ikan Otista?</p>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-secondary"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Channels */}
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-4">

              {/* Google Maps Card */}
              <div className="card border-0 shadow-sm rounded-4 p-2 hover-effect">
                <div className="card-body p-2">
                  <div className="d-flex align-items-start gap-3">
                    <div className="bg-light p-2 rounded-circle text-primary">
                      <i className="bi bi-geo-alt-fill fs-4"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Kunjungi Toko Kami</h5>
                      <p className="text-secondary mb-0">Air Ikan, Jakarta Timur, Indonesia</p>
                    </div>
                  </div>
                </div>
                {/* Map Preview */}
                <div className="rounded-3 overflow-hidden border" style={{ height: "431px" }}>
                  <iframe
                    title="Toko Kami"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d991.939247043021!2d106.8651917!3d-6.2294879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f385e893ddbf%3A0x12960d2dfbdda39a!2sAir%20Ikan!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </div>



              {/* Social Media */}
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h5 className="fw-bold mb-4">Ikuti Kami</h5>
                <div className="d-flex gap-3 flex-wrap">
                  {socialMedia.map((item) => (
                    <a
                      key={item.name}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: '50px', height: '50px', transition: 'all 0.3s' }}
                      title={item.name}
                      onMouseEnter={(e) => e.currentTarget.style.color = item.color}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                    >
                      <i className={`bi ${item.icon} fs-5`}></i>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
