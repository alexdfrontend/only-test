import React from 'react';
import './App.css';
import Dates from './components/Dates/Dates';
import { timePoints_6, timePoints_2 } from "./data";

function App() {
  return (
    <div className="App">
      <Dates timePoints={timePoints_6} />
      <Dates timePoints={timePoints_2} />
    </div>
  );
}

export default App;
