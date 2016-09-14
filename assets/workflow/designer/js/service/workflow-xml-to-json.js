define(['underscore', 'jquery','jquery-xpath'], function(_, $) {
    var Parser = function(attributes, options) {

        this.initialize.apply(this, arguments);
    };
    _.extend(Parser.prototype, {
        /**
         * Инициализация парсера
         */
        initialize: function(){},
        /**
         * Парсинг xml workflow
         *
         * @param data
         * @returns {{steps: Array}}
         */
        parse: function(data){
            var parsed = {
                'steps': [],
                'initial-actions': [],
                'common-actions': [],
                'splits': [],
                'joins': []
            };
            var steps = this.parseSteps(data);
            if (!steps) {
                throw new Error('steps not exists');

            }
            parsed['steps'] = steps;


            var actions = this.parseInitialActions(data);
            if (!actions) {
                throw new Error('initial actions not exists');
            }
            parsed['initial-actions'] = actions;
            parsed['common-actions'] = this.parseCommonActions(data);

            parsed['splits'] = this.parseSplits(data);
            parsed['joins'] = this.parseJoins(data);

            console.group('workflow-json');
            console.log(parsed);
            console.groupEnd();
            return parsed;
        },
        parseSplits: function(data) {
            var splits = [];
            $(data).xpath('.//splits/split').each(_.bind(function(index, splitEl){
                var split = this.parseSplit(splitEl);
                splits.push(split);
            }, this));
            return splits;
        },
        parseJoins: function(data) {
            var joins = [];
            $(data).xpath('.//joins/join').each(_.bind(function(index, joinEl){
                var join = this.parseJoin(joinEl);
                joins.push(join);
            }, this));
            return joins;
        },

        parseJoin: function(joinEl) {
            var join = {
                'unconditional-result': null,
                'id': null
            };

            var id = $(joinEl).attr('id');
            if (!id) {
                throw new Error('attribute id not exists');
            }
            join['id'] = id;

            var unconditionalResults = this.parseUnconditionalResults(joinEl);
            if (1 !== unconditionalResults.length) {
                throw new Error('unconditional result not valid');
            }
            join['unconditional-result'] = unconditionalResults[0];

            return join;
        },

        parseSplit: function(splitEl) {
            var split = {
                'unconditional-results': [],
                'id': null
            };

            var id = $(splitEl).attr('id');
            if (!id) {
                throw new Error('attribute id not exists');
            }
            split['id'] = id;

            var unconditionalResults = this.parseUnconditionalResults(splitEl);
            if (0 === unconditionalResults.length) {
                throw new Error('unconditional result not exists');
            }
            split['unconditional-results'] = unconditionalResults;

            return split;
        },
        /**
         *
         * @param stepEl
         * @returns {Array}
         */
        parseInitialActions: function(stepEl) {
            var actions = [];
            $(stepEl).xpath('.//initial-actions/action').each(_.bind(function(actionIndex, actionEl){
                var action = this.parseDefaultAction(actionEl);
                actions.push(action);
            }, this));
            if (0 === actions.length) {
                actions = false;
            }

            return actions;
        },

        parseCommonActions: function(stepEl) {
            var actions = [];
            $(stepEl).xpath('.//common-actions/action').each(_.bind(function(actionIndex, actionEl){
                var action = this.parseDefaultAction(actionEl);
                actions.push(action);
            }, this));

            return actions;
        },


        /**
         * Парсинг шагов workflow
         *
         * @param data
         * @returns {Array}
         */
        parseSteps: function(data) {
            var steps = [];
            $(data).xpath('//steps/step').each(_.bind(function(stepIndex, stepEl){
                var step = {
                    'id': undefined,
                    'name': undefined,
                    'actions': {

                    }

                };
                var id = $(stepEl).attr('id');
                if (!id) {
                    throw new Error('attribute id not exists');
                }
                step['id'] = id;

                var name = $(stepEl).attr('name');
                if (!name) {
                    throw new Error('attribute name not exists');
                }
                step['name'] = name;

                var actionsFromStep = this.parseActionsFromStep(stepEl);
                step['actions'] = actionsFromStep['actions'];
                step['common-actions'] = actionsFromStep['common-actions'];

                steps.push(step);
            }, this));
            if (0 === steps.length) {
                steps = false;
            }
            return steps;
        },
        /**
         * Парсинг перехода между шагами
         *
         * @param actionEl
         */
        parseDefaultAction: function(actionEl){
            var action = {
                'unconditional-result': null,
                'results': []
            };
            var id = $(actionEl).attr('id');
            if (!id) {
                throw new Error('attribute id not exists');

            }
            action['id'] = id;

            var name = $(actionEl).attr('name');
            if (!name) {
                throw new Error('attribute name not exists');

            }
            var unconditionalResult = this.parseUnconditionalResults(actionEl);
            if (1 !== unconditionalResult.length) {
                throw new Error('unconditional result not exists');

            }
            action['unconditional-result'] = unconditionalResult[0];


            var results = this.parseResult(actionEl);
            if (results) {
                action['results'] = results;
            }

            action['name'] = name;

            return action;
        },
        /**
         * Парсинг переходов между шагами
         *
         * @param stepEl
         * @returns {{}}
         */
        parseActionsFromStep: function(stepEl) {
            var results = {
                'actions': [],
                'common-actions': []
            };
            var actions = [];
            $(stepEl).xpath('.//actions/action').each(_.bind(function(actionIndex, actionEl){
                var action = this.parseDefaultAction(actionEl);
                actions.push(action);
            }, this));
            var commonActions = [];
            $(stepEl).xpath('.//actions/common-action').each(_.bind(function(actionIndex, actionEl){
                var action = {
                    'id': null
                };
                var id = $(actionEl).attr('id');
                if (!id) {
                    throw new Error('attribute id not exists');

                }
                action['id'] = id;
                commonActions.push(action);
            }, this));

            if (actions.length > 0) {
                results['actions'] = actions;
            }
            if (commonActions.length > 0) {
                results['common-actions'] = commonActions;
            }

            return results;
        },
        /**
         * Парсинг блока с безусловным переходом
         *
         * @param el
         * @returns {*}
         */
        parseUnconditionalResults: function(el)
        {
            var unconditionalResults = [];
            $(el).xpath('.//unconditional-result').each(_.bind(function(index, currentEl){
                var unconditionalResultEl = $(currentEl);
                var oldStatus = unconditionalResultEl.attr('old-status');
                if (!oldStatus) {
                    throw new Error('old-status  not exists');

                }
                var unconditionalResult = {
                    'old-status': oldStatus,
                    'status': unconditionalResultEl.attr('status'),
                    'step': unconditionalResultEl.attr('step'),
                    'owner': unconditionalResultEl.attr('owner'),
                    'split': unconditionalResultEl.attr('split'),
                    'join': unconditionalResultEl.attr('join'),
                    'due-date': unconditionalResultEl.attr('due-date'),
                    'id': unconditionalResultEl.attr('id'),
                    'display-name': unconditionalResultEl.attr('display-name')
                };

                unconditionalResults.push(unconditionalResult);
            }, this));

            return unconditionalResults;
        },
        /**
         * Парсинг блока с условным переходом
         *
         * @param actionEl
         * @returns {Array}
         */
        parseResult: function(actionEl)
        {
            var results = [];
            $(actionEl).xpath('.//result').each(function(index, el){
                var resultEl = $(el);

                var oldStatus = resultEl.attr('old-status');
                if (!oldStatus) {
                    throw new Error('old-status  not exists');

                }
                var result = {
                    'old-status': oldStatus,
                    'status': resultEl.attr('status'),
                    'step': resultEl.attr('step'),
                    'owner': resultEl.attr('owner'),
                    'split': resultEl.attr('split'),
                    'join': resultEl.attr('join'),
                    'due-date': resultEl.attr('due-date'),
                    'id': resultEl.attr('id'),
                    'display-name': resultEl.attr('display-name')
                };
                results.push(result);
            });


            if (0 === results.length) {
                results = false;
            }
            return results;
        }
    });

    return Parser;
});
