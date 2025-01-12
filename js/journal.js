class Journal {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        this.initializeEventListeners();
        this.renderEntries();
    }

    initializeEventListeners() {
        document.getElementById('new-entry').addEventListener('click', () => {
            const form = document.querySelector('.journal-entry-form');
            const button = document.getElementById('new-entry');
            
            if (form.classList.contains('active')) {
                form.classList.remove('active');
                button.textContent = 'New Entry';
                this.resetForm();
            } else {
                form.classList.add('active');
                button.textContent = 'Close';
            }
        });

        // Save entry
        document.getElementById('save-entry').addEventListener('click', () => {
            this.saveEntry();
            document.querySelector('.journal-entry-form').classList.remove('active');
            document.getElementById('new-entry').textContent = 'New Entry';
        });

        document.getElementById('cancel-entry').addEventListener('click', () => {
            document.querySelector('.journal-entry-form').classList.remove('active');
            document.getElementById('new-entry').textContent = 'New Entry';
            this.resetForm();
        });

        document.querySelector('.journal-filters input').addEventListener('input', (e) => {
            this.filterEntries(e.target.value);
        });

        document.querySelector('.journal-filters select').addEventListener('change', (e) => {
            this.sortEntries(e.target.value);
        });
    }

    saveEntry() {
        const title = document.getElementById('entry-title').value;
        const content = document.getElementById('entry-content').value;
        const tags = document.querySelector('.entry-tags input').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        if (!title || !content) {
            alert('Please fill in both title and content');
            return;
        }

        const entry = {
            id: Date.now(),
            title,
            content,
            tags,
            date: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        this.entries.unshift(entry);
        localStorage.setItem('journalEntries', JSON.stringify(this.entries));
        
        this.renderEntries();
        this.resetForm();
        document.querySelector('.journal-entry-form').classList.add('hidden');
    }

    renderEntries() {
        const container = document.getElementById('journal-entries');
        container.innerHTML = '';

        this.entries.forEach(entry => {
            const entryElement = this.createEntryElement(entry);
            container.appendChild(entryElement);
        });
    }

    createEntryElement(entry) {
        const div = document.createElement('div');
        div.className = 'journal-entry';
        div.innerHTML = `
            <h3>${entry.title}</h3>
            <p class="entry-date">${new Date(entry.date).toLocaleDateString()}</p>
            <p class="entry-preview">${entry.content.substring(0, 150)}...</p>
            <div class="entry-tags">
                ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        div.addEventListener('click', () => this.showFullEntry(entry));
        return div;
    }

    showFullEntry(entry) {
        const mainContainer = document.querySelector('.journal-container');
        mainContainer.style.display = 'none';

        const fullEntryView = document.createElement('div');
        fullEntryView.className = 'full-entry-view';
        fullEntryView.innerHTML = `
            <div class="full-entry-content">
                <button class="back-btn">← Back to Journals</button>
                <h2>${entry.title}</h2>
                <p class="entry-date">${new Date(entry.date).toLocaleDateString()}</p>
                <div class="entry-tags">
                    ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="entry-full-content">
                    ${entry.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(fullEntryView);

        const backBtn = fullEntryView.querySelector('.back-btn');
        backBtn.addEventListener('click', () => {
            fullEntryView.remove();
            mainContainer.style.display = 'block';
        });
    }

    filterEntries(searchTerm) {
        const filtered = this.entries.filter(entry => 
            entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        this.renderFilteredEntries(filtered);
    }

    sortEntries(sortMethod) {
        const sorted = [...this.entries];
        if (sortMethod === 'oldest') {
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        this.renderFilteredEntries(sorted);
    }

    renderFilteredEntries(entries) {
        const container = document.getElementById('journal-entries');
        container.innerHTML = '';
        entries.forEach(entry => {
            const entryElement = this.createEntryElement(entry);
            container.appendChild(entryElement);
        });
    }

    resetForm() {
        document.getElementById('entry-title').value = '';
        document.getElementById('entry-content').value = '';
        document.querySelector('.entry-tags input').value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Journal();
});
