/**
 * @class Threext.model.Link
 * @extends {Ext.data.Model}
 * A model class for Links in a [Threext.view.Graph] view.
 */
Ext.define('Threext.model.Link', {
	extend: 'Threext.model.Base',

	proxy: {
		type: 'ajax',
		url: 'api/delLinks.json',

		reader: {
			type: 'json'
		}
	},

	fields: [{
		name: 'source',
		type: 'number'
	}, {
		name: 'target',
		type: 'number'
	}, {
		name: 'strength',
		type: 'number'
	}]
});
