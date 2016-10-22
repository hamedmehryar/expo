# ExpoNow Web App

The goal of the project is to deliver a virtual exposition application. 

>_This project has been developed by [Marcelo Duarte](https://linkedin.com/in/marcelo-duarte-55991ab9) as way to demo the implementation of some modern web technologies, such as Objected Oriented PHP, CSS3 and HTML5._

## Technical Objective

Allow companies to book their place in virtual expositions in different exposition events.

Companies will choose from available events the one they want to take place in, then they will choose their stand within the exposition hall from a map and finally they will receive a report about the users who visited their stand on the event after it is over.

## Where you Are

This readme.md file has been placed under **exposition/** directory, which is the root dir of the application.


## How the Application Works
   
* The Use Case UML Diagram below can give you a glimpse of how the app works. 

![Use Case](doc/uml-diagrams/UseCase.png)

## Development Environment 

* Back-end

    - System: Mac OS X El Capitan `10.11.6`
    - Web Server: [Apache](http://apach.org) `2.0`
    - IDE: [PhpStorm](http://www.jetbrains.com/phpstorm/) `2016.2`
    - Language: [PHP](http://php.net) `5.5.36`
    - Database: [MySQL](http://mysql.com) `5.7.13`
    - Dependency package manager for PHP: [Composer](http://getcomposer.org) `1.2.0` 
    - PHP Framework: [Laravel](http://laravel.com) `5.2`
    - UML Diagrams: [StarUML](http://staruml.io) `2.7.0`
    - Database E-R Diagram: [MySQL Workbench](http://dev.mysql.com/downloads/workbench/5.0.html)
    - Version Control System: [Git](http://git-scm.com) `2.9.2` 
    
* Front-end

    - HTML/JavaScript/CSS    
    - JS Framework: [Backbone](http://backbonejs.org) `1.3.3`
    - CSS Framework: [Bootstrap](http://getbootstrap.com) `3.3.7`

## Configuring Environment

> Considering that you already have a stable version of all tools listed above in the section **Back-end**, and that your PHP version is >= 5.5.9, with OpenSSL PHP Extension, PDO PHP Extension Mbstring PHP Extension and Tokenizer PHP Extension. If installing PHP may sound challenging you could also try Laravel [HomeStead](https://laravel.com/docs/5.2/homestead):  

1. Open a Terminal window in your system and execute the commands below to create an empty Laravel application and enter inside of the directory:  
    ```shell  
    laravel new exposition
    cd exposition
    ```  
    The command above will create a directory called exposition containing all required Laravel files and respective dependencies.
    
2. Once the Laravel application has been installed, we can then create our schema in the MySQL database with the command below:  
    ```sql
    CREATE DATABASE IF NOT EXISTS `exponow` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
    ```
   The command above will create an empty schema called exposition.

3. Now that the database schema for the application is ready, we need to configure our application to operate with it:
   
   1. Open the file [.env](/.env) find the following parameters (DB_DATABASE, DB_USERNAME, DB_PASSWORD) and change them accordingly with your database credentials:  
     
      DB_DATABASE=**_exposition_**  
      DB_USERNAME=**_< your database username >_**  
      DB_PASSWORD=**_< your username password >_**  
      
      **Important**: the user informed above must have privileges to create/drop tables in the schema of our application **exposition**. During the development we have used the default MySQL user **_root_**.
       
   2. Open the file [config/database.php](config/database.php), find the array key **'default'** and make sure it's configured as **_'default' => env('DB_CONNECTION', 'sqlite')_**.  
   
      This will specify to Laravel that the default database connection parameters defined in the file [.env](/.env) should be used.

4. Initialization of database: because we are using Laravel as a development framework, we don't need necessarily create our database tables prior to start coding/testing our application. Laravel provides a really powerful console utility called [artisan](artisan.php)([online doc](https://laravel.com/docs/5.2/artisan)), which gives us an interactive way to create our database as we build our code using [MVC architecture](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).
      
   Thus when we reach the point to ship our app to the production environment we would be using an external tool like [MySQL Workbench](http://dev.mysql.com/downloads/workbench/5.0.html) to Generate an E-R Diagram of the tables by reverse-engineering our schema **exposition**. 

## Building the Application 

### Database 

As mentioned above we are using Laravel's [artisan](artisan.php) utility to create the PHP stub files responsible to either generate/delete our database tables.

One of the benefits of using artisan is that we will have an automated way to perform migrations in the database during the deployment of new versions of our application. For more details see [Migrations](https://laravel.com/docs/5.2/migrations). 

To do that we go back to the Terminal window, which should be currently under the directory **exposition/**, as done in the step 1 of [Configuring Environment](#Configuring Environment), and execute a command like this below:
```shell
php artisan make:migration create_events_table --create=expo_events
php artisan make:migration create_stands_table --create=expo_stands
php artisan make:migration create_reservations_table --create=reservations
```
The commands above will generate the stub files, such as [2016_08_20_210129_create_events_table.php](database/migrations/2016_08_20_210129_create_events_table.php), which must be modified to have the column names of the table **expo_event**.

We have named our table as **expo_event**, instead of **event**, since more likely we would face name collision along the way in the development cycle, considering that frameworks, such as Laravel, often use the word event to name essential components. Thus we can easily track in the future all snippets that may refer the table **expo_event**.    

Within this migration file we could also define/trigger further routines associated with a specific application version deployment.         

> **Important:** Laravel's migration API allows us to undo/rollback a migration through the command ``` php artisan migrate:rollback ```, which at some point will invoke the method [CreateEventsTable::down()](database/migrations/2016_08_20_210129_create_events_table.php) of the respective Migration class created in the stub PHP file. But if the undo routine requires to drop a column from the database, Laravel will need a specific package to handle the operation. To install this specific package, which is called Doctrine/DBAL, while being in our root application dir **exposition/** we can run the command below via Terminal.
  
  ```shel
  composer require doctrine/dbal
  ```

### Additional required modules  

> Being in the root application directory **exposition/** we can run the following commands via Terminal.

For markup elements such as form inputs.

```shell
composer require laravelcollective/html
```

Update composer with command:
```shell
composer update
```


To complete the installation for the lib above, go to [config/app.php](config/app.php) add this lines:

in providers group:

**_Collective\Html\HtmlServiceProvider::class,_**

in aliases group:

**_'Form' => Collective\Html\FormFacade::class,_**  
**_'Html' => Collective\Html\HtmlFacade::class,_**


## License

The app is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
