<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    private $users = [
        [
            'id' => 1,
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123'
        ],
        [
            'id' => 2,
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => 'password456'
        ]
    ];

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $email = $request->email;
        $password = $request->password;

        // Find user with matching email
        $user = collect($this->users)->firstWhere('email', $email);

        if (!$user || $user['password'] !== $password) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // Generate a simple token
        $token = Str::random(60);

        return response()->json([
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ],
            'token' => $token
        ]);
    }

    public function checkAuth(Request $request)
    {
        // In a real app, we would validate the token
        // For this simple example, we'll just return success
        return response()->json(['message' => 'Authenticated']);
    }
}
