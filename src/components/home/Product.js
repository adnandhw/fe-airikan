import { useContext } from "react";
import { Context } from "./MyContext";

const Product = () => {
  const { product } = useContext(Context);

  return (
    <div className="container">
      <div className="row justify-content-center mb-2">
        <div className="col-8">
          <h2 className="text-center tagline mb-4 mt-2">All Product</h2>
          <div className="input-group">
            <form className="d-flex w-100">
              <input
                className="searchInput"
                placeholder="search product..."
              />
              <button className="primaryBtn" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="row">
        {product.map((p) => (
          <div className="col-lg-3 col-md-4 col-6 mb-3" key={p.id}>
            <div className="product-card">

              {/* IMAGE */}
              <div className="image-wraper">
                <img
                  src={p.image_url}     // ⬅️ INI KUNCI
                  alt={p.name}
                  className="product-img"
                />
              </div>

              {/* INFO */}
              <div>
                <span className="title-category mt-2">{p.category}</span>
                <span className="title-type">{p.type}</span>
                <span className="title-description mt-2 mb-3">
                  {p.description}
                </span>
              </div>

              {/* PRICE */}
              <div className="price-wraper d-flex justify-content-between align-items-center">
                <span className="title-price">
                  Rp {Number(p.price).toLocaleString("id-ID")}
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
