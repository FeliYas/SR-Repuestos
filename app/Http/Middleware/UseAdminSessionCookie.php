<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class UseAdminSessionCookie
{
    public function handle(Request $request, Closure $next)
    {
        if (
            $request->is('adm')
            || $request->is('admin/*')
            || $request->is('admin-logout')
        ) {
            config(['session.cookie' => 'sr_repuestos_admin_session']);
        }

        return $next($request);
    }
}
