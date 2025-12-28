const CONFIG = {
    dir: './articles/',
    manifest: 'articles.json',
    heroImages: [
        'https://i.ibb.co/JWNrG3tL/Misty-desert-view-to-the-west-1920x1080.png',
        'https://i.ibb.co/Pv1bw9n3/Copper-Age.png', 
        'https://i.ibb.co/7xkWFBX4/The-main-island-of-the-end-1920x1080.png'
    ]
};

const state = {
    allArticles: [],
    currentArticles: [],
    categories: new Set(),
    activeCategories: [],
    theme: localStorage.getItem('theme') || 'system'
};

const dom = {
    grid: document.getElementById('articlesGrid'),
    articleView: document.getElementById('articleView'),
    mainContent: document.getElementById('mainContent'),
    hero: document.getElementById('heroSection'),
    heroBg: document.getElementById('heroBg'),
    controls: document.getElementById('controlsSection'),
    navSearch: document.getElementById('navSearchBar'),
    progressBar: document.getElementById('readingProgress'),
    renderer: document.getElementById('articleRenderer'),
    artTitle: document.getElementById('artTitle'),
    artCover: document.getElementById('artCover'),
    artAuthorAvatar: document.getElementById('artAuthorAvatar'),
    artAuthorName: document.getElementById('artAuthorName'),
    artDate: document.getElementById('artDate'),
    artCategories: document.getElementById('artCategories'),
    readTime: document.getElementById('readTime'),
    search: document.getElementById('searchInput'),
    sort: document.getElementById('sortSelect'),
    cats: document.getElementById('categoryFilters'),
    themeToggle: document.getElementById('themeToggle'),
    backBtn: document.getElementById('backBtn'),
    shareBtn: document.getElementById('shareBtn'),
    logoBtn: document.getElementById('logoBtn'),
    toast: document.getElementById('toast'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightboxImg'),
    lightboxCaption: document.getElementById('lightboxCaption')
};

// --- INIT ---
async function init() {
    initTheme();
    initHero();
    initListeners();
    await loadArticles();
    handleRouting();
}

// --- DATA FETCHING ---
async function loadArticles() {
    try {
        const res = await fetch(CONFIG.manifest);
        if (!res.ok) throw new Error("Nie znaleziono pliku manifestu");
        const files = await res.json();
        
        const promises = files.map(async file => {
            try {
                const r = await fetch(CONFIG.dir + file);
                if(!r.ok) return null;
                const txt = await r.text();
                return parseArticle(txt, file);
            } catch (e) { 
                console.error("Błąd pliku:", file, e);
                return null; 
            }
        });

        const results = await Promise.all(promises);
        state.allArticles = results.filter(x => x !== null).map(a => ({
            ...a,
            dateObj: new Date(a.meta.date || 0)
        }));
        state.currentArticles = [...state.allArticles];
        
        generateCategories();
        filterAndRender();
    } catch (e) {
        console.error(e);
        dom.grid.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-muted)">Błąd ładowania artykułów. Sprawdź plik articles.json oraz folder articles.</p>';
    }
}

function parseArticle(text, filename) {
    const regex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
    const match = text.match(regex);
    
    if (!match) {
        return { meta: { title: filename, author: '?', date: '?' }, content: text, filename };
    }
    
    const meta = {};
    const metaRaw = match[1];
    const content = match[2];

    metaRaw.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            let key = parts[0].trim();
            let val = parts.slice(1).join(':').trim();
            if (val.startsWith('[') && val.endsWith(']')) {
                val = val.slice(1, -1).split(',').map(s => s.trim());
            }
            meta[key] = val;
        }
    });
    return { meta, content, filename };
}

