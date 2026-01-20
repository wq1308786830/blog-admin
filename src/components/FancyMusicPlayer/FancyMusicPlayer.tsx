import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import MusicController from './MusicController';
import './FancyMusicPlayer.less';

function FancyMusicPlayer() {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const analyserRef = useRef<THREE.AudioAnalyser | null>(null);
  const uniformsRef = useRef<{
    tAudioData: { value: THREE.DataTexture };
  } | null>(null);
  const [musicController, setMusicController] = useState<React.ReactElement | null>(null);
  const requestRef = useRef<number | undefined>(undefined);

  const onResize = useCallback(() => {
    const container = document.getElementById('container');
    if (container && rendererRef.current) {
      rendererRef.current.setSize(container.offsetWidth, container.offsetHeight);
    }
  }, []);

  const renderThree = useCallback(() => {
    if (
      analyserRef.current &&
      uniformsRef.current &&
      rendererRef.current &&
      sceneRef.current &&
      cameraRef.current
    ) {
      analyserRef.current.getFrequencyData();
      uniformsRef.current.tAudioData.value.needsUpdate = true;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  const animate = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate);
    renderThree();
  }, [renderThree]);

  const renderController = useCallback(
    (audioObj: THREE.Audio, audioLoaderObj: THREE.AudioLoader) => {
      setMusicController(<MusicController audioObj={audioObj} audioLoaderObj={audioLoaderObj} />);
    },
    []
  );

  const init = useCallback(() => {
    const fftSize = 128;
    const cWidth = 412;
    const cHeight = 170;
    const container = document.getElementById('container');
    if (!container) return;

    container.style.width = `${cWidth}px`;
    container.style.height = `${cHeight}px`;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(cWidth, cHeight);
    renderer.setClearColor(0x202020);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();

    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);

    renderController(audio, audioLoader);

    const analyser = new THREE.AudioAnalyser(audio, fftSize);

    const dataTexture = new THREE.DataTexture(
      analyser.data,
      fftSize / 2,
      1,
      THREE.RedFormat
    );

    const uniforms = {
      tAudioData: {
        value: dataTexture,
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader:
        'varying vec2 vUv;void main() {vUv = uv;gl_Position = vec4( position, 0.52 );}',
      fragmentShader:
        'uniform sampler2D tAudioData;varying vec2 vUv;void main() ' +
        '{vec3 backgroundColor = vec3( 0.125, 0.125, 0.125 );' +
        'vec3 color = vec3( 1.0, 1.0, 0.8 );float f = texture2D(' +
        ' tAudioData, vec2( vUv.x, 0.0 ) ).r;float i = step( vUv.y, f ) * ' +
        'step( f - 0.0125, vUv.y );gl_FragColor = vec4( mix( ' +
        'backgroundColor, color, i ), 1.0 );}',
    });

    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    analyserRef.current = analyser;
    uniformsRef.current = uniforms;

    window.addEventListener('resize', onResize, false);
  }, [onResize, renderController]);

  useEffect(() => {
    init();
    animate();

    return () => {
      // Cleanup
      window.removeEventListener('resize', onResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [init, animate, onResize]);

  return (
    <div className="FancyMusicPlayer">
      <div id="container" />
      {musicController || null}
    </div>
  );
}

export default FancyMusicPlayer;
