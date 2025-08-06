// 🎯 PREUVE DE CRÉATION - SCRIPT1.JS !
// Ce fichier prouve que je peux créer des fichiers
// Créé par l'assistant pour démontrer les capacités

console.log('🚀 SCRIPT1.JS CRÉÉ - PREUVE QUE JE PEUX CRÉER DES FICHIERS !');

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

// Fonctions de validation
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
const validatePostalCode = (code) => /^[0-9]{5}$/.test(code);
const validateName = (name) => /^[a-zA-ZÀ-ÿ\s\-']+$/.test(name);

// Message de confirmation
console.log('✅ Fichier script1.js créé avec succès par l\'assistant !');
console.log('🎯 Maintenant tu peux le voir dans ton dossier local !');

// Export pour prouver que c'est un vrai fichier JS
export { state, validateEmail, validatePhone, validatePostalCode, validateName };