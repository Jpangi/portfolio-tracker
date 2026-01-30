
import StockList from "../components/StockList";
import StockPieChart from "../components/PieChart";
import { useState } from "react";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);


  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>
      
        <div className="dashboard-container">
          <StockList />
          <StockPieChart stocks={stocks} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
