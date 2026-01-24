import { useParams } from "react-router-dom";
import { useContext, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { Context } from "../MyContext";

const CategoryDetail = () => {
  const { slug } = useParams();
  const { product, category } = useContext(Context);

  const currentCategory = category.find(
    (c) => c.slug === slug
  );

  // ✅ useMemo TIDAK BOLEH di bawah return
  const filteredProduct = useMemo(() => {
    if (!currentCategory) return [];
    return product.filter(
      (p) => p.category_id === currentCategory.id
    );
  }, [product, currentCategory]);

  /* Removed types useMemo */

  // ⬇️ return bersyarat BOLEH di sini
  if (!currentCategory) {
    return (
      <div className="container my-5 text-center">
        <h4>Kategori tidak ditemukan</h4>
      </div>
    );
  }

  return (
    <section className="section-padding">
      <div className="container">

        <h4 className="mb-4">
          Kategori : {currentCategory.name || currentCategory.description}
        </h4>

        <div >
          <ProductCard data={filteredProduct} />
        </div>
      </div>
    </section>
  );
};

export default CategoryDetail;
