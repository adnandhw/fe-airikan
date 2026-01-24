import { useContext } from "react"
import { Context } from "./MyContext"

const Banner = () => {
    const { banner } = useContext(Context)

    return (
        <div className="container">
            <div id="carouselExampleCaptions" className="carousel slide">

                {/* Indicators */}
                <div className="carousel-indicators">
                    {banner.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target="#carouselExampleCaptions"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : undefined}
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                {/* Carousel Items */}
                <div className="carousel-inner">
                    {banner.map((b, index) => (
                        <div
                            key={index}
                            className={index === 0 ? "carousel-item active" : "carousel-item"}
                        >
                            <img
                                src={b.image_url}   // <- PALING BENAR
                                className="d-block w-100"
                                alt="Banner"
                            />
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <i className="bi bi-arrow-left-circle-fill"></i>
                    <span className="visually-hidden">Previous</span>
                </button>

                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <i className="bi bi-arrow-right-circle-fill"></i>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}

export default Banner
