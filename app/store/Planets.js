Ext.define('Threext.store.Planets', {
	extend: 'Ext.data.Store',
	model: 'Threext.model.Planet',
	storeId: 'Planets',
	remoteFilter: false,
	autoLoad: false,
	filters: [
	{
		property: "star",
		value: "Sun"
	}]

});
