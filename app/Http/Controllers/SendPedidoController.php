<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SendPedidoController extends Controller
{
    public function sendReactEmail(Request $request)
    {
        $htmlContent = $request->input('html'); // Recibe el HTML renderizado
        $attachments = $request->file('attachments'); // Recibe los archivos adjuntos
        $contactInfo = Contacto::first()->mail;

        Mail::send([], [], function ($message) use ($htmlContent, $attachments, $contactInfo) {
            $message->to($contactInfo)
                ->subject('Correo de Pedido')
                ->html($htmlContent);

            // Adjuntar archivos si existen
            if ($attachments) {
                foreach ($attachments as $file) {
                    $message->attach($file->getRealPath(), [
                        'as' => $file->getClientOriginalName(),
                        'mime' => $file->getMimeType(),
                    ]);
                }
            }
        });

        return response()->json(['message' => 'Correo enviado con éxito']);
    }
}
