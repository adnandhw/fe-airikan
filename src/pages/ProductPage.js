import { useContext, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Context } from "../MyContext";

const ProductPage = () => {
  const { product } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  // State for filters
  const [sortOrder, setSortOrder] = useState("default");

  const searchKeyword = new URLSearchParams(location.search).get("search") || "";
  const urlFilter = new URLSearchParams(location.search).get("filter");

  // Sync URL filter with state if needed, or just use it directly. 
  // For now, keeping the logic simple.

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...product];

    // 0. Apply URL Filter (e.g. Discount Only) - Priority 1
    if (urlFilter === "only_discount") {
      result = result.filter((p) => {
        const percentage = Number(p.discount_percentage) || 0;
        const now = new Date();
        const endDate = p.discount_end_date ? new Date(p.discount_end_date) : null;
        const isDateValid = endDate && !isNaN(endDate.getTime());
        const isNotExpired = isDateValid && endDate > now;
        return percentage > 0 && isNotExpired;
      });
    }



    // 1. Apply Search Filter
    if (searchKeyword) {
      const key = searchKeyword.toLowerCase();
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(key) ||
        p.type?.toLowerCase().includes(key) ||
        p.category?.description?.toLowerCase().includes(key)
      );
    }

    // 2. Apply Sort Filter
    switch (sortOrder) {
      case "price_asc":
        return result.sort((a, b) => a.price - b.price);
      case "price_desc":
        return result.sort((a, b) => b.price - a.price);
      case "name_asc":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return result.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return result;
    }
  }, [product, searchKeyword, sortOrder, urlFilter]);

  return (
    <>
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

          {/* Header & Controls */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
            <h2 className="main-title">Semua Produk</h2>

            {/* Filter Diskon Toggle & Sort */}
            {/* Filter Diskon Toggle & Sort */}
            <div className="d-flex align-items-center gap-3">


              {/* Sort Dropdown */}
              <select
                className="form-select w-auto border-0 shadow-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ fontSize: "0.9rem", padding: "0.5rem 2rem 0.5rem 1rem" }}
              >
                <option value="default">Urutkan</option>
                <option value="price_asc">Harga: Terendah - Tertinggi</option>
                <option value="price_desc">Harga: Tertinggi - Terendah</option>
                <option value="name_asc">Nama: A-Z</option>
                <option value="name_desc">Nama: Z-A</option>
              </select>
            </div>
          </div>

          {/* Search Context Message */}
          {searchKeyword && (
            <div className="row justify-content-center mb-4">
              <div className="col-12">
                <h5 className="text-secondary fw-normal">
                  Hasil pencarian untuk: <span className="text-primary fw-bold">"{searchKeyword}"</span>
                </h5>
              </div>
            </div>
          )}

          {/* URL Filter Context Message */}
          {urlFilter === "only_discount" && (
            <div className="row justify-content-center mb-4">
              <div className="col-12">
                <div className="alert alert-danger d-inline-block py-2 px-4 shadow-sm border-0 rounded-pill">
                  <i className="bi bi-tag-fill me-2"></i> Menampilkan produk diskon saja
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <ProductCard data={filteredAndSortedProducts} />

        </div>
      </section>
    </>
  );
};

export default ProductPage;
