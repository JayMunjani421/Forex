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
        </div>

        {/* Calculator Widget */}
        <Calculator />
      </div>
    </main>
  );
}

export default App;
