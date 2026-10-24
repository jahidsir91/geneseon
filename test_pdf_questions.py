import base64
import json
import sys
import tempfile
import unittest
from urllib.error import HTTPError
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock, Mock, patch

import pymupdf
from pdf_questions import (
    _get_gemini_api_key,
    _gemini_ocr_page,
    _gemini_ocr_pdf,
    _get_gemini_model,
    _ocr_pdf,
    GeminiRateLimitError,
    extract_questions,
    generate_study_assistant_response,
    generate_question_solution,
    parse_mcq_text,
)


class PdfQuestionParsingTests(unittest.TestCase):
    def setUp(self):
        self.local_key_patch = patch.dict(sys.modules, {
            "gemini_local": SimpleNamespace(GEMINI_API_KEY="")
        })
        self.local_key_patch.start()
        self.addCleanup(self.local_key_patch.stop)

    def test_gemini_key_reads_private_user_config_file(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            key_file = Path(temporary_directory) / ".jaacademy" / "gemini_api_key.txt"
            key_file.parent.mkdir()
            key_file.write_text(" local-test-key \n", encoding="utf-8")
            with (
                patch("pdf_questions.Path.home", return_value=Path(temporary_directory)),
                patch.dict("os.environ", {"GEMINI_API_KEY": ""}),
            ):
                self.assertEqual(_get_gemini_api_key(), "local-test-key")

    def test_gemini_key_reads_local_code_config(self):
        with patch.dict("sys.modules", {
            "gemini_local": SimpleNamespace(GEMINI_API_KEY=" local-code-key ")
        }), patch.dict("os.environ", {"GEMINI_API_KEY": ""}):
            self.assertEqual(_get_gemini_api_key(), "local-code-key")

    def test_gemini_environment_key_takes_precedence_over_config_file(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            key_file = Path(temporary_directory) / ".jaacademy" / "gemini_api_key.txt"
            key_file.parent.mkdir()
            key_file.write_text("file-key", encoding="utf-8")
            with (
                patch("pdf_questions.Path.home", return_value=Path(temporary_directory)),
                patch.dict("os.environ", {"GEMINI_API_KEY": "environment-key"}),
            ):
                self.assertEqual(_get_gemini_api_key(), "environment-key")

    def test_gemini_model_reads_local_code_config(self):
        with patch.dict("sys.modules", {
            "gemini_local": SimpleNamespace(
                GEMINI_API_KEY="",
                GEMINI_MODEL=" Gemini Test Model ",
            )
        }), patch.dict("os.environ", {"GEMINI_MODEL": ""}):
            self.assertEqual(_get_gemini_model(), "gemini-test-model")

    def test_gemini_model_environment_takes_precedence(self):
        with patch.dict("sys.modules", {
            "gemini_local": SimpleNamespace(GEMINI_MODEL="local-model")
        }), patch.dict("os.environ", {"GEMINI_MODEL": "environment-model"}):
            self.assertEqual(_get_gemini_model(), "environment-model")

    def test_gemini_model_uses_default_without_configuration(self):
        with patch.dict("sys.modules", {
            "gemini_local": SimpleNamespace(GEMINI_API_KEY="")
        }), patch.dict("os.environ", {"GEMINI_MODEL": ""}):
            self.assertEqual(_get_gemini_model(), "gemini-3.8-flash")

    def test_gemini_question_solution_returns_model_output(self):
        question = {
            "questionType": "MCQ",
            "text": "পানির রাসায়নিক সংকেত কী?",
            "options": ["CO2", "H2O"],
            "correctIndex": 1,
            "explanation": "পানিতে হাইড্রোজেন ও অক্সিজেন আছে।",
        }
        response = MagicMock()
        response.read.return_value = json.dumps({
            "steps": [{
                "type": "model_output",
                "content": [{"type": "text", "text": "সঠিক উত্তর H2O।"}],
            }],
        }).encode("utf-8")
        response.__enter__.return_value = response
        with (
            patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}),
            patch("pdf_questions.urlopen", return_value=response) as urlopen,
        ):
            solution = generate_question_solution(question, "HSC")

        self.assertEqual(solution, "সঠিক উত্তর H2O।")
        request = urlopen.call_args.args[0]
        self.assertEqual(request.get_header("X-goog-api-key"), "test-key")
        payload = json.loads(request.data)
        self.assertFalse(payload["store"])
        self.assertIn('"correctOption": "H2O"', payload["input"])

    def test_gemini_question_solution_reports_quota_limit_actionably(self):
        error_body = (
            b'{"error":{"message":"Rate limit exceeded","code":"too_many_requests"}}'
        )
        http_error = HTTPError(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            429,
            "Too Many Requests",
            {},
            Mock(read=Mock(return_value=error_body)),
        )
        with (
            patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}),
            patch("pdf_questions.urlopen", side_effect=http_error),
        ):
            with self.assertRaisesRegex(GeminiRateLimitError, "quota reset"):
                generate_question_solution({"text": "প্রশ্ন"}, "HSC")

    def test_gemini_study_assistant_supports_multilingual_question_bank_context(self):
        response = MagicMock()
        response.read.return_value = json.dumps({
            "steps": [{
                "type": "model_output",
                "content": [{"type": "text", "text": "সালোকসংশ্লেষণ হলো..."}],
            }],
        }).encode("utf-8")
        response.__enter__.return_value = response
        with (
            patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}),
            patch("pdf_questions.urlopen", return_value=response) as urlopen,
        ):
            answer = generate_study_assistant_response(
                "Explain photosynthesis ta ki?",
                "HSC",
                [{"id": "q1", "text": "সালোকসংশ্লেষণ কী?"}],
            )

        self.assertEqual(answer, "সালোকসংশ্লেষণ হলো...")
        request = urlopen.call_args.args[0]
        payload = json.loads(request.data)
        self.assertFalse(payload["store"])
        self.assertIn("Banglish", payload["input"])
        self.assertIn("Explain photosynthesis ta ki?", payload["input"])
        self.assertIn("সালোকসংশ্লেষণ কী?", payload["input"])

    def test_parses_english_mcq_and_answer_key(self):
        questions = parse_mcq_text(
            "1. What is 2 + 2?\n"
            "A) Three\nB) Four\nC) Five\nD) Six\nAnswer: B\n"
        )
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["text"], "What is 2 + 2?")
        self.assertEqual(questions[0]["options"], ["Three", "Four", "Five", "Six"])
        self.assertEqual(questions[0]["correctIndex"], 1)

    def test_applies_separate_english_numbered_answer_key(self):
        questions = parse_mcq_text(
            "1. What is 2 + 2?\nA) Three\nB) Four\nC) Five\nD) Six\n"
            "2. What is 3 + 3?\nA) Five\nB) Six\nC) Seven\nD) Eight\n"
            "Answer Key\n1. B  2. B\n"
        )
        self.assertEqual([question["correctIndex"] for question in questions], [1, 1])

    def test_parses_answers_on_same_line_as_answer_key_heading(self):
        questions = parse_mcq_text(
            "1. What is 2 + 2?\nA) Three\nB) Four\nC) Five\nD) Six\n"
            "Answer Key: 1. B\n"
        )
        self.assertEqual(questions[0]["correctIndex"], 1)

    def test_parses_bangla_mcq_and_leaves_missing_answer_for_admin(self):
        questions = parse_mcq_text(
            "১. বাংলাদেশের রাজধানী কোনটি?\n"
            "ক) ঢাকা\nখ) চট্টগ্রাম\nগ) সিলেট\nঘ) খুলনা\n"
        )
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["text"], "বাংলাদেশের রাজধানী কোনটি?")
        self.assertEqual(questions[0]["options"], ["ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা"])
        self.assertIsNone(questions[0]["correctIndex"])

    def test_parses_bangla_dari_question_and_option_markers(self):
        questions = parse_mcq_text(
            "১। বাংলাদেশের রাজধানী কোনটি?\n"
            "ক। ঢাকা\nখ। চট্টগ্রাম\nগ। সিলেট\nঘ। খুলনা\n"
            "উত্তরঃ ক\n"
        )
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["options"], ["ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা"])
        self.assertEqual(questions[0]["correctIndex"], 0)

    def test_parses_bangla_answer_with_option_text_after_marker(self):
        questions = parse_mcq_text(
            "১ . প্রশ্নটি কী?\n"
            "ক ) প্রথম\nখ ) দ্বিতীয়\nগ ) তৃতীয়\nঘ ) চতুর্থ\n"
            "উত্তর : খ ) দ্বিতীয়\n"
        )
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["correctIndex"], 1)
        self.assertEqual(questions[0]["options"][3], "চতুর্থ")

    def test_parses_realistic_bangla_sheet_with_correct_answer_and_explanation(self):
        questions = parse_mcq_text(
            "১ . রাজধানী কোনটি?\n"
            "ক ) ঢাকা খ ) চট্টগ্রাম\n"
            "গ ) সিলেট ঘ ) খুলনা\n"
            "সঠিক উত্তর : খ ) চট্টগ্রাম | ব্যাখ্যা : নমুনা ব্যাখ্যা\n"
            "২ . কোনটি নদী?\n"
            "ক ) ঢাকা খ ) পদ্মা\n"
            "গ ) সিলেট ঘ ) খুলনা\n"
            "সঠিক উত্তর : খ ) পদ্মা | ব্যাখ্যা : আরেকটি ব্যাখ্যা\n"
        )
        self.assertEqual(len(questions), 2)
        self.assertEqual([question["correctIndex"] for question in questions], [1, 1])
        self.assertEqual(questions[0]["options"], ["ঢাকা", "চট্টগ্রাম", "সিলেট", "খুলনা"])
        self.assertEqual(questions[0]["explanation"], "নমুনা ব্যাখ্যা")
        self.assertEqual(questions[1]["explanation"], "আরেকটি ব্যাখ্যা")

    def test_parses_multiline_explanation(self):
        questions = parse_mcq_text(
            "1. Question?\nA) One\nB) Two\nC) Three\nD) Four\n"
            "Explanation: First line\ncontinued explanation.\n"
            "2. Next question?\nA) One\nB) Two\nC) Three\nD) Four\n"
        )
        self.assertEqual(questions[0]["explanation"], "First line continued explanation.")
        self.assertEqual(questions[1]["explanation"], "")

    def test_parses_gemini_explanation_labels(self):
        questions = parse_mcq_text(
            "1. প্রশ্নটি কী?\nক) এক\nখ) দুই\nগ) তিন\nঘ) চার\n"
            "Answer: B\nReasoning: প্রথম ধাপের ব্যাখ্যা।\n"
            "2. আরেকটি প্রশ্ন?\nক) এক\nখ) দুই\nগ) তিন\nঘ) চার\n"
            "Answer: A\nউত্তরের ব্যাখ্যা: দ্বিতীয় ধাপ।\n"
        )
        self.assertEqual(len(questions), 2)
        self.assertEqual(questions[0]["explanation"], "প্রথম ধাপের ব্যাখ্যা।")
        self.assertEqual(questions[1]["explanation"], "দ্বিতীয় ধাপ।")

    def test_detects_explanation_when_pdf_text_contains_null_glyphs(self):
        questions = parse_mcq_text(
            "1. Question?\nA) One\nB) Two\nC) Three\nD) Four\n"
            "সঠিক উত্তর: খ) Two | ব্যা\x00খ্যা: This is the explanation.\n"
        )
        self.assertEqual(questions[0]["correctIndex"], 1)
        self.assertEqual(questions[0]["explanation"], "This is the explanation.")

    def test_detects_explanation_when_bengali_glyphs_are_lost_from_marker(self):
        questions = parse_mcq_text(
            "1. Question?\nA) One\nB) Two\nC) Three\nD) Four\n"
            "সঠিক উত্তর: খ) Two | বাখা: This explanation was extracted from PDF.\n"
        )
        self.assertEqual(questions[0]["explanation"], "This explanation was extracted from PDF.")

    def test_detects_explanation_from_inline_option_text_with_repeated_marks(self):
        questions = parse_mcq_text(
            "1. Question?\nA) One\nB) Two\nC) Three\n"
            "D) Four | ব্যাাাখ্যাা: This is the explanation.\n"
        )
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["options"][3], "Four")
        self.assertEqual(questions[0]["explanation"], "This is the explanation.")

    def test_stops_explanation_at_page_footer_and_revision_section(self):
        questions = parse_mcq_text(
            "1. Question?\nA) One\nB) Two\nC) Three\nD) Four\n"
            "Explanation: First explanation. পৃষ্ঠা ১ এর ২\n"
            "2. Next question?\nA) One\nB) Two\nC) Three\nD) Four\n"
            "Explanation: Second explanation. (Quick Revision) unrelated text\n"
            "3. Third question?\nA) One\nB) Two\nC) Three\nD) Four\n"
            "Explanation: Third explanation. একাদশ ICT _ অধ্যায় ১ (MCQ sheet)\n"
            "4. Fourth question?\nA) One\nB) Two\nC) Three\nD) Four\n"
            "Explanation: Fourth explanation. ক্ষ অধ্যায়-১ এর গুরুত্বপূর্ণ কীওয়ার্ড\n"
        )
        self.assertEqual(questions[0]["explanation"], "First explanation.")
        self.assertEqual(questions[1]["explanation"], "Second explanation.")
        self.assertEqual(questions[2]["explanation"], "Third explanation.")
        self.assertEqual(questions[3]["explanation"], "Fourth explanation.")

    def test_applies_separate_bangla_numbered_answer_key(self):
        questions = parse_mcq_text(
            "১। বাংলাদেশের রাজধানী কোনটি?\n"
            "ক। ঢাকা\nখ। চট্টগ্রাম\nগ। সিলেট\nঘ। খুলনা\n"
            "২। বাংলাদেশের দীর্ঘতম নদী কোনটি?\n"
            "ক। কর্ণফুলী\nখ। পদ্মা\nগ। মেঘনা\nঘ। যমুনা\n"
            "উত্তরমালা\n১। ক  ২। গ\n"
        )
        self.assertEqual([question["correctIndex"] for question in questions], [0, 2])

    def test_parses_question_prefix_in_extracted_text(self):
        questions = parse_mcq_text(
            "প্রশ্ন ১। বাংলাদেশের রাজধানী কোনটি?\n"
            "(ক) ঢাকা\n(খ) চট্টগ্রাম\n(গ) সিলেট\n(ঘ) খুলনা\n"
        )
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["text"], "বাংলাদেশের রাজধানী কোনটি?")

    def test_parses_inline_question_and_option_markers(self):
        questions = parse_mcq_text(
            "1. What is the capital of Bangladesh? A) Dhaka B) Chattogram "
            "C) Sylhet D) Khulna 2. Which one is a river? "
            "A) Dhaka B) Padma C) Rajshahi D) Khulna"
        )
        self.assertEqual(len(questions), 2)
        self.assertEqual(
            questions[0]["options"],
            ["Dhaka", "Chattogram", "Sylhet", "Khulna"],
        )
        self.assertEqual(questions[1]["text"], "Which one is a river?")

    def test_ignores_incomplete_questions(self):
        self.assertEqual(
            parse_mcq_text("1. Incomplete question\nA) One\nB) Two"),
            [],
        )

    def test_extracts_mcq_from_searchable_pdf(self):
        lines = [
            "1. What is 2 plus 2?",
            "A) Three",
            "B) Four",
            "C) Five",
            "D) Six",
            "Answer: B",
        ]
        with tempfile.TemporaryDirectory() as temporary_directory:
            path = Path(temporary_directory) / "questions.pdf"
            document = pymupdf.open()
            page = document.new_page()
            for index, line in enumerate(lines):
                page.insert_text((60, 80 + index * 32), line, fontsize=16)
            document.save(path)
            with (
                patch.dict("os.environ", {"GEMINI_API_KEY": ""}),
                patch("pdf_questions.Path.home", return_value=Path(temporary_directory)),
            ):
                questions, used_ocr = extract_questions(path)

        self.assertFalse(used_ocr)
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0]["correctIndex"], 1)

    def test_tesseract_ocr_uses_bengali_and_english(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            path = Path(temporary_directory) / "questions.pdf"
            with pymupdf.open() as document:
                document.new_page()
                document.save(path)
            result = Mock(returncode=0, stdout=b"OCR text", stderr=b"")
            with (
                patch("pdf_questions.shutil.which", return_value="tesseract.exe"),
                patch("pdf_questions.subprocess.run", return_value=result) as run,
                patch(
                    "pdf_questions.pymupdf.Page.get_pixmap",
                    return_value=Mock(),
                ) as get_pixmap,
            ):
                text = _ocr_pdf(path)

        self.assertEqual(text, "OCR text")
        matrix = get_pixmap.call_args.kwargs["matrix"]
        self.assertAlmostEqual(matrix.a, 1.7)
        self.assertAlmostEqual(matrix.d, 1.7)
        command = run.call_args.args[0]
        self.assertIn("-l", command)
        self.assertEqual(command[command.index("-l") + 1], "ben+eng")
        self.assertEqual(command[command.index("--psm") + 1], "6")

    def test_gemini_ocr_sends_page_image_and_returns_transcription(self):
        response = Mock()
        response.__enter__ = Mock(return_value=response)
        response.__exit__ = Mock(return_value=False)
        response.read.return_value = json.dumps({
            "steps": [{
                "type": "model_output",
                "content": [{"type": "text", "text": "১. প্রশ্ন?\nক) উত্তর"}],
            }]
        }).encode("utf-8")
        pixmap = Mock()
        pixmap.tobytes.return_value = b"page-image-bytes"
        page = Mock()
        page.get_pixmap.return_value = pixmap

        with (
            patch.dict("os.environ", {
                "GEMINI_API_KEY": "test-key",
                "GEMINI_MODEL": "gemini-3.8-flash",
            }),
            patch("pdf_questions.urlopen", return_value=response) as open_url,
        ):
            transcription = _gemini_ocr_page(page, 1)

        self.assertEqual(transcription, "১. প্রশ্ন?\nক) উত্তর")
        matrix = page.get_pixmap.call_args.kwargs["matrix"]
        self.assertAlmostEqual(matrix.a, 300 / 72)
        request = open_url.call_args.args[0]
        self.assertEqual(request.get_header("X-goog-api-key"), "test-key")
        request_data = json.loads(request.data)
        parts = request_data["input"]
        self.assertIn("Never omit any explanation", parts[0]["text"])
        self.assertIn("shaded or colored answer box", parts[0]["text"])
        self.assertEqual(request_data["model"], "gemini-3.8-flash")
        self.assertFalse(request_data["store"])
        self.assertEqual(request_data["generation_config"]["thinking_level"], "low")
        self.assertEqual(
            parts[1]["data"],
            base64.b64encode(b"page-image-bytes").decode("ascii"),
        )
        self.assertEqual(parts[1]["mime_type"], "image/jpeg")
        self.assertEqual(open_url.call_args.kwargs["timeout"], 300)

    def test_gemini_ocr_timeout_can_be_configured_and_reports_how_to_retry(self):
        page = Mock()
        pixmap = Mock()
        pixmap.tobytes.return_value = b"page-image-bytes"
        page.get_pixmap.return_value = pixmap
        with (
            patch.dict("os.environ", {
                "GEMINI_API_KEY": "test-key",
                "GEMINI_REQUEST_TIMEOUT": "480",
            }),
            patch("pdf_questions.urlopen", side_effect=TimeoutError),
        ):
            with self.assertRaisesRegex(
                RuntimeError,
                "480 সেকেন্ডে শেষ হয়নি.*GEMINI_REQUEST_TIMEOUT",
            ):
                _gemini_ocr_page(page, 2)

    def test_gemini_ocr_is_used_for_searchable_pdfs_when_configured(self):
        text = "1. প্রশ্ন?\nক) এক\nখ) দুই\nগ) তিন\nঘ) চার"
        with tempfile.TemporaryDirectory() as temporary_directory:
            path = Path(temporary_directory) / "questions.pdf"
            with pymupdf.open() as document:
                document.new_page()
                document.save(path)
            with (
                patch.dict("os.environ", {
                    "GEMINI_API_KEY": "test-key",
                }),
                patch("pdf_questions.Path.home", return_value=Path(temporary_directory)),
                patch("pdf_questions._gemini_ocr_pdf", return_value=text) as gemini_ocr,
                patch("pdf_questions._extract_searchable_text") as extract_text,
            ):
                questions, used_ocr = extract_questions(path)

        gemini_ocr.assert_called_once_with(path)
        extract_text.assert_not_called()
        self.assertTrue(used_ocr)
        self.assertEqual(len(questions), 1)

    def test_gemini_pdf_ocr_processes_pages_in_parallel_and_preserves_order(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            path = Path(temporary_directory) / "questions.pdf"
            with pymupdf.open() as document:
                document.new_page()
                document.new_page()
                document.new_page()
                document.save(path)
            with patch(
                "pdf_questions._gemini_ocr_image",
                side_effect=lambda _image, page_number: f"PAGE {page_number}",
            ) as ocr_image:
                text = _gemini_ocr_pdf(path)

        self.assertEqual(text, "PAGE 1\nPAGE 2\nPAGE 3")
        self.assertEqual(
            [call.args[1] for call in ocr_image.call_args_list],
            [1, 2, 3],
        )


if __name__ == "__main__":
    unittest.main()
