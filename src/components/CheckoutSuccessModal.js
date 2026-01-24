import React, { useEffect } from "react";

const CheckoutSuccessModal = ({ show, onClose }) => {
    useEffect(() => {
        if (show) {
            // Auto close after 2 seconds to give user time to read
            const timer = setTimeout(() => {
                onClose();
            }, 2000);
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
                style={{ width: "90%", maxWidth: "450px", animation: "fadeInUp 0.3s ease-out" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="card-body p-5 text-center">
                    <div className="mb-4">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                            style={{
                                width: "90px",
                                height: "90px",
                                backgroundColor: "#ecfdf5",
                                color: "#10b981",
                                boxShadow: "0 0 0 10px rgba(16, 185, 129, 0.1)"
                            }}
                        >
                            <i className="bi bi-shield-check" style={{ fontSize: "3rem" }}></i>
                        </div>
                    </div>

                    <h3 className="fw-bold mb-3 text-dark">Checkout Berhasil!</h3>
                    <p className="text-secondary mb-4 lh-base">
                        Pesanan Anda telah dibuat. Silakan lakukan pembayaran dan upload bukti pembayaran di menu
                        <span className="fw-bold text-primary"> Transactions</span>.
                    </p>

                    <button
                        className="primaryBtn w-100 py-3 rounded-3 fw-bold text-uppercase"
                        style={{
                            letterSpacing: "1px",
                            fontSize: "0.9rem"
                        }}
                        onClick={onClose}
                    >
                        Lanjutkan Pembayaran
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

export default CheckoutSuccessModal;
