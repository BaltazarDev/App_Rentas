<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\StatsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/stats', [StatsController::class, 'getStats']);
Route::get('/tenants-pending', [StatsController::class, 'getPendingPayments']);

Route::apiResource('houses', HouseController::class);
Route::apiResource('units', UnitController::class);
Route::apiResource('tenants', TenantController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('expenses', ExpenseController::class);
