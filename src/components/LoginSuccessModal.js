import React, { useEffect } from "react";

const LoginSuccessModal = ({ show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
                zIndex: 1055,
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(5px)"
            }}
            onClick={onClose}
        >
            <div
                className="card border-0 shadow-lg rounded-4 overflow-hidden"
                style={{ width: "90%", maxWidth: "400px", animation: "fadeInUp 0.3s ease-out" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="card-body p-5 text-center">
                    <div className="mb-4">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                            style={{
                                width: "80px",
                                height: "80px",
                                backgroundColor: "#ecfdf5",
                                color: "#10b981"
                            }}
                        >
                            <i className="bi bi-check-lg" style={{ fontSize: "3rem" }}></i>
                        </div>
                    </div>

                    <h4 className="fw-bold mb-3 text-dark">Login Berhasil!</h4>
                    <p className="text-secondary mb-4">
                        Selamat datang kembali di Air Ikan.
                    </p>

                    <button
                        className="btn btn-primary w-100 py-2 rounded-3 fw-bold"
                        style={{ background: "linear-gradient(45deg, #2563eb, #1d4ed8)", border: "none" }}
                        onClick={onClose}
                    >
                        Lanjut Belanja
                    </button>
                </div>

                {/* Close Button X */}
                <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-3"
                    aria-label="Close"
                    onClick={onClose}
                ></button>
            </div>

            <style>
                {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default LoginSuccessModal;
