import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { BASEURL } from "../constants/constants";
import '../components/styling/addStockButton.css'

const AddStockButton = ({ stockData, loading, error, setError }) => {
  const [shares, setShares] = useState("");
  const [isAdding, setIsAdding] = useState(false); // New local loading state
  const navigate = useNavigate();
  const handleAdd = async () => {
    if (!shares) {
      setError("Please enter number of shares");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      const timeSeries = stockData["Time Series (Daily)"];
      const latestDate = Object.keys(timeSeries)[0];
      const latestClose = timeSeries[latestDate]["4. close"];

      const payload = {
        symbol: stockData["Meta Data"]["2. Symbol"],
        shares: Number(shares),
        price: Number(latestClose),
      };

      const response = await axios.post(
        `${BASEURL}/api/stocks/portfolio`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShares("");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
    <div className="add-stock-wrapper">
  <div className="add-stock-form">
    <label>
      Shares
      <input
        type="number"
        step="0.0001"
        min="0"
        value={shares}
        onChange={(e) => setShares(e.target.value)}
        disabled={!stockData}
      />
    </label>

    {shares && stockData && (
      <p className="total-value">
        Total Value: $
        {(
          shares *
          Number(
            stockData["Time Series (Daily)"][
              Object.keys(stockData["Time Series (Daily)"])[0]
            ]["4. close"]
          )
        ).toFixed(2)}
      </p>
    )}

    <button onClick={handleAdd} disabled={!stockData || isAdding}>
      {isAdding ? "Adding..." : "Add to Portfolio"}
    </button>

    {loading && <p className="loading-text">Loading...</p>}
    {error && <p className="error-text">{error}</p>}
  </div>
</div>

    </>
  );
};

export default AddStockButton;
