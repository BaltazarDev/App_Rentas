<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\House;

class HouseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return House::withCount('units')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'map_url' => 'nullable|string',
            'photo_url' => 'nullable|string',
            'description' => 'nullable|string',
            'units' => 'nullable|array',
            'units.*.name' => 'required|string|max:255',
            'units.*.type' => 'required|string|max:255',
            'units.*.base_rent_cost' => 'required|numeric|min:0',
            'units.*.rooms' => 'nullable|integer|min:0',
            'units.*.bathrooms' => 'nullable|integer|min:0',
            'units.*.features' => 'nullable|array',
        ]);

        return \DB::transaction(function() use ($validated) {
            $unitsData = $validated['units'] ?? [];
            unset($validated['units']);

            $house = House::create($validated);

            foreach ($unitsData as $unitData) {
                $house->units()->create([
                    'name' => $unitData['name'],
                    'type' => $unitData['type'],
                    'base_rent_cost' => $unitData['base_rent_cost'],
                    'rooms' => $unitData['rooms'] ?? 0,
                    'bathrooms' => $unitData['bathrooms'] ?? 0,
                    'features' => $unitData['features'] ?? null,
                    'status' => 'vacant',
                ]);
            }

            return $house->load('units');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(House $house)
    {
        return $house->load(['units.tenant', 'expenses']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, House $house)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'map_url' => 'nullable|string',
            'photo_url' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $house->update($validated);
        return $house;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(House $house)
    {
        $house->delete();
        return response()->noContent();
    }
}
