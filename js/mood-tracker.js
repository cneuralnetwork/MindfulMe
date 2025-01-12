class MoodTracker {
    constructor() {
        this.moodData = JSON.parse(localStorage.getItem('moodData')) || [];
        this.initializeEventListeners();
        this.renderMoodHistory();
    }

    initializeEventListeners() {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectMood(btn));
        });
        document.getElementById('save-mood').addEventListener('click', () => this.saveMoodEntry());
    }

    selectMood(button) {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    saveMoodEntry() {
        const selectedMood = document.querySelector('.mood-btn.active')?.dataset.mood;
        const factors = Array.from(document.querySelectorAll('.factors-grid input:checked'))
            .map(input => input.value);
        const notes = document.querySelector('.mood-notes textarea').value;

        if (!selectedMood) {
            alert('Please select a mood');
            return;
        }

        const entry = {
            date: new Date().toISOString(),
            mood: selectedMood,
            factors: factors,
            notes: notes
        };

        this.moodData.push(entry);
        localStorage.setItem('moodData', JSON.stringify(this.moodData));
        this.renderMoodHistory();
        this.resetForm();
    }

    renderMoodHistory() {
        const canvas = document.getElementById('mood-chart');
        const ctx = canvas.getContext('2d');

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const moodValues = {
            'great': 5,
            'good': 4,
            'okay': 3,
            'bad': 2,
            'terrible': 1
        };

        const recentEntries = this.moodData.slice(-7);

        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);

        ctx.beginPath();
        ctx.strokeStyle = '#ddd';
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        if (recentEntries.length > 0) {
            const pointSpacing = chartWidth / (recentEntries.length - 1 || 1);

            ctx.beginPath();
            ctx.strokeStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color');
            ctx.lineWidth = 2;

            recentEntries.forEach((entry, index) => {
                const x = padding + (index * pointSpacing);
                const y = canvas.height - padding -
                    ((moodValues[entry.mood] - 1) * (chartHeight / 4));

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                ctx.fillStyle = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color');
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#666';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                const date = new Date(entry.date).toLocaleDateString();
                ctx.fillText(date, x, canvas.height - padding + 20);
            });

            ctx.stroke();
        }

        ctx.fillStyle = '#666';
        ctx.font = '9.2px Arial';
        ctx.textAlign = 'right';
        ['Great', 'Good', 'Okay', 'Bad', 'Terrible'].forEach((label, index) => {
            const y = padding + (index * (chartHeight / 4));
            ctx.fillText(label, padding - 10, y + 5);
        });

    }

    resetForm() {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.factors-grid input').forEach(input => {
            input.checked = false;
        });
        document.querySelector('.mood-notes textarea').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MoodTracker();
});
