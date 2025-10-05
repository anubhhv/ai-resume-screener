
# 🧠 Resume Screener

An intelligent **resume screening system** built using **Natural Language Processing (NLP)**.
This project automatically parses resumes, extracts key skills, and compares them with job descriptions to identify and rank the most suitable candidates — helping recruiters save time and make data-driven hiring decisions.

---

## 🚀 Features

* 📄 **Resume Parsing:** Extracts text from PDF resumes using libraries like `PyPDF2` or `pdfplumber`.
* 🧩 **Skill Extraction:** Identifies relevant skills and keywords using NLP (spaCy / NLTK).
* 🔍 **Job Matching:** Compares extracted skills with a given job description to compute a similarity score.
* 📊 **Candidate Ranking:** Ranks candidates based on match percentage.
* 🌐 **Simple UI (optional):** Integrate with **Streamlit** or **Flask** for a clean, interactive interface.

---

## 🧠 Tech Stack

* **Language:** Python
* **Core Libraries:** spaCy, NLTK, PyPDF2, Pandas, NumPy
* **Optional:** Streamlit / Flask (for UI), Scikit-learn (for similarity metrics)

---

## ⚙️ Installation

```bash
# Clone this repository
git clone https://github.com/anubhhv/ai-resume-screener.git
cd ai-resume-screener

# Create a virtual environment
python -m venv venv
source venv/bin/activate     # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt
```

---

## 🧾 Usage

1. Place all resumes (PDF files) inside the `resumes/` folder.
2. Add the target job description in a `.txt` file.
3. Run the main script:

```bash
python app.py
```

4. The system will:

   * Extract skills from each resume
   * Compare them with the job description
   * Display or export a ranked list of candidates by match percentage

---

## 📈 Example Output

| Candidate    | Match Score |
| ------------ | ----------- |
| John Doe     | 85%         |
| Priya Sharma | 78%         |
| Alex Lee     | 74%         |

---

## 🧩 Future Enhancements

* Add named entity recognition (NER) for education and experience.
* Integrate with LinkedIn APIs or job portals.
* Build a web dashboard for HRs to upload resumes and visualize results.
* Use BERT-based embeddings for better semantic similarity.

---

## 🤝 Contributing

Pull requests are welcome!
If you find a bug or have an idea to improve the system, feel free to open an issue or PR.
