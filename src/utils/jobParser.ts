
export interface ParsedJobData {
  companyName: string;
  roleDescription: string;
  salary: string;
  workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND';
}

export function parseJobDescription(jobText: string): ParsedJobData {
  const text = jobText.toLowerCase();
  
  // Estrai nome azienda - cerca pattern comuni
  let companyName = 'ND';
  const companyPatterns = [
    /(?:azienda|company|presso|at)\s*:?\s*([a-zA-Z\s&.-]+)/i,
    /^([a-zA-Z\s&.-]+)\s*(?:cerca|ricerca|is looking|hiring)/i,
    /^([a-zA-Z\s&.-]+)\s*-/i
  ];
  
  for (const pattern of companyPatterns) {
    const match = jobText.match(pattern);
    if (match && match[1]) {
      companyName = match[1].trim();
      break;
    }
  }

  // Estrai descrizione ruolo - prendi le prime righe significative
  let roleDescription = 'ND';
  const lines = jobText.split('\n').filter(line => line.trim().length > 10);
  if (lines.length > 0) {
    roleDescription = lines[0].trim();
    if (roleDescription.length > 100) {
      roleDescription = roleDescription.substring(0, 97) + '...';
    }
  }

  // Estrai RAL
  let salary = 'ND';
  const salaryPatterns = [
    /(?:ral|salary|stipendio|retribuzione)[:\s]*€?\s*([\d.,k\s-]+)/i,
    /€\s*([\d.,k\s-]+)/,
    /([\d.,]+)\s*k/i,
    /(\d{2,3}\.?\d{3})\s*€/
  ];

  for (const pattern of salaryPatterns) {
    const match = jobText.match(pattern);
    if (match && match[1]) {
      salary = match[1].trim();
      break;
    }
  }

  // Determina modalità di lavoro
  let workMode: 'remoto' | 'ibrido' | 'in-presenza' | 'ND' = 'ND';
  if (text.includes('remoto') || text.includes('remote')) {
    workMode = 'remoto';
  } else if (text.includes('ibrido') || text.includes('hybrid')) {
    workMode = 'ibrido';
  } else if (text.includes('sede') || text.includes('ufficio') || text.includes('on-site')) {
    workMode = 'in-presenza';
  }

  return {
    companyName,
    roleDescription,
    salary,
    workMode
  };
}
