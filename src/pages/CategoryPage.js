import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";

const CategoryPage = () => {
  const navigate = useNavigate();

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
          <div className="section-title justify-content-center justify-content-md-start">
            <div className="text-center text-md-start">
              <h2 className="main-title">Semua Kategori</h2>
            </div>
          </div>
          <CategoryCard />
        </div>
      </section>
    </>
  );
};

export default CategoryPage;
