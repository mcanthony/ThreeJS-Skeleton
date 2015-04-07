module.exports = function(THREE) {
  THREE.ZoomBlurShader = {

  	uniforms: {

  		"tDiffuse": { type: "t", value: null },
  		"opacity":  { type: "f", value: 1.0 },
      "uSize": { type: "v2", value: [200,200]},
      "strength": {type: "f", value: 0.40}

  	},

  	vertexShader: [

  		"varying vec2 vUv;",

  		"void main() {",

  			"vUv = uv;",
  			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

  		"}"

  	].join("\n"),

  	fragmentShader: [
      "uniform sampler2D tDiffuse;",
      "uniform float strength;",
      "uniform vec2 uSize;",
      "varying vec2 vUv;",

      "float random(vec3 scale, float seed) {",
      "  /* use the fragment position for a different seed per-pixel */",
      "  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);",
      "}",

      "void main() {",
      "    vec4 color = vec4(0.0);",
      "    float total = 0.0;",
      "    vec2 center = uSize * vec2(0.5);",
      "    vec2 toCenter = center - vUv * uSize;",

      "    /* randomize the lookup values to hide the fixed number of samples */",
      "    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);",

      "    for (float t = 0.0; t <= 40.0; t++) {",
      "        float percent = (t + offset) / 40.0;",
      "        float weight = 4.0 * (percent - percent * percent);",
      "        vec4 sample = texture2D(tDiffuse, vUv + toCenter * percent * strength / uSize);",

      "        /* switch to pre-multiplied alpha to correctly blur transparent images */",
      "        sample.rgb *= sample.a;",

      "        color += sample * weight;",
      "        total += weight;",
      "    }",

      "    gl_FragColor = color / total;",

      "    /* switch back from pre-multiplied alpa */",
      "    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;",
      "}"
    ].join("\n")
  };
}
