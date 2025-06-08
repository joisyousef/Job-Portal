import multer from "multer";
import mammoth from "mammoth";
import pdf from "pdf-parse";

// Configure multer for memory storage (since we're processing files in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOCX, and TXT files are allowed."
        ),
        false
      );
    }
  },
});

// Helper function to extract text from different file types
const extractTextFromFile = async (fileBuffer, mimetype, originalname) => {
  try {
    switch (mimetype) {
      case "application/pdf":
        const pdfData = await pdf(fileBuffer);
        return pdfData.text;

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
        return docxResult.value;

      case "text/plain":
        return fileBuffer.toString("utf-8");

      default:
        // Fallback to treating as text
        return fileBuffer.toString("utf-8");
    }
  } catch (error) {
    throw new Error(
      `Failed to extract text from ${originalname}: ${error.message}`
    );
  }
};

// Helper function to calculate match score and provide feedback
const analyzeResumeMatch = (resumeText, jobDescription) => {
  // Convert both texts to lowercase for comparison
  const resume = resumeText.toLowerCase();
  const jobDesc = jobDescription.toLowerCase();

  // Extract key terms from job description (simple keyword extraction)
  const jobWords = jobDesc
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3) // Filter out short words
    .filter((word) => !commonWords.includes(word)); // Filter out common words

  // Count unique job-related keywords
  const uniqueJobWords = [...new Set(jobWords)];

  // Count how many job keywords appear in resume
  let matchedKeywords = 0;
  const matchedWords = [];
  const missingWords = [];

  uniqueJobWords.forEach((word) => {
    if (resume.includes(word)) {
      matchedKeywords++;
      matchedWords.push(word);
    } else {
      missingWords.push(word);
    }
  });

  // Calculate basic match percentage
  const basicScore = Math.round(
    (matchedKeywords / uniqueJobWords.length) * 100
  );

  // Apply additional scoring factors
  let adjustedScore = basicScore;

  // Bonus for exact phrase matches
  const jobPhrases = extractKeyPhrases(jobDesc);
  let phraseMatches = 0;
  jobPhrases.forEach((phrase) => {
    if (resume.includes(phrase.toLowerCase())) {
      phraseMatches++;
    }
  });

  // Add bonus for phrase matches (up to 15 points)
  const phraseBonus = Math.min(15, (phraseMatches / jobPhrases.length) * 15);
  adjustedScore = Math.min(100, adjustedScore + phraseBonus);

  // Generate personalized feedback
  const feedback = generateFeedback(
    adjustedScore,
    matchedWords,
    missingWords,
    jobPhrases
  );

  return {
    score: Math.round(adjustedScore),
    feedback,
    matchedKeywords: matchedWords.slice(0, 10), // Top 10 matched keywords
    missingKeywords: missingWords.slice(0, 10), // Top 10 missing keywords
  };
};

// Helper function to extract key phrases from job description
const extractKeyPhrases = (text) => {
  const phrases = [];

  // Common multi-word technical terms and job-related phrases
  const phrasePatterns = [
    /\b(?:machine learning|artificial intelligence|data science|software development|project management|customer service|business analysis|digital marketing|cloud computing|database management)\b/gi,
    /\b(?:bachelor'?s? degree|master'?s? degree|years? of experience|\d+\+? years?)\b/gi,
    /\b(?:proficient in|experience with|knowledge of|familiarity with|expertise in)\b/gi,
  ];

  phrasePatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      phrases.push(...matches);
    }
  });

  // Remove duplicates and return unique phrases
  return [...new Set(phrases)];
};

// Helper function to generate personalized feedback
const generateFeedback = (score, matchedWords, missingWords, jobPhrases) => {
  let feedback = "";

  if (score >= 80) {
    feedback =
      "Excellent match! Your resume demonstrates strong alignment with the job requirements. ";
    feedback += `You've successfully highlighted key terms like "${matchedWords
      .slice(0, 3)
      .join('", "')}" that match what the employer is looking for. `;

    if (missingWords.length > 0) {
      feedback += `To further strengthen your application, consider incorporating terms like "${missingWords
        .slice(0, 2)
        .join('" and "')}" if they reflect your actual experience.`;
    } else {
      feedback +=
        "Your resume covers most of the key requirements mentioned in the job posting.";
    }
  } else if (score >= 60) {
    feedback =
      "Good foundation! Your resume shows relevant experience, but there's room for improvement. ";
    feedback += `You've included important keywords like "${matchedWords
      .slice(0, 3)
      .join('", "')}", which is great. `;
    feedback += `To boost your match score, consider adding experience or skills related to "${missingWords
      .slice(0, 3)
      .join('", "')}" if applicable to your background. `;
    feedback +=
      "Also, try to mirror some of the specific language used in the job posting.";
  } else {
    feedback =
      "Your resume needs significant alignment with this job posting. ";
    if (matchedWords.length > 0) {
      feedback += `While you do have some relevant terms like "${matchedWords
        .slice(0, 2)
        .join('" and "')}", `;
    }
    feedback += `the job posting emphasizes "${missingWords
      .slice(0, 5)
      .join('", "')}" which aren't prominently featured in your resume. `;
    feedback +=
      "Consider highlighting relevant experience that demonstrates these skills, or look for positions that better match your current qualifications.";
  }

  return feedback;
};

