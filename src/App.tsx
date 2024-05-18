import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Raycaster, Vector3 } from 'three';

import terrainFragmentShader from './shaders/terrainFragmentShader.glsl?raw';
import terrainVertexShader from './shaders/terrainVertexShader.glsl?raw';

import { TreeModel } from './modelComponents/TreeModel';
import { ShrubModel } from './modelComponents/ShrubModel';
import { CabinModel } from './modelComponents/CabinModel';

const worldSize: number = 64;
const heightExaggeration: number = 1;
const seaLevel: number = 0.099;

const waterTexture = new TextureLoader().load('./waterTexture.jpg');

interface PlaneProps {
  heightMapCanvasRef: React.RefObject<HTMLCanvasElement>;
  setTerrainGeometryLoaded: any;
  terrainGeometryLoaded: boolean;
}

const Plane = forwardRef((props: PlaneProps, terrainGeometryRef: any) => {
  const terrainRef = useRef(null);

  useEffect(() => {
    if (props.heightMapCanvasRef && props.heightMapCanvasRef.current) {
      new TextureLoader().load('./mountianHeightmap2.jpg', function (texture: any) {
        if (props.heightMapCanvasRef.current && terrainGeometryRef.current) {
          props.heightMapCanvasRef.current.width = texture.image.width;
          props.heightMapCanvasRef.current.height = texture.image.height;
          const context = props.heightMapCanvasRef.current.getContext('2d');
          if (context) {
            context.drawImage(texture.image, 0, 0, texture.image.width, texture.image.height);

            const height = terrainGeometryRef.current.parameters.heightSegments + 1;
            const width = terrainGeometryRef.current.parameters.widthSegments + 1;
            const widthStep = texture.image.width / width;
            const heightStep = texture.image.height / height;

            // set geometry height based on the height map, not just the material vectors, this allows raycaster to work
            for (var h = 0; h < height; h++) {
              for (var w = 0; w < width; w++) {
                var imgData = context.getImageData(
                  Math.round(w * widthStep),
                  Math.round(h * heightStep),
                  1,
                  1,
                ).data;
                var displacementVal = imgData[0] / 255.0;
                displacementVal *= heightExaggeration;
                var idx = h * width + w;
                const displacementValWithSeaLevel =
                  displacementVal < seaLevel ? seaLevel : displacementVal;
                terrainGeometryRef.current.attributes.position.setZ(
                  idx,
                  displacementValWithSeaLevel,
                );
              }
            }
            terrainGeometryRef.current.attributes.position.needsUpdate = true;
            terrainGeometryRef.current.computeVertexNormals();
            props.setTerrainGeometryLoaded(true);
          }
        }
      });
    }
  }, [props.heightMapCanvasRef.current, terrainGeometryRef]);

  return (
    <>
      <mesh ref={terrainRef} position={[0, 0, 1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[5, 5, worldSize, worldSize]} ref={terrainGeometryRef} />
        <shaderMaterial
          fragmentShader={terrainFragmentShader}
          vertexShader={terrainVertexShader}
          uniforms={{ diffuse: waterTexture }}
        />
      </mesh>
      <Trees
        numberOfTrees={150}
        terrainRef={terrainRef}
        terrainGeometryRef={terrainGeometryRef}
        terrainGeometryLoaded={props.terrainGeometryLoaded}
        model="tree"
        maxAltitude={1.3}
        minAltitude={1.2}
      />
      <Trees
        numberOfTrees={100}
        terrainRef={terrainRef}
        terrainGeometryRef={terrainGeometryRef}
        terrainGeometryLoaded={props.terrainGeometryLoaded}
        model="shrub"
        maxAltitude={1.2}
        minAltitude={1.15}
      />
      <Trees
        numberOfTrees={20}
        terrainRef={terrainRef}
        terrainGeometryRef={terrainGeometryRef}
        terrainGeometryLoaded={props.terrainGeometryLoaded}
        model="cabin"
        maxAltitude={1.2}
        minAltitude={1.15}
      />
    </>
  );
});

interface TreeProps {
  numberOfTrees: number;
  terrainRef: any;
  terrainGeometryRef: any;
  terrainGeometryLoaded: boolean;
  model: string;
  maxAltitude: number;
  minAltitude: number;
}

const Trees = (props: TreeProps) => {
  const [treePositions, setTreePositions] = useState<any>([]);
  const direction = new Vector3(0, 0, -1);
  const treeSize = { max: 0.0001, min: 0.00005 };

  useMemo(() => {
    if (props.terrainRef.current && props.terrainGeometryLoaded) {
      const treePositions: any = [];
      for (let index = 0; index < props.numberOfTrees; index++) {
        const x = Math.random() * 5 - 2.5;
        const y = Math.random() * 5 - 2.5;
        const raycaster = new Raycaster();
        raycaster.set(new Vector3(x, y, 5), direction);
        const intersects = raycaster.intersectObjects([props.terrainRef.current]);

        if (
          intersects[0].point.z > props.minAltitude &&
          intersects[0].point.z < props.maxAltitude
        ) {
          treePositions.push(intersects[0].point);
        } else {
          index = index - 1;
        }
      }
      setTreePositions(treePositions);
      return treePositions;
    } else {
      console.log('terrain not loaded');
    }
  }, [
    props.numberOfTrees,
    props.terrainRef.current,
    props.terrainGeometryRef.current,
    props.terrainGeometryLoaded,
    props.maxAltitude,
    props.minAltitude,
  ]);

  return (
    <>
      {treePositions.map((treePosition: any) => {
        return (
          <instancedMesh
            key={`tree-mesh-${treePosition.x}-${treePosition.y}`}
            position={new Vector3(treePosition.x, treePosition.y, treePosition.z)}
          >
            {props.model === 'tree' ? (
              <TreeModel
                scale={Math.random() * (treeSize.max - treeSize.min) + treeSize.min}
                rotation={[Math.PI / 2, Math.PI * Math.random(), 0]}
              />
            ) : props.model === 'shrub' ? (
              <ShrubModel scale={0.05} rotation={[Math.PI / 2, Math.PI * Math.random(), 0]} />
            ) : (
              <CabinModel scale={0.002} rotation={[Math.PI / 2, Math.PI * Math.random(), 0]} />
            )}
          </instancedMesh>
        );
      })}
    </>
  );
};

const App = () => {
  const heightMapCanvasRef = useRef(null);
  const [showHeightMap, setShowHeightMap] = useState(false);
  const [terrainGeometryLoaded, setTerrainGeometryLoaded] = useState(false);
  const terrainGeometryRef = useRef(null);

  return (
    <>
      <button onClick={() => setShowHeightMap(!showHeightMap)}>show heightMap</button>
      <canvas
        ref={heightMapCanvasRef}
        style={{
          display: showHeightMap ? 'block' : 'none',
          position: 'absolute',
          border: 'solid black',
        }}
      />
      <Canvas>
        <Suspense fallback={null}>
          <CameraControls />
          <ambientLight intensity={Math.PI / 2} />
          <Plane
            heightMapCanvasRef={heightMapCanvasRef}
            ref={terrainGeometryRef}
            setTerrainGeometryLoaded={setTerrainGeometryLoaded}
            terrainGeometryLoaded={terrainGeometryLoaded}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
