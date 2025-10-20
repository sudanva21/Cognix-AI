import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere({ position, color, speed, mousePosition }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Mouse interaction - spheres follow mouse with smooth easing
    const targetX = position[0] + mousePosition.x * 2
    const targetY = position[1] + Math.sin(time * speed) * 0.5 + mousePosition.y * 2
    
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05
    
    meshRef.current.rotation.x = time * 0.2 + mousePosition.y * 0.5
    meshRef.current.rotation.y = time * 0.3 + mousePosition.x * 0.5
    
    // Scale based on mouse distance
    const distance = Math.sqrt(
      Math.pow(mousePosition.x * 5 - position[0], 2) + 
      Math.pow(mousePosition.y * 5 - position[1], 2)
    )
    const scale = 1 + Math.max(0, 1 - distance / 5) * 0.3
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

function Particles({ mousePosition }) {
  const particlesRef = useRef()
  const geometryRef = useRef()
  
  // Reduce particle count on mobile for better performance
  const particleCount = useMemo(() => {
    return window.innerWidth < 768 ? 1000 : 2000
  }, [])
  
  const { particles, originalPositions } = useMemo(() => {
    const temp = []
    const original = []
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 50
      const y = (Math.random() - 0.5) * 50
      const z = (Math.random() - 0.5) * 50
      temp.push(x, y, z)
      original.push(x, y, z)
    }
    return {
      particles: new Float32Array(temp),
      originalPositions: original
    }
  }, [particleCount])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    particlesRef.current.rotation.y = time * 0.05
    
    // Mouse interaction - particles react to mouse movement
    if (geometryRef.current) {
      const positions = geometryRef.current.attributes.position.array
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i]
        const y = originalPositions[i + 1]
        const z = originalPositions[i + 2]
        
        // Calculate distance from mouse
        const dx = x - mousePosition.x * 10
        const dy = y - mousePosition.y * 10
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Push particles away from mouse
        if (distance < 5) {
          const force = (5 - distance) / 5
          positions[i] = x + (dx / distance) * force * 2
          positions[i + 1] = y + (dy / distance) * force * 2
        } else {
          // Return to original position
          positions[i] += (x - positions[i]) * 0.1
          positions[i + 1] += (y - positions[i + 1]) * 0.1
        }
      }
      
      geometryRef.current.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function FloatingTorus({ position, mousePosition }) {
  const torusRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Mouse interaction - torus rotates based on mouse movement
    torusRef.current.rotation.x = time * 0.3 + mousePosition.y * Math.PI * 0.5
    torusRef.current.rotation.y = time * 0.2 + mousePosition.x * Math.PI * 0.5
    torusRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3 + mousePosition.y * 0.5
    torusRef.current.position.x = position[0] + mousePosition.x * 0.5
  })

  return (
    <mesh ref={torusRef} position={position}>
      <torusGeometry args={[1.5, 0.4, 16, 100]} />
      <meshStandardMaterial
        color="#764ba2"
        metalness={0.8}
        roughness={0.2}
        emissive="#667eea"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function MouseLight() {
  const lightRef = useRef()
  const { viewport } = useThree()
  
  useFrame((state) => {
    if (lightRef.current) {
      const x = state.mouse.x * viewport.width / 2
      const y = state.mouse.y * viewport.height / 2
      lightRef.current.position.x = x
      lightRef.current.position.y = y
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 5]}
      intensity={2}
      distance={10}
      color="#f093fb"
    />
  )
}

function Scene({ mousePosition }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#667eea" intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} />
      <MouseLight />
      
      <AnimatedSphere position={[-3, 0, 0]} color="#667eea" speed={0.5} mousePosition={mousePosition} />
      <AnimatedSphere position={[3, 0, -2]} color="#764ba2" speed={0.7} mousePosition={mousePosition} />
      <AnimatedSphere position={[0, -2, -1]} color="#f093fb" speed={0.6} mousePosition={mousePosition} />
      
      <FloatingTorus position={[0, 2, -3]} mousePosition={mousePosition} />
      
      <Particles mousePosition={mousePosition} />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  )
}

function MouseTracker({ setMousePosition }) {
  useFrame((state) => {
    setMousePosition({ x: state.mouse.x, y: state.mouse.y })
  })
  return null
}

export default function Background3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  return (
    <div className="fixed inset-0 -z-10" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e1b4b 100%)' }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <MouseTracker setMousePosition={setMousePosition} />
        <Scene mousePosition={mousePosition} />
      </Canvas>
    </div>
  )
}
