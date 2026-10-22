/* ============================================================
   NOCH PORTFOLIO — script.js
   Navigation, dynamic loaders, interaction enhancements
   ============================================================ */

/*-- Navigation --*/
const nav = document.querySelector('.nav'),
    navList = nav.querySelectorAll('li'),
    totalNavList = navList.length;
    allSection = document.querySelectorAll('.section'),
    totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector('a');
    a.addEventListener('click', function () {
        removeBackSection();
        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector('a').classList.contains('active')) {
                addBackSection(j);
            }
            navList[j].querySelector('a').classList.remove('active');
        }
        this.classList.add('active');
        showSection(this);
        if (window.innerWidth < 1200) {
            closeNavDrawer();
        }
    });
}

function removeBackSection() {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove('back-section');
    }
}
function addBackSection(num) {
    allSection[num].classList.add('back-section');
}
function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove('active');
    }
    const target = element.getAttribute('href').split('#')[1];
    document.querySelector('#' + target).classList.add('active');
}
function updateNav(element) {
    for (let i = 0; i < totalNavList; i++) {
        navList[i].querySelector('a').classList.remove('active');
        const target = element.getAttribute('href').split('#')[1];
        if (target === navList[i].querySelector('a').getAttribute('href').split('#')[1]) {
            navList[i].querySelector('a').classList.add('active');
        }
    }
}

document.querySelector('.hire-me').addEventListener('click', function () {
    const sectionIndex = this.getAttribute('data-section-index');
    showSection(this);
    updateNav(this);
    removeBackSection();
    addBackSection(sectionIndex);
});

const navTogglerBtn = document.querySelector('.nav-toggler'),
    aside = document.querySelector('.aside');
navTogglerBtn.addEventListener('click', () => { asideSectionTogglerBtn(); });

function asideSectionTogglerBtn() {
    aside.classList.toggle('open');
    navTogglerBtn.classList.toggle('open');
    // Sync global burger button state
    var globalBtn = document.getElementById('globalNavToggler');
    if (globalBtn) globalBtn.classList.toggle('open');
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.toggle('open');
    }
}

// Close drawer via global handler (set by inline script)
function closeNavDrawer() {
    if (window._closeNavDrawer) window._closeNavDrawer();
}

/* ── Pixel cursor flash on nav click ───────────────────────── */
navList.forEach(li => {
    li.querySelector('a').addEventListener('click', function() {
        const flash = document.createElement('span');
        flash.style.cssText = 'position:fixed;top:50%;left:50%;width:4px;height:4px;background:var(--skin-color);pointer-events:none;z-index:9999;animation:pixelFlash 0.3s steps(3) forwards;';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 350);
    });
});

/* inject pixelFlash keyframes */
(function() {
    const s = document.createElement('style');
    s.textContent = '@keyframes pixelFlash{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(32);opacity:0}}';
    document.head.appendChild(s);
})();

/*-- Dynamic Services Loader --*/
async function loadServices() {
    const row = document.getElementById('servicesRow');
    if (!row) return;
    try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (!res.ok || !data.success || !data.data || data.data.length === 0) return;
        row.innerHTML = data.data.map(function (s) {
            return '<div class="service-item padd-15">'
                + '<div class="service-item-inner">'
                + '<div class="icon"><i class="fa ' + (s.icon || 'fa-code') + '"></i></div>'
                + '<h4>' + (s.title || '') + '</h4>'
                + '<p>' + (s.description || '') + '</p>'
                + '</div></div>';
        }).join('');
    } catch (err) {
        console.warn('Services API tidak tersedia.');
    }
}

