<?php
/**
 * @link https://github.com/old-town/workflow-designer-client
 * @author  Malofeykin Andrey  <and-rey2@yandex.ru>
 */


use Zend\Loader\AutoloaderFactory;
use Zend\Loader\StandardAutoloader;
use Zend\Loader\ClassMapAutoloader;


error_reporting(E_ALL | E_STRICT);
chdir(__DIR__);

/**
 * Test bootstrap, for setting up autoloading
 *
 * @subpackage UnitTest
 */
class Bootstrap
{
    /**
     * @var bool
     */
    protected static $flagInit = false;

    /**
     * Настройка тестов
     *
     * @throws \RuntimeException
     */
    public static function init()
    {
        if (!static::$flagInit) {
            static::initAutoloader();
            static::$flagInit = true;
        }
    }


    /**
     * Инициализация автозагрузчика
     *
     * @return void
     *
     * @throws RuntimeException
     */
    protected static function initAutoloader()
    {
        $vendorPath = static::findParentPath('vendor');

        if (is_readable($vendorPath . '/autoload.php')) {

            /** @noinspection PhpIncludeInspection */
            include $vendorPath . '/autoload.php';
        }

        if (!class_exists(AutoloaderFactory::class)) {
            throw new RuntimeException('Unable to load ZF2. Run `php composer.phar install` or define a ZF2_PATH environment variable.');
        }

        try {
            AutoloaderFactory::factory([
                StandardAutoloader::class => [
                    'autoregister_zf' => true,
                    'namespaces' => [
                        'OldTown\\Workflow\\Designer\\Client' => __DIR__ . '/../../src/',
                        __NAMESPACE__ => __DIR__. '/tests/',
                        'OldTown\\Workflow\\Designer\\Client\\PhpUnit\\Utils' => __DIR__ . '/utils',
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            $errMsg = 'Ошибка инициации автолоадеров';
            throw new RuntimeException($errMsg, $e->getCode(), $e);
        }
    }

    /**
     * @param $path
     *
     * @return bool|string
     */
    protected static function findParentPath($path)
    {
        $dir = __DIR__;
        $previousDir = '.';
        while (!is_dir($dir . '/' . $path)) {
            $dir = dirname($dir);
            if ($previousDir === $dir) {
                return false;
            }
            $previousDir = $dir;
        }
        return $dir . '/' . $path;
    }
}

Bootstrap::init();
