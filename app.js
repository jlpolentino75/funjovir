// ==================== VARIABLES GLOBALES ====================
let currentDate = new Date();
let slideIndex = 0;
let autoSlideInterval = null;
let narrationActive = false;
let currentSpeech = null;
let uploadedDocuments = [];

// ==================== NAVEGACIÓN ====================
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active-page');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    localStorage.setItem('currentPage', pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== ACCESIBILIDAD ====================
function toggleNarrador() {
    if (narrationActive) {
        window.speechSynthesis.cancel();
        narrationActive = false;
        showToast('Narrador desactivado', 'info');
    } else {
        const text = document.body.innerText;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        currentSpeech = utterance;
        window.speechSynthesis.speak(utterance);
        narrationActive = true;
        showToast('Narrador activado', 'success');
        utterance.onend = () => { narrationActive = false; };
    }
}

function changeFontSize(action) {
    const body = document.body;
    const currentSize = window.getComputedStyle(body).fontSize;
    let size = parseInt(currentSize);
    if (action === 'increase') size = Math.min(size + 2, 28);
    else if (action === 'decrease') size = Math.max(size - 2, 10);
    body.style.fontSize = size + 'px';
    showToast(`Texto ${action === 'increase' ? 'aumentado' : 'disminuido'} a ${size}px`, 'info');
}

function changeSpacing(action) {
    const body = document.body;
    if (action === 'increase') {
        body.style.letterSpacing = '1.5px';
        body.style.wordSpacing = '3px';
        showToast('Espaciado aumentado', 'info');
    } else {
        body.style.letterSpacing = 'normal';
        body.style.wordSpacing = 'normal';
        showToast('Espaciado normal', 'info');
    }
}

function toggleGrayscale() { 
    document.body.classList.toggle('grayscale'); 
    showToast(document.body.classList.contains('grayscale') ? 'Modo escala de grises activado' : 'Modo escala de grises desactivado', 'info');
}

function toggleHighContrast() { 
    document.body.classList.toggle('high-contrast'); 
    showToast(document.body.classList.contains('high-contrast') ? 'Alto contraste activado' : 'Alto contraste desactivado', 'info');
}

function toggleDyslexicFont() { 
    document.body.classList.toggle('dyslexic'); 
    showToast(document.body.classList.contains('dyslexic') ? 'Fuente para disléxicos activada' : 'Fuente normal activada', 'info');
}

function toggleLargeCursor() { 
    document.body.classList.toggle('large-cursor'); 
    showToast(document.body.classList.contains('large-cursor') ? 'Cursor grande activado' : 'Cursor normal activado', 'info');
}

function toggleHighlightLinks() { 
    document.body.classList.toggle('highlight-links'); 
    showToast(document.body.classList.contains('highlight-links') ? 'Enlaces resaltados' : 'Resaltado de enlaces desactivado', 'info');
}

function selectLanguage() {
    const lang = prompt('Seleccione idioma / Select language:\n1. Español\n2. English\n3. Português');
    if (lang === '2') showToast('Page content translation would be implemented here', 'info');
    else if (lang === '3') showToast('Conteúdo traduzido aqui', 'info');
    else showToast('Idioma mantenido en español', 'info');
}

function resetAccessibility() {
    document.body.classList.remove('grayscale', 'high-contrast', 'dyslexic', 'large-cursor', 'highlight-links');
    document.body.style.fontSize = '';
    document.body.style.letterSpacing = '';
    document.body.style.wordSpacing = '';
    showToast('Todas las configuraciones de accesibilidad han sido restablecidas', 'success');
}

function openRelayCenter() { 
    window.open('https://www.mintic.gov.co/portal/inicio/', '_blank');
}

// ==================== CHAT BOX ====================
function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    chatBox.classList.toggle('open');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    const messagesDiv = document.getElementById('chatMessages');
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = message;
    messagesDiv.appendChild(userMsg);
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.textContent = getBotResponse(message);
        messagesDiv.appendChild(botMsg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 500);
}

