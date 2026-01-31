import React from 'react';

const DOAModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-primary text-white border-0">
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-shield-check me-2"></i>
                            Garansi DOA (Death On Arrival)
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="text-center mb-4">
                            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-camera-video text-primary" style={{ fontSize: '2rem' }}></i>
                            </div>
                            <p className="fw-bold text-dark">Ketentuan Klaim Garansi</p>
                        </div>

                        <div className="policy-list">
                            <div className="d-flex gap-3 mb-3">
                                <div className="flex-shrink-0">
                                    <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>1</div>
                                </div>
                                <div>
                                    <p className="mb-0">Klaim hanya berlaku apabila ikan diterima dalam kondisi <strong>mati</strong>.</p>
                                </div>
                            </div>

                            <div className="d-flex gap-3 mb-3">
                                <div className="flex-shrink-0">
                                    <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>2</div>
                                </div>
                                <div>
                                    <p className="mb-0">Wajib menyertakan <strong>video unboxing</strong> tanpa jeda/editing dari awal paket dibuka.</p>
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>3</div>
                                </div>
                                <div>
                                    <p className="mb-0">Laporan klaim maksimal <strong>1 jam</strong> setelah paket dinyatakan diterima oleh kurir.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-light rounded-3 border-start border-4 border-warning">
                            <small className="text-muted d-block">
                                <i className="bi bi-info-circle-fill text-warning me-2"></i>
                                Info: Garansi hanya menjamin penggantian ikan (apabila stok masih ada) atau pengembalian saldo seharga ikan. Ongkos kirim tidak termasuk dalam garansi.
                            </small>
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn btn-primary w-100 py-2 fw-bold" onClick={onClose}>
                            Saya Mengerti
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DOAModal;
