define([], function() {

    var bootstrap = {};
    bootstrap.initRequireConfig = function(config){
        var configRequire = {
            paths: {
                'text': 'libs/require/text',
                'jquery': 'libs/jquery/jquery',
                'jquery-xpath': 'libs/jquery/jquery.xpath',
                'jquery-bootstrap': 'libs/bootstrap/bootstrap',
                'lodash': 'libs/lodash/lodash',
                'backbone': 'libs/backbone/backbone',
                'backbone-associations': 'libs/backbone/backbone-associations',
                'joint': 'libs/joint/joint',
                'conf': 'conf',
                'arbor': 'libs/arbor/arbor',
                'uuid': 'libs/uuid-js/uuid'
            },
            map: {
                '*': {
                    'underscore': 'lodash'
                }
            },
            config: {
                'conf': {
                    'restBaseUrl': ''
                }
            },
            shim: {
                'jquery': {
                    exports: 'jQuery'
                },
                'jquery-bootstrap': {
                    deps: ['jquery']
                },
                'jquery-xpath': {
                    deps: ['jquery']
                },
                'arbor': {
                    deps: ['jquery'],
                    exports: 'arbor'
                }
            }
        };
        if (config['baseUrl']) {
            configRequire['baseUrl'] = config['baseUrl'];
        }
        if (config['restBaseUrl']) {
            configRequire['config']['conf']['restBaseUrl'] = config['restBaseUrl'];
        }

        require.config(configRequire);
    };
    bootstrap.init = function(config) {
        var conf = typeof config === 'object' ? config : {};
        this.initRequireConfig(conf);
        require(['jquery', 'jquery-bootstrap', 'app'], function($, jqueryBootstrap, App){
            App.initialize({
                'appViewConfig': {
                    'el': $('.workflow-designer-layout')
                }
            });
        });

    };
    return bootstrap;
});
