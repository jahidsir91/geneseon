import urllib.request
import sys

files = [
  'index.html',
  'css/main.css', 'css/components.css', 'css/landing.css', 'css/dashboard.css', 
  'css/learn.css', 'css/exam.css', 'css/question-bank.css', 'css/ai.css', 
  'css/store.css', 'css/admin.css', 'css/mobile.css',
  'js/app.js', 'js/db.js', 'js/auth.js', 'js/i18n.js',
  'js/utils/helpers.js', 'js/utils/toast.js', 'js/utils/modal.js',
  'js/services/aiService.js', 'js/services/paymentService.js', 'js/services/examService.js',
  'js/views/landingView.js', 'js/views/coursesView.js', 'js/views/learnView.js',
  'js/views/examView.js', 'js/views/questionBankView.js', 'js/views/aiView.js',
  'js/views/storeView.js', 'js/views/dashboardView.js', 'js/views/studentViews.js',
  'js/views/adminView.js', 'js/views/authView.js'
]

passed = 0
failed = 0

for f in files:
    url = f'http://localhost:8000/{f}'
    try:
        req = urllib.request.urlopen(url)
        content = req.read()
        print(f"PASS: {f} -> {req.status} OK ({len(content)} bytes)")
        passed += 1
    except Exception as e:
        print(f"FAIL: {f} -> {e}")
        failed += 1

print(f"\n==========================================")
print(f"SUMMARY: {passed} passed, {failed} failed out of {len(files)} files.")
print(f"==========================================")
if failed > 0:
    sys.exit(1)
