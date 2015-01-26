/**
 * @class Threext.three.Panel Threext.three.Panel
 * @extends Ext.panel.Panel
 * @xtype threePanel
 */
Ext.define('Threext.view.three.Panel', {
	extend: 'Ext.panel.Panel',
	xtype: 'threePanel',

	mixins: [],

	requires: [],

	config: {
		camera: null,
		scene: null,
		light: null,
		renderer: null,
		sceneWidth: 600,
		sceneHeight: 600,
		sceneDepth: 600,
		controls: null
	},

	session: true,
	firstrun: true,

	/**
	 * @method constructor
	 * @param  {Object} config Configuration
	 * @return {Object}
	 */
	constructor: function(config) {
		Ext.applyIf(config || {}, {
			camera: new THREE.PerspectiveCamera(45, this.getSceneWidth() / this.getSceneHeight(), 1, 6000),
			scene: new THREE.Scene(),
			light: new THREE.AmbientLight(0x404040),
			renderer: new THREE.WebGLRenderer({
				// antialias: true,
				// alpha: true
			})
		});

		this.callParent(arguments);
	},

	onResize: function(width, height) {
		console.log('resize', arguments);
		var camera = this.getCamera(),
			renderer = this.getRenderer();

		renderer.setSize(width, height);
		renderer.setClearColor(0x222222);

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

	},

	/**
	 * @method initComponent
	 * @inheritdoc
	 * @return {void}
	 */
	afterRender: function() {
		this.callParent(arguments);

		var scene = this.getScene(),
			camera = this.getCamera(),
			renderer = this.getRenderer(),
			dom = this.getContentTarget();

		renderer.setPixelRatio(window.devicePixelRatio);
		dom.appendChild(renderer.domElement);

		camera.position.z = this.getSceneDepth() * 2.5;

		var controls = new THREE.TrackballControls(camera);

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;
		controls.noZoom = false;
		controls.noPan = false;
		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;

		this.setControls(controls);

		this.initScene(scene);
	},

	initScene: function(scene) {
		var light = this.getLight();
		scene.add(light);
	},

	start: function() {
		this.animate();
	},

	animate: function() {

		this.renderScene();
		requestAnimationFrame(this.animate.bind(this));

	},

	renderScene: function() {
		var camera = this.getCamera(),
			renderer = this.getRenderer(),
			scene = this.getScene();
			
		this.tick();

		this.getControls().update();

		camera.lookAt(scene.position);
		// scene.rotateX(0.000005);
		// scene.rotateY(0.000005);
		// scene.rotateZ(0.0005 * (0.5 + Math.cos(this.counter/(190*Math.PI))));
		// scene.rotateZ(0.005 * -Math.sin(time/100))

		renderer.render(scene, camera);
	}

});
