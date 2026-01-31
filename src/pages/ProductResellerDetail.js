import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import axios from "axios";
import { Context } from "../MyContext";

import AddToCartSuccessModal from "../components/AddToCartSuccessModal";
import LoginRequiredModal from "../components/LoginRequiredModal";

const ProductResellerDetail = () => {
    const { id } = useParams();
    const { productReseller, product, addToCart, user, setIsLoginModalOpen } = useContext(Context);
    const [quantity, setQuantity] = useState(10); // Start at 10
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLoginRequired, setShowLoginRequired] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");

    const tableContainerRef = useRef(null); // Ref for scrolling

    const data = productReseller.find((p) => (p.id || p._id) === id);

    // 🔹 HARDCODED WHOLESALE DATA FOR ORINOCO PEACOCK BASS (User Request)
    if (data && (data.name.toLowerCase().includes("peacock") || data.name.toLowerCase().includes("orinoco"))) {
        data.tier_pricing = [
            { quantity: 10, discount_percentage: 5, unit_price: 190000 },
            { quantity: 20, discount_percentage: 6, unit_price: 188000 },
            { quantity: 30, discount_percentage: 7, unit_price: 186000 },
            { quantity: 40, discount_percentage: 8, unit_price: 184000 },
            { quantity: 50, discount_percentage: 9, unit_price: 182000 },
            { quantity: 100, discount_percentage: 20, unit_price: 160000 },
        ];
    }

    // 🔹 HARDCODED WHOLESALE DATA FOR GIBICEP PLECO (User Request)
    if (data && data.name.toLowerCase().includes("gibicep")) {
        data.tier_pricing = [
            { quantity: 10, discount_percentage: 3, unit_price: 48500 },
            { quantity: 20, discount_percentage: 4, unit_price: 48000 },
            { quantity: 30, discount_percentage: 5, unit_price: 47500 },
            { quantity: 40, discount_percentage: 6, unit_price: 47000 },
            { quantity: 50, discount_percentage: 7, unit_price: 46500 },
            { quantity: 100, discount_percentage: 15, unit_price: 42500 },
        ];
    }

    // Resolve Effective Stock from Parent Product if linked
    const parentProduct = product.find(p => p.id === data?.product_id || p._id === data?.product_id);
    const effectiveStock = parentProduct ? parentProduct.stock : (data?.stock !== undefined ? data.stock : 0);

    // Auto-scroll effect for wholesale table
    useEffect(() => {
        if (tableContainerRef.current) {
            const activeRows = tableContainerRef.current.querySelectorAll('.table-primary');
            if (activeRows.length > 0) {
                const lastActiveRow = activeRows[activeRows.length - 1];
                lastActiveRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [quantity]);

    if (!data) {
        return (
            <div className="container my-5 text-center">
                <h4>Produk Reseller tidak ditemukan</h4>
                <Link to="/" className="btn btn-primary mt-3">Kembali ke Home</Link>
            </div>
        );
    }

    // Tiered Pricing Logic
    const sortedTiers = data.tier_pricing
        ? [...data.tier_pricing].sort((a, b) => b.quantity - a.quantity)
        : [];

    const getPriceForQuantity = (qty) => {
        if (!sortedTiers.length) return data.price;
        const tier = sortedTiers.find((t) => qty >= t.quantity);
        // Effective Price: Use explicit unit_price if available, otherwise calculate or fallback
        if (tier) {
            if (tier.unit_price) {
                return tier.unit_price;
            }
            // Fallback if unit_price is missing but discount_percentage exists
            if (tier.discount_percentage) {
                return data.price * (1 - tier.discount_percentage / 100);
            }
        }
        return data.price;
    };

    const effectivePrice = getPriceForQuantity(quantity || 0);

    const handleAddToCart = () => {
        if (!user) {
            setLoginMessage("Silakan login terlebih dahulu untuk Tambah Keranjang.");
            setShowLoginRequired(true);
            return;
        }

        // Safety check just in case
        if (quantity < 10 || quantity % 10 !== 0) {
            setErrorMsg("Jumlah pembelian harus kelipatan 10 (10, 20, 30, dst).");
            window.scrollTo(0, 0); // Scroll to top like Buy Now
            return;
        }

        setErrorMsg("");

        // Check Stock
        if (quantity > effectiveStock) {
            setErrorMsg(`Stok tidak mencukupi (Tersedia: ${effectiveStock})`);
            window.scrollTo(0, 0); // Scroll to top like Buy Now
            return;
        }

        const itemToAdd = {
            image_url: data.image_url,
            name: data.name,
            category: data.category?.description || "N/A",
            type: data.type,
            quantity: quantity,
            stock: effectiveStock,
            price: effectivePrice,
            addedAt: new Date().toISOString(),
            is_reseller: true, // Optional flag
            weight: data.weight || 0,
            tier_pricing: data.tier_pricing,
            base_price: data.price,
            id: data.id || data._id,
            _id: data._id || data.id
        };

        addToCart(itemToAdd);
        setShowSuccessModal(true);
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        const userSlug = user ? (user.username || user.firstName?.toLowerCase()) : "user";
        navigate(`/profile/${userSlug}/carts`);
    };

    // MULTIPLES OF 10 LOGIC
    const handleIncrement = () => {
        const newQty = quantity + 10;
        if (newQty > effectiveStock) {
            // Cap at effective Stock or do nothing (button should be disabled)
        } else {
            setQuantity(newQty);
        }
    };

    const handleDecrement = () => {
        if (quantity > 10) {
            setQuantity(prev => prev - 10);
            setErrorMsg("");
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

                <div className="row g-3 align-items-stretch">

                    {/* 🔹 IMAGE */}
                    <div className="col-md-6">
                        <div className="detail-image-box position-relative" style={{ height: '500px' }}>

                            <div className="position-absolute top-0 end-0 m-3 d-flex flex-column align-items-end gap-2">
                                <span className="badge bg-primary text-white fs-6 shadow-sm">
                                    Reseller Product
                                </span>
                                {effectiveStock > 0 && effectiveStock <= 20 && (
                                    <span className="badge bg-warning text-dark fs-6 shadow-sm">
                                        Low Stock
                                    </span>
                                )}
                            </div>
                            <img
                                src={data.image_url}
                                alt={data.name}
                                className="detail-img"
                            />
                        </div>

                    </div>

                    {/* 🔹 INFO */}
                    <div className="col-md-6">

                        <div className="purchase-card p-3 d-flex flex-column" style={{ minHeight: '400px' }}>

                            {/* HEADER SECTION: Title, Type, Price */}
                            <div className="mb-2 border-bottom pb-2">
                                <h2 className="detail-title" style={{ fontSize: '1.25rem' }}>
                                    {data.name}
                                </h2>

                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <p className="detail-type mb-0" style={{ fontSize: '0.85rem' }}>
                                        {data.type}
                                    </p>

                                    <div className="spec-badge mb-0" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                                        <span className="spec-label">Ukuran:</span>
                                        <strong>{data.size}</strong>
                                    </div>

                                    {data.weight > 0 && (
                                        <div className="spec-badge mb-0" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                                            <span className="spec-label">Berat:</span>
                                            <strong>{data.weight} g / pcs</strong>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-1">
                                    {effectivePrice < data.price && (
                                        <h6 className="text-decoration-line-through text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                            Rp {Number(data.price).toLocaleString("id-ID")}
                                        </h6>
                                    )}
                                    <h4 className="detail-price m-0" style={{ fontSize: '1.35rem' }}>
                                        Rp {Number(effectivePrice).toLocaleString("id-ID")}
                                        <span className="text-muted fs-6 ms-1 fw-normal" style={{ fontSize: '0.9rem' }}>/ pcs</span>
                                    </h4>
                                </div>
                            </div>

                            {/* WHOLESALE TABLE (Scrollable if needed, compacted) */}
                            {sortedTiers.length > 0 && (
                                <div className="border rounded-3 p-2 mb-3 bg-light">
                                    <h6 className="fw-bold mb-1" style={{ fontSize: '0.80rem' }}>Harga Grosir</h6>
                                    <div className="table-responsive" ref={tableContainerRef} style={{ maxHeight: '130px' }}>
                                        <table className="table table-sm table-bordered mb-0 bg-white" style={{ fontSize: '0.8rem' }}>
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="py-1 px-1">Min. Qty</th>
                                                    <th className="py-1 px-1">Diskon</th>
                                                    <th className="py-1 px-1">Harga Satuan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedTiers.slice().reverse().map((tier, index) => {
                                                    let finalPrice = tier.unit_price;
                                                    if (!finalPrice && tier.discount_percentage) {
                                                        finalPrice = data.price * (1 - tier.discount_percentage / 100);
                                                    }
                                                    return (
                                                        <tr key={index} className={quantity >= tier.quantity ? "table-primary fw-bold" : ""}>
                                                            <td className="py-1 px-1">{tier.quantity} pcs</td>
                                                            <td className="text-danger py-1 px-1">{Number(tier.discount_percentage || 0).toLocaleString("id-ID")}%</td>
                                                            <td className="py-1 px-1">Rp {Number(finalPrice).toLocaleString("id-ID")}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ACTION GROUP (Quantity, Total, Buttons) */}
                            <div className="mt-auto">
                                {/* QUANTITY & TOTAL ROW */}
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-3 pb-3 border-bottom gap-3 gap-md-0">
                                    {/* QUANTITY CONTROL (Left) */}
                                    <div className="w-100 w-md-auto">
                                        <div className="d-flex flex-column align-items-start gap-1 mb-2">
                                            <span className="fw-semibold text-secondary small text-uppercase ls-1 d-block mb-1" style={{ fontSize: '0.75rem' }}>Jumlah Pembelian</span>
                                            <span className={effectiveStock === 0 ? "text-danger fw-medium" : "text-muted fw-medium"} style={{ fontSize: '0.8rem' }}>
                                                {effectiveStock === 0 ? "Stok Habis" : `Tersedia: ${effectiveStock}`}
                                            </span>
                                        </div>
                                        <div className="d-flex flex-wrap align-items-center gap-2">
                                            <div className="input-group input-group-sm" style={{ width: "120px", borderRadius: "6px", overflow: "hidden", border: "1px solid #ced4da" }}>
                                                <button
                                                    className="btn btn-light bg-white border-0"
                                                    type="button"
                                                    onClick={handleDecrement}
                                                    disabled={quantity <= 10 || effectiveStock === 0}
                                                    style={{ borderRadius: 0, width: "40px" }}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <input
                                                    type="text"
                                                    className="form-control text-center border-0 bg-white"
                                                    value={effectiveStock === 0 ? 0 : quantity}
                                                    readOnly
                                                    style={{ backgroundColor: 'white', cursor: 'default', fontWeight: '600', padding: 0, fontSize: '0.9rem' }}
                                                />
                                                <button
                                                    className="btn btn-light bg-white border-0"
                                                    type="button"
                                                    onClick={handleIncrement}
                                                    disabled={quantity + 10 > effectiveStock}
                                                    style={{ borderRadius: 0, width: "40px" }}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                            <div className="w-100 w-sm-auto">
                                                {quantity >= effectiveStock && effectiveStock > 0 && (
                                                    <small className="text-danger" style={{ fontSize: '0.7rem' }}>
                                                        Maksimal stok tercapai ({effectiveStock} pcs)
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* TOTAL (Right) */}
                                    <div className="d-flex flex-column align-items-start align-items-md-end w-100 w-md-auto">
                                        <span className="text-secondary small mb-1" style={{ fontSize: '0.8rem' }}>Total Estimasi</span>
                                        <h4 className="text-success fw-bold m-0" style={{ fontSize: '1.1rem' }}>
                                            Rp {Number(effectivePrice * (Number(quantity) || 0)).toLocaleString("id-ID")}
                                        </h4>
                                        <small className="text-muted fst-italic" style={{ fontSize: '0.7rem' }}>
                                            (Belum termasuk Biaya Pengiriman)
                                        </small>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="d-grid gap-2">
                                    <button
                                        className="primaryBtn justify-content-center"
                                        onClick={handleAddToCart}
                                        disabled={effectiveStock === 0}
                                        style={{ opacity: (effectiveStock === 0) ? 0.6 : 1, height: '38px', fontSize: '0.9rem' }}
                                    >
                                        <i className="bi bi-cart-plus me-2"></i>
                                        {effectiveStock === 0 ? "Habis" : "Keranjang"}
                                    </button>


                                </div>

                                {errorMsg && (
                                    <div className="alert alert-danger py-1 mt-2 mb-0 text-center" style={{ fontSize: '0.75rem' }}>
                                        {errorMsg}
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                </div>

                {/* 🔹 DESCRIPTION (Moved to Bottom for Mobile Flow) */}
                <div className="row mt-0">
                    <div className="col-12">
                        {renderDescription(data.description)}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductResellerDetail;
