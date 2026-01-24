import { useContext, useEffect, useState } from "react";
import { Context } from "../MyContext";
import { Link } from "react-router-dom";

const Banner = () => {
  const { banner } = useContext(Context);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate logic using React (Reliable)
  useEffect(() => {
    if (!banner || banner.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banner.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banner, currentIndex]); // Added currentIndex to dependency array to reset interval on manual slide change

  if (!banner || banner.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="false" // Disable Bootstrap's JS intervention
      >
        {/* INDICATORS */}
        <div className="carousel-indicators" style={{ marginBottom: "1rem" }}>
          {banner.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === currentIndex ? "active" : ""}
              aria-current={index === currentIndex ? "true" : undefined}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: "30px",
                height: "4px",
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "2px",
                margin: "0 4px",
                opacity: index === currentIndex ? 1 : 0.5,
                transition: "opacity 0.3s ease"
              }}
            />
          ))}
        </div>

        {/* ITEMS */}
        <div className="carousel-inner rounded-4 overflow-hidden">
          {banner.map((b, index) => (
            <div
              key={b.id || index}
              className={`carousel-item ${index === currentIndex ? "active" : ""}`}
              style={{ transition: "transform 0.6s ease-in-out" }} // Ensure smooth transition
            >
              {index === 1 ? (
                <Link to="/keunggulan">
                  <img
                    src={b.image_url}
                    className={`d-block w-100 banner-img banner-index-${index}`}
                    alt="Banner Promotion"
                  />
                </Link>
              ) : index === 0 ? (
                <Link to="/products?filter=only_discount">
                  <img
                    src={b.image_url}
                    className={`d-block w-100 banner-img banner-index-${index}`}
                    alt="Diskon Spesial"
                  />
                </Link>
              ) : (
                <img
                  src={b.image_url}
                  className={`d-block w-100 banner-img banner-index-${index}`}
                  alt="Banner Promotion"
                />
              )}
            </div>
          ))}
        </div>

        {/* CONTROLS REMOVED AS REQUESTED */}
      </div>
    </div>
  );
};

export default Banner;
