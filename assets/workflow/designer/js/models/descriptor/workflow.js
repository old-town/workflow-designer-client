define([
    'underscore',
    'backbone',
    'conf',
    'service/workflow-xml-to-json',
    'models/descriptor/step',
    'models/descriptor/action',
    'models/descriptor/split',
    'models/descriptor/join',
    'jquery',
    'jquery-xpath',
    'backbone-associations'
], function(_, Backbone, conf, Parser, Step, Action, Split, Join) {
    return Backbone.AssociatedModel.extend({

        urlRootPattern: (function(conf, _){
            var template = conf.restBaseUrl + "v1/rest/workflow-manager/<%= workflowManager %>/workflow-name/<%= workflowName %>";
            return _.template(template);
        })(conf, _),

        defaults: {
            steps: [],
            'initial-actions': []
        },

        relations: [
            {
                type: Backbone.Many,
                key: 'steps',
                relatedModel: Step
            },
            {
                type: Backbone.Many,
                key: 'initial-actions',
                relatedModel: Action
            },
            {
                type: Backbone.Many,
                key: 'common-actions',
                relatedModel: Action
            },
            {
                type: Backbone.Many,
                key: 'splits',
                relatedModel: Split
            },
            {
                type: Backbone.Many,
                key: 'joins',
                relatedModel: Join
            }
        ],

        parse: function(data) {
            var parser = new Parser();
            return parser.parse(data);
        },

        fetch: function (options) {
            options = options || {};
            options.dataType = "xml";

            return Backbone.AssociatedModel.prototype.fetch.call(this, options);
        },

        loadWorkflow: function(workflowManager, workflowName, options) {
            options = options || {};

            options['url'] = this.urlRootPattern({
                workflowManager: workflowManager,
                workflowName: workflowName
            });

            this.fetch(options);
        }
    });
});
