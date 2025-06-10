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
from nltk.stem import PorterStemmer
import tempfile
import re
from difflib import SequenceMatcher

# Download required NLTK data
try:
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
except:
    pass

app = Flask(__name__)
CORS(app)

class ImprovedResumeMatcher:
    def __init__(self):
        # More generous TF-IDF configuration
        self.vectorizer = TfidfVectorizer(
            max_features=20000,
            stop_words=None,
            ngram_range=(1, 3),
            min_df=1,
            max_df=1.0,
            sublinear_tf=True,
            token_pattern=r'\b\w+\b',
            lowercase=True
        )
        self.stemmer = PorterStemmer()
        
        # Expanded skill synonyms for better matching
        self.skill_synonyms = {
            'javascript': ['javascript', 'js', 'ecmascript', 'es6', 'es2015', 'vanilla js'],
            'typescript': ['typescript', 'ts'],
            'react': ['react', 'reactjs', 'react.js', 'reactnative', 'react native'],
            'nodejs': ['nodejs', 'node.js', 'node', 'express', 'expressjs'],
            'python': ['python', 'py', 'django', 'flask', 'fastapi'],
            'java': ['java', 'spring', 'springboot', 'hibernate'],
            'docker': ['docker', 'containerization', 'containers'],
            'kubernetes': ['kubernetes', 'k8s', 'helm', 'kubectl'],
            'jenkins': ['jenkins', 'ci/cd', 'cicd', 'continuous integration', 'continuous deployment'],
            'mongodb': ['mongodb', 'mongo', 'nosql'],
            'sql': ['sql', 'mysql', 'postgresql', 'sqlite', 'database', 'rdbms'],
            'git': ['git', 'github', 'gitlab', 'version control', 'vcs'],
            'rest': ['rest', 'restful', 'api', 'apis', 'rest api', 'web api'],
            'security': ['security', 'cybersecurity', 'infosec', 'pentesting', 'penetration testing'],
            'devops': ['devops', 'sre', 'site reliability', 'infrastructure'],
            'agile': ['agile', 'scrum', 'kanban', 'sprint', 'jira'],
            'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
            'azure': ['azure', 'microsoft azure'],
            'gcp': ['gcp', 'google cloud', 'google cloud platform'],
            'testing': ['testing', 'unit testing', 'integration testing', 'qa', 'selenium', 'jest'],
            'frontend': ['frontend', 'front-end', 'ui', 'user interface', 'web development'],
            'backend': ['backend', 'back-end', 'server-side', 'api development'],
            'fullstack': ['fullstack', 'full-stack', 'full stack'],
            'machine learning': ['machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning'],
            'data science': ['data science', 'data analysis', 'analytics', 'big data']
        }

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
        """Minimal preprocessing to preserve important terms"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Keep most punctuation and special characters for better matching
        # Only remove very problematic characters
        text = re.sub(r'[^\w\s\.\+\#\-/]', ' ', text)
        
        # Keep all words, including short ones (important for tech: C, R, AI, ML, etc.)
        words = text.split()
        
        # Only remove the most basic stop words, keep technical terms
        basic_stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        
        # Keep all words that might be important
        filtered_words = []
        for word in words:
            if word not in basic_stopwords or len(word) <= 3:  # Keep short words (might be tech acronyms)
                filtered_words.append(word)
        
        return " ".join(filtered_words)

    def fuzzy_match_skills(self, cv_text, jd_text):
        """Use fuzzy matching to find similar skills and terms"""
        cv_lower = cv_text.lower()
        jd_lower = jd_text.lower()
        
        matches = 0
        total_skills = 0
        
        for skill_category, variations in self.skill_synonyms.items():
            # Check if any variation exists in job description
            jd_has_skill = any(var in jd_lower for var in variations)
            if jd_has_skill:
                total_skills += 1
                # Check if any variation exists in CV
                cv_has_skill = any(var in cv_lower for var in variations)
                if cv_has_skill:
                    matches += 1
                else:
                    # Try fuzzy matching for partial matches
                    for jd_term in variations:
                        if jd_term in jd_lower:
                            for cv_word in cv_lower.split():
                                if len(cv_word) > 3 and SequenceMatcher(None, jd_term, cv_word).ratio() > 0.8:
                                    matches += 0.5  # Partial credit for fuzzy matches
                                    break
        
        return matches / max(total_skills, 1)

    def extract_key_technical_terms(self, text):
        """Extract technical terms with better patterns"""
        patterns = [
            r'\b[A-Z]{2,10}\b',  # Acronyms (API, REST, SQL, etc.)
            r'\b\w*[Ss]cript\b',  # JavaScript, TypeScript, etc.
            r'\b[Pp]ython\b',
            r'\b[Jj]ava[Ss]cript\b',
            r'\b[Tt]ype[Ss]cript\b',
            r'\b[Rr]eact(?:\.?js|[Nn]ative)?\b',
            r'\b[Nn]ode(?:\.?js)?\b',
            r'\b[Dd]ocker\b',
            r'\b[Kk]ubernetes\b',
            r'\b[Jj]enkins\b',
            r'\b[Gg]it(?:[Hh]ub|[Ll]ab)?\b',
            r'\b[Mm]ongo(?:[Dd][Bb])?\b',
            r'\b[Ss][Qq][Ll]\b',
            r'\b[Aa][Ww][Ss]\b',
            r'\b[Aa]zure\b',
            r'\b[Gg][Cc][Pp]\b',
            r'\bC\+\+\b',
            r'\bC#\b',
            r'\b\.NET\b',
            r'\b[Hh][Tt][Mm][Ll]5?\b',
            r'\b[Cc][Ss][Ss]3?\b',
            r'\b[Mm]achine\s+[Ll]earning\b',
            r'\b[Dd]ata\s+[Ss]cience\b',
            r'\b[Aa]rtificial\s+[Ii]ntelligence\b',
            r'\b[Dd]ev[Oo]ps\b',
            r'\b[Aa]gile\b',
            r'\b[Ss]crum\b',
            r'\b\d+\+?\s*years?\b',  # Experience
        ]
        
        key_terms = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            key_terms.extend([match.lower() for match in matches])
        
        return list(set(key_terms))  # Remove duplicates

    def calculate_similarity(self, cv_text, job_description):
        """Improved similarity calculation with higher, more realistic scores"""
        if not cv_text or not job_description:
            return 0.0
        
        try:
            # 1. Direct word matching (high weight)
            cv_words = set(word.lower().strip() for word in cv_text.split() if len(word.strip()) > 0)
            jd_words = set(word.lower().strip() for word in job_description.split() if len(word.strip()) > 0)
            
            if len(jd_words) > 0:
                word_match_ratio = len(cv_words.intersection(jd_words)) / len(jd_words)
            else:
                word_match_ratio = 0
            
            # 2. Technical skills matching with fuzzy logic
            skill_match_score = self.fuzzy_match_skills(cv_text, job_description)
            
            # 3. Key technical terms matching
            cv_tech_terms = set(self.extract_key_technical_terms(cv_text))
            jd_tech_terms = set(self.extract_key_technical_terms(job_description))
            
            if len(jd_tech_terms) > 0:
                tech_terms_ratio = len(cv_tech_terms.intersection(jd_tech_terms)) / len(jd_tech_terms)
            else:
                tech_terms_ratio = 0
            
            # 4. N-gram matching for phrases
            cv_bigrams = set([f"{words[i]} {words[i+1]}" for words in [cv_text.lower().split()] 
                             for i in range(len(words[0])-1)])
            jd_bigrams = set([f"{words[i]} {words[i+1]}" for words in [job_description.lower().split()] 
                             for i in range(len(words[0])-1)])
            
            if len(jd_bigrams) > 0:
                bigram_ratio = len(cv_bigrams.intersection(jd_bigrams)) / len(jd_bigrams)
            else:
                bigram_ratio = 0
            
            # 5. TF-IDF cosine similarity
            try:
                vectors = self.vectorizer.fit_transform([cv_text, job_description])
                tfidf_similarity = cosine_similarity(vectors[0], vectors[1])[0][0]
            except:
                tfidf_similarity = 0.0
            
            # 6. Length and content quality bonus
            cv_length = len(cv_text.split())
            jd_length = len(job_description.split())
            
            # Bonus for comprehensive resumes
            length_bonus = min(cv_length / max(jd_length, 100), 1.0) * 0.1
            
            # Weighted combination - more generous scoring
            base_score = (
                word_match_ratio * 0.25 +       # Direct word matches
                skill_match_score * 0.25 +      # Skill matching (fuzzy)
                tech_terms_ratio * 0.20 +       # Technical terms
                bigram_ratio * 0.15 +           # Phrase matching
                tfidf_similarity * 0.15 +       # Semantic similarity
                length_bonus                    # Content quality bonus
            )
            
            # More generous scaling to produce realistic scores
            if base_score >= 0.7:
                # Excellent matches: 80-98
                final_score = 80 + (base_score - 0.7) * 60
            elif base_score >= 0.5:
                # Good matches: 65-80
                final_score = 65 + (base_score - 0.5) * 75
            elif base_score >= 0.3:
                # Fair matches: 45-65
                final_score = 45 + (base_score - 0.3) * 100
            elif base_score >= 0.15:
                # Poor matches: 25-45
                final_score = 25 + (base_score - 0.15) * 133.33
            else:
                # Very poor matches: 10-25
                final_score = 10 + base_score * 100
            
            # Apply additional bonuses for strong matches
            if word_match_ratio > 0.4:
                final_score += 5  # Strong keyword match bonus
            if skill_match_score > 0.6:
                final_score += 8  # Strong skill match bonus
            if tech_terms_ratio > 0.5:
                final_score += 5  # Technical terms bonus
            
            return round(min(final_score, 98), 2)  # Cap at 98 to remain realistic
            
        except Exception as e:
            print(f"Error calculating similarity: {e}")
            return 15.0  # Minimum reasonable score instead of 0

    def generate_detailed_feedback(self, cv_text, job_description, score):
        """Generate more helpful and detailed feedback"""
        try:
            cv_words = set(cv_text.lower().split())
            jd_words = set(job_description.lower().split())
            
            # Find matched and missing keywords
            matched_keywords = cv_words.intersection(jd_words)
            missing_keywords = jd_words - cv_words
            
            # Extract technical terms
            cv_tech = set(self.extract_key_technical_terms(cv_text))
            jd_tech = set(self.extract_key_technical_terms(job_description))
            
            matched_tech = cv_tech.intersection(jd_tech)
            missing_tech = jd_tech - cv_tech
            
            # Filter important missing terms
            important_missing = [
                word for word in missing_keywords 
                if len(word) > 3 and not word.isdigit() and word.isalpha()
            ][:6]
            
            important_missing_tech = list(missing_tech)[:4]
            
            # Generate feedback based on score
            feedback_parts = []
            
            if score >= 80:
                feedback_parts.append("🎉 Excellent match! Your resume strongly aligns with the job requirements.")
                if matched_tech:
                    feedback_parts.append(f"✅ Strong technical skills match: {', '.join(list(matched_tech)[:5])}")
            elif score >= 65:
                feedback_parts.append("👍 Good match! Your resume covers most job requirements.")
                if matched_tech:
                    feedback_parts.append(f"✅ Matched skills: {', '.join(list(matched_tech)[:4])}")
            elif score >= 45:
                feedback_parts.append("📈 Fair match with room for improvement.")
            else:
                feedback_parts.append("⚠️ Low match - consider significant resume optimization.")
            
            # Add specific improvement suggestions
            if important_missing_tech:
                feedback_parts.append(f"🔧 Consider adding these technical skills: {', '.join(important_missing_tech)}")
            
            if important_missing:
                feedback_parts.append(f"📝 Keywords to consider: {', '.join(important_missing)}")
            
            # Add match statistics
            match_percent = round(len(matched_keywords) / max(len(jd_words), 1) * 100)
            feedback_parts.append(f"📊 Keyword overlap: {match_percent}% ({len(matched_keywords)} of {len(jd_words)} job keywords)")
            
            return " | ".join(feedback_parts)
            
        except Exception as e:
            if score >= 70:
                return "Great match! Your resume aligns well with the job requirements."
            elif score >= 50:
                return "Good foundation with opportunities for optimization."
            else:
                return "Consider enhancing your resume to better match job requirements."

# Initialize the improved matcher
matcher = ImprovedResumeMatcher()

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
        feedback = matcher.generate_detailed_feedback(preprocessed_cv, preprocessed_jd, score)
        
        # Determine match level with more realistic thresholds
        if score >= 75:
            match_level = "Excellent Match"
        elif score >= 60:
            match_level = "Good Match"
        elif score >= 40:
            match_level = "Fair Match"
        else:
            match_level = "Needs Improvement"
        
        return jsonify({
            'score': score,
            'feedback': feedback,
            'matchLevel': match_level,
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
    return jsonify({'status': 'healthy', 'service': 'improved-resume-matcher'})

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')