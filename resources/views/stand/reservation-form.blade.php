<?php
/**
 * Compose the reservation form for {@link App\Reservation}.
 *
 * @author     hamedmehryar
 */
?>
    <h2>Reservation Form</h2>
    <hr>
    {!! Form::open(['enctype' => 'multipart/form-data']) !!}

    <div class="form-group">
        {{--{!! Form::label('company', 'Company name:') !!}--}}
        {!! Form::text('company', null, ['class' => 'form-control', 'placeholder' => 'Company name']) !!}
        <span class="help-block hidden"></span>
    </div>

    <div class="form-group">
        <div class="row">
            <div class="col-xs-6">
                {!! Form::text('company_sname', null, ['class' => 'form-control', 'placeholder' => 'Company short name', 'maxlength' => 12]) !!}
            </div>
            <div class="col-xs-6 tip-block">
                <span class="tip">name to be displayed in the <strong>hall map</strong> - up to 12 letters</span>
            </div>
            {{--{!! Form::label('company_sname', 'Company short name:') !!}--}}
        </div>
        <span class="help-block hidden"></span>
    </div>

    <div class="form-group">
        {{--{!! Form::label('name', 'Administrator:') !!}--}}
        {!! Form::text('name', null, ['class' => 'form-control', 'placeholder' => 'Administrator', 'autocomplete' => 'off']) !!}
        <span class="help-block hidden"></span>
    </div>

    <div class="form-group">
        {{--{!! Form::label('email', 'Email:') !!}--}}
        {!! Form::text('email', null, ['class' => 'form-control', 'placeholder' => 'Email', 'autocomplete' => 'off']) !!}
        <span class="help-block hidden"></span>
    </div>
    <div class="form-group">
        {!! Form::label('c_logo', 'Comapny logo:') !!}
        <div class="input-group">
            <label class="input-group-btn">
                    <span class="btn btn-primary">
                        Browse… <input class="input-file-t" name="company_logo" id="co_logo" type="file" style="display: none;" accept="image/gif,image/jpeg,image/jpg,image/png,image/tiff">
                    </span>
            </label>
            <input type="text" class="form-control" readonly="">
        </div>
        <span class="help-block hidden"></span>
     </div>
     <div class="form-group">
        {!! Form::label('mkt_files', 'Marketing documents:') !!}
        <div class="input-group">
            <label class="input-group-btn">
                        <span class="btn btn-primary">
                            Browse… <input class="input-file-t" name="mkt_files[]" id="mkt_files" type="file" style="display: none;" accept="image/gif,image/jpeg,image/jpg,image/png,image/tiff,application/pdf" multiple="true">
                        </span>
            </label>
            <input type="text" class="form-control" readonly="">
        </div>
        <span class="help-block hidden"></span>
        <span class="help-block">Accepted types: jpg, jpeg, gif, png, tiff, pdf</span>
    </div>
    {{--<div class="form-group">--}}
        {{--{!! Form::button('Add Article', ['id'=> 'createBtn', 'type'=>'button', 'class' => 'btn btn-primary form-control']) !!}--}}
    {{--</div>--}}

    {!! Form::close() !!}