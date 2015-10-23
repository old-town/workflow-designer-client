define([
    'underscore',
    'backbone',
    'conf',
    'workflow-xml-to-json',
    'models/step-descriptor',
    'models/action-descriptor',
    'jquery',
    'jquery-xpath',
    'backbone-associations'
], function(_, Backbone, conf, Parser, Step, Action) {
    var WorkflowDescriptor = Backbone.AssociatedModel.extend({
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
            }
        ],
        urlRoot: function(){
            return conf.restBaseUrl +  "v1/rest/workflow-descriptor/" + 1;

            //if (this.isNew()){
            //    return conf.restBaseUrl +  "v1/rest/workflow-descriptor";
            //} else {
            //    return conf.restBaseUrl +  "v1/rest/workflow-descriptor/" + this.id;
            //}
        },
        parse: function(data) {
            var parser = new Parser();
            var parsedResult = parser.parse(data);
            return parsedResult;
        },
        fetch: function (options) {
            options = options || {};
            options.dataType = "xml";
            return Backbone.AssociatedModel.prototype.fetch.call(this, options);
        }
    });
    return WorkflowDescriptor;
});