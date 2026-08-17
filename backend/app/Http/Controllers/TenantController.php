<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Tenant;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Tenant::query();

        if ($request->has('archived') && $request->archived === 'true') {
            $query->onlyTrashed();
        }

        if ($request->has('unit_id')) {
            $query->where('unit_id', $request->unit_id);
        }

        return $query->with('unit.house')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => 'nullable|exists:units,id',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'payment_due_day' => 'nullable|integer|min:1|max:31',
        ]);

        return \DB::transaction(function() use ($validated) {
            $tenant = Tenant::create($validated);
            
            if ($tenant->unit_id) {
                \App\Models\Unit::where('id', $tenant->unit_id)->update(['status' => 'occupied']);
            }
            
            return $tenant;
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Tenant $tenant)
    {
        return $tenant->load('unit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'unit_id' => 'nullable|exists:units,id',
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'payment_due_day' => 'nullable|integer|min:1|max:31',
        ]);

        return \DB::transaction(function() use ($validated, $tenant) {
            $oldUnitId = $tenant->unit_id;
            $tenant->update($validated);
            $newUnitId = $tenant->unit_id;

            if ($oldUnitId !== $newUnitId) {
                if ($oldUnitId) {
                    \App\Models\Unit::where('id', $oldUnitId)->update(['status' => 'vacant']);
                }
                if ($newUnitId) {
                    \App\Models\Unit::where('id', $newUnitId)->update(['status' => 'occupied']);
                }
            }

            return $tenant;
        });
    }

    public function destroy(Tenant $tenant)
    {
        if ($tenant->unit_id) {
            $unit = $tenant->unit;
            if ($unit) {
                $unit->update(['status' => 'vacant']);
            }
            $tenant->unit_id = null;
            $tenant->save();
        }
        $tenant->delete();
        return response()->noContent();
    }
}
