import { useGLTF } from '@react-three/drei';

export function ShrubModel(props: any) {
  const { nodes, materials } = useGLTF('../lowpoly_shrub.glb');
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube_0.geometry}
          material={materials.WoodBround}
          scale={0.814}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/low_poly_shrub.glb');
