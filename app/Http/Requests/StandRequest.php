<?php
/**
 * Provides request validation for {@link App\Http\Controllers\StandController}.
 *
 * @author     hamedmehryar
 */
namespace App\Http\Requests;

class StandRequest extends Request
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
    public function rulesForStandDetails()
    {
        return [
            'stand_id' => 'required|min:1',
            'event_id' => 'required|min:1'
        ];

    }
}
