// @ts-nocheck
import { Canvas, useFrame, useLoader } from '@react-three/fiber/native';
import { useState, useRef, Suspense, useLayoutEffect,useEffect } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'expo-three';

import { Gyroscope } from 'expo-sensors';
import { useAnimatedSensor, SensorType } from 'react-native-reanimated';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {Button, InteractionManager, LogBox, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {
  Gesture,
  GestureHandlerRootView,
  PanGestureHandler,
  PinchGestureHandler,
  TapGestureHandler
} from "react-native-gesture-handler";
import {useTailwind} from "tailwind-rn";
import {navigateAndSimpleReset} from "./Root";


function Shoe(props) {
  let mesh = useRef();
  let TabImg ;
  let MTLScreen;
  let ObjScreen;

  if(props.type === "Nike Air".toLowerCase()){
    TabImg = [
      require('./assets/Airmax/textures/BaseColor.jpg'),
      require('./assets/Airmax/textures/Normal.jpg'),
      require('./assets/Airmax/textures/Roughness.png'),
    ]
    MTLScreen = require('./assets/Airmax/shoe.mtl')
    ObjScreen = require('./assets/Airmax/shoe.obj')
  }else if(props.type === "Sofa".toLowerCase()){

    TabImg = [
      require('./assets/Sofa/FabricWeaveWooly001_NRM_1K.jpg'),
      require('./assets/Sofa/FabricWeaveWooly001_ALPHAMASKED_1K.png'),
      require('./assets/Sofa/WoolNM.jpg'),
    ]
    MTLScreen = require('./assets/Sofa/sofa.mtl')
    ObjScreen = require('./assets/Sofa/sofa.obj')
  }else if(props.type === "Sofa K".toLowerCase()){

    TabImg = [
      require('./assets/80698d3d9f5b932c4c987cb12417f5c6/BasketballMoltenN221222/bump.jpg'),
      require('./assets/80698d3d9f5b932c4c987cb12417f5c6/BasketballMoltenN221222/mask.jpg'),
      require('./assets/80698d3d9f5b932c4c987cb12417f5c6/BasketballMoltenN221222/tex3.jpg'),
    ]
    MTLScreen = require('./assets/80698d3d9f5b932c4c987cb12417f5c6/BasketballMoltenN221222/BasketballMoltenN221222.mtl')
    ObjScreen = require('./assets/80698d3d9f5b932c4c987cb12417f5c6/BasketballMoltenN221222/BasketballMoltenN221222.obj')
  }

  const [base, normal, rough] = useLoader(TextureLoader, TabImg);

  const material = useLoader(MTLLoader, MTLScreen);

  const obj = useLoader(
    OBJLoader,
    ObjScreen,
    (loader) => {
      material?.preload();
      loader.setMaterials(material);
    }
  );



  useEffect(() => {
    clearCanvas()
  },[])
  const clearCanvas = () => {
    if (mesh.current != null && props?.clear === true) {
      mesh.current.clear();
    }
  };
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

export default function ScanneScreen() {
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
  const [interactionScreen, setInteractionScreen] = useState(false);
  const tapGesture = useRef();
  const panGesture = useRef();
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    InteractionManager.runAfterInteractions(() => {
      setInteractionScreen(true)
    })
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
                        <Shoe PanScrollAble={data} zoom={0} type={"Nike Air".toLowerCase()} />
                        <Shoe PanScrollAble={data} zoom={0} type={"Sofa".toLowerCase()} />
                    {
                      scannedVal?.name?.toLowerCase() && <Shoe PanScrollAble={data} zoom={zoom * 2} type={scannedVal?.name?.toLowerCase()} />
                    }
                  </Suspense>
                </Canvas>
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
                onPress={() => {
                  setScanned(false)
                  navigateAndSimpleReset("ScanneScreen")
                }}
                style={{height:40,width:'80%',backgroundColor:'#ea4141',justifyContent:'center',alignItems:'center',borderRadius:12,marginTop:5}}>
                <Text style={{color:'white',fontWeight:'bold'}}>Scanner un autre</Text>
              </TouchableOpacity>
            </View>
          </View> :
          <TouchableOpacity
            onPress={() => {
              setScanned(false)
              navigateAndSimpleReset("ScanneScreen")
            }}
            style={{alignSelf:'center',height:40,width:'80%',backgroundColor:'#ea4141',justifyContent:'center',alignItems:'center',borderRadius:12,marginTop:5}}>
            <Text style={{color:'white',fontWeight:'bold'}}>Scanner un autre</Text>
          </TouchableOpacity>
      }
    </GestureHandlerRootView>

  );
}
LogBox.ignoreAllLogs()
//https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=Nike%20Air%20Max%20Red&choe=UTF-8%22
