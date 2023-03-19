// @ts-nocheck
import {useEffect, useState,useRef,useLayoutEffect} from "react";
import {BarCodeScanner} from "expo-barcode-scanner";
import {Text, View,Button,StyleSheet} from "react-native";
import * as PropTypes from "prop-types";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { TextureLoader } from 'expo-three';
import {
    Gesture,
    GestureHandlerRootView,
    PanGestureHandler,
    PinchGestureHandler,
    TapGestureHandler
} from "react-native-gesture-handler";
import {useFrame, useLoader} from "@react-three/fiber/native";


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

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
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
    const [zoom, setZoom] = useState(10);
    const tapGesture = useRef();
    const panGesture = useRef();

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return <View style={styles.container}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});
