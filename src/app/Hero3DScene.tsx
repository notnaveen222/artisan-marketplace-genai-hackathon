'use client'

import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Float, 
  OrbitControls, 
  PerspectiveCamera,
  Environment,
  Stars,
  Cloud,
  Text3D,
  Center,
  Sparkles,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  ContactShadows,
  useTexture,
  Sphere,
  Box,
  Torus,
  TorusKnot,
  Dodecahedron,
  Cylinder,
  Ring,
  Trail,
  useGLTF,
  Stage
} from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion-3d'
import { useSpring, animated } from '@react-spring/three'

// Pottery Component with Intricate Design
function ArtisanPottery({ position = [0, 0, 0], scale = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = React.useState(false)
  
  const { scale: animatedScale } = useSpring({
    scale: hovered ? scale * 1.15 : scale,
    config: { tension: 300, friction: 20 }
  })

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <animated.mesh
        ref={meshRef}
        position={position}
        scale={animatedScale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <cylinderGeometry args={[1.5, 2, 3, 32, 1, false]} />
        <MeshDistortMaterial
          color={hovered ? '#ff6b35' : '#f97316'}
          emissive={'#ff4500'}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.3}
          metalness={0.8}
          distort={0.2}
          speed={2}
        />
      </animated.mesh>
      
      {/* Decorative rings */}
      <mesh position={[position[0], position[1] + 0.8, position[2]]}>
        <torusGeometry args={[1.8, 0.05, 8, 32]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[position[0], position[1] - 0.8, position[2]]}>
        <torusGeometry args={[2.2, 0.05, 8, 32]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  )
}

// Floating Fabric with Realistic Movement
function FloatingFabric({ position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = React.useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.2
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.4) * 0.3
    }
  })

  return (
    <Float speed={3} rotationIntensity={0.8} floatIntensity={0.6}>
      <mesh 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[3, 4, 32, 32]} />
        <MeshWobbleMaterial
          color={hovered ? '#a855f7' : '#8b5cf6'}
          emissive={'#7c3aed'}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.7}
          factor={0.3}
          speed={3}
        />
      </mesh>
    </Float>
  )
}

// Jewelry Component with Sparkle
function FloatingJewelry({ position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = React.useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.8
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.1
    }
  })

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={0.8}>
      <group 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh scale={hovered ? 1.2 : 1}>
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color={'#ffd700'}
            emissive={'#ffb700'}
            emissiveIntensity={hovered ? 1 : 0.5}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1}
          />
        </mesh>
        <Sparkles
          count={20}
          scale={2}
          size={2}
          speed={0.5}
          opacity={hovered ? 1 : 0.5}
          color={'#ffd700'}
        />
      </group>
    </Float>
  )
}

