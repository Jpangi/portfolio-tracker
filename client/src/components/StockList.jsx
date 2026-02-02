import axios from "axios";
import { useEffect, useState } from "react";
import { BASEURL } from "../constants/constants";
import "./styling/stocklist.css";

const StockList = () => {
  const [stockList, setStockList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdate] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);


  useEffect(() => {
    getStockList();
  }, []);

  const getStockList = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(`${BASEURL}/api/stocks/allstocks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("get Stock list succeeded");
      setStockList(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //function to refresh prices from stock API
  const refreshPrices = async () => {
    if (stockList.length === 0) return;
    setRefreshing(true);
    setError(null);
    try {
      //fetch updated prices for each stock
      const updatedPromises = stockList.map(async (stock) => {
        try {
          //fetch current price from stock API endpoint
          const response = await axios.get(
            `${BASEURL}/api/stocks/${stock.symbol}`
          );

          //Extract the latest price from API response
          const timeSeries = response.data["Time Series (Daily)"];
          const latestDate = Object.keys(timeSeries)[0];
          const latestPrice = Number(timeSeries[latestDate]["4. close"]);

          //calculated differences
          const priceDifference = latestPrice - stock.price;
          const percentageChange = (
            (priceDifference / stock.price) *
            100
          ).toFixed(2);

          return {
            ...stock,
            price: latestPrice,
            oldPrice: stock.price,
            priceDifference,
            percentageChange,
            lastUpdated: new Date(),
          };
        } catch (err) {
          console.log(`Error fetching ${stock.symbol}:`, err);
          return stock;
        }
      });
      const updatedStocks = await Promise.all(updatedPromises);
      setStockList(updatedStocks);
      setLastUpdate(new Date());
    } catch (err) {
      setError("Failed to refresh Prices: " + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && stockList.length === 0) {
    return <p>Loading...</p>;
  }
  if (error != null) {
    return <p style={{ color: "red" }}>{error}</p>;
  }
  return (
    <>
      <div className="stock-list">
        <div>
          <h1 className="stock-list-card-header">Stocks</h1>
          <div className="stock-list-card-refresh">
            <button onClick={refreshPrices} disabled={refreshing || loading}>
              {refreshing ? "🔄 Updating Prices..." : "🔄 Refresh Prices"}
            </button>
            {lastUpdated && (
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        <section className="stock-list-card">
          {stockList.map((stock) => {
            const hasUpdate = stock.oldPrice && stock.price !== stock.oldPrice;
            const isPositive = hasUpdate && stock.priceDifference >= 0;

            return (
              <ul key={stock._id} className="stock-list-card-items">
                <div>
                  <p>{stock.symbol}</p>
                  {hasUpdate && (
                    <span>
                      {isPositive ? "▲" : "▼"} {isPositive ? "+" : ""}
                      {stock.percentageChange}%
                    </span>
                  )}
                </div>

                <p>
                  Current Value
                  <span className="stock-list-card-items-value">
                    ${" "}
                    {(stock.price * stock.shares)
                      .toFixed(0)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </p>

                <div className="stock-list-card-items-historical">
                  {hasUpdate && (
                    <>
                      <p>
                        Previous: $
                        {parseFloat(stock.oldPrice * stock.shares)
                          .toFixed(0)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </p>
                    </>
                  )}
                </div>
              </ul>
            );
          })}
        </section>
      </div>
    </>
  );
};

export default StockList;
