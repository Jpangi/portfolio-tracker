import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { BASEURL } from "../constants/constants";

const AddStockButton = ({
  stockData,
  loading,
  error,
  setError,
}) => {
  const [shares, setShares] = useState("");
  const [isAdding, setIsAdding] = useState(false); // New local loading state
const navigate = useNavigate();
  const handleAdd = async () => {
  console.log("=== handleAdd called ===");
  console.log("shares:", shares);
  console.log("stockData:", stockData);
  
  if (!shares) {
    console.log("No shares entered - returning early");
    setError("Please enter number of shares");
    return;
  }

  console.log("About to set isAdding to true");
  setIsAdding(true);
  setError(null);
  
  console.log("Entering try block");
  try {
    console.log("Getting time series data");
    const timeSeries = stockData["Time Series (Daily)"];
    const latestDate = Object.keys(timeSeries)[0];
    const latestClose = timeSeries[latestDate]["4. close"];

    const payload = {
      symbol: stockData["Meta Data"]["2. Symbol"],
      shares: Number(shares),
      price: Number(latestClose),
    };
    
    console.log("Sending payload:", payload);
    console.log("Making axios request...");

    const response = await axios.post(
      `${BASEURL}/api/stocks/portfolio`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Response:", response.data);
    console.log("Status:", response.status);
    
    setShares("");
    navigate("/dashboard")
  } catch (err) {
    console.error("!!! ERROR CAUGHT !!!");
    console.error("Full error:", err);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);
    setError(err.response?.data?.message || err.message);
  } finally {
    console.log("Finally block executing");
    setIsAdding(false);
  }
};

  return (
    <>
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
        <p>
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

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </>
  );
};

export default AddStockButton;
