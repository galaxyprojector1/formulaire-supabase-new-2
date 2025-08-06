# 📘 Répertoire des règles de validation — Formulaires Cursor

## ✅ Règles générales

- **Une étape = Un champ** : Chaque étape du formulaire ne doit contenir qu'un seul champ à remplir
- **Reprise possible** : Le formulaire doit pouvoir être repris à tout moment, même s'il n'est pas terminé
- **Enregistrement dès l'email** : L'enregistrement dans Supabase commence à partir du moment où l'email est renseigné

## 🧾 Données obligatoires

### 📧 Email
- ✅ Doit être au format valide (exemple : `nom@exemple.com`)
- ❌ Aucun espace autorisé
- 🔍 Regex validation : `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### 📱 Numéro de téléphone
- ✅ Doit contenir exactement 10 chiffres
- ❌ Ne doit pas contenir d'espaces, ni de caractères spéciaux
- 🔍 Regex validation : `/^[0-9]{10}$/`

### 📮 Code postal
- ✅ Doit contenir exactement 5 chiffres
- ❌ Toujours en format numérique, sans lettres ni espaces
- 🔍 Regex validation : `/^[0-9]{5}$/`

### 🏠 Statut occupant
- ✅ Valeurs autorisées : `"propriétaire"` ou `"locataire"`
- ⚠️ Champ obligatoire, doit être rempli dès le début
- 🎯 Sert à filtrer les leads valides

### 🏢 Type de logement
- ✅ Valeurs autorisées : `"maison"` ou `"appartement"`
- ⚠️ Champ obligatoire, utilisé pour filtrer les leads également

## ✏️ Données secondaires (facultatives mais enregistrées)

### 👤 Nom et prénom
- ✅ Acceptent les lettres, espaces, traits d'union
- ❌ Pas de caractères spéciaux (pas de chiffres, @, #, etc.)
- 🔍 Regex validation : `/^[a-zA-ZÀ-ÿ\s\-']+$/`

### 🔧 Données techniques
- **Toiture** : Texte libre ou menu déroulant
- **Chauffage** : Texte libre ou menu déroulant  
- **Orientation** : Texte libre ou menu déroulant
- **Surface** : Nombre ou texte libre

## 🛠️ Fonctions de validation JavaScript

```javascript
// Validation email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Validation téléphone (10 chiffres)
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone)

// Validation code postal (5 chiffres)
const validatePostalCode = (code) => /^[0-9]{5}$/.test(code)

// Validation nom/prénom
const validateName = (name) => /^[a-zA-ZÀ-ÿ\s\-']+$/.test(name)

// Validation statut occupant
const validateStatut = (statut) => ['propriétaire', 'locataire'].includes(statut)

// Validation type logement
const validateLogement = (type) => ['maison', 'appartement'].includes(type)
```

## 🚦 États de validation

- ✅ **Valide** : Données conformes aux règles
- ⚠️ **Attention** : Données manquantes mais non bloquantes
- ❌ **Erreur** : Données invalides, blocage de la progression

---
*Fichier de règles réutilisable - À copier dans chaque projet Cursor avec formulaires*