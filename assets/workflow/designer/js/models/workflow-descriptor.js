define(['underscore', 'backbone', 'conf'], function(_, Backbone, conf) {
    var WorkflowDescriptor = Backbone.Model.extend({
        urlRoot: function(){
            return conf.restBaseUrl +  "v1/rest/workflow-descriptor/" + 1;

            //if (this.isNew()){
            //    return conf.restBaseUrl +  "v1/rest/workflow-descriptor";
            //} else {
            //    return conf.restBaseUrl +  "v1/rest/workflow-descriptor/" + this.id;
            //}
        },
        initialize: function() {

        }
    });
    return WorkflowDescriptor;
});