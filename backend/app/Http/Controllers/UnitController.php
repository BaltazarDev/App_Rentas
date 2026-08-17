<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Unit;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Unit::query();

        if ($request->has('house_id')) {
            $query->where('house_id', $request->house_id);
        }

        return $query->with('tenant')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'type' => 'required|string',
            'name' => 'required|string',
            'rooms' => 'integer',
            'bathrooms' => 'integer',
            'base_rent_cost' => 'required|numeric',
            'features' => 'nullable|array',
            'status' => 'string'
        ]);

        return Unit::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        return $unit->load(['tenant', 'payments', 'expenses']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string',
            'name' => 'sometimes|string',
            'rooms' => 'integer',
            'bathrooms' => 'integer',
            'base_rent_cost' => 'sometimes|numeric',
            'features' => 'nullable|array',
            'status' => 'string'
        ]);

        $unit->update($validated);
        return $unit;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit)
    {
        $unit->delete();
        return response()->noContent();
    }
}
