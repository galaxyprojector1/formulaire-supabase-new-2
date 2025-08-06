// Import des fonctions Supabase
import { insertLead, updateLead } from './supabase-logic.js';





// État global du formulaire
const state = {
    statut_occupant: '',
    type_logement: '',
    chauffage: '',
    surface: '',
    code_postal: '',
    nom: '',
    email: '',
    tel: '',
    currentStep: 1,
    totalSteps: 8,
    leadId: null
};

// Fonctions de validation (issues du fichier regles-validation-formulaires.md)
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
const validatePostalCode = (code) => /^[0-9]{5}$/.test(code);
const validateName = (name) => /^[a-zA-ZÀ-ÿ\s\-']+$/.test(name);
const validateStatut = (statut) => ['propriétaire', 'locataire'].includes(statut);
const validateLogement = (type) => ['maison', 'appartement'].includes(type);

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    loadSavedData();
});

function initializeForm() {
    updateProgressBar();
    setupEventListeners();
    updateBackButton();
}

function setupEventListeners() {
    // Boutons de choix pour les étapes 1-4
    setupChoiceButtons();
    
    // Champs de saisie pour les étapes 5-8
    setupInputFields();
    
    // Bouton retour
    document.getElementById('backBtn').addEventListener('click', goToPreviousStep);
}

function setupChoiceButtons() {
    // Étape 1: Statut occupant
    const statutButtons = document.querySelectorAll('[data-step="1"] .choice-btn');
    statutButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            selectChoice(this, 'statut_occupant');
            setTimeout(() => goToNextStep(), 300);
        });
    });

    // Étape 2: Type de logement
    const logementButtons = document.querySelectorAll('[data-step="2"] .choice-btn');
    logementButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            selectChoice(this, 'type_logement');
            setTimeout(() => goToNextStep(), 300);
        });
    });

    // Étape 3: Chauffage
    const chauffageButtons = document.querySelectorAll('[data-step="3"] .choice-btn');
    chauffageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            selectChoice(this, 'chauffage');
            setTimeout(() => goToNextStep(), 300);
        });
    });

    // Étape 4: Surface
    const surfaceButtons = document.querySelectorAll('[data-step="4"] .choice-btn');
    surfaceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            selectChoice(this, 'surface');
            setTimeout(() => goToNextStep(), 300);
        });
    });
}

function setupInputFields() {
    // Code postal
    const codePostalInput = document.getElementById('codePostal');
    const codePostalNext = document.getElementById('codePostalNext');
    
    codePostalInput.addEventListener('input', function() {
        validateCodePostal();
    });
    
    codePostalNext.addEventListener('click', function() {
        if (validateCodePostal()) {
            showLoadingAnimation();
        }
    });

    // Nom complet
    const nomInput = document.getElementById('nomComplet');
    const nomNext = document.getElementById('nomNext');
    
    nomInput.addEventListener('input', validateNom);
    nomNext.addEventListener('click', function() {
        if (validateNom()) {
            goToNextStep();
        }
    });

    // Email
    const emailInput = document.getElementById('email');
    const emailNext = document.getElementById('emailNext');
    
    emailInput.addEventListener('input', validateEmailField);
    emailNext.addEventListener('click', async function() {
        if (validateEmailField()) {
            await handleEmailSubmission();
        }
    });

    // Téléphone
    const telInput = document.getElementById('telephone');
    const telNext = document.getElementById('telNext');
    
    telInput.addEventListener('input', validateTelephone);
    telNext.addEventListener('click', async function() {
        if (validateTelephone()) {
            await handleFinalSubmission();
        }
    });
}

async function selectChoice(button, fieldName) {
    // Désélectionner les autres boutons du même groupe
    const siblings = button.parentElement.querySelectorAll('.choice-btn');
    siblings.forEach(btn => btn.classList.remove('selected'));
    
    // Sélectionner le bouton cliqué
    button.classList.add('selected');
    
    // Sauvegarder la valeur
    state[fieldName] = button.dataset.value;
    saveToLocalStorage();
    
    // Sauvegarde supprimée - uniquement à la fin
}

