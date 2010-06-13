uniform sampler2D tile_image;
uniform sampler2D alpha_mask;
uniform int showoutlines;
uniform float latitude;
uniform float longitude;
uniform float brightness;

void main (void) {
    vec4 tile_val = texture2D(tile_image, gl_TexCoord[0].st);
    vec4 alpha_val = texture2D(alpha_mask, gl_TexCoord[1].st);

    // Correct brightness for naip 2006 wa.
    brightness = -0.08;

    if(showoutlines == 1) {
        // Black borders 50 percent.
        if(gl_TexCoord[0].s < 0.01 || gl_TexCoord[0].s > 0.99) {
            tile_val = mix(tile_val, vec4(0.0, 0.0, 0.0, tile_val.a), 0.5);
        }

        if(gl_TexCoord[0].t < 0.01 || gl_TexCoord[0].t > 0.99) {
            tile_val = mix(tile_val, vec4(0.0, 0.0, 0.0, tile_val.a), 0.5);
        }
    }

    // Alpha mask - drop frags less than 0.01.
    if(alpha_val.a < 1.0) {
        discard;
    }

    // Drop really really dark pixels since the alpha mask is probably missing.
    if(tile_val.r == 0.0 && tile_val.g == 0.0 && tile_val.b == 0.0) {
        discard;
    }

    gl_FragColor = vec4 (tile_val.rgba + brightness);
}
