'use client'
import Hero3DScene from './Hero3DScene'
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Globe, 
  Heart,
  Upload,
  Sparkles,
  ShoppingBag,
  Star,
  MapPin,
  ChevronDown,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Phone
} from 'lucide-react'

// 3D Pottery Component
function FloatingPottery({ position = [0, 0, 0] }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.3 + position[1]
    }
  })

  return (
    <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <cylinderGeometry args={[1, 1.5, 2, 32]} />
        <meshStandardMaterial 
          color={hovered ? '#f97316' : '#ea580c'}
          roughness={0.3}
          metalness={0.2}
          emissive={'#ff6b00'}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

// 3D Fabric Component
function FloatingFabric({ position = [0, 0, 0] }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <planeGeometry args={[3, 4, 20, 20]} />
        <meshStandardMaterial 
          color={'#8b5cf6'}
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0.1}
          emissive={'#8b5cf6'}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  )
}

// 3D Scene Component
// function Hero3DScene() {
//   return (
//     <div className="absolute inset-0 z-0">
//       <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//         <pointLight position={[-10, -10, -5]} color={'#f97316'} intensity={0.5} />
        
//         <Suspense fallback={null}>
//           <FloatingPottery position={[-4, 2, 0]} />
//           <FloatingPottery position={[4, -2, -2]} />
//           <FloatingFabric position={[0, 0, -3]} />
//         </Suspense>
        
//         <OrbitControls 
//           enableZoom={false} 
//           enablePan={false}
//           autoRotate
//           autoRotateSpeed={0.5}
//         />
        
//         <mesh>
//           <sphereGeometry args={[50, 32, 32]} />
//           <meshBasicMaterial color={'#0a0a0a'} side={THREE.BackSide} />
//         </mesh>
//       </Canvas>
//     </div>
//   )
// }

// Animated Counter Component
function AnimatedCounter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const timer = setInterval(() => {
        start += Math.ceil(end / 100)
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(start)
        }
      }, 30)
      return () => clearInterval(timer)
    }
  }, [end, isInView])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Product Card Component with 3D Tilt
