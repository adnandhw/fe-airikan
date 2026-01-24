import React from "react";
import ReactDOM from "react-dom";


const LoginRequiredModal = ({ show, onClose, onLogin, message }) => {
    if (!show) return null;

    return ReactDOM.createPortal(
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
                zIndex: 1060,
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)"
            }}
            onClick={onClose}
        >
            <div
                className="card border-0 shadow-lg rounded-4 overflow-hidden"
                style={{ width: "90%", maxWidth: "400px", animation: "fadeInUp 0.3s ease-out" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="card-body p-4 text-center">
                    <div className="mb-4 mt-2">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                            style={{
                                width: "80px",
                                height: "80px",
                                backgroundColor: "#eff6ff",
                                color: "#3b82f6",
                                boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.1)"
                            }}
                        >
                            <i className="bi bi-lock-fill" style={{ fontSize: "2.5rem" }}></i>
                        </div>
                    </div>

                    <h4 className="fw-bold mb-2 text-dark">Login Diperlukan</h4>
                    <p className="text-secondary mb-4 lh-base small">
                        {message || "Silakan login terlebih dahulu untuk melanjutkan."}
                    </p>

                    <div className="d-flex flex-column gap-2">
                        <button
                            className="primaryBtn w-100 py-2 justify-content-center"
                            onClick={() => {
                                onClose();
                                onLogin();
                            }}
                        >
                            Masuk Sekarang
                        </button>
                        <button
                            className="btn btn-light w-100 py-2 fw-semibold text-secondary"
                            onClick={onClose}
                        >
                            Nanti Saja
                        </button>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>,
        document.body
    );
};

export default LoginRequiredModal;
