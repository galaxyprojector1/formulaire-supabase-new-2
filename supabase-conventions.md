# Convention de nommage Cursor → Supabase

## Table `leads` - Mapping des champs (structure réelle)

| Intitulé de la question             | Nom du champ Cursor (`state.`) | Colonne Supabase      | Type attendu |
|-------------------------------------|-------------------------------|----------------------|--------------|
| Êtes-vous propriétaire ou locataire ? | `statut_occupant`             | statut_occupant      | "propriétaire" ou "locataire" |
| Maison ou appartement ?             | `type_logement`               | type_logement        | "maison" ou "appartement"    |
| Code postal                         | `code_postal`                 | code_postal          | string, 5 chiffres           |
| Adresse email                       | `email`                       | email                | string                       |
| Numéro de téléphone                 | `tel`                         | tel                  | string                       |
| Nom                                 | `nom`                         | nom                  | string                       |
| ...                                 | ...                           | ...                  | ...                          |

## Champs secondaires (stockés dans `données_brutes` JSONB)
- surface
- chauffage
- toiture
- orientation
- prenom

## Règles importantes
- N’envoyer que les colonnes existantes dans la table.
- Les champs secondaires sont à mettre dans `données_brutes` (JSONB).
- Ne pas forcer la colonne `qualifiable` à l’insertion (laisser la valeur par défaut).
- Les champs automatiques (`id`, `date_collecte`, etc.) sont gérés par Supabase.

## Exemple d’insertion SQL
```sql
INSERT INTO leads (
  email, code_postal, statut_occupant, type_logement, nom, tel, activité, formulaire_id, données_brutes, progression
) VALUES (
  'test@example.com', '75001', 'propriétaire', 'maison', 'Jean Dupont', '0612345678', 'solaire', 'form_solaire_01', '{"chauffage":"gaz","surface":"30_60"}', 8
);
```

## Validation front-end à respecter
- Email : format valide
- Téléphone : 10 chiffres
- Code postal : 5 chiffres
- Nom/prénom : lettres uniquement

---
*Fichier de configuration réutilisable - À copier dans chaque nouveau projet Supabase*