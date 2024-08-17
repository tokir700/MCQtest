// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcNmJRc-wExWMS-I7weIJZs6LSSh1skTY",
  authDomain: "mcq2-85461.firebaseapp.com",
  projectId: "mcq2-85461",
  storageBucket: "mcq2-85461.appspot.com",
  messagingSenderId: "1071652889012",
  appId: "1:1071652889012:web:f41d4c54927b02c94912e1",
  measurementId: "G-MEWBDKGL2X",
  databaseURL: "https://mcq2-85461-default-rtdb.asia-southeast1.firebasedatabase.app/", // Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to submit MCQ to the Realtime Database
document.getElementById('mcqForm').addEventListener('submit', submitMCQ);

async function submitMCQ(e) {
    e.preventDefault();

    const question = document.getElementById('questionInput').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;
    const option4 = document.getElementById('option4').value;
    const correctOption = parseInt(document.getElementById('correctOption').value);

    const mcqData = {
        question: question,
        options: [option1, option2, option3, option4],
        correctOption: correctOption
    };

    try {
        const mcqsRef = ref(database, 'mcqs');
        await push(mcqsRef, mcqData);
        alert('MCQ submitted!');
        document.getElementById('mcqForm').reset();
        loadQuestions();
    } catch (e) {
        console.error('Error adding MCQ: ', e);
    }
}

// Function to load and display MCQs
let questions = [];
let currentQuestionIndex = 0;

async function loadQuestions() {
    const mcqsRef = ref(database, 'mcqs');

    onValue(mcqsRef, (snapshot) => {
        questions = [];
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            questions.push(data);
        });
        displayQuestion();
    });
}

// Display the current question
function displayQuestion() {
    if (questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;

    const optionsList = document.getElementById('options');
    optionsList.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option;
        li.classList.add('option');
        li.addEventListener('click', () => selectOption(index + 1));
        optionsList.appendChild(li);
    });

    document.getElementById('nextButton').style.display = 'none';
}

// Handle option selection
function selectOption(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const optionsList = document.getElementById('options').children;

    for (let i = 0; i < optionsList.length; i++) {
        if (i + 1 === currentQuestion.correctOption) {
            optionsList[i].classList.add('correct');
        } else {
            optionsList[i].classList.add('wrong');
        }

        if (i + 1 === selectedOption) {
            if (selectedOption === currentQuestion.correctOption) {
                optionsList[i].classList.add('selected-correct');
            } else {
                optionsList[i].classList.add('selected-wrong');
            }
        }
    }

    document.getElementById('nextButton').style.display = 'block';
}

// Move to the next question
document.getElementById('nextButton').addEventListener('click', () => {
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    displayQuestion();
});

// Initial load of questions
loadQuestions();
