import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App</h1>
        
        <p>
          You clicked the button <strong>{count}</strong> times.
        </p>

        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            margin: '20px 0',
            cursor: 'pointer'
          }}
        >
          Click me!
        </button>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;