export interface Translations {
  // Language
  language: string;
  changeLanguage: string;
  spanish: string;
  english: string;
  
  // Navigation
  dashboard: string;
  analytics: string;
  history: string;
  logout: string;
  
  // Landing Page
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  getStarted: string;
  login: string;
  
  // Features
  features: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  
  // Dashboard
  analyzeVideo: string;
  videoUrl: string;
  videoUrlPlaceholder: string;
  platform: string;
  selectPlatform: string;
  brandInfo: string;
  brandInfoPlaceholder: string;
  tone: string;
  selectTone: string;
  analyze: string;
  analyzing: string;
  
  // Analysis Results
  analysisResults: string;
  transcription: string;
  hook: string;
  hookType: string;
  effectiveness: string;
  viralElements: string;
  storytelling: string;
  beginning: string;
  middle: string;
  end: string;
  cta: string;
  emotionalTone: string;
  keyPhrases: string;
  viralMechanics: string;
  viralPotential: string;
  avgViewTime: string;
  estimatedCTR: string;
  seconds: string;
  extracted: string;
  
  // Script Generation
  generateScript: string;
  scriptTitle: string;
  businessType: string;
  contentType: string;
  framework: string;
  platforms: string;
  videoDuration: string;
  targetAudience: string;
  keyMessage: string;
  
  // Analytics
  analyticsTitle: string;
  analyticsSubtitle: string;
  totalAnalysis: string;
  averageScore: string;
  exports: string;
  shares: string;
  trends: string;
  performanceTrends: string;
  platformDistribution: string;
  frameworkUsage: string;
  behaviorPatterns: string;
  preferences: string;
  
  // Export
  exportOptions: string;
  downloadPDF: string;
  openGoogleDocs: string;
  copyToClipboard: string;
  shareLink: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  confirm: string;
  close: string;
  next: string;
  previous: string;
  
  // Performance
  excellent: string;
  good: string;
  average: string;
  needsImprovement: string;
  
  // Buttons & Actions
  newAnalysis: string;
  generateNewScript: string;
  copyAnalysis: string;
  copyScript: string;
  saveToHistory: string;
  downloadReport: string;
  shareResults: string;
  
  // Messages
  analysisComplete: string;
  scriptGenerated: string;
  errorAnalyzing: string;
  errorGenerating: string;
  copiedToClipboard: string;
  savedSuccessfully: string;
  
  // History
  scriptHistory: string;
  noScriptsYet: string;
  createFirstScript: string;
  deleteConfirm: string;
  
  // Forms
  required: string;
  optional: string;
  pleaseWait: string;
  processing: string;
  
  // Footer
  footer: string;
  allRightsReserved: string;
  privacyPolicy: string;
  termsOfService: string;
  
  // CTA Section
  ctaTitle: string;
  ctaDescription: string;
  
  // Script History
  historyTitle: string;
  noScripts: string;
  viewScript: string;
  downloadScript: string;
  
  // Forms
  required: string;
  optional: string;
  submit: string;
  
  // Performance Mascot
  performanceScore: string;
  mascotTip: string;
  
  // Additional Dashboard Elements
  noData: string;
  lastDays: string;
  averagePerformance: string;
  totalExports: string;
  totalShares: string;
  
  // Form Validation
  invalidUrl: string;
  urlRequired: string;
  analyzeNow: string;
  
  // Additional UI Elements
  learnMore: string;
  viewMore: string;
  showLess: string;
}

