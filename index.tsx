import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { motion, useAnimation } from 'framer-motion';
import { 
  IDLE_ANIMATION, 
  JUMP_ANIMATION, 
  TRAMPOLINE_ANIMATION 
} from './animations/data';

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

  // Jump height constants
  const LOW_JUMP_Y = -60;
  const HIGH_JUMP_Y = -280;
  const IMPACT_Y = 6;

  const handleTrampolineClick = useCallback(async () => {
    if (gameState !== GameState.IDLE) return;

    const nextBounceCount = bounceCount + 1;
    setBounceCount(nextBounceCount);
    const isHighJump = nextBounceCount % 3 === 0;

    setGameState(GameState.IMPACT);
    
    // Play the trampoline animation immediately
    trampolineLottieRef.current?.goToAndPlay(0);

    // Initial impact squash
    await charControls.start({
      y: IMPACT_Y,
      transition: { duration: 0.2, ease: "easeIn" }
    });

    setGameState(GameState.ASCENDING);
    // Reset character jump animation to start
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

    setGameState(GameState.DESCENDING);
    // Transform character into falling state
    characterLottieRef.current?.goToAndPlay(0);

    const descentDuration = isHighJump ? 2.0 : 0.6;
    
    await charControls.start({
      y: 0,
      transition: { 
        duration: descentDuration, 
        ease: isHighJump ? [0.45, 0.05, 0.55, 0.95] : "easeIn" 
      }
    });

    setGameState(GameState.IDLE);
    if (isHighJump) {
       setBounceCount(0);
    }
  }, [gameState, bounceCount, charControls]);

  return (
    <div className="flex flex-col items-center justify-end h-[400px] w-full relative overflow-visible">
      {/* Mascot Layer */}
      <motion.div
        animate={charControls}
        initial={{ y: 0 }}
        className="absolute z-20 pointer-events-none"
        style={{ bottom: '102px' }} 
      >
        <div className="w-[120px] h-[120px]">
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
        className="w-full max-w-[220px] cursor-pointer z-10 transition-transform active:scale-[0.98]"
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

      {/* Bounce counter */}
      <div className="absolute top-4 w-full flex flex-col items-center pointer-events-none">
        <div className="text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase">
          {bounceCount > 0 ? `BOUNCE ${bounceCount}/3` : "Click to start"}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-4">
      <MiniGame />
    </div>
  </div>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
