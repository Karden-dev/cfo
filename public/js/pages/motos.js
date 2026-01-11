document.addEventListener('DOMContentLoaded', () => {
    loadMotos();
    
    // Configurer la date par défaut dans le modal
    document.querySelector('input[name="date_achat"]').valueAsDate = new Date();
});

/**
 * CHARGER ET AFFICHER LES MOTOS
 */
async function loadMotos() {
    const container = document.getElementById('motos-container');
    
    try {
        const response = await fetch('/api/motos');
        const result = await response.json();

        if (result.success) {
            container.innerHTML = '';
            
            if (result.data.length === 0) {
                container.innerHTML = `<div class="col-12 text-center text-muted">Aucune moto enregistrée. Ajoutez-en une !</div>`;
                return;
            }

            result.data.forEach(moto => {
                const card = createMotoCard(moto);
                container.innerHTML += card;
            });
        }
    } catch (error) {
        console.error("Erreur:", error);
        container.innerHTML = `<div class="alert alert-danger">Impossible de charger la flotte.</div>`;
    }
}

/**
 * CRÉATION HTML D'UNE CARTE MOTO
 */
function createMotoCard(moto) {
    // Gestion des couleurs selon l'état
    let statusBadge = '';
    let borderClass = 'border-success';
    
    if (moto.etat === 'ACTIVE') {
        statusBadge = '<span class="badge bg-success">En Service</span>';
    } else if (moto.etat === 'PANNE' || moto.etat === 'GARAGE') {
        statusBadge = '<span class="badge bg-danger">Au Garage</span>';
        borderClass = 'border-danger';
    } else {
        statusBadge = `<span class="badge bg-secondary">${moto.etat}</span>`;
        borderClass = 'border-secondary';
    }

    // Alerte Vidange
    let vidangeAlert = '';
    if (moto.alerte_vidange) {
        vidangeAlert = `<div class="alert alert-warning py-1 px-2 small mb-2"><i class="fas fa-oil-can me-1"></i> Vidange requise !</div>`;
    }

    return `
    <div class="col-md-4 col-xl-3">
        <div class="card h-100 shadow-sm border-top border-4 ${borderClass}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="fw-bold text-dark mb-0">${moto.matricule}</h5>
                    ${statusBadge}
                </div>
                <div class="text-muted small mb-3">${moto.modele}</div>

                ${vidangeAlert}

                <div class="row g-0 text-center mb-3 bg-light rounded py-2">
                    <div class="col-6 border-end">
                        <div class="small text-muted text-uppercase">Recettes</div>
                        <div class="fw-bold text-success">${formatMoney(moto.recette_totale)}</div>
                    </div>
                    <div class="col-6">
                        <div class="small text-muted text-uppercase">Dépenses</div>
                        <div class="fw-bold text-danger">${formatMoney(moto.cout_entretien_total)}</div>
                    </div>
                </div>

                <div class="d-flex justify-content-between text-muted small mt-2">
                    <span><i class="fas fa-road me-1"></i> ${moto.km_actuel} km</span>
                    <button class="btn btn-sm btn-outline-secondary py-0" onclick="alert('Détails moto bientôt disponible')">Gérer</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

/**
 * AJOUTER UNE MOTO (Formulaire)
 */
document.getElementById('form-add-moto').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/motos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Fermer le modal
            const modalEl = document.getElementById('addMotoModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            
            // Recharger la liste
            loadMotos();
            e.target.reset();
            
            Swal.fire('Succès', 'Moto ajoutée à la flotte !', 'success');
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.fire('Erreur', error.message, 'error');
    }
});

function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount); // Pas de "FCFA" pour gagner de la place
}