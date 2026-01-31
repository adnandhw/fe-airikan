import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Context } from "../MyContext";

import AddToCartSuccessModal from "../components/AddToCartSuccessModal";
import LoginRequiredModal from "../components/LoginRequiredModal";

const ProductDetail = () => {
  const { id } = useParams();
  const { product, addToCart, user, setIsLoginModalOpen } = useContext(Context);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  // MongoDB pakai _id tapi API pakai id
  const data = product.find((p) => p.id === id);

  // State for Real-time Date Check
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update current date every second to ensure "Real-time" validity
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data) {
    return (
      <div className="container my-5 text-center">
        <h4>Produk tidak ditemukan</h4>
        <Link to="/" className="btn btn-primary mt-3">Kembali ke Beranda</Link>
      </div>
    );
  }

  const isDiscountActive = data.discount_percentage > 0 && new Date(data.discount_end_date) > currentDate;

  const getRemainingTime = () => {
    if (!isDiscountActive) return "";
    const total = Date.parse(data.discount_end_date) - currentDate;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return `${days}h ${hours}j ${minutes}m ${seconds}d`;
  };

  const discountedPrice = isDiscountActive
    ? data.price - (data.price * (data.discount_percentage / 100))
    : data.price;

  const handleAddToCart = () => {
    if (!user) {
      setLoginMessage("Silakan login terlebih dahulu untuk Tambah Keranjang.");
      setShowLoginRequired(true);
      return;
    }
    setErrorMsg("");

    // Check Stock
    if (data.stock !== undefined && quantity > data.stock) {
      setErrorMsg(`Stok tidak mencukupi (Tersedia: ${data.stock})`);
      window.scrollTo(0, 0); // Scroll to top like Buy Now
      return;
    }

    const effectivePrice = isDiscountActive ? discountedPrice : data.price;
    const itemToAdd = {
      image_url: data.image_url,
      name: data.name,
      category: data.category?.description || "N/A", // Safety check
      type: data.type,
      quantity: quantity,
      stock: data.stock,
      price: effectivePrice,
      discount_percentage: isDiscountActive ? data.discount_percentage : 0,
      discount_duration: isDiscountActive ? data.discount_duration : 0,
      discount_end_date: isDiscountActive ? data.discount_end_date : null,
      addedAt: new Date().toISOString(),
      is_reseller: false,
      weight: data.weight || 0,
      id: data.id // Ensure ID is passed to cart for checkout
    };

    addToCart(itemToAdd);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    const userSlug = user ? (user.username || user.firstName?.toLowerCase()) : "user";
    navigate(`/profile/${userSlug}/carts`);
  };

  const handleIncrement = () => {
    if (data.stock !== undefined && quantity < data.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Allow empty string to let user delete current value while typing
    if (value === "") {
      setQuantity("");
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setQuantity(numValue);
    }
  };

  const handleBlur = () => {
    let numValue = parseInt(quantity, 10);
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1);
    } else if (data.stock !== undefined && numValue > data.stock) {
      setQuantity(data.stock);
    } else {
      setQuantity(numValue);
    }
  };





  const renderDescription = (text) => {
    if (!text) return null;

    let mainDesc = text;
    let advantages = "";
    let warning = "";

    // 1. Extract Warning (defaults to "⚠️ Disarankan" or just "Disarankan")
    const warnMarker = "⚠️ Disarankan";
    const warnParts = mainDesc.split(warnMarker);
    if (warnParts.length > 1) {
      mainDesc = warnParts[0];
      warning = warnParts[1];
    }

    // 2. Extract Advantages
    const advMarker = "✨ Keunggulan:";
    const advParts = mainDesc.split(advMarker);
    if (advParts.length > 1) {
      mainDesc = advParts[0];
      advantages = advParts[1];
    }

    // 2b Clean up Advantages if it looks like a list but has no newlines
    if (advantages && !advantages.includes("\n")) {
      const keywords = ["Aktif", "Cocok", "Adaptif", "Disarankan"];
      keywords.forEach(kw => {
        advantages = advantages.replace(new RegExp(` ${kw}`, 'g'), `\n• ${kw}`);
      });
      if (!advantages.startsWith("•") && !advantages.startsWith("\n")) {
        advantages = "• " + advantages;
      }
    }

    return (
      <div className="description-box">
        {mainDesc && <p className="description-text mb-0">{mainDesc.trim()}</p>}

        {advantages && (
          <div className="desc-section">
            <div className="desc-section-icon">✨</div>
            <div className="desc-section-content">
              <span className="desc-label">Keunggulan</span>
              <p className="desc-value">{advantages.trim()}</p>
            </div>
          </div>
        )}

        {warning && (
          <div className="desc-section" style={{ borderLeft: "3px solid #f87171" }}>
            <div className="desc-section-icon">⚠️</div>
            <div className="desc-section-content">
              <span className="desc-label" style={{ color: "#dc2626" }}>Saran Perawatan</span>
              <p className="desc-value">Disarankan {warning.trim()}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="section-padding">
      <div className="container">
        <AddToCartSuccessModal show={showSuccessModal} onClose={handleCloseModal} />
        <LoginRequiredModal
          show={showLoginRequired}
          onClose={() => setShowLoginRequired(false)}
          onLogin={() => setIsLoginModalOpen(true)}
          message={loginMessage}
        />

        <div className="row g-5">

          {/* 🔹 IMAGE */}
          <div className="col-md-6">
            <div className="detail-image-box position-relative">
              {isDiscountActive && (
                <div className="position-absolute top-0 start-0 m-3 bg-danger text-white px-3 py-2 rounded-3 fw-bold fs-5 z-2 shadow-sm">
                  {data.discount_percentage}% OFF
                </div>
              )}

              {data.stock !== undefined && data.stock > 0 && data.stock <= 5 && (
                <div className="position-absolute top-0 end-0 m-3">
                  <span className="badge bg-warning text-dark fs-6 shadow-sm">
                    Low Stock
                  </span>
                </div>
              )}

              <img
                src={data.image_url}
                alt={data.name}
                className="detail-img"
              />
            </div>


          </div>

          {/* 🔹 INFO */}
          <div className="col-md-6">

            {/* PURCHASE CARD (Now contains ALL Info) */}
            <div className="purchase-card p-3 d-flex flex-column justify-content-between"
              style={{ minHeight: '400px' }}>

              {/* PRODUCT HEADER (Moved Inside) */}
              <div className="mb-2 border-bottom pb-2">
                <h2 className="detail-title" style={{ fontSize: '1.4rem' }}>
                  {data.name}
                </h2>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <p className="detail-type mb-0" style={{ fontSize: '1rem' }}>
                    {data.type}
                  </p>

                  <div className="spec-badge mb-0" style={{ padding: '3px 10px', fontSize: '0.9rem' }}>
                    <span className="spec-label">Ukuran:</span>
                    <strong>{data.size}</strong>
                  </div>
                </div>

                <div className={isDiscountActive ? "mt-0 mb-0" : "my-2"}>
                  {isDiscountActive ? (
                    <div>
                      <span className="text-decoration-line-through text-muted me-2" style={{ fontSize: '1.1rem' }}>
                        Rp {Number(data.price).toLocaleString("id-ID")}
                      </span>
                      <span className="text-danger fw-bold" style={{ fontSize: '1.5rem' }}>
                        Rp {Number(discountedPrice).toLocaleString("id-ID")}
                      </span>
                      <p className="text-danger small mt-0 mb-0" style={{ fontSize: '0.8rem' }}>
                        Promo berakhir: {getRemainingTime()}
                      </p>
                    </div>
                  ) : (
                    <h4 className="detail-price" style={{ fontSize: '1.7rem' }}>
                      Rp {Number(data.price).toLocaleString("id-ID")}
                    </h4>
                  )}
                </div>
              </div>

              {/* ACTION GROUP (Stock, Total, Buttons) - Flex Grow to push down if needed */}
              <div className="d-flex flex-column justify-content-end flex-grow-1">

                {/* STOCK & QUANTITY */}
                {/* QUANTITY & TOTAL ROW */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-3 pb-3 border-bottom gap-3 gap-md-0">
                  {/* QUANTITY CONTROL (Left) */}
                  <div className="w-100 w-md-auto">
                    <span className="fw-semibold text-secondary small text-uppercase ls-1 d-block mb-1" style={{ fontSize: '0.85rem' }}>Jumlah Pembelian</span>

                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <div className="input-group" style={{ width: "125px", borderRadius: "8px", overflow: "hidden", border: "1px solid #ced4da" }}>
                        <button
                          className="btn btn-light bg-white border-0"
                          type="button"
                          onClick={handleDecrement}
                          disabled={quantity <= 1 || (data.stock !== undefined && data.stock === 0)}
                          style={{ borderRadius: 0, width: "35px" }}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="text"
                          className="form-control text-center border-0 bg-white"
                          value={data.stock === 0 ? 0 : quantity}
                          onChange={handleQuantityChange}
                          onBlur={handleBlur}
                          style={{ backgroundColor: 'white', fontWeight: '500', width: "55px", padding: 0, fontSize: '1rem' }}
                          disabled={data.stock !== undefined && data.stock === 0}
                        />
                        <button
                          className="btn btn-light bg-white border-0"
                          type="button"
                          onClick={handleIncrement}
                          disabled={data.stock !== undefined && quantity >= data.stock}
                          style={{ borderRadius: 0, width: "35px" }}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>

                      {/* Stock Display */}
                      {data.stock !== undefined && (
                        <div className="w-100 w-sm-auto">
                          <span className={data.stock === 0 ? "text-danger fw-medium" : "text-muted fw-medium"} style={{ fontSize: '0.9rem' }}>
                            {data.stock === 0 ? "Stok Habis" : `Tersedia: ${data.stock}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {data.stock !== undefined && quantity >= data.stock && data.stock > 0 && (
                      <small className="text-danger d-block mt-1" style={{ fontSize: '0.8rem' }}>
                        Maksimal stok tercapai ({data.stock} pcs)
                      </small>
                    )}
                  </div>

                  {/* TOTAL ESTIMASI (Right) */}
                  <div className="d-flex flex-column align-items-start align-items-md-end w-100 w-md-auto">
                    <span className="text-secondary small mb-1" style={{ fontSize: '0.9rem' }}>Total Estimasi</span>
                    <h4 className="text-success fw-bold m-0" style={{ fontSize: '1.25rem' }}>
                      Rp {Number((isDiscountActive ? discountedPrice : data.price) * (Number(quantity) || 0)).toLocaleString("id-ID")}
                    </h4>
                    <small className="text-muted fst-italic" style={{ fontSize: '0.8rem' }}>
                      (Belum termasuk Biaya Pengiriman)
                    </small>
                  </div>
                </div>



                {/* ACTION BUTTONS */}
                <div>
                  {errorMsg && (
                    <div className="alert alert-danger py-1 mb-2 small text-center" role="alert" style={{ fontSize: '0.75rem' }}>
                      {errorMsg}
                    </div>
                  )}
                  <div className="d-grid gap-2">
                    <button
                      className="primaryBtn justify-content-center"
                      onClick={handleAddToCart}
                      disabled={data.stock !== undefined && data.stock === 0}
                      style={{ opacity: (data.stock !== undefined && data.stock === 0) ? 0.6 : 1, height: '38px', fontSize: '0.9rem' }}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      Tambah Keranjang
                    </button>


                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* 🔹 DESCRIPTION (Moved to Bottom for Mobile Flow) */}
        <div className="row mt-1">
          <div className="col-12">
            {renderDescription(data.description)}
          </div>
        </div>

      </div>

    </section >
  );
};

export default ProductDetail;
