import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Context } from "../MyContext";

const LoginPage = () => {
    const { login, user } = useContext(Context);
    const [step, setStep] = useState(1); // 1: Identifier, 2: Password, 3: Forgot Password
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // Add success message state
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/forgot-password") {
            setStep(3);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (step === 1) {
            if (identifier.trim()) {
                setStep(2);
            }
        } else if (step === 2) {
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
                    identifier,
                    password
                });

                if (response.data.success) {
                    login(response.data.data);
                    navigate("/", { state: { loginSuccess: true } });
                } else {
                    setError(response.data.message || "Login failed");
                }
            } catch (err) {
                console.error("Login error:", err);
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Terjadi kesalahan saat login");
                }
            } finally {
                setLoading(false);
            }
        } else if (step === 3) {
            // Forgot Password Logic
            setLoading(true);
            setError("");
            setSuccessMessage("");
            try {
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/forgot-password`, { identifier });

                if (response.data.success) {
                    setSuccessMessage(response.data.message || "Tautan reset kata sandi telah dikirim ke email Anda.");
                } else {
                    setError(response.data.message || "Gagal mengirim tautan reset.");
                }
            } catch (err) {
                console.error(err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError("Terjadi kesalahan. Silakan coba lagi.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section className="section-padding">
            <div className="container d-flex justify-content-center">
                <div className="card border-0 shadow-lg rounded-4 p-4" style={{ maxWidth: "450px", width: "100%" }}>

                    {/* Header: Close Button */}
                    <div className="d-flex justify-content-end mb-2">
                        <Link to="/" className="text-secondary fs-4 text-decoration-none">
                            <i className="bi bi-x-lg"></i>
                        </Link>
                    </div>

                    {/* Title Content */}
                    <div className="d-flex justify-content-between align-items-center mb-5 px-2">
                        <h2 className="fw-bold mb-0">{step === 3 ? "Lupa Kata Sandi" : "Masuk"}</h2>
                        {step !== 3 && (
                            <Link to="/register" className="text-decoration-none fw-semibold text-primary">
                                Daftar
                            </Link>
                        )}
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="alert alert-danger mx-2" role="alert">
                            {error}
                        </div>
                    )}
                    {/* Success Alert for Forgot Password */}
                    {step === 3 && successMessage && (
                        <div className="alert alert-success mx-2" role="alert">
                            {successMessage}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-2 pb-3">

                        {step === 1 ? (
                            /* STEP 1: IDENTIFIER */
                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small">Email atau No. HP</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg bg-light border-0"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>
                        ) : (
                            /* STEP 2: PASSWORD */
                            <div className="mb-4">
                                {/* Identifier Display */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold text-secondary small mb-1">Email atau No. HP</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg bg-light border-0"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <label className="form-label fw-bold text-secondary small">Kata Sandi</label>
                                <div className="input-group mb-3">
                                    <span
                                        className="input-group-text bg-light border-0 cursor-pointer text-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} `}></i>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control form-control-lg bg-light border-0 border-start-0 ps-0"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                                        <label className="form-check-label text-secondary small" htmlFor="rememberMe">
                                            Ingat saya
                                        </label>
                                    </div>
                                    <span
                                        style={{ fontSize: '14px', cursor: 'pointer' }}
                                        className="text-primary text-decoration-none fw-bold"
                                        onClick={() => {
                                            setStep(3);
                                            setError("");
                                            setSuccessMessage("");
                                        }}
                                    >
                                        Lupa kata sandi?
                                    </span>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="d-flex justify-content-end mb-5">
                                <span
                                    className="text-primary text-decoration-none small fw-semibold"
                                    onClick={() => {
                                        setStep(3);
                                        setError("");
                                        setSuccessMessage("");
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    Lupa kata sandi?
                                </span>
                            </div>
                        )}

                        {step === 3 && (
                            /* STEP 3: FORGOT PASSWORD */
                            <div className="mb-4">
                                <p className="text-secondary small mb-4">Masukkan email yang terdaftar untuk reset kata sandi.</p>
                                <div className="mb-3">
                                    <label className="form-label fw-bold text-secondary small">Email</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg bg-light border-0"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        autoFocus
                                        required
                                        placeholder="contoh@email.com"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="d-grid gap-2">
                            <button type="submit" className="primaryBtn w-100 py-3 fw-bold shadow-sm" disabled={loading}>
                                {loading ? "Loading..." : (step === 1 ? "Selanjutnya" : (step === 3 ? "Kirim Reset Link" : "Masuk"))}
                            </button>
                            {step === 3 && (
                                <button
                                    type="button"
                                    className="btn btn-light w-100 py-3 fw-bold text-secondary"
                                    onClick={() => {
                                        setStep(1);
                                        setError("");
                                        setSuccessMessage("");
                                    }}
                                >
                                    Kembali
                                </button>
                            )}
                        </div>
                    </form>

                </div>
            </div >
        </section >
    );
};

export default LoginPage;
