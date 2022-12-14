import * as THREE from 'three';
import { FloatType, ShaderMaterial, sRGBEncoding, Vector2, WebGLRenderTarget } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
import { UnrealBloomPass } from 'https://threejs.org/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'https://threejs.org/examples/jsm/postprocessing/BokehPass.js';
import { TexturePass } from 'three/addons/postprocessing/TexturePass.js';
import { basicShader } from '../shaders/basicShader.js';
import { GammaCorrectionShader } from '../shaders/gammaCorrectionShader.js';
import { brightSpotsShader } from '../shaders/brightSpotsShader.js';
import { horizontalBlurShader } from '../shaders/horizontalBlurShader.js';
import { verticalBlurShader } from '../shaders/verticalBlurShader.js';
import { finalBloomShader } from '../shaders/finalBloomShader.js';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';


class ShaderComposer{

    dofVals = {
      focus: 100000,
      aperture: 0.005,
      maxblur: 0.01,
      width: window.innerWidth,
      height: window.innerHeight
    };                    

    constructor(renderer, scene, camera){
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.gammaAttribute = 2.2;

        new TWEEN.Tween(this.dofVals)
        .to({focus: 2.5}, 4000).
        start()

        // Textures:
        this.originalSceneTexture = new WebGLRenderTarget( window.innerWidth, window.innerHeight, { 
          type: FloatType,
          encoding: sRGBEncoding,
          minFilter: THREE.LinearFilter, 
          magFilter: THREE.NearestFilter}
          );

        this.brightSpotsSceneTexture = new WebGLRenderTarget( window.innerWidth, window.innerHeight, { 
          type: FloatType,
          encoding: sRGBEncoding,
          minFilter: THREE.LinearFilter, 
          magFilter: THREE.NearestFilter}
          );


        // Composers:
        this.originalSceneComposer = new EffectComposer(this.renderer, this.originalSceneTexture);
        this.originalSceneComposer.encoding = sRGBEncoding;
        this.brightSpotsComposer = new EffectComposer(this.renderer, this.brightSpotsSceneTexture);
        this.brightSpotsComposer.encoding = sRGBEncoding;
        this.finalBloomComposer = new EffectComposer(this.renderer);
        
        this.runShaders();
    }



    runShaders() {
        
        // Passes:
        const renderPass = new RenderPass(this.scene, this.camera);
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader, 'tDiffuse');
        const brightnessPass = new ShaderPass(brightSpotsShader, 'tDiffuse');
        const horizontalBlurPass = new ShaderPass(horizontalBlurShader, 'image');
        const verticalBlurPass = new ShaderPass(verticalBlurShader, 'image');
        const bokehPass = new BokehPass(this.scene, this.camera, this.dofVals);
        

        
        const finalBloomMaterial = new THREE.ShaderMaterial({
            vertexShader: finalBloomShader.vertexShader,
            fragmentShader: finalBloomShader.fragmentShader,
            uniforms: {
              myTexture: {value: this.originalSceneTexture.texture},
              bloom: {value: this.brightSpotsSceneTexture.texture}
            }
          });
        const finalBloomPass = new ShaderPass(finalBloomMaterial);
        
        
        // Composers:
        
        this.originalSceneComposer.renderToScreen = false;
        this.originalSceneComposer.addPass(renderPass); // RenderPass renders bufferScene containing the scene
        //originalSceneComposer.addPass(gammaCorrectionPass); // Renders texture onto originalSceneTexture
        

        this.brightSpotsComposer.renderToScreen = false;
        this.brightSpotsComposer.addPass(renderPass); // Rerender the scene
        this.brightSpotsComposer.addPass(brightnessPass); // Pick out the bright spots
        this.brightSpotsComposer.addPass(horizontalBlurPass); // Horizontal Blur
        this.brightSpotsComposer.addPass(verticalBlurPass); // Vertical Blur
        this.brightSpotsComposer.addPass(horizontalBlurPass); // Horizontal Blur
        this.brightSpotsComposer.addPass(verticalBlurPass); // Vertical Blur
        //brightSpotsComposer.addPass(gammaCorrectionPass);
        // brightSpotsComposer.addPass(horizontalBlurPass); // Horizontal Blur
        // brightSpotsComposer.addPass(verticalBlurPass); // Vertical Blur
        
        
        
        this.finalBloomComposer.renderToScreen = true;
        this.finalBloomComposer.addPass(finalBloomPass);
        //finalBloomComposer.addPass(bokehPass);    
    }

    renderComposers() {
      this.originalSceneComposer.swapBuffers();
      this.originalSceneComposer.render();
      
      this.brightSpotsComposer.swapBuffers();
      this.brightSpotsComposer.render();

      this.finalBloomComposer.swapBuffers();
      this.finalBloomComposer.render();
    }

}



export {ShaderComposer}