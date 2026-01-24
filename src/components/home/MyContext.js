import { createContext, useEffect, useState } from "react";
import axios from "axios";

const Context = createContext(null);

const Provider = ({ children }) => {
  const [product, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [banner, setBanner] = useState([]);

  const getDataProduct = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/product`);
    setProducts(response.data);
  };

  const getDataCategory = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/category`);
    setCategory(response.data);
  };

  const getDataBanner = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/banner`);
    setBanner(response.data);
  };

  useEffect(() => {
    getDataProduct();
    getDataCategory();
    getDataBanner();
  }, []);

  return (
    <Context.Provider value={{ product, category, banner }}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
