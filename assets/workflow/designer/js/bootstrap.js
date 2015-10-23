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
                'workflow-xml-to-json': 'service/workflow-xml-to-json'
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
                'jquery-bootstrap': {
                    deps: ["jquery"]
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