function ProductCard({ product, index }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg) scale(1.05)`
          : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)',
        transition: 'transform 0.3s ease'
      }}
      className="relative group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-1">
        <div className="relative h-80 bg-gradient-to-br from-gray-900 via-purple-900/20 to-orange-900/20 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center p-6 z-20">
              <div className="text-6xl mb-4">{product.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
              <p className="text-gray-300 text-sm mb-2">{product.artisan}</p>
              <p className="text-orange-400 font-semibold">₹{product.price}</p>
              <div className="flex justify-center items-center mt-2 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
                <span className="text-gray-400 text-xs ml-2">(4.8)</span>
              </div>
            </div>
          </div>
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Sample product data
  const featuredProducts = [
    { emoji: '🏺', title: 'Rajasthani Blue Pottery', artisan: 'Meera Devi', price: '2,450' },
    { emoji: '🧣', title: 'Pashmina Shawl', artisan: 'Abdul Rashid', price: '8,900' },
    { emoji: '📿', title: 'Kundan Jewelry Set', artisan: 'Lakshmi Iyer', price: '12,500' },
    { emoji: '🪔', title: 'Brass Diya Collection', artisan: 'Ravi Kumar', price: '1,850' },
    { emoji: '🎨', title: 'Madhubani Painting', artisan: 'Sita Sharma', price: '4,200' },
    { emoji: '🪵', title: 'Sandalwood Carving', artisan: 'Krishna Rao', price: '6,750' }
  ]

  const steps = [
    { icon: <Upload />, title: 'Artisan Uploads', desc: 'Simple photo & details in local language' },
    { icon: <Sparkles />, title: 'AI Enhancement', desc: 'Auto-generates stories & descriptions' },
    { icon: <ShoppingBag />, title: 'Direct Sales', desc: 'Customers buy authentic crafts globally' }
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center">
        <Hero3DScene />
        
        <motion.div 
          style={{ opacity }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full text-sm font-medium mb-6 border border-orange-500/30">
              ✨ Bridging Tradition with Technology
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          >
            Empowering Artisans
            <br />with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
          >
            Discover authentic handmade crafts, enhanced by AI storytelling, 
            and directly support artisans worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 group">
              Explore Marketplace
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors">
              Join as Artisan
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown size={32} className="text-white/50" />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">Simple steps to global reach</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    {React.cloneElement(step.icon, { size: 28 })}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="text-orange-500" size={24} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Crafts Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
              Featured Crafts
            </h2>
            <p className="text-xl text-gray-400">Authentic handmade treasures from skilled artisans</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={index} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-purple-600/10" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
              Our Impact
            </h2>
            <p className="text-xl text-gray-400">Transforming lives through technology</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: 5000, suffix: '+', label: 'Artisans Onboarded', icon: <Users /> },
              { number: 5, suffix: 'x', label: 'Income Growth', icon: <TrendingUp /> },
              { number: 20, suffix: '%', label: 'Global Demand Rise', icon: <Globe /> },
              { number: 95, suffix: '%', label: 'Customer Satisfaction', icon: <Heart /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Storytelling Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                Meet Priya from Jaipur
              </h2>
              <div className="prose prose-invert prose-lg">
                <p className="text-gray-300 leading-relaxed mb-4">
                  For three generations, Priya&apos;s family has been creating exquisite block-print textiles 
                  using traditional Rajasthani techniques. Each piece tells a story of heritage, 
                  with hand-carved wooden blocks and natural indigo dyes.
                </p>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Before joining our platform, Priya sold 10 bedspreads monthly at ₹500 each. 
                  Now, with AI-enhanced descriptions and global reach, she sells 50 pieces at ₹1,200 each - 
                  a <span className="text-orange-400 font-semibold">12x increase</span> in income.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  &quot;The AI captures the soul of my craft in words I could never express. 
                  Customers from Paris to New York now appreciate not just my products, 
                  but our 300-year-old heritage,&quot; says Priya.
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-8">
                <MapPin className="text-orange-400" />
                <span className="text-gray-400">Jaipur, Rajasthan</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500/20 to-purple-600/20 p-1"
            >
              <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🎨</div>
                  <p className="text-xl font-semibold text-gray-300">Traditional Block Printing</p>
                  <p className="text-sm text-gray-500 mt-2">300 years of heritage</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Global Community Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
              Global Community
            </h2>
            <p className="text-xl text-gray-400">Connecting artisans with customers worldwide</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-48 h-48 text-orange-500/20" />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-8 p-8">
                {['🇮🇳 India', '🇺🇸 USA', '🇬🇧 UK', '🇫🇷 France', '🇩🇪 Germany', '🇯🇵 Japan'].map((country, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="text-center"
                  >
                    <div className="text-2xl mb-2">{country.split(' ')[0]}</div>
                    <p className="text-xs text-gray-400">{country.split(' ')[1]}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-600 to-purple-600 p-1 rounded-3xl"
          >
            <div className="bg-black rounded-3xl p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of artisans and customers creating a sustainable future for traditional crafts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full font-semibold text-lg hover:scale-105 transition-transform">
                  Start Shopping
                </button>
                <button className="px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:scale-105 transition-transform">
                  Become an Artisan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent mb-4">
                ArtisanAI
              </h3>
              <p className="text-gray-400 text-sm">
                Empowering traditional artisans through AI technology
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Marketplace</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">For Artisans</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Terms & Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Mail size={20} />
                </a>
              </div>
              <div className="text-gray-400 text-sm space-y-1">
                <p className="flex items-center gap-2">
                  <Phone size={14} /> +91 98765 43210
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} /> hello@artisanai.com
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2025 ArtisanAI. All rights reserved. Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}