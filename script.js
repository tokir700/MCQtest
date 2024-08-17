// Firebase configuration with your details
const firebaseConfig = {
    apiKey: "AIzaSyAcKS6u6OvqdysbAWNuW-rSZaCgP-qhX4M",
    authDomain: "mcq1-tokir700.firebaseapp.com",
    databaseURL: "https://mcq1-tokir700-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "mcq1-tokir700",
    storageBucket: "mcq1-tokir700.appspot.com",
    messagingSenderId: "1086480852956",
    appId: "1:1086480852956:web:98849aea5f8ba929f21119"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Form submission
document.getElementById('mcq-form').addEventListener('submit', submitMCQ);

function submitMCQ(e) {
    e.preventDefault();

    const question = document.getElementById('question').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;
    const option4 = document.getElementById('option4').value;
    const correct = document.getElementById('correct').value;

    const newMCQKey = db.ref().child('mcqs').push().key;

    const mcqData = {
        question: question,
        options: [option1, option2, option3, option4],
        correct: correct
    };

    const updates = {};
    updates['/mcqs/' + newMCQKey] = mcqData;

    db.ref().update(updates)
        .then(() => {
            alert('MCQ Submitted Successfully!');
            document.getElementById('mcq-form').reset();
            loadMCQs(); // Automatically load MCQs after submission
        })
        .catch(error => {
            console.error('Error adding MCQ: ', error);
        });
}

// Load MCQs from Realtime Database
document.getElementById('load-mcqs').addEventListener('click', loadMCQs);

function loadMCQs() {
    db.ref('mcqs').once('value').then(snapshot => {
        const examForm = document.getElementById('exam-form');
        examForm.innerHTML = ''; // Clear previous MCQs

        snapshot.forEach(childSnapshot => {
            const mcqData = childSnapshot.val();
            const mcqDiv = document.createElement('div');
            mcqDiv.classList.add('mcq');

            mcqDiv.innerHTML = `
                <p>${mcqData.question}</p>
                <div class="mcq-options">
                    ${mcqData.options.map((option, index) => `
                        <label>
                            <input type="radio" name="${childSnapshot.key}" value="${index + 1}" required>
                            ${option}
                        </label><br>
                    `).join('')}
                </div>
            `;
            examForm.appendChild(mcqDiv);
        });
    }).catch(error => {
        console.error('Error loading MCQs: ', error);
    });
}

// Handle exam submission (if required)
document.getElementById('submit-exam').addEventListener('click', function(e) {
    e.preventDefault();
    const formElements = document.getElementById('exam-form').elements;
    let score = 0;
    let totalQuestions = 0;

    db.ref('mcqs').once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const correctAnswer = childSnapshot.val().correct;
            const selectedAnswer = formElements[childSnapshot.key].value;

            if (correctAnswer == selectedAnswer) {
                score++;
            }
            totalQuestions++;
        });

        alert(`Your score is: ${score} / ${totalQuestions}`);
    }).catch(error => {
        console.error('Error submitting exam: ', error);
    });
});
