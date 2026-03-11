# Test Script for Physical AI Textbook (PowerShell)
# This script verifies all components are correctly set up

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Physical AI Textbook - Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test counter
$TESTS_PASSED = 0
$TESTS_FAILED = 0

# Function to print test result
function Print-Result {
    param($success, $message)
    if ($success) {
        Write-Host "✓ $message" -ForegroundColor Green
        $script:TESTS_PASSED++
    } else {
        Write-Host "✗ $message" -ForegroundColor Red
        $script:TESTS_FAILED++
    }
}

Write-Host "1. Checking Node.js and npm..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Print-Result ($LASTEXITCODE -eq 0) "Node.js is installed ($nodeVersion)"
} catch {
    Print-Result $false "Node.js is not installed"
}

try {
    $npmVersion = npm --version 2>&1
    Print-Result ($LASTEXITCODE -eq 0) "npm is installed ($npmVersion)"
} catch {
    Print-Result $false "npm is not installed"
}

Write-Host ""
Write-Host "2. Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Print-Result ($LASTEXITCODE -eq 0) "Python is installed ($pythonVersion)"
} catch {
    Print-Result $false "Python is not installed"
}

Write-Host ""
Write-Host "3. Checking Project Structure..." -ForegroundColor Yellow

# Check frontend files
Print-Result (Test-Path "package.json") "package.json exists"
Print-Result (Test-Path "docusaurus.config.ts") "docusaurus.config.ts exists"
Print-Result (Test-Path "sidebars.ts") "sidebars.ts exists"

# Check docs
Print-Result (Test-Path "docs" -PathType Container) "docs directory exists"
Print-Result (Test-Path "docs/index.mdx") "docs/index.mdx exists"
Print-Result (Test-Path "docs/glossary.md") "docs/glossary.md exists"
Print-Result (Test-Path "docs/modules" -PathType Container) "docs/modules directory exists"

# Check components
Print-Result (Test-Path "src/components" -PathType Container) "src/components directory exists"
Print-Result (Test-Path "src/components/Chatbot/Chatbot.tsx") "Chatbot component exists"
Print-Result (Test-Path "src/components/Auth/AuthContext.tsx") "Auth context exists"
Print-Result (Test-Path "src/components/Personalization/PersonalizationPanel.tsx") "Personalization component exists"
Print-Result (Test-Path "src/components/Translation/TranslationPanel.tsx") "Translation component exists"

# Check pages
Print-Result (Test-Path "src/pages/auth.tsx") "Auth page exists"

Write-Host ""
Write-Host "4. Checking Backend..." -ForegroundColor Yellow

Print-Result (Test-Path "backend" -PathType Container) "backend directory exists"
Print-Result (Test-Path "backend/main.py") "backend/main.py exists"
Print-Result (Test-Path "backend/requirements.txt") "backend/requirements.txt exists"
Print-Result (Test-Path "backend/auth.ts") "backend/auth.ts exists"
Print-Result (Test-Path "backend/.env.example") "backend/.env.example exists"
Print-Result (Test-Path "backend/README.md") "backend/README.md exists"

Write-Host ""
Write-Host "5. Checking Claude Code Subagents & Skills..." -ForegroundColor Yellow

Print-Result (Test-Path ".qwen" -PathType Container) ".qwen directory exists"
Print-Result (Test-Path ".qwen/subagents" -PathType Container) ".qwen/subagents directory exists"
Print-Result (Test-Path ".qwen/skills" -PathType Container) ".qwen/skills directory exists"

# Check subagents
Print-Result (Test-Path ".qwen/subagents/content-writer.md") "content-writer subagent exists"
Print-Result (Test-Path ".qwen/subagents/code-generator.md") "code-generator subagent exists"
Print-Result (Test-Path ".qwen/subagents/diagram-generator.md") "diagram-generator subagent exists"
Print-Result (Test-Path ".qwen/subagents/exercise-generator.md") "exercise-generator subagent exists"
Print-Result (Test-Path ".qwen/subagents/reviewer.md") "reviewer subagent exists"

# Check skills
Print-Result (Test-Path ".qwen/skills/index-chapter-content.md") "index-chapter-content skill exists"
Print-Result (Test-Path ".qwen/skills/extract-glossary-terms.md") "extract-glossary-terms skill exists"
Print-Result (Test-Path ".qwen/skills/validate-build.md") "validate-build skill exists"
Print-Result (Test-Path ".qwen/skills/deploy-to-github-pages.md") "deploy-to-github-pages skill exists"
Print-Result (Test-Path ".qwen/skills/SKILLS.md") "SKILLS.md documentation exists"

Write-Host ""
Write-Host "6. Checking Documentation..." -ForegroundColor Yellow

Print-Result (Test-Path "README.md") "README.md exists"
Print-Result (Test-Path "run.md") "run.md exists"
Print-Result (Test-Path "SETUP.md") "SETUP.md exists"
Print-Result (Test-Path "DEMO_VIDEO.md") "DEMO_VIDEO.md exists"
Print-Result (Test-Path "SUBMISSION.md") "SUBMISSION.md exists"
Print-Result (Test-Path "QWEN.md") "QWEN.md exists"

Write-Host ""
Write-Host "7. Checking GitHub Actions..." -ForegroundColor Yellow

Print-Result (Test-Path ".github/workflows" -PathType Container) ".github/workflows directory exists"
Print-Result (Test-Path ".github/workflows/deploy.yml") "deploy.yml workflow exists"

Write-Host ""
Write-Host "8. Syntax Validation..." -ForegroundColor Yellow

# Check Python syntax
try {
    python -m py_compile backend/main.py 2>&1
    Print-Result ($LASTEXITCODE -eq 0) "backend/main.py syntax is valid"
} catch {
    Print-Result $false "backend/main.py syntax error"
}

# Check package.json is valid JSON
try {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    Print-Result $true "package.json is valid JSON"
} catch {
    Print-Result $false "package.json is invalid"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passed: $TESTS_PASSED" -ForegroundColor Green
Write-Host "Failed: $TESTS_FAILED" -ForegroundColor Red
Write-Host ""

if ($TESTS_FAILED -eq 0) {
    Write-Host "All tests passed! ✓" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Install dependencies: npm install"
    Write-Host "2. Configure backend: cd backend && cp .env.example .env"
    Write-Host "3. Edit .env with your API keys"
    Write-Host "4. Install Python deps: pip install -r requirements.txt"
    Write-Host "5. Run: npm run dev:all"
    exit 0
} else {
    Write-Host "Some tests failed. Please fix the issues above." -ForegroundColor Red
    exit 1
}
