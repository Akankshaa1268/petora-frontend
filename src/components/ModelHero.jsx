import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Html, useFBX, useTexture } from '@react-three/drei'

function Rotator({ children }) {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2
  })
  return <group ref={ref}>{children}</group>
}

function HealthcareTeamModel() {
  const fbx = useFBX('/Healthcare_Team_with__0811143918_texture_fbx/Healthcare_Team_with__0811143918_texture.fbx')
  const tex = useTexture('/Healthcare_Team_with__0811143918_texture_fbx/Healthcare_Team_with__0811143918_texture.png')

  fbx.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true
      obj.receiveShadow = true
      if (obj.material && tex) {
        try {
          obj.material.map = obj.material.map || tex
          obj.material.needsUpdate = true
        } catch {}
      }
    }
  })

  // Increase overall size and lift a bit for composition
  const s = 0.015
  return <primitive object={fbx} scale={[s, s, s]} position={[0, -0.25, 0]} />
}

const ModelHero = () => {
  return (
    <div className="model-hero">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 35, position: [0, 1.4, 6] }}
        shadows
      >
        {/* Transparent background */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.3} castShadow />
        <directionalLight position={[-5, 6, -5]} intensity={0.6} />

        <Suspense fallback={<Html center><div style={{color:'#fff', fontSize: 14}}>Loading 3D…</div></Html>}>
          <Rotator>
            <HealthcareTeamModel />
          </Rotator>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  )
}

export default ModelHero