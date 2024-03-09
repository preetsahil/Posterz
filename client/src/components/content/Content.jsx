import React from "react";
import Detail from "../admindashboard/detail/Detail";
import Category from "../admindashboard/category/Category";
import Product from "../admindashboard/product/Product";
import Order from "../admindashboard/order/Order";
function Content({ content }) {
  const contentComponents = {
    Home: <Detail />,
    Category: <Category />,
    Product: <Product />,
    Order: <Order />,
  };
  return <div className="content">{contentComponents[content]}</div>;
}

export default Content;
