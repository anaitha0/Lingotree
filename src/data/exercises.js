// exercises.js
import MCQ from "../Pages/MCQ/MCQ";
import OrderExo from "../Pages/OrderExo/OrderExo";

export const units = [
  {
    unit: 1,
    steps: [
      {
        stepNumber: 1,
        stepTitle: "Step 1: Basic Concepts of AI",
        exercises: [
          {
            type: "MCQ",
            component: MCQ,
            data: {
              englishSentence: "Artificial intelligence is one of the greatest innovations witnessed by humanity.",
              correctArabicSentence: ["إن", "الذكاء", "الاصطناعي", "هو", "أحد", "أعظم", "الابتكارات"],
              choices: [
                ["إن", "الذكاء", "الاصطناعي", "هو", "أحد", "أعظم", "الابتكارات"], // Correct
                ["إن", "الذكاء", "الابتكارات", "أعظم", "هو", "أحد", "الاصطناعي"], // Incorrect
                ["الابتكارات", "إن", "الذكاء", "هو", "أعظم", "الاصطناعي", "أحد"], // Incorrect
                ["أحد", "الابتكارات", "إن", "الذكاء", "الاصطناعي", "أعظم", "هو"], // Incorrect
              ],
            },
          },
          {
            type: "OrderExo",
            component: OrderExo,
            data: {
              correctArabicSentence: ["إن", "الذكاء", "الاصطناعي", "هو", "أحد", "أعظم", "الابتكارات"],
              englishSentence: "Artificial intelligence is one of the greatest innovations witnessed.",
            },
          },
          // Add 8 more exercises for Step 1 of Unit 1 here...
        ],
      },
      {
        stepNumber: 2,
        stepTitle: "Step 2: History of AI",
        exercises: [
          {
            type: "MCQ",
            component: MCQ,
            data: {
              englishSentence: "The history of AI dates back to the 1950s.",
              correctArabicSentence: ["تاريخ", "الذكاء", "الاصطناعي", "يعود", "إلى", "الخمسيات", "من", "القرن"],
              choices: [
                ["تاريخ", "الذكاء", "الاصطناعي", "يعود", "إلى", "الخمسيات", "من", "القرن"], // Correct
                ["من", "القرن", "إلى", "الخمسيات", "تاريخ", "الذكاء", "الاصطناعي", "يعود"], // Incorrect
                // Add more options as needed
              ],
            },
          },
          {
            type: "OrderExo",
            component: OrderExo,
            data: {
              correctArabicSentence: ["تاريخ", "الذكاء", "الاصطناعي", "يعود", "إلى", "الخمسيات", "من", "القرن"],
              englishSentence: "The history of AI dates back to the 1950s.",
            },
          },
          // Add 8 more exercises for Step 2 of Unit 1 here...
        ],
      },
      // Add more steps for Unit 1...
    ],
  },
  {
    unitTitle: 2,
    steps: [
      {
        stepNumber: 1,
        stepTitle: "Step 1: Neural Networks",
        exercises: [
          {
            type: "MCQ",
            component: MCQ,
            data: {
              englishSentence: "A neural network consists of layers of neurons.",
              correctArabicSentence: ["الشبكة", "العصبية", "تتكون", "من", "طبقات", "من", "الخلايا", "العصبية"],
              choices: [
                ["الشبكة", "العصبية", "تتكون", "من", "طبقات", "من", "الخلايا", "العصبية"], // Correct
                ["من", "الشبكة", "الخلايا", "العصبية", "تتكون", "من", "طبقات", "الشبكة"], // Incorrect
                // Add more options as needed
              ],
            },
          },
          {
            type: "OrderExo",
            component: OrderExo,
            data: {
              correctArabicSentence: ["الشبكة", "العصبية", "تتكون", "من", "طبقات", "من", "الخلايا", "العصبية"],
              englishSentence: "A neural network consists of layers of neurons.",
            },
          },
          // Add 8 more exercises for Step 1 of Unit 2 here...
        ],
      },
      {
        stepNumber: 2,
        stepTitle: "Step 2: Training Neural Networks",
        exercises: [
          {
            type: "MCQ",
            component: MCQ,
            data: {
              englishSentence: "Training a neural network requires a large dataset.",
              correctArabicSentence: ["تدريب", "الشبكة", "العصبية", "يتطلب", "مجموعة", "بيانات", "كبيرة"],
              choices: [
                ["تدريب", "الشبكة", "العصبية", "يتطلب", "مجموعة", "بيانات", "كبيرة"], // Correct
                // Add more options as needed
              ],
            },
          },
          {
            type: "OrderExo",
            component: OrderExo,
            data: {
              correctArabicSentence: ["تدريب", "الشبكة", "العصبية", "يتطلب", "مجموعة", "بيانات", "كبيرة"],
              englishSentence: "Training a neural network requires a large dataset.",
            },
          },
          // Add 8 more exercises for Step 2 of Unit 2 here...
        ],
      },
      // Add more steps for Unit 2...
    ],
  },
  // Add more units here...
];
