import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const Context = createContext(null);

const Provider = ({ children }) => {
  const [product, setProducts] = useState([]);
  const [productReseller, setProductReseller] = useState([]); // NEW STATE
  const [category, setCategory] = useState([]);
  const [banner, setBanner] = useState([]);

  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const getDataProduct = useCallback(async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/product`);
    setProducts(response.data);
  }, []);

  const getDataProductReseller = useCallback(async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/product-reseller`);
    setProductReseller(response.data);
  }, []);

  const getDataCategory = useCallback(async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/category`);
    setCategory(response.data);
  }, []);

  const getDataBanner = useCallback(async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/banner`);
    setBanner(response.data);
  }, []);

  const refreshUser = useCallback(async () => {
    // Try to get user ID from state first, then localStorage
    let currentUserId = user?.id;

    if (!currentUserId) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          currentUserId = parsed.id;
        } catch (e) {
          console.error("Error parsing saved user:", e);
        }
      }
    }

    if (!currentUserId) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/buyers/${currentUserId}`);
      console.log("Context refreshUser response:", response.data);
      if (response.data && response.data.data) {
        const freshUserData = response.data.data;
        console.log("Context refreshUser fresh data:", freshUserData);
        setUser(freshUserData);
        localStorage.setItem("user", JSON.stringify(freshUserData));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  }, [user]);

  useEffect(() => {
    // Check for saved user in localStorage on mount only
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing saved user:", e);
      }
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    getDataProduct().catch(err => console.error("Product fetch failed:", err));
    getDataProductReseller().catch(err => console.error("Reseller fetch failed:", err));
    getDataCategory().catch(err => console.error("Category fetch failed:", err));
    getDataBanner().catch(err => console.error("Banner fetch failed:", err));

    // Setup polling every 5 seconds
    const intervalId = setInterval(() => {
      getDataProduct().catch(e => { });
      getDataProductReseller().catch(e => { });
      getDataCategory().catch(e => { });
      getDataBanner().catch(e => { });
      refreshUser().catch(e => { }); // Updates user status in real-time
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [getDataProduct, getDataProductReseller, getDataCategory, getDataBanner, refreshUser]);

  // Helper to get cart key
  const getCartKey = (currentUser) => {
    const userId = currentUser ? currentUser.id : "guest";
    return `cart_${userId}`;
  };

  // Load cart when user changes
  useEffect(() => {
    const key = getCartKey(user);
    const savedCart = localStorage.getItem(key);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart:", e);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user]);

  const [cart, setCart] = useState([]);

  const saveCartToStorage = (newCart, currentUser) => {
    const key = getCartKey(currentUser);
    localStorage.setItem(key, JSON.stringify(newCart));
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(cartItem =>
        cartItem.name === item.name && !!cartItem.is_reseller === !!item.is_reseller
      );
      let newCart;

      if (existingItemIndex !== -1) {
        newCart = [...prevCart];
        const existingItem = newCart[existingItemIndex];
        const currentQty = parseInt(existingItem.quantity) || 0;
        const addQty = parseInt(item.quantity) || 1;

        newCart[existingItemIndex] = {
          ...existingItem,
          quantity: currentQty + addQty
        };
      } else {
        const itemWithMeta = { ...item, selected: true };
        newCart = [...prevCart, itemWithMeta];
      }

      saveCartToStorage(newCart, user);
      return newCart;
    });
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((_, i) => i !== index);
      saveCartToStorage(newCart, user);
      return newCart;
    });
  };

  const updateCartQuantity = (index, newQuantity) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      if (newQuantity === "") {
        newCart[index].quantity = "";
      } else {
        const parsed = parseInt(newQuantity);
        if (!isNaN(parsed) && parsed >= 1) {
          newCart[index].quantity = parsed;
        } else {
          newCart[index].quantity = 1;
        }
      }
      saveCartToStorage(newCart, user);
      return newCart;
    });
  };

  const toggleItemSelection = (index) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item, i) => {
        if (i === index) {
          const currentSelected = item.selected !== false;
          return { ...item, selected: !currentSelected };
        }
        return item;
      });
      saveCartToStorage(newCart, user);
      return newCart;
    });
  };

  const toggleAllSelection = (isSelected) => {
    setCart((prevCart) => {
      const newCart = prevCart.map(item => ({ ...item, selected: isSelected }));
      saveCartToStorage(newCart, user);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCartToStorage([], user);
  };

  const clearSelectedFromCart = () => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.selected === false);
      saveCartToStorage(newCart, user);
      return newCart;
    });
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };



  return (
    <Context.Provider value={{ product, productReseller, category, banner, user, login, logout, refreshUser, cart, setCart, addToCart, removeFromCart, updateCartQuantity, toggleItemSelection, toggleAllSelection, clearCart, clearSelectedFromCart, isLoginModalOpen, setIsLoginModalOpen }}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
