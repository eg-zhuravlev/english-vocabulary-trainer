import { TrainingView } from "../views/TrainingView";
import { fetchWords } from "./api/fetchWords";

type Question = {
  answer: string;
  letters: string[];
  selectedLetters: string[];
  errorsCount: number;
  isCompleted: boolean;
};

export class TrainingModule {
  private questions: Question[] = [];
  private currentQuestion: Question;

  private completedQuestions = 0;

  private view = new TrainingView();

  constructor() {
    this.view.on("onLetterClick", this.selectLetter.bind(this));
  }

  async startTrain() {
    const words = await fetchWords();

    if (words.length === 0) {
      throw new Error("Not found words for train");
    }

    this.questions = words.map((word) => ({
      answer: word,
      letters: word.split("").sort(() => 0.5 - Math.random()),
      errorsCount: 0,
      isCompleted: false,
      selectedLetters: [],
    }));

    this.view.showTotalQuestions(words.length);
    this.nextQuestion();
  }

  selectLetter(letter: string, id?: string) {
    if (this.currentQuestion.isCompleted) {
      return;
    }

    const { answer, selectedLetters } = this.currentQuestion;
    const preparedLetter = letter.toLowerCase();
    const isCorrectLetter = answer[selectedLetters.length] === preparedLetter;

    if (!isCorrectLetter && this.currentQuestion.errorsCount === 2) {
      this.currentQuestion.isCompleted = true;
      this.currentQuestion.errorsCount += 1;
      this.showQuestionError();
      return;
    } else if (!isCorrectLetter) {
      this.currentQuestion.errorsCount += 1;

      id && this.view.showLetterError(id);
      return;
    }

    selectedLetters.push(preparedLetter);
    this.view.selectLetter(id);

    if (selectedLetters.join("") === answer) {
      this.nextQuestion();
    }
  }

  showQuestionError() {
    this.view.clearLetters();

    this.view.showErrorAnswer(this.currentQuestion.answer);

    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  }

  nextQuestion() {
    // Помечаем сделанным текущий вопрос
    if (this.currentQuestion) {
      this.currentQuestion.isCompleted = true;
      this.completedQuestions += 1;
    }

    this.currentQuestion = this.questions.find(
      (question) => !question.isCompleted
    );

    if (!this.currentQuestion) {
      this.complete();
      return;
    }

    this.view.clearAnswer();
    this.view.clearLetters();

    this.view.showQuestionNumber(this.completedQuestions + 1);
    this.view.showLetters(this.currentQuestion.letters);
  }

  complete() {
    let questionsWithoutErrors = 0;
    let totalErrors = 0;
    let failedQuestion: Question;

    for (let i = 0; i < this.questions.length; i++) {
      const { errorsCount } = this.questions[i];

      if (errorsCount === 0) {
        questionsWithoutErrors += 1;
        continue;
      }

      totalErrors += errorsCount;

      if (!failedQuestion || errorsCount > failedQuestion?.errorsCount) {
        failedQuestion = this.questions[i];
      }
    }

    this.view.showResult(
      questionsWithoutErrors,
      totalErrors,
      failedQuestion?.answer.toUpperCase()
    );
  }
}
