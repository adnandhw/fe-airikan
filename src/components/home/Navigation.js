const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#">Air Ikan Store</a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link mx-2 active" aria-current="page" href="http://localhost:3000/home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-2" href="http://localhost:3000/category">Category</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-2" href="http://localhost:3000/product">Product</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-2" href="http://localhost:3000/contact">Contact</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-2" href="http://localhost:3000/joinreseller">Join Reseller</a>
            </li>
          </ul>

          <div className="d-flex btnWrapper mt-lg-0 mt-5">
            <button className="w-100 secondaryBtn">Sign In</button>
            <button className="w-100 primaryBtn">Log In</button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
