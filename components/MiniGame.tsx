import React, { useState, useRef, useCallback } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  IDLE_ANIMATION, 
  JUMP_ANIMATION, 
  TRAMPOLINE_ANIMATION 
} from '../animations/data';

enum GameState {
  IDLE,
  IMPACT,
  ASCENDING,
  DESCENDING
}

export const MiniGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [bounceCount, setBounceCount] = useState(0);
  
  const charControls = useAnimation();
  const trampolineLottieRef = useRef<LottieRefCurrentProps>(null);
  const characterLottieRef = useRef<LottieRefCurrentProps>(null);

  // Jump height constants
  const LOW_JUMP_Y = -60;
  const HIGH_JUMP_Y = -280;
  // Impact squash offset - reduced from 18 to 6 for a more subtle squash
  const IMPACT_Y = 6;

  const handleTrampolineClick = useCallback(async () => {
    if (gameState !== GameState.IDLE) return;

    const nextBounceCount = bounceCount + 1;
    setBounceCount(nextBounceCount);
    const isHighJump = nextBounceCount % 3 === 0;

    setGameState(GameState.IMPACT);
    
    // Play the trampoline animation immediately on click
    trampolineLottieRef.current?.goToAndPlay(0);

    // Initial impact squash for 0.34s as requested
    await charControls.start({
      y: IMPACT_Y,
      transition: { duration: 0.34, ease: "easeInOut" }
    });

    setGameState(GameState.ASCENDING);
    characterLottieRef.current?.goToAndStop(0, true);

    const targetY = isHighJump ? HIGH_JUMP_Y : LOW_JUMP_Y;
    const ascentDuration = isHighJump ? 1.0 : 0.5;

    await charControls.start({
      y: targetY,
      transition: { 
        duration: ascentDuration, 
        ease: isHighJump ? "easeOut" : "circOut" 
      }
    });

    setGameState(GameState.DESCENDING);
    characterLottieRef.current?.goToAndPlay(0);

    const descentDuration = isHighJump ? 1.6 : 0.6;
    
    await charControls.start({
      y: 0,
      transition: { 
        duration: descentDuration, 
        ease: isHighJump ? "easeInOut" : "circIn" 
      }
    });

    setGameState(GameState.IDLE);
    if (isHighJump) {
       setBounceCount(0);
    }
  }, [gameState, bounceCount, charControls]);

  return (
    <div className="flex flex-col items-center justify-end h-[350px] w-full relative overflow-visible">
      
      {/* Mascot Layer - Anchored at 102px to stand perfectly on the black mat */}
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
        className="w-full max-w-[200px] cursor-pointer z-10 transition-transform active:scale-[0.98]"
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
      <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-gray-200 select-none">
        {bounceCount > 0 ? `BOUNCE ${bounceCount}/3` : ""}
      </div>

      <AnimatePresence>
        {gameState === GameState.IDLE && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 text-[9px] uppercase tracking-[0.2em] text-gray-300 pointer-events-none"
          >
            Bounce
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};