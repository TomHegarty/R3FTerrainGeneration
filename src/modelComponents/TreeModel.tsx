import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function TreeModel(props) {
  const { nodes, materials } = useGLTF('../lowpoly_tree.glb');
  return (
    <group {...props} dispose={null}>
      <group position={[24.5, 570.21, 0.018]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.piccolo_1_Chiome_0.geometry}
          material={materials.Chiome}
          position={[86.277, 156.819, 214.861]}
          rotation={[0, 1.36, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.piccolo_Chiome_0.geometry}
          material={materials.Chiome}
          position={[150.003, 32.553, -214.825]}
          rotation={[0, -1.484, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.piccolo2_Chiome_0.geometry}
          material={materials.Chiome}
          position={[-211.78, 318.25, -0.018]}
          rotation={[0, 0.699, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder_Legno_0.geometry}
          material={materials.Legno}
          position={[-24.5, -507.622, -0.018]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/lowpoly_tree.glb');