function getBotResponse(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('donar') || lower.includes('donación')) return '¡Gracias por tu interés! Puedes donar en nuestra sección de Donaciones. ¡Cada aporte cuenta! ❤️';
    if (lower.includes('voluntario')) return '¡Qué bueno que quieras ser voluntario! Visita la sección Voluntariado y completa el formulario.';
    if (lower.includes('programa')) return 'Contamos con programas de educación, emprendimiento, deporte e inclusión digital. Visita la sección Programas.';
    if (lower.includes('dirección') || lower.includes('ubicación')) return 'Estamos en Carrera 19 # 18N-31, barrio Villa Rosa, Bucaramanga. ¡Te esperamos!';
    if (lower.includes('contacto')) return 'Puedes contactarnos al +57 322 7327 309 o al correo fundavir@gmail.com';
    if (lower.includes('horario')) return 'Nuestro horario de atención es de lunes a viernes de 8:00 am a 5:00 pm.';
    return 'Gracias por tu mensaje. Por favor visita nuestra página web para más información o contáctanos directamente.';
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#e67e22';
    toast.style.color = 'white';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '14px';
    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== ADMINISTRATIVO - DIRECTIVOS ====================
function showAdminDirectivos() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <article>
            <h2>👥 Junta Directiva FUNJOVIR</h2>
            <p>Conoce a los líderes que guían nuestra fundación hacia el cumplimiento de nuestra misión social.</p>
            <div class="directivos-grid" id="directivosGrid"></div>
        </article>
    `;
    const directivos = [
        { nombre: 'Raúl Fabricio Leguizamón Díaz', cargo: 'Presidente', foto: 'https://randomuser.me/api/portraits/men/32.jpg', descripcion: 'Experto en desarrollo social con 15 años de trayectoria en organizaciones sin ánimo de lucro. Especialista en gerencia deportiva y gestión comunitaria. Ha liderado más de 50 proyectos de impacto social.', pdf: 'hoja_vida_raul.pdf' },
        { nombre: 'Carlos Alberto Pérez', cargo: 'Vicepresidente', foto: 'https://randomuser.me/api/portraits/men/45.jpg', descripcion: 'Especialista en gestión de proyectos sociales y desarrollo comunitario. Ha liderado más de 30 proyectos de impacto social en el oriente colombiano. Magíster en Gerencia Social.', pdf: 'hoja_vida_carlos.pdf' },
        { nombre: 'Laura Fernanda Gómez', cargo: 'Tesorera', foto: 'https://randomuser.me/api/portraits/women/68.jpg', descripcion: 'Contadora pública, máster en finanzas. Experta en gestión financiera de fundaciones y entidades sin ánimo de lucro. Auditora líder certificada.', pdf: 'hoja_vida_laura.pdf' },
        { nombre: 'José Luis Díaz Polentino', cargo: 'Secretario', foto: 'https://randomuser.me/api/portraits/men/52.jpg', descripcion: 'Diseñador Industrial con experiencia en innovación social, formador de Juntas de Acción Comunal y Juntas Administradoras Locales. Gestor cultural.', pdf: 'hoja_vida_jose.pdf' },
        { nombre: 'Marcela Restrepo López', cargo: 'Vocal', foto: 'https://randomuser.me/api/portraits/women/45.jpg', descripcion: 'Psicóloga con enfoque comunitario, especialista en trabajo con jóvenes vulnerables y prevención de violencia. 10 años de experiencia en ONGs.', pdf: 'hoja_vida_marcela.pdf' },
        { nombre: 'Juan Carlos Méndez', cargo: 'Director Ejecutivo', foto: 'https://randomuser.me/api/portraits/men/75.jpg', descripcion: 'Fundador de FUNJOVIR, líder social reconocido por su trabajo en comunidades marginadas. 20 años de experiencia en el sector social.', pdf: 'hoja_vida_juan.pdf' }
    ];
    const grid = document.getElementById('directivosGrid');
    directivos.forEach(d => {
        grid.innerHTML += `
            <div class="directivo-card">
                <img src="${d.foto}" class="directivo-foto" alt="${d.nombre}">
                <h3>${d.nombre}</h3>
                <div class="directivo-cargo">${d.cargo}</div>
                <p class="directivo-descripcion">${d.descripcion}</p>
                <button class="btn-pdf" onclick="viewPDF('${d.pdf}', '${d.nombre}')">📄 Visualizar HV</button>
                <button class="btn-pdf" onclick="downloadPDF('${d.pdf}', '${d.nombre}')">⬇️ Descargar HV</button>
            </div>
        `;
    });
    navigateTo('adminContent');
}

// ==================== ADMINISTRATIVO - MÉTRICAS ====================
function showAdminMetricas() {
    const adminContent = document.getElementById('adminContent');
    const visitas = localStorage.getItem('pageVisits') || 32847;
    const usuarios = localStorage.getItem('uniqueUsers') || 22456;
    const donaciones = localStorage.getItem('totalDonations') || 52345678;
    
    adminContent.innerHTML = `
        <article>
            <h2>📊 Métricas de la Página Web</h2>
            <img src="https://picsum.photos/id/0/600/300" alt="Métricas">
            <p>Estadísticas actualizadas de rendimiento y alcance de nuestra plataforma digital.</p>
            <table class="metrics-table">
                <thead><tr><th>📈 Métrica</th><th>📊 Valor</th><th>📅 Período</th></tr></thead>
                <tbody>
                    <tr><td>Visitas totales (2025)</td><td><strong>${visitas.toLocaleString()}</strong></td><td>Ene - Dic 2025</td></tr>
                    <tr><td>Usuarios únicos</td><td><strong>${usuarios.toLocaleString()}</strong></td><td>Ene - Dic 2025</td></tr>
                    <tr><td>Páginas vistas</td><td><strong>68,234</strong></td><td>Ene - Dic 2025</td></tr>
                    <tr><td>Tasa de rebote</td><td><strong>28%</strong></td><td>Promedio anual</td></tr>
                    <tr><td>Formularios completados</td><td><strong>1,892</strong></td><td>Ene - Dic 2025</td></tr>
                    <tr><td>Donaciones recibidas</td><td><strong>$${donaciones.toLocaleString()} COP</strong></td><td>Ene - Dic 2025</td></tr>
                </tbody>
            </table>
            <button onclick="refreshMetrics()">🔄 Actualizar Métricas</button>
        </article>
    `;
    navigateTo('adminContent');
}

function refreshMetrics() {
    const nuevasVisitas = Math.floor(32847 + Math.random() * 1000);
    localStorage.setItem('pageVisits', nuevasVisitas);
    showAdminMetricas();
    showToast('✅ Métricas actualizadas exitosamente', 'success');
}

// ==================== ADMINISTRATIVO - GESTIONES ====================
function showAdminGestiones() {
    const adminContent = document.getElementById('adminContent');
    const gestiones = [
        { periodo: 'Enero - Marzo 2025', titulo: 'Aprobación Presupuesto Anual', resumen: 'Aprobación del presupuesto anual por $580 millones COP para la ejecución de programas sociales en 2025. Se destinaron recursos para educación, deporte e infraestructura.', pdf: 'informe_trim1.pdf' },
        { periodo: 'Abril - Junio 2025', titulo: 'Alianzas Estratégicas', resumen: 'Firma de alianza con 8 empresas locales para pasantías juveniles. Se beneficiaron 45 jóvenes con prácticas laborales en empresas del sector productivo.', pdf: 'informe_trim2.pdf' },
        { periodo: 'Julio - Septiembre 2025', titulo: 'Inauguración Centro Comunitario', resumen: 'Inauguración del nuevo centro comunitario en Villa Rosa con capacidad para 200 personas diarias. Incluye aula tecnológica, comedor y zona deportiva.', pdf: 'informe_trim3.pdf' },
        { periodo: 'Octubre - Diciembre 2025', titulo: 'Campaña Navideña', resumen: 'Campaña "Un Juguete, Una Sonrisa" beneficiando a 1,500 niños de la comuna 1. Se entregaron juguetes, kits escolares y alimentos.', pdf: 'informe_trim4.pdf' }
    ];
    adminContent.innerHTML = `
        <article>
            <h2>📋 Gestiones Junta Directiva</h2>
            <img src="https://picsum.photos/id/42/600/300" alt="Gestiones">
            <p>Informes detallados de las gestiones realizadas por la junta directiva durante el año 2025.</p>
            <div id="gestionesContainer"></div>
        </article>
    `;
    const container = document.getElementById('gestionesContainer');
    gestiones.forEach(g => {
        container.innerHTML += `
            <div class="documento-item">
                <h4>📌 ${g.periodo} - ${g.titulo}</h4>
                <p>${g.resumen}</p>
                <button class="btn-pdf" onclick="viewPDF('${g.pdf}', '${g.titulo}')">📄 Visualizar Informe</button>
                <button class="btn-pdf" onclick="downloadPDF('${g.pdf}', '${g.titulo}')">⬇️ Descargar Informe</button>
            </div>
        `;
    });
    navigateTo('adminContent');
}

// ==================== ESAL DOCUMENTOS ====================
function loadESALDocuments() {
    const container = document.getElementById('esalDocuments');
    const documentos = [
        { nombre: 'Formulario de inscripción al RUT', descripcion: 'Documento de registro único tributario actualizado ante la DIAN. Requisito fundamental para la identificación tributaria de la fundación.', pdf: 'rut_funjovir.pdf' },
        { nombre: 'Estatutos de la fundación', descripcion: 'Documento legal que contiene las normas de funcionamiento, estructura organizacional y objetivos de la fundación. Aprobados por asamblea.', pdf: 'estatutos.pdf' },
        { nombre: 'Cámara de Comercio actualizada', descripcion: 'Certificado de existencia y representación legal vigente con matrícula mercantil activa. Documento que acredita la personería jurídica.', pdf: 'camara_comercio.pdf' },
        { nombre: 'Informes de gestión anual', descripcion: 'Informe detallado de las actividades, logros y metas alcanzadas durante el año fiscal. Incluye indicadores de impacto social.', pdf: 'informe_gestion.pdf' },
        { nombre: 'Estados financieros dictaminados', descripcion: 'Balance general y estados de resultados auditados por revisor fiscal. Cumple con normas internacionales de contabilidad.', pdf: 'estados_financieros.pdf' },
        { nombre: 'Certificación de representante legal', descripcion: 'Documento que acredita al representante legal de la fundación con sus facultades y poderes. Firmado por el presidente de la junta.', pdf: 'certificacion_legal.pdf' }
    ];
    if (!container) return;
    container.innerHTML = '';
    documentos.forEach(doc => {
        container.innerHTML += `
            <div class="documento-item">
                <h4>📄 ${doc.nombre}</h4>
                <p>${doc.descripcion}</p>
                <button class="btn-pdf" onclick="viewPDF('${doc.pdf}', '${doc.nombre}')">📄 Visualizar</button>
                <button class="btn-pdf" onclick="downloadPDF('${doc.pdf}', '${doc.nombre}')">⬇️ Descargar</button>
            </div>
        `;
    });
}

// ==================== FUNCIONES PDF ====================
function viewPDF(filename, title) {
    showToast(`📄 Visualizando: ${title}`, 'info');
    window.open('#', '_blank');
}

function downloadPDF(filename, title) {
    showToast(`⬇️ Descargando: ${title}`, 'success');
}

// ==================== CARRUSEL ====================
function updateCarousel() {
    const carouselInner = document.querySelector('.carousel-inner');
    if (carouselInner) carouselInner.style.transform = `translateX(-${slideIndex * 100}%)`;
}

function nextSlide() {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length) slideIndex = (slideIndex + 1) % items.length;
    updateCarousel();
}

function prevSlide() {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length) slideIndex = (slideIndex - 1 + items.length) % items.length;
    updateCarousel();
}

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        const homePage = document.getElementById('home');
        if (homePage && homePage.classList.contains('active-page')) {
            nextSlide();
        }
    }, 5000);
}

// ==================== CALENDARIO ====================
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].forEach(d => {
        let el = document.createElement('div');
        el.textContent = d;
        el.style.fontWeight = 'bold';
        el.style.background = '#e67e22';
        el.style.color = 'white';
        el.style.padding = '5px';
        el.style.borderRadius = '5px';
        grid.appendChild(el);
    });
    
    for(let i = 0; i < firstDay; i++) {
        let empty = document.createElement('div');
        empty.style.padding = '8px';
        grid.appendChild(empty);
    }
    
    const today = new Date();
    for(let d = 1; d <= daysInMonth; d++) {
        let day = document.createElement('div');
        day.textContent = d;
        day.classList.add('calendar-day');
        day.style.padding = '8px';
        day.style.background = '#f0f0f0';
        day.style.borderRadius = '5px';
        if(d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day.classList.add('today');
        }
        day.onclick = () => showDayInfo(d, month, year);
        grid.appendChild(day);
    }
    
    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const monthHeader = document.getElementById('currentMonthYear');
    if (monthHeader) {
        monthHeader.innerHTML = `${monthNames[month]} ${year} <button onclick="changeMonth(-1)" style="margin:0 5px; padding:2px 8px;">◀</button> <button onclick="changeMonth(1)" style="padding:2px 8px;">▶</button>`;
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    generateCalendar();
}

function showDayInfo(day, month, year) {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    showToast(`📅 ${day} de ${monthNames[month]} de ${year}\n\nConsulta nuestras actividades para esta fecha en nuestra sede.`, 'info');
}

// ==================== ACTIVIDADES PRÓXIMAS ====================
function loadUpcomingActivities() {
    const activities = [
        { date: '2026-01-20', name: '🎁 Entrega de ayudas comunitarias', location: 'Sede Principal' },
        { date: '2026-02-10', name: '📚 Taller de educación ambiental', location: 'Centro Comunitario' },
        { date: '2026-03-08', name: '👩 Evento Día de la Mujer', location: 'Parque Villa Rosa' },
        { date: '2026-03-15', name: '⚽ Torneo de fútbol juvenil', location: 'Cancha Comunitaria' },
        { date: '2026-04-20', name: '💻 Taller de programación', location: 'Aula Tecnológica' }
    ];
    const list = document.getElementById('activityList');
    if (!list) return;
    list.innerHTML = '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let count = 0;
    activities.forEach(activity => {
        const activityDate = new Date(activity.date);
        if (activityDate >= today && count < 5) {
            const li = document.createElement('li');
            const formattedDate = activityDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
            li.innerHTML = `<span class="activity-date">📅 ${formattedDate}</span><br><strong>${activity.name}</strong><br><small>📍 ${activity.location}</small>`;
            list.appendChild(li);
            count++;
        }
    });
    if (count === 0) {
        list.innerHTML = '<li style="text-align:center;">No hay actividades próximas programadas.<br>¡Pronto tendremos novedades!</li>';
    }
}

// ==================== GALERÍA ====================
function loadGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    const images = [20, 26, 30, 44, 60, 80, 91, 96];
    gallery.innerHTML = '';
    images.forEach((id, index) => {
        let img = document.createElement('img');
        img.src = `https://picsum.photos/id/${id}/200/150`;
        img.alt = `Imagen de donación ${index + 1}`;
        img.onclick = () => openImageModal(img.src);
        gallery.appendChild(img);
    });
}

