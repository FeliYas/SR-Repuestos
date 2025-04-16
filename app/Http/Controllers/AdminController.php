<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $admins = Admin::all();
        return Inertia::render('admin/administradoresLayout', ['admins' => $admins]);
    }

    public function create()
    {
        return Inertia::render('admin/login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:admins,name',
            'password' => 'required|min:6',
        ]);

        Admin::create([
            'name' => $request->name,
            'password' => Hash::make($request->password),
        ]);
    }

    public function edit(Admin $admin)
    {
        return Inertia::render('Admin/Admins/Edit', ['admin' => $admin]);
    }

    public function update(Request $request, Admin $admin)
    {

        $request->validate([
            'name' => 'required|unique:admins,name,' . $admin->id,
            'password' => 'sometimes|min:6',
        ]);

        $admin->name = $request->name;
        if ($request->password) {
            $admin->password = Hash::make($request->password);
        }
        $admin->update();
    }



    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();
    }
}