// Common words to filter out during analysis
const commonWords = [
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "had",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "man",
  "new",
  "now",
  "old",
  "see",
  "two",
  "who",
  "boy",
  "did",
  "has",
  "let",
  "put",
  "say",
  "she",
  "too",
  "use",
  "will",
  "with",
  "have",
  "this",
  "that",
  "they",
  "from",
  "been",
  "have",
  "were",
  "said",
  "each",
  "which",
  "their",
  "time",
  "about",
  "would",
  "there",
  "could",
  "other",
  "after",
  "first",
  "well",
  "water",
  "very",
  "what",
  "know",
  "get",
  "through",
  "back",
  "much",
  "before",
  "go",
  "good",
  "new",
  "write",
  "our",
  "used",
  "me",
  "man",
  "too",
  "any",
  "day",
  "same",
  "right",
  "look",
  "think",
  "also",
  "around",
  "another",
  "came",
  "three",
  "word",
  "work",
  "must",
  "because",
  "does",
  "part",
  "even",
  "place",
  "well",
  "such",
  "here",
  "take",
  "why",
  "help",
  "put",
  "different",
  "away",
  "again",
  "off",
  "went",
  "old",
  "number",
  "great",
  "tell",
  "men",
  "say",
  "small",
  "every",
  "found",
  "still",
  "between",
  "name",
  "should",
  "home",
  "big",
  "give",
  "air",
  "line",
  "set",
  "own",
  "under",
  "read",
  "last",
  "never",
  "us",
  "left",
  "end",
  "along",
  "while",
  "might",
  "next",
  "sound",
  "below",
  "saw",
  "something",
  "thought",
  "both",
  "few",
  "those",
  "always",
  "show",
  "large",
  "often",
  "together",
  "asked",
  "house",
  "don",
  "world",
  "going",
  "want",
  "school",
  "important",
  "until",
  "form",
  "food",
  "keep",
  "children",
  "feet",
  "land",
  "side",
  "without",
  "boy",
  "once",
  "animal",
  "life",
  "enough",
  "took",
  "sometimes",
  "four",
  "head",
  "above",
  "kind",
  "began",
  "almost",
  "live",
  "page",
  "got",
  "earth",
  "need",
  "far",
  "hand",
  "high",
  "year",
  "mother",
  "light",
  "country",
  "father",
  "let",
  "night",
  "picture",
  "being",
  "study",
  "second",
  "soon",
  "story",
  "since",
  "white",
  "ever",
  "paper",
  "hard",
  "near",
  "sentence",
  "better",
  "best",
  "across",
  "during",
  "today",
  "however",
  "sure",
  "knew",
  "it",
  "try",
  "told",
  "young",
  "sun",
  "thing",
  "whole",
  "hear",
  "example",
  "heard",
  "several",
  "change",
  "answer",
  "room",
  "sea",
  "against",
  "top",
  "turned",
  "learn",
  "point",
  "city",
  "play",
  "toward",
  "five",
  "using",
  "himself",
  "usually",
  "money",
  "seen",
  "didn",
  "car",
  "morning",
  "i",
  "long",
  "red",
  "dog",
  "family",
  "run",
  "day",
  "eat",
  "room",
  "school",
  "book",
  "eye",
  "job",
  "word",
  "though",
  "business",
  "issue",
  "become",
  "person",
  "your",
  "some",
  "what",
  "these",
  "may",
  "people",
  "time",
  "very",
  "when",
  "come",
  "its",
  "now",
  "think",
  "only",
  "also",
  "your",
  "work",
  "life",
  "only",
  "can",
  "still",
  "should",
  "after",
  "being",
  "now",
  "made",
  "before",
  "here",
  "through",
  "when",
  "where",
  "much",
  "your",
  "way",
  "well",
  "down",
  "them",
  "as",
  "many",
  "these",
  "then",
  "them",
  "these",
  "so",
  "some",
  "her",
  "would",
  "make",
  "like",
  "him",
  "into",
  "time",
  "has",
  "look",
  "two",
  "more",
  "write",
  "go",
  "see",
  "no",
  "way",
  "could",
  "my",
  "than",
  "first",
  "water",
  "been",
  "call",
  "who",
  "its",
  "now",
  "find",
  "long",
  "down",
  "day",
  "did",
  "get",
  "come",
  "made",
  "may",
  "part",
];

// Main controller function for resume matching
export const matchResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const resumeFile = req.file;

    // Validate inputs
    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        error: "Please upload a resume file",
      });
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        success: false,
        error:
          "Please provide a detailed job description (minimum 50 characters)",
      });
    }

    // Extract text from the uploaded resume
    let resumeText;
    try {
      resumeText = await extractTextFromFile(
        resumeFile.buffer,
        resumeFile.mimetype,
        resumeFile.originalname
      );
    } catch (extractionError) {
      return res.status(400).json({
        success: false,
        error: `Failed to process resume file: ${extractionError.message}`,
      });
    }

    // Validate extracted text
    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        error:
          "Unable to extract sufficient text from resume. Please ensure the file contains readable text and try again.",
      });
    }

    // Perform the matching analysis
    const analysisResult = analyzeResumeMatch(resumeText, jobDescription);

    // Return the results
    res.json({
      success: true,
      score: analysisResult.score,
      feedback: analysisResult.feedback,
      matchedKeywords: analysisResult.matchedKeywords,
      missingKeywords: analysisResult.missingKeywords,
      resumeLength: resumeText.length,
      jobDescriptionLength: jobDescription.length,
    });
  } catch (error) {
    console.error("Resume matching error:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while analyzing your resume. Please try again.",
    });
  }
};

// Export the upload middleware for use in routes
export const resumeUpload = upload.single("resume");
