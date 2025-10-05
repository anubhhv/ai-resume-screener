from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import os
import PyPDF2

try:
    from docx import Document
    DOCX_SUPPORT = True
except ImportError:
    DOCX_SUPPORT = False

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'txt'}
if DOCX_SUPPORT:
    ALLOWED_EXTENSIONS.add('docx')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_pdf(file_path):
    text = ''
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + '\n'
    return text

def extract_text_txt(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def extract_text_docx(file_path):
    if not DOCX_SUPPORT:
        return ''
    doc = Document(file_path)
    return '\n'.join([p.text for p in doc.paragraphs])

def match_keywords(text, keywords):
    text_lower = text.lower()
    matched = []
    for kw in keywords:
        count = text_lower.count(kw.lower())
        if count > 0:
            matched.append({'keyword': kw, 'count': count})
    return matched

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_resumes():
    keywords = request.form.get('keywords', '')
    keywords = [k.strip() for k in keywords.split(',') if k.strip()]
    files = request.files.getlist('files')
    results = []
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            ext = filename.rsplit('.', 1)[1].lower()
            if ext == 'pdf':
                text = extract_text_pdf(filepath)
            elif ext == 'txt':
                text = extract_text_txt(filepath)
            elif ext == 'docx':
                text = extract_text_docx(filepath)
            else:
                text = ''
            
            matched_keywords = match_keywords(text, keywords)
            score = int(len(matched_keywords) / max(len(keywords), 1) * 100)
            
            results.append({
                'filename': filename,
                'matched_keywords': matched_keywords,
                'score': score
            })
    
    results.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)