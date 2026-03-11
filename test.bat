@echo off
REM Test Script for Physical AI Textbook (Windows Batch)
REM This script verifies all components are correctly set up

echo ========================================
echo Physical AI Textbook - Test Suite
echo ========================================
echo.

set TESTS_PASSED=0
set TESTS_FAILED=0

REM Function to check file/folder
:check_exists
if exist "%~1" (
    echo [OK] %~1
    set /a TESTS_PASSED+=1
) else (
    echo [MISSING] %~1
    set /a TESTS_FAILED+=1
)
goto :eof

echo 1. Checking Node.js and npm...
where node >nul 2>&1 && (echo [OK] Node.js is installed & set /a TESTS_PASSED+=1) || (echo [MISSING] Node.js & set /a TESTS_FAILED+=1)
where npm >nul 2>&1 && (echo [OK] npm is installed & set /a TESTS_PASSED+=1) || (echo [MISSING] npm & set /a TESTS_FAILED+=1)

echo.
echo 2. Checking Python...
where python >nul 2>&1 && (echo [OK] Python is installed & set /a TESTS_PASSED+=1) || (echo [MISSING] Python & set /a TESTS_FAILED+=1)

echo.
echo 3. Checking Project Structure...
call :check_exists "package.json"
call :check_exists "docusaurus.config.ts"
call :check_exists "sidebars.ts"
call :check_exists "docs"
call :check_exists "docs\index.mdx"
call :check_exists "docs\modules"
call :check_exists "src\components"
call :check_exists "src\components\Chatbot\Chatbot.tsx"
call :check_exists "src\components\Auth\AuthContext.tsx"
call :check_exists "src\components\Personalization\PersonalizationPanel.tsx"
call :check_exists "src\components\Translation\TranslationPanel.tsx"
call :check_exists "src\pages\auth.tsx"

echo.
echo 4. Checking Backend...
call :check_exists "backend"
call :check_exists "backend\main.py"
call :check_exists "backend\requirements.txt"
call :check_exists "backend\auth.ts"
call :check_exists "backend\.env.example"
call :check_exists "backend\README.md"

echo.
echo 5. Checking Claude Code Subagents and Skills...
call :check_exists ".qwen"
call :check_exists ".qwen\subagents"
call :check_exists ".qwen\skills"
call :check_exists ".qwen\subagents\content-writer.md"
call :check_exists ".qwen\subagents\code-generator.md"
call :check_exists ".qwen\subagents\diagram-generator.md"
call :check_exists ".qwen\subagents\exercise-generator.md"
call :check_exists ".qwen\subagents\reviewer.md"
call :check_exists ".qwen\skills\index-chapter-content.md"
call :check_exists ".qwen\skills\extract-glossary-terms.md"
call :check_exists ".qwen\skills\validate-build.md"
call :check_exists ".qwen\skills\deploy-to-github-pages.md"
call :check_exists ".qwen\skills\SKILLS.md"

echo.
echo 6. Checking Documentation...
call :check_exists "README.md"
call :check_exists "run.md"
call :check_exists "SETUP.md"
call :check_exists "DEMO_VIDEO.md"
call :check_exists "SUBMISSION.md"
call :check_exists "QWEN.md"

echo.
echo 7. Checking GitHub Actions...
call :check_exists ".github\workflows"
call :check_exists ".github\workflows\deploy.yml"

echo.
echo 8. Syntax Validation...
python -m py_compile backend\main.py 2>nul && (echo [OK] backend/main.py syntax valid & set /a TESTS_PASSED+=1) || (echo [FAIL] backend/main.py syntax error & set /a TESTS_FAILED+=1)

echo.
echo ========================================
echo Test Summary
echo ========================================
echo Passed: %TESTS_PASSED%
echo Failed: %TESTS_FAILED%
echo.

if %TESTS_FAILED%==0 (
    echo [SUCCESS] All tests passed!
    echo.
    echo Next steps:
    echo 1. Install dependencies: npm install
    echo 2. Configure backend: cd backend ^&^& copy .env.example .env
    echo 3. Edit .env with your API keys
    echo 4. Install Python deps: pip install -r requirements.txt
    echo 5. Run: npm run dev:all
    exit /b 0
) else (
    echo [ERROR] Some tests failed. Please fix the issues above.
    exit /b 1
)