function openImageModal(src) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.cursor = 'pointer';
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.borderRadius = '10px';
    modal.appendChild(img);
    modal.onclick = () => modal.remove();
    document.body.appendChild(modal);
}

// ==================== FUNCIONES ADICIONALES ====================
function uploadPDFs() {
    const fileInput = document.getElementById('pdfUpload');
    if (!fileInput || !fileInput.files.length) {
        showToast('📁 Por favor seleccione al menos un archivo PDF', 'error');
        return;
    }
    const files = Array.from(fileInput.files);
    const validFiles = files.filter(f => f.type === 'application/pdf');
    if (validFiles.length === 0) {
        showToast('❌ Solo se permiten archivos en formato PDF', 'error');
        return;
    }
    validFiles.forEach(file => {
        uploadedDocuments.push({ name: file.name, size: file.size, date: new Date().toLocaleDateString() });
    });
    const uploadedDiv = document.getElementById('uploadedDocs');
    if (uploadedDiv) {
        uploadedDiv.innerHTML = `<div style="margin-top:15px; padding:10px; background:#d4edda; border-radius:8px;"><strong>✅ ${validFiles.length} documento(s) cargado(s) exitosamente</strong></div>`;
        setTimeout(() => uploadedDiv.innerHTML = '', 3000);
    }
    fileInput.value = '';
    showToast(`✅ ${validFiles.length} documento(s) cargado(s) exitosamente`, 'success');
}

