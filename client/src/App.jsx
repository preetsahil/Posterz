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
import Category from "./pages/category/Category";
import CreateCategory from "./pages/createCategory/CreateCategory";
import UpdateCategory from "./pages/UpdateCategory/UpdateCategory";
import Order from "./pages/order/Order";
import Payments from "./components/payments/Payments";
import Product from "./pages/product/Product";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "./redux/slices/categorySlice";
import { fetchProducts } from "./redux/slices/productSlice";
import toast, { Toaster } from "react-hot-toast";
import CreateProduct from "./pages/CreateProduct/CreateProduct";
import UpdateProduct from "./pages/UpdateProduct/UpdateProduct";
import Login from "./pages/login/Login";
import OnlyIfNotLoggedInUser from "./components/OnlyIfNotLoggedInUser";
import RequestAdmin from "./pages/requestAdmin/RequestAdmin";
import RequireAcess from "./components/RequireAcess";
import Statistics from "./pages/statistics/Statistics";
import Profile from "./pages/profile/Profile";
import ForgetPassword from "./pages/forgetpassword/ForgetPassword";
import ResetPassword from "./pages/resetpassword/ResetPassword";
import Termsandconditions from "./components/Termsandconditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ContactUs from "./components/ContactUs";

export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isForgetRoute = location.pathname.startsWith("/forget");
  const isResetRoute = location.pathname.startsWith("/reset");

  const toastData = useSelector((state) => state.appConfigReducer.toastData);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);
  useEffect(() => {
    switch (toastData?.type) {
      case TOAST_SUCCESS:
        toast.success(toastData.message);
        break;
      case TOAST_FAILURE:
        toast.error(toastData.message);
        break;
    }
  }, [toastData]);

  return (
    <div>
      {isAdminRoute || isForgetRoute || isResetRoute ? (
        <div>
          <div>
            <Toaster
              toastOptions={{
                success: {
                  style: {
                    marginTop: "10px",
                    background: "#0d122f",
                    border: "0.1em solid #474f7a",
                    color: "rgb(244, 244, 244)",
                  },
                },
                error: {
                  style: {
                    marginTop: "10px",
                    background: "#0d122f",
                    border: "0.1em solid #474f7a",
                    color: "rgb(244, 244, 244)",
                  },
                },
              }}
            />
          </div>
          <Routes>
            <Route path="/forget" element={<ForgetPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminDashBoard />}>
                <Route path="category" element={<Category />}>
                  <Route path="create" element={<CreateCategory />} />
                  <Route path=":categoryId" element={<UpdateCategory />} />
                </Route>
                <Route path="product" element={<Product />}>
                  <Route path="create" element={<CreateProduct />} />
                  <Route path=":productId" element={<UpdateProduct />} />
                </Route>
                <Route path="order" element={<Order />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route element={<OnlyIfNotLoggedIn />}>
              <Route path="/adminlogin" element={<AdminLogin />} />
            </Route>
          </Routes>
        </div>
      ) : (
        <div>
          <div>
            <Toaster
              toastOptions={{
                success: {
                  style: {
                    marginTop: "10px",
                    background: "#0d122f",
                    border: "0.1em solid #474f7a",
                    color: "rgb(244, 244, 244)",
                  },
                },
                error: {
                  style: {
                    marginTop: "10px",
                    background: "#0d122f",
                    border: "0.1em solid #474f7a",
                    color: "rgb(244, 244, 244)",
                  },
                },
              }}
            />
          </div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId?" element={<Collection />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/payment/:status" element={<Payments />} />
            <Route path="/termsandcondition" element={<Termsandconditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route element={<RequireAcess />}>
              <Route path="/requestAdmin" element={<RequestAdmin />} />
            </Route>
            <Route element={<OnlyIfNotLoggedInUser />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
