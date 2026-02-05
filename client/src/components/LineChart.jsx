import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./styling/lineChart.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { BASEURL } from "../constants/constants";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const ALPHAVANTAGE_KEY = import.meta.env.VITE_ALPHA_KEY;
const PortfolioLineChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    buildRealPortfolioHistory();
  }, []);

  const buildRealPortfolioHistory = async () => {
    try {
      // 1️⃣ Get portfolio from backend
      const res = await axios.get(`${BASEURL}/api/stocks/allstocks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const stocks = res.data;

      const dailyTotals = {};

      // 2️⃣ Fetch historical data for each stock from AlphaVantage with delays
      for (let i = 0; i < stocks.length; i++) {
        const stock = stocks[i];

        try {
          const avRes = await axios.get("https://www.alphavantage.co/query", {
            params: {
              function: "TIME_SERIES_DAILY",
              symbol: stock.symbol,
              apikey: ALPHAVANTAGE_KEY,
            },
          });

          const timeSeries = avRes.data?.["Time Series (Daily)"];
          if (!timeSeries || typeof timeSeries !== "object") {
            // Wait before next call even on error
            if (i < stocks.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 9000));
            }
            continue;
          }

          Object.keys(timeSeries).forEach((date) => {
            const close = Number(timeSeries[date]["4. close"]) || 0;
            if (!dailyTotals[date]) dailyTotals[date] = 0;
            dailyTotals[date] += close * stock.shares;
          });

          // Wait 12 seconds between successful calls (rate limit is 5/min = 12 sec apart)
          if (i < stocks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 9000));
          }
        } catch (err) {
          console.error("AlphaVantage fetch failed for", stock.symbol, err);

          // Wait before next call even on error
          if (i < stocks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 9000));
          }
        }
      }

      const timeline = Object.keys(dailyTotals)
        .sort()
        .map((date) => ({ date, value: dailyTotals[date] }));

      const data = {
        labels: timeline.map((d) => d.date),
        datasets: [
          {
            label: "Portfolio Value",
            data: timeline.map((d) => d.value),
            tension: 0.4,
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            borderColor: "#4CAF50",
            spanGaps: true,
          },
        ],
      };

      setChartData(data);
    } catch (err) {
      console.error("Portfolio chart error:", err);
    }
  };

  if (!chartData) return <p className="chart-loading">Loading chart...</p>;

  return (
    <div className="portfolio-chart-container">
      <h2 className="portfolio-chart-title">Portfolio Value Over Time</h2>
      <Line
        className="portfolio-line-chart"
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: { ticks: { maxTicksLimit: 6 } },
            y: { beginAtZero: false },
          },
        }}
      />
    </div>
  );
};

export default PortfolioLineChart;