/*-- Dynamic Profile Loader --*/
async function loadProfile() {
    try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (!res.ok || !data.success || !data.data) return;
        const p = data.data;

        const nameEl = document.querySelector('.hello span');
        if (nameEl && p.name) nameEl.textContent = p.name;

        const homeBio = document.querySelector('.home-info p');
        if (homeBio && p.bio) homeBio.textContent = p.bio;

        const profileImg = document.querySelector('.home-img img');
        if (profileImg && p.profile_image_url) profileImg.src = p.profile_image_url;

        if (p.cv_file_url) {
            const cvBtn = document.querySelector('.home-info .btn');
            if (cvBtn) { cvBtn.href = p.cv_file_url; cvBtn.setAttribute('download', ''); }
        }

        const infoMap = {
            'Birthday': 'birthday', 'Age': 'age', 'Instagram': 'instagram',
            'Gmail': 'email', 'Website': 'website', 'Phone': 'phone',
            'City': 'location', 'Country': 'country', 'Freelance': 'freelance',
        };
        const infoItems = document.querySelectorAll('.info-item p');
        infoItems.forEach(function (item) {
            const text = item.textContent || '';
            for (const [label, key] of Object.entries(infoMap)) {
                if (text.includes(label + ' :') && p[key]) {
                    const span = item.querySelector('span');
                    if (span) span.textContent = p[key];
                }
            }
        });

        const contactItems = document.querySelectorAll('.contact-info-item p');
        contactItems.forEach(function (el) {
            const h4 = el.previousElementSibling?.previousElementSibling;
            if (!h4) return;
            const label = h4.textContent?.trim();
            if (label === 'Call Me On' && p.phone) el.textContent = p.phone;
            if (label === 'Office' && p.location) el.textContent = p.location;
            if (label === 'Gmail' && p.email) el.textContent = p.email;
            if (label === 'Website' && p.website) el.textContent = p.website;
        });
    } catch (err) {
        console.warn('Profile API tidak tersedia.');
    }
}

/*-- Dynamic Skills Loader --*/
async function loadSkills() {
    const skillsContainer = document.querySelector('.skills .row');
    if (!skillsContainer) return;
    try {
        const res = await fetch('/api/skills');
        const data = await res.json();
        if (!res.ok || !data.success || !data.data || data.data.length === 0) return;
        skillsContainer.innerHTML = data.data.map(function (s) {
            const level = Math.min(100, Math.max(0, Number(s.level) || 0));
            return '<div class="skill-item padd-15">'
                + '<h5>' + (s.name || '') + '</h5>'
                + '<div class="progress">'
                + '<div class="progress-in" style="width:' + level + '%;"></div>'
                + '<div class="skill-percent">' + level + '%</div>'
                + '</div></div>';
        }).join('');
    } catch (err) {
        console.warn('Skills API tidak tersedia.');
    }
}

/*-- Init --*/
document.addEventListener('DOMContentLoaded', function () {
    loadProfile();
    loadServices();
    loadSkills();
    loadCertificates();
    loadTasks();
});

/*-- Dynamic Tasks Loader --*/
async function loadTasks() {
    var row = document.getElementById('tasksRow');
    if (!row) return;
    try {
        var res = await fetch('/api/tasks');
        var data = await res.json();
        var items = (data && data.success && Array.isArray(data.data)) ? data.data : [];
        if (items.length === 0) {
            row.innerHTML = '<div style="flex:0 0 100%;max-width:100%;text-align:center;padding:40px 0;color:var(--text-black-700)">Belum ada task.</div>';
            return;
        }

        var iconMap = {
            doc: 'fa-file-word',
            pdf: 'fa-file-pdf',
            video: 'fa-file-video',
            presentation: 'fa-file-powerpoint',
            other: 'fa-file-alt',
        };
        var colorMap = {
            doc: '#4285f4',
            pdf: '#ea4335',
            video: '#ff0000',
            presentation: '#fbbc04',
            other: 'var(--skin-color)',
        };

        row.innerHTML = items.map(function (t) {
            var iconClass = iconMap[t.link_type] || 'fa-file-alt';
            var iconColor = colorMap[t.link_type] || 'var(--skin-color)';
            var taskNum = t.task_number ? 'Task ' + t.task_number : '';
            return '<div class="portfolio-item padd-15">'
                + '<div class="portfolio-item-inner shadow-dark" style="display:flex;flex-direction:column;height:100%;padding:20px;border-radius:4px;overflow:hidden;">'
                + '<div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:12px;">'
                + '<div style="width:44px;height:44px;border-radius:4px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
                + '<i class="fa ' + iconClass + '" style="font-size:22px;color:' + iconColor + '"></i>'
                + '</div>'
                + '<div style="flex:1;min-width:0;">'
                + (taskNum ? '<span style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--skin-color);opacity:0.8;">' + taskNum + '</span>' : '')
                + '<h4 style="margin:2px 0 0;font-size:14px;font-weight:600;color:var(--text-black-900);line-height:1.3;word-break:break-word;">' + (t.title || '') + '</h4>'
                + '</div>'
                + '</div>'
                + (t.description ? '<p style="font-size:12px;color:var(--text-black-700);line-height:1.5;margin:0 0 12px;flex:1;">' + t.description + '</p>' : '<div style="flex:1"></div>')
                + '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06);">'
                + (t.submitted_date ? '<span style="font-size:10px;color:var(--text-black-700);"><i class="fa fa-calendar" style="margin-right:4px;font-size:9px;"></i>' + t.submitted_date + '</span>' : '<span></span>')
                + '<a href="' + t.link_url + '" target="_blank" rel="noopener noreferrer" class="btn" style="padding:6px 14px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;gap:6px;text-decoration:none;">'
                + '<i class="fa fa-external-link-alt" style="font-size:10px;"></i>'
                + (t.link_label || 'Buka File')
                + '</a>'
                + '</div>'
                + '</div></div>';
        }).join('');
    } catch (err) {
        var row2 = document.getElementById('tasksRow');
        if (row2) row2.innerHTML = '<div style="flex:0 0 100%;max-width:100%;text-align:center;padding:40px 0;color:var(--text-black-700)">Gagal memuat tasks.</div>';
        console.warn('Tasks API error:', err);
    }
}