function validateCodePostal() {
    const input = document.getElementById('codePostal');
    const button = document.getElementById('codePostalNext');
    const error = document.getElementById('codePostalError');
    
    const value = input.value.trim();
    
    if (value.length === 0) {
        button.disabled = true;
        error.textContent = '';
        input.classList.remove('error');
        return false;
    }
    
    if (!validatePostalCode(value)) {
        button.disabled = true;
        error.textContent = 'Le code postal doit contenir exactement 5 chiffres';
        input.classList.add('error');
        return false;
    }
    
    button.disabled = false;
    error.textContent = '';
    input.classList.remove('error');
    state.code_postal = value;
    saveToLocalStorage();
    return true;
}

function validateNom() {
    const input = document.getElementById('nomComplet');
    const button = document.getElementById('nomNext');
    const error = document.getElementById('nomError');
    
    const value = input.value.trim();
    
    if (value.length === 0) {
        button.disabled = true;
        error.textContent = '';
        input.classList.remove('error');
        return false;
    }
    
    if (!validateName(value)) {
        button.disabled = true;
        error.textContent = 'Nom invalide (pas de chiffres ou caractères spéciaux)';
        input.classList.add('error');
        return false;
    }
    
    button.disabled = false;
    error.textContent = '';
    input.classList.remove('error');
    state.nom = value;
    saveToLocalStorage();
    return true;
}

function validateEmailField() {
    const input = document.getElementById('email');
    const button = document.getElementById('emailNext');
    const error = document.getElementById('emailError');
    
    const value = input.value.trim();
    
    if (value.length === 0) {
        button.disabled = true;
        error.textContent = '';
        input.classList.remove('error');
        return false;
    }
    
    if (!validateEmail(value)) {
        button.disabled = true;
        error.textContent = 'Format d\'email invalide';
        input.classList.add('error');
        return false;
    }
    
    button.disabled = false;
    error.textContent = '';
    input.classList.remove('error');
    state.email = value;
    saveToLocalStorage();
    return true;
}

function validateTelephone() {
    const input = document.getElementById('telephone');
    const button = document.getElementById('telNext');
    const error = document.getElementById('telError');
    
    const value = input.value.trim();
    
    if (value.length === 0) {
        button.disabled = true;
        error.textContent = '';
        input.classList.remove('error');
        return false;
    }
    
    if (!validatePhone(value)) {
        button.disabled = true;
        error.textContent = 'Le numéro doit contenir exactement 10 chiffres';
        input.classList.add('error');
        return false;
    }
    
    button.disabled = false;
    error.textContent = '';
    input.classList.remove('error');
    state.tel = value;
    saveToLocalStorage();
    return true;
}

function showLoadingAnimation() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('show');
    
    // Simuler l'analyse des aides (2 secondes)
    setTimeout(() => {
        overlay.classList.remove('show');
        goToNextStep();
    }, 2000);
}

async function handleEmailSubmission() {
    try {
        // Afficher un indicateur de chargement
        const button = document.getElementById('emailNext');
        const originalText = button.textContent;
        button.textContent = 'Enregistrement...';
        button.disabled = true;
        
        // Pas de sauvegarde à l'email - uniquement à la fin
        console.log('Email validé, passage à l\'étape suivante');
        
        // Continuer vers l'étape suivante
        goToNextStep();
        
    } catch (error) {
        console.error('Erreur lors de l\'insertion du lead:', error);
        
        // Afficher l'erreur à l'utilisateur
        const errorDiv = document.getElementById('emailError');
        errorDiv.textContent = 'Erreur lors de l\'enregistrement. Veuillez réessayer.';
        
        // Restaurer le bouton
        const button = document.getElementById('emailNext');
        button.textContent = 'Continuer';
        button.disabled = false;
    }
}

async function handleFinalSubmission() {
    try {
        // Afficher un indicateur de chargement
        const button = document.getElementById('telNext');
        const originalText = button.textContent;
        button.textContent = 'Finalisation...';
        button.disabled = true;
        
        console.log('État avant updateLead:', state);
        
        // Appeler insertLead avec toutes les données
        const result = await insertLead(state);
        
        console.log('Lead mis à jour avec succès:', result);
        
        // Aller à la page de remerciement (toujours, même en cas d'erreur)
        goToNextStep();
        
        // Nettoyer le localStorage
        localStorage.removeItem('solarFormData');
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour du lead:', error);
        
        // Afficher l'erreur à l'utilisateur
        const errorDiv = document.getElementById('telError');
        errorDiv.textContent = 'Erreur lors de la finalisation. Veuillez réessayer.';
        
        // Restaurer le bouton
        const button = document.getElementById('telNext');
        button.textContent = 'Finaliser';
        button.disabled = false;
    }
}

