const Portfolio = require("../models/Stock");
const axios = require("axios");

//portfolio (all stocks from a user)
const allStocks = async (req, res) => {
  try {
    const userStocks = await Portfolio.find({ user: req.user._id });
    res.status(200).json(userStocks);
  } catch (error) {
    res.status(400).json({ message: "Can't get user Portfolio", error });
  }
};
//add stock from api
const addStock = async (req, res) => {
  const { symbol, price, shares } = req.body;
  // Validate input
  if (!symbol) {
    return res.status(400).json({ message: "Symbol is required" });
  }
  try {
    const portfolio = await Portfolio.create({
      symbol: symbol.toUpperCase(),
      price: Number(price),
      shares: Number(shares),
      user: req.user._id,
    });
    res.status(201).json({ message: "stock has been added", portfolio });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Stock already in your portfolio",
      });
      console.error(error);
      res.status(500).json({
        message: "Error adding to portfolio",
        error: error.message,
      });
    }
  }
};
//single stock

//delete stock from your portfolio

//refresh your stocks price with api

const stockSearch = async (req, res) => {
  const { symbol } = req.params;
  const api_url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.API_KEY}`;

  try {
    const response = await axios.get(api_url);
    const data = response.data;

    if (!data)
      return res
        .status(404)
        .json({ message: "Alpha Vantage could not find stock" });
    res.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { stockSearch, addStock, allStocks };
