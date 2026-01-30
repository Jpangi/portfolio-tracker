const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const {
  stockSearch,
  addStock,
  allStocks,
} = require("../controllers/stockController");

router.get("/stocks/allstocks", authenticate, allStocks);
router.get("/stocks/:symbol", stockSearch);
router.post("/stocks/portfolio", authenticate, addStock);

module.exports = router;
