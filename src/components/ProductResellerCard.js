import { useContext, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Context } from "../MyContext";

const ProductResellerCard = ({ data }) => {
    const { productReseller: contextProduct } = useContext(Context);
    const location = useLocation();

    const productSource = data || contextProduct;

    const keyword =
        new URLSearchParams(location.search).get("search") || "";

    /* 
      If filtered data is already passed (e.g. from ProductResellerPage), use it directly.
      Otherwise, if no data passed, process context data with search param.
    */
    const filteredProduct = useMemo(() => {
        // If parent passed data, trust it fully (it's already filtered/sorted)
        if (data) return data;

        // Fallback logic
        if (!keyword) return productSource;

        const key = keyword.toLowerCase();

        const filtered = productSource.filter((p) =>
            p.name?.toLowerCase().includes(key) ||
            p.type?.toLowerCase().includes(key) ||
            p.category?.description?.toLowerCase().includes(key)
        );

        return filtered.sort((a, b) => {
            const nameA = a.name?.toLowerCase() || "";
            const nameB = b.name?.toLowerCase() || "";
            const startsWithA = nameA.startsWith(key);
            const startsWithB = nameB.startsWith(key);
            if (startsWithA && !startsWithB) return -1;
            if (!startsWithA && startsWithB) return 1;
            return 0;
        });
    }, [keyword, productSource, data]);

    return (
        <div>
            {!data && keyword && (
                <div className="row justify-content-center mb-4">
                    <div className="col-12">
                        <h4 className="text-secondary fw-normal">
                            Search results for: <span className="text-primary fw-bold">"{keyword}"</span>
                        </h4>
                    </div>
                </div>
            )}

            <div className="row g-2 g-md-4">
                {filteredProduct.length > 0 ? (
                    filteredProduct.map((p) => {


                        return (
                            <div className="col-lg-3 col-md-4 col-6" key={p.id || p._id}>
                                <Link
                                    to={`/product-reseller/${p.id || p._id}`}
                                    className="text-decoration-none"
                                >
                                    <div className="card-hover">
                                        <div className="product-img-wrapper position-relative">


                                            <img
                                                src={p.image_url}
                                                alt={p.name}
                                                className="product-img"
                                            />

                                            {/* Stock Overlay */}
                                            {p.stock !== undefined && Number(p.stock) === 0 && (
                                                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-top">
                                                    <span className="badge bg-danger fs-6 px-3 py-2 shadow-sm">Stok Habis</span>
                                                </div>
                                            )}

                                            {/* Reseller Badge */}
                                            {/* Badges Container */}
                                            <div className="position-absolute top-0 end-0 m-2 d-flex flex-column align-items-end gap-1">
                                                <span className="badge bg-primary text-white small">
                                                    Reseller Product
                                                </span>
                                                {p.stock !== undefined && Number(p.stock) > 0 && Number(p.stock) <= 20 && (
                                                    <span className="badge bg-warning text-dark small">
                                                        Low Stock
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="product-details">
                                            <h3 className="product-title" title={p.description}>
                                                {p.name}
                                            </h3>
                                            <div className="text-secondary small mb-1">
                                                Size: <span className="fw-semibold text-dark">{p.size}</span>
                                            </div>
                                            <div className="d-flex align-items-end justify-content-between mt-2 gap-2">
                                                <div className="d-flex flex-column">
                                                    <span className="product-price d-flex flex-column">
                                                        {(() => {
                                                            // Calculate prices for 10 pcs
                                                            const quantity = 10;
                                                            const baseTotal = p.price * quantity;

                                                            const tiers = p.tier_pricing ? [...p.tier_pricing].sort((a, b) => b.quantity - a.quantity) : [];
                                                            const tierFor10 = tiers.find(t => quantity >= t.quantity);

                                                            let unitPrice = p.price;
                                                            if (tierFor10) {
                                                                if (tierFor10.unit_price) {
                                                                    unitPrice = tierFor10.unit_price;
                                                                } else if (tierFor10.discount_percentage) {
                                                                    unitPrice = p.price * (1 - tierFor10.discount_percentage / 100);
                                                                }
                                                            }

                                                            const effectiveTotal = unitPrice * quantity;
                                                            const hasDiscount = effectiveTotal < baseTotal;

                                                            return (
                                                                <>
                                                                    {hasDiscount && (
                                                                        <span className="text-decoration-line-through text-muted small mb-1" style={{ fontSize: '0.85rem' }}>
                                                                            Rp {Number(baseTotal).toLocaleString("id-ID")}
                                                                        </span>
                                                                    )}
                                                                    <span>
                                                                        Rp {Number(effectiveTotal).toLocaleString("id-ID")}
                                                                        <span className="text-muted fw-normal d-block mt-1" style={{ fontSize: '0.7rem' }}>/ 10 pcs</span>
                                                                    </span>
                                                                </>
                                                            );
                                                        })()}
                                                    </span>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-primary rounded-circle"
                                                    style={{ width: '32px', height: '32px', padding: 0 }}
                                                    disabled={p.stock !== undefined && Number(p.stock) === 0}
                                                >
                                                    <i className="bi bi-arrow-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-12 text-center py-5">
                        <div className="text-muted fs-5">Tidak ada produk reseller ditemukan.</div>
                        <Link to="/" className="btn btn-link mt-2">Kembali ke Beranda</Link>
                    </div>
                )}
            </div >
        </div >
    );
};

export default ProductResellerCard;