/*-- Dynamic Certificates Loader --*/
async function loadCertificates() {
    var row = document.getElementById('certificatesRow');
    if (!row) return;
    try {
        var res = await fetch('/api/certificates');
        var data = await res.json();
        var items = (data && data.success && Array.isArray(data.data)) ? data.data : [];
        if (items.length === 0) {
            row.innerHTML = '<div class="certificate-empty">Belum ada sertifikat.</div>';
            return;
        }
        row.innerHTML = items.map(function (c) {
            var imgHtml = c.image
                ? '<div class="certificate-img"><img src="' + c.image + '" alt="' + (c.title || '') + '" loading="lazy" onerror="this.parentElement.style.display=\'none\'"></div>'
                : '<div class="certificate-img certificate-img--placeholder"><i class="fa fa-certificate"></i></div>';
            return '<div class="certificate-item padd-15">'
                + '<div class="certificate-item-inner shadow-dark" onclick="openCertificateDetail(\'' + encodeURIComponent(JSON.stringify(c)) + '\')">'
                + imgHtml
                + '<div class="certificate-info">'
                + '<h4>' + (c.title || '') + '</h4>'
                + (c.issuer ? '<p class="certificate-issuer"><i class="fa fa-building"></i> ' + c.issuer + '</p>' : '')
                + (c.issued_date ? '<p class="certificate-date"><i class="fa fa-calendar"></i> ' + c.issued_date + '</p>' : '')
                + '</div>'
                + '</div></div>';
        }).join('');
    } catch (err) {
        var row2 = document.getElementById('certificatesRow');
        if (row2) row2.innerHTML = '<div class="certificate-empty">Gagal memuat sertifikat.</div>';
        console.warn('Certificates API error:', err);
    }
}

/*-- Certificate Detail Modal --*/
function openCertificateDetail(encoded) {
    var c = JSON.parse(decodeURIComponent(encoded));
    var overlay = document.getElementById('certificateDetailOverlay');
    if (!overlay) return;
    var imgEl = document.getElementById('cdImage');
    if (imgEl) {
        if (c.image) { imgEl.src = c.image; imgEl.style.display = 'block'; }
        else { imgEl.style.display = 'none'; }
    }
    var el = function (id) { return document.getElementById(id); };
    if (el('cdTitle')) el('cdTitle').textContent = c.title || '';
    if (el('cdIssuer')) el('cdIssuer').textContent = c.issuer || '';
    if (el('cdIssuerWrap')) el('cdIssuerWrap').style.display = c.issuer ? 'flex' : 'none';
    if (el('cdDate')) el('cdDate').textContent = c.issued_date || '';
    if (el('cdDateWrap')) el('cdDateWrap').style.display = c.issued_date ? 'flex' : 'none';
    if (el('cdDescription')) el('cdDescription').textContent = c.description || '';
    var verifyEl = el('cdVerifyBtn');
    if (verifyEl) {
        if (c.credential_url) { verifyEl.href = c.credential_url; verifyEl.style.display = 'inline-flex'; }
        else { verifyEl.style.display = 'none'; }
    }
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// closeCertificateDetail defined in inline script (index.tsx) for load-order safety
