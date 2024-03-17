import React from 'react';
import './App.css';
import TabNavigation from './components/TabNavigation';

function App() {
  return (
    <div className="App" onContextMenu={(event) => event.preventDefault()}>
      <TabNavigation />
    </div>
  );
}

export default App;
