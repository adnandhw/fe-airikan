import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const EmailVerificationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const { setIsLoginModalOpen } = useContext(Context); // Not used here

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Memverifikasi email anda...");

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get("token");
        const email = query.get("email");

        if (!token || !email) {
            setStatus("error");
            setMessage("Link verifikasi tidak valid.");
            return;
        }

        const verify = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, email })
                });

                const data = await response.json();

                if (data.success) {
                    setStatus("success");
                    setMessage(data.message);

                    // Optional: Delay then redirect to home/login
                    setTimeout(() => {
                        navigate("/", { state: { openLogin: true, verificationSuccess: true, message: data.message } });
                    }, 3000);

                } else {
                    setStatus("error");
                    setMessage(data.message);
                }
            } catch (err) {
                setStatus("error");
                setMessage("Terjadi kesalahan koneksi.");
            }
        };

        verify();
    }, [location.search, navigate]);

    return (
        <div className="section-padding container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <div className="card shadow p-4 text-center" style={{ maxWidth: "500px", width: "100%" }}>
                {status === "verifying" && (
                    <>
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <h4>Memproses Verifikasi...</h4>
                        <p>{message}</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4rem" }}></i>
                        <h4 className="mt-3">Berhasil!</h4>
                        <p>{message}</p>
                        <p className="text-muted small">Anda akan diarahkan ke halaman login dalam beberapa detik...</p>
                        <button className="btn btn-primary mt-2" onClick={() => navigate("/", { state: { openLogin: true, verificationSuccess: true } })}>
                            Login Sekarang
                        </button>
                    </>
                )}
                {status === "error" && (
                    <>
                        <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "4rem" }}></i>
                        <h4 className="mt-3">Gagal</h4>
                        <p>{message}</p>
                        <a href="/" className="btn btn-outline-primary mt-2">Kembali ke Beranda</a>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailVerificationPage;
