<?php

namespace App\Http\Controllers;

use App\Models\Provincia;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {

        $perPage = $request->input('per_page', 10);

        $query = User::query()->orderBy('name', 'asc');

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', '%' . $searchTerm . '%');
        }

        $users = $query->paginate($perPage);

        $provincias = Provincia::orderBy('name', 'asc')->with('localidades')->get();


        return inertia('admin/clientes', [
            'clientes' => $users,
            'provincias' => $provincias,
        ]);
    }

    public function changeStatus(Request $request)
    {
        $user = User::findOrFail($request->id);
        $user->update(['autorizado' => !$user->autorizado]);
    }

    public function update(Request $request)
    {
        $user = User::findOrFail($request->id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'cuit' => 'required|string|max:20',
            'direccion' => 'nullable|string|max:255',
            'provincia' => 'nullable|string|max:255',
            'localidad' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'lista' => 'nullable|string|max:255',
            'autorizado' => 'nullable|boolean'
        ]);


        $user->update($data);
    }

    public function destroy(Request $request)
    {

        $user = User::findOrFail($request->id);
        $user->delete();
    }
}
