import React from 'react';

const DOAModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-primary text-white border-0 py-3">
                        <h5 className="modal-title fw-bold">
                            <i className="bi bi-shield-check me-2"></i>
                            Syarat dan Ketentuan Garansi DOA (Death On Arrival)
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4 overflow-auto" style={{ maxHeight: '75vh' }}>

                        <section className="mb-4">
                            <h6 className="fw-bold text-primary border-bottom pb-2">1. Pengertian Garansi DOA</h6>
                            <p className="text-muted small mb-0">
                                Garansi DOA (Death On Arrival) adalah jaminan dari penjual apabila produk (ikan hidup) diterima pembeli dalam kondisi mati saat paket pertama kali dibuka.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h6 className="fw-bold text-primary border-bottom pb-2">2. Ketentuan Klaim Garansi</h6>
                            <p className="text-muted small mb-2">Garansi DOA hanya dapat diajukan apabila memenuhi seluruh syarat berikut:</p>
                            <ul className="text-muted small ps-3 mb-0">
                                <li className="mb-2">
                                    <strong>Pembeli wajib merekam video unboxing tanpa jeda</strong> (tanpa cut/edit) mulai dari:
                                    <ul className="ps-3 mt-1">
                                        <li>Paket masih tersegel</li>
                                        <li>Proses pembukaan paket</li>
                                        <li>Hingga kondisi ikan terlihat jelas</li>
                                    </ul>
                                </li>
                                <li className="mb-2"><strong>Klaim harus dilaporkan maksimal 1 (satu) jam</strong> setelah paket diterima oleh pembeli sesuai waktu pada resi pengiriman.</li>
                                <li className="mb-2">
                                    <strong>Kondisi ikan yang diklaim:</strong>
                                    <ul className="ps-3 mt-1">
                                        <li>Mati total saat tiba</li>
                                        <li>Bukan lemas akibat adaptasi</li>
                                        <li>Bukan mati setelah dipelihara</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Video dan/atau foto harus:</strong>
                                    <ul className="ps-3 mt-1">
                                        <li>Jelas, tidak buram</li>
                                        <li>Menunjukkan seluruh ikan yang diklaim</li>
                                        <li>Memperlihatkan jumlah ikan sesuai pesanan</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>

                        <section className="mb-4">
                            <h6 className="fw-bold text-primary border-bottom pb-2">3. Bentuk Penggantian Garansi</h6>
                            <p className="text-muted small mb-2">Jika klaim disetujui, penjual akan memberikan:</p>
                            <ul className="text-muted small ps-3 mb-2">
                                <li>Penggantian ikan pada pengiriman berikutnya, atau</li>
                                <li>Refund sesuai kesepakatan (tidak termasuk ongkos kirim)</li>
                            </ul>
                            <p className="text-muted small fst-italic mb-0">
                                Bentuk kompensasi ditentukan berdasarkan kesepakatan kedua belah pihak.
                            </p>
                        </section>

                        <section className="mb-4">
                            <h6 className="fw-bold text-danger border-bottom border-danger pb-2">4. Ketentuan yang Tidak Ditanggung Garansi</h6>
                            <p className="text-muted small mb-2">Garansi DOA TIDAK berlaku apabila:</p>
                            <ul className="text-muted small ps-3 mb-0">
                                <li className="mb-2">Pembeli tidak menyertakan video unboxing tanpa jeda.</li>
                                <li className="mb-2">Klaim diajukan melewati batas waktu yang ditentukan.</li>
                                <li className="mb-2">Paket terlambat diambil oleh pembeli.</li>
                                <li className="mb-2">Alamat pengiriman tidak lengkap atau salah.</li>
                                <li className="mb-2">
                                    <strong>Kematian disebabkan oleh:</strong>
                                    <ul className="ps-3 mt-1">
                                        <li>Kesalahan penanganan pembeli</li>
                                        <li>Perbedaan kualitas air yang ekstrem</li>
                                        <li>Tidak melakukan aklimatisasi</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Kerusakan akibat force majeure seperti:</strong>
                                    <ul className="ps-3 mt-1">
                                        <li>Bencana alam</li>
                                        <li>Keterlambatan ekspedisi di luar kendali penjual</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>

                        <section className="mb-0">
                            <h6 className="fw-bold text-primary border-bottom pb-2">5. Ketentuan Tambahan</h6>
                            <ul className="text-muted small ps-3 mb-0">
                                <li className="mb-2">Garansi DOA hanya berlaku 1 kali klaim per transaksi.</li>
                                <li className="mb-2">Penjual berhak menolak klaim apabila ditemukan indikasi kecurangan.</li>
                                <li>Dengan melakukan pembelian, pembeli dianggap telah membaca dan menyetujui seluruh syarat & ketentuan Garansi DOA.</li>
                            </ul>
                        </section>
                    </div>
                    <div className="modal-footer border-0 p-3 bg-light rounded-bottom">
                        <button type="button" className="btn btn-primary w-100 py-2 fw-bold" onClick={onClose}>
                            SAYA MENGERTI & SETUJU
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DOAModal;