// --- RENDERER ---
function renderMarkdown(raw) {
    if (!raw) return '<p>Brak treści.</p>';

    let md = raw.replace(/\{c:([a-zA-Z0-9#]+)\}(.*?)\{\/c\}/g, '<span style="color:$1">$2</span>');

    let html = marked.parse(md, { 
        breaks: true,
        gfm: true
    });

    // Callouts
    html = html.replace(/<blockquote>\s*<p>\s*\[!(NOTE|WARNING|TIP|DANGER)\]\s?(.*?)<\/p>\s*<\/blockquote>/gs, (match, type, content) => {
        const t = type.toLowerCase();
        let icon = 'fa-info-circle';
        if(t === 'warning') icon = 'fa-exclamation-triangle';
        if(t === 'tip') icon = 'fa-lightbulb';
        if(t === 'danger') icon = 'fa-bomb';

        return `
            <div class="callout callout-${t}">
                <i class="fas ${icon} callout-icon"></i>
                <div class="callout-content"><p>${content}</p></div>
            </div>
        `;
    });

    // YouTube
    html = html.replace(/<a href="youtube:([^"]+)">.*?<\/a>/g, 
        '<div class="video-container"><iframe src=" frameborder="0" allowfullscreen></iframe></div>');

    // Code
    html = html.replace(/<pre><code/g, '<div class="code-wrapper"><button class="copy-btn" onclick="copyCode(this)">Kopiuj</button><pre><code');
    html = html.replace(/<\/code><\/pre>/g, '</code></pre></div>');

    // Tables
    html = html.replace(/<table>/g, '<div class="table-wrapper"><table>');
    html = html.replace(/<\/table>/g, '</table></div>');

    // Checklist
    html = html.replace(/<li><input disabled="" type="checkbox"/g, '<li class="checklist-item"><input disabled type="checkbox"');
    html = html.replace(/<li><input checked="" disabled="" type="checkbox"/g, '<li class="checklist-item"><input checked disabled type="checkbox"');

    // Images
    html = html.replace(/<img src="([^"]+)" alt="([^"]+)">/g, 
        '<img src="$1" alt="$2" title="$2"><span class="img-caption">$2</span>');

    return DOMPurify.sanitize(html, {
        ADD_TAGS: ["iframe", "button", "input", "i", "div", "span"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "target", "style", "class", "onclick", "type", "checked", "disabled", "data-labels"]
    });
}

// --- UI LOGIC ---
function openArticleView(article) {
    dom.mainContent.classList.add('hidden');
    dom.controls.classList.add('hidden');
    dom.hero.classList.add('hidden');
    dom.navSearch.classList.add('hidden');
    dom.articleView.classList.remove('hidden');
    window.scrollTo(0,0);

    dom.artTitle.textContent = article.meta.title || 'Bez tytułu';
    dom.artCover.src = article.meta.image || '';
    dom.artAuthorName.textContent = article.meta.author || 'Anonim';
    
    // OBSŁUGA AVATARA (WŁASNY LUB GENEROWANY)
    dom.artAuthorAvatar.src = article.meta.avatar || `https://ui-avatars.com/api/?name=${article.meta.author || 'A'}&background=random&color=fff`;
    
    dom.artDate.textContent = article.meta.date || '';
    
    const cats = Array.isArray(article.meta.categories) ? article.meta.categories : [article.meta.categories];
    dom.artCategories.innerHTML = cats.map(c => c ? `<span class="tag">${c}</span>` : '').join('');
    
    const words = article.content ? article.content.split(/\s+/).length : 0;
    dom.readTime.innerHTML = `<i class="far fa-clock"></i> ${Math.ceil(words/200)} min czytania`;

    dom.renderer.innerHTML = renderMarkdown(article.content);

    initTabs(dom.renderer);

    dom.renderer.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => {
            dom.lightboxImg.src = img.src;
            dom.lightboxCaption.textContent = img.alt || '';
            dom.lightbox.classList.add('visible');
        });
    });
}

