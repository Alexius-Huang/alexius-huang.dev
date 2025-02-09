import * as THREE from 'three';

export default class TextureLoader {
    private loader = new THREE.TextureLoader();

    public load(asset: string) {
        const texture = this.loader.load(asset);
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        return texture;
    }
}
