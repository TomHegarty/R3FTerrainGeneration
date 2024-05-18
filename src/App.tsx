import { Box, CameraControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Raycaster, Vector3 } from 'three';

import terrainFragmentShader from './shaders/terrainFragmentShader.glsl?raw';
import terrainVertexShader from './shaders/terrainVertexShader.glsl?raw';

const worldSize: number = 64;
const heightExaggeration: number = 1;
const seaLevel: number = 0.099;

const waterTexture = new TextureLoader().load('./waterTexture.jpg');

interface PlaneProps {
  heightMapCanvasRef: React.RefObject<HTMLCanvasElement>;
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
      <Trees numberOfTrees={25} terrainRef={terrainRef} terrainGeometryRef={terrainGeometryRef} />
    </>
  );
});

interface TreeProps {
  numberOfTrees: number;
  terrainRef: any;
  terrainGeometryRef: any;
}

const Trees = (props: TreeProps) => {
  const [treePositions, setTreePositions] = useState<any>([]);
  const direction = new Vector3(0, 0, -1);

  const getTreePosition = () => {
    const treePositions: any = [];
    for (let index = 0; index < props.numberOfTrees; index++) {
      const minimumTreeAltitude = 1.2;
      const maximumTreeAltitude = 1.3;
      const treeHeight = 0.05;
      const x = Math.random() * 5 - 2.5;
      const y = Math.random() * 5 - 2.5;
      const raycaster = new Raycaster();
      raycaster.set(new Vector3(x, y, 5), direction);
      const intersects = raycaster.intersectObjects([props.terrainRef.current]);

      if (
        intersects[0].point.z > minimumTreeAltitude &&
        intersects[0].point.z < maximumTreeAltitude
      ) {
        treePositions.push({ position: intersects[0].point, height: treeHeight });
      } else {
        index = index - 1;
      }
    }
    return treePositions;
  };

  //   useEffect(() => {
  //     // if (props.terrainRef.current) {
  //     //   setTreePositions(getTreePosition());
  //     // }
  //   }, [props.numberOfTrees, props.terrainRef.current, props.terrainGeometryRef.current]);

  return (
    <>
      {treePositions.map((treePosition: any) => {
        return (
          <>
            <mesh
              position={
                new Vector3(
                  treePosition.position.x,
                  treePosition.position.y,
                  treePosition.position.z + treePosition.height / 2,
                )
              }
              key={Math.random()}
            >
              <Box args={[0.02, 0.02, treePosition.height]} material-color="brown" />
            </mesh>
            <mesh
              position={
                new Vector3(
                  treePosition.position.x,
                  treePosition.position.y,
                  treePosition.position.z + treePosition.height / 2 + 0.03,
                )
              }
              key={Math.random()}
            >
              <Box args={[0.05, 0.05, 0.05]} material-color="darkGreen" />
            </mesh>
          </>
        );
      })}
    </>
  );
};

const App = () => {
  const heightMapCanvasRef = useRef(null);
  const [showHeightMap, setShowHeightMap] = useState(false);
  const terrainGeometryRef = useRef(null);
  const cameraRef = useRef(null);

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
        <PerspectiveCamera ref={cameraRef} />
        <CameraControls />
        <ambientLight intensity={Math.PI / 2} />
        <Plane heightMapCanvasRef={heightMapCanvasRef} ref={terrainGeometryRef} />
      </Canvas>
    </>
  );
};

export default App;
