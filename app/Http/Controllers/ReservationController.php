<?php
/**
 * Provides Controller services for {@link App\Reservation}.
 *
 * @author     hamedmehryar
 */
namespace App\Http\Controllers;

use App\Event;
use App\Http\Requests;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Stand;
use App\Reservation;
use App\User;
use Validator;
use Illuminate\Support\Facades\Mail;



class ReservationController extends Controller
{

    /**
     * If param get_form is coming through, returns empty form through the JSON property form.
     *
     * Otherwise attempt to perform reservation.
     *
     * @param Requests\ReservationRequest $request
     *
     * @return \Illuminate\Http\JsonResponse|\Illuminate\View\View
     */
    public function reservation(Requests\ReservationRequest $request){
        try{

            /*
             * If posting the reservation form...
             */
            if ($request->query('get_form')){

                return $request->response(['empty_form' => view('stand/reservation-form')->render()]);

            }else{

                $validator = Validator::make($request->all(), $request->rulesForReservation());

                if ($validator->fails()){

                    return $request->response([], $validator->getMessageBag()->getMessages());

                }else{

                    $reservationId   = 0;
                    $coShortName = '';
                    $userDirKey  = '';
                    $userLogoExt = '';
                    $adminEmail  = '';
                    $adminName   = '';

                    $inputs = $request->all();

                    /*
                     * Keep the creation of the user out of the transaction, to avoid creation of multiple directories
                     * in the user-assets folder.
                     */
                    $user = User::byEmail($request->get('email'));

                    if (!$user->exists())
                        $user = User::create($inputs);
                    else
                        $user = $user->first();

                    DB::transaction(function() use(
                        &$request, &$user, &$inputs, &$reservationId, &$coShortName, &$userDirKey, &$userLogoExt,
                        &$adminEmail, &$adminName
                    ){

                        $stand = Stand::byEventWithReservation(

                            $request->get('event_id'), $request->get('stand_id')

                        )->first();

                        if (!$stand->reserved()){

                            $inputs['user_id'] = $user->id;
                            $inputs['price'] = $stand->priceToDB();

                            $userLogoExt = $request->file('company_logo')->getClientOriginalExtension();
                            $coShortName = $user->company_sname;
                            $userDirKey  = $user->dir_name;
                            $adminEmail  = $user->email;
                            $adminName   = $user->name;

                            $reservation = Reservation::create($inputs);

                            $reservationId = $reservation->id;

                            Storage::MakeDirectory($user->reservationDirectoryPath($reservation->id) . '', 0775);

                            $request
                                ->file('company_logo')
                                ->move($user->profileDirectoryPath(), User::LOGO_FILE . '.' . $userLogoExt);


                            $user->logo_ext = $userLogoExt;

                            $user->save();

                            if ($request->hasFile('mkt_files')){

                                $marketing_files = $request->file('mkt_files');

                                /*
                                 * Loop through files and upload to users folder and save
                                 */
                                foreach ($marketing_files as $file/** @var \Illuminate\Http\UploadedFile $file */){

                                    $file_name = $file->getClientOriginalName();

                                    $file->move($user->reservationDirectoryPath($reservation->id), $file_name);

                                }

                            }

                            $stand->status = 1;

                            $stand->save();

                        }else{

                            $reservationId   = -1;
                            $coShortName = $stand->company_sname;
                            $userDirKey  = $stand->user_dir_key;
                            $userLogoExt = $stand->user_logo_ext;
                            $adminEmail  = $stand->admin_email;
                            $adminName   = $stand->admin_name;

                        }

                    });

                    if ($reservationId > 0)

                        return $request->response(
                            [
                                'rs_id'         => $reservationId,
                                'co_sname'      => $coShortName,
                                'user_dir_key'  => $userDirKey,
                                'user_logo_ext' => $userLogoExt
                            ],
                            $validator->getMessageBag()->getMessages()
                        );

                    else
                        return $request->response(
                            [
                                'rs_id'         => $reservationId,
                                'co_sname'      => $coShortName,
                                'user_dir_key'  => $userDirKey,
                                'user_logo_ext' => $userLogoExt,
                                'admin_email'   => $adminEmail,
                                'admin_name'    => $adminName
                            ],
                            ['Unfortunately this stand is no longer available.']
                        );

                }
            }

        }catch(\Exception $e){

            return $request->response([], $e->getMessage());

        }
    }
    /**
     * If param can_do is coming through, returns TRUE if the Email report can be sent for the respective event.
     *
     * Otherwise attempt to send email.
     *
     * @param Requests\ReservationRequest $request
     *
     * @return \Illuminate\Http\JsonResponse|\Illuminate\View\View
     */
    public function emailReport(Requests\ReservationRequest $request){
        try{

            /*
             * If posting the reservation form...
             */
            if ($request->query('can_do')){

                $canDo = Event::emailReportAllowed($request->query('event_id'));

                return $request->response([
                    'yes' => $canDo,
                    'msg' => !$canDo
                        ? 'The event must be finished or have at least one stand space reserved to allow Email report.'
                        : ''
                ]);

            }else{

                $validator = Validator::make($request->all(), $request->rulesForEmailReport());

                if ($validator->fails()){

                    return $request->response([], $validator->getMessageBag()->getMessages());

                }else{

                    $email_data = array(
                        'recipient' => $request->get('admin_email'),
                        'subject' => 'Users of stands for the event '
                    );

                    $view_data = array(
                        'event'        => Event::find($request->get('event_id'))->first(),
                        'reservations' => Reservation::byEvent($request->get('event_id'))->get()
                    );

                    Mail::send('email.reservations', $view_data, function($message) use ($email_data){


                        $message
                            ->from('account-noreply@feedbloo.com')
                            ->to( $email_data['recipient'] )
                            ->subject( $email_data['subject'] );
                    });

                    return $request->response([]);

                }
            }

        }catch(\Exception $e){

            return $request->response([], $e->getMessage());

        }
    }
}
