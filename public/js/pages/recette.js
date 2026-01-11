/**
 * PAGE RECETTE - LOGIQUE
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mettre la date d'aujourd'hui par défaut
    document.getElementById('date_transaction').valueAsDate = new Date();
    
    // 2. Initialiser l'affichage
    updateFormDisplay();
});

/**
 * Change les textes et placeholders selon le type de recette choisi
 */
function updateFormDisplay() {
    const famille = document.querySelector('input[name="famille"]:checked').value;
    const descInput = document.getElementById('description');
    const hintDesc = document.getElementById('hint-desc');
    const catInput = document.getElementById('categorie');

    if (famille === 'EXPLOITATION') {
        // Mode Livraison
        descInput.placeholder = "Ex: Versement courses Zone Nord - Livreur Paul";
        hintDesc.textContent = "Indiquez le nom du livreur ou le client.";
        catInput.value = "Recette Livraison";
    } 
    else if (famille === 'FINANCE') {
        // Mode Emprunt
        descInput.placeholder = "Ex: Prêt personnel DG ou Emprunt Banque";
        hintDesc.textContent = "Indiquez la source exacte des fonds.";
        catInput.value = "Apport Financier";
    } 
    else {
        // Mode Régularisation
        descInput.placeholder = "Ex: Remboursement avance salaire Jean";
        hintDesc.textContent = "Qui rembourse sa dette ?";
        catInput.value = "Remboursement Dette";
    }
}

/**
 * GESTION DE LA SOUMISSION DU FORMULAIRE
 */
document.getElementById('form-recette').addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const btn = document.getElementById('btn-save');
    const originalText = btn.innerHTML;
    
    // 1. Récupération des données
    const formData = {
        famille: document.querySelector('input[name="famille"]:checked').value,
        montant: parseInt(document.getElementById('montant').value),
        date: document.getElementById('date_transaction').value,
        moyen_paiement: document.querySelector('input[name="moyen_paiement"]:checked').value,
        description: document.getElementById('description').value,
        categorie: document.getElementById('categorie').value,
        type: 'ENTREE' // C'est une recette, donc forcément une ENTRÉE
    };

    try {
        // 2. Mode Chargement
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Traitement...';

        // 3. Envoi au serveur
        const response = await fetch('/api/cash/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // 4. Succès !
            Swal.fire({
                icon: 'success',
                title: 'Recette Enregistrée !',
                text: `${formData.montant} FCFA ajoutés à la caisse.`,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = '/dashboard.html'; // Retour au tableau de bord
            });
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        // 5. Erreur
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.message || "Impossible d'enregistrer la recette."
        });
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
});