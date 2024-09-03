import React, { useEffect, useState } from "react";
import "./Home.scss";
import Hero from "../../components/hero/Hero";
import Category from "../../components/category/Category";
import Product from "../../components/product/Product";
import { useSelector } from "react-redux";
import { axiosClient } from "../../utils/axiosClient";

function Home() {
  const [topProducts, setTopProducts] = useState([]);
  const categories = useSelector(
    (state) => state.categoryReducer.originalCategories
  );
  async function fetchData() {
    try {
      const topProductResponse = await axiosClient.get(
        "/api/products/?isTopPick=true"
      );
      setTopProducts(topProductResponse.data.products);
    } catch (error) {}
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="Home">
      <Hero />
      <section className="collection container">
        <div className="info">
          <h2 className="heading">Shop By Categories</h2>
          <p className="subheading">
            Shop from the best, our Anime, Sports and TV Posters Collection.
          </p>
        </div>
        <div className="content">
          {categories?.map((category) => (
            <Category key={category._id} category={category} />
          ))}
        </div>
      </section>
      <section className="collection container">
        <div className="info">
          <h2 className="heading">Our Top Picks</h2>
          <p className="subheading">All New Designs, Same Old Details.</p>
        </div>
        <div className="content">
          {topProducts?.map((product) => {
            return <Product key={product._id} product={product} />;
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
