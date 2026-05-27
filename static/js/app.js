let pdfUploaded = false;

// DOM Elements
const uploadBox = document.getElementById('uploadBox');
const pdfFile = document.getElementById('pdfFile');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const queryInput = document.getElementById('queryInput');
const askBtn = document.getElementById('askBtn');
const chatHistory = document.getElementById('chatHistory');

// Upload Box Click and Drag-Drop
uploadBox.addEventListener('click', () => pdfFile.click());
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('drag-over');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('drag-over');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        pdfFile.files = files;
        handleFileSelect();
    } else {
        showStatus('Please drop a PDF file', 'error');
    }
});

pdfFile.addEventListener('change', handleFileSelect);

function handleFileSelect() {
    if (pdfFile.files.length > 0) {
        const fileName = pdfFile.files[0].name;
        const fileSize = (pdfFile.files[0].size / 1024 / 1024).toFixed(2);
        
        uploadBox.innerHTML = `<p>✓ ${fileName}</p><span class="file-size">${fileSize} MB</span>`;
        uploadBtn.style.display = 'block';
        showStatus('Ready to upload', 'info');
    }
}

uploadBtn.addEventListener('click', uploadPDF);

async function uploadPDF() {
    if (pdfFile.files.length === 0) {
        showStatus('Please select a PDF file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile.files[0]);

    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    showStatus('Uploading PDF...', 'info');

    try {
        const response = await fetch('/upload-pdf/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }

        const data = await response.json();
        
        showStatus(`✓ ${data.message} (${data.total_chunks} chunks created)`, 'success');
        pdfUploaded = true;
        
        // Enable chat
        queryInput.disabled = false;
        askBtn.disabled = false;
        
        // Clear chat history and show ready message
        chatHistory.innerHTML = '<div class="chat-message info-message"><p>PDF loaded! Ask your questions below.</p></div>';
        
        uploadBtn.textContent = 'Upload PDF';
        uploadBtn.disabled = false;
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
        uploadBtn.textContent = 'Upload PDF';
        uploadBtn.disabled = false;
    }
}

queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !queryInput.disabled && queryInput.value.trim()) {
        askQuestion();
    }
});

askBtn.addEventListener('click', askQuestion);

async function askQuestion() {
    const query = queryInput.value.trim();

    if (!query) {
        showStatus('Please enter a question', 'error');
        return;
    }

    if (!pdfUploaded) {
        showStatus('Please upload a PDF first', 'error');
        return;
    }

    // Add user message to chat
    addChatMessage(query, 'user');
    queryInput.value = '';
    queryInput.disabled = true;
    askBtn.disabled = true;
    askBtn.textContent = 'Asking...';

    try {
        const response = await fetch(`/ask/?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Add assistant response to chat
        addChatMessage(data.answer, 'assistant');
        
        queryInput.disabled = false;
        askBtn.disabled = false;
        askBtn.textContent = 'Send';
        queryInput.focus();
    } catch (error) {
        addChatMessage(`Error: ${error.message}`, 'assistant');
        queryInput.disabled = false;
        askBtn.disabled = false;
        askBtn.textContent = 'Send';
    }
}

function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    // Format the message text
    const p = document.createElement('p');
    p.textContent = message;
    messageDiv.appendChild(p);
    
    chatHistory.appendChild(messageDiv);
    
    // Scroll to bottom
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showStatus(message, type) {
    uploadStatus.textContent = message;
    uploadStatus.className = `status-message show ${type}`;
    
    // Auto-hide info messages after 5 seconds
    if (type === 'info') {
        setTimeout(() => {
            uploadStatus.classList.remove('show');
        }, 5000);
    }
}

// Initialize
chatHistory.innerHTML = '<div class="chat-message info-message"><p>Upload a PDF to get started!</p></div>';
