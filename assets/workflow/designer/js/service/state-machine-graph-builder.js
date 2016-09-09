define([
    'underscore',
    'backbone',
    'dagre',
    'views/uml-state-machine-config'
], function(_, Backbone, dagre, conf) {
    var stateMachineGraphBuilder = function(options) {
        var o = _.isObject(options) ? options : {};
        _.extend(this, o);
        this.initialize.apply(this, arguments);
    };

    _.extend(stateMachineGraphBuilder.prototype, {
        graph: null,

        model: null,

        initialize: function(options){

        },

        getGraph: function() {
            if (this.graph) {
                return this.graph;
            }

            this.graph = new dagre.graphlib.Graph();
            this.graph.setGraph({
                nodesep: 120,
                ranksep: 60
            });
            this.graph.setDefaultEdgeLabel(function() { return {}; });

            return this.graph;
        },

        buildGraph: function() {
            this.getGraph().setNode(this.buildInitStateName(), _.extend({type: conf.initStateNodeType}, conf.defaultStartStateConfig.size));
            this.model.get('initial-actions').each(_.bind(this.buildNodeByAction, this, this.buildInitStateName()));
            dagre.layout(this.getGraph());

            return this.getGraph();
        },


        addNodeByParentStep: function(startNodeName, parentStep) {
            parentStep.get('actions').each(_.bind(this.buildNodeByAction, this, startNodeName));
        },

        addNodeByResult: function(startNodeName, result) {
            var stepId = result.get('step');
            if (stepId) {
                var stepNodeName = -1 == stepId ? startNodeName : this.buildStepName(stepId);
                if (!this.getGraph().hasNode(stepNodeName)) {
                    var step = this.model.get('steps').get(stepId);
                    this.getGraph().setNode(
                        stepNodeName,
                        _.extend({
                                type: conf.stepNodeType,
                                metadata: {
                                    model: step
                                }
                            },
                            conf.defaultStateConfig.size
                        )
                    );
                    this.addNodeByParentStep(stepNodeName, step);
                }
                this.getGraph().setEdge(startNodeName, stepNodeName);
            }

            var splitId = result.get('split');
            if (splitId) {
                var splitNodeName = this.buildSplitName(splitId);
                if (!this.getGraph().hasNode(splitNodeName)) {
                    var split = this.model.get('splits').get(splitId);
                    this.getGraph().setNode(
                        splitNodeName,
                        _.extend({
                                type: conf.splitNodeType,
                                metadata: {
                                    model: split
                                }
                            },
                            conf.defaultSplitConfig.size
                        )
                    );
                    split.get('unconditional-results').each(_.bind(this.addNodeByResult, this, splitNodeName));
                }
                this.getGraph().setEdge(startNodeName, splitNodeName);
            }

            var joinId = result.get('join');
            if (joinId) {
                var joinNodeName = this.buildJoinName(joinId);
                if (!this.getGraph().hasNode(joinNodeName)) {
                    var join = this.model.get('joins').get(joinId);
                    this.getGraph().setNode(
                        joinNodeName,
                        _.extend({
                                type: conf.joinNodeType,
                                metadata: {
                                    model: join
                                }
                            },
                            conf.defaultJoinConfig.size
                        )
                    );

                    this.addNodeByResult(joinNodeName, join.get('unconditional-result'));
                }

                this.getGraph().setEdge(startNodeName, joinNodeName);
            }



        },

        buildNodeByAction: function(startNodeName, action) {
            var conditionNodeName = this.buildConditionNode(action);
            var currentStartNodeName = startNodeName;
            if (conditionNodeName) {
                this.getGraph().setEdge(startNodeName, conditionNodeName);
                currentStartNodeName = conditionNodeName;
            }

            if (conditionNodeName) {
                action.get('results').each(_.bind(this.addNodeByResult, this, currentStartNodeName));
            }

            var unconditionalResult = action.get('unconditional-result');
            this.addNodeByResult(currentStartNodeName, unconditionalResult);
        },

        buildConditionNode: function (action) {
            var flag = false;
            var defaultValue;
            var conditionNodeName;
            action.get('results').each(_.bind(function(result){
                if (!defaultValue) {
                    defaultValue = {
                        step: result.get('step'),
                        split: result.get('split'),
                        join: result.get('join')

                    };
                } else {
                    if (!(defaultValue.step === result.get('step') && defaultValue.split === result.get('split') && defaultValue.join === result.get('join'))) {
                        flag = true;
                    }
                }
            }, this));

            if (!flag && defaultValue) {
                var unconditionalResult = action.get('unconditional-result');
                if (!(defaultValue.step === unconditionalResult.get('step') && defaultValue.split === unconditionalResult.get('split') && defaultValue.join === unconditionalResult.get('join'))) {
                    flag = true;
                }
            }

            if (flag) {
                conditionNodeName = this.buildConditionName(action);
                this.getGraph().setNode(conditionNodeName, _.extend({type: conf.conditionNodeType}, conf.defaultConditionConfig.size));
            }

            return conditionNodeName;
        },


        buildConditionName: function (action) {
            return 'condition_for_action_id_' + action.get('id');
        },

        buildInitStateName: function () {
            return conf.initStateName;
        },

        buildStepName: function (workflowStepId) {
            return 'step_id_' + workflowStepId;
        },

        buildSplitName: function (workflowSplitId) {
            return 'split_id_' + workflowSplitId;
        },

        buildJoinName: function (workflowJoinId) {
            return 'join_id_' + workflowJoinId;
        }
    });

    return stateMachineGraphBuilder;
});
