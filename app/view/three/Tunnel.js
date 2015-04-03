/**
 * @class Threext.view.three.Tunnel Threext.view.three.Tunnel
 * @extends Threext.view.three.Panel
 * @xtype threeTunnel
 */
Ext.define('Threext.view.three.Tunnel', {
	extend: 'Threext.view.three.Panel',
	xtype: 'threeTunnel',

	config: {},


	curve: null,
	tube: null,
	tiles: [],

	tileAttributes: {},
	tileUniforms: {},

	tileVShader: [
		// THREE.ShaderChunk['lights_lambert_pars_vertex'],
		"void main() {",
		// THREE.ShaderChunk['lights_lambert_vertex'],
		"	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
		"	gl_Position = projectionMatrix * mvPosition;",
		"}"
	].join('\n'),

	tileFShader: [
		"void main() {",
		"	gl_FragColor = vec4(0,0,1, 1);",
		"}"
	].join('\n'),

	/**
	 * @method constructor
	 * @param  {Object} config Configuration
	 * @return {Object}
	 */
	constructor: function(config) {
		window.tunnel = this;

		// this.tileMaterial = new THREE.MeshLambertMaterial({
		// 	uniforms: this.tileUniforms,
		// 	attributes: this.tileAttributes,
		// 	vertexShader: this.tileVShader,
		// 	fragmentShader: this.tileFShader,
		// 	// vertexColors: THREE.FaceColors,
		// 	shading: THREE.NoShading,
		// 	color: new THREE.Color(0x222222),
		// 	// emissive: new THREE.Color(0xff0000),
		// 	// ambient: new THREE.Color(0x00ff00),
		// 	side: THREE.BackSide,
		// 	// wireframe: true
		// });

		this.curve = THREE.Curve.create(
			function(scale) { //custom curve constructor
				this.scale = (scale === undefined) ? 1 : scale;
			},

			function(t) { //getPoint: t is between 0-1
				var tx = Math.cos(10 * Math.PI * t),
					ty = Math.sin(10 * Math.PI * t),
					tz = 10 * Math.PI * t;

				return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
			}
		);

		var mats = [
		new THREE.MeshLambertMaterial({
			uniforms: this.tileUniforms,
			attributes: this.tileAttributes,
			shading: THREE.NoShading,
			color: new THREE.Color(0x0000ff),
			side: THREE.BackSide
		}),
		new THREE.MeshLambertMaterial({
			uniforms: this.tileUniforms,
			attributes: this.tileAttributes,
			shading: THREE.NoShading,
			color: new THREE.Color(0xff0000),
			side: THREE.BackSide
		}),
		new THREE.MeshLambertMaterial({
			uniforms: this.tileUniforms,
			attributes: this.tileAttributes,
			shading: THREE.NoShading,
			color: new THREE.Color(0xff9900),
			side: THREE.BackSide
		})
		];

		var faceMat = new THREE.MeshFaceMaterial( mats );

		this.path = new this.curve(500);
		this.tube = new THREE.TubeGeometry(this.path, 400, 80, 12, false);
		this.tunnel = new THREE.Mesh(this.tube, faceMat);

		_.each(this.tube.faces, function(face, i){
			if(Math.random() < 0.05) {console.log(face);}
			face.materialIndex = Math.random() < 0.8 ? 0 : Math.random() < 0.7 ? 1 : 2;
		});


		return this.callParent(arguments);
	},

	initScene: function(scene) {
		var camera = this.getCamera();
		camera.rotation.set(1.25, 0, 0);
		camera.position.set(0, 0, 0);

		this.cameraLight = new THREE.PointLight(0xff0000, 1, 2000);
		this.cameraLight.position.set(camera.position);

		this.chaseLight = new THREE.PointLight(0x00ff00, 1, 2000);
		this.blueLight = new THREE.PointLight(0x0000ff, 1, 2000);

		scene.add(this.cameraLight);
		scene.add(this.chaseLight);
		scene.add(this.blueLight);
		scene.add(this.tunnel);

		this.counter = 0;

		this.start();
	},

	refresh: function() {

	},

	updateView: function(tiles, links) {
		var scene = this.getScene();
	},

	tick: function() {
		this.counter = (this.counter + 0.0004) % 1
		var pos = this.path.getPointAt(this.counter);
		var next = this.path.getPointAt(this.counter + 0.02);
		var cam = this.path.getPointAt(this.counter + 0.01);
		var blue = this.path.getPointAt(this.counter + 0.04);
		this.camera.position.set(pos.x, pos.y, pos.z);
		this.cameraLight.position.set(next.x, next.y, next.z);
		this.chaseLight.position.set(cam.x, cam.y, cam.z);
		this.blueLight.position.set(blue.x, blue.y, blue.z);
		this.camera.lookAt(next);
	}
});
