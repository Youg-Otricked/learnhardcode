const modal = document.getElementById("share-code-modal");
const openBtn = document.getElementById("share");
const closeBtn = document.getElementsByClassName("close")[0];
const copyBtn = document.getElementById("copyButton");
const copyInput = document.getElementById("copyInput");
const toast = document.getElementById("toast-copy");
const codeTextarea = document.getElementById('code');

// Open modal with animation
openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let state = toBinary(codeTextarea.value);
    copyInput.value = window.location.href + '?state=' + state;
    modal.classList.add('active');
    modal.style.display = "block";
});

// Close modal
const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300); // Match transition duration
};

closeBtn.addEventListener('click', closeModal);

// Close when clicking outside modal
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Copy functionality with toast notification
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(copyInput.value);

        // Show toast
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);

        // Button feedback
        copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    Copied!
                `;
        setTimeout(() => {
            copyBtn.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                        Copy
                    `;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        copyInput.select();
        document.execCommand('copy');

        // Simple feedback if Clipboard API fails
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }
});