// my-react-extension/src/components/Timer/Timer.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Timer.css'; // Create this CSS file

function Timer() {
  const [time, setTime] = useState(0); // Time in seconds
  const [inputMinutes, setInputMinutes] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null); // To store the interval ID

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      // Optional: Play a subtle sound or trigger a browser notification
      // (Requires 'notifications' permission in manifest.json and handling in background.js)
    }
    return () => clearInterval(timerRef.current); // Cleanup on unmount or re-render
  }, [isRunning, time]);

  const handleStart = () => {
    if (time === 0 && inputMinutes > 0) {
      const minutes = parseInt(inputMinutes);
      if (isNaN(minutes) || minutes <= 0) {
        alert("Please enter a valid positive number of minutes.");
        return;
      }
      setTime(minutes * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(0);
    setInputMinutes('');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container tab-content">
      <h2>Timer</h2>
      <div className="timer-display">{formatTime(time)}</div>
      <div className="timer-controls">
        <input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          placeholder="Min"
          min="0"
        />
        <button onClick={handleStart} disabled={isRunning || (time === 0 && inputMinutes === '')}>
          {time > 0 && !isRunning ? 'Resume' : 'Start'}
        </button>
        <button onClick={handlePause} disabled={!isRunning}>Pause</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default Timer;