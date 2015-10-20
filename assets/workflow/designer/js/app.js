define([
    'jquery',
    'underscore',
    'backbone',
    'views/AppView'
], function ($, _, Backbone, AppView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '':        'root',
            '__debug': 'debug'
        }
    });
    var initialize = function(initConfig){
        var config = _.isObject(initConfig) ? initConfig : {};
        var router = new AppRouter();

        var routeRootHandler = function(){
            var appViewConfig = _.isObject(config['appViewConfig']) ? config['appViewConfig'] : {};
            new AppView(appViewConfig);
        };
        router.on('route:root', routeRootHandler);


        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});