/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Threext.view.main.Main', {
	extend: 'Ext.container.Container',
	requires: [
		'Threext.view.main.MainController',
		'Threext.view.main.MainModel',
		'Threext.view.three.Graph',
		'Threext.override.data.proxy.WebStorage'
	],

	xtype: 'app-main',
	session: true,

	controller: 'main',
	viewModel: {
		type: 'main'
	},

	layout: {
		type: 'border'
	},

	// items: [{
	//     region: 'north',
	//     xtype: 'panel',
	//     layout: 'hbox',
	//     reference: 'filters',

	//     bodyPadding: '10 5',
	//     hidden: false,

	//     defaults: {
	//         xtype: 'button',
	//         enableToggle: true,
	//         width: '10%',
	//         cls: 'filter',
	//         pressed: false
	//     },

	//     items: [{
	//         params: {
	//             property: 'category',
	//             value: "Other"
	//         },
	//         text: "Other"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: "Medical preparations (organic)"
	//         },
	//         text: "Medical preparations (organic)"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: "Medical preparations (plant or microorganism origin)"
	//         },
	//         text: "Medical preparations (plant or microorganism origin)"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: "Medical preparations (human or animal origin)"
	//         },
	//         text: "Medical preparations (human or animal origin)"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: ""
	//         },
	//         text: "Undefined"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: "Organic chemistry (acylic)"
	//         },
	//         text: "Organic chemistry (acylic)"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: "Organic chemistry (heterocyclic)"
	//         },
	//         text: "Organic chemistry (heterocyclic)"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: "Organic chemistry (peptides)"
	//         },
	//         text: "Organic chemistry (peptides)"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: "Enzymology, Microbiology"
	//         },
	//         text: "Enzymology, Microbiology"
	//     }, {
	//         params: {
	//             property: 'category',
	//             value: "Chemical Analysis"
	//         },
	//         text: "Chemical Analysis"
	//     }]
	// }, {
	//     region: 'center',
	//     xtype: 'threeGraph'
	// }]

	items: [{
		region: 'north',
		xtype: 'panel',
		layout: 'vbox',
		reference: 'controls',

		bodyPadding: '10 5',
		hidden: false,

		items: [{
			xtype: "panel",
			layout: 'hbox',
			width: '100%',
			defaults: {
				xtype: "button",
				flex: 1
			},
			items: [{
				text: "Sun",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Sun", "stars")
				}
			}, {
				text: "Mercury",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Mercury")
				}
			}, {
				text: "Venus",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Venus")
				}
			}, {
				text: "Earth",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Earth")
				}
			}, {
				text: "Mars",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Mars")
				}
			}, {
				text: "Jupiter",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Jupiter")
				}
			}, {
				text: "Saturn",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Saturn")
				}
			}, {
				text: "Uranus",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Uranus")
				}
			}, {
				text: "Neptune",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Neptune")
				}
			}, {
				text: "Pluto",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').lookAt("Pluto")
				}
			}]
		}, {
			xtype: "panel",
			layout: 'hbox',
			width: '100%',
			defaults: {
				xtype: "button",
				flex: 1
			},
			items: [{
				text: "Stop",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed = 0
				}
			}, {
				text: "Slow",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed = 0.0001
				}
			}, {
				text: "Normal",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed = 0.001
				}
			}, {
				text: "Fast",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed = 0.01
				}
			}, {
				text: "Ultra",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed = 0.1
				}
			}, {
				text: "Hyper",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed = 1
				}
			}, {
				text: "OMGIT'STOOFAST",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed = 10
				}
			}, {
				text: "Speed up",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed *= 1.1
				}
			}, {
				text: "Slow down",
				handler: function() {
					this.up("app-main").lookupReference('galaxy').speed *= 0.9
				}
			}]
		}]
	}, {
		reference: "galaxy",
		region: 'center',
		xtype: 'threeGalaxy'
	}]


	// items: [{
	// 	region: 'center',
	// 	xtype: 'threeCubes'
	// }]
	// 
	// items: [{
	// 	region: 'center',
	// 	xtype: 'threeTunnel'
	// }]
	// 
	// items: [{
	// 	region: 'center',
	// 	xtype: 'threePerlin'
	// }]
});