// AI Nodes Network
function AINetwork() {
  const groupRef = useRef<THREE.Group>(null)
  const nodes = useMemo(() => {
    const temp = []
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2
      const radius = 8 + Math.random() * 4
      temp.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 6,
          Math.sin(angle) * radius
        ],
        scale: 0.1 + Math.random() * 0.2
      })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position} scale={node.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color={'#00ffff'}
            emissive={'#00ffff'}
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      
      {/* Connection lines */}
      {nodes.map((node, i) => {
        const nextNode = nodes[(i + 1) % nodes.length]
        return (
          <line key={`line-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  ...node.position,
                  ...nextNode.position
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={'#00ffff'} opacity={0.2} transparent />
          </line>
        )
      })}
    </group>
  )
}

// Wooden Carving Component
function WoodenCarving({ position = [0, 0, 0] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = React.useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh 
        ref={meshRef} 
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial
          color={'#8b4513'}
          emissive={'#654321'}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </Float>
  )
}

// Gradient Sky Background
function GradientSky() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.material) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  const gradientShader = {
    uniforms: {
      time: { value: 0 },
      colorTop: { value: new THREE.Color('#0a0a0a') },
      colorMiddle: { value: new THREE.Color('#1a0033') },
      colorBottom: { value: new THREE.Color('#330066') }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 colorTop;
      uniform vec3 colorMiddle;
      uniform vec3 colorBottom;
      varying vec2 vUv;
      
      void main() {
        float mixValue = vUv.y;
        vec3 color = mix(colorBottom, colorMiddle, smoothstep(0.0, 0.5, mixValue));
        color = mix(color, colorTop, smoothstep(0.5, 1.0, mixValue));
        
        // Add shimmer effect
        float shimmer = sin(time * 0.5 + vUv.x * 10.0) * 0.05 + 0.95;
        color *= shimmer;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[50, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        uniforms={gradientShader.uniforms}
        vertexShader={gradientShader.vertexShader}
        fragmentShader={gradientShader.fragmentShader}
      />
    </mesh>
  )
}

// Central Hero Object
function CentralArtifact() {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = React.useState(false)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05
      groupRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main artifact - ornate vase */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 3, 5, 64, 1, false]} />
        <MeshDistortMaterial
          color={'#ff6b35'}
          emissive={'#ff4500'}
          emissiveIntensity={hovered ? 1.2 : 0.6}
          roughness={0.2}
          metalness={0.9}
          distort={0.15}
          speed={1}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Decorative elements */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, -2 + i, 0]}>
          <torusGeometry args={[2.5 + i * 0.2, 0.08, 8, 32]} />
          <meshStandardMaterial
            color={'#ffd700'}
            emissive={'#ffb700'}
            emissiveIntensity={0.5}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      ))}
      
      {/* Floating particles around */}
      <Sparkles
        count={50}
        scale={8}
        size={3}
        speed={0.5}
        opacity={0.8}
        color={'#ffd700'}
      />
    </group>
  )
}

// Interactive Camera Controller
function CameraController() {
  const { camera, gl } = useThree()
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1
      mouseY.current = -(event.clientY / window.innerHeight) * 2 + 1
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    camera.position.x += (mouseX.current * 2 - camera.position.x) * 0.02
    camera.position.y += (mouseY.current * 2 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Particle Field
function ParticleField() {
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 300; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ],
        size: Math.random() * 0.5
      })
    }
    return temp
  }, [])

  return (
    <group>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial
            color={'#ffffff'}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main Hero 3D Scene Component
export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        {/* Lighting Setup */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -5]} color={'#ff6b35'} intensity={0.5} />
        <pointLight position={[10, -10, 5]} color={'#8b5cf6'} intensity={0.5} />
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />

        {/* Fog for depth */}
        <fog attach="fog" args={['#0a0a0a', 10, 50]} />

        <Suspense fallback={null}>
          {/* Background */}
          <GradientSky />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          
          {/* Central Hero Object */}
          <CentralArtifact />
          
          {/* Orbiting Artisan Crafts */}
          <group>
            <ArtisanPottery position={[-6, 2, -2]} scale={0.7} />
            <ArtisanPottery position={[6, -2, -3]} scale={0.5} />
            <FloatingFabric position={[-4, -3, -5]} />
            <FloatingFabric position={[5, 3, -4]} />
            <FloatingJewelry position={[-3, 4, -1]} />
            <FloatingJewelry position={[4, -4, -2]} />
            <FloatingJewelry position={[0, 5, -3]} />
            <WoodenCarving position={[-5, 0, -4]} />
            <WoodenCarving position={[3, 1, -3]} />
          </group>
          
          {/* AI Network Visualization */}
          <AINetwork />
          
          {/* Ambient Particles */}
          <ParticleField />
          <Sparkles
            count={100}
            scale={20}
            size={1}
            speed={0.3}
            opacity={0.5}
            color={'#ffffff'}
          />
          
          {/* Interactive Elements */}
          <CameraController />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            autoRotate
            autoRotateSpeed={0.3}
          />
          
          {/* Contact Shadows for grounding */}
          <ContactShadows
            position={[0, -5, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={10}
          />
        </Suspense>
      </Canvas>
      
      {/* Overlay gradient for blending with UI */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}