function generateCertificate() {
    const nombre = document.querySelector('#donationForm input[name="nombre"]')?.value || 'Donante';
    const monto = document.querySelector('#donationForm input[name="monto"]')?.value || '0';
    showToast(`✅ Certificado de donación generado para ${nombre} por $${parseInt(monto).toLocaleString()} COP`, 'success');
}

// ==================== FORMULARIOS ====================
function initForms() {
    const affiliationForm = document.getElementById('affiliationForm');
    if (affiliationForm) {
        affiliationForm.addEventListener('submit', e => {
            e.preventDefault();
            showToast('✅ Afiliación enviada exitosamente. Pronto nos comunicaremos con usted.', 'success');
            affiliationForm.reset();
        });
    }
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            showToast('✅ Mensaje enviado. Gracias por contactarnos.', 'success');
            contactForm.reset();
        });
    }
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', e => {
            e.preventDefault();
            showToast('✅ Redirigiendo a pasarela de pago PSE...', 'info');
        });
    }
}

// ==================== INICIALIZACIÓN ====================
function init() {
    generateCalendar();
    loadUpcomingActivities();
    loadGallery();
    loadESALDocuments();
    initForms();
    startAutoSlide();
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => navigateTo(link.dataset.page));
    });
    
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage && document.getElementById(savedPage)) {
        navigateTo(savedPage);
    }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);


