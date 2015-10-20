<?php
/**
 * @link https://github.com/old-town/workflow-designer-client
 * @author  Malofeykin Andrey  <and-rey2@yandex.ru>
 */
namespace OldTown\Workflow\Designer\Client\PhpUnit\Test;

/**
 * Class Paths
 *
 * @package OldTown\Workflow\Designer\Client\PhpUnit\Test
 */
class Paths
{
    /**
     * Путь до конфига приложения
     *
     * @var string|null
     */
    protected static $pathToAppConfig;


    /**
     * Возвращает путь до директории с данными для тестов
     *
     * @return string
     */
    public static function getPathToAppConfig()
    {
        if (static::$pathToAppConfig) {
            return static::$pathToAppConfig;
        }

        static::$pathToAppConfig =   __DIR__ . '/_files/app/application.config.php';

        return static::$pathToAppConfig;
    }

}
