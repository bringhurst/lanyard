uniform sampler2D uSamplerTileImage;
uniform sampler2D uSamplerAlphaMask;

uniform int showOutlines;

void main (void) {
    vec4 tileColor = texture2D(uSamplerTileImage, vec2(vTextureCoord0.s, vTextureCoord0.t));
    vec4 alphaColor = texture2D(uSamplerAlphaMask, vec2(vTextureCoord1.s, vTextureCoord1.t));

    if(showOutlines == 1) {
        // Black borders 50 percent.
        if(vTextureCoord0.s < 0.01 || vTextureCoord0.s > 0.99) {
            tileColor = mix(tileColor, vec4(0.0, 0.0, 0.0, tileColor.a), 0.5);
        }

        if(vTextureCoord0.t < 0.01 || vTextureCoord0.t > 0.99) {
            tileColor = mix(tileColor, vec4(0.0, 0.0, 0.0, tileColor.a), 0.5);
        }
    }

    gl_FragColor = vec4(tileColor.rgba);
}
