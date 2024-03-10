import React, { createContext } from 'react';
import './App.css';
import TabNavigation from './components/TabNavigation';

export const LoginContext = createContext(false)

function App() {
  return (
    <div className="App">
      <TabNavigation />
    </div>
  );
}

export default App;
