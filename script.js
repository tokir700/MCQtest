// Firebase configuration
const firebaseConfig = {
    // Your Firebase configuration here
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

    db.collection('mcqs').add({
        question,
        options: [option1, option2, option3, option4],
        correct
    }).then(() => {
        alert('MCQ Submitted Successfully!');
        document.getElementById('mcq-form').reset();
        loadMCQs(); // Automatically load MCQs after submission
    }).catch(error => {
        console.error('Error adding MCQ: ', error);
    });
}

// Load MCQs from Firebase
document.getElementById('load-mcqs').addEventListener('click', loadMCQs);

function loadMCQs() {
    db.collection('mcqs').get().then(snapshot => {
        const examForm = document.getElementById('exam-form');
        examForm.innerHTML = ''; // Clear previous MCQs

        snapshot.forEach(doc => {
            const mcqData = doc.data();
            const mcqDiv = document.createElement('div');
            mcqDiv.classList.add('mcq');

            mcqDiv.innerHTML = `
                <p>${mcqData.question}</p>
                <div class="mcq-options">
                    ${mcqData.options.map((option, index) => `
                        <label>
                            <input type="radio" name="${doc.id}" value="${index + 1}" required>
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

    db.collection('mcqs').get().then(snapshot => {
        snapshot.forEach(doc => {
            const correctAnswer = doc.data().correct;
            const selectedAnswer = formElements[doc.id].value;

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
