#!/bin/sh
set -e

# Wait for the database connection to be ready
echo "Waiting for database connection..."
until php -r '
$host = getenv("DB_HOST") ?: "mysql";
$port = getenv("DB_PORT") ?: "3306";
$db   = getenv("DB_DATABASE") ?: "rent_control";
$user = getenv("DB_USERNAME") ?: "user";
$pass = getenv("DB_PASSWORD") ?: "";
try {
    new PDO("mysql:host=$host;port=$port;dbname=$db", $user, $pass);
    exit(0);
} catch (Exception $e) {
    exit(1);
}
' 2>/dev/null; do
    echo "Database is not ready yet, retrying in 2 seconds..."
    sleep 2
done
echo "Database connection established!"

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Run database seeders (idempotent)
echo "Running database seeders..."
php artisan db:seed --force

# Execute the main container command
exec "$@"
