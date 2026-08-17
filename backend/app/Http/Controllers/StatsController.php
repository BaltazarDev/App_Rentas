<?php

namespace App\Http\Controllers;

use App\Models\House;
use App\Models\Unit;
use App\Models\Tenant;
use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatsController extends Controller
{
    public function getStats()
    {
        $totalHouses = House::count();
        $totalUnits = Unit::count();
        $occupiedUnits = Unit::where('status', 'occupied')->count();
        $vacantUnits = Unit::where('status', 'vacant')->count();

        // Financial stats (last 6 months)
        $months = [];
        $incomeData = [];
        $expenseData = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->format('M Y');

            $months[] = $monthName;

            // Income in this month
            $income = Payment::where('status', 'paid')
                ->whereYear('payment_date', $date->year)
                ->whereMonth('payment_date', $date->month)
                ->sum('amount');
            $incomeData[] = (float)$income;

            // Expenses in this month
            $expense = Expense::whereYear('expense_date', $date->year)
                ->whereMonth('expense_date', $date->month)
                ->sum('amount');
            $expenseData[] = (float)$expense;
        }

        // Current month summaries
        $currentMonthIncome = end($incomeData);
        $currentMonthExpense = end($expenseData);

        return response()->json([
            'summary' => [
                'total_houses' => $totalHouses,
                'total_units' => $totalUnits,
                'occupied_units' => $occupiedUnits,
                'vacant_units' => $vacantUnits,
                'occupancy_rate' => $totalUnits > 0 ? round(($occupiedUnits / $totalUnits) * 100, 2) : 0,
                'current_month_income' => $currentMonthIncome,
                'current_month_expense' => $currentMonthExpense,
            ],
            'charts' => [
                'labels' => $months,
                'income' => $incomeData,
                'expenses' => $expenseData,
            ]
        ]);
    }

    public function getPendingPayments()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Get all active tenants
        $tenants = Tenant::with(['unit.house'])->get();

        $pending = [];

        foreach ($tenants as $tenant) {
            if (!$tenant->unit) continue;

            // Check if there is a paid rent payment for this unit in the current month
            $hasPaid = Payment::where('unit_id', $tenant->unit_id)
                ->where('type', 'rent')
                ->where('status', 'paid')
                ->whereYear('payment_date', $currentYear)
                ->whereMonth('payment_date', $currentMonth)
                ->exists();

            if (!$hasPaid) {
                // Calculate due date
                $dueDay = $tenant->payment_due_day ?: 5;
                // Clamp due day
                $dueDay = min(28, max(1, $dueDay)); // safety for Feb
                $dueDate = Carbon::create($currentYear, $currentMonth, $dueDay);

                $pending[] = [
                    'tenant_id' => $tenant->id,
                    'tenant_name' => $tenant->full_name,
                    'phone' => $tenant->phone,
                    'unit_id' => $tenant->unit_id,
                    'unit_name' => $tenant->unit->name,
                    'house_name' => $tenant->unit->house->name ?? 'N/A',
                    'due_date' => $dueDate->format('Y-m-d'),
                    'amount' => (float)$tenant->unit->base_rent_cost,
                    'days_late' => Carbon::now()->diffInDays($dueDate, false) < 0 
                        ? abs(Carbon::now()->diffInDays($dueDate, false)) 
                        : 0,
                    'is_overdue' => Carbon::now()->greaterThan($dueDate)
                ];
            }
        }

        return response()->json($pending);
    }
}
