import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

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

        this.scene.children = this.scene.children.filter((c) => !c.type.includes("Light"));

        var ambientLight = new THREE.AmbientLight("0x404040", .5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight("0xffffff", 3);
        directionalLight.castShadow = true;
        directionalLight.position.set(50, 50, 0);
        directionalLight.shadow.bias = -0.0005;
        this.scene.add(directionalLight);

        this.traverse(true)
    }

    changeToNight() {

        this.scene.children = this.scene.children.filter((c) => !c.type.includes("Light"));

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

        this.traverse(false)

    }

    traverse(isDay) {
        this.gltf.scene.traverse(function (child) {
            // console.log("HI")
            // console.log(child)
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
            if (!isDay) {
                if (child.name.includes("bottom")) {
                    // console.log(child);
                    child.traverse(function (c) {
                        if (c.name.includes('_')) {
                            let mat = new THREE.MeshStandardMaterial(color);
                            mat.color.setHex(Number(color));
                            mat.emissive.setHex(Number(color));
                            mat.emissiveIntensity = 5;
                            c.material = mat;
                            // console.log(c.material)
                        }
                    })
                }
                if (child.name === "japanese_lamp_full_scneobjcleanermaterialmergergles" ||
                    child.name === "japanese_lamp_full_scneobjcleanermaterialmergergles003") {
                    let c = child.children[0].children[1];
                    let mat = new THREE.MeshStandardMaterial(color);
                    mat.color.setHex(Number(color));
                    mat.emissive.setHex(Number(color));
                    mat.emissiveIntensity = 5;
                    c.material = mat;
                }
            }
            if (child.name === ("sky")) {
                if (isDay) {
                    child.material.color.setHex(0x84ECF4);
                    // console.log(child.material.color)
                    // new TWEEN.Tween(child.material)
                    // .to({color: 0x84ECF4}, 4000).start()
                } else {
                    child.material.color.setHex(0xFF8B58);
                    // new TWEEN.Tween(child.material)
                    // .to({color: 0xFF8B58}, 4000).start()
                }
                // child.material.flatShading = true;
                // let mat = new THREE.MeshPhongMaterial();
                // mat.shininess = 20;
                // // mat.color.setHex();
                // child.material = mat;
            }
    
            if (child.name === ("ground")) {
                console.log(child.material)
                child.material.roughness = 20;
                if (isDay) {
                    child.material.color.setHex(0x35A92B);
                } else {
                    child.material.color.setHex(0x278AA0);
                }
                // child.material.flatShading = true;
                // let mat = new THREE.MeshPhongMaterial();
                // mat.shininess = 20;
                // // mat.color.setHex();
                // child.material = mat;
            }
        }
        )				    //Position (z = front +, back-)
    }
    
}