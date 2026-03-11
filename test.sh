#!/bin/bash
# Test Script for Physical AI Textbook
# This script verifies all components are correctly set up

echo "========================================"
echo "Physical AI Textbook - Test Suite"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((TESTS_FAILED++))
    fi
}

echo "1. Checking Node.js and npm..."
node --version > /dev/null 2>&1
print_result $? "Node.js is installed"

npm --version > /dev/null 2>&1
print_result $? "npm is installed"

echo ""
echo "2. Checking Python..."
python --version > /dev/null 2>&1
print_result $? "Python is installed"

python -c "import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)" 2>&1
print_result $? "Python version >= 3.9"

echo ""
echo "3. Checking Project Structure..."

# Check frontend files
[ -f "package.json" ] && print_result 0 "package.json exists" || print_result 1 "package.json missing"
[ -f "docusaurus.config.ts" ] && print_result 0 "docusaurus.config.ts exists" || print_result 1 "docusaurus.config.ts missing"
[ -f "sidebars.ts" ] && print_result 0 "sidebars.ts exists" || print_result 1 "sidebars.ts missing"

# Check docs
[ -d "docs" ] && print_result 0 "docs directory exists" || print_result 1 "docs directory missing"
[ -f "docs/index.mdx" ] && print_result 0 "docs/index.mdx exists" || print_result 1 "docs/index.mdx missing"
[ -f "docs/glossary.md" ] && print_result 0 "docs/glossary.md exists" || print_result 1 "docs/glossary.md missing"

# Check modules
[ -d "docs/modules" ] && print_result 0 "docs/modules directory exists" || print_result 1 "docs/modules directory missing"

# Check components
[ -d "src/components" ] && print_result 0 "src/components directory exists" || print_result 1 "src/components directory missing"
[ -f "src/components/Chatbot/Chatbot.tsx" ] && print_result 0 "Chatbot component exists" || print_result 1 "Chatbot component missing"
[ -f "src/components/Auth/AuthContext.tsx" ] && print_result 0 "Auth context exists" || print_result 1 "Auth context missing"
[ -f "src/components/Personalization/PersonalizationPanel.tsx" ] && print_result 0 "Personalization component exists" || print_result 1 "Personalization component missing"
[ -f "src/components/Translation/TranslationPanel.tsx" ] && print_result 0 "Translation component exists" || print_result 1 "Translation component missing"

# Check pages
[ -f "src/pages/auth.tsx" ] && print_result 0 "Auth page exists" || print_result 1 "Auth page missing"

echo ""
echo "4. Checking Backend..."

[ -d "backend" ] && print_result 0 "backend directory exists" || print_result 1 "backend directory missing"
[ -f "backend/main.py" ] && print_result 0 "backend/main.py exists" || print_result 1 "backend/main.py missing"
[ -f "backend/requirements.txt" ] && print_result 0 "backend/requirements.txt exists" || print_result 1 "backend/requirements.txt missing"
[ -f "backend/auth.ts" ] && print_result 0 "backend/auth.ts exists" || print_result 1 "backend/auth.ts missing"
[ -f "backend/.env.example" ] && print_result 0 "backend/.env.example exists" || print_result 1 "backend/.env.example missing"

echo ""
echo "5. Checking Claude Code Subagents & Skills..."

[ -d ".qwen" ] && print_result 0 ".qwen directory exists" || print_result 1 ".qwen directory missing"
[ -d ".qwen/subagents" ] && print_result 0 ".qwen/subagents directory exists" || print_result 1 ".qwen/subagents directory missing"
[ -d ".qwen/skills" ] && print_result 0 ".qwen/skills directory exists" || print_result 1 ".qwen/skills directory missing"

# Check subagents
[ -f ".qwen/subagents/content-writer.md" ] && print_result 0 "content-writer subagent exists" || print_result 1 "content-writer missing"
[ -f ".qwen/subagents/code-generator.md" ] && print_result 0 "code-generator subagent exists" || print_result 1 "code-generator missing"
[ -f ".qwen/subagents/diagram-generator.md" ] && print_result 0 "diagram-generator subagent exists" || print_result 1 "diagram-generator missing"
[ -f ".qwen/subagents/exercise-generator.md" ] && print_result 0 "exercise-generator subagent exists" || print_result 1 "exercise-generator missing"
[ -f ".qwen/subagents/reviewer.md" ] && print_result 0 "reviewer subagent exists" || print_result 1 "reviewer missing"

# Check skills
[ -f ".qwen/skills/index-chapter-content.md" ] && print_result 0 "index-chapter-content skill exists" || print_result 1 "index-chapter-content missing"
[ -f ".qwen/skills/extract-glossary-terms.md" ] && print_result 0 "extract-glossary-terms skill exists" || print_result 1 "extract-glossary-terms missing"
[ -f ".qwen/skills/validate-build.md" ] && print_result 0 "validate-build skill exists" || print_result 1 "validate-build missing"
[ -f ".qwen/skills/deploy-to-github-pages.md" ] && print_result 0 "deploy-to-github-pages skill exists" || print_result 1 "deploy-to-github-pages missing"
[ -f ".qwen/skills/SKILLS.md" ] && print_result 0 "SKILLS.md documentation exists" || print_result 1 "SKILLS.md missing"

echo ""
echo "6. Checking Documentation..."

[ -f "README.md" ] && print_result 0 "README.md exists" || print_result 1 "README.md missing"
[ -f "run.md" ] && print_result 0 "run.md exists" || print_result 1 "run.md missing"
[ -f "SETUP.md" ] && print_result 0 "SETUP.md exists" || print_result 0 "SETUP.md missing"
[ -f "DEMO_VIDEO.md" ] && print_result 0 "DEMO_VIDEO.md exists" || print_result 1 "DEMO_VIDEO.md missing"
[ -f "SUBMISSION.md" ] && print_result 0 "SUBMISSION.md exists" || print_result 1 "SUBMISSION.md missing"

echo ""
echo "7. Checking GitHub Actions..."

[ -d ".github/workflows" ] && print_result 0 ".github/workflows directory exists" || print_result 1 ".github/workflows directory missing"
[ -f ".github/workflows/deploy.yml" ] && print_result 0 "deploy.yml workflow exists" || print_result 1 "deploy.yml workflow missing"

echo ""
echo "8. Syntax Validation..."

# Check Python syntax
python -m py_compile backend/main.py 2>/dev/null
print_result $? "backend/main.py syntax is valid"

# Check TypeScript config syntax
node -e "require('fs').readFileSync('docusaurus.config.ts', 'utf8')" 2>/dev/null
print_result $? "docusaurus.config.ts is readable"

echo ""
echo "========================================"
echo "Test Summary"
echo "========================================"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Install dependencies: npm install"
    echo "2. Configure backend: cd backend && cp .env.example .env"
    echo "3. Edit .env with your API keys"
    echo "4. Install Python deps: pip install -r requirements.txt"
    echo "5. Run: npm run dev:all"
    exit 0
else
    echo -e "${RED}Some tests failed. Please fix the issues above.${NC}"
    exit 1
fi
