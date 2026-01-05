
import React from 'react';
import { MiniGame } from './components/MiniGame';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm">
        <MiniGame />
      </div>
    </div>
  );
};

export default App;
