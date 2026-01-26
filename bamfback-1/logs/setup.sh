#!/bin/bash

echo "🚀 Setting up BAMF Backend Project..."

# 1. Logs-Ordner erstellen
echo "📁 Creating logs directory..."
mkdir -p logs

# 2. Node modules installieren
echo "📦 Installing dependencies..."
npm install

# 3. Datenbank zurücksetzen
echo "🗄️ Resetting database..."
npm run reset-db

# 4. Migrationen ausführen
echo "🔄 Running migrations..."
npm run migrate

# 5. Seed-Daten einfügen
echo "🌱 Seeding database..."
npm run seed

echo "✅ Setup complete! You can now start the server with: npm start"