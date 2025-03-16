const recordBtn = document.getElementById("record-btn");
const pauseBtn = document.getElementById("pause-btn");
const textBox = document.getElementById("text-box");
const status = document.getElementById("status");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

let isRecording = false;
let silenceTimer;
recognition.continuous = true;
recognition.lang = 'ta-IN';
recognition.interimResults = false;

recordBtn.addEventListener("click", () => {
    if (!isRecording) {
        recognition.start();
        status.textContent = "Listening...";
        isRecording = true;
    }
});

pauseBtn.addEventListener("click", () => {
    if (isRecording) {
        recognition.stop();
        status.textContent = "Paused. Click the mic to resume.";
        isRecording = false;
    }
});

recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    textBox.value += transcript + " ";
    resetSilenceTimer();
};

recognition.onerror = (event) => {
    status.textContent = "Error occurred: " + event.error;
    isRecording = false;
};

// Automatically stop if no voice detected for 5 seconds
recognition.onspeechend = () => {
    resetSilenceTimer();
};

function resetSilenceTimer() {
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
        if (isRecording) {
            recognition.stop();
            status.textContent = "Stopped due to inactivity. Click the mic to start again.";
            isRecording = false;
        }
    }, 5000);
}

