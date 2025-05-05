<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request)
    {

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'name' => 'required',
            'password' => 'required',
        ]);

        // Agregar el campo autorizado a las credenciales
        $credentials['autorizado'] = true;

        if (Auth::guard()->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/privada/productos');
        }

        return back()->withErrors([
            'name' => 'Las credenciales proporcionadas no son correctas o la cuenta no está autorizada.',
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        return redirect('/')->with('status', 'Has cerrado sesión correctamente.');
    }
}
