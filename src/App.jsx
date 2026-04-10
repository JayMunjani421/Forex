import Calculator from './components/Calculator';

function App() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12 lg:py-24">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        
        {/* Header Text mapping the Octa styles slightly */}
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Order details for the Octa Forex profit calculator
          </h1>
          <p className="text-gray-600 text-lg">
            The Octa Forex profit calculator is a risk management tool to improve your trading of currency pairs and other assets. Calculate potential profits and losses of your orders and trade financial markets more confidently.
          </p>
          <p className="text-gray-600 text-sm py-2">
            Ready to put your calculations to the test? Practice risk-free with simulated funds or start trading with real money.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
              Trade in a real account
            </button>
            <button className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium px-6 py-2.5 rounded-lg transition-colors">
              Try on a demo account
            </button>
          </div>
        </div>

        {/* Calculator Widget */}
        <Calculator />
      </div>
    </main>
  );
}

export default App;
