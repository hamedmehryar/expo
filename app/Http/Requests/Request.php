<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;

abstract class Request extends FormRequest
{
    const
        /**
         * Specifies the status within an AJAX response.
         */
        JSON_STATUS  = '_sts',
        /**
         * Specifies the status within an AJAX response, in case JSON_STATUS is 0.
         */
        JSON_MESSAGE = '_sts_msg';

    /**
     * Returns the proper failed validation response for the request.
     *
     * @override This method overrides Laravel's default response() method, since the redirector->to() uses a bad
     *           architectural approach by sending a 302 Http status to then redirect to the final url.
     *
     * @param array $data The data to be sent within the response. If the param $view is assigned it will pass to the
     *              respective view.
     *
     *              Important: the param $data must be kept as array, since first parameter it is overriding the
     *                         param $errors from FormRequest::response().
     *
     *              Important: the words "__sts" and "__sts_msg" must not be used as key, since they have been reserved
     *                         for the JSON response API.
     *
     * @param mixed $errors
     *
     * @param \Illuminate\View\View $view Specifies the view to be returned in case the current request is not an AJAX.
     *
     * @param bool $flashOldInput Specifies to populate the session var _old_input, thus the inputs in the view will
     *              be filled in.
     *
     * @return \Illuminate\View\View|\Illuminate\Http\JsonResponse
     */
    public function response(array $data, $errors=null, View $view=null, $flashOldInput=true)
    {
        if (($this->ajax() && ! $this->pjax()) || $this->wantsJson()){

            if (empty($data) && !is_array($data)) $data = [$data];

            if (empty($errors)){

                return new JsonResponse(

                    array_merge(
                        [
                            self::JSON_STATUS => 1
                        ],
                        $data
                    )
                );

            }else{

                $arrErrors = [];

                if ($errors instanceof Collection){

                    foreach ($errors->all() as $error)
                        $arrErrors[] = $error;

                }else
                    $arrErrors = $errors;

                return new JsonResponse(

                    array_merge(
                        [
                            self::JSON_STATUS => 0,
                            self::JSON_MESSAGE => $arrErrors
                        ],
                        $data
                    ),

                    422
                );
            }

        }

        if ($flashOldInput)
            $this->session()->flashInput($this->except($this->dontFlash));

        return $view->withErrors($errors)->with('data', $data);

        /*
         * Override
         *
        return $this->redirector->to($this->getRedirectUrl())
            ->withInput($this->except($this->dontFlash))
            ->withErrors($errors, $this->errorBag);
        */
    }
}
