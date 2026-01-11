/**
 * UI MANAGER - WINK CFO
 * Gère l'injection de la Sidebar, Topbar et les animations
 */

document.addEventListener("DOMContentLoaded", async () => {
    
    // 1. INJECTION DE LA SIDEBAR (Menu Gauche)
    await loadComponent("#sidebar-container", "/components/sidebar.html");

    // 2. INJECTION DE LA TOPBAR (Barre du haut)
    await loadComponent("#topbar-container", "/components/topbar.html");

    // 3. ACTIVATION DES LIENS (Mettre en bleu la page actuelle)
    highlightCurrentPage();

    // 4. INITIALISATION BOOTSTRAP (Tooltips, Dropdowns)
    initBootstrapComponents();

    console.log("✅ UI Loaded & Ready");
});

/**
 * Charge un fichier HTML externe dans une div
 */
async function loadComponent(selector, filePath) {
    const container = document.querySelector(selector);
    if (!container) return; // Si la div n'existe pas, on arrête

    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            container.innerHTML = html;
        } else {
            console.error(`Erreur chargement ${filePath}: ${response.status}`);
        }
    } catch (error) {
        console.error(`Erreur réseau pour ${filePath}:`, error);
    }
}

/**
 * Trouve le lien du menu qui correspond à la page actuelle et l'active
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname; // Ex: /dashboard.html
    const menuLinks = document.querySelectorAll('.nav-link');

    menuLinks.forEach(link => {
        // Si le lien correspond à l'URL actuelle
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active'); // On ajoute la classe CSS "active"
            
            // Si c'est dans un sous-menu, on l'ouvre aussi
            const parentCollapse = link.closest('.collapse');
            if (parentCollapse) {
                parentCollapse.classList.add('show');
            }
        }
    });
}

/**
 * Active les composants interactifs de Bootstrap
 */
function initBootstrapComponents() {
    // Active les infobulles (Tooltips)
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

// Fonction globale pour le Toggle du Menu (Petit écran)
window.toggleMenu = function() {
    document.body.classList.toggle('sb-sidenav-toggled');
}