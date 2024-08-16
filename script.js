const questions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false },
            { text: "Paris", correct: true },
            { text: "Lisbon", correct: false }
        ]
    },
    {
        question: "Which language is used for web development?",
        answers: [
            { text: "Python", correct: false },
            { text: "JavaScript", correct: true },
            { text: "C++", correct: false },
            { text: "Java", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;

function showQuestion() {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `
        <h2>${questions[currentQuestionIndex].question}</h2>
        ${questions[currentQuestionIndex].answers.map((answer, index) => `
            <label>
                <input type="radio" name="answer" value="${index}">
                ${answer.text}
            </label>
        `).join('')}
    `;
}

function showNextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) return;

    const isCorrect = questions[currentQuestionIndex].answers[selectedAnswer.value].correct;
    if (isCorrect) {
        alert("Correct!");
    } else {
        alert("Incorrect!");
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById("question-container").innerHTML = "<h2>Exam Finished!</h2>";
        document.getElementById("next-btn").disabled = true;
    }
}

document.getElementById("next-btn").addEventListener("click", showNextQuestion);
showQuestion();
