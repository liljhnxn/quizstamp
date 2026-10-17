export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink and Text Management Law",
      "Home Tool Multi Language",
    ],
    correctAnswerIndex: 0,
    explanation: "HTML (Hyper Text Markup Language) is the standard markup language for documents designed to be displayed in a web browser.",
  },
  {
    id: 2,
    question: "Which language is used to style web pages?",
    options: [
      "Python",
      "CSS (Cascading Style Sheets)",
      "SQL",
      "Assembly",
    ],
    correctAnswerIndex: 1,
    explanation: "CSS describes how HTML elements are to be styled and presented on screen, paper, or in other media.",
  },
  {
    id: 3,
    question: "What does CPU stand for?",
    options: [
      "Computer Personal Unit",
      "Core Processing Utility",
      "Central Processing Unit",
      "Control Program Unit",
    ],
    correctAnswerIndex: 2,
    explanation: "The Central Processing Unit (CPU) is the primary component of a computer that executes instructions.",
  },
  {
    id: 4,
    question: "Which programming language is primarily used to make web pages interactive in the browser?",
    options: [
      "JavaScript",
      "C++",
      "COBOL",
      "Fortran",
    ],
    correctAnswerIndex: 0,
    explanation: "JavaScript is the predominant client-side scripting language that enables dynamic behavior on web pages.",
  },
  {
    id: 5,
    question: "What does URL stand for?",
    options: [
      "Uniform Resource Locator",
      "Universal Router Link",
      "United Resource List",
      "Unified Responsive Layout",
    ],
    correctAnswerIndex: 0,
    explanation: "A Uniform Resource Locator (URL) is the unique address used to identify and locate a resource on the web.",
  },
];
