import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Text3D,
  Center,
  Points,
  PointMaterial,
} from "@react-three/drei";
import { useEffect, useState, useRef, useMemo } from "react";

/* 🔥 Animated Logo */
function Logo() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse scaling
    const scale = 1 + Math.sin(t * 2) * 0.1;
    meshRef.current.scale.set(scale, scale, scale);

    // Rotation
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Center>
        <Text3D
          ref={meshRef}
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.2}
        >
          INFOYASHONAND
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.2}
          />
        </Text3D>
      </Center>
    </Float>
  );
}

/* ✨ Interactive Particles */
function Particles() {
  const pointsRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const particlesCount = 1800;

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initial particle positions
  const positions = useMemo(() => {
    const arr = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;

    const positionsArray = points.geometry.attributes.position.array;

    for (let i = 0; i < particlesCount; i++) {
      let x = positionsArray[i * 3];
      let y = positionsArray[i * 3 + 1];
      let z = positionsArray[i * 3 + 2];

      // Cursor interaction
      const dx = mouse.current.x * 5 - x;
      const dy = mouse.current.y * 5 - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const force = 0.02 / (dist + 0.1);

      x += dx * force;
      y += dy * force;

      // Wave motion
      z += Math.sin(Date.now() * 0.001 + i) * 0.002;

      positionsArray[i * 3] = x;
      positionsArray[i * 3 + 1] = y;
      positionsArray[i * 3 + 2] = z;
    }

    points.geometry.attributes.position.needsUpdate = true;

    // Global rotation
    points.rotation.y += 0.0007;
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        size={0.025}
        color="#f59e0b"
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

/* 🎬 Main Loader */
export default function Loader({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 800);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-700 ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 5]} intensity={1} />

        {/* ✨ Particles */}
        <Particles />

        {/* 🔥 Logo */}
        <Logo />
      </Canvas>

      {/* Loading text */}
      <div className="absolute bottom-20 w-full text-center text-white tracking-widest text-sm animate-pulse">
        LOADING EXPERIENCE...
      </div>
    </div>
  );
}
