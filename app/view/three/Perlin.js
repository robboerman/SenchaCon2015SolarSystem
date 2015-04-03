/**
 * @class Threext.view.three.Perlin Threext.view.three.Perlin
 * @extends Threext.view.three.Panel
 * @xtype threePerlin
 */
Ext.define('Threext.view.three.Perlin', {
	extend: 'Threext.view.three.Panel',
	xtype: 'threePerlin',

	config: {
		controlsEnabled: true
	},

	canvas: null,

	/**
	 * @method constructor
	 * @param  {Object} config Configuration
	 * @return {Object}
	 */
	constructor: function(config) {
		window.Perlin = this;

		this.callParent(arguments);
	},

	initScene: function(scene) {
		this.callParent(arguments);

		var geom = new THREE.BoxGeometry(750, 750, 750);
		var mat = new THREE.ShaderMaterial({
			uniforms: [],
			attributes: [

			],
			vertexShader: [
				"varying vec3 vViewPosition;",
				"varying vec3 vNormal;",
				"varying vec3 vPosition;",

				// "varying "
				"void main() {",
				THREE.ShaderChunk["default_vertex"],
				"	vPosition = position;",
				"}"
			].join('\n'),
			fragmentShader: [
				"varying vec3 vPosition;",
				window.getElementById('p2d').text,
				"void main() {",
				"	float rand1 = fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233))) * 43758.5453);",
				"	float rand2 = fract(sin(dot(vPosition.xy + vPosition.xy, vec2(12.8898, 78.333))) * 43758.8453);",
				"	float rand3 = fract(sin(dot(vPosition.xy + vPosition.xy + vPosition.xy + vPosition.xy, vec2(12.7898, 78.433))) * 43758.9453);",
				"	gl_FragColor = vec4(rand1, rand2, rand3, 1.0);",
				"}"
			].join('\n')
		});


		this.canvas = new THREE.Mesh(geom, mat);

		this.scene.add(this.canvas);

		this.start();
	},

	refresh: function() {},

	updateView: function(tiles, links) {
		var scene = this.getScene();
	},

	tick: function() {


		this.fireEvent("tick");
	}
});
