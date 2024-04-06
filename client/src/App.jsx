// import './App.css'
import Navbar from "./components/navbar/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import ProductDetail from "./pages/productdetail/ProductDetail";
import Collection from "./pages/collection/Collection";
import AdminDashBoard from "./pages/admindashboard/AdminDashBoard";
import RequireAdmin from "./components/RequireAdmin";
import AdminLogin from "./components/adminLogin/AdminLogin";
import OnlyIfNotLoggedIn from "./components/OnlyIfNotLoggedIn";
import Category from "./components/admindashboard/category/Category";
import CreateCategory from "./components/admindashboard/createCategory/CreateCategory";

import Order from "./components/admindashboard/order/Order";
import Product from "./components/admindashboard/product/Product";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <div>
      {isAdminRoute ? (
        <div>
          <Routes>
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminDashBoard />}>
                <Route path="category" element={<Category />}>
                <Route path="create" element={<CreateCategory />} />
              </Route>


                <Route path="product" element={<Product />} />
                <Route path="order" element={<Order />} />
              </Route>
            </Route>

            <Route element={<OnlyIfNotLoggedIn />}>
              <Route path="/adminlogin" element={<AdminLogin />} />
            </Route>
          </Routes>
        </div>
      ) : (
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId?" element={<Collection />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Routes>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
