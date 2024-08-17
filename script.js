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
    }).catch(error => {
        console.error('Error adding MCQ: ', error);
    });
}
