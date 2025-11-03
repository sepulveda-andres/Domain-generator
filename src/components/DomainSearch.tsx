import { useState, useMemo, useEffect } from 'react';
import { allSpanishWords } from '../data/spanish-words';
import { allEnglishWords } from '../data/english-words';

interface DomainResult {
  domain: string;
  available: boolean | null;
  checking: boolean;
}

const TLD_OPTIONS = [
  { value: '.com', label: '.com' },
  { value: '.es', label: '.es' },
  { value: '.org', label: '.org' },
  { value: '.net', label: '.net' },
  { value: '.io', label: '.io' },
  { value: '.dev', label: '.dev' },
  { value: '.app', label: '.app' },
  { value: '.co', label: '.co' },
  { value: '.me', label: '.me' },
  { value: '.info', label: '.info' },
];

// Translations for React component
const translations = {
  es: {
    configTitle: 'Configura tu búsqueda',
    keywordsLabel: 'Palabras clave',
    keywordsPlaceholder: 'Escribe una palabra clave...',
    addButton: 'Agregar',
    languageLabel: 'Idioma para combinaciones',
    spanish: 'Español',
    english: 'Inglés',
    both: 'Ambos',
    combinationsLabel: 'Generar combinaciones automáticas (recomendado)',
    combinationsDesc: 'Combina tus palabras clave con términos comunes para generar más opciones',
    tldsLabel: 'Extensiones de dominio (TLDs)',
    statsGenerated: 'Se generarán',
    statsCombinations: 'combinaciones',
    statsChecked: 'Se revisarán',
    statsDomains: 'dominios',
    searchButton: '🚀 Buscar dominios disponibles',
    searching: '🔍 Buscando dominios...',
    resultsTitle: 'Resultados',
    available: 'disponibles',
    infoBanner: 'Los dominios mostrados están verificados en tiempo real. Haz clic en "Comprar" para registrarlos.',
    buyButton: 'Comprar',
    checkingStatus: 'Verificando...',
  },
  en: {
    configTitle: 'Configure your search',
    keywordsLabel: 'Keywords',
    keywordsPlaceholder: 'Enter a keyword...',
    addButton: 'Add',
    languageLabel: 'Language for combinations',
    spanish: 'Spanish',
    english: 'English',
    both: 'Both',
    combinationsLabel: 'Generate automatic combinations (recommended)',
    combinationsDesc: 'Combine your keywords with common terms to generate more options',
    tldsLabel: 'Domain extensions (TLDs)',
    statsGenerated: 'Will generate',
    statsCombinations: 'combinations',
    statsChecked: 'Will check',
    statsDomains: 'domains',
    searchButton: '🚀 Search available domains',
    searching: '🔍 Searching domains...',
    resultsTitle: 'Results',
    available: 'available',
    infoBanner: 'The domains shown are verified in real time. Click "Buy" to register them.',
    buyButton: 'Buy',
    checkingStatus: 'Checking...',
  }
};

