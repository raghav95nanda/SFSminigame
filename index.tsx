import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  IDLE_ANIMATION, 
  JUMP_ANIMATION, 
  TRAMPOLINE_ANIMATION 
} from './animations/data';

// --- Components ---

enum GameState {
  IDLE,
  IMPACT,
  ASCENDING,
  DESCENDING
}

const MiniGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [bounceCount, setBounceCount] = useState(0);
  
  const charControls = useAnimation();
  const trampolineLottieRef = useRef<LottieRefCurrentProps>(null);
  const characterLottieRef = useRef<LottieRefCurrentProps>(null);

  // Constants
  const LOW_JUMP_Y = -70;
  const HIGH_JUMP_Y = -350;
  const IMPACT_Y = 8; // Character sinks into trampoline

  const handleTrampolineClick = useCallback(async () => {
    if (gameState !== GameState.IDLE) return;

    const nextBounceCount = bounceCount + 1;
    setBounceCount(nextBounceCount);
    const isHighJump = nextBounceCount % 3 === 0;

    setGameState(GameState.IMPACT);
    
    // Start trampoline animation immediately
    trampolineLottieRef.current?.goToAndPlay(0);

    // Phase 1: Impact (within 1.33s rule)
    // Character moves down slightly as trampoline stretches
    await charControls.start({
      y: IMPACT_Y,
      transition: { duration: 0.15, ease: "easeIn" }
    });

    // Phase 2: Ascent
    setGameState(GameState.ASCENDING);
    // Force Jump animation to start frame (crouch/ready)
    characterLottieRef.current?.goToAndStop(0, true);

    const targetY = isHighJump ? HIGH_JUMP_Y : LOW_JUMP_Y;
    const ascentDuration = isHighJump ? 0.8 : 0.4;

    await charControls.start({
      y: targetY,
      transition: { 
        duration: ascentDuration, 
        ease: "easeOut" 
      }
    });

    // Phase 3: Descent (Peak hit)
    setGameState(GameState.DESCENDING);
    // Play the full jump animation (transformation to down state)
    characterLottieRef.current?.goToAndPlay(0);

    const descentDuration = isHighJump ? 2.2 : 0.6; // High jump "floats" down
    
    await charControls.start({
      y: 0,
      transition: { 
        duration: descentDuration, 
        ease: isHighJump ? [0.45, 0.05, 0.55, 0.95] : "easeIn" 
      }
    });

    // Reset to Idle
    setGameState(GameState.IDLE);
    if (isHighJump) {
       setBounceCount(0);
    }
  }, [gameState, bounceCount, charControls]);

  return (
    <div className="flex flex-col items-center justify-end h-[450px] w-full relative overflow-visible">
      
      {/* Mascot Layer */}
      <motion.div
        animate={charControls}
        initial={{ y: 0 }}
        className="absolute z-20 pointer-events-none"
        style={{ bottom: '110px' }} 
      >
        <div className="w-[140px] h-[140px]">
          {gameState === GameState.IDLE ? (
            <Lottie 
              lottieRef={characterLottieRef}
              animationData={IDLE_ANIMATION} 
              loop={true}
              className="w-full h-full"
            />
          ) : (
            <Lottie 
              lottieRef={characterLottieRef}
              animationData={JUMP_ANIMATION} 
              loop={false}
              className="w-full h-full"
            />
          )}
        </div>
      </motion.div>

      {/* Trampoline Layer */}
      <div 
        className="w-full max-w-[240px] cursor-pointer z-10 transition-transform active:scale-[0.97]"
        onClick={handleTrampolineClick}
      >
        <Lottie 
          lottieRef={trampolineLottieRef}
          animationData={TRAMPOLINE_ANIMATION} 
          autoplay={false}
          loop={false}
          className="w-full h-auto"
        />
      </div>

      {/* UI Overlay */}
      <div className="absolute top-4 w-full flex flex-col items-center pointer-events-none">
        <div className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
          {bounceCount > 0 ? `Power Level ${bounceCount}/3` : "Click to jump"}
        </div>
        <div className="flex gap-1 mt-2">
           {[1, 2, 3].map(i => (
             <div 
               key={i} 
               className={`h-1 w-8 rounded-full transition-colors duration-300 ${bounceCount >= i ? 'bg-orange-500' : 'bg-slate-200'}`} 
             />
           ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <MiniGame />
      </div>
    </div>
  );
};

// --- Entry Point ---

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