// 📁 js/components.js - Componentes reutilizables

// 1. Componente de Tarjeta (Card)
class FunjovirCard {
    constructor(container, options) {
        this.container = container;
        this.title = options.title;
        this.content = options.content;
        this.image = options.image;
        this.buttonText = options.buttonText;
        this.buttonAction = options.buttonAction;
        this.render();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="card funjovir-card">
                ${this.image ? `<img src="${this.image}" class="card-img">` : ''}
                <div class="card-body">
                    <h3 class="card-title">${this.title}</h3>
                    <p class="card-content">${this.content}</p>
                    ${this.buttonText ? `<button class="btn-card" onclick="${this.buttonAction}">${this.buttonText}</button>` : ''}
                </div>
            </div>
        `;
    }
}

// 2. Componente de Modal
class FunjovirModal {
    constructor(options) {
        this.title = options.title;
        this.content = options.content;
        this.onConfirm = options.onConfirm;
        this.createModal();
    }
    
    createModal() {
        const modalHTML = `
            <div class="modal-overlay" id="fModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>${this.title}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✖</button>
                    </div>
                    <div class="modal-body">${this.content}</div>
                    <div class="modal-footer">
                        <button class="btn-cancel" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                        <button class="btn-confirm" id="modalConfirm">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.getElementById('modalConfirm').onclick = () => {
            if (this.onConfirm) this.onConfirm();
            document.getElementById('fModal').remove();
        };
    }
}

