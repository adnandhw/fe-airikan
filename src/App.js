import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Context } from "./MyContext";
import "./App.css";

import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";

import Navigation from "./components/Navigation";
import LoginModal from "./components/LoginModal";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import ContactPage from "./pages/ContactPage";
import JoinResellerPage from "./pages/JoinResellerPage";
import Footer from "./components/Footer";
import RegisterReseller from "./components/RegisterReseller";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductDetail from "./pages/ProductDetail";
import CategoryDetail from "./pages/CategoryDetail";
import ProductList from "./pages/ProductList";
import ProfilePage from "./pages/ProfilePage";
import AdvantagesPage from "./pages/AdvantagesPage";
import ProductResellerPage from "./pages/ProductResellerPage";
import ProductResellerDetail from "./pages/ProductResellerDetail";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";

function App() {
  const { isLoginModalOpen, setIsLoginModalOpen } = useContext(Context);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper">
        <Navigation onLoginClick={() => setIsLoginModalOpen(true)} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/join-reseller" element={<JoinResellerPage />} />
            <Route path="/register-reseller" element={<RegisterReseller />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<LoginPage />} />
            <Route path="/category/:slug" element={<CategoryDetail />} />
            <Route path="/category/:category/:type" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/product-reseller" element={<ProductResellerPage />} />
            <Route path="/product-reseller/:id" element={<ProductResellerDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/:username/:tab" element={<ProfilePage />} />
            <Route path="/keunggulan" element={<AdvantagesPage />} />
          </Routes>
        </main>

        <Footer />
        <LoginModal show={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        <WhatsAppButton />
      </div >
    </Router >
  );
}

export default App;
