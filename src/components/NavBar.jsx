import React from "react";

const NavBar = () => {
  const handleNavLinkClick = () => {
    // Force a full page reload when a navigation link is clicked
    window.location.reload();
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light border-bottom border-body  border-2 shadow-sm bg-gradient"
      style={{ backgroundColor: "#D3D3D3" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src="/logos/logo-navbar.png"
            style={{
              height: "40px",
            }}
            alt="FinGenius"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a
              className="nav-link"
              href="/customers"
              activeClassName="active"
              onClick={handleNavLinkClick}
            >
              Customers
            </a>
            <a
              className="nav-link"
              href="/vendors"
              activeClassName="active"
              onClick={handleNavLinkClick}
            >
              Vendors
            </a>
            <a
              className="nav-link"
              href="/products"
              activeClassName="active"
              onClick={handleNavLinkClick}
            >
              Products
            </a>
            <a
              className="nav-link"
              href="/payments"
              activeClassName="active"
              onClick={handleNavLinkClick}
            >
              Payments
            </a>
            <a
              className="nav-link"
              href="/receipts"
              activeClassName="active"
              onClick={handleNavLinkClick}
            >
              Receipts
            </a>
            <a
              className="nav-link"
              href="/salesinvoices"
              activeClassName="active"
              onClick={handleNavLinkClick}
            >
              Sales Invoices
            </a>
            <a
              className="nav-link"
              href="/purchaseinvoices"
              activeClassName="active"
              onClick={handleNavLinkClick}
            >
              Purchase Invoices
            </a>
            <a
              className="nav-link"
              href="/ledger"
              activeClassName="active"
              onClick={handleNavLinkClick}
            >
              Ledger
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
