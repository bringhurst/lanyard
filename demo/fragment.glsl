uniform sampler2D uSamplerTileImage;
uniform sampler2D uSamplerAlphaMask;

uniform int showOutlines;

void main (void) {
    vec4 tileColor = texture2D(uSamplerTileImage, vec2(vTextureCoord[0].s, vTextureCoord[0].t));
    vec4 alphaColor = texture2D(uSamplerAlphaMask, vec2(vTextureCoord[1].s, vTextureCoord[1].t));

    if(showOutlines == 1) {
        // Black borders 50 percent.
        if(vTextureCoord[0].s < 0.01 || vTextureCoord[0].s > 0.99) {
            tileColor = mix(tileColor, vec4(0.0, 0.0, 0.0, tileColor.a), 0.5);
        }

        if(vTextureCoord[0].t < 0.01 || vTextureCoord[0].t > 0.99) {
            tileColor = mix(tileColor, vec4(0.0, 0.0, 0.0, tileColor.a), 0.5);
        }
    }

    gl_FragColor = vec4(tileColor.rgba);
}
