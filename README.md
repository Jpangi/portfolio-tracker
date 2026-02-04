# Stock Portfolio Tracker

A full-stack web application that allows users to track their stock portfolio in real-time. Users can search for stocks, add them to their portfolio, and visualize their investments through interactive charts and dashboards.

**Link to project:** [Live Demo](https://portfolio-tracker-frontend-u26r.onrender.com/)


## How It's Made:

**Tech used:** React, Node.js, Express, MongoDB, Chart.js, Recharts, Alpha Vantage API

### Frontend
The frontend is built with React  and uses modern hooks like `useState` and `useEffect` for state management. The UI is styled with custom CSS, creating a clean and professional dashboard experience. React Router handles navigation between pages including login, signup, stock search, and the main dashboard.

For data visualization, I integrated both Chart.js and Recharts libraries to display portfolio performance over time and asset allocation. The line chart shows historical portfolio value, while the pie chart breaks down the distribution of holdings by stock symbol.

### Backend
The backend is powered by Express.js (v5) running on Node.js. I implemented JWT-based authentication to secure user sessions and protect API routes. Passwords are hashed using bcrypt before storing in the database.

The stock data is fetched from the Alpha Vantage API, which provides real-time and historical stock market data. When a user searches for a stock, the backend makes a request to Alpha Vantage and returns the time series data to the frontend.

### Database
MongoDB stores user accounts and portfolio data. The Portfolio schema uses a compound index on `user` and `symbol` to ensure users can't add duplicate stocks. Mongoose provides the ODM layer for easy database operations and schema validation.

### Key Features
- **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- **Stock Search**: Real-time stock data lookup using Alpha Vantage API
- **Portfolio Management**: Add stocks with custom share quantities
- **Price Refresh**: Update all stock prices with a single click
- **Data Visualization**: 
  - Line chart showing portfolio value over time
  - Pie chart displaying asset allocation
- **Responsive Design**: Clean, modern UI that works across devices

## Optimizations

### Performance Improvements
- Implemented compound indexing in MongoDB on `user` and `symbol` fields to speed up portfolio queries and prevent duplicate entries
- Used debouncing on the stock search to reduce unnecessary API calls to Alpha Vantage
- Cached stock data on the backend to minimize external API requests and stay within rate limits
- Optimized chart rendering by only re-rendering when data actually changes

### Code Quality
- Refactored authentication middleware to be reusable across all protected routes
- Separated concerns by creating dedicated controllers for user and stock operations
- Implemented error handling middleware to catch and properly format errors
- Used environment variables for all sensitive configuration (API keys, database URIs, JWT secrets)

### Future Optimizations
- Add Redis caching layer for frequently accessed stock data
- Implement pagination for portfolios with many stocks
- Switch to WebSockets for real-time price updates
- Add service workers for offline functionality

## Lessons Learned:

### Technical Challenges
Building this project taught me the importance of proper API rate limiting and caching strategies. The Alpha Vantage API has strict rate limits, so I had to implement smart caching on the backend to store recent stock queries. This reduced redundant API calls and improved response times.

I also learned about the complexity of handling JWT tokens securely. Initially, I stored tokens in localStorage, but researching security best practices made me reconsider this approach for future iterations.

### Data Visualization
Working with Chart.js and Recharts gave me valuable experience in presenting financial data clearly. I learned how to aggregate portfolio values across different dates and handle missing data points gracefully. The challenge of syncing historical data from multiple stocks into a single timeline chart was particularly enlightening.

### Database Design
Designing the MongoDB schemas taught me about indexing strategies and data relationships. The compound index on user and symbol was crucial for both performance and data integrity. I also learned when to embed versus reference data - in this case, I chose to store price and share data directly in the portfolio document for faster queries.

### Deployment
Deploying a full-stack application with separate frontend and backend repositories on Render was a learning experience. Managing CORS, environment variables across environments, and ensuring the MongoDB connection string worked in production all required careful attention to detail.

## Installation & Setup

### Prerequisites
- Node.js (v20+)
- MongoDB (local or MongoDB Atlas)
- Alpha Vantage API key (free at https://www.alphavantage.co)

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
API_KEY=your_alpha_vantage_api_key
PORT=3000
```

Start the server:
```bash
npm start
```

### Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the client directory:
```
VITE_SERVER_URL=http://localhost:3000
VITE_ALPHA_KEY=your_alpha_vantage_api_key
```

Start the development server:
```bash
npm run dev
```

## API Endpoints

### User Routes
- `POST /users/signup` - Register new user
- `POST /users/signin` - Login existing user

### Stock Routes (Protected)
- `GET /api/stocks/:symbol` - Search for stock by symbol
- `POST /api/stocks/portfolio` - Add stock to portfolio
- `GET /api/stocks/allstocks` - Get user's portfolio


## Future Enhancements

- Add ability to edit/remove stocks from portfolio
- Implement stock transaction history
- Add news feed for tracked stocks
- Create custom alerts for price changes
- Support for multiple portfolios per user
- Dark mode toggle
- Export portfolio data to CSV

## License

MIT License - feel free to use this project for learning purposes!