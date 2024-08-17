const sheetID = '1SOwMSfHonN0oF1h6v8pqN_pZ2FCL29VlKJbfPmWIFxI'; // Your Google Sheet ID
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=Sheet1&tqx=out:json`;

let currentQuestionIndex = 0;
let questions = [];

// Fetch questions from Google Sheets
function fetchQuestions() {
    fetch(sheetURL)
        .then(response => response.text())
        .then(data => {
            console.log('Raw data:', data); // Log raw data for debugging
            try {
                // Extract JSON data from the response
                const json = JSON.parse(data.replace(/^\S+?\(/, '').replace(/\);$/, ''));
                console.log('Parsed JSON:', json); // Log parsed JSON for debugging

                questions = json.table.rows.map(row => {
                    const c = row.c;
                    return {
                        id: c[0] ? c[0].v : '',
                        question: c[1] ? c[1].v : '',
                        options: {
                            A: c[2] ? c[2].v : '',
                            B: c[3] ? c[3].v : '',
                            C: c[4] ? c[4].v : '',
                            D: c[5] ? c[5].v : ''
                        },
                        answer: c[6] ? c[6].v : ''
                    };
                });

                console.log('Questions:', questions); // Log questions for debugging
                if (questions.length) {
                    displayQuestion();
                } else {
                    console.error('No questions found.');
                }
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Display a question
function displayQuestion() {
    if (questions.length === 0) return;

    const question = questions[currentQuestionIndex];
    document.getElementById('question-container').innerText = question.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    Object.keys(question.options).forEach(optionKey => {
        const option = question.options[optionKey];
        if (option) {
            const button = document.createElement('button');
            button.innerText = `${optionKey}: ${option}`;
            button.onclick = () => checkAnswer(optionKey);
            optionsContainer.appendChild(button);
        }
    });
}

// Check answer
function checkAnswer(selectedOption) {
    if (questions.length === 0) return;

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
