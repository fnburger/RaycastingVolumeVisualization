class MyShader extends Shader{
    constructor(material, cameraPos, boundDim, width, height, surfaces, samplingRate, opacities, colors, isos, ao){
        super("my_vert", "my_frag");
        this.setUniform("cameraPos", cameraPos);
        this.setUniform("boundBox", boundDim);
        this.setUniform("volume", material);
        this.setUniform("resolution", new THREE.Vector2(width,height));
        this.setUniform("isoValues", isos); 
        this.setUniform("isoColors", colors);
        this.setUniform("isoOpacities", opacities);
        this.setUniform("sampling_rate", samplingRate);
        //  we need a button to add and remove surfaces (max value is 3 because the array in the shader has size 3)
        this.setUniform("numIsosurfaces", surfaces); 
        this.setUniform("ao", ao);
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

    updateSampling(rate) {
        this.setUniform("sampling_rate", rate);
    }

    updateNumberSurfaces(num) {
        this.setUniform("numIsosurfaces", num);
    }

    updateAmbientOcclusion(ao) {
        this.setUniform("ao", ao);
    }
    
}
