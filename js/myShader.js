class TestShader extends Shader{
    constructor(material, cameraPos, boundDim){
        super("my_vert", "my_frag");
        // setUniform
        this.setUniform("cameraPos", cameraPos);
        this.setUniform("boundBox", boundDim);
        this.setUniform("volume", material);
    }
}
