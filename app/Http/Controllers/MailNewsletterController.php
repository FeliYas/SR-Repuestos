<?php

namespace App\Http\Controllers;

use App\Models\MailNewsletter;
use Illuminate\Http\Request;

class MailNewsletterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $query = MailNewsletter::query()->orderBy('created_at', 'desc');

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('email', 'LIKE', '%' . $searchTerm . '%');
        }

        $newsletters = $query->paginate($perPage);

        return inertia('admin/newsletterAdmin', [
            'newsletters' => $newsletters,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:mail_newsletters,email',
        ]);

        MailNewsletter::create($request->only('email'));
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:mail_newsletters,email,' . $request->id,
        ]);

        $mailNewsletter = MailNewsletter::findOrFail($request->id);
        $mailNewsletter->update($request->only('email'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $mailNewsletter = MailNewsletter::findOrFail($request->id);
        $mailNewsletter->delete();
    }
}
