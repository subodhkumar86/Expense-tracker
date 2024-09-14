import React from 'react';
import GlobalStyles from './globalStyles';
import Tracker from './components/Tracker';

function App() {
  return (
    <>
      <GlobalStyles />
      <div className="container">
        <h1>Expense Tracker</h1>
        <Tracker />
      </div>
    </>
  );
}

export default App;
