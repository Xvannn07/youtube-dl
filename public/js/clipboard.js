const pasteContainer = document.getElementById("paste");
const linkContainer = document.getElementById("video-url");

function togglePasteButton() {
    const icon = pasteContainer.querySelector('i');
    if (linkContainer.value) {
        icon.classList.replace('fa-paste', 'fa-times');
        pasteContainer.setAttribute('title', 'Clear');
    } else {
        icon.classList.replace('fa-times', 'fa-paste');
        pasteContainer.setAttribute('title', 'Paste');
    }
}

// Handle paste button click
pasteContainer.addEventListener('click', async () => {
    if (linkContainer.value) {
        linkContainer.value = '';
    } else {
        try {
            // Meminta izin clipboard
            await navigator.permissions.query({ name: 'clipboard-read' }).then(async (result) => {
                if (result.state === 'granted' || result.state === 'prompt') {
                    const text = await navigator.clipboard.readText();
                    linkContainer.value = text;
                } else {
                    console.error('Clipboard read permission denied');
                    showAlert('Clipboard read permission denied', 'danger');
                }
            });
        } catch (err) {
            console.error('Failed to read clipboard:', err);
            showAlert('Failed to read clipboard contents', 'danger');
        }
    }
    togglePasteButton();
});
