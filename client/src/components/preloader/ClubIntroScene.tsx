import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { TextureLoader } from 'three';

type ClubId = 'astana' | 'kairat' | 'kaisar';

type ClubIntroSceneProps = {
  clubId: ClubId;
  logo: string;
  title: string;
  subtitle: string;
  onContinue: () => void;
};

const clubSceneTheme: Record<
  ClubId,
  {
    bgA: string;
    bgB: string;
    light: string;
    panel: string;
  }
> = {
  astana: {
    bgA: '#0ea5e9',
    bgB: '#f2c94c',
    light: '#ffffff',
    panel: 'rgba(255,255,255,0.12)',
  },
  kairat: {
    bgA: '#111111',
    bgB: '#f2c94c',
    light: '#fff6cf',
    panel: 'rgba(255,255,255,0.10)',
  },
  kaisar: {
    bgA: '#b91c1c',
    bgB: '#ffffff',
    light: '#fff3f3',
    panel: 'rgba(255,255,255,0.12)',
  },
};

function MovingParticles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.04} sizeAttenuation transparent opacity={0.65} />
    </points>
  );
}

function LogoPlane({
  textureUrl,
  accentColor,
}: {
  textureUrl: string;
  accentColor: string;
}) {
  const texture = useLoader(TextureLoader, textureUrl);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.55) * 0.05;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.12;
  });

  return (
    <group>
      <mesh position={[0, 0, -0.45]}>
        <torusGeometry args={[1.7, 0.06, 24, 120]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.25}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh ref={meshRef}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshStandardMaterial
          map={texture}
          transparent
          toneMapped={false}
          emissive={new THREE.Color('#ffffff')}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

function CameraRig({
  onZoomComplete,
  revealNoise,
  setRevealNoise,
}: {
  onZoomComplete: () => void;
  revealNoise: boolean;
  setRevealNoise: (value: boolean) => void;
}) {
  const { camera } = useThree();
  const doneRef = useRef(false);

  useEffect(() => {
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((_, delta) => {
    if (doneRef.current) return;

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 4.2, 0.8 * delta);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.08, 1.2 * delta);
    camera.lookAt(0, 0, 0);

    if (!revealNoise && camera.position.z < 3.1) {
      setRevealNoise(true);
    }

    if (camera.position.z < 4.45) {
      doneRef.current = true;
      onZoomComplete();
    }
  });

  return null;
}

function SceneContent({
  clubId,
  logo,
  onZoomComplete,
  revealNoise,
  setRevealNoise,
}: {
  clubId: ClubId;
  logo: string;
  onZoomComplete: () => void;
  revealNoise: boolean;
  setRevealNoise: (value: boolean) => void;
}) {
  const theme = clubSceneTheme[clubId];

  return (
    <>
      <color attach="background" args={[theme.bgA]} />
      <fog attach="fog" args={[theme.bgA, 6, 14]} />

      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color={theme.light} />
      <pointLight position={[-4, 2, 3]} intensity={2.5} color={theme.bgB} />
      <pointLight position={[4, -1, 2]} intensity={2.2} color={theme.bgA} />

      <CameraRig
        onZoomComplete={onZoomComplete}
        revealNoise={revealNoise}
        setRevealNoise={setRevealNoise}
      />

      <MovingParticles color={theme.light} />

      <mesh position={[0, 0, -2.2]} rotation={[-0.2, 0, 0]}>
        <circleGeometry args={[5.5, 64]} />
        <meshBasicMaterial color={theme.bgB} transparent opacity={0.08} />
      </mesh>

      <LogoPlane textureUrl={logo} accentColor={theme.bgB} />

      <EffectComposer>
        <Vignette eskil={false} offset={0.12} darkness={0.72} />
        {revealNoise ? <Noise opacity={0.22} premultiply /> : <></>}
      </EffectComposer>
    </>
  );
}

export default function ClubIntroScene({
  clubId,
  logo,
  title,
  subtitle,
  onContinue,
}: ClubIntroSceneProps) {
  const [showEnter, setShowEnter] = useState(false);
  const [revealNoise, setRevealNoise] = useState(false);

  const theme = clubSceneTheme[clubId];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${theme.bgB}30, transparent 30%), linear-gradient(135deg, ${theme.bgA} 0%, ${theme.bgB} 100%)`,
        }}
      />

      <Canvas camera={{ position: [0, 0, 7.5], fov: 42 }}>
        <SceneContent
          clubId={clubId}
          logo={logo}
          onZoomComplete={() => {
            setTimeout(() => setShowEnter(true), 350);
          }}
          revealNoise={revealNoise}
          setRevealNoise={setRevealNoise}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-10 z-10 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-white/80">
          Club intro
        </p>
        <h1 className="mt-3 text-5xl font-black tracking-tight text-white md:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
          {subtitle}
        </p>
      </div>

      {showEnter ? (
        <div className="absolute inset-x-0 bottom-14 z-20 flex justify-center">
          <button
            onClick={onContinue}
            className="rounded-2xl border border-white/25 bg-white/12 px-10 py-4 text-lg font-black tracking-wide text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/18"
          >
            ENTER
          </button>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-14 z-20 flex justify-center">
          <div className="rounded-2xl border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur-xl">
            Loading intro...
          </div>
        </div>
      )}
    </div>
  );
}   