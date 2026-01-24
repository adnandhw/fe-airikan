import { useContext } from "react";
import { Context } from "./MyContext";

const CategoryCard = () => {
  const { category } = useContext(Context);

  return (
    <div className="container category my-5">
      <div className="category-title">
        <h6>Product Category</h6>
      </div>

      <div className="row my-4">
        {category.map((c) => (
          <div key={c.id} className="col-lg-2 col-md-3 col-6">
            <div className="card-category text-center my-3">

              <div className="category-image">
                <img
                  src={c.image_url}
                  alt={c.description}
                  className="category-img"
                />
              </div>

              <div className="category-label">
                {c.description}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
