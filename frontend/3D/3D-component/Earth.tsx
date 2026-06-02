'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import earthVertexShader from '@/3D/shaders/earth/vertex.glsl'
import earthFragmentShader from '@/3D/shaders/earth/fragment.glsl'

export default function Earth() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader()

    // Earth
    const earthDayTexture = textureLoader.load('/earth/day.jpg')
    earthDayTexture.colorSpace = THREE.SRGBColorSpace
    earthDayTexture.anisotropy = 8

    const earthSpecularCloudsTexture = textureLoader.load('/earth/specularClouds.jpg')
    earthSpecularCloudsTexture.anisotropy = 8

    const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
    const earthMaterial = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
      },
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earth)

    // Star field (space background)
    const starCount = 4000
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 40 + Math.random() * 20
      starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = r * Math.cos(phi)
    }
    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, sizeAttenuation: true })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Sun light
    const light = new THREE.PointLight(0xffffff, 2.0, 200)
    light.position.set(10, 5, 10)
    scene.add(light)
    scene.add(new THREE.AmbientLight(0x111122, 0.5))

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    }

    const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(12, 5, 4)
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
    renderer.setClearColor('#000011')

    const handleResize = () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(sizes.pixelRatio)
    }
    window.addEventListener('resize', handleResize)

    let elapsed = 0
    let lastTime = performance.now()
    let animationId: number

    const tick = () => {
      const now = performance.now()
      elapsed += (now - lastTime) * 0.001
      lastTime = now
      earth.rotation.y = elapsed * 0.1
      controls.update()
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      earthGeometry.dispose()
      earthMaterial.dispose()
      starGeometry.dispose()
      starMaterial.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100vw', height: '100vh' }}
    />
  )
}
