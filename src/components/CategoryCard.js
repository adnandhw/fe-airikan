import { useContext } from "react";
import { Context } from "../MyContext";
import { Link } from "react-router-dom";

const CategoryCard = ({ data }) => {
  const { category } = useContext(Context);
  const displayData = data || category;

  return (
    <div className="row g-2 g-md-4">
      {displayData.map((c) => (
        <div key={c._id} className="col-lg-2 col-md-3 col-6">
          <Link
            to={`/category/${c.slug}`}
            className="text-decoration-none"
          >
            <div className="card-hover">
              <div className="category-img-wrapper">
                <img
                  src={c.image_url}
                  alt={c.name || c.description}
                />
              </div>
              <div className="category-content">
                <h6 className="category-name">{c.name || c.description}</h6>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
