/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('Threext.Application', {
    extend: 'Ext.app.Application',
    
    name: 'Threext',

    stores: [
        'Nodes', 'Links'
    ],
    
    launch: function () {
        // TODO - Launch the application
    }
});
