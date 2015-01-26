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

    items: [{
        region: 'north',
        xtype: 'panel',
        layout: 'hbox',
        reference: 'filters',

        bodyPadding: '10 5',
        hidden: false,

        defaults: {
            xtype: 'button',
            enableToggle: true,
            width: '10%',
            cls: 'filter',
            pressed: false
        },

        items: [{
            params: {
                property: 'category',
                value: "Other"
            },
            text: "Other"
        }, {
            params: {
                property: 'category',
                value: "Medical preparations (organic)"
            },
            text: "Medical preparations (organic)"
        }, {
            params: {
                property: 'category',
                value: "Medical preparations (plant or microorganism origin)"
            },
            text: "Medical preparations (plant or microorganism origin)"
        }, {
            params: {
                property: 'category',
                value: "Medical preparations (human or animal origin)"
            },
            text: "Medical preparations (human or animal origin)"
        }, {
            params: {
                property: 'category',
                value: ""
            },
            text: "Undefined"
        }, {
            params: {
                property: 'category',
                value: "Organic chemistry (acylic)"
            },
            text: "Organic chemistry (acylic)"
        }, {
            params: {
                property: 'category',
                value: "Organic chemistry (heterocyclic)"
            },
            text: "Organic chemistry (heterocyclic)"
        }, {
            params: {
                property: 'category',
                value: "Organic chemistry (peptides)"
            },
            text: "Organic chemistry (peptides)"
        }, {
            params: {
                property: 'category',
                value: "Enzymology, Microbiology"
            },
            text: "Enzymology, Microbiology"
        }, {
            params: {
                property: 'category',
                value: "Chemical Analysis"
            },
            text: "Chemical Analysis"
        }]
    }, {
        region: 'center',
        xtype: 'threeGraph'
    }]
});
