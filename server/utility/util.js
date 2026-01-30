function normalizeDailyStock(data) {
  const timeSeries = data["Time Series (Daily)"];
  const latestDate = Object.keys(timeSeries)[0];
  const latest = timeSeries[latestDate];

  return {
    symbol: data["Meta Data"]["2. Symbol"],
    date: latestDate,
    open: Number(latest["1. open"]),
    high: Number(latest["2. high"]),
    low: Number(latest["3. low"]),
    close: Number(latest["4. close"]),
    volume: Number(latest["5. volume"]),
  };
}

module.exports = normalizeDailyStock;
