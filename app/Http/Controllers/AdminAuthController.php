<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    public function login()
    {

        if (Auth::guard('admin')->check()) {
            return redirect('/admin/dashboard');
        }
        return Inertia::render('admin/login');
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'name' => 'required',
            'password' => 'required',
        ]);

        if (Auth::guard('admin')->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/admin/dashboard');
        }

        return back()->withErrors([
            'name' => 'Las credenciales proporcionadas no son correctas.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        /* $request->session()->invalidate();
        $request->session()->regenerateToken(); */

        return redirect('/adm')->with('success', 'Has cerrado sesión correctamente.');
    }
}
