// Import Firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAcKS6u6OvqdysbAWNuW-rSZaCgP-qhX4M",
    authDomain: "mcq1-tokir700.firebaseapp.com",
    projectId: "mcq1-tokir700",
    storageBucket: "mcq1-tokir700.appspot.com",
    messagingSenderId: "1086480852956",
    appId: "1:1086480852956:web:98849aea5f8ba929f21119"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Show the question form when "Add Your Question" is clicked
document.getElementById('add-question-btn').addEventListener('click', () => {
    document.getElementById('add-question-form').style.display = 'block';
});

// Submit the question to Firestore when "Submit Question" is clicked
document.getElementById('submit-question-btn').addEventListener('click', async () => {
    const question = document.getElementById('question-input').value;
    const option1 = document.getElementById('option1-input').value;
    const option2 = document.getElementById('option2-input').value;
    const option3 = document.getElementById('option3-input').value;
    const option4 = document.getElementById('option4-input').value;
    const correctOption = document.getElementById('correct-option-input').value;

    if (question && option1 && option2 && option3 && option4 && correctOption) {
        try {
            await addDoc(collection(db, 'questions'), {
                question: question,
                answers: [
                    { text: option1, correct: correctOption === "1" },
                    { text: option2, correct: correctOption === "2" },
                    { text: option3, correct: correctOption === "3" },
                    { text: option4, correct: correctOption === "4" }
                ]
            });
            alert('Question added successfully!');
            document.getElementById('add-question-form').reset();
            document.getElementById('add-question-form').style.display = 'none';
        } catch (error) {
            console.error('Error adding question: ', error);
        }
    } else {
        alert('Please fill out all fields.');
    }
});

// Sample questions (for demonstration)
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
