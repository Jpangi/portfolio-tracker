import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASEURL } from "../constants/constants";

const SearchStock = ({ search, setSearch, stockData, setStockData, loading, setLoading, error, setError }) => {

const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASEURL}/api/stocks/${search}`);
      setStockData(res.data);
      console.log(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const input = e.target.value.toUpperCase();
    setSearch(input);
  };


  if (loading) {
    return <p>Loading...</p>;
  }
  if (error != null) {
    return <p>{error}</p>;
  }
 return (
    <>
      <form className="search-form" onSubmit={handleSearch}>
        <label htmlFor="search">Search: </label>
        <input
          value={search}
          onChange={handleChange}
          placeholder="Enter Stock Symbol"
        />
        <button type="submit">Search</button>
      </form>

      {stockData && (
        <section>
          <h2>Stock: {stockData["Meta Data"]["2. Symbol"]}</h2>
          <p>Last Refreshed: {stockData["Meta Data"]["3. Last Refreshed"]}</p>

          <h3>Recent Prices:</h3>
          <ul>
            {Object.keys(stockData["Time Series (Daily)"]) // ← Step 1: Get array of dates
              .slice(0, 5) // ← Step 2: Take first 5
              .map((date) => {
                // ← Step 3: Loop through each
                const dayData = stockData["Time Series (Daily)"][date];
                return (
                  <li key={date}>
                    <strong>{date}:</strong> Close ${dayData["4. close"]}
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </>
  );
};


export default SearchStock;