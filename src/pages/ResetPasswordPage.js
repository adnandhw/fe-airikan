import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setError("Silakan isi semua kolom.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/reset-password`, {
                token,
                email,
                password
            });

            if (response.data.success) {
                setSuccess("Password berhasil diubah. Mengalihkan ke halaman login...");
                setTimeout(() => {
                    // Open login modal via state if possible, or redirect to home/login page
                    // Since we can't easily access context here without wrapping, let's redirect to home with a state that App.js can detect, or just redirect to home.
                    // Ideally we should open the login modal. For now, let's go to homepage with query param or just homepage.
                    navigate("/", { state: { openLogin: true } });
                }, 2000);
            } else {
                setError(response.data.message || "Gagal mengubah password.");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Terjadi kesalahan. Silakan coba lagi.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="alert alert-danger">
                    Link reset password tidak valid atau tidak lengkap.
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ minHeight: "80vh", marginTop: "80px" }}>
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card border-0 shadow-lg rounded-4 p-4">
                        <h3 className="fw-bold text-center mb-4 text-dark">Reset Password</h3>

                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-secondary">Password Baru</label>
                                <div className="input-group">
                                    <span
                                        className="input-group-text bg-light border-0 cursor-pointer text-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control bg-light border-0"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Masukkan password baru"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-secondary">Konfirmasi Password Baru</label>
                                <div className="input-group">
                                    <span
                                        className="input-group-text bg-light border-0 cursor-pointer text-secondary"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                    </span>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-control bg-light border-0"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Ulangi password baru"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="primaryBtn w-100 py-2 fw-bold"
                                disabled={loading || success}
                            >
                                {loading ? "Memproses..." : "Ubah Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
