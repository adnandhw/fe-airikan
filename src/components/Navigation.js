import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../MyContext";
import LoginRequiredModal from "./LoginRequiredModal";

const Navigation = ({ onLoginClick }) => {
  const [search, setSearch] = useState("");
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, cart, setIsLoginModalOpen } = useContext(Context);
  const navRef = useRef(null);

  const [showLoginRequired, setShowLoginRequired] = useState(false);

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginRequired(true);
      handleCloseNav();
    } else {
      window.scrollTo(0, 0);
      handleCloseNav();
    }
  };

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const handleCloseNav = () => setIsNavCollapsed(true);

  // Close nav when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !isNavCollapsed &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        handleCloseNav();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavCollapsed]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (window.innerWidth < 992) {
      handleCloseNav();
    }

    // Context-Aware Search for Cart Page and Product Reseller Page
    if (location.pathname.includes("/carts")) {
      navigate(`${location.pathname}?search=${encodeURIComponent(search)}`);
    } else if (location.pathname.includes("/product-reseller")) {
      navigate(`/product-reseller?search=${encodeURIComponent(search)}`);
    } else {
      if (!search.trim()) return;
      navigate(`/product?search=${encodeURIComponent(search)}`);
    }
    setSearch("");
  };

  const handleLogout = () => {
    logout();
    handleCloseNav();
    navigate("/");
  };


  return (
    <nav ref={navRef} className={`navbar navbar-expand-lg fixed-top ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container-fluid px-4">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={() => {
          window.scrollTo(0, 0);
          handleCloseNav();
        }}>
          <img src="/Air Ikan.png" alt="Logo" className="brand-logo" />
          <img src="/AirIkanTextNew.png" alt="Air Ikan Store" className="brand-text" />
        </NavLink>

        {/* MOBILE CART ICON (Visible only on mobile, left of toggler) */}
        <div className="d-flex align-items-center ms-auto d-lg-none" style={{ gap: "10px" }}>
          <NavLink
            to={`/profile/${user?.username || user?.firstName?.toLowerCase() || 'user'}/carts`}
            className="nav-link position-relative dark-mode-white text-dark d-flex align-items-center justify-content-center p-0"
            style={{ width: "40px", height: "40px" }}
            onClick={handleCartClick}
            title="Keranjang"
          >
            <i className="bi bi-cart3 fs-4"></i>
            {cart && cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', transform: "translate(-50%, 5px)" }}>
                {cart.length}
              </span>
            )}
          </NavLink>

          <button
            className="navbar-toggler border-0 p-1"
            type="button"
            onClick={handleNavCollapse}
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
            style={{ boxShadow: "none" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNavDropdown">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            {(() => {
              const navItems = [
                { to: "/", label: "Beranda" },
                { to: "/category", label: "Kategori" },
                { to: "/product", label: "Produk" },
              ];

              // Strict check: User must be an approved reseller
              const isApprovedReseller = user && (
                user.reseller_status === 'approved' ||
                user.role === 'reseller'
              );

              if (isApprovedReseller) {
                navItems.push({ to: "/product-reseller", label: "Produk Reseller" });
              }

              navItems.push({ to: "/contact", label: "Tentang Kami" });

              // Hide Gabung Mitra ONLY if user is an approved reseller
              // Users who are pending, rejected, or have no status should still see it
              if (!isApprovedReseller) {
                navItems.push({ to: "/join-reseller", label: "Gabung Reseller" });
              }

              return navItems;
            })().map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => {
                    window.scrollTo(0, 0);
                    handleCloseNav();
                  }}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {/* DESKTOP CART ICON (Hidden on mobile) */}
            <li className="nav-item d-none d-lg-block">
              <NavLink
                to={`/profile/${user?.username || user?.firstName?.toLowerCase() || 'user'}/carts`}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={handleCartClick}
                title="Keranjang"
              >
                <i className="bi bi-cart3 fs-6"></i>
                {cart && cart.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', marginTop: '5px' }}>
                    {cart.length}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>

          {/* RIGHT ACTION BUTTONS */}
          {/* RIGHT ACTION BUTTONS */}
          {/* RIGHT ACTION BUTTONS */}
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-lg-5 mt-lg-0 mt-4 pb-4 pb-lg-0 mobile-nav-container ps-lg-0 pe-lg-0 me-lg-0">

            {/* SEARCH */}
            <form
              className="d-none d-lg-flex align-items-center gap-2 w-100 mb-3 mb-lg-0"
              onSubmit={handleSearch}
            >
              <input
                type="text"
                className="searchInput"
                placeholder="Cari..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="primaryBtn" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>

            {/* AUTH BUTTON */}
            {user ? (
              <div className="d-flex gap-3 align-items-center w-100 justify-content-start justify-content-lg-start">
                <div className="dropdown">
                  <button className="btn btn-link text-decoration-none dropdown-toggle text-dark fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Hai, {user.firstName}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2">
                    <li><h6 className="dropdown-header">Akun</h6></li>
                    <li>
                      <NavLink className="dropdown-item" to="/profile" onClick={handleCloseNav}>
                        Profil
                      </NavLink>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Keluar</button></li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex w-100 gap-3 justify-content-center justify-content-lg-end mt-3 mt-lg-0">
                <span
                  onClick={() => { onLoginClick(); handleCloseNav(); }}
                  role="button"
                  className="secondaryBtn w-100 text-center py-2 d-lg-inline-block w-lg-auto"
                >
                  Masuk
                </span>
                <NavLink
                  to="/register"
                  className="primaryBtn w-100 text-center py-2 d-lg-inline-block w-lg-auto"
                  onClick={handleCloseNav}
                >
                  Daftar
                </NavLink>
              </div>
            )}

          </div>

        </div>
      </div>

      <LoginRequiredModal
        show={showLoginRequired}
        onClose={() => setShowLoginRequired(false)}
        onLogin={() => setIsLoginModalOpen(true)}
        message="Silakan login terlebih dahulu untuk mengakses Keranjang."
      />
    </nav >
  );
};

export default Navigation;
