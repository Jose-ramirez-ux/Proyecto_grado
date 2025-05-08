<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Ingreso;
use Illuminate\Http\Request;

class IngresoController extends Controller
{
    public function index(Request $request)
    {
        $ingresos = $request->user()->ingresos;
        return response()->json($ingresos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'fecha' => 'required|date',
            'color' => 'required|string|max:7',
        ]);

        $ingreso = $request->user()->ingresos()->create($request->all());
        return response()->json($ingreso, 201);
    }

    public function show($id)
    {
        $ingreso = Ingreso::findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($ingreso->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($ingreso);
    }

    public function update(Request $request, $id)
    {
        $ingreso = Ingreso::findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($ingreso->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'fecha' => 'required|date',
            'color' => 'required|string|max:7',
        ]);

        $ingreso->update($request->all());
        return response()->json($ingreso);
    }

    public function destroy($id)
    {
        $ingreso = Ingreso::findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($ingreso->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ingreso->delete();
        return response()->json(['message' => 'Ingreso deleted']);
    }
}
