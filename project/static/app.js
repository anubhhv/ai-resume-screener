let keywords = [];

document.addEventListener('DOMContentLoaded', () => {
    const keywordInput = document.getElementById('keywordInput');
    const addBtn = document.getElementById('addKeywordBtn');
    const clearBtn = document.getElementById('clearKeywords');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');

    addBtn.addEventListener('click', addKeyword);
    clearBtn.addEventListener('click', () => { keywords = []; renderKeywords(); });

    keywordInput.addEventListener('keypress', e => { if(e.key==='Enter') addKeyword(); });

    fileInput.addEventListener('change', handleFileSelect);

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
    uploadArea.addEventListener('dragleave', e => { uploadArea.classList.remove('dragover'); });
    uploadArea.addEventListener('drop', e => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        fileInput.files = files;
        handleFileSelect({ target: { files } });
    });
});

function addKeyword() {
    const input = document.getElementById('keywordInput');
    const kw = input.value.trim();
    if(kw && !keywords.includes(kw)) keywords.push(kw);
    input.value = '';
    renderKeywords();
}

function renderKeywords() {
    const container = document.getElementById('keywordTags');
    container.innerHTML = keywords.map((k,i)=>`<div class="tag">${k}<span class="remove" onclick="removeKeyword(${i})">×</span></div>`).join('');
}

function removeKeyword(i) { keywords.splice(i,1); renderKeywords(); }

async function handleFileSelect(e) {
    const files = e.target.files;
    if(!files.length) return;

    document.getElementById('processing').style.display = 'block';

    const formData = new FormData();
    formData.append('keywords', keywords.join(','));
    for(const file of files) formData.append('files', file);

    try {
        const res = await fetch('/upload', { method: 'POST', body: formData });
        const data = await res.json();
        displayResults(data);
    } catch(err) {
        console.error('Error uploading files:', err);
    } finally {
        document.getElementById('processing').style.display = 'none';
    }
}

function displayResults(results) {
    const container = document.getElementById('resultsContainer');
    const statsSection = document.getElementById('stats');

    if(!results.length) {
        container.innerHTML = '<div class="no-results">No results found.</div>';
        statsSection.style.display = 'none';
        return;
    }

    container.innerHTML = results.map(r => {
        const matched = r.matched_keywords.map(m=>`${m.keyword} (${m.count})`).join(', ');
        return `<div class="resume-card">
            <div class="resume-header">
                <div class="resume-name">${r.filename}</div>
                <div class="score-badge">${r.score}% Match</div>
            </div>
            <p><strong>Matched Keywords:</strong> ${matched || 'None'}</p>
        </div>`;
    }).join('');

    statsSection.style.display = 'block';
    const totalResumes = results.length;
    const avgScore = Math.round(results.reduce((sum,r)=>sum+r.score,0)/totalResumes);
    const topMatches = results.filter(r=>r.score>=70).length;

    document.getElementById('totalResumes').textContent = totalResumes;
    document.getElementById('avgScore').textContent = `${avgScore}%`;
    document.getElementById('topMatches').textContent = topMatches;
}