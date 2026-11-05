import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
    <div className="w-full h-full relative min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] rounded-3xl overflow-hidden glass-panel border-2 border-indigo-500/25 shadow-2xl flex items-center justify-center group">
      {/* Saturated Stage Indicator Pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/80 border border-pink-500/40 backdrop-blur-md shadow-lg">
        <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
        <span className="text-xs font-mono tracking-wider text-pink-300 uppercase font-bold">
          3D SIMULATION • QUESTION 0{questionIndex + 1}
        </span>
      </div>

      {/* Orbit Tip */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[11px] font-mono text-indigo-300">Drag to rotate in 3D</span>
      </div>

      {/* Subtle Color Vignette */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-radial-gradient from-transparent via-transparent to-slate-950/40 z-[5]" />

      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#140d30']} />
        <fog attach="fog" args={['#140d30', 3.8, 9.8]} />

        <Suspense fallback={null}>
          {renderScene()}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.75}
          minPolarAngle={Math.PI / 2.25}
          rotateSpeed={0.5}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
