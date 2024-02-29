import React from "react";
import Hero from "../../components/hero/Hero";

function Home() {
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
        {/* <Category  */}
        </div>
      </section>
      <section className="collection container">
        <div className="info">
          <h2 className="heading">Our Top Picks</h2>
          <p className="subheading">
            All New Designs, Same Old Details.
          </p>
        </div>
        <div className="content">
        {/* <Product  */}
        </div>
      </section>

    </div>
  );
}

export default Home;
