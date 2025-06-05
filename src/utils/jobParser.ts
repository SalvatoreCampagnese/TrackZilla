
export interface ParsedJobData {
  companyName: string;
  roleDescription: string;
  salary: string;
  workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
}

// Lista di parole comuni da rimuovere dal nome dell'azienda
const COMPANY_NOISE_WORDS = [
  'srl', 's.r.l.', 'spa', 's.p.a.', 'ltd', 'llc', 'inc', 'corp', 'corporation',
  'company', 'azienda', 'società', 'group', 'gruppo', 'team', 'tech', 'technology',
  'solutions', 'services', 'consulting', 'digital', 'innovation', 'labs', 'studio'
];

// Parole che indicano che non è un nome di azienda
const INVALID_COMPANY_INDICATORS = [
  'posizione', 'lavoro', 'opportunità', 'ricerca', 'offerta', 'candidatura',
  'position', 'job', 'opportunity', 'search', 'offer', 'application',
  'developer', 'engineer', 'manager', 'senior', 'junior', 'lead', 'head'
];

function cleanCompanyName(name: string): string {
  if (!name) return '';
  
  // Rimuovi caratteri speciali all'inizio e alla fine
  let cleaned = name.trim().replace(/^[^\w]+|[^\w]+$/g, '');
  
  // Rimuovi virgolette e parentesi
  cleaned = cleaned.replace(/["'()[\]{}]/g, '');
  
  // Capitalizza correttamente
  cleaned = cleaned.split(' ')
    .map(word => {
      const lower = word.toLowerCase();
      // Non capitalizzare parole comuni come "di", "e", "per"
      if (['di', 'e', 'per', 'del', 'della', 'dei', 'delle', 'and', 'of', 'for', 'the'].includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  
  // Rimuovi parole di rumore alla fine
  const words = cleaned.split(' ');
  const filteredWords = words.filter(word => {
    const lower = word.toLowerCase();
    return !COMPANY_NOISE_WORDS.includes(lower);
  });
  
  return filteredWords.join(' ').trim();
}

function isValidCompanyName(name: string): boolean {
  if (!name || name.length < 2) return false;
  
  const lower = name.toLowerCase();
  
  // Controlla se contiene indicatori che non è un nome di azienda
  for (const indicator of INVALID_COMPANY_INDICATORS) {
    if (lower.includes(indicator)) return false;
  }
  
  // Deve contenere almeno una lettera
  if (!/[a-zA-Z]/.test(name)) return false;
  
  // Non deve essere troppo lungo (probabilmente è una descrizione)
  if (name.length > 50) return false;
  
  return true;
}

export function parseJobDescription(jobText: string): ParsedJobData {
  const text = jobText.toLowerCase();
  const originalText = jobText;
  
  // Pattern migliorati per l'estrazione del nome dell'azienda
  let companyName = 'ND';
  const companyPatterns = [
    // Pattern specifici per piattaforme di lavoro italiane
    /(?:azienda|company|cliente)[\s:]*([A-Za-z][A-Za-z\s&.\-']{2,40})/i,
    /^([A-Za-z][A-Za-z\s&.\-']{2,40})\s*(?:cerca|ricerca|seleziona|assume|is\s+looking|hiring|recruits)/i,
    /(?:presso|at|per|for)\s+([A-Za-z][A-Za-z\s&.\-']{2,40})/i,
    /([A-Za-z][A-Za-z\s&.\-']{2,40})\s*(?:-|–|—)\s*(?:job|lavoro|posizione|opportunità)/i,
    /(?:join|unisciti\s+a|lavora\s+in|lavora\s+per)\s+([A-Za-z][A-Za-z\s&.\-']{2,40})/i,
    // Pattern per email aziendali
    /@([a-zA-Z][a-zA-Z0-9\-\.]{1,30})\./,
    // Pattern per prime righe che iniziano con nome azienda
    /^([A-Z][A-Za-z\s&.\-']{2,40})(?:\s*[-–—]\s*|\s+\w)/,
    // Pattern per siti web
    /(?:www\.)?([a-zA-Z][a-zA-Z0-9\-]{1,30})\.(?:com|it|org|net)/i,
    // Pattern per "Lavora con noi" o simili
    /(?:team|gruppo|staff)\s+([A-Za-z][A-Za-z\s&.\-']{2,40})/i
  ];
  
  const candidateNames: string[] = [];
  
  for (const pattern of companyPatterns) {
    const matches = originalText.match(pattern);
    if (matches && matches[1]) {
      const candidate = cleanCompanyName(matches[1]);
      if (isValidCompanyName(candidate)) {
        candidateNames.push(candidate);
      }
    }
  }
  
  // Prova anche a estrarre dalle prime righe del testo
  const lines = originalText.split('\n').filter(line => line.trim().length > 5);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Se la prima riga sembra un nome di azienda
    if (firstLine.length < 50 && isValidCompanyName(firstLine)) {
      const cleaned = cleanCompanyName(firstLine);
      if (cleaned) candidateNames.push(cleaned);
    }
  }
  
  // Scegli il candidato migliore
  if (candidateNames.length > 0) {
    // Preferisci nomi più corti e senza caratteri speciali
    companyName = candidateNames
      .sort((a, b) => {
        const scoreA = a.length + (a.includes('-') ? 5 : 0) + (a.includes('.') ? 3 : 0);
        const scoreB = b.length + (b.includes('-') ? 5 : 0) + (b.includes('.') ? 3 : 0);
        return scoreA - scoreB;
      })[0];
  }

  // Estrai descrizione ruolo - prendi le prime righe significative
  let roleDescription = 'ND';
  const meaningfulLines = originalText.split('\n').filter(line => line.trim().length > 20);
  if (meaningfulLines.length > 0) {
    // Cerca una riga che sembra una descrizione di ruolo
    for (const line of meaningfulLines.slice(0, 5)) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('sviluppatore') || 
          trimmed.toLowerCase().includes('developer') ||
          trimmed.toLowerCase().includes('engineer') ||
          trimmed.toLowerCase().includes('programmer') ||
          trimmed.toLowerCase().includes('analista') ||
          trimmed.toLowerCase().includes('manager')) {
        roleDescription = trimmed;
        break;
      }
    }
    
    // Se non trovato, usa la prima riga significativa
    if (roleDescription === 'ND') {
      roleDescription = meaningfulLines[0].trim();
    }
    
    if (roleDescription.length > 100) {
      roleDescription = roleDescription.substring(0, 97) + '...';
    }
  }

  // Estrai RAL con pattern migliorati
  let salary = 'ND';
  const salaryPatterns = [
    /(?:ral|salary|stipendio|retribuzione|compenso)[\s:]*€?\s*([\d.,k\s-]+)/i,
    /€\s*([\d.,k\s-]+)/,
    /([\d.,]+)\s*k(?:\s*€|\s*euro|\s*eur)?/i,
    /(\d{2,3}\.?\d{3})\s*€/,
    /(?:da|from)\s*(\d+\.?\d*k?)\s*(?:a|to)\s*(\d+\.?\d*k?)/i,
    /(\d+\.?\d*k?)\s*-\s*(\d+\.?\d*k?)\s*(?:€|euro|eur)/i
  ];

  for (const pattern of salaryPatterns) {
    const match = originalText.match(pattern);
    if (match) {
      if (match[2]) {
        // Range di stipendio
        salary = `${match[1]}-${match[2]}`;
      } else if (match[1]) {
        salary = match[1].trim();
      }
      break;
    }
  }

  // Determina modalità di lavoro con pattern migliorati
  let workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND' = 'ND';
  
  if (text.includes('remoto') || text.includes('remote') || text.includes('smart working') || text.includes('da casa')) {
    workMode = 'remoto';
  } else if (text.includes('ibrido') || text.includes('hybrid') || text.includes('misto')) {
    workMode = 'ibrido';
  } else if (text.includes('sede') || text.includes('ufficio') || text.includes('on-site') || text.includes('presenza')) {
    workMode = 'in-presenza';
  }

  return {
    companyName,
    roleDescription,
    salary,
    workMode
  };
}
