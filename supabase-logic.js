const { createClient } = supabase;

export const supabaseClient = createClient(
  'https://mmdbevzsaqbkkdgcjaql.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZGJldnpzYXFia2tkZ2NqYXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODc3MzEsImV4cCI6MjA2OTk2MzczMX0.YGUzhpcKixZWsRAswFQtCCnRdSOSlDOXb7UENNnem9M'
)

export const insertLead = async (state) => {
  return await supabaseClient.from('leads').insert([{
    email: state.email || '',
    code_postal: state.code_postal || '',
    statut_occupant: state.statut_occupant || '',
    type_logement: state.type_logement || '',
    nom: state.nom || '',
    tel: state.tel || '',
    activité: 'solaire',
    formulaire_id: 'form_solaire_01',
    données_brutes: {
      chauffage: state.chauffage || '',
      surface: state.surface || '',
      etape_actuelle: state.currentStep || 1
    },
    progression: state.currentStep || 1
  }])
}

export const updateLead = async (state) => {
  return await supabaseClient.from('leads')
    .update({
      email: state.email || '',
      code_postal: state.code_postal || '',
      statut_occupant: state.statut_occupant || '',
      type_logement: state.type_logement || '',
      nom: state.nom || '',
      tel: state.tel || '',
      données_brutes: {
        chauffage: state.chauffage || '',
        surface: state.surface || '',
        etape_actuelle: state.currentStep || 1
      },
      progression: state.currentStep || 1,

    })
    .eq('id', state.leadId)
}