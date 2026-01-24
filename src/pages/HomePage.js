import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BannerPromotion from "../components/Banner";
import CategoryCard from "../components/CategoryCard";
import Product from "../components/ProductCard";
import ProductResellerCard from "../components/ProductResellerCard";
import { Context } from "../MyContext";
import ProductDetail from "../pages/ProductDetail";
import LoginSuccessModal from "../components/LoginSuccessModal";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productReseller, user, setIsLoginModalOpen } = useContext(Context);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      setShowLoginSuccess(true);
      // Clear state so it doesn't show again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.openLogin) {
      setIsLoginModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, setIsLoginModalOpen]);

  return (
    <>
      <LoginSuccessModal show={showLoginSuccess} onClose={() => setShowLoginSuccess(false)} />

      <section className="banner-section">
        <BannerPromotion />
      </section>

      {/* MOBILE SEARCH (Visible only on mobile) */}
      <div className="d-block d-lg-none mt-3 container">
        <form
          className="d-flex align-items-center gap-2 w-100"
          onSubmit={(e) => {
            e.preventDefault();
            const searchTerm = e.target.searchMobile.value;
            if (!searchTerm.trim()) return;
            navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
            e.target.searchMobile.value = "";
          }}
        >
          <input
            name="searchMobile"
            type="text"
            className="searchInput flex-grow-1"
            placeholder="Cari..."
          />
          <button className="primaryBtn" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="section-title">
            <div>
              <h2 className="main-title">Kategori</h2>
            </div>
          </div>
          <CategoryCard />
        </div>
      </section>

      {/* RESELLER SECTION */}
      {user && user.reseller_status === 'approved' && (
        <section className="section-padding">
          <div className="container">
            <div className="section-title">
              <div>
                <h2 className="main-title">Reseller</h2>
                <p className="section-subtitle mb-0">Penawaran harga khusus untuk resellers</p>
              </div>
              <a href="/product-reseller" className="btn btn-outline-primary rounded-pill px-4">Lihat Semua</a>
            </div>
            <ProductResellerCard data={productReseller.filter(p => p.is_active !== false).slice(0, 4)} />
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container">
          <div className="section-title">
            <div>
              <h2 className="main-title">Produk</h2>
            </div>
            <a href="/product" className="btn btn-outline-primary rounded-pill px-4">Lihat Semua</a>
          </div>
          <Product />
        </div>
      </section>

      <div className="d-none">
        <ProductDetail />
      </div>
    </>
  );
};

export default HomePage;
