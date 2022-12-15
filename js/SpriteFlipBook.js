import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';
import { Scene } from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';


// https://github.com/tamani-coding/threejs-sprite-flipbook

/**
 * This class provides to functionality to animate sprite sheets.
 */
export class SpriteFlipbook {

    tilesHoriz = 0;
    tilesVert = 0;
    currentTile = 0 ;

    map;
    maxDisplayTime = 0;
    elapsedTime = 0;
    runningTileArrayIndex = 0;

    playSpriteIndices = []; 
    spriteFront;
    spriteBack;
    sprite;

    /**
     * 
     * @param spriteTexture A sprite sheet with sprite tiles
     * @param tilesHoriz Horizontal number of tiles
     * @param tilesVert Vertical number of tiles
     * @param scene Three.js scene which will contain the sprite
     */
    constructor(spriteTexture, tilesHoriz, tilesVert, scene) {
        this.tilesHoriz = tilesHoriz;
        this.tilesVert = tilesVert;

        this.map = new THREE.TextureLoader().load(spriteTexture,  (texture) => {
            // this.sprite.geometry.width = texture.map.image.width;
            // this.sprite.geometry.height = texture.map.image.height;
            // this.sprite.updateMatrix();
        });
        this.map.magFilter = THREE.NearestFilter;   // sharp pixel sprite
        this.map.repeat.set( 1/tilesHoriz, 1/tilesVert );
    
        this.update(0);
    
        const material = new THREE.MeshBasicMaterial({map: this.map, transparent: true})
        const geo = new THREE.PlaneBufferGeometry(.3, .5, 1, 1)
        console.log(geo)
    
        this.spriteFront = new THREE.Mesh(geo, material)
        this.spriteFront.scale.set(0.5, 0.5, 0.5)
        this.spriteFront.rotation.set(0, THREE.MathUtils.degToRad(90), 0)

        this.spriteBack = new THREE.Mesh(geo, material)
        this.spriteBack.scale.set(0.5, 0.5, -0.5)
        this.spriteBack.rotation.set(0, THREE.MathUtils.degToRad(90), 0)

        this.sprite = new THREE.Group();
            this.sprite.add( this.spriteFront );
            this.sprite.add( this.spriteBack );
        
        //scene.add(this.sprite)
    }

    loop(playSpriteIndices, totalDuration) {
        this.playSpriteIndices = playSpriteIndices;
        this.runningTileArrayIndex = 0;
        this.currentTile = playSpriteIndices[this.runningTileArrayIndex];
        this.maxDisplayTime = totalDuration / this.playSpriteIndices.length;
        this.elapsedTime = this.maxDisplayTime; // force to play new animation
    }

    setPosition (x, y, z) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        this.sprite.position.z = z;

        // this.sprite2.position.x = x;
        // this.sprite2.position.y = y;
        // this.sprite2.position.z = z - 0.01;
    }

    addPosition (x, y, z) {
        this.sprite.position.x += x;
        this.sprite.position.y += y;
        this.sprite.position.z += z;
    }

    getPosition() {
        return this.sprite.position;
    }

    getSprite() {
        return this.sprite;
    }

    getSprite2() {
        return this.sprite2;
    }

    update(delta) {
        if (this.sprite !== undefined) {
            this.elapsedTime += delta;
    
            if (this.maxDisplayTime > 0 && this.elapsedTime >= this.maxDisplayTime) {
                this.elapsedTime = 0;
                this.runningTileArrayIndex = (this.runningTileArrayIndex + 1) % this.playSpriteIndices.length;
                this.currentTile = this.playSpriteIndices[this.runningTileArrayIndex];
    
                const offsetX  = (this.currentTile % this.tilesHoriz) / this.tilesHoriz;
                const offsetY = (this.tilesVert - Math.floor(this.currentTile / this.tilesHoriz) -1 ) / this.tilesVert;
    
                this.map.offset.x = offsetX;
                this.map.offset.y = offsetY;
            }   
        }
    }
}