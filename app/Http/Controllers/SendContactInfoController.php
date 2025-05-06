<?php

namespace App\Http\Controllers;

use App\Models\Contacto;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

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

        if (!$responseData['success']) {
            // Si la verificación falla, devuelve un error
            return response()->json(['error' => 'Verificación de reCAPTCHA fallida'], 422);
        }

        // Si el reCAPTCHA es válido, envía el correo
        $htmlContent = $request->html; // Recibe el HTML renderizado
        $contactInfo = Contacto::first()->mail;

        Mail::send([], [], function ($message) use ($htmlContent, $contactInfo) {
            $message->to($contactInfo)
                ->subject('Correo de Contacto')
                ->html($htmlContent);
        });

        // Devuelve una respuesta exitosa
        return response()->json(['success' => 'Correo enviado correctamente']);
    }
}
