<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\CampusResource;
use App\Models\Campus;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /** Tampilkan form daftar, lengkap dengan daftar kampus untuk dropdown. */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'campuses' => CampusResource::collection(Campus::selectable())->resolve(),
        ]);
    }

    /** Buat akun baru lalu langsung masuk ke Beranda. */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'campus_id' => $data['campus_id'] ?? null,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('home');
    }
}
