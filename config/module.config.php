<?php
/**
 * @link https://github.com/old-town/workflow-designer-client
 * @author  Malofeykin Andrey  <and-rey2@yandex.ru>
 */
namespace OldTown\Workflow\Designer\Client;

$config = [];
return array_merge_recursive(
    include __DIR__ . '/router.config.php',
    include __DIR__ . '/controller.config.php',
    $config
);