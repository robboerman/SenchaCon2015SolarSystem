/**
 * @class Threext.view.three.Graph Threext.view.three.Graph
 * @extends Threext.view.three.Panel
 * @xtype threeGraph
 */
Ext.define('Threext.view.three.Graph', {
	extend: 'Threext.view.three.Panel',
	xtype: 'threeGraph',

	config: {
		nodeStore: null,
		linkStore: null
	},

	storesToLoad: ['Links', 'Nodes'],
	initializing: true,

	nodes: [],
	nodeElements: {},
	nodeAttributes: {
		size: {
			type: 'f',
			value: []
		},
		color: {
			type: "c",
			value: []
		}
	},
	nodeUniforms: {
		texture: {
			type: "t",
			value: THREE.ImageUtils.loadTexture("api/textures/sprites/disc.png")
		}
	},

	links: [],
	linkElements: {},
	linkAttributes: {
		alpha: {
			type: 'f',
			value: []
		}
	},
	linkUniforms: {},

	nodeVShader: [
		"attribute float size;",
		"varying vec3 vColor;",
		"void main() {",
		"	vColor = color;",
		"	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
		"	gl_PointSize = log2(size * size);",
		"	gl_Position = projectionMatrix * mvPosition;",
		"}"
	].join('\n'),

	nodeFShader: [
		"varying vec3 vColor;",
		"uniform sampler2D texture;",
		"void main() {",
		"	vec4 color = vec4(vColor, 1) * texture2D(texture, gl_PointCoord);",
		"	if (color.w < 0.5) discard;",
		"	gl_FragColor = color;",
		"}"
	].join('\n'),

	linkVShader: [
		"attribute float alpha;",
		"varying float vAlpha;",
		"void main() {",
		"	vAlpha = alpha;",
		"	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);",
		"	gl_Position = projectionMatrix * mvPosition;",
		"}"
	].join('\n'),

	linkFShader: [
		"varying float vAlpha;",
		"void main() {",
		"	gl_FragColor = vec4( 0.8,1,1, vAlpha );",
		"}"
	].join('\n'),


	getColor: d3.scale.category20(),

	/**
	 * @method constructor
	 * @param  {Object} config Configuration
	 * @return {Object}
	 */
	constructor: function(config) {
		Ext.applyIf(config || {}, {
			nodeStore: Ext.getStore('Nodes'),
			linkStore: Ext.getStore('Links')
		});

		window.g = this;


		this.nodeMaterial = new THREE.ShaderMaterial({
			uniforms: this.nodeUniforms,
			attributes: this.nodeAttributes,
			vertexShader: this.nodeVShader,
			fragmentShader: this.nodeFShader,
			vertexColors: THREE.VertexColors,
			transparent: true,
		}),

		this.linkMaterial = new THREE.ShaderMaterial({
			uniforms: this.linkUniforms,
			attributes: this.linkAttributes,
			vertexShader: this.linkVShader,
			fragmentShader: this.linkFShader,
			vertexColors: THREE.VertexColors,
			transparent: true,
		});

		return this.callParent(arguments);
	},

	initScene: function(scene) {
		this.callParent(arguments);

		var nodeStore = this.getNodeStore(),
			linkStore = this.getLinkStore();

		nodeStore.on('datachanged', this.storeLoad.bind(this));
		linkStore.on('datachanged', this.storeLoad.bind(this));
	},

	storeLoad: function(store, items, success, request) {
		_.remove(this.storesToLoad, function(d) {
			return d === store.getStoreId()
		});

		if (this.storesToLoad.length === 0) {
			this.initializing = false;

			this.refresh();
			this.start();
		}
	},

	refresh: function() {
		if (this.initializing) {
			return;
		}


		var oldIndex;
		if (this.nodes) {
			oldIndex = _.indexBy(this.nodes, 'id');
		} else {
			oldIndex = {}
		}
		var nodes = this.getNodeStore().getRange(),
			links = this.getLinkStore().getRange();

		nodes = _.map(nodes, function(n) {
			var o;
			if (o = oldIndex[n.id]) {
				return o;
			} else {
				n.x = Math.random();
				n.y = Math.random();
				n.z = Math.random();
			}
			return n;
		}.bind(this));

		var nodeIndex = _.indexBy(nodes, 'id');

		links = _.compact(_.map(links, function(l) {
			l.source = nodeIndex[l.data.source];
			l.target = nodeIndex[l.data.target];
			if (l.source && l.target) {
				return l;
			}
		}));

		this.nodes = nodes;
		this.links = links;

		this.updateView(nodes, links);
	},

	updateView: function(nodes, links) {
		var scene = this.getScene();

		this.addNodes(nodes, scene);
		this.addLinks(links, scene);

	},

	addLinks: function(links, scene) {
		if (this.line) {
			this.getScene().remove(this.line);
		}

		var material = this.linkMaterial;
		var geometry = new THREE.Geometry(),
			nodeElements = this.nodeElements,
			linkAttributes = this.linkAttributes;

		_.each(links, function(l, i) {
			linkAttributes.alpha.value[i] = l.data.strength;
			geometry.vertices.push(nodeElements[l.source.id], nodeElements[l.target.id]);
		});

		var line = this.line = new THREE.Line(geometry, material);
		scene.add(line);
	},

	addNodes: function(nodes, scene) {
		if (this.pointCloud) {
			this.getScene().remove(this.pointCloud);
		}

		var material = this.nodeMaterial;

		var geometry = new THREE.Geometry(),
			nodeElements = this.nodeElements;

		var nodeAttributes = this.nodeAttributes,
			getColor = this.getColor;

		_.each(nodes, function(n, i) {
			var p = nodeElements[n.id] || new THREE.Vector3(n.x, n.y, n.z);
			nodeElements[n.id] = p;
			geometry.vertices.push(p);
			nodeAttributes.size.value[i] = Number(n.data.size);
			nodeAttributes.color.value[i] = new THREE.Color(getColor(n.data.category));
		});

		var pointCloud = this.pointCloud = new THREE.PointCloud(geometry, material);
		pointCloud.sortParticles = true;

		scene.add(pointCloud);
	},

	tick: function() {

		var nodes = this.nodes,
			links = this.links,
			nodeElements = this.nodeElements;

		var center = new THREE.Vector3(0, 0, 0);

		_.each(nodes, function(i) {
			var p = nodeElements[i.id];
			p.velocity = new THREE.Vector3(0, 0, 0);
			_.each(nodes, function(j) {
				if (i.id === j.id) return;
				var q = nodeElements[j.id];
				p.velocity.add(new THREE.Vector3(
					p.x - q.x,
					p.y - q.y,
					p.z - q.z
				).multiplyScalar((i.data.category === j.data.category ? 1 : 1.3) / (p.distanceTo(q))));
			});

			p.multiplyScalar(0.8);
		});

		_.each(links, function(i) {
			var s = nodeElements[i.source.id];
			var t = nodeElements[i.target.id];
			var d = new THREE.Vector3(
				s.x - t.x,
				s.y - t.y,
				s.z - t.z
			).multiplyScalar(Math.min(0.0125, 0.000006 * i.data.strength * Math.log(s.distanceTo(t))));

			s.velocity.sub(d);
			t.velocity.add(d);
		});

		_.each(nodes, function(i) {
			var p = nodeElements[i.id];
			p.add(p.velocity);
			i.x = p.x;
			i.y = p.y;
			i.z = p.z;
		}.bind(this));

		this.pointCloud.geometry.verticesNeedUpdate = true;
		this.line.geometry.verticesNeedUpdate = true;

		this.nodeAttributes.size.needsUpdate = true;
		this.nodeAttributes.color.needsUpdate = true;
		this.linkAttributes.alpha.needsUpdate = true;
	}
});
