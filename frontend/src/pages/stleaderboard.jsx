import React, { useState, useRef, useEffect } from 'react';
import "../assets/css/stleaderboard.css"; // Custom styles

const quotes = [
  "Typing is a skill that improves with practice.",
  "Speed and accuracy are both important.",
  "JavaScript makes websites interactive and dynamic.",
  "Consistent practice is the key to fast typing.",
  "Focus while typing for better accuracy and speed."
];

const fetchQuote = async () => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    setCurrentQuote(data.content); // set the quote into your state
  } catch (error) {
    console.error('Failed to fetch quote:', error);
    setCurrentQuote("Keep pushing forward, no matter what!"); // fallback
  }
};


const levels = [
  { label: 'Beginner', time: 30 },
  { label: 'Intermediate', time: 60 },
  { label: 'Expert', time: 90 },
];

const getBadge = (wpm, accuracy) => {
  if (wpm >= 100 && accuracy >= 95) return "🏅 Typing Master";
  if (wpm >= 80) return "🥈 Speedster";
  if (accuracy >= 90) return "🎯 Accuracy Pro";
  return "📖 Keep Practicing";
};

const TypingTest = () => {
  const [username, setUsername] = useState('');
  const [currentQuote, setCurrentQuote] = useState('');
  const [typedText, setTypedText] = useState('');
  const [level, setLevel] = useState(levels[0]);
  const [timeLeft, setTimeLeft] = useState(levels[0].time);
  const [testActive, setTestActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [badge, setBadge] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [lastResult, setLastResult] = useState(null);

  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  // Insert submitScore function here
  const submitScore = async (scoreData) => {
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData),
      });
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

// fetchQuote function here
  const fetchQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setCurrentQuote(data.content);
    } catch (error) {
      setCurrentQuote("Keep pushing forward, no matter what!");
    }
  };
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('leaderboard');
    if (savedLeaderboard) {
      const savedData = JSON.parse(savedLeaderboard);
      if (savedData.length > 0) {
      // set only the last saved entry or entire array with one element
      setLeaderboard([savedData[savedData.length - 1]]);
      setLeaderboard(savedData);
      fetchQuote();
    }
  }
}, []);

  const startTest = () => {
    if (!username.trim()) return alert("Please enter your name!");

    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(quote);
    setTypedText('');
    setTimeLeft(level.time);
    setTimeElapsed(0);
    setWpm(0);
    setAccuracy(0);
    setBadge('');
    setTestActive(true);
    setStartTime(Date.now());

    inputRef.current.disabled = false;
    inputRef.current.focus();

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setTimeElapsed(elapsed);
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          endTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTest = () => {
    clearInterval(intervalRef.current);
    inputRef.current.disabled = true;
    setTestActive(false);
    endTest();
    setCurrentQuote('Test Stopped!');
  };

  const endTest = () => {
  inputRef.current.disabled = true;
  setTestActive(false);
  console.log("endTest called");


  const wordsTyped = typedText.trim().split(/\s+/).length;
  const correctChars = typedText.split('').filter((ch, i) => ch === currentQuote[i]).length;
  const totalChars = currentQuote.length;

  const minutes = timeElapsed > 0 ? timeElapsed / 60 : level.time / 60;
  const finalWpm = Math.round(wordsTyped / minutes);
  const finalAccuracy = Math.round((correctChars / totalChars) * 100);

  const newResult = {
    name: username,
    wpm: isNaN(finalWpm) ? 0 : finalWpm,
    accuracy: isNaN(finalAccuracy) ? 0 : finalAccuracy
  };

  // Get existing leaderboard
  const existing = JSON.parse(localStorage.getItem('leaderboard')) || [];

  // Add new result, sort, and save
  const updated = [...existing, newResult]
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, 10); // top 10 only

  localStorage.setItem('leaderboard', JSON.stringify(updated));
  setLeaderboard(updated); // Update leaderboard in UI

  // Update last result
  const result = {
    ...newResult,
    badge: getBadge(newResult.wpm, newResult.accuracy),
  };
  setLastResult(result);
  setWpm(newResult.wpm);
  setAccuracy(newResult.accuracy);
  setBadge(result.badge);
};


  const checkInput = (text) => {
    setTypedText(text);

    const correct = text.split('').filter((ch, i) => ch === currentQuote[i]).length;
    const words = text.trim().split(/\s+/).length;
    const minutes = (Date.now() - startTime) / 60000;

    const currentWpm = Math.round(words / minutes);
    const currentAccuracy = Math.round((correct / currentQuote.length) * 100);

    setWpm(isNaN(currentWpm) ? 0 : currentWpm);
    setAccuracy(isNaN(currentAccuracy) ? 0 : currentAccuracy);

    if (text === currentQuote) {
      clearInterval(intervalRef.current);
      endTest();
    }
  };

  return (
    <div className="typing-test-container">
      <h1>⌨️ Typing Speed Test</h1>

      <input
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={testActive}
      />

      <div className="level-select">
        <label>Select Level:</label>
        <select disabled={testActive} onChange={(e) => {
          const lvl = levels.find(l => l.label === e.target.value);
          setLevel(lvl);
          setTimeLeft(lvl.time);
        }}>
          {levels.map(lvl => (
            <option key={lvl.label} value={lvl.label}>
              {lvl.label} ({lvl.time}s)
            </option>
          ))}
        </select>
      </div>

      <div className="quote-box">
        <p><strong>Quote:</strong> {currentQuote || "Click Start to begin..."}</p>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(typedText.length / currentQuote.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <textarea
        ref={inputRef}
        rows="4"
        value={typedText}
        onChange={(e) => checkInput(e.target.value)}
        placeholder="Start typing here..."
        disabled
      />

      <div className="stats">
        <p><strong>⏱ Time Left:</strong> {timeLeft}s</p>
        <p><strong>⌛ Time Elapsed:</strong> {timeElapsed}s</p>
        <p><strong>WPM:</strong> {wpm}</p>
        <p><strong>Accuracy:</strong> {accuracy}%</p>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={startTest} disabled={testActive}>Start Test</button>
        <button onClick={stopTest} disabled={!testActive} style={{ marginLeft: '10px' }}>Stop Test</button>
      </div>

      {!testActive && wpm > 0 && (
        <div className="result">
          <h3>🎉 Test Complete!</h3>
          <p><strong>Badge:</strong> {badge}</p>
        </div>
      )}

      <h2 style={{ marginTop: '30px' }}>🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>WPM</th>
            <th>Accuracy (%)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, idx) => (
            <tr key={idx}>
               <td>{idx + 1}</td>
              <td>{entry.name}</td>
              <td>{entry.wpm}</td>
              <td>{entry.accuracy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TypingTest;
