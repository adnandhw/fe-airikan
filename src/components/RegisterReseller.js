import { useState, useEffect } from "react";

const RegisterReseller = ({ setShowForm, user }) => {
    const [regionNames, setRegionNames] = useState({
        province: "",
        regency: "",
        district: "",
        village: ""
    });

    useEffect(() => {
        const fetchRegionNames = async () => {
            if (!user) return;

            const provinceId = user.provinceId || user.province_id;
            const regencyId = user.regencyId || user.city_id;
            const districtId = user.districtId || user.district_id;
            const villageId = user.villageId || user.village_id;

            // Helper to normalize IDs (remove dots)
            const normalizeId = (id) => String(id).replace(/\./g, '');

            const resolved = {
                province: "",
                regency: "",
                district: "",
                village: ""
            };

            let isEmsifa = false;

            try {
                // 1. Fetch Province (Prioritize Local, Fallback Emsifa)
                if (provinceId) {
                    let name = "";
                    try {
                        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/provinces`);
                        const data = await res.json();
                        const found = Array.isArray(data)
                            ? data.find(p => normalizeId(p.id) === normalizeId(provinceId))
                            : Object.entries(data).find(([id, n]) => normalizeId(id) === normalizeId(provinceId));
                        if (found) name = Array.isArray(data) ? found.name : found[1];
                    } catch (e) { }

                    if (!name) {
                        try {
                            const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`);
                            const data = await res.json();
                            const found = data.find(p => normalizeId(p.id) === normalizeId(provinceId));
                            if (found) name = found.name;
                        } catch (e) { }
                    }
                    resolved.province = name;
                }

                // 2. Fetch Regency (Initial Local Fetch)
                if (regencyId) {
                    let name = "";
                    try {
                        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cities?province_code=${provinceId}`);
                        const data = await res.json();
                        const found = Array.isArray(data)
                            ? data.find(p => normalizeId(p.id) === normalizeId(regencyId))
                            : Object.entries(data).find(([id, n]) => normalizeId(id) === normalizeId(regencyId));
                        if (found) name = Array.isArray(data) ? found.name : found[1];
                    } catch (e) { }

                    if (!name) {
                        try {
                            const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
                            const data = await res.json();
                            const found = data.find(p => normalizeId(p.id) === normalizeId(regencyId));
                            if (found) name = found.name;
                        } catch (e) { }
                    }
                    resolved.regency = name;
                }

                // 3. Fetch District (Check Local, Fallback Emsifa)
                if (districtId) {
                    let name = "";
                    try {
                        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/districts?city_code=${regencyId}`);
                        const data = await res.json();
                        const found = Array.isArray(data)
                            ? data.find(d => normalizeId(d.id) === normalizeId(districtId) || normalizeId(districtId).startsWith(normalizeId(d.id)))
                            : Object.entries(data).find(([id, n]) => normalizeId(id) === normalizeId(districtId));
                        if (found) name = Array.isArray(data) ? found.name : found[1];
                    } catch (e) { }

                    if (!name) {
                        try {
                            const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`);
                            const data = await res.json();
                            const found = data.find(d => normalizeId(d.id) === normalizeId(districtId));
                            if (found) {
                                name = found.name;
                                isEmsifa = true; // Mark as Emsifa Source
                            }
                        } catch (e) { }
                    }
                    resolved.district = name;
                }

                // 4. Overwrite Regency Name if Emsifa Source was used (Fixes ID Collision)
                if (isEmsifa && regencyId && provinceId) {
                    try {
                        const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
                        const data = await res.json();
                        const found = data.find(r => normalizeId(r.id) === normalizeId(regencyId));
                        if (found) resolved.regency = found.name;
                    } catch (e) { }
                }

                // 5. Fetch Village
                if (villageId) {
                    let name = "";
                    try {
                        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/villages?district_code=${districtId}`);
                        const data = await res.json();
                        const found = Array.isArray(data)
                            ? data.find(v => normalizeId(v.id) === normalizeId(villageId) || normalizeId(villageId).startsWith(normalizeId(v.id)))
                            : Object.entries(data).find(([id, n]) => normalizeId(id) === normalizeId(villageId));
                        if (found) name = Array.isArray(data) ? found.name : found[1];
                    } catch (e) { }

                    if (!name) {
                        try {
                            const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`);
                            const data = await res.json();
                            const found = data.find(v => normalizeId(v.id) === normalizeId(villageId));
                            if (found) name = found.name;
                        } catch (e) { }
                    }
                    resolved.village = name;
                }

            } catch (error) {
                console.error("Error resolving region names:", error);
            }

            // Update State ONCE
            setRegionNames(resolved);
        };

        fetchRegionNames();
    }, [user]);

    if (!user) return null;

    const isApproved = user.reseller_status === 'approved';
    const isRejected = user.reseller_status === 'reject';

    let title = "Pengajuan Sedang Dalam Proses";
    let titleClass = "text-primary";
    let alertClass = "alert-info bg-info-subtle";
    let iconClass = "bi-info-circle";
    let message = "Data Anda sedang kami verifikasi. Mohon tunggu kabar selanjutnya melalui WhatsApp atau Email.";

    if (isApproved) {
        title = "Pendaftaran Resellers Berhasil";
        titleClass = "text-success";
        alertClass = "alert-success bg-success-subtle";
        iconClass = "bi-check-circle-fill";
        message = "Selamat! Akun Anda telah disetujui sebagai Reseller. Nikmati penawaran eksklusif.";
    } else if (isRejected) {
        title = "Pengajuan Ditolak";
        titleClass = "text-danger";
        alertClass = "alert-danger bg-danger-subtle";
        iconClass = "bi-x-circle-fill";
        message = "Maaf, pengajuan reseller Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.";
    }

    return (
        <div className="card border-0 shadow-sm rounded-4 p-4 mx-auto" style={{ maxWidth: "600px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className={`fw-bold mb-0 ${titleClass}`}>
                    {title}
                </h4>
                <button className="btn-close" onClick={() => setShowForm(false)}></button>
            </div>

            <div className="list-group list-group-flush">
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Nama depan</small>
                    <div className="fw-medium">{user.firstName}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Nama belakang</small>
                    <div className="fw-medium">{user.lastName}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Negara/Wilayah</small>
                    <div className="fw-medium">Indonesia</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Provinsi</small>
                    <div className="fw-medium">{regionNames.province || user.provinceId || user.province_id}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Kota / Kabupaten</small>
                    <div className="fw-medium">{regionNames.regency || user.regencyId || user.city_id}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Kecamatan</small>
                    <div className="fw-medium">{regionNames.district || user.districtId || user.district_id}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Desa / Kelurahan</small>
                    <div className="fw-medium">{regionNames.village || user.villageId || user.village_id}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Alamat Lengkap (opsional)</small>
                    <div className="fw-medium text-break">{user.address}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Kode pos</small>
                    <div className="fw-medium">{user.postalCode || user.postal_code}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">Email</small>
                    <div className="fw-medium">{user.email}</div>
                </div>
                <div className="list-group-item py-3 px-0">
                    <small className="text-secondary fw-bold d-block mb-1">No. Telepon</small>
                    <div className="fw-medium">{user.phone}</div>
                </div>
            </div>

            <div className={`alert ${alertClass} mt-4 mb-0 border-0`}>
                <i className={`bi ${iconClass} me-2`}></i>
                {message}
            </div>
        </div>
    );
};

export default RegisterReseller;
