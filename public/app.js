document.getElementById('trackerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        yoga: parseInt(document.getElementById('yoga').value),
        cardio: parseInt(document.getElementById('cardio').value),
        sleep: parseFloat(document.getElementById('sleep').value),
        dailyGratitude: document.getElementById('dailyGratitude').value
    };

    try {
        const response = await fetch('/api/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            e.target.reset();
            loadEntries();
            showSuccessMessage();
        }
    } catch (error) {
        console.error('Error saving entry:', error);
        showErrorMessage();
    }
});

function showSuccessMessage() {
    const button = document.querySelector('button');
    const originalText = button.textContent;
    button.textContent = '✨ Entry Saved!';
    button.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#2c3e50';
    }, 2000);
}

function showErrorMessage() {
    const button = document.querySelector('button');
    const originalText = button.textContent;
    button.textContent = '❌ Error Saving Entry';
    button.style.backgroundColor = '#c0392b';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#2c3e50';
    }, 2000);
}

async function loadEntries() {
    try {
        const response = await fetch('/api/entries');
        const entries = await response.json();
        
        // Update dashboard
        const dashboardContainer = document.getElementById('dashboard');
        import('./js/components/dashboard.js')
            .then(module => {
                dashboardContainer.innerHTML = module.renderDashboard(entries);
            });
        
        // Update entries list
        const entriesList = document.getElementById('entriesList');
        entriesList.innerHTML = entries.reverse().map(entry => `
            <div class="entry">
                <h3>${new Date(entry.date).toLocaleDateString()}</h3>
                <p><strong>🧘 Yoga:</strong> ${entry.yoga} minutes</p>
                <p><strong>🏃‍♂️ Cardio:</strong> ${entry.cardio} minutes</p>
                <p><strong>😴 Sleep:</strong> ${entry.sleep} hours</p>
                <p><strong>🙏 Gratitude:</strong> ${entry.dailyGratitude}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}

// Load entries when the page loads
loadEntries();