'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive
      object={scene}
      ref={meshRef}
      scale={2.5}
      position={[0, 0, 0]}
    />
  );
}

export default function Logo3D() {
  return (
    <div className='w-full w-screen h-[200px] md:h-[350px] cursor-grab active:cursor-grabbing flex items-center justify-center left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative'>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 35 }}>
        <Suspense fallback={null}>
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[0, 0]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Float
              speed={2}
              rotationIntensity={0.5}
              floatIntensity={0.5}
            >
              <Model url='/logo-3d.glb' />
            </Float>
          </PresentationControls>
          <Environment preset='city' />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} />
        </Suspense>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
      </Canvas>
    </div>
  );
}


