<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Gasto;
use Illuminate\Http\Request;

class GastoController extends Controller
{
    public function index(Request $request)
    {
        $gastos = $request->user()->gastos;
        return response()->json($gastos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'fecha' => 'required|date',
            'color' => 'required|string|max:7',
        ]);

        $gasto = $request->user()->gastos()->create($request->all());
        return response()->json($gasto, 201);
    }

    public function show($id)
    {
        $gasto = Gasto::findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($gasto->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($gasto);
    }

    public function update(Request $request, $id)
    {
        $gasto = Gasto::findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($gasto->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'nombre' => 'required|string|max:255',
            'valor' => 'required|numeric|min:0',
            'fecha' => 'required|date',
            'color' => 'required|string|max:7',
        ]);

        $gasto->update($request->all());
        return response()->json($gasto);
    }

    public function destroy($id)
    {
        $gasto = Gasto::findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($gasto->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gasto->delete();
        return response()->json(['message' => 'Gasto deleted']);
    }
}