function initTabs(container) {
    const tabGroups = container.querySelectorAll('.tabs');
    tabGroups.forEach(group => {
        const labelsAttr = group.getAttribute('data-labels');
        if(!labelsAttr) return;
        
        const labels = labelsAttr.split(',');
        const contents = Array.from(group.children);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'tabs-container';
        
        const header = document.createElement('div');
        header.className = 'tabs-header';
        
        const contentBox = document.createElement('div');
        
        labels.forEach((label, i) => {
            const btn = document.createElement('button');
            btn.className = `tab-btn ${i===0?'active':''}`;
            btn.textContent = label.trim();
            btn.onclick = () => {
                header.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                contentBox.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                if(contentBox.children[i]) contentBox.children[i].classList.add('active');
            };
            header.appendChild(btn);
            
            const contentDiv = document.createElement('div');
            contentDiv.className = `tab-content ${i===0?'active':''}`;
            if(contents[i]) contentDiv.appendChild(contents[i]);
            contentBox.appendChild(contentDiv);
        });

        wrapper.appendChild(header);
        wrapper.appendChild(contentBox);
        group.parentNode.replaceChild(wrapper, group);
    });
}

window.copyCode = function(btn) {
    const code = btn.nextElementSibling.innerText;
    navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Skopiowano!';
        setTimeout(()=>btn.textContent='Kopiuj', 2000);
    });
};

function closeArticleView() {
    dom.articleView.classList.add('hidden');
    dom.navSearch.classList.remove('hidden');
    dom.mainContent.classList.remove('hidden');
    dom.controls.classList.remove('hidden');
    if(dom.search.value === '') dom.hero.classList.remove('hidden');
    dom.progressBar.style.width = '0%';
    
    if (window.location.hash.includes('article=')) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }
}

// --- FILTERING & RENDER GRID ---
function generateCategories() {
    state.categories.clear();
    state.allArticles.forEach(a => {
        const c = Array.isArray(a.meta.categories) ? a.meta.categories : [a.meta.categories];
        c.forEach(x => x && state.categories.add(x));
    });
    
    dom.cats.querySelectorAll('button:not([data-cat="all"])').forEach(e => e.remove());
    
    state.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'pill';
        btn.textContent = cat;
        btn.onclick = () => toggleCat(cat, btn);
        dom.cats.appendChild(btn);
    });
    
    dom.cats.querySelector('[data-cat="all"]').onclick = function() {
        state.activeCategories = [];
        dom.cats.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        filterAndRender();
    };
}

function toggleCat(cat, btn) {
    dom.cats.querySelector('[data-cat="all"]').classList.remove('active');
    if(state.activeCategories.includes(cat)) {
        state.activeCategories = state.activeCategories.filter(c=>c!==cat);
        btn.classList.remove('active');
    } else {
        state.activeCategories.push(cat);
        btn.classList.add('active');
    }
    if(state.activeCategories.length===0) dom.cats.querySelector('[data-cat="all"]').classList.add('active');
    filterAndRender();
}

