<?php
/**
 * Compose the markup for App\Http\Controllers\ReservationController::emailReport().
 *
 * @author     hamedmehryar
 */
?>
<html>
<head>
    <style>
        body{
            font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif;
        }
        table, td, th {
            border: 1px solid #ddd;
            text-align: left;
        }

        table {
            border-collapse: collapse;
            width: 90%;
            min-width: 800px;
        }

        th, td {
            padding: 15px;
        }
        .money{
            color: #0cc300;
        }
    </style>
</head>
<body>
<div style="padding: 12px 0; width: 100%; background-color: #61a5fa; color: #fff; line-height: 28px;">
    <span style="font-size: 28px; padding: 0 12px">ExpoNow</span>-
    <span style="font-size: 21px; padding: 0 12px">{{ $event->name .' #'. $event->id }}</span>
</div>
<h2 style="padding: 12px 6px">Reservations for the event</h2>
<table>
    <tr>
        <th style="width: 28%; min-width: 200px">Company</th>
        <th style="width: 20%; min-width: 160px">Short Name</th>
        <th style="width: 20%; min-width: 160px">Admin</th>
        <th style="width: 22%; min-width: 200px">Email</th>
        <th style="width: 10%; min-width: 80px; text-align: right">Price</th>
    </tr>
<?php

    $total = 0;

    foreach($reservations as $reservation){

        $total += $reservation->priceToDB();
?>
    <tr>
        <td>{{ $reservation->company }}</td>
        <td>{{ $reservation->company_sname }}</td>
        <td>{{ $reservation->admin_name }}</td>
        <td>{{ $reservation->admin_email }}</td>
        <td class="money" style="text-align: right">{{ $reservation->price }}</td>
    </tr>
<?php
    }
?>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td style="text-align: right; color: #8c959d; font-size: 18px">Total:</td>
        <td class="money" style="text-align: right; color: #0a9100">{{ money_format('%.2n', $total) }}</td>
    </tr>
</table>
</body>
</html>