// Script de test pour générer 10 leads automatiquement
import { insertLead } from './supabase-logic.js';

// Données de test aléatoires
const testData = {
    statuts: ['propriétaire', 'locataire'],
    logements: ['maison', 'appartement'],
    chauffages: ['gaz', 'électrique', 'bois', 'pompe_chaleur', 'fioul'],
    surfaces: ['moins_30', '30_60', 'plus_60'],
    codes_postaux: ['75001', '69000', '13000', '33000', '59000', '31000', '44000', '67000', '35000', '21000'],
    noms: ['Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard', 'Michel Petit', 'Isabelle Moreau', 'Philippe Simon', 'Catherine Laurent', 'Alain Lefebvre', 'Nathalie Roux'],
    emails: ['jean.dupont@gmail.com', 'marie.martin@yahoo.fr', 'pierre.durand@hotmail.com', 'sophie.bernard@orange.fr', 'michel.petit@free.fr', 'isabelle.moreau@wanadoo.fr', 'philippe.simon@sfr.fr', 'catherine.laurent@laposte.net', 'alain.lefebvre@gmail.com', 'nathalie.roux@yahoo.fr'],
    telephones: ['0123456789', '0234567890', '0345678901', '0456789012', '0567890123', '0678901234', '0789012345', '0890123456', '0901234567', '0612345678']
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateTestLead(index) {
    return {
        statut_occupant: getRandomItem(testData.statuts),
        type_logement: getRandomItem(testData.logements),
        chauffage: getRandomItem(testData.chauffages),
        surface: getRandomItem(testData.surfaces),
        code_postal: testData.codes_postaux[index],
        nom: testData.noms[index],
        email: testData.emails[index],
        tel: testData.telephones[index],
        currentStep: 8,
        leadId: null
    };
}

async function testInsert10Leads() {
    console.log('🚀 Début du test - Insertion de 10 leads...');
    
    for (let i = 0; i < 10; i++) {
        try {
            const testLead = generateTestLead(i);
            console.log(`\n📝 Lead ${i + 1}:`, testLead);
            
            const result = await insertLead(testLead);
            
            if (result.error) {
                console.error(`❌ Erreur Lead ${i + 1}:`, result.error);
            } else {
                console.log(`✅ Lead ${i + 1} inséré avec succès:`, result.data);
            }
            
            // Pause de 500ms entre chaque insertion
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error(`💥 Exception Lead ${i + 1}:`, error);
        }
    }
    
    console.log('\n🎯 Test terminé - Vérifiez votre table Supabase !');
}

// Lancer le test
testInsert10Leads();

console.log('Script de test chargé. Les leads sont en cours d\'insertion...');