uniform sampler2D uDayTexture;
uniform sampler2D uSpecularCloudsTexture;

varying vec2 vUv;

void main()
{
    vec3 color = texture(uDayTexture, vUv).rgb;

    float cloudsMix = smoothstep(0.5, 1.0, texture(uSpecularCloudsTexture, vUv).g);
    color = mix(color, vec3(1.0), cloudsMix);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
