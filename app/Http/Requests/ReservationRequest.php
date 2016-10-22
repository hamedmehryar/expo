<?php
/**
 * Provides request validation for {@link App\Http\Controllers\ReservationController}.
 *
 * @author     hamedmehryar
 */
namespace App\Http\Requests;

class ReservationRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * Specific rules methods must be created to replace the return would be returned by rules(). This approach is to
     * avoid the auto-run of FormRequest validation, since its default behavior of redirecting the Request with status
     * 302 when the inputs validation results in failure, isn't a good architectural approach.
     *
     * @return array Return empty always. See why above.
     */
    public static function rules()
    {
        return []; // return nothing, since automatic FormRequest validation has been override via customRules().
    }

    /**
     *
     * @return array
     */
    public function rulesForReservation()
    {

        $personNameRegex = '/^[\pL\s\d]+$/u'; // letters, space and numbers

        return [
            'company'        => 'required|min:3:max:60|Regex:'. $personNameRegex,
            'company_sname'  => 'required|min:2:max:12|Regex:'. $personNameRegex,
            'name'           => 'required|min:2|max:60|Regex:'. $personNameRegex,
            'company_logo'   => 'required|max:4096|mimes:jpg,jpeg,bmp,png,tiff,gif',
            'email'          => 'required|email',
            'mkt_files.*'    => 'max:4096|mimes:jpg,jpeg,bmp,png,tiff,gif,pdf'
        ];

    }

    /**
     *
     * @return array
     */
    public function rulesForEmailReport()
    {

        return [
            'admin_email' => 'required|email'
        ];

    }
}
