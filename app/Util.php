<?php
/**
 * Provides general routines for general purposes.
 *
 * @author     hamedmehryar
 */
namespace App;

class Util
{

    /**
     * Formats money to a whole number or with 2 decimals; includes a dollar sign in front
     *
     * @param $number
     * @param int $cents 0=never, 1=if needed, 2=always
     *
     * @return string
     */
    public static function formatMoney($number, $cents = 1){

        if (is_numeric($number)) {

            if (!$number) {

                $money = ($cents == 2 ? '0.00' : '0'); // output zero

            } else {

                if (floor($number) == $number) { // whole number
                    $money = number_format($number, ($cents == 2 ? 2 : 0)); // format
                } else { // cents
                    $money = number_format(round($number, 2), ($cents == 0 ? 0 : 2)); // format
                }

            }

            return '$'. $money;

        }else
            return '';
    }
}