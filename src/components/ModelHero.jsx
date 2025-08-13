import React, { Suspense, useRef, useState, useEffect } from 'react'
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
  return <primitive object={fbx} scale={[s, s, s]} position={[0, 0.1, 0]} />
}

const ModelHero = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading for a minimum time to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500) // Reduced to 500ms for faster perceived loading

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="model-hero">
      {/* Show loading state immediately */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 10
        }}>
          <div style={{
            textAlign: 'center',
            color: '#333'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '3px solid rgba(102, 126, 234, 0.3)',
              borderTop: '3px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 15px'
            }}></div>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>Loading 3D Model...</div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

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

        <Suspense fallback={null}>
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