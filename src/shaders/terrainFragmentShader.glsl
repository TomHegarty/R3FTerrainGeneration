in vec3 out_localSpacePosition; // Input variable from vertex shader

varying vec2 vUvs;
uniform sampler2D diffuse;

void main() {

    vec3 localSpacePosition = out_localSpacePosition;

    vec3 color = vec3(0.0);

    vec3 darkBlue = vec3(0.0, 0.0, 0.9);
    vec3 blue = vec3(0.0, 0.5, 1.0);
    vec3 green = vec3(0.0, 0.9, 0.0);
    vec3 darkGreen = vec3(0.0, 0.7, 0.0);
    vec3 yellow = vec3(1.0, 1.0, 0.0);
    vec3 grey = vec3(0.5, 0.5, 0.5);
    vec3 white = vec3(1.0, 1.0, 1.0);
    vec3 red = vec3(1.0, 0.0, 0.0);

    // Determine color based on displacement value
    if (localSpacePosition.z < 0.0) {
        color = red;
    } else if (localSpacePosition.z < 0.1) {
        // color = texture2D(diffuse, vUvs);
        color = blue;
    } else if (localSpacePosition.z < 0.11) {   
        color = mix(blue, white, localSpacePosition.z); 
    } else if (localSpacePosition.z < 0.15) {   
        color = yellow;
    } else if (localSpacePosition.z < 0.16) {   
        color = mix(yellow, green, localSpacePosition.z); 
    } else if (localSpacePosition.z < 0.2) {   
        color = green;
    } else if (localSpacePosition.z < 0.3) {   
        color = darkGreen;
    } else if (localSpacePosition.z < 0.35) {
        color = mix(darkGreen, grey, localSpacePosition.z); 
    } else if (localSpacePosition.z < 0.75) {
        color = grey;
    } else {
        color = white;
    }
  
    gl_FragColor = vec4(color  ,1.0);
    // gl_FragColor = texture2D(diffuse, vUvs);
}
