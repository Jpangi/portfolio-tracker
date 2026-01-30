import axios from "axios"
import { useEffect, useState } from "react"
import { BASEURL } from "../constants/constants"
import './styling/stocklist.css'

const StockList = () =>{
const [stockList, setStockList] = useState([])
const [error, setError] = useState(null)
const [loading, setLoading] = useState(false)

useEffect(() => {
    getStockList();
  }, []);

  const getStockList = async () => {
    setError(null)
    setLoading(true)
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
    }finally{
        setLoading(false)
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error != null) {
    return <p>{error}</p>;
  }
    return(

        <>
        <div className="stock-list">
        <h1 className="stock-list-card-header">Stocks</h1>
        <section className="stock-list-card">
          {stockList.map((stocks) => {
            return (
              <ul key={stocks._id} className="stock-list-card-items">
                <p>{stocks.symbol}</p>
                <p>Current Value<span className="stock-list-card-items-value">$ {(stocks.price * stocks.shares).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
              </ul>
            );
          })}
        </section>
        </div>
        </>
    )
}

export default StockList