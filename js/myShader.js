class MyShader extends Shader{
    constructor(material, cameraPos, boundDim, width, height){
        super("my_vert", "my_frag");
        this.setUniform("cameraPos", cameraPos);
        this.setUniform("boundBox", boundDim);
        this.setUniform("volume", material);
        this.setUniform("resolution", new THREE.Vector2(width,height));
        this.setUniform("isoValues", [0.2, 0.5, 0.9]); // currently only the first iso value can be changed. we need two more sliders that can be added and removed.
        this.setUniform("isoColors", [new THREE.Vector3(1.0, 1.0, 1.0), 
                                    new THREE.Vector3(1.0, 1.0, 1.0), // this color will be changed using the second color picker
                                    new THREE.Vector3(1.0, 1.0, 1.0)]); // this color will be changed using the third color picker
        this.setUniform("isoOpacities", [1.0, 1.0, 1.0]);

        // default is that only the first iso surface is visible. we need a button to add and remove surfaces (max value is 3 because the array in the shader has size 3)
        this.setUniform("numIsosurfaces", 1); // each surface needs it own slider and color picker (and onChange function in vis1.js)
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
