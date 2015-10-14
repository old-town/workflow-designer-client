<?php
/**
 * @link https://github.com/old-town/workflow-designer-client
 * @author  Malofeykin Andrey  <and-rey2@yandex.ru>
 */
namespace OldTown\Workflow\Designer\Client;

use OldTown\Workflow\Designer\Client\Controller\WorkflowDesignerController;

return [
    'controllers' => [
        'invokables' => [
            WorkflowDesignerController::class => WorkflowDesignerController::class
        ]
    ]
];