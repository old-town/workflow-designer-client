define([
    'jquery',
    'underscore',
    'backbone',
    'views/app-view',
    'views/uml-state-machine-view'
], function ($, _, Backbone, AppView, UmlStateMachineView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '':        'root',
            'view-workflow/workflow-manager/:workflowManager/workflow-name/:workflowName': 'viewWorkflow'
        }
    });
    var initialize = function(initConfig){
        var config = _.isObject(initConfig) ? initConfig : {};
        var router = new AppRouter();
        var appViewConfig = _.isObject(config['appViewConfig']) ? config['appViewConfig'] : {};
        var appView = new AppView(appViewConfig);

        var routeRootHandler = function(){

            new AppView(appViewConfig);
        };

        var viewWorkflow = function(workflowManager, workflowName) {
            //$(appView.el).empty();

            //console.log($(appView.umlLayoutSelector, this.el));

            new UmlStateMachineView({
                el: $(appView.umlLayoutSelector, appView.el)
            });
        };
        router.on('route:root', routeRootHandler);
        router.on('route:viewWorkflow', viewWorkflow);


        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});