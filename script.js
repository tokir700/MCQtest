const sheetID = '1SOwMSfHonN0oF1h6v8pqN_pZ2FCL29VlKJbfPmWIFxI'; // Use your Sheet ID
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=Sheet1&tqx=out:json`;

let currentQuestionIndex = 0;
let questions = [];

// Fetch questions from Google Sheets
function fetchQuestions() {
    fetch(sheetURL)
        .then(response => response.text())
        .then(data => {
            const json = JSON.parse(data.replace(/^\S+?\(/, '').replace(/\);$/, ''));
            questions = json.table.rows.map(row => {
                const c = row.c;
                return {
                    id: c[0].v,
                    question: c[1].v,
                    options: {
                        A: c[2].v,
                        B: c[3].v,
                        C: c[4].v,
                        D: c[5].v
                    },
                    answer: c[6].v
                };
            });
            displayQuestion();
        });
}

// Display a question
function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question-container').innerText = question.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    Object.keys(question.options).forEach(optionKey => {
        const option = question.options[optionKey];
        const button = document.createElement('button');
        button.innerText = `${optionKey}: ${option}`;
        button.onclick = () => checkAnswer(optionKey);
        optionsContainer.appendChild(button);
    });
}

// Check answer
function checkAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedOption === correctAnswer) {
        alert('Correct!');
    } else {
        alert('Wrong answer!');
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        alert('Quiz completed!');
        // Optionally: reset quiz or show results
    }
}

// Start quiz
fetchQuestions();

document.getElementById('next-button').onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        alert('Quiz completed!');
    }
};
