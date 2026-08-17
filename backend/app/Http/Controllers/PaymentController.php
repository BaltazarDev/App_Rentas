<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Payment;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Payment::query();

        if ($request->has('unit_id')) {
            $query->where('unit_id', $request->unit_id);
        }

        return $query->with(['unit.house', 'unit.tenant'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_id' => 'required|exists:units,id',
            'amount' => 'required|numeric',
            'payment_date' => 'required|date',
            'type' => 'required|string',
            'status' => 'string',
            'notes' => 'nullable|string',
        ]);

        return Payment::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        return $payment->load('unit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'amount' => 'sometimes|numeric',
            'payment_date' => 'sometimes|date',
            'type' => 'sometimes|string',
            'status' => 'sometimes|string',
            'notes' => 'nullable|string',
        ]);

        $payment->update($validated);
        return $payment;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->noContent();
    }
}
