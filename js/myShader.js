class MyShader extends Shader{
    constructor(material, cameraPos, boundDim, width, height){
        super("my_vert", "my_frag");
        this.setUniform("cameraPos", cameraPos);
        this.setUniform("boundBox", boundDim);
        this.setUniform("volume", material);
        this.setUniform("resolution", new THREE.Vector2(width,height));
        this.setUniform("isoValues", [0.2, 0.5, 0.9]); 
        this.setUniform("isoColors", [new THREE.Vector3(1.0, 1.0, 1.0), 
                                    new THREE.Vector3(0.0, 1.0, 0.6), 
                                    new THREE.Vector3(1.0, 0.0, 0.6)]); 
        this.setUniform("isoOpacities", [0.6, 0.8, 1.0]);

        //  we need a button to add and remove surfaces (max value is 3 because the array in the shader has size 3)
        this.setUniform("numIsosurfaces", 3); 
    }

    updateISO(isoValues) {
        this.setUniform("isoValues", isoValues);
    }

    updateColor(colors) {
        this.setUniform("isoColors", colors);
    }

    updateOpacity(opacities) {
        this.setUniform("isoOpacities", opacities);
    }
    
}
