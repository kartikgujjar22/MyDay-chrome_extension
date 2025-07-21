// my-react-extension/src/components/Timer/Timer.jsx
import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

function Timer() {
  const [time, setTime] = useState(0); // Time in seconds
  const [inputHours, setInputHours] = useState('');
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      // Timer finished - you can add notification here
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, time]);

  const handleStart = () => {
    if (time === 0) {
      const hours = parseInt(inputHours) || 0;
      const minutes = parseInt(inputMinutes) || 0;
      const seconds = parseInt(inputSeconds) || 0;
      
      if (hours < 0 || minutes < 0 || seconds < 0 || minutes >= 60 || seconds >= 60) {
        alert("Please enter valid time values (minutes and seconds should be less than 60).");
        return;
      }
      
      const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
      if (totalSeconds <= 0) {
        alert("Please enter a valid time greater than 0.");
        return;
      }
      
      setTime(totalSeconds);
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
    setInputHours('');
    setInputMinutes('');
    setInputSeconds('');
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerStatus = () => {
    if (time === 0 && !isRunning) return 'idle';
    if (isRunning) return 'running';
    return 'paused';
  };

  const hasValidInput = () => {
    const hours = parseInt(inputHours) || 0;
    const minutes = parseInt(inputMinutes) || 0;
    const seconds = parseInt(inputSeconds) || 0;
    return hours > 0 || minutes > 0 || seconds > 0;
  };

  return (
    <div className="timer-container tab-content">
      <div className="timer-header">
        <h2>Timer</h2>
        <div className={`timer-status ${getTimerStatus()}`}>
          {getTimerStatus() === 'running' && <div className="pulse-dot"></div>}
          {getTimerStatus().charAt(0).toUpperCase() + getTimerStatus().slice(1)}
        </div>
      </div>
      
      <div className={`timer-display ${getTimerStatus()}`}>
        <div className="time-text">{formatTime(time)}</div>
        {time > 0 && (
          <div className="progress-ring">
            <svg className="progress-ring-svg" width="120" height="120">
              <circle
                className="progress-ring-circle-bg"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                r="54"
                cx="60"
                cy="60"
              />
              <circle
                className="progress-ring-circle"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                r="54"
                cx="60"
                cy="60"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="timer-inputs">
        <div className="input-group">
          <label>Hours</label>
          <input
            type="number"
            value={inputHours}
            onChange={(e) => setInputHours(e.target.value)}
            placeholder="00"
            min="0"
            max="23"
            disabled={isRunning || time > 0}
          />
        </div>
        <div className="input-separator">:</div>
        <div className="input-group">
          <label>Minutes</label>
          <input
            type="number"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            placeholder="00"
            min="0"
            max="59"
            disabled={isRunning || time > 0}
          />
        </div>
        <div className="input-separator">:</div>
        <div className="input-group">
          <label>Seconds</label>
          <input
            type="number"
            value={inputSeconds}
            onChange={(e) => setInputSeconds(e.target.value)}
            placeholder="00"
            min="0"
            max="59"
            disabled={isRunning || time > 0}
          />
        </div>
      </div>

      <div className="timer-controls">
        <button 
          className="btn-primary"
          onClick={handleStart} 
          disabled={isRunning || (time === 0 && !hasValidInput())}
        >
          {time > 0 && !isRunning ? 'Resume' : 'Start'}
        </button>
        <button 
          className="btn-secondary"
          onClick={handlePause} 
          disabled={!isRunning}
        >
          Pause
        </button>
        <button 
          className="btn-outline"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;