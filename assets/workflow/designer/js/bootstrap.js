require.config({
    paths: {
        jquery: 'libs/jquery/jquery',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        text: 'libs/require/text',
        jsPlumb: 'libs/jsPlumb/jsPlumb'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        jsPlumb: {
            deps: ['jquery'],
            exports: 'jsPlumb'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }

});


require(['jquery', 'app'], function($, App){
    App.initialize({
        'appViewConfig': {
            'el': $('.workflow-designer-layout')
        }
    });
});