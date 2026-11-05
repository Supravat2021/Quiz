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
    <div className="w-full h-full relative min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex items-center justify-center group">
      {/* Aesthetic Top Tag */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase font-semibold">
          3D SIMULATION • PHASE 0{questionIndex + 1}
        </span>
      </div>

      {/* Aesthetic Bottom Hint */}
      <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-lg bg-slate-950/60 border border-white/5 backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono text-slate-400">Drag to orbit 3D model</span>
      </div>

      {/* Subtle Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-radial-gradient from-transparent via-transparent to-black/40 z-[5]" />

      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#070b18']} />
        <fog attach="fog" args={['#070b18', 3.8, 9.5]} />

        <Suspense fallback={null}>
          {renderScene()}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.75}
          minPolarAngle={Math.PI / 2.25}
          rotateSpeed={0.4}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
