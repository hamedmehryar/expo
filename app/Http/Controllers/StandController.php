<?php
/**
 * Provides Controller services for {@link \App\Stand}.
 *
 * @author     hamedmehryar
 */
namespace App\Http\Controllers;
use App\Http\Requests;
use App\Stand;
use Illuminate\Support\Facades\File;
use Validator;


class StandController extends Controller
{

    /**
     * Returns additional details for a specific stand space record.
     *
     * @param Requests\StandRequest $request
     *
     * @return \Illuminate\Http\JsonResponse|\Illuminate\View\View
     */
    public function fetch(Requests\StandRequest $request){

        $response = [];
        $errors = [];

        $validator = Validator::make($request->all(), $request->rulesForStandDetails());

        if ($validator->fails()){

            $errors = ['Invalid params'];

        }else{

            if ($request->query('status_only')){

                $stand = Stand::with('status')->find($request->query('stand_id'))->get();

                $response = [
                    'status' => $stand->status
                ];

            }else{

                $stand = Stand::byEventWithReservation(

                    $request->get('event_id'), $request->get('stand_id')

                )->first();

                if ($stand->reserved()){

                    $fileList = [];

                    $reservationDir = \App\User::pathToReservationDir($stand->user_dir_key, $stand->reservation_id);
                    $reservationUrl = \App\User::urlToReservationDir($stand->user_dir_key, $stand->reservation_id);

                    try{

                        $files = File::allFiles($reservationDir);

                    }catch(\Exception $e){

                        $files = [];

                    }

                    foreach ($files as $file/** @var $file \SplFileInfo */){

                        $fileList[] = $file->getBasename();
                    }



                }else{

                    $reservationUrl = '';
                    $fileList = [];

                }


                $response = [
                    '_model' => [
                        'status'      => $stand->status,
                        'real_image'  => $stand->event->code .'/'. $stand->id .'.'. $stand->image_ext,
                        'description' => $stand->description,
                        'm2'          => $stand->sqMetersFormatted(),
                        'reservation_url' => $reservationUrl,
                        'file_list'   => $fileList,
                        'admin_email' => $stand->admin_email,
                        'admin_name'  => $stand->admin_name
                    ]
                ];
            }

        }

        return $request->response($response, $errors);
    }
}
