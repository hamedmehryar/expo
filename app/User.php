<?php
/**
 * Provides a model for the users of the application.
 *
 * @author     hamedmehryar
 */
namespace App;

use Doctrine\DBAL\Query\QueryBuilder;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\URL;

class User extends Authenticatable
{
    const
        /**
         * Directory names under user-assets/.
         */
        RESERVATION_DIR = 'reservation',
        PROFILE_DIR = 'profile',
        LOGO_FILE   = 'company-logo'
    ;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'company', 'company_sname', 'logo_type'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'dir_name'
    ];

    /**
     * Returns the path to the public user assets directory.
     *
     * @return string
     */
    public function getDirectoryPath(){

        return public_path('user-assets'. DIRECTORY_SEPARATOR . $this->dir_name);

    }

    /**
     * Returns the URL to the public user assets directory.
     *
     * @return string
     */
    public function getDirectoryUrl(){

        return url('user-assets'. DIRECTORY_SEPARATOR . $this->dir_name);

    }

    /**
     * Returns the fully qualified path to the user reservation directory.
     *
     * @param string $userDirKey The user directory key.
     * @param string $reservationId Appended to the path
     * @param string $fileName Appended as latest to the path.
     *
     * @return string
     */
    public static function pathToReservationDir($userDirKey, $reservationId, $fileName=''){

        return public_path(

            'user-assets'. DIRECTORY_SEPARATOR .

            $userDirKey . DIRECTORY_SEPARATOR .

            self::RESERVATION_DIR . DIRECTORY_SEPARATOR .

            $reservationId

        ) . (empty($fileName) ? '' : DIRECTORY_SEPARATOR. $fileName);

    }

    /**
     * Gets the fully qualified path to the user reservation directory.
     *
     * @param string $reservationId Appended to the path
     * @param string $fileName Appended as latest to the path.
     *
     * @return string
     */
    public function reservationDirectoryPath($reservationId, $fileName=''){

        return self::pathToReservationDir($this->dir_name, $reservationId, $fileName);

    }

    /**
     * Returns the URL to the user reservation directory.
     *
     * @param string $userDirKey The user directory key.
     * @param string $reservationId Appended to the path
     * @param string $fileName Appended as latest to the path.
     *
     * @return string
     */
    public static function urlToReservationDir($userDirKey, $reservationId, $fileName=''){

        return url(

            'user-assets'. DIRECTORY_SEPARATOR .

            $userDirKey . DIRECTORY_SEPARATOR .

            self::RESERVATION_DIR . DIRECTORY_SEPARATOR .

            $reservationId

        ) . (empty($fileName) ? '' : DIRECTORY_SEPARATOR . $fileName);

    }

    /**
     * Gets the URL to the user's reservation directory.
     *
     * @param string $reservationId Appended to the path
     * @param string $fileName Appended as latest to the path.
     *
     * @return string
     */
    public function reservationDirectoryUrl($reservationId, $fileName=''){

        return self::urlToReservationDir($this->dir_name, $reservationId, $fileName);

    }

    /**
     * Returns the fully qualified path to the user profile directory.
     *
     * @param string $userDirKey The user directory key.
     * @param string $addPath Appended to the path
     *
     * @return string
     */
    public static function pathToProfileDir($userDirKey, $addPath=''){

        return public_path(

            'user-assets'. DIRECTORY_SEPARATOR .

            $userDirKey . DIRECTORY_SEPARATOR .

            self::PROFILE_DIR

        ) . (empty($addPath) ? '' : DIRECTORY_SEPARATOR . $addPath);

    }

    /**
     * Gets the fully qualified path to the user profile directory.
     *
     * @param string $addPath Appended to the path
     *
     * @return string
     */
    public function profileDirectoryPath($addPath=''){

        return self::pathToProfileDir($this->dir_name, $addPath);

    }

    /**
     * Returns the URL to the user profile directory.
     *
     * @param string $userDirKey The user directory key.
     * @param string $addPath Appended to the path.
     *
     * @return string
     */
    public static function urlToProfileDir($userDirKey, $addPath=''){

        return url(

            'user-assets'. DIRECTORY_SEPARATOR .

            $userDirKey . DIRECTORY_SEPARATOR .

            self::PROFILE_DIR

        ) . (empty($addPath) ? '' : DIRECTORY_SEPARATOR . $addPath);

    }

    /**
     * Gets the URL to the user profile directory.
     *
     * @param string $addPath Appended to the path.
     *
     * @return string
     */
    public function profileDirectoryUrl($addPath=''){

        return self::urlToProfileDir($this->dir_name, $addPath);

    }

    /**
     * Returns the URL to the user logo file.
     *
     * @param string $userDirKey The user directory key.
     * @param string $userLogoExtension Appended to the path.
     *
     * @return string
     */

    public static function urlToLogo($userDirKey, $userLogoExtension){

        return self::urlToProfileDir($userDirKey, self::LOGO_FILE .'.'. $userLogoExtension);

    }

    /**
     * Gets the URL to the user logo file.
     *
     * @return string
     */

    public function logoUrl(){

        return self::urlToProfileDir($this->dir_name, self::LOGO_FILE .'.'. $this->logo_ext);

    }

    /**
     * Returns a user based on its email.
     *
     * @param $query
     * @param string $email
     *
     * @return \Doctrine\DBAL\Query\QueryBuilder
     */
    public function scopeByEmail($query, $email){

        return $query->where('email', '=', $email);

    }
}
