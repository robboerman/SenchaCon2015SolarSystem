Ext.define('Threext.override.data.proxy.WebStorage', {
	override: 'Ext.data.proxy.WebStorage',


	/**
	 * Override to resolve an issue with the Loading of localStorage models.
	 * See bug report for details: http://www.sencha.com/forum/showthread.php?288478-5.0.1.1113-Bug-with-WebStorage&p=1077456#post1077456
	 * This should be fixed in 5.1 and so this override will be able to be removed on upgrade.
	 * See the "FIX" comment in the code below.
	 * @method
	 * @override
	 * @param operation
	 */
	read: function(operation) {
		var me = this,
			allRecords,
			records = [],
			success = true,
			Model = me.getModel(),
			validCount = 0,
			recordCreator = operation.getRecordCreator(),
			filters, sorters, limit, filterLen, valid, record, ids, length, data, id, i, j;


		operation.setStarted();


		if (me.isHierarchical) {
			records = me.getTreeData();
		} else {
			ids = me.getIds();
			length = ids.length;
			id = operation.getId();


			if (id) {
				data = me.getRecord(id);
				if (data !== null) {
					// FIX: pass in an empty object as the third parameter
					record = recordCreator ? recordCreator(data, Model, {}) : new Model(data);
				}


				if (record) {
					records.push(record);
				} else {
					success = false;
				}
			} else {
				sorters = operation.getSorters();
				filters = operation.getFilters();
				limit = operation.getLimit();
				allRecords = [];



				for (i = 0; i < length; i++) {
					data = me.getRecord(ids[i]);
					record = recordCreator ? recordCreator(data, Model) : new Model(data);
					allRecords.push(record);
				}


				if (sorters) {
					Ext.Array.sort(allRecords, Ext.util.Sorter.createComparator(sorters));
				}


				for (i = operation.getStart() || 0; i < length; i++) {
					record = allRecords[i];
					valid = true;


					if (filters) {
						for (j = 0, filterLen = filters.length; j < filterLen; j++) {
							valid = filters[j].filter(record);
						}
					}


					if (valid) {
						records.push(record);
						validCount++;
					}


					if (limit && validCount === limit) {
						break;
					}
				}
			}


		}


		if (success) {
			operation.setResultSet(new Ext.data.ResultSet({
				records: records,
				total: records.length,
				loaded: true
			}));
			operation.setSuccessful(true);
		} else {
			operation.setException('Unable to load records');
		}
	}


});
