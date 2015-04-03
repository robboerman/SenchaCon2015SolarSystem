/**
 * @class Threext.model.Planet
 * @extends {Ext.data.Model}
 * A model class for Planets in a [Threext.view.Graph] view.
 */
Ext.define('Threext.model.Planet', {
	extend: 'Threext.model.Base',

	proxy: {
		type: 'ajax',
		url: 'api/planets.json',

		reader: {
			type: 'json'
		}
	},

	fields: [{
		"name": "name",
		"type": "string"
	}, {
		"name": "period",
		"type": "number"
	}, {
		"name": "eccentricity",
		"type": "number"
	}, {
		"name": "distance",
		"type": "number"
	}, {
		"name": "radius",
		"type": "number"
	}, {
		"name": "mass",
		"type": "number"
	}, {
		"name": "star",
		"type": "string"
	}, {
		"name": "color",
		"type": "number"
	}, {
		"name": "texture",
		"type": "string"
	}, {
		"name": "date",
		"type": "number"
	}, {
		"name": "rotation",
		"type": "number"
	}
	]
});