export const translations: Record<string, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    analytics: "Analytics",
    history: "History",
    logout: "Logout",
    
    // Landing Page
    heroTitle: "Transform Viral Videos into Marketing Gold",
    heroSubtitle: "AI-Powered Video Analysis & Script Generation",
    heroDescription: "Analyze viral content from TikTok, Instagram Reels, and YouTube Shorts. Generate high-converting marketing scripts using advanced psychological frameworks.",
    getStarted: "Get Started",
    login: "Login",
    
    // Features
    features: "Features",
    feature1Title: "AI Video Analysis",
    feature1Description: "Deep analysis of viral video content with transcription and psychological insights",
    feature2Title: "Smart Script Generation",
    feature2Description: "Create high-converting marketing scripts using proven frameworks",
    feature3Title: "Performance Analytics",
    feature3Description: "Track your content performance and optimization opportunities",
    
    // Dashboard
    analyzeVideo: "Analyze Video",
    videoUrl: "Video URL",
    videoUrlPlaceholder: "Enter TikTok, Instagram Reel, or YouTube Shorts URL",
    platform: "Platform",
    selectPlatform: "Select platform",
    brandInfo: "Brand Information",
    brandInfoPlaceholder: "Tell us about your brand, product, or service",
    tone: "Tone",
    selectTone: "Select tone",
    analyze: "Analyze",
    
    // Analysis Results
    analysisResults: "Analysis Results",
    transcription: "Transcription",
    hook: "Hook",
    hookType: "Hook Type",
    effectiveness: "Effectiveness",
    viralElements: "Viral Elements",
    storytelling: "Storytelling Structure",
    beginning: "Beginning",
    middle: "Middle",
    end: "End",
    cta: "Call to Action",
    emotionalTone: "Emotional Tone",
    keyPhrases: "Key Phrases",
    viralMechanics: "Viral Mechanics",
    
    // Script Generation
    generateScript: "Generate Script",
    scriptTitle: "Script Title",
    businessType: "Business Type",
    contentType: "Content Type",
    framework: "Framework",
    platforms: "Platforms",
    videoDuration: "Video Duration",
    targetAudience: "Target Audience",
    keyMessage: "Key Message",
    
    // Analytics
    analyticsTitle: "Analytics Dashboard",
    analyticsSubtitle: "Advanced insights about your viral content performance",
    totalAnalysis: "Total Analysis",
    averageScore: "Average Score",
    exports: "Exports",
    shares: "Shares",
    trends: "Trends",
    performanceTrends: "Performance Trends",
    platformDistribution: "Platform Distribution",
    frameworkUsage: "Neurological Framework Usage",
    behaviorPatterns: "Usage Patterns",
    preferences: "Preferences",
    
    // Export
    exportOptions: "Export Options",
    downloadPDF: "Download PDF",
    openGoogleDocs: "Open in Google Docs",
    copyToClipboard: "Copy to Clipboard",
    shareLink: "Generate Share Link",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    close: "Close",
    next: "Next",
    previous: "Previous",
    
    // Performance
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    needsImprovement: "Needs Improvement",
    
    // Language
    language: "Language",
    english: "English",
    spanish: "Spanish",
    
    // Footer & Additional
    footer: "Footer",
    allRightsReserved: "All rights reserved",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    
    // CTA Section
    ctaTitle: "Ready to Transform Your Content?",
    ctaDescription: "Start analyzing viral videos and creating high-converting scripts today",
    
    // Script History
    historyTitle: "Script History",
    noScripts: "No scripts generated yet",
    viewScript: "View Script",
    downloadScript: "Download Script",
    
    // Forms
    required: "Required",
    optional: "Optional",
    submit: "Submit",
    
    // Performance Mascot
    performanceScore: "Performance Score",
    mascotTip: "Tip",
    
    // Additional Dashboard Elements
    noData: "No data available",
    lastDays: "Last {days} days",
    averagePerformance: "Average Performance",
    totalExports: "Total Exports",
    totalShares: "Total Shares",
    
    // Form Validation
    invalidUrl: "Please enter a valid URL",
    urlRequired: "Video URL is required",
    analyzeNow: "Analyze Now",
    
    // Additional UI Elements
    learnMore: "Learn More",
    viewMore: "View More",
    showLess: "Show Less",
  },
  
  es: {
    // Navigation
    dashboard: "Panel",
    analytics: "Analíticas",
    history: "Historial",
    logout: "Cerrar Sesión",
    
    // Landing Page
    heroTitle: "Transform Viral Videos into Marketing Gold",
    heroSubtitle: "Análisis de Video y Generación de Scripts con IA",
    heroDescription: "Analiza contenido viral de TikTok, Instagram Reels y YouTube Shorts. Genera scripts de marketing de alta conversión usando frameworks psicológicos avanzados.",
    getStarted: "Comenzar",
    login: "Iniciar Sesión",
    
    // Features
    features: "Características",
    feature1Title: "Análisis de Video con IA",
    feature1Description: "Análisis profundo de contenido viral con transcripción e insights psicológicos",
    feature2Title: "Generación Inteligente de Scripts",
    feature2Description: "Crea scripts de marketing de alta conversión usando frameworks probados",
    feature3Title: "Analíticas de Rendimiento",
    feature3Description: "Rastrea el rendimiento de tu contenido y oportunidades de optimización",
    
    // Dashboard
    analyzeVideo: "Analizar Video",
    videoUrl: "URL del Video",
    videoUrlPlaceholder: "Ingresa URL de TikTok, Instagram Reel o YouTube Shorts",
    platform: "Plataforma",
    selectPlatform: "Seleccionar plataforma",
    brandInfo: "Información de Marca",
    brandInfoPlaceholder: "Cuéntanos sobre tu marca, producto o servicio",
    tone: "Tono",
    selectTone: "Seleccionar tono",
    analyze: "Analizar",
    
    // Analysis Results
    analysisResults: "Resultados del Análisis",
    transcription: "Transcripción",
    hook: "Gancho",
    hookType: "Tipo de Gancho",
    effectiveness: "Efectividad",
    viralElements: "Elementos Virales",
    storytelling: "Estructura Narrativa",
    beginning: "Inicio",
    middle: "Medio",
    end: "Final",
    cta: "Llamada a la Acción",
    emotionalTone: "Tono Emocional",
    keyPhrases: "Frases Clave",
    viralMechanics: "Mecánicas Virales",
    
    // Script Generation
    generateScript: "Generar Script",
    scriptTitle: "Título del Script",
    businessType: "Tipo de Negocio",
    contentType: "Tipo de Contenido",
    framework: "Framework",
    platforms: "Plataformas",
    videoDuration: "Duración del Video",
    targetAudience: "Audiencia Objetivo",
    keyMessage: "Mensaje Clave",
    
    // Analytics
    analyticsTitle: "Panel de Analíticas",
    analyticsSubtitle: "Insights avanzados sobre tu rendimiento de contenido viral",
    totalAnalysis: "Total Análisis",
    averageScore: "Score Promedio",
    exports: "Exportaciones",
    shares: "Compartidos",
    trends: "Tendencias",
    performanceTrends: "Tendencias de Rendimiento",
    platformDistribution: "Distribución por Plataforma",
    frameworkUsage: "Uso de Frameworks Neurológicos",
    behaviorPatterns: "Patrones de Uso",
    preferences: "Preferencias",
    
    // Export
    exportOptions: "Opciones de Exportación",
    downloadPDF: "Descargar PDF",
    openGoogleDocs: "Abrir en Google Docs",
    copyToClipboard: "Copiar al Portapapeles",
    shareLink: "Generar Enlace Compartido",
    
    // Common
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    cancel: "Cancelar",
    save: "Guardar",
    edit: "Editar",
    delete: "Eliminar",
    confirm: "Confirmar",
    close: "Cerrar",
    next: "Siguiente",
    previous: "Anterior",
    
    // Performance
    excellent: "Excelente",
    good: "Bueno",
    average: "Promedio",
    needsImprovement: "Necesita Mejora",
    
    // Language
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    
    // Footer & Additional
    footer: "Pie de página",
    allRightsReserved: "Todos los derechos reservados",
    privacyPolicy: "Política de Privacidad",
    termsOfService: "Términos de Servicio",
    
    // CTA Section
    ctaTitle: "¿Listo para Transformar tu Contenido?",
    ctaDescription: "Comienza a analizar videos virales y crear scripts de alta conversión hoy",
    
    // Script History
    historyTitle: "Historial de Scripts",
    noScripts: "Aún no hay scripts generados",
    viewScript: "Ver Script",
    downloadScript: "Descargar Script",
    
    // Forms
    required: "Requerido",
    optional: "Opcional",
    submit: "Enviar",
    
    // Performance Mascot
    performanceScore: "Puntuación de Rendimiento",
    mascotTip: "Consejo",
    
    // Additional Dashboard Elements
    noData: "Sin datos disponibles",
    lastDays: "Últimos {days} días",
    averagePerformance: "Rendimiento Promedio",
    totalExports: "Total Exportaciones",
    totalShares: "Total Compartidos",
    
    // Form Validation
    invalidUrl: "Ingresa una URL válida",
    urlRequired: "La URL del video es requerida",
    analyzeNow: "Analizar Ahora",
    
    // Additional UI Elements
    learnMore: "Aprender Más",
    viewMore: "Ver Más",
    showLess: "Mostrar Menos",
  }
};

export type Language = 'en' | 'es';

export const getTranslation = (key: keyof Translations, language: Language): string => {
  return translations[language][key] || translations.en[key] || key;
};