import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { SceneQ1NextToken } from './scenes/SceneQ1NextToken';
import { SceneQ2FourCharsOneToken } from './scenes/SceneQ2FourCharsOneToken';
import { SceneQ3HallucinationMorph } from './scenes/SceneQ3HallucinationMorph';
import { SceneQ4StrictExaminer } from './scenes/SceneQ4StrictExaminer';
import { SceneQ5FewShotBeams } from './scenes/SceneQ5FewShotBeams';
import { SceneQ6SlopFilter } from './scenes/SceneQ6SlopFilter';
import { SceneQ7AspectRatio } from './scenes/SceneQ7AspectRatio';
import { SceneQ8GPTTransformerTower } from './scenes/SceneQ8GPTTransformerTower';
import { SceneQ9TruthIllusionPortals } from './scenes/SceneQ9TruthIllusionPortals';
import { SceneQ10FaceIDScan } from './scenes/SceneQ10FaceIDScan';

interface QuestionCanvasProps {
  questionIndex: number;
}

export function QuestionCanvas({ questionIndex }: QuestionCanvasProps) {
  // Render the distinct 3D scene matching current question (0-indexed 0..9)
  const renderScene = () => {
    switch (questionIndex) {
      case 0:
        return <SceneQ1NextToken />;
      case 1:
        return <SceneQ2FourCharsOneToken />;
      case 2:
        return <SceneQ3HallucinationMorph />;
      case 3:
        return <SceneQ4StrictExaminer />;
      case 4:
        return <SceneQ5FewShotBeams />;
      case 5:
        return <SceneQ6SlopFilter />;
      case 6:
        return <SceneQ7AspectRatio />;
      case 7:
        return <SceneQ8GPTTransformerTower />;
      case 8:
        return <SceneQ9TruthIllusionPortals />;
      case 9:
        return <SceneQ10FaceIDScan />;
      default:
        return <SceneQ1NextToken />;
    }
  };

  return (
    <div className="w-full h-full relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] rounded-2xl overflow-hidden glass-panel border border-slate-700/50 shadow-2xl flex items-center justify-center">
      {/* Question Scene Indicator Pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/70 border border-amber-400/30 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span className="text-xs font-mono font-semibold tracking-wider text-amber-300">
          3D SIMULATION Q{questionIndex + 1}
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#080e21']} />
        <Stars radius={30} depth={20} count={1200} factor={2} fade speed={0.6} />

        <Suspense fallback={null}>
          {renderScene()}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.3}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

