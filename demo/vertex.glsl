attribute vec2 aTextureCoord[2];
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix[2];

varying vec2 vTextureCoord[2];

void main(void) {
    vTextureCoord[0] = uTextureMatrix[0] * aTextureCoord[0];
    vTextureCoord[1] = uTextureMatrix[0] * aTextureCoord[1];

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