// 3. Componente de Notificación Toast
class FunjovirToast {
    static show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// 4. Componente de Formulario Validado
class FunjovirForm {
    constructor(formId, validations, onSubmit) {
        this.form = document.getElementById(formId);
        this.validations = validations;
        this.onSubmit = onSubmit;
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.onSubmit(this.getFormData());
            }
        });
    }
    
    validate() {
        let isValid = true;
        for (let field in this.validations) {
            const input = this.form.querySelector(`[name="${field}"]`);
            const rule = this.validations[field];
            
            if (rule.required && !input.value.trim()) {
                this.showError(input, rule.message || 'Campo requerido');
                isValid = false;
            }
        }
        return isValid;
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData.entries());
    }
    
    showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        input.classList.add('error');
        input.parentElement.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// 5. Componente de Carga (Loading Spinner)
class FunjovirLoader {
    static show(message = 'Cargando...') {
        const loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
    }
    
    static hide() {
        const loader = document.getElementById('globalLoader');
        if (loader) loader.remove();
    }
}

// Exportar componentes para uso global
window.FunjovirCard = FunjovirCard;
window.FunjovirModal = FunjovirModal;
window.FunjovirToast = FunjovirToast;
window.FunjovirForm = FunjovirForm;
window.FunjovirLoader = FunjovirLoader;


// Implementación en la página de donaciones

// Mostrar loader mientras se procesa
FunjovirLoader.show('Procesando donación...');

// Crear modal de confirmación
new FunjovirModal({
    title: 'Confirmar Donación',
    content: '¿Estás seguro de realizar esta donación?',
    onConfirm: () => {
        FunjovirToast.show('¡Donación exitosa! Gracias por tu apoyo', 'success');
    }
});

// Formulario validado
new FunjovirForm('donationForm', {
    nombre: { required: true, message: 'Ingresa tu nombre' },
    email: { required: true, message: 'Ingresa tu email' },
    monto: { required: true, message: 'Ingresa el monto' }
}, (data) => {
    console.log('Datos del formulario:', data);
    FunjovirToast.show('Formulario enviado correctamente', 'success');
});