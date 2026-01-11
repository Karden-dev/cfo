/**
 * PAGE DÉPENSE - LOGIQUE
 */

document.addEventListener('DOMContentLoaded', () => {
    // Date du jour par défaut
    document.getElementById('date_transaction').valueAsDate = new Date();
    
    // Initialisation affichage
    updateFormDisplay();
});

/**
 * Gère l'affichage des blocs (Moto ou Dette) selon le type de dépense
 */
async function updateFormDisplay() {
    const famille = document.querySelector('input[name="famille"]:checked').value;
    
    const blockMoto = document.getElementById('block-moto');
    const blockDette = document.getElementById('block-dette');
    const detteSelect = document.getElementById('dette_id');
    const catInput = document.getElementById('categorie');

    // Reset visibilité
    blockMoto.classList.add('d-none');
    blockDette.classList.add('d-none');

    if (famille === 'CHARGES_OPS') {
        // EXPLOITATION -> On affiche les motos
        blockMoto.classList.remove('d-none');
        catInput.placeholder = "Ex: Carburant, Vidange...";
    } 
    else if (famille === 'REMBOURSEMENT') {
        // DETTE -> On affiche le sélecteur de dette
        blockDette.classList.remove('d-none');
        detteSelect.required = true; // Obligatoire de choisir une dette
        catInput.value = "Remboursement Dette";
        
        // On charge la liste des dettes depuis l'API
        await loadDettesList();
    }
    else {
        // STRUCTURE -> Rien de spécial
        catInput.placeholder = "Ex: Loyer, Salaire...";
        detteSelect.required = false;
    }
}

/**
 * Charge les dettes impayées pour le menu déroulant
 */
async function loadDettesList() {
    const select = document.getElementById('dette_id');
    // On évite de recharger si déjà plein
    if (select.options.length > 1) return; 

    try {
        const response = await fetch('/api/debts/radar');
        const result = await response.json();

        if (result.success && result.radar) {
            result.radar.forEach(dette => {
                const option = document.createElement('option');
                option.value = dette.id;
                option.textContent = `${dette.creancier} - Reste: ${dette.reste_a_payer} FCFA`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erreur chargement dettes:", error);
    }
}

/**
 * ENVOI DU FORMULAIRE
 */
document.getElementById('form-depense').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('btn-save');
    const originalText = btn.innerHTML;
    
    // Récupération des données
    const famille = document.querySelector('input[name="famille"]:checked').value;
    
    const formData = {
        famille: famille,
        montant: parseInt(document.getElementById('montant').value),
        date: document.getElementById('date_transaction').value,
        type: 'SORTIE',
        categorie: document.getElementById('categorie').value,
        description: document.getElementById('description').value,
        moyen_paiement: 'CASH', // Par défaut pour l'instant
        
        // Données conditionnelles
        moto_id: (famille === 'CHARGES_OPS') ? document.getElementById('moto_id').value : null,
        dette_id: (famille === 'REMBOURSEMENT') ? document.getElementById('dette_id').value : null
    };

    // Validation spécifique
    if (famille === 'REMBOURSEMENT' && !formData.dette_id) {
        Swal.fire('Erreur', 'Veuillez sélectionner la dette à rembourser.', 'warning');
        return;
    }

    try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Traitement...';

        const response = await fetch('/api/cash/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Dépense validée !',
                text: 'La caisse a été mise à jour.',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = '/dashboard.html';
            });
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Impossible de valider',
            text: error.message
        });
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});