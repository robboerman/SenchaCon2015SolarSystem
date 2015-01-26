/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Threext.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.window.MessageBox'
    ],

    alias: 'controller.main',

    control: {
        '[reference=filters] button': {
            toggle: function(button) {
                var filterPanel = button.up('[reference=filters]'),
                    filterButtons = filterPanel.query('button[pressed]'),
                    filters = _.pluck(filterButtons, 'params'),
                    values = _.pluck(filters, 'value');
                    // view = button.up('graphControl');
                    var ns = g.getNodeStore();
                    ns.addFilter({property: 'category', value: values, operator: 'in'})
                    ns.applyFilters();
                    g.refresh();
            }
        }
    }
});
