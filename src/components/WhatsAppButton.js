import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../MyContext";

const WhatsAppButton = () => {
    const { product, productReseller } = useContext(Context);
    const location = useLocation();

    // State for drag functionality
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = React.useState(false);

    const handleStart = (clientX, clientY) => {
        setIsDragging(true);
        setStartPos({ x: clientX - position.x, y: clientY - position.y });
        setHasMoved(false);
    };

    // Mouse Events
    const onMouseDown = (e) => {
        handleStart(e.clientX, e.clientY);
    };

    // Touch Events
    const onTouchStart = (e) => {
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
    };

    // Global event listeners for move/up to catch "off-element" releases
    React.useEffect(() => {
        const handleMove = (clientX, clientY) => {
            if (isDragging) {
                const newX = clientX - startPos.x;
                const newY = clientY - startPos.y;
                setPosition({ x: newX, y: newY });

                // Check if moved significantly to consider it a drag
                if (Math.abs(newX - (clientX - startPos.x)) > 5 || Math.abs(newY - (clientY - startPos.y)) > 5 || true) {
                    setHasMoved(true);
                }
            }
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        const onMouseMove = (e) => {
            if (isDragging) {
                handleMove(e.clientX, e.clientY);
            }
        };

        const onMouseUp = () => {
            handleEnd();
        };

        const onTouchMove = (e) => {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        };

        const onTouchEnd = () => {
            handleEnd();
        };

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
            window.addEventListener('touchmove', onTouchMove, { passive: false });
            window.addEventListener('touchend', onTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [isDragging, startPos]);


    const handleWhatsAppClick = (e) => {
        // Prevent click if it was a drag operation
        if (hasMoved) {
            e.preventDefault();
            return;
        }

        const phoneNumber = "6281284124422";
        let message = "Halo Admin Air Ikan, saya mau tanya produk...";

        // Check if on Product Detail Page
        if (location.pathname.startsWith("/product/")) {
            const id = location.pathname.split("/")[2];
            const currentProduct = product.find(p => p.id === id);
            if (currentProduct) {
                message = `Halo Admin Air Ikan, saya tertarik dengan produk *${currentProduct.name}*. Stok ready?`;
            }
        }
        // Check if on Product Reseller Detail Page
        else if (location.pathname.startsWith("/product-reseller/")) {
            const id = location.pathname.split("/")[2];
            // Reseller products might use _id or id
            const currentProduct = productReseller.find(p => (p.id === id || p._id === id));
            if (currentProduct) {
                message = `Halo Admin Air Ikan, saya tertarik dengan produk reseller *${currentProduct.name}*. Stok ready?`;
            }
        }

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <button
            onClick={handleWhatsAppClick}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className="btn btn-light shadow-lg d-flex align-items-center gap-1"
            style={{
                background: "#25D366",
                position: "fixed",
                bottom: "10px", // Default, but overrideable by drag
                right: "5px",  // Default
                zIndex: 1000,
                borderRadius: "20px",
                padding: "2px 5px",
                border: "1px solid #25D366",
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none'
            }}
        >
            <i className="bi bi-whatsapp fs-4" style={{ color: "#f8f8f8" }}></i>
            <span className="fw-bold fs-6" style={{ color: "#f8f8f8" }}>Chat</span>
        </button>
    );
};

export default WhatsAppButton;
