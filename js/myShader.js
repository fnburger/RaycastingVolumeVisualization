class MyShader extends Shader{
    constructor(material, cameraPos, boundDim, width, height){
        super("my_vert", "my_frag");
        this.setUniform("cameraPos", cameraPos);
        this.setUniform("boundBox", boundDim);
        this.setUniform("volume", material);
        this.setUniform("resolution", new THREE.Vector2(width,height));
        this.setUniform("u_isoValue", 0.3);
    }
}
