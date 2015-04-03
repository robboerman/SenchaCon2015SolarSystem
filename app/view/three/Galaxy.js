/**
 * @class Threext.view.three.Galaxy Threext.view.three.Galaxy
 * @extends Threext.view.three.Panel
 * @xtype threeGalaxy
 */
Ext.define('Threext.view.three.Galaxy', {
	extend: 'Threext.view.three.Panel',
	xtype: 'threeGalaxy',

	requires: [
		'Threext.store.Planets',
		'Threext.store.Stars'
	],

	config: {
		target: null,
		controlsEnabled: true,
		speed: 0.0
	},

	planetStore: null,
	starStore: null,

	time: 0.5,
	isLoaded: false,

	tileAttributes: {},
	tileUniforms: {},

	planetVShader: [
		"void main() {",
		"	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
		"	gl_Position = projectionMatrix * mvPosition;",
		"}"
	].join('\n'),

	planetFShader: [
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
		window.galaxy = window.g = this;

		var starStore = this.starStore = new Threext.store.Stars();
		var planetStore = this.planetStore = new Threext.store.Planets();
		starStore.on('load', function() {
			planetStore.load();
			planetStore.on('load', function() {
				this.initScene(this.getScene());
			}.bind(this));
		}.bind(this));

		return this.callParent(arguments);
	},

	lookAt: function(name, type) {
		type = type || 'planets';
		var target = this[type][name];
		this.setTarget(target);
		this.getControls().target = target.mesh.position;
	},

	createEnvironment: function() {
		// Textures

		var r = "api/textures/planets/cube/yaleStars/";
		var urls = [
			r + "front.png", r + "back.png",
			r + "top.png", r + "bottom.png",
			r + "right.png", r + "left.png",
		];

		var textureCube, cubeMesh;

		var cubeScene = this.cubeScene = new THREE.Scene(),
			cubeCamera = this.cubeCamera = new THREE.PerspectiveCamera(45, this.getSceneWidth() / this.getSceneHeight(), 1, 150000000 * 80);

		textureCube = THREE.ImageUtils.loadTextureCube(urls);
		textureCube.format = THREE.RGBFormat;
		textureCube.mapping = THREE.CubeReflectionMapping;

		var cubeShader = THREE.ShaderLib["cube"];
		var cubeMaterial = new THREE.ShaderMaterial({
			fragmentShader: cubeShader.fragmentShader,
			vertexShader: cubeShader.vertexShader,
			uniforms: cubeShader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
		});

		cubeMaterial.uniforms.tCube.value = textureCube;

		console.log(textureCube);
		this.renderer.autoClear = false;

		// Skybox
		cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(150000000 * 80, 150000000 * 80, 150000000 * 80), cubeMaterial);
		cubeScene.add(cubeMesh);
	},

	initScene: function(scene) {
		this.callParent(arguments);
		this.camera.far = 150000000;

		this.light.color = new THREE.Color(0xffffdd);
		this.renderer.setClearColor(0x000000);



		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 0;
		this.camera.rotation.x = 0;
		this.camera.rotation.y = 0;
		this.camera.rotation.z = 0;

		this.createEnvironment();
		var planetData = this.planetStore.getRange(),
			starData = this.starStore.getRange(),
			planets = {},
			stars = {};

		stars = _.reduce(starData, function(stars, star) {
			var material = new THREE.MeshLambertMaterial({
				color: new THREE.Color(0xffffdd),
				ambient: new THREE.Color(0xffffdd),
				side: THREE.FrontSide
			});

			if (star.data.texture) {
				material.map = THREE.ImageUtils.loadTexture('api/textures/' + star.data.texture);
			}

			var geo = new THREE.SphereGeometry(star.data.radius, 64, 64);
			var mesh = new THREE.Mesh(geo, material);
			stars[star.data.name] = {
				model: star,
				mesh: mesh
			};

			var light = new THREE.PointLight(0xffffff, 1, 150000000);
			light.position = mesh.position;

			// var textureFlare0 = THREE.ImageUtils.loadTexture("api/textures/lensflare/lensflare0.png");

			// var lensFlare = new THREE.LensFlare(textureFlare0, 700, 0.0, THREE.AdditiveBlending, new THREE.Color(0xffffff));
			// lensFlare.position.copy(mesh.position);

			scene.add(mesh);
			scene.add(light);
			// scene.add(lensFlare);
			return stars;

		}, stars);


		planets = _.reduce(planetData, function(planets, planet) {
			var material = new THREE.MeshLambertMaterial({
				ambient: 0x221100
			});
			if (planet.data.texture) {
				material.map = THREE.ImageUtils.loadTexture('api/textures/' + planet.data.texture);
			}

			var geo = new THREE.SphereGeometry(planet.data.radius, 32, 32);
			var mesh = new THREE.Mesh(geo, material);
			mesh.position.x = planet.data.distance / 100;

			// mesh.rotateX(Math.PI * 0.5);

			planets[planet.data.name] = {
				model: planet,
				mesh: mesh,
				star: stars[planet.data.star]
			};

			scene.add(mesh);

			return planets;

		}, planets);

		if (planetData[2]) {
			console.log(planetData[2])

			var texture = THREE.ImageUtils.loadTexture('api/textures/planets/SF_maps_blend.png');
			texture.repeat = new THREE.Vector2(1, 1);
			texture.needsUpdate = true;

			var material = new THREE.MeshLambertMaterial({
				ambient: 0x221100,
				map: texture,
				transparent: true,
				opacity: 0.5
			});

			var tl = [38.385009, -123.393766],
				br = [36.885803, -120.821010],
				x1 = tl[1] + 180,
				x2 = br[1] + 180,
				y1 = 90 - tl[0],
				y2 = 90 - br[0];

			var geo = new THREE.SphereGeometry(planetData[2].data.radius + 0.1, 32, 32, x1 * Math.PI/180, Math.abs(x1 - x2) * Math.PI/180,  y1 * Math.PI/180, Math.abs(y1 - y2 )* Math.PI/180);
			var mesh = new THREE.Mesh(geo, material);
			mesh.position.x = planetData[2].data.distance / 100;

			// mesh.rotateX(Math.PI * 0.5);

			planets.earth2 = {
				model: planetData[2],
				mesh: mesh,
				star: stars.Sun
			};
			scene.add(mesh);
		}

		this.planets = planets;
		this.stars = stars;

		window.setTimeout(function(){
			this.lookAt('Earth');
			this.camera.position.x = 1490546.2244161519;
			this.camera.position.y = 20661.84818385625;
			this.camera.position.z = 8647.123616755389;
			this.camera.rotation.x = -0.7336154334649239;
			this.camera.rotation.y = -0.43419466088636577;
			this.camera.rotation.z = -0.3299975322539685;
		}.bind(this), 10)

		this.start();
	},

	tick: function() {
		var planetData = this.planetStore.getRange();
		var stars = this.stars;
		var speed = this.getSpeed();
		var time = this.time = this.time + speed;

		_.each(this.planets, function(planet) {
			var star = stars[planet.model.data.star];
			var oldPos = planet.mesh.position.clone().multiplyScalar(-1);
			planet.mesh.rotateY(2 * Math.PI * speed * (1 / planet.model.data.rotation));

			planet.mesh.position.x = Math.cos(2 * Math.PI * time / planet.model.data.period) * planet.model.data.distance / 100;
			planet.mesh.position.y = Math.sin(2 * Math.PI * time / planet.model.data.period) * planet.model.data.distance / 100;
			planet.d = oldPos.add(planet.mesh.position);
		});

		var target = this.getTarget(),
			camera = this.getCamera();

		if (target && target.d) {
			camera.position.add(target.d);
		}

		if(target && target.mesh && target.mesh.position) {
			var camDist = this.camera.position.distanceTo(target.mesh.position) - target.model.data.radius;
			if(camDist < 0){
				this.camera.position.x = this.previousCameraPosition.x;
				this.camera.position.y = this.previousCameraPosition.y;
				this.camera.position.z = this.previousCameraPosition.z;
				console.log(this.camera.position, this.previousCameraPosition)
			}
			if(this.previousCameraPosition && (this.camera.position.x != this.previousCameraPosition.x || this.camera.position.y != this.previousCameraPosition.y || this.camera.position.z != this.previousCameraPosition.z)) {
				this.controls.zoomSpeed = Math.pow(Math.log(camDist)/(5*Math.log(10)),4);
				this.controls.rotateSpeed = Math.pow(Math.log(camDist)/(5*Math.log(10)),5);
				this.controls.update();
			}
		}

		this.cubeCamera.rotation.copy(camera.rotation);
		this.renderer.render(this.cubeScene, this.cubeCamera);
		this.previousCameraPosition = {
			x: this.camera.position.x,
			y: this.camera.position.y,
			z: this.camera.position.z
		};
	}
});
