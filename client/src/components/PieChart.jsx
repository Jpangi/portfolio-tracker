import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BASEURL } from "../constants/constants";
import './styling/pieChart.css'

const StockPieChart = () => {
  const [stocks, setStocks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASEURL}/api/stocks/allStocks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        console.log("Portfolio data:", response.data);
        setStocks(response.data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>Error loading chart: {error}</p>;
  if (stocks.length === 0) return <p>No stocks in portfolio</p>;

  // Use the price already stored in the database
  const data = stocks.map(stock => ({
    name: stock.symbol,
    value: parseFloat((stock.price * stock.shares).toFixed(2)),
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="pie-chart-card" style={{ width: '100%', height: 400 }}>
      <h2>Portfolio Distribution</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockPieChart;