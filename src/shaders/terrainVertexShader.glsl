
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUvs;


out vec3 out_localSpacePosition;

void main() {
  vec3 localSpacePosition = position;
  out_localSpacePosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(
    localSpacePosition, 1.0);
  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
}