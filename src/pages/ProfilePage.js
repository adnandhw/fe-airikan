import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { Context } from "../MyContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import PaymentSuccessModal from "../components/PaymentSuccessModal";

// Map URL friendly slug to internal state
const tabMapping = {
    "edit-profile": "editProfile",
    "change-password": "changePassword",
    "carts": "carts",
    "transaksi": "transactions",
    "transactions": "transactions"
};

// Map internal state to URL friendly slug
const reverseTabMapping = {
    "editProfile": "edit-profile",
    "changePassword": "change-password",
    "carts": "carts",
    "transactions": "transactions"
};


const ProfilePage = () => {
    const { user, login, logout, cart, updateCartQuantity, removeFromCart, toggleItemSelection, toggleAllSelection, clearSelectedFromCart, product, productReseller } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const { username, tab } = useParams();

    // Initialize activeTab based on URL params

    // Initialize activeTab based on URL params
    const [activeTab, setActiveTab] = useState(() => {
        if (tab && tabMapping[tab]) {
            return tabMapping[tab];
        }
        // Fallback or default
        return location.state?.activeTab || "editProfile";
    });

    // Sync state if URL changes
    useEffect(() => {
        if (tab && tabMapping[tab]) {
            setActiveTab(tabMapping[tab]);
        }
    }, [tab]);

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        setMessage({ type: "", text: "" });

        // Update URL
        const userSlug = username || (user ? (user.username || user.firstName.toLowerCase()) : "user");
        const tabSlug = reverseTabMapping[newTab];
        navigate(`/profile/${userSlug}/${tabSlug}`);
    };

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    // State for Payment Success Modal
    const [successWaUrl, setSuccessWaUrl] = useState("");

    // Toast State for Auto-Dismiss Alerts
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Location Data State
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "Indonesia",
        provinceId: "",
        regencyId: "",
        districtId: "",
        villageId: "",
        address: "",
        postalCode: "",
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        password: "",
        confirmPassword: "",
    });

    // Password Visibility State
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ... (rest of code)




    // State to track if form is dirty (edited)
    const [isDirty, setIsDirty] = useState(false);

    // Sidebar Collapse State for Mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    // Auto-close sidebar on mobile when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    // Initialize form with user data
    useEffect(() => {
        if (user && !isDirty) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                country: "Indonesia",
                provinceId: user.provinceId || user.province_id || "",
                regencyId: user.regencyId || user.city_id || "",
                districtId: user.districtId || user.district_id || "",
                villageId: user.villageId || user.village_id || "",
                address: user.address || "",
                postalCode: user.postalCode || user.postal_code || "",
            });
        }
    }, [user, isDirty]);

    // Fetch Provinces on mount
    useEffect(() => {
        // Debug URL
        console.log("Fetching provinces from:", `${process.env.REACT_APP_API_BASE_URL}/api/provinces`);

        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/provinces`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setProvinces(res.data);
                } else {
                    console.error("Provinces data is not array:", res.data);
                    setMessage({ type: "danger", text: "Gagal memuat data provinsi (Format Salah)." });
                }
            })
            .catch((err) => {
                console.error("Error fetching provinces:", err);
                setMessage({ type: "danger", text: `Gagal memuat data wilayah: ${err.message}. Pastikan Backend berjalan.` });
            });
    }, []);

    // Fetch Regencies (Cities) when Province changes
    useEffect(() => {
        if (formData.provinceId) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cities?province_code=${formData.provinceId}`)
                .then((res) => setRegencies(res.data))
                .catch((err) => console.error("Error fetching cities:", err));
        } else {
            setRegencies([]);
        }
    }, [formData.provinceId]);

    // Auto-Migration Function
    const attemptAutoMigration = async (provId, currentRegID, currentDistID) => {
        console.log("Attempting Auto-Migration for", currentRegID, currentDistID);
        try {
            // 1. Fetch Emsifa District Name (to confirm it exists and get Name)
            // Note: Emsifa District URL format depends on ID length? No, usually list by regency.
            // But we don't know the REAL regency ID for this district if it's mismatched.
            // However, assume currentRegID is the Emsifa Regency ID (e.g. 3172).
            const resEmsifaDist = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${currentRegID}.json`);
            const emsifaDist = resEmsifaDist.data.find(d => String(d.id).replace(/\./g, '') === String(currentDistID).replace(/\./g, ''));

            if (!emsifaDist) return; // Not Emsifa data

            const districtName = emsifaDist.name; // "CAKUNG"

            // 2. Fetch Emsifa Regency Name (to get the intended City Name)
            const resEmsifaReg = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`);
            const emsifaReg = resEmsifaReg.data.find(r => String(r.id).replace(/\./g, '') === String(currentRegID).replace(/\./g, ''));

            if (!emsifaReg) return;
            const regencyName = emsifaReg.name; // "KOTA JAKARTA TIMUR"

            // 3. Find this Regency Name in LOCAL API
            const resLocalReg = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cities?province_code=${provId}`);

            // Fuzzy Match Helper
            const normalizeName = (n) => n.toUpperCase().replace('ADMINISTRASI', '').replace(/[^A-Z]/g, '');

            const targetName = normalizeName(regencyName);
            const localReg = resLocalReg.data.find(r => normalizeName(r.name) === targetName);

            if (!localReg) return;
            const newRegencyId = localReg.id; // 3175

            // 4. Find the District Name in LOCAL API (under new Regency)
            const resLocalDist = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/districts?city_code=${newRegencyId}`);
            const targetDistName = normalizeName(districtName);
            const localDist = resLocalDist.data.find(d => normalizeName(d.name) === targetDistName);

            if (!localDist) return;
            const newDistrictId = localDist.id; // 317508

            console.log("Migration Success! Remapping to:", newRegencyId, newDistrictId);

            // 5. Update Form Data
            setFormData(prev => ({
                ...prev,
                regencyId: newRegencyId,
                districtId: newDistrictId
            }));

            // Optional: Show toast?
            setMessage({ type: "info", text: "Data wilayah diperbarui otomatis ke format sistem baru. Silakan simpan profil." });

        } catch (error) {
            console.error("Auto-Migration Failed:", error);
        }
    };

    // Fetch Districts when Regency changes
    useEffect(() => {
        if (formData.regencyId) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/districts?city_code=${formData.regencyId}`)
                .then((res) => {
                    setDistricts(res.data);

                    // Check for Mismatch
                    if (formData.districtId && Array.isArray(res.data) && res.data.length > 0) {
                        const found = res.data.find(d => String(d.id) === String(formData.districtId));
                        if (!found && formData.provinceId) {
                            // District ID not found in this Regency's list -> Trigger Migration
                            attemptAutoMigration(formData.provinceId, formData.regencyId, formData.districtId);
                        }
                    }
                })
                .catch((err) => console.error("Error fetching districts:", err));
        } else {
            setDistricts([]);
        }
    }, [formData.regencyId, formData.districtId, formData.provinceId]);

    // Fetch Villages when District changes
    useEffect(() => {
        if (formData.districtId) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/villages?district_code=${formData.districtId}`)
                .then((res) => setVillages(res.data))
                .catch((err) => console.error("Error fetching villages:", err));
        } else {
            setVillages([]);
        }
    }, [formData.districtId]);

    // Transaction Delivery Address State
    const [deliveryAddress, setDeliveryAddress] = useState("");

    // Construct full address when dependencies change
    useEffect(() => {
        if (activeTab === "carts") {
            const provinceName = provinces.find(p => p.id === formData.provinceId)?.name || "";
            const regencyName = regencies.find(r => r.id === formData.regencyId)?.name || "";
            const districtName = districts.find(d => d.id === formData.districtId)?.name || "";
            const villageName = villages.find(v => v.id === formData.villageId)?.name || "";

            // Start with base address
            const parts = [formData.address];

            // Add regions if available
            if (villageName) parts.push(villageName);
            if (districtName) parts.push(districtName);
            if (regencyName) parts.push(regencyName);
            if (provinceName) parts.push(provinceName);

            // Add postal code
            if (formData.postalCode) parts.push(formData.postalCode);

            const fullAddress = parts.filter(p => p && p.trim() !== "").join(", ");

            // Always update to match database/profile data when it loads
            if (fullAddress) {
                setDeliveryAddress(fullAddress);
            }
        }
    }, [activeTab, formData, provinces, regencies, districts, villages]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIsDirty(true);
        setFormData((prev) => {
            // Reset child fields when parent region changes
            if (name === "provinceId") {
                return { ...prev, [name]: value, regencyId: "", districtId: "", villageId: "" };
            }
            if (name === "regencyId") {
                return { ...prev, [name]: value, districtId: "", villageId: "" };
            }
            if (name === "districtId") {
                return { ...prev, [name]: value, villageId: "" };
            }
            return { ...prev, [name]: value };
        });
    };

    // Derived filtered cart for calculations/display (optional: if you want totals to reflect filter, use this. 
    // If totals should always be "all selected items regardless of filter", then keep using 'cart' for totals)
    // For now, only the visual list is filtered above. The totals section below uses 'cart' directly.

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // --- TRANSACTION LOGIC ---
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = useCallback(async () => {
        if (!user) return;
        try {
            const userId = user.id;
            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/transactions/user/${userId}`);
            if (res.data.success) {
                setTransactions(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === "transactions") {
            fetchTransactions();
        }
    }, [activeTab, user, fetchTransactions]);

    const handleCheckout = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        if (!user) {
            setMessage({ type: "danger", text: "Silakan masuk terlebih dahulu." });
            setLoading(false);
            return;
        }

        // 1. Validate Address
        if (!deliveryAddress || deliveryAddress.trim() === "") {
            setMessage({ type: "danger", text: "Mohon lengkapi alamat pengiriman di form Profile terlebih dahulu." });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setLoading(false);
            return;
        }

        // 2. Identify Selected Items & Patch Missing IDs
        const selectedItems = cart
            .filter(item => item.selected !== false)
            .map(item => {
                // Prioritize the existing flag from the cart (set by Detail pages)
                // This prevents "Datz" (Regular) from becoming "Reseller" just because names match.

                if (item.is_reseller === true) {
                    const found = productReseller.find(p => p.name === item.name);
                    return found ? { ...item, id: found.id, is_reseller: true } : item;
                }

                if (item.is_reseller === false) {
                    const found = product.find(p => p.name === item.name);
                    return found ? { ...item, id: found.id, is_reseller: false } : item;
                }

                // Fallback for legacy items (missing flag) - Only then do we guess by name
                // 1. Check Reseller List
                const foundReseller = productReseller.find(p => p.name === item.name);
                if (foundReseller) {
                    return { ...item, id: foundReseller.id, is_reseller: true };
                }

                // 2. Check Regular List
                const foundProduct = product.find(p => p.name === item.name);
                if (foundProduct) {
                    return { ...item, id: foundProduct.id, is_reseller: false };
                }

                return item;
            });

        if (selectedItems.length === 0) {
            setMessage({ type: "danger", text: "Pilih minimal satu produk untuk checkout." });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setLoading(false);
            return;
        }

        // 3. Validate Stock Availability (Real-time check against Context)
        for (const item of selectedItems) {
            // Find current product state
            let currentStock = 0;
            const foundProduct = product.find(p => p.id === item.id);
            const foundReseller = productReseller.find(p => p.id === item.id);

            if (foundProduct) {
                currentStock = foundProduct.stock;
            } else if (foundReseller) {
                currentStock = foundReseller.stock;
            } else {
                // Skip check if product not found (shouldn't happen with patched logic, but safe fallback)
                continue;
            }

            if (item.quantity > currentStock) {
                setMessage({ type: "danger", text: `Stok tidak cukup untuk produk "${item.name}". (Tersedia: ${currentStock}, Pesan: ${item.quantity})` });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setLoading(false);
                return;
            }
        }

        // 4. Calculate Total
        const calculateItemPrice = (item) => {
            if (item.tier_pricing && item.tier_pricing.length > 0) {
                const qty = item.quantity;
                const sortedTiers = [...item.tier_pricing].sort((a, b) => b.quantity - a.quantity);
                const tier = sortedTiers.find((t) => qty >= t.quantity);
                if (tier) {
                    if (tier.unit_price) return tier.unit_price;
                    if (tier.discount_percentage && item.base_price) {
                        return item.base_price * (1 - tier.discount_percentage / 100);
                    }
                }
                return item.base_price || item.price;
            }
            return item.price;
        };

        const totalAmount = selectedItems.reduce((acc, item) => acc + (calculateItemPrice(item) * item.quantity), 0);

        // 4. Construct Payload
        const payload = {
            buyer_id: user.id,
            buyer_info: {
                name: `${user.firstName} ${user.lastName}`,
                phone: user.phone || formData.phone,
                address: deliveryAddress
            },
            products: selectedItems.map(item => {
                const effectivePrice = calculateItemPrice(item);
                return {
                    product_id: item.id, // assuming item has id from product
                    name: item.name,
                    image_url: item.image_url,
                    type: item.type, // category/variant
                    price: effectivePrice,
                    quantity: item.quantity,
                    discount_percentage: item.discount_percentage || 0,
                    discount_duration: item.discount_duration || 0,
                    discount_end_date: item.discount_end_date || null,
                    is_reseller: item.is_reseller || false
                };
            }),
            total_amount: totalAmount
        };

        try {
            // 5. Send to Backend
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/transactions`, payload);

            if (res.data.success) {
                const transactionId = res.data.data.id;
                const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount);

                // Format Product List for WhatsApp
                const productList = selectedItems.map(item => `- ${item.name} (x${item.quantity})`).join('%0A');

                const buyerName = `${user.firstName} ${user.lastName}`;
                const buyerPhone = user.phone || formData.phone;

                // Construct WhatsApp Message
                const waMessage = `Halo Admin, saya ada pesanan baru.%0A%0AID: ${transactionId.toUpperCase().substring(0, 8)}%0ANama: ${buyerName}%0ANo. HP: ${buyerPhone}%0AAlamat: ${deliveryAddress}%0A%0ADetail Pesanan:%0A${productList}%0A%0ATotal: ${formattedTotal} (Belum termasuk Biaya Pengiriman)%0A%0AMohon diproses, terima kasih.`;
                const waUrl = `https://wa.me/6281284124422?text=${waMessage}`;

                // Open WhatsApp in new tab
                window.open(waUrl, '_blank');

                // 6. Clear only selected items from Cart
                clearSelectedFromCart();

                handleTabChange("transactions");
                // Trigger fetch immediately
                fetchTransactions();
            }
        } catch (error) {
            console.error("Checkout validation error:", error.response?.data);
            setMessage({ type: "danger", text: "Gagal melakukan checkout. Coba lagi nanti." });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const handleUploadProof = async (e, transactionId) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setToast("Ukuran file terlalu besar. Maksimal 2MB.");
            e.target.value = null;
            return;
        }

        const formDataVideo = new FormData();
        formDataVideo.append("image", file);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/transactions/${transactionId}/payment`, formDataVideo, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.success) {
                // Generate WA URL
                const waMessage = `Halo Admin, saya sudah upload bukti pembayaran untuk Transaksi ID: ${transactionId.toString().toUpperCase().substring(0, 8)}. Mohon dicek.`;
                const waUrl = `https://wa.me/6281284124422?text=${waMessage}`;

                setSuccessWaUrl(waUrl);
                setShowPaymentSuccess(true);
                fetchTransactions(); // Refresh list

                // Attempt to open immediately (might be blocked)
                window.open(waUrl, '_blank');
            }
        } catch (error) {
            console.error("Upload error:", error);
            const errorMsg = error.response?.data?.message || JSON.stringify(error.response?.data) || "Gagal mengupload bukti pembayaran.";
            alert(`Gagal upload: ${errorMsg}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        const userId = user.id;

        if (!user || !userId) {
            setMessage({ type: "danger", text: "ID Pengguna tidak ditemukan. Silakan masuk kembali." });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/buyers/${userId}`, formData);

            if (response.data.success) {
                setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
                setIsDirty(false);
                login(response.data.data); // Update context
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setMessage({ type: "danger", text: response.data.message || "Gagal memperbarui profil." });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMsg = error.response?.data?.message || "An error occurred while updating profile.";
            setMessage({ type: "danger", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        if (passwordData.password !== passwordData.confirmPassword) {
            setMessage({ type: "danger", text: "Kata sandi konfirmasi tidak cocok." });
            setLoading(false);
            return;
        }



        const userId = user.id;

        if (!user || !userId) {
            setMessage({ type: "danger", text: "User ID not found. Please relogin." });
            setLoading(false);
            return;
        }

        // Merge existing profile data with new password
        const updateData = {
            ...formData,
            current_password: passwordData.currentPassword,
            password: passwordData.password
        };

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/buyers/${userId}`, updateData);

            if (response.data.success) {
                setMessage({ type: "success", text: "Kata sandi berhasil diperbarui!" });
                setPasswordData({ currentPassword: "", password: "", confirmPassword: "" }); // Reset password fields
                login(response.data.data); // Update context
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setMessage({ type: "danger", text: response.data.message || "Gagal memperbarui kata sandi." });
            }
        } catch (error) {
            console.error("Error updating password:", error);
            const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat memperbarui password.";
            setMessage({ type: "danger", text: errorMsg });
        } finally {
            setLoading(false);
        }
    };


    if (!user) {
        return (
            <section className="section-padding">
                <div className="container text-center">
                    <h3>Silakan masuk untuk melihat profil Anda.</h3>
                </div>
            </section>
        );
    }

    return (
        <section className="section-padding">
            <div className="container">
                <div className="row">
                    {/* Sidebar / Menu */}
                    {/* Sidebar / Menu */}
                    <div className="col-md-3 mb-4" ref={sidebarRef}>
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-0">
                                {/* Mobile Toggler Header */}
                                <div
                                    className="p-4 border-bottom d-flex justify-content-between align-items-center cursor-pointer d-md-block"
                                    onClick={() => window.innerWidth < 768 && setIsSidebarOpen(!isSidebarOpen)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div>
                                        <h5 className="fw-bold mb-1">{user.firstName} {user.lastName}</h5>
                                        <small className="text-muted">{user.email}</small>
                                    </div>
                                    <i className={`bi bi-chevron-down d-md-none transition-transform ${isSidebarOpen ? "rotate-180" : ""}`}></i>
                                </div>

                                {/* Collapsible Menu List */}
                                <div className={`list-group list-group-flush py-2 ${isSidebarOpen ? "d-block" : "d-none d-md-block"}`}>
                                    <button
                                        className={`list-group-item list-group-item-action border-0 px-4 py-3 ${activeTab === "editProfile" ? "bg-light fw-bold text-primary" : "text-secondary"}`}
                                        onClick={() => { handleTabChange("editProfile"); setIsSidebarOpen(false); }}
                                    >
                                        <i className="bi bi-person-gear me-2"></i> Ubah Profil
                                    </button>
                                    <button
                                        className={`list-group-item list-group-item-action border-0 px-4 py-3 ${activeTab === "changePassword" ? "bg-light fw-bold text-primary" : "text-secondary"}`}
                                        onClick={() => { handleTabChange("changePassword"); setIsSidebarOpen(false); }}
                                    >
                                        <i className="bi bi-key me-2"></i> Ganti Kata Sandi
                                    </button>
                                    <button
                                        className={`list-group-item list-group-item-action border-0 px-4 py-3 ${activeTab === "carts" ? "bg-light fw-bold text-primary" : "text-secondary"}`}
                                        onClick={() => { handleTabChange("carts"); setIsSidebarOpen(false); }}
                                    >
                                        <i className="bi bi-cart3 me-2"></i> Keranjang
                                    </button>
                                    <button
                                        className={`list-group-item list-group-item-action border-0 px-4 py-3 ${activeTab === "transactions" ? "bg-light fw-bold text-primary" : "text-secondary"}`}
                                        onClick={() => { handleTabChange("transactions"); setIsSidebarOpen(false); }}
                                    >
                                        <i className="bi bi-receipt me-2"></i> Transaksi
                                    </button>
                                    <button
                                        className="list-group-item list-group-item-action border-0 px-4 py-3 text-danger"
                                        onClick={() => {
                                            setIsSidebarOpen(false);
                                            logout();
                                            navigate("/");
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i> Keluar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-md-9">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                {message.text && (
                                    <div className={`alert alert-${message.type} mb-4`} role="alert">
                                        {message.text}
                                    </div>
                                )}

                                {activeTab === "editProfile" && (
                                    <div>
                                        <h4 className="fw-bold mb-4">Ubah Profil</h4>
                                        <form onSubmit={handleSubmit}>
                                            <div className="row g-3">
                                                {/* Name */}
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold small">Nama depan</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold small">Nama belakang</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Country */}
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Negara/Wilayah</label>
                                                    <input type="text" className="form-control bg-light" value="Indonesia" readOnly />
                                                    <small className="text-muted d-block mt-1">Indonesia</small>
                                                </div>

                                                {/* Province */}
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Provinsi</label>
                                                    <select
                                                        className="form-select"
                                                        name="provinceId"
                                                        value={formData.provinceId}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Pilih Provinsi...</option>
                                                        {provinces.map((prov) => (
                                                            <option key={prov.id} value={prov.id}>{prov.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* City/Regency */}
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Kota / Kabupaten</label>
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

                                                {/* District */}
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Kecamatan</label>
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

                                                {/* Village */}
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Desa / Kelurahan</label>
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
                                                    <label className="form-label fw-bold small">Alamat Lengkap (opsional)</label>
                                                    <textarea
                                                        className="form-control"
                                                        name="address"
                                                        rows="3"
                                                        placeholder="Contoh: Jl. Otista Raya Gg. H. Abd Rahman No.4 (Patokan Alfamart)"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                    ></textarea>
                                                </div>

                                                {/* Postal Code */}
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Kode pos</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="postalCode"
                                                        value={formData.postalCode}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Contact Info (for reference, editable if desired) */}
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold small">Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold small">No. Telepon</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Save Button */}
                                                <div className="col-12 mt-4 text-end">
                                                    <button type="submit" className="primaryBtn px-5 py-2 fw-bold" disabled={loading}>
                                                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === "changePassword" && (
                                    <div>
                                        <h4 className="fw-bold mb-4">Ganti Kata Sandi</h4>
                                        <form onSubmit={handlePasswordSubmit}>
                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Kata Sandi Lama <span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            className="form-control"
                                                            name="currentPassword"
                                                            value={passwordData.currentPassword}
                                                            onChange={handlePasswordChange}
                                                            required
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        >
                                                            <i className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Kata Sandi Baru</label>
                                                    <div className="input-group">
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            className="form-control"
                                                            name="password"
                                                            value={passwordData.password}
                                                            onChange={handlePasswordChange}
                                                            required
                                                            minLength={6}
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                        >
                                                            <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-bold small">Konfirmasi Kata Sandi Baru</label>
                                                    <div className="input-group">
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            className="form-control"
                                                            name="confirmPassword"
                                                            value={passwordData.confirmPassword}
                                                            onChange={handlePasswordChange}
                                                            required
                                                            minLength={6}
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        >
                                                            <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-12 mt-4 text-end">
                                                    <button type="submit" className="primaryBtn px-5 py-2 fw-bold" disabled={loading}>
                                                        {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === "carts" && (
                                    <div>
                                        <h4 className="fw-bold mb-4">Keranjang</h4>

                                        {cart && cart.length > 0 ? (
                                            (() => {
                                                const searchParams = new URLSearchParams(location.search);
                                                const query = searchParams.get("search") || "";
                                                const filteredCart = cart.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

                                                // If filtering yields no results, show ONLY the message
                                                if (query && filteredCart.length === 0) {
                                                    return (
                                                        <div className="text-center py-5 text-muted">
                                                            Tidak ada produk yang ditemukan sesuai pencarian di Keranjang Anda.
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="row">
                                                        {/* CART ITEMS TABLE (Now Full Width) */}
                                                        <div className="col-12 mb-4">
                                                            {/* DESKTOP VIEW (Table) */}
                                                            <div className="table-responsive d-none d-md-block">
                                                                <table className="table align-middle">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="border-bottom py-3" style={{ width: "40px" }}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-check-input"
                                                                                    checked={cart.length > 0 && cart.every(item => item.selected !== false)}
                                                                                    onChange={(e) => toggleAllSelection(e.target.checked)}
                                                                                    style={{ cursor: "pointer" }}
                                                                                />
                                                                            </th>
                                                                            <th className="border-bottom py-3 text-secondary text-uppercase fw-normal" style={{ fontSize: "0.8rem", width: "40%" }}>Produk</th>
                                                                            <th className="border-bottom py-3 text-secondary text-uppercase fw-normal text-center" style={{ fontSize: "0.8rem" }}>Harga</th>
                                                                            <th className="border-bottom py-3 text-secondary text-uppercase fw-normal text-center" style={{ fontSize: "0.8rem" }}>Jumlah</th>
                                                                            <th className="border-bottom py-3 text-secondary text-uppercase fw-normal text-end" style={{ fontSize: "0.8rem" }}>Subtotal</th>
                                                                            <th className="border-bottom py-3" style={{ width: "50px" }}></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(() => {
                                                                            const searchParams = new URLSearchParams(location.search);
                                                                            const query = searchParams.get("search") || "";
                                                                            const filteredCart = cart.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

                                                                            if (filteredCart.length === 0) {
                                                                                return (
                                                                                    <tr>
                                                                                        <td colSpan="6" className="text-center py-5 text-muted">
                                                                                            Tidak ada produk yang ditemukan sesuai pencarian di Keranjang Anda.
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            }

                                                                            return filteredCart.map((item, index) => {
                                                                                const realIndex = cart.indexOf(item);
                                                                                // RESOLVE LIVE STOCK
                                                                                const foundProduct = product.find(p =>
                                                                                    (item.id && p.id && String(item.id) === String(p.id)) ||
                                                                                    (item._id && p._id && String(item._id) === String(p._id)) ||
                                                                                    (item.name === p.name)
                                                                                );
                                                                                const foundReseller = productReseller.find(p =>
                                                                                    (item.id && p.id && String(item.id) === String(p.id)) ||
                                                                                    (item._id && p._id && String(item._id) === String(p._id)) ||
                                                                                    (item.name === p.name)
                                                                                );
                                                                                // Default to item.stock if not found (though context should have it), or 0 if truly missing
                                                                                const isReseller = item.is_reseller === true || (item.name && item.name.toLowerCase().includes("[reseller]"));
                                                                                const liveStock = isReseller ? (foundReseller ? foundReseller.stock : (item.stock || 0)) : (foundProduct ? foundProduct.stock : (item.stock || 0));
                                                                                const step = isReseller ? 10 : 1;
                                                                                const minQty = isReseller ? 10 : 1;

                                                                                const isOversold = Number(item.quantity) > liveStock;

                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td className="border-bottom py-4 align-middle">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="form-check-input"
                                                                                                checked={item.selected !== false}
                                                                                                onChange={() => toggleItemSelection(realIndex)}
                                                                                                style={{ cursor: "pointer" }}
                                                                                            />
                                                                                        </td>
                                                                                        <td className="border-bottom py-4">
                                                                                            <div className="d-flex align-items-center gap-3">
                                                                                                <img
                                                                                                    src={item.image_url}
                                                                                                    alt={item.name}
                                                                                                    className="rounded"
                                                                                                    style={{ width: "120px", height: "auto", objectFit: "contain", backgroundColor: "#f8f9fa", padding: "5px", cursor: "pointer" }}
                                                                                                    onClick={() => {
                                                                                                        const targetId = isReseller ? (foundReseller?.id || foundReseller?._id || item._id || item.id) : (foundProduct?.id || foundProduct?._id || item.id || item._id);
                                                                                                        if (isReseller) navigate(`/product-reseller/${targetId}`);
                                                                                                        else navigate(`/product/${targetId}`);
                                                                                                    }}
                                                                                                />
                                                                                                <div>
                                                                                                    {isReseller && (
                                                                                                        <span className="badge bg-primary mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>RESELLER PRODUCT</span>
                                                                                                    )}
                                                                                                    <h6
                                                                                                        className="mb-0 text-dark fw-bold"
                                                                                                        style={{ fontSize: '0.95rem', cursor: "pointer" }}
                                                                                                        onClick={() => {
                                                                                                            const targetId = isReseller ? (foundReseller?.id || foundReseller?._id || item._id || item.id) : (foundProduct?.id || foundProduct?._id || item.id || item._id);
                                                                                                            if (isReseller) navigate(`/product-reseller/${targetId}`);
                                                                                                            else navigate(`/product/${targetId}`);
                                                                                                        }}
                                                                                                    >
                                                                                                        {item.name.replace("[RESELLER]", "").trim()}
                                                                                                    </h6>
                                                                                                    <small className="text-muted">{item.type}</small>
                                                                                                    {item.discount_percentage > 0 && (
                                                                                                        <div className="mt-1">
                                                                                                            <span className="badge bg-danger me-2">{item.discount_percentage}% OFF</span>
                                                                                                            {item.discount_end_date && (
                                                                                                                <small className="text-danger">
                                                                                                                    Berakhir: {new Date(item.discount_end_date).toLocaleDateString("id-ID")}
                                                                                                                </small>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="border-bottom py-4 text-end">
                                                                                            {(() => {
                                                                                                let effectivePrice = item.price;
                                                                                                if (item.tier_pricing && item.tier_pricing.length > 0) {
                                                                                                    const sortedTiers = [...item.tier_pricing].sort((a, b) => b.quantity - a.quantity);
                                                                                                    const tier = sortedTiers.find((t) => item.quantity >= t.quantity);
                                                                                                    if (tier) {
                                                                                                        if (tier.unit_price) effectivePrice = tier.unit_price;
                                                                                                        else if (tier.discount_percentage && item.base_price) effectivePrice = item.base_price * (1 - tier.discount_percentage / 100);
                                                                                                    } else if (item.base_price) {
                                                                                                        effectivePrice = item.base_price;
                                                                                                    }
                                                                                                }
                                                                                                // Standard discount display for non-reseller or legacy
                                                                                                if (item.discount_percentage > 0) {
                                                                                                    return (
                                                                                                        <div>
                                                                                                            <span className="text-decoration-line-through text-muted d-block" style={{ fontSize: "0.85rem" }}>
                                                                                                                Rp{Number(item.price / (1 - item.discount_percentage / 100)).toLocaleString("id-ID")}
                                                                                                            </span>
                                                                                                            <span className="text-danger fw-bold">
                                                                                                                Rp{Number(item.price).toLocaleString("id-ID")}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                                return <span className="text-muted">Rp{Number(effectivePrice).toLocaleString("id-ID")}</span>;
                                                                                            })()}
                                                                                        </td>
                                                                                        <td className="border-bottom py-4 text-center">
                                                                                            <div
                                                                                                className="d-flex align-items-center justify-content-center border rounded-pill px-2 mx-auto"
                                                                                                style={{ width: "fit-content", minWidth: "100px" }}
                                                                                            >
                                                                                                <button
                                                                                                    className="btn btn-sm text-secondary border-0 p-1"
                                                                                                    type="button"
                                                                                                    onClick={() => {
                                                                                                        const current = Number(item.quantity);
                                                                                                        if (current > minQty) {
                                                                                                            updateCartQuantity(realIndex, current - step);
                                                                                                        }
                                                                                                    }}
                                                                                                    disabled={item.quantity <= minQty}
                                                                                                >
                                                                                                    <i className="bi bi-dash fs-5"></i>
                                                                                                </button>

                                                                                                <input
                                                                                                    type="text"
                                                                                                    className="form-control text-center bg-transparent border-0 p-0 fw-bold text-dark"
                                                                                                    value={item.quantity}
                                                                                                    readOnly={isReseller}
                                                                                                    onChange={(e) => {
                                                                                                        if (isReseller) return; // Prevent typing for reseller
                                                                                                        const val = e.target.value;
                                                                                                        if (val === "") {
                                                                                                            updateCartQuantity(realIndex, "");
                                                                                                        } else {
                                                                                                            let parsed = parseInt(val);
                                                                                                            if (parsed >= 1) {
                                                                                                                // Strict Cap at Live Stock
                                                                                                                if (liveStock !== undefined && parsed > liveStock) {
                                                                                                                    setToast(`Untuk ${item.name} tidak bisa ditambahkan lagi karena melebihi Stok dikeranjang Anda`);
                                                                                                                    parsed = liveStock;
                                                                                                                }
                                                                                                                updateCartQuantity(realIndex, parsed);
                                                                                                            }
                                                                                                        }
                                                                                                    }}
                                                                                                    onBlur={() => {
                                                                                                        if (isReseller) return;
                                                                                                        if (!item.quantity || item.quantity < 1) {
                                                                                                            updateCartQuantity(realIndex, 1);
                                                                                                        }
                                                                                                    }}
                                                                                                    style={{
                                                                                                        width: "40px",
                                                                                                        appearance: "textfield",
                                                                                                        MozAppearance: "textfield",
                                                                                                        outline: "none",
                                                                                                        boxShadow: "none",
                                                                                                        cursor: isReseller ? "default" : "text",
                                                                                                        backgroundColor: isReseller ? "transparent" : ""
                                                                                                    }}
                                                                                                />

                                                                                                <button
                                                                                                    className="btn btn-sm text-secondary border-0 p-1"
                                                                                                    type="button"
                                                                                                    onClick={() => {
                                                                                                        const nextQty = Number(item.quantity) + step;
                                                                                                        if (liveStock !== undefined && nextQty > liveStock) {
                                                                                                            setToast(`Untuk ${item.name} tidak bisa ditambahkan lagi karena melebihi Stok dikeranjang Anda`);
                                                                                                            return;
                                                                                                        }
                                                                                                        updateCartQuantity(realIndex, nextQty);
                                                                                                    }}

                                                                                                >
                                                                                                    <i className="bi bi-plus fs-5"></i>
                                                                                                </button>
                                                                                            </div>
                                                                                            {isOversold && (
                                                                                                <small className="text-danger d-block mt-1 fw-bold" style={{ fontSize: "0.75rem" }}>
                                                                                                    Stok hanya tersedia: {liveStock}
                                                                                                </small>
                                                                                            )}
                                                                                        </td>
                                                                                        <td className="border-bottom py-4 text-end fw-bold">
                                                                                            {(() => {
                                                                                                let effectivePrice = item.price;
                                                                                                if (item.tier_pricing && item.tier_pricing.length > 0) {
                                                                                                    const sortedTiers = [...item.tier_pricing].sort((a, b) => b.quantity - a.quantity);
                                                                                                    const tier = sortedTiers.find((t) => item.quantity >= t.quantity);
                                                                                                    if (tier) {
                                                                                                        if (tier.unit_price) effectivePrice = tier.unit_price;
                                                                                                        else if (tier.discount_percentage && item.base_price) effectivePrice = item.base_price * (1 - tier.discount_percentage / 100);
                                                                                                    } else if (item.base_price) {
                                                                                                        effectivePrice = item.base_price;
                                                                                                    }
                                                                                                }
                                                                                                return `Rp${Number(effectivePrice * item.quantity).toLocaleString("id-ID")}`;
                                                                                            })()}
                                                                                        </td>
                                                                                        <td className="border-bottom py-4 text-end">
                                                                                            <button
                                                                                                className="btn btn-link text-danger p-0"
                                                                                                onClick={() => removeFromCart(realIndex)}
                                                                                            >
                                                                                                <i className="bi bi-trash fs-5"></i>
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            });
                                                                        })()
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* MOBILE VIEW (Card List) */}
                                                            <div className="d-block d-md-none">
                                                                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                                                                    <div className="form-check">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            id="selectAllMobile"
                                                                            checked={cart.length > 0 && cart.every(item => item.selected !== false)}
                                                                            onChange={(e) => toggleAllSelection(e.target.checked)}
                                                                        />
                                                                        <label className="form-check-label small fw-bold ms-2" htmlFor="selectAllMobile">Pilih Semua</label>
                                                                    </div>
                                                                </div>

                                                                {(() => {
                                                                    const searchParams = new URLSearchParams(location.search);
                                                                    const query = searchParams.get("search") || "";
                                                                    const filteredCart = cart.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

                                                                    if (filteredCart.length === 0) {
                                                                        return (
                                                                            <div className="text-center py-5 text-muted">
                                                                                Tidak ada produk yang ditemukan sesuai pencarian di Keranjang Anda.
                                                                            </div>
                                                                        );
                                                                    }

                                                                    return filteredCart.map((item, index) => {
                                                                        const realIndex = cart.indexOf(item);
                                                                        const foundProduct = product.find(p =>
                                                                            (item.id && p.id && String(item.id) === String(p.id)) ||
                                                                            (item._id && p._id && String(item._id) === String(p._id)) ||
                                                                            (item.name === p.name)
                                                                        );
                                                                        const foundReseller = productReseller.find(p =>
                                                                            (item.id && p.id && String(item.id) === String(p.id)) ||
                                                                            (item._id && p._id && String(item._id) === String(p._id)) ||
                                                                            (item.name === p.name)
                                                                        );
                                                                        const isReseller = item.is_reseller === true || (item.name && item.name.toLowerCase().includes("[reseller]"));
                                                                        const liveStock = isReseller ? (foundReseller ? foundReseller.stock : (item.stock || 0)) : (foundProduct ? foundProduct.stock : (item.stock || 0));
                                                                        const step = isReseller ? 10 : 1;
                                                                        const minQty = isReseller ? 10 : 1;
                                                                        const isOversold = Number(item.quantity) > liveStock;

                                                                        return (
                                                                            <div className="card mb-3 border shadow-sm rounded-4 overflow-hidden" key={index}>
                                                                                <div className="card-body p-3">
                                                                                    <div className="d-flex gap-3">
                                                                                        <div className="d-flex flex-column align-items-center gap-2">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="form-check-input mt-1"
                                                                                                checked={item.selected !== false}
                                                                                                onChange={() => toggleItemSelection(realIndex)}
                                                                                                style={{ width: '20px', height: '20px' }}
                                                                                            />
                                                                                            <img
                                                                                                src={item.image_url}
                                                                                                alt={item.name}
                                                                                                className="rounded"
                                                                                                style={{ width: "80px", height: "80px", objectFit: "contain", backgroundColor: "#f8f9fa", cursor: "pointer" }}
                                                                                                onClick={() => {
                                                                                                    const targetId = isReseller ? (foundReseller?.id || foundReseller?._id || item._id || item.id) : (foundProduct?.id || foundProduct?._id || item.id || item._id);
                                                                                                    if (isReseller) navigate(`/product-reseller/${targetId}`);
                                                                                                    else navigate(`/product/${targetId}`);
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex-grow-1">
                                                                                            {isReseller && (
                                                                                                <span className="badge bg-primary mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>RESELLER PRODUCT</span>
                                                                                            )}
                                                                                            <h6
                                                                                                className="mb-1 text-dark fw-bold line-clamp-2"
                                                                                                style={{ fontSize: '0.9rem', cursor: "pointer" }}
                                                                                                onClick={() => {
                                                                                                    const targetId = isReseller ? (foundReseller?.id || foundReseller?._id || item._id || item.id) : (foundProduct?.id || foundProduct?._id || item.id || item._id);
                                                                                                    if (isReseller) navigate(`/product-reseller/${targetId}`);
                                                                                                    else navigate(`/product/${targetId}`);
                                                                                                }}
                                                                                            >
                                                                                                {item.name.replace("[RESELLER]", "").trim()}
                                                                                            </h6>
                                                                                            <small className="text-muted d-block mb-2" style={{ fontSize: '0.8rem' }}>{item.type}</small>

                                                                                            {/* Pricing */}
                                                                                            <div className="mb-2">
                                                                                                {(() => {
                                                                                                    let effectivePrice = item.price;
                                                                                                    if (item.tier_pricing && item.tier_pricing.length > 0) {
                                                                                                        // Reuse pricing logic
                                                                                                        const tiers = [...item.tier_pricing].sort((a, b) => b.quantity - a.quantity);
                                                                                                        const tier = tiers.find(t => item.quantity >= t.quantity);
                                                                                                        if (tier) {
                                                                                                            if (tier.unit_price) effectivePrice = tier.unit_price;
                                                                                                            else if (tier.discount_percentage && item.base_price) effectivePrice = item.base_price * (1 - tier.discount_percentage / 100);
                                                                                                        } else if (item.base_price) effectivePrice = item.base_price;
                                                                                                    }

                                                                                                    if (item.discount_percentage > 0) {
                                                                                                        return (
                                                                                                            <div>
                                                                                                                <span className="text-decoration-line-through text-muted small me-2" style={{ fontSize: "0.75rem" }}>
                                                                                                                    Rp{Number(item.price / (1 - item.discount_percentage / 100)).toLocaleString("id-ID")}
                                                                                                                </span>
                                                                                                                <span className="text-danger fw-bold">
                                                                                                                    Rp{Number(item.price).toLocaleString("id-ID")}
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        )
                                                                                                    }
                                                                                                    return <span className="fw-bold text-dark">Rp{Number(effectivePrice).toLocaleString("id-ID")}</span>
                                                                                                })()}
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Delete Button (Absolute Top Right) */}
                                                                                        <button className="btn btn-link text-danger p-0 position-absolute top-0 end-0 m-3" onClick={() => removeFromCart(realIndex)}>
                                                                                            <i className="bi bi-trash"></i>
                                                                                        </button>
                                                                                    </div>

                                                                                    {/* Actions Row */}
                                                                                    <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top">
                                                                                        <div className="d-flex align-items-center border rounded-pill px-2" style={{ width: "fit-content" }}>
                                                                                            <button className="btn btn-sm btn-link text-dark p-0" onClick={() => {
                                                                                                const current = Number(item.quantity);
                                                                                                if (current > minQty) updateCartQuantity(realIndex, current - step);
                                                                                            }} disabled={item.quantity <= minQty}>
                                                                                                <i className="bi bi-dash"></i>
                                                                                            </button>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control text-center bg-transparent border-0 p-0 fw-bold mx-2"
                                                                                                value={item.quantity}
                                                                                                readOnly={isReseller}
                                                                                                style={{ width: '30px', fontSize: '0.9rem' }}
                                                                                            />
                                                                                            <button className="btn btn-sm btn-link text-dark p-0" onClick={() => {
                                                                                                const nextQty = Number(item.quantity) + step;
                                                                                                if (liveStock !== undefined && nextQty > liveStock) {
                                                                                                    setToast(`Stok tidak cukup`);
                                                                                                    return;
                                                                                                }
                                                                                                updateCartQuantity(realIndex, nextQty);
                                                                                            }}>
                                                                                                <i className="bi bi-plus"></i>
                                                                                            </button>
                                                                                        </div>

                                                                                        {/* Subtotal */}
                                                                                        <div className="text-end">
                                                                                            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Subtotal</small>
                                                                                            <span className="fw-bold text-primary">
                                                                                                {(() => {
                                                                                                    // Reuse subtotal logic or simplify access to pre-calculated if available
                                                                                                    // For now re-calc similar to desktop
                                                                                                    let effectivePrice = item.price;
                                                                                                    if (item.tier_pricing && item.tier_pricing.length > 0) {
                                                                                                        // Reuse pricing logic
                                                                                                        const tiers = [...item.tier_pricing].sort((a, b) => b.quantity - a.quantity);
                                                                                                        const tier = tiers.find(t => item.quantity >= t.quantity);
                                                                                                        if (tier) {
                                                                                                            if (tier.unit_price) effectivePrice = tier.unit_price;
                                                                                                            else if (tier.discount_percentage && item.base_price) effectivePrice = item.base_price * (1 - tier.discount_percentage / 100);
                                                                                                        } else if (item.base_price) effectivePrice = item.base_price;
                                                                                                    }
                                                                                                    return `Rp${Number(effectivePrice * item.quantity).toLocaleString("id-ID")}`;
                                                                                                })()}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    {isOversold && (
                                                                                        <div className="text-center mt-2">
                                                                                            <small className="text-danger fw-bold" style={{ fontSize: "0.75rem" }}>
                                                                                                Stok hanya tersedia: {liveStock}
                                                                                            </small>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                })()}
                                                            </div>

                                                        </div>

                                                        {/* CART TOTALS (Now Below Table) */}
                                                        <div className="col-12 mt-3">
                                                            <div className="card rounded-0 border p-4 bg-white">
                                                                <h5 className="fw-bold mb-4 text-uppercase">Total Keranjang Belanja</h5>

                                                                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                                                    <span className="fw-bold text-dark">Subtotal</span>
                                                                    <span className="text-muted">
                                                                        Rp{cart.reduce((acc, item) => {
                                                                            if (item.selected !== false) {
                                                                                let effectivePrice = item.price;
                                                                                if (item.tier_pricing && item.tier_pricing.length > 0) {
                                                                                    const sortedTiers = [...item.tier_pricing].sort((a, b) => b.quantity - a.quantity);
                                                                                    const tier = sortedTiers.find((t) => item.quantity >= t.quantity);
                                                                                    if (tier) {
                                                                                        if (tier.unit_price) effectivePrice = tier.unit_price;
                                                                                        else if (tier.discount_percentage && item.base_price) effectivePrice = item.base_price * (1 - tier.discount_percentage / 100);
                                                                                    } else if (item.base_price) {
                                                                                        effectivePrice = item.base_price;
                                                                                    }
                                                                                }
                                                                                return acc + (effectivePrice * item.quantity);
                                                                            }
                                                                            return acc;
                                                                        }, 0).toLocaleString("id-ID")}
                                                                    </span>
                                                                </div>

                                                                <div className="mb-3 pb-3 border-bottom">
                                                                    <label className="fw-bold text-dark mb-2">Alamat Pengiriman</label>
                                                                    <textarea
                                                                        className="form-control form-control-sm bg-light"
                                                                        rows="4"
                                                                        value={deliveryAddress}
                                                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                                                        placeholder="Masukkan alamat lengkap..."
                                                                    ></textarea>
                                                                    <small className="text-muted d-block mt-1 fst-italic">
                                                                        *Alamat ini akan digunakan untuk pengiriman.
                                                                    </small>
                                                                </div>

                                                                <div className="d-flex justify-content-between mb-2">
                                                                    <span className="fw-bold text-dark fs-5">Total</span>
                                                                    <div className="text-end">
                                                                        <span className="fw-bold text-primary fs-5 d-block">
                                                                            Rp{cart.reduce((acc, item) => {
                                                                                if (item.selected !== false) {
                                                                                    let effectivePrice = item.price;
                                                                                    if (item.tier_pricing && item.tier_pricing.length > 0) {
                                                                                        const sortedTiers = [...item.tier_pricing].sort((a, b) => b.quantity - a.quantity);
                                                                                        const tier = sortedTiers.find((t) => item.quantity >= t.quantity);
                                                                                        if (tier) {
                                                                                            if (tier.unit_price) effectivePrice = tier.unit_price;
                                                                                            else if (tier.discount_percentage && item.base_price) effectivePrice = item.base_price * (1 - tier.discount_percentage / 100);
                                                                                        } else if (item.base_price) {
                                                                                            effectivePrice = item.base_price;
                                                                                        }
                                                                                    }
                                                                                    return acc + (effectivePrice * item.quantity);
                                                                                }
                                                                                return acc;
                                                                            }, 0).toLocaleString("id-ID")}
                                                                        </span>
                                                                        <small className="text-muted fst-italic" style={{ fontSize: "0.75rem" }}>
                                                                            (Belum termasuk Biaya Pengiriman)
                                                                        </small>

                                                                    </div>
                                                                </div>

                                                                <button
                                                                    className="primaryBtn w-100 py-3 fw-bold text-uppercase"
                                                                    style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
                                                                    onClick={handleCheckout}
                                                                    disabled={loading || cart.some(item => {
                                                                        // Use same logic as above to find live stock for button validation
                                                                        if (item.selected === false) return false;
                                                                        const foundProduct = product.find(p =>
                                                                            (item.id && p.id && String(item.id) === String(p.id)) ||
                                                                            (item._id && p._id && String(item._id) === String(p._id)) ||
                                                                            (item.name === p.name)
                                                                        );
                                                                        const foundReseller = productReseller.find(p =>
                                                                            (item.id && p.id && String(item.id) === String(p.id)) ||
                                                                            (item._id && p._id && String(item._id) === String(p._id)) ||
                                                                            (item.name === p.name)
                                                                        );
                                                                        const liveStock = foundProduct ? foundProduct.stock : (foundReseller ? foundReseller.stock : (item.stock !== undefined ? item.stock : Infinity));
                                                                        return item.quantity > liveStock;
                                                                    })}
                                                                >
                                                                    {loading ? "Processing..." : "Lanjutkan ke Checkout"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="bi bi-cart-x fs-1 text-muted mb-3 d-block"></i>
                                                <p className="text-muted">Keranjang belanja Anda kosong.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "transactions" && (
                                    <div>
                                        <h4 className="fw-bold mb-4">Transactions</h4>

                                        {transactions.length > 0 ? (
                                            <div className="d-flex flex-column gap-4">
                                                {transactions.map((trx) => (
                                                    <div key={trx._id} className="card border shadow-sm rounded-4 overflow-hidden">
                                                        <div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center py-3 gap-2">
                                                            <div className="mb-1 mb-md-0">
                                                                <span className="fw-bold text-dark">#{(trx._id || trx.id || "").toString().substring(0, 8).toUpperCase()}</span>
                                                                <span className="mx-2 text-muted">|</span>
                                                                <span className="text-muted small">{new Date(trx.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                            <span className={`badge rounded-pill px-3 py-2 ${trx.status === 'pending' ? 'bg-warning text-dark' :
                                                                trx.status === 'paid' ? 'bg-info text-white' :
                                                                    trx.status === 'shipped' ? 'bg-primary' :
                                                                        trx.status === 'completed' ? 'bg-success' :
                                                                            trx.status === 'reject' ? 'bg-danger' : 'bg-secondary'
                                                                }`}>
                                                                {trx.status === 'pending' ? 'Belum Bayar' :
                                                                    trx.status === 'paid' ? 'Menunggu Konfirmasi' :
                                                                        trx.status === 'approve' ? 'Pembayaran Diterima(Selesai)' :
                                                                            trx.status === 'reject' ? 'Pembayaran Ditolak' :
                                                                                trx.status}
                                                            </span>
                                                        </div>
                                                        <div className="card-body p-4">
                                                            {/* Buyer Info Snapshot */}
                                                            <div className="mb-4 pb-3 border-bottom">
                                                                <h6 className="fw-bold text-muted text-uppercase small mb-3">Info Pengiriman</h6>
                                                                <p className="mb-1 fw-bold">{trx.buyer_info.name}</p>
                                                                <p className="mb-1 small text-muted"><i className="bi bi-telephone me-2"></i>{trx.buyer_info.phone}</p>
                                                                <p className="mb-0 small text-muted"><i className="bi bi-geo-alt me-2"></i>{trx.buyer_info.address}</p>
                                                            </div>

                                                            {/* Products */}
                                                            {/* DESKTOP VIEW (Table) */}
                                                            <div className="table-responsive mb-4 d-none d-md-block">
                                                                <table className="table fs-sm">
                                                                    <thead className="bg-light">
                                                                        <tr>
                                                                            <th className="border-0">Produk</th>
                                                                            <th className="border-0 text-center">Jumlah</th>
                                                                            <th className="border-0 text-end">Harga</th>
                                                                            <th className="border-0 text-end">Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {(trx.detail?.products || trx.products || []).map((item, idx) => (
                                                                            <tr key={idx}>
                                                                                <td className="align-middle">
                                                                                    <div className="d-flex align-items-center gap-3">
                                                                                        <img src={item.image_url} alt={item.name} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'contain', backgroundColor: '#f8f9fa' }} />
                                                                                        <div>
                                                                                            {(item.is_reseller === true || (item.name && item.name.toLowerCase().includes("[reseller]")) || productReseller.some(p => p.id === item.product_id || p._id === item.product_id)) && (
                                                                                                <span className="badge bg-primary mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>RESELLER PRODUCT</span>
                                                                                            )}
                                                                                            <p className="mb-0 fw-bold">{item.name.replace("[RESELLER]", "").trim()}</p>
                                                                                            <small className="text-muted">{item.type}</small>
                                                                                            {item.discount_percentage > 0 && (
                                                                                                <div className="mt-1">
                                                                                                    <span className="badge bg-danger me-2">{item.discount_percentage}% OFF</span>
                                                                                                    {item.discount_end_date && (
                                                                                                        <small className="text-danger">

                                                                                                            Berakhir: {new Date(item.discount_end_date).toLocaleDateString("id-ID")}
                                                                                                        </small>
                                                                                                    )}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="align-middle text-center">{item.quantity}</td>
                                                                                <td className="align-middle text-end">
                                                                                    {item.discount_percentage > 0 ? (
                                                                                        <div>
                                                                                            <span className="text-decoration-line-through text-muted d-block" style={{ fontSize: "0.85rem" }}>
                                                                                                Rp{Number(item.price / (1 - item.discount_percentage / 100)).toLocaleString('id-ID')}
                                                                                            </span>
                                                                                            <span className="text-danger fw-bold">
                                                                                                Rp{Number(item.price).toLocaleString('id-ID')}
                                                                                            </span>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span>Rp{Number(item.price).toLocaleString('id-ID')}</span>
                                                                                    )}
                                                                                </td>
                                                                                <td className="align-middle text-end fw-bold">Rp{Number(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>

                                                            {/* MOBILE VIEW (List) */}
                                                            <div className="d-block d-md-none mb-4">
                                                                {(trx.detail?.products || trx.products || []).map((item, idx) => (
                                                                    <div key={idx} className="d-flex gap-3 mb-3 border-bottom pb-3">
                                                                        <img
                                                                            src={item.image_url}
                                                                            alt={item.name}
                                                                            className="rounded flex-shrink-0"
                                                                            style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                                                        />
                                                                        <div className="flex-grow-1">
                                                                            {(item.is_reseller === true || (item.name && item.name.toLowerCase().includes("[reseller]")) || productReseller.some(p => p.id === item.product_id || p._id === item.product_id)) && (
                                                                                <span className="badge bg-primary mb-1" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>RESELLER PRODUCT</span>
                                                                            )}
                                                                            <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{item.name.replace("[RESELLER]", "").trim()}</h6>
                                                                            <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>{item.type}</small>

                                                                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end mt-2 gap-1">
                                                                                <div style={{ fontSize: '0.85rem' }}>
                                                                                    <span className="text-muted">{item.quantity} x </span>
                                                                                    {item.discount_percentage > 0 ? (
                                                                                        <span className="text-danger fw-bold">
                                                                                            Rp{Number(item.price).toLocaleString('id-ID')}
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span>Rp{Number(item.price).toLocaleString('id-ID')}</span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="fw-bold text-dark">
                                                                                    Rp{Number(item.price * item.quantity).toLocaleString('id-ID')}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/* Footer / Actions */}
                                                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
                                                                {/* Upload Button */}
                                                                <div className="w-100 w-md-auto">
                                                                    {trx.status === 'pending' && (
                                                                        <div>
                                                                            <input
                                                                                type="file"
                                                                                id={`upload-${trx.id || trx._id}`}
                                                                                style={{ display: 'none' }}
                                                                                accept="image/*"
                                                                                onChange={(e) => handleUploadProof(e, trx.id || trx._id)}
                                                                            />
                                                                            <label htmlFor={`upload-${trx.id || trx._id}`} className="primaryBtn px-4 py-2 small fw-bold w-100 text-center" style={{ cursor: 'pointer' }}>
                                                                                <i className="bi bi-upload me-2"></i> Upload Bukti Pembayaran
                                                                            </label>
                                                                            <small className="d-block mt-1 text-muted text-center text-md-start">Format: JPG, PNG (Max 2MB)</small>
                                                                        </div>
                                                                    )}
                                                                    {trx.payment_proof && trx.status !== 'pending' && (
                                                                        <div className="text-center text-md-start">
                                                                            <span className="text-success small"><i className="bi bi-check-circle-fill me-1"></i> Bukti terupload</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Total Payment */}
                                                                <div className="text-center text-md-end">
                                                                    <p className="small text-muted mb-1">Total Pembayaran</p>
                                                                    <h4 className="fw-bold text-primary mb-0">Rp{Number(trx.total_amount).toLocaleString('id-ID')}</h4>
                                                                    <small className="text-muted fst-italic" style={{ fontSize: "0.75rem" }}>
                                                                        (Belum termasuk Biaya Pengiriman)
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <i className="bi bi-clipboard-x fs-1 text-muted mb-3 d-block"></i>
                                                <p className="text-muted">Belum ada transaksi.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                <PaymentSuccessModal
                    show={showPaymentSuccess}
                    waUrl={successWaUrl}
                    onClose={() => setShowPaymentSuccess(false)}
                />

                {/* Toast Notification Overlay */}
                {toast && (
                    <div
                        style={{
                            position: "fixed",
                            top: "100px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 9999,
                            backgroundColor: "rgba(0, 0, 0, 0.85)",
                            color: "#fff",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            fontSize: "0.9rem",
                            fontWeight: "500",
                            textAlign: "center",
                            minWidth: "300px",
                            animation: "fadeIn 0.3s ease-in-out"
                        }}
                    >
                        {toast}
                    </div>
                )}

            </div>
        </section>
    );
};

export default ProfilePage;
