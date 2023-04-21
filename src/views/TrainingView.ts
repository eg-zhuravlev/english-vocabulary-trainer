import { EventEmitter } from "../helpers/EventEmitter";
import { createElement } from "../helpers/createElement";
import { isLetter } from "../helpers/isLetter";

enum LetterState {
  DEFAULT = "btn-primary",
  ERROR = "btn-danger",
}

export class TrainingView extends EventEmitter {
  private lettersContainer: HTMLElement | null;
  private answerContainer: HTMLElement | null;
  private contentElement: HTMLElement | null;
  private questionNumberElement: HTMLElement | null;
  private totalQuestionsElement: HTMLElement | null;

  private bindedHandleKeyClick: (event: KeyboardEvent) => void;

  constructor() {
    super();

    this.lettersContainer = document.getElementById("letters");
    this.answerContainer = document.getElementById("answer");
    this.questionNumberElement = document.getElementById("current_question");
    this.totalQuestionsElement = document.getElementById("total_questions");
    this.contentElement = document.getElementById("content");

    this.bindedHandleKeyClick = this.handleKeyClick.bind(this);

    document.addEventListener("keydown", this.bindedHandleKeyClick);
  }

  private handleKeyClick(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    if (isLetter(key)) {
      this.emit("onLetterClick", key, this.getLetterElement(key)?.id);
    }
  }

  private handleLetterClick(event: MouseEvent) {
    const element = event.currentTarget as HTMLButtonElement;

    this.emit("onLetterClick", element.textContent, element.id);
  }

  private getLetterElement(letter: string): HTMLElement | null {
    return this.lettersContainer.querySelector(`[data-letter=${letter}]`);
  }

  private createLetterElement(
    letter: string,
    id: number,
    state: LetterState = LetterState.DEFAULT
  ) {
    const letterElement = createElement("button", {
      attrs: {
        type: "button",
        class: `btn mx-1 ${state}`,
        id: `letter-button-${id}`,
        "data-letter": `${letter}`,
      },
      inner: letter.toUpperCase(),
    });

    letterElement.addEventListener("click", this.handleLetterClick.bind(this));

    return letterElement;
  }

  showLetters(letters: string[]) {
    letters.forEach((letter, index) => {
      const letterElement = this.createLetterElement(letter, index);

      this.lettersContainer.appendChild(letterElement);
    });
  }

  clearLetters() {
    this.lettersContainer.innerHTML = "";
  }

  clearAnswer() {
    this.answerContainer.innerHTML = "";
  }

  selectLetter(id: string) {
    const element = document.getElementById(id);

    if (!this.answerContainer) {
      throw new Error("Answer container not found");
    }

    if (!element) {
      throw new Error("Letter element not found");
    }

    this.lettersContainer.removeChild(element);

    element.classList.remove("btn-primary");
    element.classList.add("btn-success");
    element.style.pointerEvents = "none";

    this.answerContainer.appendChild(element);
  }

  showLetterError(id: string) {
    const element = document.getElementById(id);

    element.classList.remove("btn-primary");
    element.classList.add("btn-danger");

    setTimeout(() => {
      element.classList.remove("btn-danger");
      element.classList.add("btn-primary");
    }, 200);
  }

  showErrorAnswer(answer: string) {
    this.clearAnswer();

    for (let i = 0; i < answer.length; i++) {
      const el = this.createLetterElement(answer[i], i, LetterState.ERROR);

      this.answerContainer.appendChild(el);
    }
  }

  showResult(
    questionsWithoutErrors: number,
    totalErrors: number,
    failedQuestion?: string
  ) {
    document.removeEventListener("keydown", this.bindedHandleKeyClick);

    const el1 = createElement("li", {
      inner: `Слов без ошибок: ${questionsWithoutErrors}`,
    });
    const el2 = createElement("li", {
      inner: `Общее количество ошибок: ${totalErrors}`,
    });
    const el3 = failedQuestion
      ? createElement("li", {
          inner: `Слово с самым большим числом ошибок: ${failedQuestion}`,
        })
      : undefined;

    const result = createElement("ul", {
      attrs: { class: "list-unstyled" },
      children: [el1, el2, el3],
    });

    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(result);
  }

  showQuestionNumber(num: number) {
    this.questionNumberElement.textContent = `${num}`;
  }

  showTotalQuestions(num: number) {
    this.totalQuestionsElement.textContent = `${num}`;
  }
}
