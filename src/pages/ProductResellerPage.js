import { useContext, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductResellerCard from "../components/ProductResellerCard";
import { Context } from "../MyContext";

const ProductResellerPage = () => {
    const { productReseller } = useContext(Context);
    const [filter, setFilter] = useState("default");
    const location = useLocation();
    const navigate = useNavigate();
    const searchKeyword = new URLSearchParams(location.search).get("search") || "";

    const filteredAndSortedProducts = useMemo(() => {
        // Filter active products only (default to true if undefined)
        let result = productReseller.filter(p => p.is_active !== false);

        // 0. Apply URL Filter
        const filterParam = new URLSearchParams(location.search).get("filter");
        if (filterParam === "only_discount") {
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
        switch (filter) {
            case "cheapest":
                return result.sort((a, b) => a.price - b.price);
            case "expensive":
                return result.sort((a, b) => b.price - a.price);
            case "alphabet_asc":
                return result.sort((a, b) => a.name.localeCompare(b.name));
            case "alphabet_desc":
                return result.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return result;
        }
    }, [productReseller, filter, searchKeyword, location.search]);

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
                        navigate(`/product-reseller?search=${encodeURIComponent(searchTerm)}`);
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
                        <div className="text-center text-md-start">
                            <h2 className="main-title mb-1">Produk Resellers</h2>
                            <p className="text-muted mb-0">Penawaran harga khusus untuk resellers (Min. 10 pcs)</p>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="d-flex align-items-center gap-3">
                            <select
                                className="form-select w-auto border-0 shadow-sm"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{ fontSize: "0.9rem", padding: "0.5rem 2rem 0.5rem 1rem" }}
                            >
                                <option value="default">Urutkan</option>
                                <option value="cheapest">Harga: Terendah - Tertinggi</option>
                                <option value="expensive">Harga: Tertinggi - Terendah</option>
                                <option value="alphabet_asc">Nama: A-Z</option>
                                <option value="alphabet_desc">Nama: Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Result Header */}
                    {searchKeyword && (
                        <div className="row justify-content-center mb-4">
                            <div className="col-12">
                                <h4 className="text-secondary fw-normal">
                                    Hasil pencarian untuk: <span className="text-primary fw-bold">"{searchKeyword}"</span>
                                </h4>
                            </div>
                        </div>
                    )}

                    {new URLSearchParams(location.search).get("filter") === "only_discount" && (
                        <div className="row justify-content-center mb-4">
                            <div className="col-12 text-center">
                                <h4 className="text-secondary fw-normal">
                                    Menampilkan produk <span className="text-danger fw-bold">Diskon Spesial</span>
                                </h4>
                            </div>
                        </div>
                    )}

                    <ProductResellerCard data={filteredAndSortedProducts} />
                </div>
            </section>
        </>
    );
};

export default ProductResellerPage;
