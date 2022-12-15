import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/GLTFLoader.js';

// let origLanternColor;
// let origTallLanternColor;
/**
 * This class provides to functionality to animate sprite sheets.
 */
export class TimeHandler {

    gltf;
    scene;
    color = 0xFFB367;
    intensity = .3;

    constructor(gltf, scene) {

        this.gltf = gltf;
        this.scene = scene;

    }

    changeToDay() {

        this.scene.children = []
        //this.scene.children.filter((c) => !c.type.includes("Light"));

        var ambientLight = new THREE.AmbientLight("0x404040", .6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight("0xffffff", 3);
        directionalLight.castShadow = true;
        directionalLight.position.set(50, 50, 0);
        directionalLight.shadow.bias = -0.0005;
        this.scene.add(directionalLight);

        //this.traverse(true)
        this.loadScene(true);
    }

    changeToNight() {


        var color = 0xFFB367;
        var intensity = .3;


        this.scene.children = [];
        //this.scene.children.filter((c) => !c.type.includes("Light"));

        const light1 = new THREE.PointLight(color, intensity);
        light1.position.set(1.3, .7, -.4);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(color, intensity);
        light2.position.set(1.3, .7, .54);
        this.scene.add(light2);

        const light3 = new THREE.PointLight(color, intensity);
        light3.position.set(-.89, .2, .84);
        this.scene.add(light3);

        const light4 = new THREE.PointLight(color, intensity);
        light4.position.set(-.5, .2, 2.55);
        this.scene.add(light4);

        const light5 = new THREE.PointLight(color, intensity);
        light5.position.set(-.08, .2, -2.38);
        this.scene.add(light5);

        const light6 = new THREE.PointLight(color, intensity);
        light6.position.set(1.7, .2, -2.16);
        this.scene.add(light6);

        const light7 = new THREE.PointLight(color, intensity);
        light7.position.set(1.12, .2, -.98);
        this.scene.add(light7);

        const light8 = new THREE.PointLight(color, intensity);
        light8.position.set(.93, .35, 2.55);
        this.scene.add(light8);

        const light9 = new THREE.PointLight(color, intensity);
        light9.position.set(.72, .2, .925);
        this.scene.add(light9);

        const light10 = new THREE.PointLight(color, intensity);
        light10.position.set(-.55, .3, -.51);
        this.scene.add(light10);

        const light11 = new THREE.PointLight(color, intensity);
        light11.position.set(.13, .3, -1.35);
        this.scene.add(light11);

        //this.traverse(false)
        this.loadScene(false);

    }

    loadScene(isDay) {
        var color = 0xFFB367;
        var intensity = .3;

        var that = this;

        // glTf 2.0 Loader
        var loader = new GLTFLoader();
        loader.load('../media/scene.glb', function (ngltf) {
            ngltf.scene.scale.set(1 / 5, 1 / 5, 1 / 5);
            ngltf.scene.position.x = 0;				    //Position (x = right+ left-) 
            ngltf.scene.position.y = 0;				    //Position (y = up+, down-)
            ngltf.scene.position.z = 0;
            //console.log(gltf)
            ngltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
                if (!isDay) {
                    if (child.name.includes("bottom")) {
                        child.traverse(function (c) {
                            if (c.name.includes('_')) {
                                let mat = new THREE.MeshStandardMaterial(color);
                                mat.color.setHex(Number(color));
                                mat.emissive.setHex(Number(color));
                                mat.emissiveIntensity = 5;
                                c.material = mat;
                            }
                        })
                    }
                    if (child.name === "japanese_lamp_full_scneobjcleanermaterialmergergles" ||
                        child.name === "japanese_lamp_full_scneobjcleanermaterialmergergles003") {
                            console.log("GOT TO LAMP")
                        let c = child.children[0].children[1];
                        let mat = new THREE.MeshStandardMaterial(color);
                        mat.color.setHex(Number(color));
                        mat.emissive.setHex(Number(color));
                        mat.emissiveIntensity = 4;
                        c.material = mat;
                    }
                }
                if (child.name === ("sky")) {
                    if (!isDay) {
                        child.material.color.setHex(0x070A3F);
                    }
                }
                if (child.name === ("ground")) {
                    console.log("GROUND")
                    child.material.roughness = 15;
                    if (!isDay) {
                        child.material.color.setHex(0xE1EEFC);
                    }
                }
            }
            )				    //Position (z = front +, back-)

            console.log(that.gltf)
            console.log(ngltf)
            console.log("HI")
            that.gltf = [];
            console.log(ngltf)
            that.gltf = ngltf;
            //console.log(this.scene)
        });
    }

}