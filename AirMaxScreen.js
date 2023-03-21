// @ts-nocheck
import { Canvas, useFrame, useLoader } from '@react-three/fiber/native';
import { useState, useRef, Suspense, useLayoutEffect,useEffect } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'expo-three';
import {Button, LogBox, StyleSheet, Text, TouchableOpacity, View} from "react-native";

function Shoe(props) {
  const [base, normal, rough] = useLoader(TextureLoader, [
    require('./assets/Airmax/textures/BaseColor.jpg'),
    require('./assets/Airmax/textures/Normal.jpg'),
    require('./assets/Airmax/textures/Roughness.png'),
  ]);

  const material = useLoader(MTLLoader, require('./assets/Airmax/shoe.mtl'));

  const obj = useLoader(
    OBJLoader,
    require('./assets/Airmax/shoe.obj'),
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    }
  );

  const mesh = useRef();

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = base;
        child.material.normalMap = normal;
        child.material.roughnessMap = rough;
      }
    });
  }, [obj]);

  useFrame((state, delta) => {
    let { x, y, z,translationX,translationY,velocityX,velocityY,target } = props.PanScrollAble;
    x = ~~(velocityX * 3) / 20000;
    y = ~~(velocityY * 3) / 20000;
    //mesh.current.position.x += x;
    //mesh.current.position.y += y;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });

  return (
    <mesh ref={mesh} rotation={[1, 0, 0]}>
      <primitive object={obj} scale={props.zoom} />
    </mesh>
  );
}
function Sofa(props) {
  const [base, normal, rough] = useLoader(TextureLoader, [
    require('./assets/Sofa/FabricWeaveWooly001_NRM_1K.jpg'),
    require('./assets/Sofa/FabricWeaveWooly001_ALPHAMASKED_1K.png'),
    require('./assets/Sofa/WoolNM.jpg'),
  ]);

  const material = useLoader(MTLLoader, require('./assets/Sofa/sofa.mtl'));

  const obj = useLoader(
    OBJLoader,
    require('./assets/Sofa/sofa.obj'),
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    }
  );

  const mesh = useRef();

  useLayoutEffect(() => {
    obj?.traverse((child) => {
      if (child instanceof THREE?.Mesh) {
        child.material.map = base;
        child.material.normalMap = normal;
        child.material.roughnessMap = rough;
      }
    });
  }, [obj]);

  useFrame((state, delta) => {
    let { x, y, z,translationX,translationY,velocityX,velocityY,target } = props.PanScrollAble;
    x = ~~(velocityX * 3) / 20000;
    y = ~~(velocityY * 3) / 20000;
    //mesh.current.position.x += x;
    //mesh.current.position.y += y;
    mesh.current.rotation.x += x;
    mesh.current.rotation.y += y;
  });

  return (
    <mesh ref={mesh} rotation={[1, 0, 0]}>
      <primitive object={obj} scale={props.zoom} />
    </mesh>
  );
}

export default function AirMaxScreen({data,zoom}) {

  return (
    <Canvas onCreated={(state) => {
      const _gl = state.gl.getContext()
      const pixelStorei = _gl.pixelStorei.bind(_gl)
      _gl.pixelStorei = function(...args)
      { const [parameter] = args
        switch(parameter) {
          case _gl.UNPACK_FLIP_Y_WEBGL: return pixelStorei(...args) } } }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Suspense fallback={null}>
        <Shoe PanScrollAble={data} zoom={zoom * 3} />
      </Suspense>
    </Canvas>

  );
}
LogBox.ignoreAllLogs()
//https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=Nike%20Air%20Max%20Red&choe=UTF-8%22
