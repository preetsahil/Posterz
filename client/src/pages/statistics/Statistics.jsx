import React, { useEffect, useState } from "react";
import "./Statistics.scss";
import { axiosClient } from "../../utils/axiosClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4B4B",
  "#5D3FD3",
];

function Statistics() {
  const [stats, setStats] = useState({
    categoryStats: {},
    productStats: {},
    mostFrequentCategories: [],
    leastFrequentProducts: [],
    mostFrequentProducts: [],
    leastFrequentCategories: [],
    totalRevenue: "",
    totalOrders: "",
  });

  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [revenuePieData, setRevenuePieData] = useState([]);
  const [salesPieData, setSalesPieData] = useState([]);
  const getStats = async () => {
    try {
      const res = await axiosClient.get("/admin/statistics");
      setStats(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    getStats();
  }, []);
  useEffect(() => {
    const formattedCategoryData = Object.keys(stats.categoryStats).map(
      (key) => ({
        name: key,
        totalSales: stats.categoryStats[key].totalQuantity,
        totalRevenue: stats.categoryStats[key].totalRevenue,
      })
    );
    setCategoryData(formattedCategoryData);

    const formattedProductData = Object.keys(stats.productStats).map((key) => ({
      name: key,
      totalSales: stats.productStats[key].totalQuantity,
      totalRevenue: stats.productStats[key].totalRevenue,
    }));

    const formattedRevenuePieData = formattedCategoryData.map((category) => {
      return {
        name: category.name,
        value: parseFloat(
          ((category.totalRevenue / stats.totalRevenue) * 100).toFixed(2)
        ),
      };
    });
    const totalCategorySales = formattedCategoryData.reduce(
      (a, b) => a + b.totalSales,
      0
    );
    const formattedSalesPieData = formattedCategoryData.map((category) => {
      return {
        name: category.name,
        value: parseFloat(
          ((category.totalSales / totalCategorySales) * 100).toFixed(2)
        ),
      };
    });
    setSalesPieData(formattedSalesPieData);
    setRevenuePieData(formattedRevenuePieData);
    setProductData(formattedProductData);
  }, [stats]);

  return (
    <div className="Statistics">
      <div className="box">
        <p className="total-revenue">
          Total Revenue Collected: ₹{stats.totalRevenue}
        </p>
        <p className="total-orders">
          Total Orders till Now: {stats.totalOrders}
        </p>
      </div>

      <div className="bar1">
        <p className="heading">Total Revenue per Category </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={categoryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 22 }}
              tickSize={10}
              tickFormatter={(value) =>
                value.length > 15 ? `${value.substring(0, 15)}...` : value
              }
            />
            <YAxis domain={[0, "auto"]} tick={{ fontSize: 22 }} tickSize={10} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalRevenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="pie">
        <p className="heading">Total Revenue Percentage per Category </p>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={revenuePieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {revenuePieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bar2">
        <p className="heading">Total Sales per Category </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={categoryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 22 }}
              tickSize={10}
              tickFormatter={(value) =>
                value.length > 15 ? `${value.substring(0, 15)}...` : value
              }
            />
            <YAxis domain={[0, "auto"]} tick={{ fontSize: 22 }} tickSize={10} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSales" fill="#82ca9d" barSize={220} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="pie">
        <p className="heading">Total Sales Percentage per Category </p>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={salesPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {salesPieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bar2">
        <p className="heading">Total Revenue per product </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={productData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 22 }}
              tickSize={10}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.substring(0, 10)}...` : value
              }
            />
            <YAxis domain={[0, "auto"]} tick={{ fontSize: 22 }} tickSize={10} />
            <Tooltip />
            <Legend wrapperStyle={{ paddingBlock: 7 }} />
            <Bar dataKey="totalRevenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bar2">
        <p className="heading">Total Sales per product </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={productData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 22 }}
              tickSize={10}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.substring(0, 10)}...` : value
              }
            />
            <YAxis domain={[0, "auto"]} tick={{ fontSize: 22 }} tickSize={10} />
            <Tooltip />
            <Legend wrapperStyle={{ paddingBlock: 7 }} />
            <Bar dataKey="totalSales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="box2">
        <div className="left">
          <div className="leftInfo">
            <p className="subheading">Categories with Highest Orders</p>
            <ul className="listhead">
              {stats.mostFrequentCategories.map((category, index) => (
                <li key={index} className="list">
                  {category.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
          <div className="leftInfo">
            <p className="subheading">Products with Highest Orders</p>
            <ul className="listhead">
              {stats.mostFrequentProducts.map((category, index) => (
                <li key={index} className="list">
                  {category.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right">
          <div className="rightInfo">
            <p className="subheading">Categories with Least Orders</p>
            <ul className="listhead">
              {stats.leastFrequentCategories.map((category, index) => (
                <li key={index} className="list">
                  {category.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
          <div className="rightInfo">
            <p className="subheading">Products with Least Orders</p>
            <ul className="listhead">
              {stats.leastFrequentProducts.map((category, index) => (
                <li key={index} className="list">
                  {category.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
