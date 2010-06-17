attribute vec2 aTextureCoord0;
attribute vec2 aTextureCoord1;
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix[2];

varying vec2 vTextureCoord0;
varying vec2 vTextureCoord1;

void main(void) {
    vTextureCoord0 = uTextureMatrix[0] * aTextureCoord0;
    vTextureCoord1 = uTextureMatrix[0] * aTextureCoord1;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
