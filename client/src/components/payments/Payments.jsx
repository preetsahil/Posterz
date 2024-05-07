import React from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { BsFillCartCheckFill } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";
import "./Payments.scss";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";

function Payments() {
  const params = useParams();
  const status = params.status;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const infoData = {
    success: {
      message: "Your order has been placed",
      cta: "Shop More",
      icon: <BsFillCartCheckFill />,
    },
    failed: {
      message: "Payment Failed",
      cta: "Try Again",
      icon: <BiErrorCircle />,
    },
  };

  if (status === "success") {
    dispatch(clearCart());
  }

  return (
    <div className="Payments">
      <div className="icon">{infoData[status].icon}</div>
      <h2 className="message">{infoData[status].message}</h2>
      <button
        className="btn-primary"
        onClick={() => {
          navigate("/");
        }}
      >
        {infoData[status].cta}
      </button>
    </div>
  );
}

export default Payments;
