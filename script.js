// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcNmJRc-wExWMS-I7weIJZs6LSSh1skTY",
    authDomain: "mcq2-85461.firebaseapp.com",
    projectId: "mcq2-85461",
    storageBucket: "mcq2-85461.appspot.com",
    messagingSenderId: "1071652889012",
    appId: "1:1071652889012:web:f41d4c54927b02c94912e1",
    measurementId: "G-MEWBDKGL2X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle form submission
document.getElementById('mcqForm').addEventListener('submit', submitMCQ);

async function submitMCQ(e) {
    e.preventDefault();

    // Get form values
    const question = document.getElementById('question').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const option3 = document.getElementById('option3').value;
    const option4 = document.getElementById('option4').value;
    const correctOption = document.getElementById('correctOption').value;

    try {
        // Add a new document with a generated ID
        await addDoc(collection(db, 'mcqs'), {
            question: question,
            options: [option1, option2, option3, option4],
            correctOption: correctOption
        });
        alert('MCQ submitted!');
        document.getElementById('mcqForm').reset();
        displayMCQs();
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

// Function to fetch and display MCQs
async function displayMCQs() {
    const mcqList = document.getElementById('mcqList');
    mcqList.innerHTML = '';

    const q = query(collection(db, 'mcqs'), orderBy('question'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const mcq = doc.data();
        mcqList.innerHTML += `
            <div>
                <h4>${mcq.question}</h4>
                <ul>
                    <li>${mcq.options[0]}</li>
       
