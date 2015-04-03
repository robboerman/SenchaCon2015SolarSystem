/**
 * @class Threext.model.Planet
 * @extends {Ext.data.Model}
 * A model class for Planets in a [Threext.view.Graph] view.
 */
Ext.define('Threext.model.Star', {
	extend: 'Threext.model.Base',

	proxy: {
		type: 'ajax',
		url: 'api/stars.json',

		reader: {
			type: 'json'
		}
	},

	fields: [{
		"name": "name",
		"type": "string"
	}, {
		"name": "radius",
		"type": "number"
	}, {
		"name": "mass",
		"type": "number"
	}, {
		"name": "texture",
		"type": "string"
	}]
});
