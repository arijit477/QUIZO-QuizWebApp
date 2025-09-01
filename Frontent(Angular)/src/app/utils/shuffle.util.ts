export class ShuffleUtil {
  /**
   * Shuffles an array using Fisher-Yates algorithm
   * @param array Array to shuffle
   * @returns Shuffled array
   */
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Shuffles question options and updates the correct answer mapping
   * @param question Question object with options and answer
   * @returns Object with shuffled options and updated answer
   */
  static shuffleQuestionOptions(question: any): any {
    const options = [
      { text: question.option1, original: 'option1' },
      { text: question.option2, original: 'option2' },
      { text: question.option3, original: 'option3' },
      { text: question.option4, original: 'option4' }
    ];

    // Create a mapping of original option to its text value
    const originalOptionMap: { [key: string]: string } = {
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4
    };

    // Shuffle the options
    const shuffledOptions = this.shuffleArray(options);

    // Create new question object with shuffled options
    const shuffledQuestion = { ...question };
    
    // Update the options with shuffled values
    shuffledOptions.forEach((option, index) => {
      const optionKey = `option${index + 1}`;
      shuffledQuestion[optionKey] = option.text;
      
      // If this was the correct answer, update the answer field
      if (originalOptionMap[question.answer] === option.text) {
        shuffledQuestion.answer = optionKey;
      }
    });

    return shuffledQuestion;
  }
}
