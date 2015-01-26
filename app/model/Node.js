/**
 * @class Threext.model.Link
 * @extends {Ext.data.Model}
 * A model class for Links in a [Threext.view.Graph] view.
 */
Ext.define('Threext.model.Node', {
	extend: 'Threext.model.Base',

	proxy: {
		type: 'ajax',
		url: 'api/delNodes.json',

		reader: {
			type: 'json'
		}
	},

	fields: [{
		name: 'id',
		type: 'number'
	}, {
		name: 'key',
		type: 'string'
	}, {
		name: 'category',
		type: 'string'
	}, {
		name: 'size',
		type: 'number'
	}]

});
