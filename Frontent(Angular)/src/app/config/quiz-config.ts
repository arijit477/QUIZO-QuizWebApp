export const QuizConfig = {
  // Enable or disable shuffling functionality
  shuffle: {
    questions: true,      // Shuffle the order of questions
    options: true,        // Shuffle the order of options for each question
    seed: null as number | null  // Optional seed for reproducible shuffling (null for random)
  },
  
  // Other quiz settings
  timePerQuestion: 2,     // minutes per question
  maxAttempts: 1,         // maximum attempts per quiz
  showCorrectAnswers: true // show correct answers after submission
};
