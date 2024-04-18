import React from "react";
import "./Home.scss";
import Hero from "../../components/hero/Hero";
import Category from "../../components/category/Category";
import Naruto from "../../assets/naruto.jpeg";
import Product from "../../components/product/Product";
import { useSelector } from "react-redux";

function Home() {
  const categories = useSelector((state) => state.categoryReducer.categories);
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
            <Category key={category.id} category={category} />
          ))}
        </div>
      </section>
      <section className="collection container">
        <div className="info">
          <h2 className="heading">Our Top Picks</h2>
          <p className="subheading">All New Designs, Same Old Details.</p>
        </div>
        <div className="content">
          <Product image={Naruto} />
          <Product image={Naruto} />
          <Product image={Naruto} />
          <Product image={Naruto} />
          <Product image={Naruto} />
          <Product image={Naruto} />
        </div>
      </section>
    </div>
  );
}

export default Home;
