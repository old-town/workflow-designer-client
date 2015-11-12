define([
    'jquery',
    'underscore',
    'joint'
], function ($, _, joint) {


    var Renderer = function (viewport) {
        var graph;
        var el = viewport;

        var particleSystem;

        var that = {
            init: function (system) {
                //начальная инициализация
                particleSystem = system;

                particleSystem.screenSize(el.width(), el.height());
                particleSystem.screenPadding(80);

            },
            getGraph: function () {
                if (graph) {
                    return graph;
                }

                var paperEl = $(el);

                graph = new joint.dia.Graph();

                var paper = new joint.dia.Paper({
                    el: paperEl,
                    width: el.width(),
                    height: el.height(),
                    gridSize: 1,
                    model: graph
                });

                return graph;

            },


            redraw: function () {
                //действия при перересовке
                //ctx.fillStyle = "white"; //белым цветом
                //ctx.fillRect(0, 0, canvas.width, canvas.height); //закрашиваем всю область



                particleSystem.eachNode( //теперь каждую вершину
                    _.bind(function (node, pt) {
                        switch (node.data.type) {
                            case 'initState':
                            {
                                this.redrawInitState(node, pt);
                                break;
                            }
                            case 'state':
                            {
                                this.redrawState(node, pt);
                                break;
                            }
                            case 'condition':
                            {
                                this.redrawCondition(node, pt);
                                break;
                            }
                        }

                    }, this)
                );



                particleSystem.eachEdge(_.bind(function (edge, pt1, pt2) {
                    var transitionId = 'transition_id_' + edge._id;
                    if (!this.getGraph().getCell(transitionId)) {
                        var transitionConfig = {
                            id: transitionId,
                            'attrs': {
                                '.connection': {
                                    'fill': 'none',
                                    'stroke-linejoin': 'round',
                                    'stroke-width': '2',
                                    'stroke': '#4b4a67'
                                }
                            }
                        };
                        var source = edge.source;
                        switch (source.data.type) {
                            case 'initState':
                            {

                                console.group('!!!!!!!!!!!!!!!!!!!!!');
                                console.log(this.getGraph().getCell('initState'));
                                console.groupEnd();

                                transitionConfig['source'] = {
                                    'id': this.getGraph().getCell('initState').id
                                };
                                break;
                            }
                            case 'state':
                            {
                                var stateId = source.data.model.get('id');
                                transitionConfig['source'] = {
                                    'id': this.getGraph().getCell(stateId).id
                                };
                                break;
                            }
                            case 'condition':
                            {
                                var conditionId = 'condition_id_' +  source._id;
                                transitionConfig['source'] = {
                                    'id': this.getGraph().getCell(conditionId).id
                                };
                                break;
                            }
                        }



                        var target = edge.target;
                        switch (target.data.type) {
                            case 'initState':
                            {
                                transitionConfig['target'] = {
                                    'id': this.getGraph().getCell('initState').id
                                };
                                break;
                            }
                            case 'state':
                            {

                                var stateId = target.data.model.get('id');
                                transitionConfig['target'] = {
                                    'id': this.getGraph().getCell(stateId).id
                                };
                                break;
                            }
                            case 'condition':
                            {
                                var conditionId = 'condition_id_' +  target._id;
                                transitionConfig['target'] = {
                                    'id': this.getGraph().getCell(conditionId).id
                                };
                                break;
                            }
                        }



                        console.log(transitionConfig);


                        var transition = new joint.shapes.uml.Transition(transitionConfig);
                        this.getGraph().addCell(transition);
                    }

                }, this));




            },

            redrawInitState: function (node, pt) {

                if (!this.getGraph().getCell('initState')) {
                    var uml = joint.shapes.uml;
                    this.getGraph().addCell(new uml.StartState({
                        id: 'initState',
                        position: {x: pt.x, y: pt.y},
                        size: {width: 30, height: 30},
                        attrs: {
                            'circle': {
                                fill: '#4b4a67',
                                stroke: 'none'
                            }
                        }
                    }));
                }
                this.getGraph().getCell('initState').position({x: pt.x, y: pt.y});
            },
            redrawState: function(node, pt) {
                var id = node.data.model.get('id');

                if (!this.getGraph().getCell(id)) {
                    var uml = joint.shapes.uml;
                    this.getGraph().addCell(new uml.State({
                        id: id,
                        position: {x: pt.x, y: pt.y},
                        size: { width: 80, height: 30 },
                        name:  node.data.model.get('name'),
                        //events: ["entry / create()","exit / kill()"],
                        attrs: {
                            '.uml-state-body': {
                                fill: 'rgba(48, 208, 198, 0.1)',
                                stroke: 'rgba(48, 208, 198, 0.5)',
                                'stroke-width': 1.5
                            },
                            '.uml-state-separator': {
                                stroke: 'rgba(48, 208, 198, 0.4)'
                            }
                        }
                    }));
                }
                this.getGraph().getCell(id).position({x: pt.x, y: pt.y});
            },
            redrawCondition: function(node, pt) {
                var id = 'condition_id_' +  node._id;

                if (!this.getGraph().getCell(id)) {
                    var erd = joint.shapes.erd;
                    this.getGraph().addCell(new erd.Relationship({
                        id: id,
                        position: {x: pt.x, y: pt.y},
                        attrs: {
                            text: {
                                fill: '#ffffff',
                                text: ' ',
                                'letter-spacing': 0,
                                style: {
                                    'text-shadow':
                                        '1px 0 1px'
                                }
                            },
                            '.outer': {
                                fill: 'white',
                                stroke: 'rgba(48, 208, 198, 0.5)'
                            }
                        }
                    }));
                }
                this.getGraph().getCell(id).position({x: pt.x, y: pt.y});
            }

        }
        return that;
    }

    return Renderer;
});
