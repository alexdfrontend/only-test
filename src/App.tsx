import React from 'react';
import Dates from './components/Dates/Dates';
import { timePoints_6, timePoints_2 } from "./data";

function App() {
  return (
    <div className="App">
      <Dates timePoints={timePoints_6} />
    </div>
  );
}

export default App;
