
import { useState } from "react";
import SearchStock from "../components/Search";
import AddStockButton from "../components/AddButton";
import '../components/styling/addStockButton.css'

const Search = ({ user }) => {
  // Lifted state - now shared between SearchStock and AddStockButton
  const [search, setSearch] = useState("");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="search-page">
      <div className="search-container">
        <SearchStock
          search={search}
          setSearch={setSearch}
          stockData={stockData}
          setStockData={setStockData}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
        />

        <AddStockButton
          user={user}
          stockData={stockData}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
        />
      </div>
    </div>

  );
};

export default Search;