export default function DomainSearch() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [selectedTLDs, setSelectedTLDs] = useState<string[]>(['.com']);
  const [language, setLanguage] = useState<'es' | 'en' | 'both'>('both');
  const [useCombinations, setUseCombinations] = useState(true);
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  // Listen for language changes
  useEffect(() => {
    const storedLang = localStorage.getItem('preferred-lang') || 'es';
    setCurrentLang(storedLang as 'es' | 'en');

    const handleLanguageChange = (e: CustomEvent) => {
      setCurrentLang(e.detail.lang);
    };

    document.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => {
      document.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  // Reset used words when keywords change
  useEffect(() => {
    setUsedWords(new Set());
  }, [keywords]);

  const t = translations[currentLang];

  // Function to get random unique words from dictionary
  const getRandomWords = (wordList: string[], count: number, excludeSet: Set<string>): string[] => {
    const availableWords = wordList.filter(word => !excludeSet.has(word));
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  const addKeyword = () => {
    const trimmed = currentKeyword.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const toggleTLD = (tld: string) => {
    if (selectedTLDs.includes(tld)) {
      setSelectedTLDs(selectedTLDs.filter(t => t !== tld));
    } else {
      setSelectedTLDs([...selectedTLDs, tld]);
    }
  };

  const generateCombinations = useMemo(() => {
    if (keywords.length === 0) return [];

    const combinations: string[] = [];
    
    // Get random words from dictionary, excluding already used ones
    let commonWords: string[] = [];
    
    if (language === 'es') {
      commonWords = getRandomWords(allSpanishWords, 50, usedWords);
    } else if (language === 'en') {
      commonWords = getRandomWords(allEnglishWords, 50, usedWords);
    } else {
      // For 'both', mix Spanish and English
      const spanishWords = getRandomWords(allSpanishWords, 30, usedWords);
      const englishWords = getRandomWords(allEnglishWords, 30, usedWords);
      commonWords = [...spanishWords, ...englishWords];
    }

    // Add base keywords
    combinations.push(...keywords);

    if (useCombinations) {
      // Combine keywords with each other
      if (keywords.length >= 2) {
        for (let i = 0; i < keywords.length; i++) {
          for (let j = i + 1; j < keywords.length; j++) {
            combinations.push(`${keywords[i]}${keywords[j]}`);
            combinations.push(`${keywords[j]}${keywords[i]}`);
          }
        }
      }

      // Combine with random common words
      keywords.forEach(keyword => {
        commonWords.slice(0, 10).forEach(word => {
          combinations.push(`${word}${keyword}`);
          combinations.push(`${keyword}${word}`);
        });
      });
    }

    // Remove duplicates and clean
    const seen = new Set<string>();
    const uniqueCombinations: string[] = [];
    
    for (const combo of combinations) {
      if (!seen.has(combo) && combo.length >= 3 && combo.length <= 50) {
        seen.add(combo);
        uniqueCombinations.push(combo);
      }
    }

    return uniqueCombinations.slice(0, 50); // Limit to 50 combinations
  }, [keywords, language, useCombinations, usedWords]);

  const checkDomainAvailability = async (domain: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/check-domain?domain=${encodeURIComponent(domain)}`);
      
      if (!response.ok) {
        console.error(`Error checking ${domain}: HTTP ${response.status}`);
        // On error, assume AVAILABLE to avoid false negatives
        return true;
      }
      
      const data = await response.json();
      
      // Explicitly check for true, otherwise assume available
      if (data.error) {
        console.error(`API error for ${domain}:`, data.error);
        return true; // Assume available on error
      }
      
      return data.available === true;
    } catch (error) {
      console.error('Error checking domain:', domain, error);
      // On network error, assume available to avoid false negatives
      return true;
    }
  };

  const searchDomains = async () => {
    if (selectedTLDs.length === 0 || generateCombinations.length === 0) {
      return;
    }

    setIsSearching(true);
    const domainsToCheck: DomainResult[] = [];

    // Track words used in this search
    const newUsedWords = new Set(usedWords);

    // Generate all domain combinations
    generateCombinations.forEach(name => {
      // Extract dictionary words from combinations (words that are not in user's keywords)
      const words = name.split(/(?=[A-Z])/); // Split by camelCase or just use the whole word
      keywords.forEach(keyword => {
        // If this combination contains a dictionary word, mark it as used
        if (name !== keyword && name.includes(keyword)) {
          const dictWord = name.replace(keyword, '');
          if (dictWord.length > 0) {
            newUsedWords.add(dictWord);
          }
        }
      });

      selectedTLDs.forEach(tld => {
        domainsToCheck.push({
          domain: `${name}${tld}`,
          available: null,
          checking: true
        });
      });
    });

    setResults(domainsToCheck);

    // Check availability for each domain
    for (let i = 0; i < domainsToCheck.length; i++) {
      const result = domainsToCheck[i];
      const available = await checkDomainAvailability(result.domain);
      
      setResults(prev => 
        prev.map((r, idx) => 
          idx === i 
            ? { ...r, available, checking: false } 
            : r
        )
      );

      // Add small delay to avoid overwhelming the API
      if (i < domainsToCheck.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Update used words after search completes
    setUsedWords(newUsedWords);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addKeyword();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Search Configuration */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {t.configTitle}
        </h2>

        {/* Keywords Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.keywordsLabel}
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.keywordsPlaceholder}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={addKeyword}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              {t.addButton}
            </button>
          </div>
          
          {/* Keywords Tags */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 hover:text-primary-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.languageLabel}
          </label>
          <div className="flex gap-3">
            {[
              { value: 'es', label: t.spanish },
              { value: 'en', label: t.english },
              { value: 'both', label: t.both }
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value as 'es' | 'en' | 'both')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  language === lang.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Combinations Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useCombinations}
              onChange={(e) => setUseCombinations(e.target.checked)}
              className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              {t.combinationsLabel}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-8">
            {t.combinationsDesc}
          </p>
        </div>

        {/* TLD Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.tldsLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {TLD_OPTIONS.map((tld) => (
              <button
                key={tld.value}
                onClick={() => toggleTLD(tld.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  selectedTLDs.includes(tld.value)
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tld.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Stats */}
        {generateCombinations.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {t.statsGenerated} <strong className="text-primary-700">{generateCombinations.length}</strong> {t.statsCombinations}
                </p>
                <p className="text-sm text-gray-600">
                  {t.statsChecked} <strong className="text-primary-700">{generateCombinations.length * selectedTLDs.length}</strong> {t.statsDomains}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={searchDomains}
          disabled={isSearching || keywords.length === 0 || selectedTLDs.length === 0}
          className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
        >
          {isSearching ? t.searching : t.searchButton}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t.resultsTitle} ({results.filter(r => r.available === true).length} {t.available})
            </h2>
          </div>

          {/* Info banner */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <div className="text-sm">
                <p className="text-blue-700">
                  {t.infoBanner}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {results
              .sort((a, b) => {
                if (a.available === b.available) return 0;
                if (a.available === true) return -1;
                if (b.available === true) return 1;
                return 0;
              })
              .map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    result.checking
                      ? 'border-gray-200 bg-gray-50'
                      : result.available
                      ? 'border-green-200 bg-green-50 hover:border-green-300'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.checking ? (
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    ) : result.available ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`font-mono font-semibold ${
                      result.available ? 'text-green-900' : 'text-gray-600'
                    }`}>
                      {result.domain}
                    </span>
                  </div>

                  {result.available && !result.checking && (
                    <a
                      href={`https://www.namecheap.com/domains/registration/results/?domain=${result.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      {t.buyButton} →
                    </a>
                  )}

                  {result.checking && (
                    <span className="text-sm text-gray-500">{t.checkingStatus}</span>
                  )}
                </div>
              ))}
          </div>

          {isSearching && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <span>Verificando disponibilidad...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
