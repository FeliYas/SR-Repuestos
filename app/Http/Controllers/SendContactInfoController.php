<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class SendContactInfoController extends Controller
{
    public function sendReactEmail(Request $request)
    {
        // Validar la solicitud
        $request->validate([
            'html' => 'required',
            'recaptchaToken' => 'required', // Validamos que exista el token
        ]);

        // Verificar el token de reCAPTCHA
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => env('RECAPTCHA_SECRET_KEY'), // Guarda tu clave secreta en el archivo .env
            'response' => $request->recaptchaToken,
            'remoteip' => $request->ip(), // Opcional: IP del usuario
        ]);

        // Comprobar respuesta
        $responseData = $response->json();

        if (!data_get($responseData, 'success', false)) {

            throw ValidationException::withMessages([
                'recaptcha' => 'Verificación de reCAPTCHA fallida'
            ]);
        }

        // Si el reCAPTCHA es válido, envía el correo
        $htmlContent = $request->html; // Recibe el HTML renderizado
        $contactInfo = env('CONTACT_FORM_TO_EMAIL') ?: optional(Contacto::first())->mail;

        if (!$contactInfo) {
            throw ValidationException::withMessages(['contact' => 'No hay un destinatario configurado para el formulario de contacto']);
        }

        Mail::send([], [], function ($message) use ($htmlContent, $contactInfo) {
            $fromAddress = config('mail.from.address');
            $fromName = config('mail.from.name');

            $message->to($contactInfo)
                ->from($fromAddress, $fromName)
                ->subject('Correo de Contacto')
                ->html($htmlContent);
        });

        // Devuelve una respuesta exitosa
        return back()->with('success', 'Correo enviado correctamente');
    }
}
