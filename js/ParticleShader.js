import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';


/**
 * This class provides to functionality to animate sprite sheets.
 */
export class ParticleShader {

    particleMesh;

    constructor(scene) {  
        const tloader = new THREE.TextureLoader();
        const map = tloader.load("../images/spark.png")
        const alphaMap = tloader.load("../images/spark_alpha.jpg")

        const material = new THREE.PointsMaterial({
            size: .2,
            color: 0xFFFFFF,
            map: map,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        //const particlesGeometry = new THREE.BufferGeometry;
        var geometry = new THREE.BufferGeometry;
        //new THREE.SphereBufferGeometry( 100, 16, 8 );

        // add an attribute
        var numVertices = 3500;
        var alphas = new Float32Array( numVertices * 1 ); // 1 values per vertex

        for( var i = 0; i < numVertices; i ++ ) {
            // set alpha randomly
            alphas[ i ] = Math.random();
        }

        //https://jsfiddle.net/7htvbwL6/
        //https://stackoverflow.com/questions/59448702/map-image-as-texture-to-plane-in-a-custom-shader-in-three-js

        geometry.setAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

        // uniforms
        var uniforms = {
            //color: { value: new THREE.Color( 0xff3433 ) }, this line does not change color
        };

        const particlesCnt = numVertices;
        const posArray = new Float32Array(particlesCnt * 3)
        for (let i = 0; i < particlesCnt * 3; i = i + 3) {
            // x, y, z
            posArray[i] = (Math.random() - 0.5) * 10
            posArray[i + 1] = (Math.random() - 0.5) * 10
            posArray[i + 2] = (Math.random() - 0.5) * 20
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        this.particleMesh = new THREE.Points(geometry, material)

        scene.add(this.particleMesh)
    }

    getParticleMesh() {
        return this.particleMesh;
    }

    particleAnimate() {
        if (this.particleMesh !== undefined) {
            this.particleMesh.rotation.x += 0.0002;

            var alphas = this.particleMesh.geometry.attributes.alpha;
            var count = alphas.count;

            for( var i = 0; i < count; i ++ ) {
            
                // dynamically change alphas
                alphas.array[ i ] *= 0.995;
                
                if ( alphas.array[ i ] < 0.01 ) { 
                    alphas.array[ i ] = 1.0;
                }
                
            }

            alphas.needsUpdate = true; // important!
        }
    }

    getVert() {
        let shader = `

        uniform float size;
        uniform float scale;
        #include <common>
        #include <color_pars_vertex>
        #include <fog_pars_vertex>
        #include <morphtarget_pars_vertex>
        #include <logdepthbuf_pars_vertex>
        #include <clipping_planes_pars_vertex>
        
        attribute float alpha;
        varying float vAlpha;
        
        void main() {
        
            vAlpha = alpha;
        
            #include <color_vertex>
            #include <begin_vertex>
            #include <morphtarget_vertex>
            #include <project_vertex>
            gl_PointSize = size;
            #ifdef USE_SIZEATTENUATION
                bool isPerspective = isPerspectiveMatrix( projectionMatrix );
                if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
            #endif
            #include <logdepthbuf_vertex>
            #include <clipping_planes_vertex>
            #include <worldpos_vertex>
            #include <fog_vertex>
        }
        `

        return shader
    }

    getFrag() {

        let shader = `
        uniform vec3 diffuse;
        uniform float opacity;
        #include <common>
        #include <color_pars_fragment>
        #include <map_particle_pars_fragment>
        #include <fog_pars_fragment>
        #include <logdepthbuf_pars_fragment>
        #include <clipping_planes_pars_fragment>
        
        varying float vAlpha;
        
        void main() {
            #include <clipping_planes_fragment>
            vec3 outgoingLight = vec3( 0.0 );
            vec4 diffuseColor = vec4( diffuse, opacity );
            #include <logdepthbuf_fragment>
            #include <map_particle_fragment>
            #include <color_fragment>
            #include <alphatest_fragment>
            outgoingLight = diffuseColor.rgb;
            gl_FragColor = vec4( outgoingLight, diffuseColor.a );
            #include <tonemapping_fragment>
            #include <encodings_fragment>
            #include <fog_fragment>
            #include <premultiplied_alpha_fragment>
        
            gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a * vAlpha);
        
        }
        `

        return shader
    }
}