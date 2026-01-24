import Navigation from "./Navigation";
import BannerPromotion from "./Banner";
import { Provider } from "./MyContext";
import CategoryCard from "./CategoryCard";
import Product from "./Product";

const HomePage = () => {

    return (
        <>
        <Provider>
           <Navigation/>
          <BannerPromotion/>
          <CategoryCard/>
          <Product/>
        </Provider>
        </>
    )
}

export default HomePage
