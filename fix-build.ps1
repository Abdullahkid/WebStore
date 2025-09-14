# fix-build.ps1
# Save this file in: C:\Users\PC\DownXtown\Webstore\webstore\fix-build.ps1

Write-Host "Starting Webstore Build Fix..." -ForegroundColor Green

# Step 1: Clean existing build artifacts and caches
Write-Host "`nStep 1: Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "Removed .next folder" -ForegroundColor Gray
}
if (Test-Path "out") {
    Remove-Item -Path "out" -Recurse -Force
    Write-Host "Removed out folder" -ForegroundColor Gray
}
if (Test-Path "node_modules/.cache") {
    Remove-Item -Path "node_modules/.cache" -Recurse -Force
    Write-Host "Removed node_modules cache" -ForegroundColor Gray
}

# Step 2: Clear npm cache
Write-Host "`nStep 2: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Step 3: Remove node_modules and package-lock.json
Write-Host "`nStep 3: Removing node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Path "node_modules" -Recurse -Force
    Write-Host "Removed node_modules" -ForegroundColor Gray
}
if (Test-Path "package-lock.json") {
    Remove-Item -Path "package-lock.json" -Force
    Write-Host "Removed package-lock.json" -ForegroundColor Gray
}

# Step 4: Install rimraf globally if not present
Write-Host "`nStep 4: Installing rimraf globally..." -ForegroundColor Yellow
npm install -g rimraf cross-env

# Step 5: Fresh install of dependencies
Write-Host "`nStep 5: Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 6: Install the missing dependency
Write-Host "`nStep 6: Installing rimraf as dev dependency..." -ForegroundColor Yellow
npm install --save-dev rimraf

# Step 7: Set environment variables for this session
Write-Host "`nStep 7: Setting environment variables..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--max-old-space-size=8192 --no-warnings"
$env:UV_THREADPOOL_SIZE = "1"
$env:NEXT_TELEMETRY_DISABLED = "1"

# Step 8: Try to build
Write-Host "`nStep 8: Running build..." -ForegroundColor Yellow
npm run build

Write-Host "`nBuild process completed!" -ForegroundColor Green
Write-Host "If the build still fails, try running: npm run build:clean" -ForegroundColor Cyan