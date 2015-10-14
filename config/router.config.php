<?php
/**
 * @link https://github.com/old-town/workflow-designer-client
 * @author  Malofeykin Andrey  <and-rey2@yandex.ru>
 */
namespace OldTown\Workflow\Designer\Client;

use OldTown\Workflow\Designer\Client\Controller\WorkflowDesignerController;

return [
    'router' => [
        'routes' => [
            'workflow-designer' => [
                'type' => 'Literal',
                'options' => [
                    'route' => '/',
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'view' => [
                        'type' => 'Literal',
                        'route' => '/view',
                        'defaults' => [
                            'controller' => WorkflowDesignerController::class,
                            'action' => 'index'
                        ]
                    ]
                ]
            ]
        ]
    ]
];