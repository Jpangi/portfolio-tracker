import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import './styling/lineChart.css'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
// import axios from "axios"; // uncomment for real data
// import { BASEURL } from "../constants/constants"; // your backend URL

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// const ALPHAVANTAGE_KEY = import.meta.env.VITE_ALPHA_KEY; // uncomment for real AlphaVantage

const PortfolioLineChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    buildFakePortfolioHistory();
    // buildRealPortfolioHistory(); // uncomment to fetch real data
  }, []);

  const buildFakePortfolioHistory = () => {
    const stocks = [
      { symbol: "AAPL", shares: 5 },
      { symbol: "TSLA", shares: 2 },
      { symbol: "MSFT", shares: 3 }
    ];

    const fakeTimeSeries = {
      "2026-01-25": { AAPL: 185, TSLA: 710, MSFT: 305 },
      "2026-01-26": { AAPL: 187, TSLA: 715, MSFT: 308 },
      "2026-01-27": { AAPL: 190, TSLA: 720, MSFT: 310 },
      "2026-01-28": { AAPL: 188, TSLA: 725, MSFT: 312 },
      "2026-01-29": { AAPL: 189, TSLA: 726, MSFT: 311 },
      "2026-01-30": { AAPL: 191, TSLA: 730, MSFT: 313 }
    };

    const dailyTotals = {};
    Object.keys(fakeTimeSeries).forEach(date => {
      let total = 0;
      stocks.forEach(stock => {
        const price = fakeTimeSeries[date][stock.symbol] || 0;
        total += price * stock.shares;
      });
      dailyTotals[date] = total;
    });

    const timeline = Object.keys(dailyTotals)
      .sort()
      .map(date => ({ date, value: dailyTotals[date] }));

    const data = {
      labels: timeline.map(d => d.date),
      datasets: [
        {
          label: "Portfolio Value",
          data: timeline.map(d => d.value),
          tension: 0.4,
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
          borderColor: "#4CAF50",
          spanGaps: true
        }
      ]
    };

    setChartData(data);
  };

  // --------------------------------------------------
  // Uncomment this function when AlphaVantage & backend are ready
  // --------------------------------------------------
  /*
  const buildRealPortfolioHistory = async () => {
    try {
      // 1️⃣ Get portfolio from backend
      const res = await axios.get(`${BASEURL}/api/stocks/allstocks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const stocks = res.data; // [{symbol, shares, price}, ...]

      const dailyTotals = {};

      // 2️⃣ Fetch historical data for each stock from AlphaVantage
      for (let stock of stocks) {
        try {
          const avRes = await axios.get("https://www.alphavantage.co/query", {
            params: {
              function: "TIME_SERIES_DAILY",
              symbol: stock.symbol,
              apikey: ALPHAVANTAGE_KEY,
            },
          });

          const timeSeries = avRes.data?.["Time Series (Daily)"];
          if (!timeSeries || typeof timeSeries !== "object") continue;

          Object.keys(timeSeries).forEach(date => {
            const close = Number(timeSeries[date]["4. close"]) || 0;
            if (!dailyTotals[date]) dailyTotals[date] = 0;
            dailyTotals[date] += close * stock.shares;
          });
        } catch (err) {
          console.warn("AlphaVantage fetch failed for", stock.symbol, err);
        }
      }

      const timeline = Object.keys(dailyTotals)
        .sort()
        .map(date => ({ date, value: dailyTotals[date] }));

      const data = {
        labels: timeline.map(d => d.date),
        datasets: [
          {
            label: "Portfolio Value",
            data: timeline.map(d => d.value),
            tension: 0.4,
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            borderColor: "#4CAF50",
            spanGaps: true
          }
        ]
      };

      setChartData(data);
    } catch (err) {
      console.error("Portfolio chart error:", err);
    }
  };
  */

  if (!chartData) return <p className="chart-loading">Loading chart...</p>;

  return (
    <div className="portfolio-chart-container">
      <h2 className="portfolio-chart-title">Portfolio Value Over Time</h2>
      <Line className="portfolio-line-chart" data={chartData} options={{
        responsive: true,
        plugins: { legend: { display: true }, tooltip: { mode: "index", intersect: false } },
        scales: {
          x: { ticks: { maxTicksLimit: 6 } },
          y: { beginAtZero: false }
        }
      }} />
    </div>
  );
};

export default PortfolioLineChart;