function goToNextStep() {
    if (state.currentStep < state.totalSteps + 1) { // +1 pour la page finale
        state.currentStep++;
        showStep(state.currentStep);
        updateProgressBar();
        updateBackButton();
        saveToLocalStorage();
    }
}

function goToPreviousStep() {
    if (state.currentStep > 1) {
        state.currentStep--;
        showStep(state.currentStep);
        updateProgressBar();
        updateBackButton();
        saveToLocalStorage();
    }
}

function showStep(stepNumber) {
    // Masquer toutes les étapes
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Afficher l'étape actuelle
    const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const currentStepSpan = document.getElementById('currentStep');
    
    const progressPercentage = (state.currentStep / state.totalSteps) * 100;
    progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
    
    currentStepSpan.textContent = Math.min(state.currentStep, state.totalSteps);
}

function updateBackButton() {
    const backBtn = document.getElementById('backBtn');
    
    if (state.currentStep > 1 && state.currentStep <= state.totalSteps) {
        backBtn.style.display = 'flex';
    } else {
        backBtn.style.display = 'none';
    }
}

function saveToLocalStorage() {
    localStorage.setItem('solarFormData', JSON.stringify(state));
}

// Fonction saveToSupabase supprimée - sauvegarde uniquement à la fin


function loadSavedData() {
    const savedData = localStorage.getItem('solarFormData');
    
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Fusionner les données sauvegardées avec l'état actuel
        Object.assign(state, parsedData);
        
        // Restaurer l'affichage
        showStep(state.currentStep);
        updateProgressBar();
        updateBackButton();
        
        // Restaurer les sélections des boutons
        restoreButtonSelections();
        
        // Restaurer les valeurs des champs de saisie
        restoreInputValues();
    }
}

function restoreButtonSelections() {
    // Restaurer statut_occupant
    if (state.statut_occupant) {
        const statutBtn = document.querySelector(`[data-step="1"] [data-value="${state.statut_occupant}"]`);
        if (statutBtn) statutBtn.classList.add('selected');
    }
    
    // Restaurer type_logement
    if (state.type_logement) {
        const logementBtn = document.querySelector(`[data-step="2"] [data-value="${state.type_logement}"]`);
        if (logementBtn) logementBtn.classList.add('selected');
    }
    
    // Restaurer chauffage
    if (state.chauffage) {
        const chauffageBtn = document.querySelector(`[data-step="3"] [data-value="${state.chauffage}"]`);
        if (chauffageBtn) chauffageBtn.classList.add('selected');
    }
    
    // Restaurer surface
    if (state.surface) {
        const surfaceBtn = document.querySelector(`[data-step="4"] [data-value="${state.surface}"]`);
        if (surfaceBtn) surfaceBtn.classList.add('selected');
    }
}

function restoreInputValues() {
    // Restaurer code postal
    if (state.code_postal) {
        const codePostalInput = document.getElementById('codePostal');
        if (codePostalInput) {
            codePostalInput.value = state.code_postal;
            validateCodePostal();
        }
    }
    
    // Restaurer nom
    if (state.nom) {
        const nomInput = document.getElementById('nomComplet');
        if (nomInput) {
            nomInput.value = state.nom;
            validateNom();
        }
    }
    
    // Restaurer email
    if (state.email) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = state.email;
            validateEmailField();
        }
    }
    
    // Restaurer téléphone
    if (state.tel) {
        const telInput = document.getElementById('telephone');
        if (telInput) {
            telInput.value = state.tel;
            validateTelephone();
        }
    }
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    // Ajuster la hauteur si nécessaire
    updateViewportHeight();
});

function updateViewportHeight() {
    // Correction pour les navigateurs mobiles qui changent la hauteur de viewport
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialiser la hauteur de viewport
updateViewportHeight();

// Prévenir la soumission accidentelle du formulaire
document.getElementById('solarForm').addEventListener('submit', function(e) {
    e.preventDefault();
});

// Gestion des touches clavier
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        // Empêcher la soumission par défaut
        e.preventDefault();
        
        // Simuler un clic sur le bouton "suivant" actif
        const activeStep = document.querySelector('.step.active');
        if (activeStep) {
            const nextBtn = activeStep.querySelector('.next-btn:not(:disabled)');
            if (nextBtn) {
                nextBtn.click();
            }
        }
    }
});

console.log('Formulaire solaire initialisé - Version mobile optimisée');