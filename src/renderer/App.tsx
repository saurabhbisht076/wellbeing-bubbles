import React from "react";
import BubbleField from "./components/BubbleField";
import './index.css';

const App: React.FC = () => (
  <div>
    <BubbleField />
    <div style={{
      position: "relative",
      zIndex: 1,
      textAlign: "center",
      marginTop: "30vh",
      fontSize: "2rem",
      color: "#383838",
      fontWeight: 700,
      letterSpacing: 1,
      textShadow: "0 1px 8px rgba(255,255,255,0.6)",
    }}>
      Wellbeing Bubbles
    </div>
  </div>
);

export default App;