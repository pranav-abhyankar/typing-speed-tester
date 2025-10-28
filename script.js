import React, { useState, useEffect, useRef } from 'react';
import { Clock, RotateCcw, Trophy, TrendingUp, Settings, Zap } from 'lucide-react';

const SAMPLE_TEXTS = {
  easy: [
    "The quick brown fox jumps over the lazy dog near the peaceful river.",
    "A gentle breeze flows through the tall trees in the quiet forest.",
    "Children play happily in the park under the bright summer sun.",
  ],
  medium: [
    "Technology has revolutionized the way we communicate and interact with each other in modern society.",
    "The intricate patterns of nature reveal themselves to those who take time to observe carefully.",
    "Success is not final, failure is not fatal, it is the courage to continue that counts.",
  ],
  hard: [
    "Pseudopseudohypoparathyroidism exemplifies the complexity of medical terminology in endocrinology.",
    "The juxtaposition of anachronistic elements creates a paradoxical narrative framework.",
    "Entrepreneurial endeavors require meticulous planning, unwavering dedication, and strategic execution.",
  ]
};

export default function TypingSpeedTester() {
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(60);
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    generateNewText();
  }, [difficulty]);

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, timeLeft]);

  const generateNewText = () => {
    const texts = SAMPLE_TEXTS[difficulty];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    setText(randomText);
  };

  const startTest = () => {
    setIsStarted(true);
    setIsFinished(false);
    setInput('');
    setTimeLeft(duration);
    setErrors(0);
    setTotalTyped(0);
    generateNewText();
    inputRef.current?.focus();
  };

  const finishTest = () => {
    setIsStarted(false);
    setIsFinished(true);
    clearInterval(timerRef.current);
    
    const timeElapsed = (duration - timeLeft) / 60;
    const wordsTyped = input.trim().split(/\s+/).length;
    const calculatedWpm = Math.round(wordsTyped / timeElapsed) || 0;
    const calculatedAccuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    
    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    
    const result = {
      wpm: calculatedWpm,
      accuracy: calculatedAccuracy,
      difficulty,
      date: new Date().toLocaleString(),
      duration
    };
    setHistory(prev => [result, ...prev].slice(0, 5));
  };

  const handleInputChange = (e) => {
    if (!isStarted) return;
    
    const value = e.target.value;
    setInput(value);
    setTotalTyped(value.length);
    
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    
    const currentAccuracy = value.length > 0 ? Math.round(((value.length - errorCount) / value.length) * 100) : 100;
    setAccuracy(currentAccuracy);
    
    const timeElapsed = (duration - timeLeft) / 60;
    if (timeElapsed > 0) {
      const wordsTyped = value.trim().split(/\s+/).length;
      setWpm(Math.round(wordsTyped / timeElapsed));
    }
  };

  const resetTest = () => {
    setIsStarted(false);
    setIsFinished(false);
    setInput('');
    setTimeLeft(duration);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTotalTyped(0);
    generateNewText();
  };

  const getCharClass = (index) => {
    if (index >= input.length) return 'text-gray-400';
    if (input[index] === text[index]) return 'text-green-500 bg-green-50';
    return 'text-red-500 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Typing Speed Tester</h1>
          </div>
          <p className="text-gray-600">Test and improve your typing skills</p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-gray-700 font-semibold mb-4"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
          
          {showSettings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={isStarted}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Duration (seconds)
                </label>
                <select
                  value={duration}
                  onChange={(e) => {
                    setDuration(Number(e.target.value));
                    setTimeLeft(Number(e.target.value));
                  }}
                  disabled={isStarted}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="120">120 seconds</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{timeLeft}s</div>
            <div className="text-sm text-gray-600">Time Left</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{wpm}</div>
            <div className="text-sm text-gray-600">WPM</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <span className="text-2xl mb-2 block">❌</span>
            <div className="text-2xl font-bold text-gray-800">{errors}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
        </div>

        {/* Text Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-xl leading-relaxed font-mono mb-6 p-4 bg-gray-50 rounded-lg min-h-32">
            {text.split('').map((char, index) => (
              <span key={index} className={getCharClass(index)}>
                {char}
              </span>
            ))}
          </div>
          
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            disabled={!isStarted || isFinished}
            placeholder={isStarted ? "Start typing..." : "Click 'Start Test' to begin"}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono resize-none"
            rows="4"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {!isStarted ? (
            <button
              onClick={startTest}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Start Test
            </button>
          ) : (
            <button
              onClick={finishTest}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              End Test
            </button>
          )}
          
          <button
            onClick={resetTest}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Results & History */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Recent Results
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 text-gray-600">Date</th>
                    <th className="text-left p-3 text-gray-600">WPM</th>
                    <th className="text-left p-3 text-gray-600">Accuracy</th>
                    <th className="text-left p-3 text-gray-600">Difficulty</th>
                    <th className="text-left p-3 text-gray-600">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((result, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{result.date}</td>
                      <td className="p-3 text-gray-700 font-semibold">{result.wpm}</td>
                      <td className="p-3 text-gray-700">{result.accuracy}%</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          result.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          result.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.difficulty}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">{result.duration}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<TypingSpeedTester />);