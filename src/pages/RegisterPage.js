import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../MyContext";
import SearchableSelect from "../components/SearchableSelect";

const RegisterPage = () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        country: "Indonesia",
        provinceId: "",
        regencyId: "",
        districtId: "",
        villageId: "",
        address: "",
        postalCode: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch Provinces on mount
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/api/provinces`)
            .then((res) => res.json())
            .then((data) => setProvinces(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error fetching provinces:", err));
    }, []);

    // Fetch Regencies when Province changes
    useEffect(() => {
        if (formData.provinceId) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cities?province_code=${formData.provinceId}`)
                .then((res) => res.json())
                .then((data) => setRegencies(Array.isArray(data) ? data : []))
                .catch((err) => console.error("Error fetching regencies:", err));
        } else {
            setRegencies([]);
        }
    }, [formData.provinceId]);

    // Fetch Districts when Regency changes
    useEffect(() => {
        if (formData.regencyId) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/districts?city_code=${formData.regencyId}`)
                .then((res) => res.json())
                .then((data) => setDistricts(Array.isArray(data) ? data : []))
                .catch((err) => console.error("Error fetching districts:", err));
        } else {
            setDistricts([]);
        }
    }, [formData.regencyId]);

    // Fetch Villages when District changes
    useEffect(() => {
        if (formData.districtId) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/api/villages?district_code=${formData.districtId}`)
                .then((res) => res.json())
                .then((data) => setVillages(Array.isArray(data) ? data : []))
                .catch((err) => console.error("Error fetching villages:", err));
        } else {
            setVillages([]);
        }
    }, [formData.districtId]);

    const [errors, setErrors] = useState({});



    // ... (Keep existing useEffects for regencies, districts, villages - simplified here for brevity, assume they are unchanged or I should include them if I replace the whole file? simpler to use replace_file_content for chunks or entire file. The file is small enough, I will replace the component logic and render)
    // Wait, replacing logic and render separately is safer for large file.
    // I will replace the logic part first (state and handleSubmit) then the render part.

    // Let's replace the whole handleSubmit block and add state.

    // ... useEffects ...

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            // Reset child fields logic
            if (name === "provinceId") return { ...prev, [name]: value, regencyId: "", districtId: "", villageId: "", postalCode: "" };
            if (name === "regencyId") return { ...prev, [name]: value, districtId: "", villageId: "", postalCode: "" };
            if (name === "districtId") return { ...prev, [name]: value, villageId: "", postalCode: "" };

            if (name === "villageId") {
                const selectedVillage = villages.find(v => v.id === value);
                let newPostalCode = prev.postalCode;
                if (selectedVillage && selectedVillage.meta && selectedVillage.meta.pos) {
                    newPostalCode = selectedVillage.meta.pos;
                }
                return { ...prev, [name]: value, postalCode: newPostalCode };
            }

            return { ...prev, [name]: value };
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Auto-close modal after 3 seconds
    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessModal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Clear previous errors

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: "Kata sandi tidak cocok!" });
            setLoading(false);
            return;
        }



        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/buyers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Registration Successful:", data);
                setShowSuccessModal(true);
                window.scrollTo(0, 0);
                setFormData({
                    firstName: "",
                    lastName: "",
                    country: "Indonesia",
                    provinceId: "",
                    regencyId: "",
                    districtId: "",
                    villageId: "",
                    address: "",
                    postalCode: "",
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
            } else {
                console.error("Registration Failed:", data);
                if (data.errors) {
                    const formattedErrors = {};
                    Object.keys(data.errors).forEach(key => {
                        formattedErrors[key] = data.errors[key][0];
                    });
                    setErrors(formattedErrors);
                } else {
                    alert(`Registration Failed: ${data.message || "Unknown error"}`);
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-padding">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">
                                <h2 className="mb-4 fw-bold">Pendaftaran</h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-4">
                                        {/* Name Fields */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Nama depan <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold">Nama belakang <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                        </div>

                                        {/* Country & Province */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Negara/Wilayah <span className="text-danger">*</span></label>
                                            <input type="text" className="form-control bg-light" value="Indonesia" readOnly />
                                            <small className="text-muted d-block mt-1">Indonesia</small>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold">Provinsi <span className="text-danger">*</span></label>
                                            <SearchableSelect
                                                options={provinces}
                                                value={formData.provinceId}
                                                onChange={(val) => handleChange({ target: { name: 'provinceId', value: val } })}
                                                placeholder="Pilih Provinsi..."
                                            />
                                        </div>

                                        {/* City/Regency */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Kota / Kabupaten <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select"
                                                name="regencyId"
                                                value={formData.regencyId}
                                                onChange={handleChange}
                                                disabled={!formData.provinceId}
                                                required
                                            >
                                                <option value="">Pilih Kota...</option>
                                                {regencies.map((reg) => (
                                                    <option key={reg.id} value={reg.id}>{reg.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* District (Kecamatan) */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Kecamatan <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select"
                                                name="districtId"
                                                value={formData.districtId}
                                                onChange={handleChange}
                                                disabled={!formData.regencyId}
                                                required
                                            >
                                                <option value="">Pilih Kecamatan...</option>
                                                {districts.map((dist) => (
                                                    <option key={dist.id} value={dist.id}>{dist.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Village (Desa/Kelurahan) */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Desa / Kelurahan <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select"
                                                name="villageId"
                                                value={formData.villageId}
                                                onChange={handleChange}
                                                disabled={!formData.districtId}
                                                required
                                            >
                                                <option value="">Pilih Desa...</option>
                                                {villages.map((vill) => (
                                                    <option key={vill.id} value={vill.id}>{vill.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Full Address */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Alamat Lengkap <small className="text-muted fw-normal">(opsional)</small></label>
                                            <textarea
                                                className="form-control"
                                                name="address"
                                                rows="3"
                                                placeholder="Contoh: Jl. Otista Raya Gg. H. Abd Rahman No.4 (Patokan Alfamart)"
                                                value={formData.address}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Kode pos <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold">No. Handphone <span className="text-danger">*</span></label>
                                            <input
                                                type="tel"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold">Alamat email <span className="text-danger">*</span></label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>

                                        {/* Password */}
                                        <div className="col-12">
                                            <label className="form-label fw-bold">Buat kata sandi akun <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                    name="password"
                                                    placeholder="Kata sandi"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <span
                                                    className="input-group-text bg-white cursor-pointer"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                </span>
                                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label fw-bold">Konfirmasi Kata Sandi <span className="text-danger">*</span></label>
                                            <div className="input-group">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                    name="confirmPassword"
                                                    placeholder="Konfirmasi Kata sandi"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <span
                                                    className="input-group-text bg-white cursor-pointer"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                </span>
                                                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="col-12 mt-4">
                                            <button type="submit" className="primaryBtn w-100" disabled={loading}>
                                                {loading ? "Mendaftar..." : "Daftar"}
                                            </button>
                                        </div>

                                        <div className="col-12 text-center mt-3">
                                            <p className="mb-0 text-muted">
                                                Sudah punya akun? <Link to="/login" className="text-decoration-none fw-bold text-primary">Masuk</Link>
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUCCESS MODAL */}
                {showSuccessModal && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ zIndex: 1055, backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setShowSuccessModal(false)}
                    >
                        <div
                            className="card border-0 shadow-lg rounded-4 p-4 text-center"
                            style={{ maxWidth: "400px", width: "90%" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Optional Close Button */}
                            <div className="position-absolute top-0 end-0 p-3">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowSuccessModal(false)}
                                ></button>
                            </div>

                            <div className="mb-3">
                                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                                    <i className="bi bi-check-lg text-success" style={{ fontSize: '40px' }}></i>
                                </div>
                            </div>
                            <h3 className="fw-bold mb-2">Cek Email Anda!</h3>
                            <p className="text-muted mb-4">
                                Pendaftaran berhasil. Link verifikasi telah dikirim ke email Anda. Silakan verifikasi email Anda sebelum masuk.
                            </p>
                            <Link to="/login" className="primaryBtn w-100 text-decoration-none d-block py-2">
                                Masuk
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RegisterPage;