function filterAndRender() {
    const sVal = dom.search.value.toLowerCase();
    dom.hero.classList.toggle('collapsed', sVal.length > 0);
    
    state.currentArticles = state.allArticles.filter(a => {
        const title = (a.meta.title || '').toLowerCase();
        const content = (a.content || '').toLowerCase();
        
        const matchSearch = title.includes(sVal) || content.includes(sVal);
        let matchCat = true;
        
        if(state.activeCategories.length > 0) {
            const ac = Array.isArray(a.meta.categories) ? a.meta.categories : [a.meta.categories];
            matchCat = state.activeCategories.some(x => ac.includes(x));
        }
        return matchSearch && matchCat;
    });
    
    const sort = dom.sort.value;
    state.currentArticles.sort((a,b) => sort==='newest' ? b.dateObj - a.dateObj : a.dateObj - b.dateObj);
    
    dom.grid.innerHTML = '';
    if(!state.currentArticles.length) {
        dom.grid.innerHTML = '<p style="user-select: none; grid-column:1/-1; text-align:center; color:var(--text-muted)">Brak wyników wyszukiwania.</p>';
        return;
    }
    
    state.currentArticles.forEach(a => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="card-img-wrapper"><img src="${a.meta.image || ''}" class="card-img" loading="lazy" draggable="false"></div>
            <div class="card-body">
                <div class="card-meta"><span>${a.meta.author || '?'}</span><span>${a.meta.date || ''}</span></div>
                <h3 class="card-title">${a.meta.title || 'Bez tytułu'}</h3>
                <p class="card-excerpt">${(a.content || '').replace(/[#*`_\[\]]/g, '').substring(0, 120)}...</p>
                <div>${(Array.isArray(a.meta.categories)?a.meta.categories:[a.meta.categories]).map(c=>c?`<span class="tag">${c}</span>`:'').join(' ')}</div>
            </div>
        `;
        div.onclick = () => window.location.hash = `article=${a.filename}`;
        dom.grid.appendChild(div);
    });
}

// --- UTILS ---
function initTheme() {
    const set = () => {
        const dark = state.theme==='dark' || (state.theme==='system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.setAttribute('data-theme', dark?'dark':'light');
        dom.themeToggle.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };
    dom.themeToggle.addEventListener('click', () => {
        state.theme = (state.theme==='dark' || (state.theme==='system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'light' : 'dark';
        localStorage.setItem('theme', state.theme);
        set();
    });
    set();
}

// --- NAPRAWIONA ANIMACJA HERO (CROSS-FADE) ---
function initHero() {
    const slides = CONFIG.heroImages;
    if (slides.length === 0) return;
    
    let i = 0;
    
    // Ustawiamy styl startowy
    dom.heroBg.style.backgroundImage = `url(${slides[0]})`;
    dom.heroBg.style.transition = 'opacity 1s ease-in-out';
    dom.heroBg.style.opacity = '1';
    
    if (slides.length < 2) return;

    // Tworzymy drugą warstwę (back-layer) do płynnego przejścia
    const bgBack = document.createElement('div');
    bgBack.className = 'hero-bg'; 
    bgBack.id = 'heroBgBack';
    bgBack.style.zIndex = '-3'; 
    bgBack.style.backgroundImage = `url(${slides[0]})`;
    
    // Dodajemy do DOM
    dom.hero.insertBefore(bgBack, dom.heroBg);

    setInterval(() => {
        const nextIndex = (i + 1) % slides.length;
        const nextImg = slides[nextIndex];

        // 1. Ustawiamy spodnią warstwę na NOWE zdjęcie
        bgBack.style.backgroundImage = `url(${nextImg})`;

        // 2. Wygaszamy górną warstwę (stare zdjęcie)
        dom.heroBg.style.opacity = '0';

        // 3. Po zakończeniu animacji (1s) podmieniamy zdjęcie na górze i przywracamy opacity
        setTimeout(() => {
            dom.heroBg.style.backgroundImage = `url(${nextImg})`;
            dom.heroBg.style.opacity = '1';
            i = nextIndex;
        }, 1000); 

    }, 6000); // Zmiana co 6 sekund
}

function handleRouting() {
    const hash = window.location.hash;
    if(hash.startsWith('#article=')) {
        const fname = hash.replace('#article=', '');
        const art = state.allArticles.find(a => a.filename === fname);
        if(art) openArticleView(art);
    } else closeArticleView();
}
window.addEventListener('hashchange', handleRouting);

function initListeners() {
    dom.search.addEventListener('input', filterAndRender);
    dom.sort.addEventListener('change', filterAndRender);
    dom.backBtn.addEventListener('click', () => window.location.hash='');
    dom.logoBtn.addEventListener('click', (e) => { e.preventDefault(); window.location.hash=''; });
    
    dom.shareBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        dom.toast.classList.remove('hidden');
        setTimeout(()=>dom.toast.classList.add('hidden'), 2000);
    });

    dom.lightbox.querySelector('.lightbox-close').addEventListener('click', () => dom.lightbox.classList.remove('visible'));
    
    window.addEventListener('scroll', () => {
        if(dom.articleView.classList.contains('hidden')) { dom.progressBar.style.width = '0%'; return; }
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        dom.progressBar.style.width = (winScroll / height) * 100 + "%";
    });
}

init();
