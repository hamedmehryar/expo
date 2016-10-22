<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ExampleTest extends TestCase
{
    public function testDisplaysAlpha()
    {
        $this->visit('/')
            ->see('Alpha')
            ->dontSee('Beta');
    }
}
