"""
Geneseon Academy - Standalone JavaScript Bundler
Creates a single, self-contained bundle.js without ES module requirements,
allowing the app to run seamlessly both via http:// and by double-clicking index.html (file://)
"""
import re
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

ORDER = [
    'js/utils/helpers.js',
    'js/utils/toast.js',
    'js/utils/modal.js',
    'js/i18n.js',
    'js/db.js',
    'js/auth.js',
    'js/services/aiService.js',
    'js/services/paymentService.js',
    'js/services/examService.js',
    'js/views/landingView.js',
    'js/views/coursesView.js',
    'js/views/learnView.js',
    'js/views/examView.js',
    'js/views/questionBankView.js',
    'js/views/aiView.js',
    'js/views/storeView.js',
    'js/views/dashboardView.js',
    'js/views/studentViews.js',
    'js/views/adminView.js',
    'js/views/authView.js',
    'js/app.js'
]

bundle_parts = []
bundle_parts.append("/* ==========================================================================\n   GENESEON ACADEMY - STANDALONE UNIVERSAL BUNDLE (FILE & HTTP COMPATIBLE)\n   ========================================================================== */\n(function() {\n'use strict';\n")

for rel_path in ORDER:
    full_path = os.path.join(BASE_DIR, rel_path)
    with open(full_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # Strip imports
    code = re.sub(r'^\s*import\s+.*?;\s*$', '', code, flags=re.MULTILINE)
    code = re.sub(r'^\s*import\s*\{[^}]*\}\s*from\s*[\'"][^\'"]*[\'"];\s*$', '', code, flags=re.MULTILINE)
    code = re.sub(r'^\s*import\s+[\'"][^\'"]*[\'"];\s*$', '', code, flags=re.MULTILINE)

    # Convert named exports to declarations
    # e.g., "export const LandingView =" -> "const LandingView = window.LandingView ="
    # "export function formatBDT(" -> "function formatBDT(" + window.formatBDT = formatBDT
    # "export class App {" -> "class App {" + window.App = App
    code = re.sub(r'^\s*export\s+const\s+(\w+)\s*=', r'window.\1 = const \1 =', code, flags=re.MULTILINE)
    # fix "window.X = const X =" to "const X = window.X ="
    code = re.sub(r'window\.(\w+)\s*=\s*const\s+\1\s*=', r'const \1 = window.\1 =', code, flags=re.MULTILINE)
    code = re.sub(r'^\s*export\s+let\s+(\w+)\s*=', r'let \1 = window.\1 =', code, flags=re.MULTILINE)
    code = re.sub(r'^\s*export\s+function\s+(\w+)', r'window.\1 = function \1', code, flags=re.MULTILINE)
    code = re.sub(r'^\s*export\s+class\s+(\w+)', r'class \1', code, flags=re.MULTILINE)

    bundle_parts.append(f"\n/* --- [{rel_path}] --- */\n" + code)

bundle_parts.append("\n})();\n")

bundle_content = "\n".join(bundle_parts)

out_file = os.path.join(BASE_DIR, 'js', 'bundle.js')
with open(out_file, 'w', encoding='utf-8') as f:
    f.write(bundle_content)

print(f"Successfully generated {out_file} ({len(bundle_content)} bytes)")
