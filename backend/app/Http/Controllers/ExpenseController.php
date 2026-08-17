<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Expense;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Expense::query();

        if ($request->has('house_id')) {
            $query->where('house_id', $request->house_id);
        }
        if ($request->has('unit_id')) {
            $query->where('unit_id', $request->unit_id);
        }

        return $query->with(['house', 'unit'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'nullable|exists:houses,id',
            'unit_id' => 'nullable|exists:units,id',
            'type' => 'required|string',
            'amount' => 'required|numeric',
            'expense_date' => 'required|date',
            'paid_by_owner' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        return Expense::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        return $expense->load(['house', 'unit']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string',
            'amount' => 'sometimes|numeric',
            'expense_date' => 'sometimes|date',
            'paid_by_owner' => 'sometimes|boolean',
            'notes' => 'nullable|string',
        ]);

        $expense->update($validated);
        return $expense;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->noContent();
    }
}
