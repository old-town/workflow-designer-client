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
                key: 'splits',
                relatedModel: Split
            },
            {
                type: Backbone.Many,
                key: 'joins',
                relatedModel: Join
            }
        ],
        urlRoot: function(){
            return conf.restBaseUrl +  "v1/rest/workflow-manager/manager_for_test/workflow-name/test?XDEBUG_SESSION=XDEBUG_ECLIPSE";

            //if (this.isNew()){
            //    return conf.restBaseUrl +  "v1/rest/workflow-descriptor";
            //} else {
            //    return conf.restBaseUrl +  "v1/rest/workflow-descriptor/" + this.id;
            //}
        },
        parse: function(data) {
            var parser = new Parser();
            return parser.parse(data);
        },
        fetch: function (options) {
            options = options || {};
            options.dataType = "xml";
            return Backbone.AssociatedModel.prototype.fetch.call(this, options);
        }
    });
});