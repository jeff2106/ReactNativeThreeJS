// @ts-nocheck
import { Canvas, useFrame, useLoader } from '@react-three/fiber/native';
import { useState, useRef, Suspense, useLayoutEffect,useEffect } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'expo-three';
import { Gyroscope } from 'expo-sensors';
import { useAnimatedSensor, SensorType } from 'react-native-reanimated';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {Button, LogBox, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
  Gesture,
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  TapGestureHandler
} from "react-native-gesture-handler";
import {useTailwind} from "tailwind-rn";

function Box(props) {
  const [active, setActive] = useState(false);

  const mesh = useRef();

  useFrame((state, delta) => {
    if (active) {
      mesh.current.rotation.y += delta;
      mesh.current.rotation.x += delta;
    }
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
    >
      <boxGeometry />
      <meshStandardMaterial color={active ? 'green' : 'gray'} />
    </mesh>
  );
}

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

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedVal, setScannedVal] = useState("");
  const [data, setData] = useState({
    "absoluteX": 0,
    "absoluteY": 0,
    "handlerTag": 0,
    "numberOfPointers": 0,
    "state": 0,
    "target": 0,
    "translationX": 0,
    "translationY": 0,
    "velocityX": 0,
    "velocityY": 0,
    "x": 0,
    "y": 0
  });
  const [zoom, setZoom] = useState(4);
  const tapGesture = useRef();
  const panGesture = useRef();
  const tailwind = useTailwind()
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    let d = JSON.parse(data)
    if(Donnée.filter(r => r.toLowerCase()?.includes(d?.name?.toLowerCase()))?.length > 0){
      setScanned(true);
      setScannedVal(d)
      return
    }
    alert(`Nous n'avons pas ce articles : ${data}!`);
    setScanned(true)
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const Donnée = ["Nike Air","Sofa"]
  const loadObj = type => {
    switch (type) {
      case "Nike Air".toLowerCase():
        return <Canvas onCreated={(state) => {
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
      case "Sofa".toLowerCase():
        return <Canvas onCreated={(state) => {
          const _gl = state?.gl?.getContext()
          const pixelStorei = _gl?.pixelStorei?.bind(_gl)
          _gl.pixelStorei = function(...args)
          { const [parameter] = args
            switch(parameter) {
              case _gl?.UNPACK_FLIP_Y_WEBGL: return pixelStorei(...args) } } }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />

          <Suspense fallback={null}>
            <Sofa PanScrollAble={data} zoom={zoom * 3} />
          </Suspense>
        </Canvas>
      default:
        return
    }
  }
  return (
    <GestureHandlerRootView style={{flex:1,justifyContent:'center',alignContent:'center'}}>
      <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
      />
      {
        scanned && scannedVal?.name ?
      <View style={{flex:1,justifyContent:'center',alignContent:'center'}}>
        <PanGestureHandler  onGestureEvent={x => {
          //console.log(x.nativeEvent)
          setData(x.nativeEvent)
        }} ref={tapGesture} simultaneousHandlers={panGesture}>
          <PinchGestureHandler
            onHandlerStateChange={({ nativeEvent: event }) => {
            //console.log('tap state change', event.oldState, event.state);
            //console.log(event.scale);
            //setZoom(parseInt(event.oldState))
          }}
            onGestureEvent={data => {
              setZoom(data.nativeEvent.scale);
            }}
            ref={tapGesture}
            simultaneousHandlers={tapGesture}>
            {loadObj(scannedVal?.name?.toLowerCase())}
          </PinchGestureHandler>
        </PanGestureHandler>
          <View style={{position:'absolute',left:'5%',bottom:'3%',right:'5%',backgroundColor:'white',height:'26%',borderRadius:12,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
            <View style={[{flexDirection:'row',justifyContent:'space-between',width:'80%'}]}>
              <Text style={[{fontWeight:'bold'}]}>Nom</Text>
              <Text>{scannedVal?.name}</Text>
            </View>
            <View style={[{flexDirection:'row',justifyContent:'space-between',width:'80%'}]}>
              <Text style={[{fontWeight:'bold'}]}>Couleur</Text>
              <Text style={[]}>{scannedVal?.description?.color}</Text>
            </View>
            <View style={[{flexDirection:'row',justifyContent:'space-between',width:'80%'}]}>
              <Text style={[{fontWeight:'bold'}]}>Taille</Text>
              <Text style={[]}>{scannedVal?.description?.size}</Text>
            </View>
            <View style={[{flexDirection:'row',justifyContent:'space-between',width:'80%'}]}>
              <Text style={[{fontWeight:'bold'}]}>Montant</Text>
              <Text style={[]}>{scannedVal?.description?.amount}</Text>
            </View>
            <View style={[{flexDirection:'row',justifyContent:'space-between',width:'80%'}]}>
              <Text style={[{fontWeight:'bold'}]}>Devise</Text>
              <Text style={[]}>{scannedVal?.description?.devise}</Text>
            </View>
            <TouchableOpacity style={{height:40,width:'80%',backgroundColor:'#65e848',justifyContent:'center',alignItems:'center',borderRadius:12,marginTop:10}}>
              <Text style={{color:'white',fontWeight:'bold'}}>Acheter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setScanned(false)}
              style={{height:40,width:'80%',backgroundColor:'#ea4141',justifyContent:'center',alignItems:'center',borderRadius:12,marginTop:5}}>
              <Text style={{color:'white',fontWeight:'bold'}}>Scanner un autre</Text>
            </TouchableOpacity>
          </View>
      </View> :
          <TouchableOpacity
            onPress={() => setScanned(false)}
            style={{alignSelf:'center',height:40,width:'80%',backgroundColor:'#ea4141',justifyContent:'center',alignItems:'center',borderRadius:12,marginTop:5}}>
            <Text style={{color:'white',fontWeight:'bold'}}>Scanner un autre</Text>
          </TouchableOpacity>
      }
    </GestureHandlerRootView>

  );
}
LogBox.ignoreAllLogs()
//https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=Nike%20Air%20Max%20Red&choe=UTF-8%22
