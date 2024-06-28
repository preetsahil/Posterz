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
} from "recharts";
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
  const getStats = async () => {
    // mostfrequentlyorderedproduct
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
    console.log(formattedCategoryData);
    setCategoryData(formattedCategoryData);

    const formattedProductData = Object.keys(stats.productStats).map((key) => ({
      name: key,
      totalSales: stats.productStats[key].totalQuantity,
      totalRevenue: stats.productStats[key].totalRevenue,
    }));
    setProductData(formattedProductData);
  }, [stats]);

  return (
    <div className="Statistics">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={categoryData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, "auto"]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalRevenue" fill="#82ca9d" barSize={220} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={categoryData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, "auto"]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSales" fill="#8884d8" barSize={220}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Statistics;
