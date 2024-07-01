import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Order.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaLessThan, FaGreaterThan } from "react-icons/fa6";
import { originalOrders, searchOrder } from "../../redux/slices/orderSlice";
function Order() {
  const orders = useSelector((state) => state.orderReducer.orders);
  const [currentPage, setCurrentPage] = useState(1);
  const ref = useRef(null);
  const navigate = useNavigate();
  const [recordsPerPage, setRecordPerPage] = useState(10);
  const [ordersPaginated, setOrdersPaginated] = useState([]);
  const [nPages, setNPages] = useState("");
  const [pageNumbers, setPageNumbers] = useState([]);
  const [isSticky, setSticky] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const [pageBorder, setPageBorder] = useState(false);
  const recordsPerPageOptions = [10, 20, 30, 40, 50];

  const calculateContentTop = () => {
    const searchElement = document.getElementById("searchDiv");
    if (searchElement) {
      const { top } = searchElement.getBoundingClientRect();
      if (top < 15) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    }
  };

  const handleScroll = () => {
    calculateContentTop();
  };
  useEffect(() => {
    ref.current?.addEventListener("scroll", handleScroll);
    return () => {
      ref.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function timeAgo(date) {
    const now = new Date();
    const secondsAgo = Math.round((now - date) / 1000);
    const minutesAgo = Math.round(secondsAgo / 60);
    const hoursAgo = Math.round(minutesAgo / 60);
    const daysAgo = Math.round(hoursAgo / 24);

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hours ago`;
    } else {
      return `${daysAgo} days ago`;
    }
  }

  const handleSearch = () => {
    dispatch(searchOrder(query));
    setCurrentPage(1);
  };

  function usePaginatedData(orders, currentPage, recordsPerPage) {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return orders.slice(startIndex, endIndex);
  }
  function handlePageChange(currentPage) {
    setCurrentPage(currentPage);
  }

  useEffect(() => {
    const nPages = Math.ceil(orders.length / recordsPerPage);
    setNPages(nPages);
    const pageNumbers = Array.from({ length: nPages }, (_, i) => i + 1);
    setPageNumbers(pageNumbers);
    const paginatedData = usePaginatedData(orders, currentPage, recordsPerPage);
    setOrdersPaginated(paginatedData);
  }, [currentPage, recordsPerPage, orders]);

  return (
    <div
      className="order"
      ref={ref}
      onClick={(e) => {
        const selectRecord = e.target.closest(".recordsperpage");
        if (selectRecord) {
          setPageBorder(true);
        } else {
          setPageBorder(false);
        }
      }}
    >
      <div className="Order">
        <div className={isSticky ? "sticky" : "content"}>
          <div
            className="backButton"
            onClick={() => {
              navigate("/admin/order");
            }}
          >
            <FaArrowLeftLong className="icon" />
            Back
          </div>
          <div className="banner">
            <div className="heading">
              <h1 className="title">Order</h1>
              {ordersPaginated.length === 0 && <div></div>}

              {ordersPaginated.length === 1 && (
                <p className="entry"> {ordersPaginated.length} entry found </p>
              )}

              {ordersPaginated.length > 1 && (
                <p className="entry">
                  {" "}
                  {ordersPaginated.length} entries found{" "}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="searchDiv" id="searchDiv">
          <input
            type="text"
            placeholder="OrderId"
            className="input-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") {
                dispatch(originalOrders());
                setCurrentPage(1);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <FaSearch className="icon" />
          {query.length > 0 && (
            <RxCross2
              className="cross"
              onClick={() => {
                setQuery("");
                dispatch(originalOrders());
                setCurrentPage(1);
              }}
            />
          )}
        </div>
        <div className="orders" id="products">
          <div className="head" id="head">
            <div className="heading">
              <div className="orderid">
                <p>Order_ID</p>
              </div>
              <div className="createdAt">
                <p>Created_At</p>
              </div>
              <div className="Items">
                <p>Items</p>
              </div>
              <div className="order_status">
                <p>Order_Status</p>
              </div>
            </div>
          </div>
          <div className="order-list">
            {ordersPaginated?.map((order) => (
              <div className="order-item" key={order._id}>
                <div className="info">
                  <div className="orderid">
                    <p>{order.orderId}</p>
                  </div>
                  <div className="createdAt">
                    <p>{timeAgo(new Date(order.updatedAt))}</p>
                  </div>
                  <div className="items">
                    <div className="titledetail">
                      <p className="heading">Title</p>
                      {order.item.map((item) => (
                        <div key={item._id} className="aboutorder">
                          <p className="title">{item.title}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pricedetail">
                      <p className="heading">Price</p>
                      {order.item.map((item) => (
                        <div key={item._id} className="aboutorder">
                          <p className="price">{item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="quantitydetail">
                      <p className="heading">Quantity&#40;₹&#41;</p>
                      {order.item.map((item) => (
                        <div key={item._id} className="aboutorder">
                          <p className="quantity">{item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="categorydetail">
                      <p className="heading">Category</p>
                      {order.item.map((item) => (
                        <div key={item._id} className="aboutorder">
                          <p className="category">
                            {item.category.toUpperCase()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order_status">
                    <p
                      className={
                        order.order_status === "success" ? "true" : "false"
                      }
                    >
                      {order.order_status === "success"
                        ? order.order_status
                        : order.order_status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pagination">
          <div className="select">
            {pageBorder && (
              <div className="list">
                {recordsPerPageOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setPageBorder(false);
                      setRecordPerPage(option);
                      setCurrentPage(1);
                    }}
                  >
                    <p className={option === recordsPerPage ? "blue" : "white"}>
                      {option}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="records">
              <div
                className={
                  pageBorder ? "borderrecordesperpage" : "recordsperpage"
                }
                onClick={() => {
                  setPageBorder(!pageBorder);
                }}
              >
                <p>{recordsPerPage}</p>
                <IoMdArrowDropdown className="icon-down" />
              </div>

              <p className="text">Entries per page</p>
            </div>
          </div>

          <div className="page-number">
            <FaLessThan
              className={currentPage > 1 ? "less" : "no-lesser"}
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
            />
            <div className="page">
              {pageNumbers?.map((page) => (
                <div
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? "active" : "simple"}
                >
                  <p>{page}</p>
                </div>
              ))}
            </div>
            <FaGreaterThan
              className={currentPage < nPages ? "greater" : "no-greater"}
              onClick={() => {
                if (currentPage < nPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
