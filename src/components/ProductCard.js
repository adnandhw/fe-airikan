import { useContext, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Context } from "../MyContext";

const ProductCard = ({ data }) => {
  const { product: contextProduct } = useContext(Context);
  const location = useLocation();

  const productSource = data || contextProduct;

  const keyword =
    new URLSearchParams(location.search).get("search") || "";

  /* 
    If filtered data is already passed (e.g. from ProductPage), use it directly.
    Otherwise, if no data passed (e.g. HomePage), process context data with search param.
  */
  const filteredProduct = useMemo(() => {
    // If parent passed data, trust it fully (it's already filtered/sorted)
    if (data) return data;

    // Fallback logic for components using ProductCard without props (e.g. HomePage?)
    // This logic runs ONLY if data is null/undefined
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
      {/* Title Section controlled by parent now, but keeping search result header if needed */}
      {/* Title Section: Only show here if we are NOT using passed data (meaning we are self-managing search) */}
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
            const isDiscountActive = p.discount_percentage > 0 && new Date(p.discount_end_date) > new Date();
            const discountedPrice = isDiscountActive
              ? p.price - (p.price * (p.discount_percentage / 100))
              : p.price;

            return (
              <div className="col-lg-3 col-md-4 col-6" key={p.id}>
                <Link
                  to={`/product/${p.id}`}
                  className="text-decoration-none"
                >
                  <div className="card-hover">
                    <div className="product-img-wrapper position-relative">
                      {/* Discount Badge */}
                      {isDiscountActive && (
                        <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded-2 small fw-bold z-2" style={{ fontSize: "0.7rem" }}>
                          {p.discount_percentage}% OFF
                        </div>
                      )}

                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="product-img"
                      />
                      {/* Optional: Add badge for stock or new */}
                      {p.stock <= 5 && p.stock > 0 && (
                        <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark small">
                          Low Stock
                        </span>
                      )}
                    </div>

                    <div className="product-details">
                      <div className="text-muted small mb-1 text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                        {p.category?.description || "Product"}
                      </div>
                      <h3 className="product-title" title={p.description}>
                        {p.name}
                      </h3>
                      <div className="text-secondary small mb-1">
                        Size: <span className="fw-semibold text-dark">{p.size}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex flex-column">
                          {isDiscountActive ? (
                            <>
                              <span className="text-decoration-line-through text-muted small" style={{ fontSize: '0.8rem' }}>
                                Rp {Number(p.price).toLocaleString("id-ID")}
                              </span>
                              <span className="product-price text-danger fw-bold">
                                Rp {Number(discountedPrice).toLocaleString("id-ID")}
                              </span>
                            </>
                          ) : (
                            <span className="product-price">
                              Rp {Number(p.price).toLocaleString("id-ID")}
                            </span>
                          )}
                        </div>
                        <button className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '32px', height: '32px', padding: 0 }}>
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
            <div className="text-muted fs-5">Tidak ada produk yang ditemukan sesuai pencarian Anda.</div>
            <Link to="/" className="btn btn-link mt-2">Kembali ke Beranda</Link>
          </div>
        )}
      </div >
    </div >
  );
};

export default ProductCard;
