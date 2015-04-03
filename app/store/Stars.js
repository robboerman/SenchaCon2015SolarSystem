Ext.define('Threext.store.Stars', {
	extend: 'Ext.data.Store',
	model: 'Threext.model.Star',
	storeId: 'Stars',
	remoteFilter: false,
	autoLoad: true
});
