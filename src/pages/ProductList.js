import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../MyContext";

const ProductList = () => {
  const { category: categorySlug, type } = useParams();
  const { product, category } = useContext(Context);

  const matchedCategory = category.find(c => c.slug === categorySlug);

  const data = product.filter(
    (p) =>
      (matchedCategory ? p.category_id === matchedCategory.id : false) &&
      p.type === type
  );

  return (
    <div className="container my-5">
      <h4 className="mb-4 text-capitalize">
        {type.replace("-", " ")}
      </h4>

      <div className="row">
        {data.map((p) => (
          <div key={p.id} className="col-lg-3 col-md-4 col-6 mb-4">
            <Link
              to={`/product/${p.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 p-3">
                <img
                  src={p.images?.[0] || p.image_url}
                  className="img-fluid mb-2"
                  alt={p.name}
                />
                <strong>{p.name}</strong>
                <span className="text-muted">
                  Rp {Number(p.price).toLocaleString("id-ID")}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;