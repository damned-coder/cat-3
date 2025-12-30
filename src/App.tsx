import React, { useState } from "react";
import "./App.css";

// 1. Import Firebase functions
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// 2. Firebase Configuration
// Replace these values with your actual Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyDr1UDFHc1dZ9Nnu3lW8MiLGde2exHNXI0",
  authDomain: "espproject1-b5267.firebaseapp.com",
  projectId: "espproject1-b5267",
  storageBucket: "espproject1-b5267.firebasestorage.app",
  messagingSenderId: "270907351918",
  appId: "1:270907351918:web:697bcdbce17fc3cd5dd77f",
  measurementId: "G-6D68BYD3DQ",
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Define valid command types for safety
type CommandType = "FORWARD" | "BACKWARD" | "LEFT" | "RIGHT" | "SPIN" | "STOP";

// Props interface for the ControlButton component
interface ControlButtonProps {
  label: string;
  command: CommandType;
  gridArea: string;
}

function App() {
  const [status, setStatus] = useState<string>("Ready");

  // Function to write command to Firebase Realtime Database
  const sendCommand = (command: CommandType) => {
    setStatus(`Sending: ${command}`);

    // Writing to 'car/direction' path
    set(ref(db, "car/direction"), command)
      .then(() => {
        console.log(`Command updated to: ${command}`);
      })
      .catch((error) => {
        console.error("Firebase Error:", error);
        setStatus("Connection Error");
      });
  };

  // Handler for pressing a button
  const handlePress = (command: CommandType) => {
    sendCommand(command);
  };

  // Handler for releasing a button
  const handleRelease = () => {
    sendCommand("STOP");
    setStatus("Stopped");
  };

  // Reusable Button Component with typed props
  const ControlButton: React.FC<ControlButtonProps> = ({
    label,
    command,
    gridArea,
  }) => (
    <button
      className="control-btn"
      style={{ gridArea: gridArea }}
      onMouseDown={() => handlePress(command)}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease} // Stop if mouse leaves button area
      onTouchStart={() => handlePress(command)}
      onTouchEnd={handleRelease}
    >
      {label}
    </button>
  );

  return (
    <div className="app-container">
      <h1 className="title">RC Car Controller</h1>

      <div className="control-pad">
        {/* Layout: 3 columns x 4 rows */}

        {/* Forward: Row 1, Center */}
        <ControlButton label="▲" command="FORWARD" gridArea="1 / 2 / 2 / 3" />

        {/* Left: Row 2, Left */}
        <ControlButton label="◀" command="LEFT" gridArea="2 / 1 / 3 / 2" />

        {/* Right: Row 2, Right */}
        <ControlButton label="▶" command="RIGHT" gridArea="2 / 3 / 3 / 4" />

        {/* Backward: Row 3, Center */}
        <ControlButton label="▼" command="BACKWARD" gridArea="3 / 2 / 4 / 3" />

        {/* Spin: Row 4, Center */}
        <ControlButton label="↺ Spin" command="SPIN" gridArea="4 / 2 / 5 / 3" />
      </div>

      <div className="status-display">Status: {status}</div>
    </div>
  );
}

export default App;
