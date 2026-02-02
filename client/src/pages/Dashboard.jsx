import StockList from "../components/StockList";
import StockPieChart from "../components/PieChart";
import { useState } from "react";
import PortfolioLineChart from "../components/LineChart";
import "../components/styling/dashboard.css";
import Navbar from "../common/NavBar";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="dashboard-container">
        <div className="dashboard-stocklist">
          {" "}
          <StockList />
        </div>

        <div className="dashboard-container-items">
          <StockPieChart stocks={stocks} />
          <PortfolioLineChart />
        </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
