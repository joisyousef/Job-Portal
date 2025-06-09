from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pdfplumber
import docx
import string
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import tempfile

# Download required NLTK data
try:
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
except:
    pass

app = Flask(__name__)
CORS(app)

class ResumeMatcher:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')

    def extract_text_from_path(self, file_path):
        _, ext = os.path.splitext(file_path)
        ext = ext.lower().strip()
        text = ""

        try:
            if ext == ".pdf":
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + " "
            elif ext == ".docx":
                doc = docx.Document(file_path)
                text = " ".join([para.text for para in doc.paragraphs])
            elif ext == ".txt":
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
            else:
                raise ValueError(f"Unsupported file format: '{ext}'. Use PDF, DOCX, or TXT.")
        except Exception as e:
            raise ValueError(f"Error extracting text from {ext} file: {str(e)}")
        
        return text.strip()

    def preprocess_text(self, text):
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove punctuation
        text = text.translate(str.maketrans("", "", string.punctuation))
        
        # Tokenize and remove stopwords
        try:
            tokens = word_tokenize(text)
            stop_words = set(stopwords.words("english"))
            tokens = [word for word in tokens if word not in stop_words and len(word) > 2]
            return " ".join(tokens)
        except:
            # Fallback if NLTK fails
            words = text.split()
            return " ".join([word for word in words if len(word) > 2])

    def calculate_similarity(self, cv_text, job_description):
        if not cv_text or not job_description:
            return 0.0
        
        try:
            vectors = self.vectorizer.fit_transform([cv_text, job_description])
            similarity = cosine_similarity(vectors[0], vectors[1])
            return round(similarity[0][0] * 100, 2)
        except:
            return 0.0

    def generate_feedback(self, cv_text, job_description):
        try:
            cv_words = set(cv_text.split())
            job_words = set(job_description.split())
            missing_keywords = job_words - cv_words
            
            # Get top 10 missing keywords
            missing_list = list(missing_keywords)[:10]
            
            if missing_list:
                feedback = "Consider adding these keywords: " + ", ".join(missing_list)
            else:
                feedback = "Great match! Your resume contains most relevant keywords."
                
            return feedback
        except:
            return "Unable to generate specific feedback, but your resume has been analyzed."

matcher = ResumeMatcher()

@app.route('/api/match-resume', methods=['POST'])
def match_resume():
    temp_file_path = None
    try:
        # Check if file is present
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided', 'success': False}), 400
        
        resume_file = request.files['resume']
        job_description = request.form.get('jobDescription', '').strip()
        
        if not resume_file.filename:
            return jsonify({'error': 'No file selected', 'success': False}), 400
            
        if not job_description:
            return jsonify({'error': 'Job description is required', 'success': False}), 400
        
        # Validate file type
        allowed_extensions = ['.pdf', '.docx', '.txt']
        file_ext = os.path.splitext(resume_file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            return jsonify({'error': f'Unsupported file type. Please use: {", ".join(allowed_extensions)}', 'success': False}), 400
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp_file:
            temp_file_path = tmp_file.name
            resume_file.save(temp_file_path)
        
        # Extract and process text
        raw_cv_text = matcher.extract_text_from_path(temp_file_path)
        
        if not raw_cv_text.strip():
            return jsonify({'error': 'Could not extract text from the resume file', 'success': False}), 400
        
        preprocessed_cv = matcher.preprocess_text(raw_cv_text)
        preprocessed_jd = matcher.preprocess_text(job_description)
        
        # Calculate similarity and generate feedback
        score = matcher.calculate_similarity(preprocessed_cv, preprocessed_jd)
        feedback = matcher.generate_feedback(preprocessed_cv, preprocessed_jd)
        
        return jsonify({
            'score': score,
            'feedback': feedback,
            'success': True,
            'message': 'Resume analyzed successfully'
        })
        
    except Exception as e:
        app.logger.error(f"Error processing resume: {str(e)}")
        return jsonify({
            'error': f'Failed to process resume: {str(e)}',
            'success': False
        }), 500
    
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except:
                pass

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'resume-matcher-python'})

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')