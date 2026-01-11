/**
 * DASHBOARD CONTROLLER
 * Gère l'affichage des KPI et des graphiques
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Dashboard initializing...");
    
    // 1. Initialiser la date du jour
    initDate();

    // 2. Charger les données (Cash, Dettes, Flotte)
    loadCashData();
    loadDebtRadar();
    // loadFleetData(); // On l'activera quand on aura fait le contrôleur Moto
});

/**
 * Affiche la date actuelle (Ex: "Lundi 12 Janvier 2026")
 */
function initDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('fr-FR', options);
    // Met la première lettre en majuscule
    document.getElementById('current-date').textContent = today.charAt(0).toUpperCase() + today.slice(1);
}

/**
 * CHARGE LES DONNÉES DE TRÉSORERIE (API)
 */
async function loadCashData() {
    try {
        const response = await fetch('/api/cash/status');
        const result = await response.json();

        if (result.success) {
            // Mise à jour du KPI Solde
            const solde = result.solde || 0;
            const kpiCash = document.getElementById('kpi-cash');
            
            kpiCash.textContent = formatMoney(solde);
            
            // Couleur dynamique (Rouge si négatif, Vert si positif)
            if (solde < 0) {
                kpiCash.classList.remove('text-success');
                kpiCash.classList.add('text-danger');
            }

            // Calcul rapide des entrées du jour (Basé sur l'historique reçu)
            // Note: Pour une vraie précision, on ferait ce calcul côté serveur
            const todayStr = new Date().toISOString().split('T')[0];
            const entreesAuj = result.historique.filter(t => 
                t.type === 'ENTREE' && t.createdAt.startsWith(todayStr)
            ).length;
            
            document.getElementById('kpi-cash-flow').textContent = `+${entreesAuj}`;
        }
    } catch (error) {
        console.error("Erreur chargement Cash:", error);
        document.getElementById('kpi-cash').textContent = "Erreur";
    }
}

/**
 * CHARGE LE RADAR DES DETTES (API)
 */
async function loadDebtRadar() {
    try {
        const response = await fetch('/api/debts/radar');
        const result = await response.json();

        if (result.success) {
            // 1. KPI Total Dettes
            document.getElementById('kpi-debt').textContent = formatMoney(result.total_dettes);

            // 2. Remplir le Tableau Radar
            const tbody = document.getElementById('debt-radar-body');
            tbody.innerHTML = ''; // On vide le "Chargement..."

            if (result.radar.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center py-3 text-muted">Aucune dette urgente. Tout va bien ! 😎</td></tr>`;
                document.getElementById('kpi-debt-alert').innerHTML = `<i class="fas fa-check-circle text-success"></i> Aucune urgence`;
                document.getElementById('kpi-debt-alert').classList.replace('text-danger', 'text-success');
                return;
            }

            // On boucle sur chaque dette reçue
            result.radar.forEach(dette => {
                const row = document.createElement('tr');
                
                // Gestion de l'affichage de l'urgence
                let badgeClass = 'bg-soft-success';
                let textUrgence = 'Normal';
                
                if (dette.niveau_alerte === 'RETARD_CRITIQUE') {
                    badgeClass = 'bg-soft-danger';
                    textUrgence = 'EN RETARD !';
                } else if (dette.niveau_alerte === 'URGENT') {
                    badgeClass = 'bg-soft-warning';
                    textUrgence = 'Urgent';
                }

                row.innerHTML = `
                    <td>
                        <div class="fw-bold">${formatDate(dette.date_echeance)}</div>
                        <span class="badge ${badgeClass} small">${textUrgence}</span>
                    </td>
                    <td class="fw-bold text-dark">${dette.creancier}</td>
                    <td class="text-danger fw-bold">${formatMoney(dette.reste_a_payer)}</td>
                    <td>
                        ${getPriorityStars(dette.priorite)}
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="payerDette(${dette.id})">
                            Payer
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Mise à jour de l'alerte textuelle sous le chiffre
            const nbUrgences = result.radar.filter(d => d.niveau_alerte !== 'NORMAL').length;
            if (nbUrgences > 0) {
                document.getElementById('kpi-debt-alert').innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${nbUrgences} paiements critiques !`;
            } else {
                document.getElementById('kpi-debt-alert').innerHTML = `<i class="fas fa-info-circle"></i> Échéances sous contrôle`;
                document.getElementById('kpi-debt-alert').classList.replace('text-danger', 'text-muted');
            }
        }
    } catch (error) {
        console.error("Erreur chargement Dettes:", error);
    }
}

// ==========================================
// UTILITAIRES (Formatage)
// ==========================================

/**
 * Formate un nombre en FCFA (Ex: 10000 -> "10 000 FCFA")
 */
function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

/**
 * Formate une date YYYY-MM-DD en DD/MM/YYYY
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

/**
 * Génère les étoiles HTML selon la priorité (1 = 3 étoiles rouges)
 */
function getPriorityStars(priorite) {
    if (priorite === 1) return '<i class="fas fa-star text-danger"></i><i class="fas fa-star text-danger"></i><i class="fas fa-star text-danger"></i>';
    if (priorite === 2) return '<i class="fas fa-star text-warning"></i><i class="fas fa-star text-warning"></i>';
    return '<i class="fas fa-star text-muted"></i>';
}

/**
 * Action fictive pour le bouton "Payer"
 */
function payerDette(id) {
    alert(`Fonctionnalité de paiement rapide pour la dette #${id} à venir !`);
    // Ici, on redirigera vers la page de paiement avec l'ID pré-rempli
    // window.location.href = `/depense.html?dette_id=${id}`;
}