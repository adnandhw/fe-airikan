import { useState, useContext, useEffect } from "react";
import RegisterReseller from "../components/RegisterReseller";
import LoginRequiredModal from "../components/LoginRequiredModal";
import { Context } from "../MyContext";
import axios from "axios";

const JoinReseller = () => {
    const [showForm, setShowForm] = useState(false);
    const [showLoginRequired, setShowLoginRequired] = useState(false);
    const { user, login, refreshUser, setIsLoginModalOpen } = useContext(Context);

    // Refresh user data on mount to check for status updates
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const gradientTextStyle = {
        background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block"
    };

    useEffect(() => {
        if (user && (user.reseller_status === "pending" || user.reseller_status === "approved" || user.is_reseller || user.reseller_status === "reject")) {
            setShowForm(true);
        }
    }, [user]);

    const handleJoinClick = async () => {
        if (!user) {
            setShowLoginRequired(true);
            return;
        }

        try {
            const userId = user.id;

            // Prevent re-submission if already processed
            if (user.reseller_status === "pending" || user.reseller_status === "approved" || user.is_reseller || user.reseller_status === "reject") {
                setShowForm(true);
                return;
            }

            // Submit application (set status to pending)
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/buyers/${userId}`, {
                reseller_status: "pending"
            });

            if (response.data.success) {
                // Update context
                login(response.data.data);
                setShowForm(true);
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Terjadi kesalahan saat mengajukan pendaftaran.");
        }
    };

    return (
        <section className="section-padding">
            <div className="container">

                {!showForm ? (
                    <div className="text-center py-5">
                        <h2 className="display-5 fw-bold mb-4" style={gradientTextStyle}>Gabung Program Reseller Kami</h2>
                        <p className="lead mb-5 text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Dapatkan harga eksklusif dan sistem pemesanan yang mudah dengan menjadi reseller resmi Air Ikan.
                        </p>

                        <div className="row justify-content-center gap-4 mb-5">
                            <div className="col-md-3 text-center">
                                <div className="p-4 rounded-4 bg-light h-100">
                                    <i className="bi bi-tag-fill fs-1 mb-3" style={gradientTextStyle}></i>
                                    <h5 className="fw-bold">Harga Khusus</h5>
                                    <p className="small text-muted">Akses harga grosir khusus demi keuntungan bisnis yang lebih maksimal.</p>
                                </div>
                            </div>
                            <div className="col-md-3 text-center">
                                <div className="p-4 rounded-4 bg-light h-100">
                                    <i className="bi bi-box-seam-fill fs-1 mb-3" style={gradientTextStyle}></i>
                                    <h5 className="fw-bold">Sistem Pemesanan yang Fleksibel</h5>
                                    <p className="small text-muted">Reseller dapat melakukan pemesanan sesuai kebutuhan dengan proses yang mudah.</p>
                                </div>
                            </div>
                            <div className="col-md-3 text-center">
                                <div className="p-4 rounded-4 bg-light h-100">
                                    <i className="bi bi-megaphone-fill fs-1 mb-3" style={gradientTextStyle}></i>
                                    <h5 className="fw-bold">Peluang Reseller</h5>
                                    <p className="small text-muted">Gabung sebagai reseller Air Ikan dengan sistem yang menguntungkan.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="primaryBtn btn-lg px-5 mx-auto"
                            onClick={handleJoinClick}
                        >
                            Daftar Sekarang
                        </button>
                    </div>
                ) : (
                    <RegisterReseller setShowForm={setShowForm} user={user} />
                )}

                <LoginRequiredModal
                    show={showLoginRequired}
                    onClose={() => setShowLoginRequired(false)}
                    onLogin={() => setIsLoginModalOpen(true)}
                    message="Silakan login terlebih dahulu untuk mendaftar sebagai Reseller dan nikmati penawaran eksklusif kami."
                />

            </div>
        </section>
    );
};

export default JoinReseller;
