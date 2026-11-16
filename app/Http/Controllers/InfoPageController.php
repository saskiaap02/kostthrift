<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

/** Halaman informasi statis: syarat, privasi, bantuan, panduan. */
class InfoPageController extends Controller
{
    public function terms(): Response
    {
        return $this->page('Info/Terms');
    }

    public function privacy(): Response
    {
        return $this->page('Info/Privacy');
    }

    public function help(): Response
    {
        return $this->page('Info/Help');
    }

    public function guide(): Response
    {
        return $this->page('Info/Guide');
    }

    public function meetup(): Response
    {
        return $this->page('Info/Meetup');
    }

    private function page(string $component): Response
    {
        return Inertia::render($component, [
            'contactEmail' => config('kosthrift.contact_email'),
            'updatedAt' => config('kosthrift.legal_updated'),
        ]);
    }
}
