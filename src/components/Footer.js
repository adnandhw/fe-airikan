import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row gy-4 border-bottom border-secondary pb-4 mb-4">
          <div className="col-lg-6 col-md-6">
            <h5 className="mb-3">
              <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none" onClick={() => window.scrollTo(0, 0)}>
                <img src="/Air Ikan.png" alt="Logo" style={{ height: "70px", width: "auto" }} />
                <img src="/AirIkanTextWhite.png" alt="Air Ikan Store" style={{ height: "70px", width: "auto" }} />
              </Link>
            </h5>
            <p className="text-secondary mb-4">
              Produk berkualitas premium untuk memenuhi segala kebutuhan Anda. Kami berkomitmen memberikan pelayanan terbaik dengan kualitas yang terjamin.
            </p>
            <div className="d-flex gap-3">
              <a href="https://www.facebook.com/robert.tanujaya.7" target="_blank" rel="noreferrer" className="text-light"><i className="bi bi-facebook fs-5"></i></a>
              <a href="https://www.instagram.com/airikan2021/" target="_blank" rel="noreferrer" className="text-light"><i className="bi bi-instagram fs-5"></i></a>
              <a href="https://www.tiktok.com/@air_ikan" target="_blank" rel="noreferrer" className="text-light"><i className="bi bi-tiktok fs-5"></i></a>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <h5>Kunjungi Kami</h5>
            <div className="d-flex gap-3 mb-3">
              <div className="text-secondary fs-4"><i className="bi bi-geo-alt"></i></div>
              <a
                href="https://www.google.com/maps/place/Air+Ikan/@-6.229493,106.867767,18z/data=!4m6!3m5!1s0x2e69f385e893ddbf:0x12960d2dfbdda39a!8m2!3d-6.2294932!4d106.8677666!16s%2Fg%2F11p0gcg3fp?hl=en&entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none"
              >
                <p className="mb-0 fw-semibold text-light">Air Ikan Store</p>
                <p className="text-secondary small mb-0">Jl. Otista Raya Gg. H. Abd Rahman No.4, Jatinegara, Jakarta Timur</p>
              </a>
            </div>

            <div className="d-flex gap-3">
              <div className="text-secondary fs-4"><i className="bi bi-clock"></i></div>
              <div>
                <p className="mb-0 fw-semibold text-light">Jam Operasional</p>
                <p className="text-secondary small mb-0">Sen - Min : 13:00 - 20:00</p>
              </div>
            </div>
          </div>


        </div>

        <div className="footer-content pt-3">
          <span className="copyright-text text-secondary">© 2025 Air Ikan Store. Hak Cipta Dilindungi.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
