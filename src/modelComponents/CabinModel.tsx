import { useGLTF } from '@react-three/drei';

export function CabinModel(props: any) {
  const { nodes, materials } = useGLTF('/lowpoly_cabin.glb');
  return (
    <group {...props} dispose={null}>
      <group
        position={[6.337, 4.322, 13.239]}
        rotation={[-Math.PI, 0, 0]}
        scale={[-1.888, 2.1, 2.1]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_16.geometry}
          material={materials['Material.007']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_17.geometry}
          material={materials['Material.006']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_4.geometry}
        material={materials['Material.001']}
        position={[12.438, 0, 5.989]}
        rotation={[Math.PI / 2, -0.401, Math.PI]}
        scale={[1, 7.766, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_6.geometry}
        material={materials['Material.008']}
        position={[3.295, 9.501, 6.25]}
        scale={[12.557, 1.816, 8.731]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_8.geometry}
        material={materials['Material.004']}
        position={[-5.59, 3.858, 3.137]}
        rotation={[-Math.PI, 0, 0]}
        scale={[-2.1, 2.1, 2.1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_10.geometry}
        material={materials['Material.002']}
        position={[12.438, 0, 5.989]}
        rotation={[Math.PI / 2, -0.401, Math.PI]}
        scale={[1, 7.766, 1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_12.geometry}
        material={materials['Material.003']}
        position={[-5.59, 3.858, 3.137]}
        rotation={[-Math.PI, 0, 0]}
        scale={[-2.1, 2.1, 2.1]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_14.geometry}
        material={materials['Material.005']}
        position={[6.337, 4.322, 13.239]}
        rotation={[-Math.PI, 0, 0]}
        scale={[-2.1, 2.1, 2.1]}
      />
    </group>
  );
}

useGLTF.preload('/lowpoly_cabin.glb');
