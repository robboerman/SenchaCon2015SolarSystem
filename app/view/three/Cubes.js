/**
 * @class Threext.view.three.Cubes Threext.view.three.Cubes
 * @extends Threext.view.three.Panel
 * @xtype threeCubes
 */
Ext.define('Threext.view.three.Cubes', {
	extend: 'Threext.view.three.Panel',
	xtype: 'threeCubes',

	config: {
		controlsEnabled: true
	},

	cubes: [],

	/**
	 * @method constructor
	 * @param  {Object} config Configuration
	 * @return {Object}
	 */
	constructor: function(config) {
		window.cubes = this;


		this.callParent(arguments);

		// this.renderer.antia
	},

	initScene: function(scene) {
		this.callParent(arguments);

		var materials = _.sample([
			// [
			// 	new THREE.MeshPhongMaterial({
			// 		ambient: new THREE.Color(0x444444),
			// 		color: new THREE.Color(0xffffff),
			// 		specular: new THREE.Color(0xffffff),
			// 		shininess: 200
			// 	}),
			// 	new THREE.MeshLambertMaterial({
			// 		ambient: new THREE.Color(0x1a7ca5),
			// 		color: new THREE.Color(0x1a7ca5)
			// 	})
			// ], 

			// [
			// 	new THREE.MeshPhongMaterial({
			// 		ambient: new THREE.Color(0x000000),
			// 		color: new THREE.Color(0x000000),
			// 		shininess: 30
			// 	}),
			// 	new THREE.MeshPhongMaterial({
			// 		ambient: new THREE.Color(0x1a7ca5),
			// 		color: new THREE.Color(0x1a7ca5),
			// 		shininess: 90
			// 	})
			// ]

			[
				new THREE.ShaderMaterial({
					attributes: {},
					uniforms: THREE.UniformsUtils.merge([

						THREE.UniformsLib["common"],
						THREE.UniformsLib["bump"],
						THREE.UniformsLib["normalmap"],
						THREE.UniformsLib["fog"],
						THREE.UniformsLib["lights"],
						THREE.UniformsLib["shadowmap"], {
							"ambient": {
								type: "c",
								value: new THREE.Color(0xffffff)
							},
							"emissive": {
								type: "c",
								value: new THREE.Color(0x000000)
							},
							"specular": {
								type: "c",
								value: new THREE.Color(0xffffff)
							},
							"shininess": {
								type: "f",
								value: 30
							},
							"wrapRGB": {
								type: "v3",
								value: new THREE.Vector3(1, 1, 1)
							}
						}
					]),

					vertexShader: [

						"#define PHONG",

						"varying vec3 vViewPosition;",
						"varying vec3 vNormal;",

						THREE.ShaderChunk["map_pars_vertex"],
						THREE.ShaderChunk["lightmap_pars_vertex"],
						THREE.ShaderChunk["envmap_pars_vertex"],
						THREE.ShaderChunk["lights_phong_pars_vertex"],
						THREE.ShaderChunk["color_pars_vertex"],
						THREE.ShaderChunk["morphtarget_pars_vertex"],
						THREE.ShaderChunk["skinning_pars_vertex"],
						THREE.ShaderChunk["shadowmap_pars_vertex"],
						THREE.ShaderChunk["logdepthbuf_pars_vertex"],

						"void main() {",

						THREE.ShaderChunk["map_vertex"],
						THREE.ShaderChunk["lightmap_vertex"],
						THREE.ShaderChunk["color_vertex"],

						THREE.ShaderChunk["morphnormal_vertex"],
						THREE.ShaderChunk["skinbase_vertex"],
						THREE.ShaderChunk["skinnormal_vertex"],
						THREE.ShaderChunk["defaultnormal_vertex"],

						"	vNormal = normalize( transformedNormal );",

						THREE.ShaderChunk["morphtarget_vertex"],
						THREE.ShaderChunk["skinning_vertex"],
						THREE.ShaderChunk["default_vertex"],
						THREE.ShaderChunk["logdepthbuf_vertex"],

						"	vViewPosition = -mvPosition.xyz;",

						THREE.ShaderChunk["worldpos_vertex"],
						THREE.ShaderChunk["envmap_vertex"],
						THREE.ShaderChunk["lights_phong_vertex"],
						THREE.ShaderChunk["shadowmap_vertex"],

						"}"

					].join("\n"),

					fragmentShader: [

						"#define PHONG",

						"uniform vec3 diffuse;",
						"uniform float opacity;",

						"uniform vec3 ambient;",
						"uniform vec3 emissive;",
						"uniform vec3 specular;",
						"uniform float shininess;",

						THREE.ShaderChunk["color_pars_fragment"],
						THREE.ShaderChunk["map_pars_fragment"],
						THREE.ShaderChunk["alphamap_pars_fragment"],
						THREE.ShaderChunk["lightmap_pars_fragment"],
						THREE.ShaderChunk["envmap_pars_fragment"],
						THREE.ShaderChunk["fog_pars_fragment"],
						THREE.ShaderChunk["lights_phong_pars_fragment"],
						THREE.ShaderChunk["shadowmap_pars_fragment"],
						THREE.ShaderChunk["bumpmap_pars_fragment"],
						THREE.ShaderChunk["normalmap_pars_fragment"],
						THREE.ShaderChunk["specularmap_pars_fragment"],
						THREE.ShaderChunk["logdepthbuf_pars_fragment"],

						"void main() {",

						"	gl_FragColor = vec4( vec3( 1.0 ), opacity );",

						THREE.ShaderChunk["logdepthbuf_fragment"],
						THREE.ShaderChunk["map_fragment"],
						THREE.ShaderChunk["alphamap_fragment"],
						THREE.ShaderChunk["alphatest_fragment"],
						THREE.ShaderChunk["specularmap_fragment"],

						THREE.ShaderChunk["lights_phong_fragment"],

						THREE.ShaderChunk["lightmap_fragment"],
						THREE.ShaderChunk["color_fragment"],
						THREE.ShaderChunk["envmap_fragment"],
						THREE.ShaderChunk["shadowmap_fragment"],

						THREE.ShaderChunk["linear_to_gamma_fragment"],

						THREE.ShaderChunk["fog_fragment"],

						"}"

					].join("\n"),


					transparent: true,
					opacity: 0.5


				}),
				new THREE.MeshPhongMaterial({
					ambient: new THREE.Color(0x00B4FF),
					metal: true,
					color: new THREE.Color(0x1a7ca5),
					shininess: 90
				})
			]
		]);

		var bitmap = [

			[
				[1, 1, 1, 1, 0],
				[1, 0, 0, 0, 0],
				[1, 0, 1, 1, 1],
				[1, 0, 0, 0, 1],
				[1, 1, 1, 1, 1]
			],
			[
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0]
			],
			[
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0]
			],
			[
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0]
			],
			[
				[1, 0, 0, 0, 1],
				[1, 1, 0, 1, 1],
				[1, 0, 1, 0, 1],
				[1, 0, 0, 0, 1],
				[1, 0, 0, 0, 1]
			]
		];

		this.light.color = new THREE.Color(0x888888);
		// this.light.intensity = 0.2

		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 5; y++) {
				for (var z = 0; z < 5; z++) {
					var cubeGeo = new THREE.BoxGeometry(10, 10, 10);
					var cubeMat = materials[bitmap[z][y][x]];
					var cube = new THREE.Mesh(cubeGeo, cubeMat);
					cube.position.set(x * 12 - 30, y * 12 - 30, z * 12 - 30);
					scene.add(cube);

					this.cubes.push(cube);
				}
			}
		}

		// this.scene.rotation.set(0.1,0.124,0.8);

		this.cameraLight = new THREE.PointLight(0xffffff, 1, 800);

		this.cameraLight.castShadow = true;
		this.cameraLight.shadowMapWidth = 1024;
		this.cameraLight.shadowMapHeight = 1024;
		this.cameraLight.shadowCameraNear = 0;
		this.cameraLight.shadowCameraFar = 4000;
		this.cameraLight.shadowCameraFov = 10;
		this.cameraLight.target = this.getCube(3, 3, 3);

		this.cameraLight.shadowMapVisible = false;
		scene.add(this.cameraLight);

		this.centerLight = new THREE.PointLight(0xffffff, 1, 200);
		this.centerLight.position.set(0, 0, 0);

		this.centerLight.shadowMapVisible = false;

		scene.add(this.centerLight);

		this.camera.position.z = -600;
		this.scene.rotateZ(Math.PI);

		window.onkeypress = function(e) {
			if (e.keyCode === 32) {
				this.splode();
			}
		}.bind(this);

		this.start();
	},

	getCube: function(x, y, z) {
		return this.cubes[25 * z + 5 * y + x];
	},

	refresh: function() {

	},

	splode: function() {
		this.splodeTimer = 0;
		this.splodeMax = 60;

		console.log('splode');
		var sploder = function() {
			// console.log('tick');
			var t = ++this.splodeTimer;
			if (t >= this.splodeMax) {
				this.un("tick", sploder);
			}
			var factor;
			if (t <= this.splodeMax / 2) {
				factor = Math.sqrt(((1 + Math.pow(Math.E, (t / (this.splodeMax / -12))))));
			} else {
				factor = Math.sqrt(1 / (1 + Math.pow(Math.E, (this.splodeMax - t + 1) / (this.splodeMax / -12))));
			}

			this.scene.rotation.setFromVector3(this.scene.rotation.toVector3().multiplyScalar(factor));

			_.each(this.cubes, function(c) {
				c.position.multiplyScalar(factor);
			})
		}.bind(this);

		this.on("tick", sploder);
	},

	updateView: function(tiles, links) {
		var scene = this.getScene();
	},

	tick: function() {
		this.cameraLight.position.set(-1 * this.camera.position.x, -1 * this.camera.position.y,
			1 * this.camera.position.z
		);
		this.fireEvent("tick");
	}
});
