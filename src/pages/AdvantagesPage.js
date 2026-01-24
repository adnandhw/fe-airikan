import React from "react";
import { Link } from "react-router-dom";

const AdvantagesPage = () => {
    const gradientTextStyle = {
        background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block"
    };

    const advantages = [
        {
            icon: "bi-collection-fill",
            color: "text-primary",
            bg: "rgba(59, 130, 246, 0.1)", // blue
            title: "Koleksi Lengkap & Variatif",
            desc: "Tersedia berbagai jenis ikan hias dan ikan predator dengan pilihan ukuran dan karakter yang beragam, cocok untuk penghobi pemula hingga kolektor."
        },
        {
            icon: "bi-heart-pulse-fill",
            color: "text-danger",
            bg: "rgba(239, 68, 68, 0.1)", // red
            title: "Perawatan Profesional",
            desc: "Setiap ikan dirawat dengan perhatian khusus, mulai dari kualitas air, pakan bernutrisi, hingga pemantauan rutin untuk menjaga kesehatan ikan."
        },
        {
            icon: "bi-briefcase-fill",
            color: "text-info",
            bg: "rgba(6, 182, 212, 0.1)", // cyan
            title: "Peluang Mitra Reseller",
            desc: "Air Ikan membuka kesempatan kemitraan bagi reseller dengan sistem yang jelas dan menguntungkan, mendukung pengembangan bisnis bersama."
        },
        {
            icon: "bi-tags-fill",
            color: "text-success",
            bg: "rgba(16, 185, 129, 0.1)", // green
            title: "Harga Bersahabat & Transparan",
            desc: "Kami menawarkan harga kompetitif dengan informasi yang jelas, sehingga pelanggan dapat berbelanja dengan nyaman dan percaya."
        },
        {
            icon: "bi-globe",
            color: "text-primary",
            bg: "rgba(37, 99, 235, 0.1)", // indigo-ish
            title: "Mudah Diakses Secara Online",
            desc: "Melalui website e-katalog, pelanggan dapat melihat produk, informasi ikan, dan promo terbaru kapan saja dan di mana saja."
        },
        {
            icon: "bi-headset",
            color: "text-warning",
            bg: "rgba(245, 158, 11, 0.1)", // amber
            title: "Pelayanan Ramah & Konsultatif",
            desc: "Kami siap membantu pelanggan dengan layanan konsultasi untuk memilih ikan yang sesuai dengan kebutuhan dan lingkungan akuarium."
        }
    ];

    return (
        <section className="section-padding">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold mb-3" style={gradientTextStyle}>Keunggulan Air Ikan Store</h2>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                        Komitmen kami untuk memberikan pengalaman terbaik bagi pecinta ikan hias dan ikan predator.
                    </p>
                </div>

                <div className="row g-4 mb-5">
                    {advantages.map((item, index) => (
                        <div className="col-md-6 col-lg-4 text-center" key={index}>
                            <div className="p-4 h-100 rounded-4 shadow-sm hover-shadow transition-all bg-white element-hover">
                                <div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle icon-box"
                                    style={{ width: "80px", height: "80px", background: item.bg }}>
                                    <i className={`bi ${item.icon} fs-1 ${item.color}`}></i>
                                </div>
                                <h3 className="h5 fw-bold mb-3">{item.title}</h3>
                                <p className="text-secondary mb-0 small lh-lg">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center bg-light rounded-4 p-5 position-relative overflow-hidden">
                    <div className="position-relative z-1">
                        <h3 className="fw-bold mb-3">Siap untuk memelihara ikan impian Anda?</h3>
                        <p className="text-muted mb-4">Temukan koleksi ikan hias terbaik kami sekarang juga.</p>
                        <Link to="/product" className="primaryBtn btn-lg px-5">
                            Belanja Sekarang
                        </Link>
                    </div>
                </div>

                <style>
                    {`
            .hover-shadow:hover {
                transform: translateY(-8px);
                box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
            }
            .transition-all {
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .element-hover:hover .icon-box {
                transform: scale(1.1) rotate(5deg);
                transition: transform 0.3s ease;
            }
        `}
                </style>
            </div>
        </section>
    );
};

export default AdvantagesPage;
