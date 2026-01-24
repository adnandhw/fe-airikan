import React from "react";

const PaymentSuccessModal = ({ show, onClose, waUrl }) => {
    // Auto-close removed to allow user to click WhatsApp button
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                    <div className="modal-body p-5 text-center position-relative">
                        {/* Elegant Background Decoration */}
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                background: "linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.1) 0%, rgba(255,255,255,0) 100%)",
                                zIndex: -1
                            }}
                        ></div>

                        {/* Icon Animation */}
                        <div className="mb-4">
                            <div
                                className="rounded-circle d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success push-effect"
                                style={{ width: "80px", height: "80px" }}
                            >
                                <i className="bi bi-check-lg fs-1"></i>
                            </div>
                        </div>

                        <h3 className="fw-bold mb-3 text-dark">Upload Berhasil!</h3>
                        <p className="text-muted mb-4">
                            Terima kasih! Bukti pembayaran Anda telah kami terima.
                            <br />
                            Silakan konfirmasi ke Admin via WhatsApp agar segera diproses.
                        </p>

                        <div className="d-grid gap-2">
                            {waUrl && (
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-success py-3 fw-bold rounded-pill text-uppercase"
                                    onClick={onClose} // Optional: close modal when clicked? Or keep open? keep open is safer.
                                >
                                    <i className="bi bi-whatsapp me-2"></i> Hubungi Admin
                                </a>
                            )}
                            <button
                                onClick={onClose}
                                className="btn btn-light py-3 fw-bold rounded-pill text-uppercase text-muted"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;
