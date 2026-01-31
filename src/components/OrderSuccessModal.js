import React from "react";

const OrderSuccessModal = ({ show, onClose, waUrl }) => {
    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                    <div className="modal-body p-5 text-center position-relative">
                        {/* Soft Background Accent */}
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                background: "linear-gradient(135deg, rgba(var(--bs-primary-rgb), 0.05) 0%, rgba(255,255,255,0) 100%)",
                                zIndex: -1
                            }}
                        ></div>

                        {/* Animated Check Icon */}
                        <div className="mb-4">
                            <div
                                className="rounded-circle d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success"
                                style={{ width: "90px", height: "90px" }}
                            >
                                <i className="bi bi-cart-check fs-1"></i>
                            </div>
                        </div>

                        <h3 className="fw-bold mb-3 text-dark">Pesanan Berhasil!</h3>
                        <p className="text-muted mb-4 fs-6">
                            Terima kasih telah berbelanja di Air Ikan Store.
                            <br />
                            <strong className="text-dark">Silakan hubungi admin untuk konfirmasi pembayaran</strong> agar pesanan Anda dapat segera kami proses.
                        </p>

                        <div className="d-grid gap-3">
                            {waUrl && (
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-primary py-3 fw-bold rounded-pill text-uppercase shadow-sm"
                                    onClick={onClose}
                                >
                                    <i className="bi bi-whatsapp me-2"></i> Hubungi Admin untuk Pembayaran
                                </a>
                            )}
                            <button
                                onClick={onClose}
                                className="btn btn-outline-secondary py-3 fw-bold rounded-pill text-uppercase border-2"
                            >
                                Lihat Transaksi Saya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;
