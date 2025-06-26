import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { questionnaireAPI } from "./api/questionnaire";
import Header from "./components/Header";
import Footer from "./Footer"; // Importa il Footer

// Tipo per trendDetails
type TrendDetail = {
  familiarita?: number;
  esempi?: boolean;
  aggiornamento?: boolean;
  rilevanza?: number;
  orizzonte?: string;
  budget?: string;
  competenze?: number;
  funding?: number;
};

// Tipo per formData
type FormData = {
  dimensione: string;
  segmento: string[];
  export: string;
  digitalizzazione: string;
  budget: string;
  collaborazioni: string;
  trends: string[];
  // ATTENZIONE: QUALSIASI stringa può essere chiave di trendDetails
  trendDetails: { [trendId: string]: TrendDetail };
};

// —— Nuove interfaccie per tipizzare i dizionari ——

// Interfaccia per ogni voce di categoryInfo
interface CategoryInfo {
  title: string;
  icon: string;
  description: string;
  displayName: string;
}

// Interfaccia per ogni voce di subcategoryInfo
interface SubcategoryInfo {
  icon: string;
  description: string;
}

const AgriFoodQuestionario = () => {
  // ────────── STATO ──────────
  const [currentSection, setCurrentSection] = useState<number>(0);

  // ✅ ANNOTARE GLI ARRAY E GLI OGGETTI VUOTI
  const [formData, setFormData] = useState<FormData>({
    dimensione: "",
    segmento: [] as string[], // ✅ TIPO ATTESO: string[]
    export: "",
    digitalizzazione: "",
    budget: "",
    collaborazioni: "",
    trends: [] as string[], // ✅ TIPO ATTESO: string[]
    trendDetails: {} as { [trendId: string]: TrendDetail }, // ✅ TIPO ATTESO: { [k:string]:TrendDetail }
  });

  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [currentTrendIndex, setCurrentTrendIndex] = useState<number>(0);
  const [animateCard, setAnimateCard] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // ────────── DATI STATICI RIORGANIZZATI ──────────
  const trends = [
    // ════════════ 7.1 TRASFORMAZIONE DEGLI ALIMENTI ════════════
    // ──── Processi produttivi innovativi ────
    {
      id: "TE1",
      name: "Automazione e robotica industriale",
      category: "Trasformazione degli alimenti",
      subcategory: "Processi produttivi innovativi",
      icon: "🤖",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "TE2",
      name: "Intelligenza Artificiale e IoT in fabbrica",
      category: "Trasformazione degli alimenti",
      subcategory: "Processi produttivi innovativi",
      icon: "🧠",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "TE3",
      name: "Biotecnologie e fermentazione avanzata",
      category: "Trasformazione degli alimenti",
      subcategory: "Processi produttivi innovativi",
      icon: "🧬",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "TE4",
      name: "Stampa 3D di alimenti",
      category: "Trasformazione degli alimenti",
      subcategory: "Processi produttivi innovativi",
      icon: "🎯",
      color: "from-blue-500 to-blue-700",
    },

    // ──── Tecnologie per la conservazione degli alimenti ────
    {
      id: "TE5",
      name: "Trattamenti non termici",
      category: "Trasformazione degli alimenti",
      subcategory: "Tecnologie per la conservazione degli alimenti",
      icon: "⚡",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      id: "TE6",
      name: "Conservanti naturali e biopreservazione",
      category: "Trasformazione degli alimenti",
      subcategory: "Tecnologie per la conservazione degli alimenti",
      icon: "🌿",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      id: "TE7",
      name: "Atmosfere controllate e packaging protettivo",
      category: "Trasformazione degli alimenti",
      subcategory: "Tecnologie per la conservazione degli alimenti",
      icon: "💨",
      color: "from-emerald-500 to-emerald-700",
    },

    // ──── Miglioramento delle proprietà organolettiche ────
    {
      id: "TE8",
      name: "Fermentazioni e maturazioni controllate",
      category: "Trasformazione degli alimenti",
      subcategory: "Miglioramento delle proprietà organolettiche",
      icon: "🦠",
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "TE9",
      name: "Ingredienti riformulati per gusto e salute",
      category: "Trasformazione degli alimenti",
      subcategory: "Miglioramento delle proprietà organolettiche",
      icon: "🥗",
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "TE10",
      name: "Tecniche di lavorazione dolci (mild processing)",
      category: "Trasformazione degli alimenti",
      subcategory: "Miglioramento delle proprietà organolettiche",
      icon: "🌊",
      color: "from-purple-500 to-purple-700",
    },

    // ──── Packaging e confezionamento innovativo ────
    {
      id: "TE11",
      name: "Materiali sostenibili e bio-based",
      category: "Trasformazione degli alimenti",
      subcategory: "Packaging e confezionamento innovativo",
      icon: "♻️",
      color: "from-teal-500 to-teal-700",
    },
    {
      id: "TE12",
      name: "Packaging attivo per la conservazione",
      category: "Trasformazione degli alimenti",
      subcategory: "Packaging e confezionamento innovativo",
      icon: "🛡️",
      color: "from-teal-500 to-teal-700",
    },
    {
      id: "TE13",
      name: "Imballaggi intelligenti e connessi",
      category: "Trasformazione degli alimenti",
      subcategory: "Packaging e confezionamento innovativo",
      icon: "📦",
      color: "from-teal-500 to-teal-700",
    },

    // ════════════ 7.2 MERCATI E CANALI DI DISTRIBUZIONE ════════════
    // ──── Canali di vendita fisici ────
    {
      id: "TE14",
      name: "Smart Store e Retail Immersivo",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Canali di vendita fisici",
      icon: "🏪",
      color: "from-orange-500 to-orange-700",
    },
    {
      id: "TE15",
      name: "Automazione retail e vending intelligente",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Canali di vendita fisici",
      icon: "🤖",
      color: "from-orange-500 to-orange-700",
    },
    {
      id: "TE16",
      name: "Tracciabilità in-store con Blockchain",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Canali di vendita fisici",
      icon: "🔗",
      color: "from-orange-500 to-orange-700",
    },

    // ──── Canali digitali: e-commerce e piattaforme D2C ────
    {
      id: "TE17",
      name: "Sistemi di raccomandazione basati su Intelligenza Artificiale",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Canali digitali: e-commerce e piattaforme D2C",
      icon: "🎯",
      color: "from-pink-500 to-pink-700",
    },
    {
      id: "TE18",
      name: "Subscription box e vendita diretta D2C",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Canali digitali: e-commerce e piattaforme D2C",
      icon: "📮",
      color: "from-pink-500 to-pink-700",
    },
    {
      id: "TE19",
      name: "Social commerce e Live Shopping",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Canali digitali: e-commerce e piattaforme D2C",
      icon: "📱",
      color: "from-pink-500 to-pink-700",
    },

    // ──── Mercati domestici/internazionali: Made in Italy ────
    {
      id: "TE20",
      name: "Marketplace e piattaforme integrate",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Mercati domestici/internazionali: Made in Italy",
      icon: "🌐",
      color: "from-red-500 to-red-700",
    },
    {
      id: "TE21",
      name: "Blockchain per l'autenticità del prodotto",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Mercati domestici/internazionali: Made in Italy",
      icon: "🔏",
      color: "from-red-500 to-red-700",
    },

    // ──── Evoluzione comportamento del consumatore e nuovi modelli ────
    {
      id: "TE22",
      name: "Quick commerce e dark store",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Evoluzione comportamento del consumatore e nuovi modelli",
      icon: "⚡",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      id: "TE23",
      name: "Esperienze immersive e metaverso",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Evoluzione comportamento del consumatore e nuovi modelli",
      icon: "🥽",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      id: "TE24",
      name: "Personalizzazione e CRM evoluto",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Evoluzione comportamento del consumatore e nuovi modelli",
      icon: "👤",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      id: "TE25",
      name: "Etichette intelligenti e tracciabilità",
      category: "Mercati e Canali di distribuzione",
      subcategory: "Evoluzione comportamento del consumatore e nuovi modelli",
      icon: "🏷️",
      color: "from-indigo-500 to-indigo-700",
    },

    // ════════════ 7.3 LOGISTICA E DELIVERY ════════════
    // ──── Ottimizzazione dei flussi e delle risorse ────
    {
      id: "TE26",
      name: "Intelligenza Artificiale per ottimizzazione dei percorsi e delle consegne",
      category: "Logistica e Delivery",
      subcategory: "Ottimizzazione dei flussi e delle risorse",
      icon: "🗺️",
      color: "from-cyan-500 to-cyan-700",
    },
    {
      id: "TE27",
      name: "Smart Inventory Management e previsione della domanda",
      category: "Logistica e Delivery",
      subcategory: "Ottimizzazione dei flussi e delle risorse",
      icon: "📊",
      color: "from-cyan-500 to-cyan-700",
    },
    {
      id: "TE28",
      name: "Sistemi integrati WMS e TMS",
      category: "Logistica e Delivery",
      subcategory: "Ottimizzazione dei flussi e delle risorse",
      icon: "🏭",
      color: "from-cyan-500 to-cyan-700",
    },

    // ──── Tracciabilità, qualità e sicurezza alimentare ────
    {
      id: "TE29",
      name: "Monitoraggio intelligente della logistica",
      category: "Logistica e Delivery",
      subcategory: "Tracciabilità, qualità e sicurezza alimentare",
      icon: "📡",
      color: "from-green-500 to-green-700",
    },
    {
      id: "TE30",
      name: "Cold chain decentralizzata e adattiva",
      category: "Logistica e Delivery",
      subcategory: "Tracciabilità, qualità e sicurezza alimentare",
      icon: "❄️",
      color: "from-green-500 to-green-700",
    },
    {
      id: "TE31",
      name: "Sistemi distribuiti per la tracciabilità di filiera",
      category: "Logistica e Delivery",
      subcategory: "Tracciabilità, qualità e sicurezza alimentare",
      icon: "🌐",
      color: "from-green-500 to-green-700",
    },

    // ──── Automazione e logistica urbana intelligente ────
    {
      id: "TE32",
      name: "Robotica e automazione nei magazzini",
      category: "Logistica e Delivery",
      subcategory: "Automazione e logistica urbana intelligente",
      icon: "🤖",
      color: "from-slate-500 to-slate-700",
    },
    {
      id: "TE33",
      name: "Micro-fulfillment centers",
      category: "Logistica e Delivery",
      subcategory: "Automazione e logistica urbana intelligente",
      icon: "📦",
      color: "from-slate-500 to-slate-700",
    },
    {
      id: "TE34",
      name: "Consegna autonoma e logistica dell'ultimo miglio sostenibile",
      category: "Logistica e Delivery",
      subcategory: "Automazione e logistica urbana intelligente",
      icon: "🚁",
      color: "from-slate-500 to-slate-700",
    },
  ];

  // ────────── INFORMAZIONI AGGIUNTIVE ──────────
  // ⟹ ora categoryInfo è dichiarato con Record<string, CategoryInfo>
  const categoryInfo: Record<string, CategoryInfo> = {
    "Trasformazione degli alimenti": {
      title: "Trasformazione degli alimenti",
      icon: "⚙️",
      description:
        "Tecnologie per la produzione, conservazione e miglioramento degli alimenti",
      displayName: "TRASFORMAZIONE",
    },
    "Mercati e Canali di distribuzione": {
      title: "Mercati e Canali di distribuzione",
      icon: "🛒",
      description: "Innovazioni nei canali di vendita fisici e digitali",
      displayName: "DISTRIBUZIONE",
    },
    "Logistica e Delivery": {
      title: "Logistica e Delivery",
      icon: "🚚",
      description: "Soluzioni per ottimizzazione logistica e consegne",
      displayName: "LOGISTICA",
    },
  };

  // ⟹ ora subcategoryInfo è dichiarato con Record<string, SubcategoryInfo>
  const subcategoryInfo: Record<string, SubcategoryInfo> = {
    // Trasformazione degli alimenti
    "Processi produttivi innovativi": {
      icon: "🔧",
      description:
        "Automazione, AI, biotecnologie e stampa 3D per la produzione",
    },
    "Tecnologie per la conservazione degli alimenti": {
      icon: "🛡️",
      description: "Trattamenti innovativi e atmosfere controllate",
    },
    "Miglioramento delle proprietà organolettiche": {
      icon: "👅",
      description: "Tecniche per migliorare gusto, aroma e texture",
    },
    "Packaging e confezionamento innovativo": {
      icon: "📦",
      description: "Materiali sostenibili e imballaggi intelligenti",
    },

    // Mercati e Canali di distribuzione
    "Canali di vendita fisici": {
      icon: "🏪",
      description: "Smart store, automazione e tracciabilità in negozio",
    },
    "Canali digitali: e-commerce e piattaforme D2C": {
      icon: "💻",
      description: "E-commerce, subscription e social commerce",
    },
    "Mercati domestici/internazionali: Made in Italy": {
      icon: "🇮🇹",
      description: "Marketplace e certificazione blockchain per export",
    },
    "Evoluzione comportamento del consumatore e nuovi modelli": {
      icon: "✨",
      description: "Quick commerce, metaverso e personalizzazione",
    },

    // Logistica e Delivery
    "Ottimizzazione dei flussi e delle risorse": {
      icon: "📈",
      description: "AI e sistemi integrati per efficienza logistica",
    },
    "Tracciabilità, qualità e sicurezza alimentare": {
      icon: "🔍",
      description: "Monitoraggio intelligente e cold chain",
    },
    "Automazione e logistica urbana intelligente": {
      icon: "🏙️",
      description: "Robotica, micro-fulfillment e consegne autonome",
    },
  };

  const sections = [
    { title: "Benvenuto", subtitle: "---" },
    { title: "Profilo Aziendale", subtitle: "Conosciamoci meglio" },
    { title: "Trend Tecnologici", subtitle: "Seleziona le tue priorità" },
    { title: "Approfondimento", subtitle: "Dettagli sui trend selezionati" },
    { title: "Conclusione", subtitle: "Grazie per la partecipazione" },
  ];

  // ────────── EFFETTO DI TRANSIZIONE ──────────
  useEffect(() => {
    setAnimateCard(true);
    const timer = setTimeout(() => setAnimateCard(false), 300);
    return () => clearTimeout(timer);
  }, [currentSection, currentTrendIndex]);

  // ────────── HANDLER GENERICI ──────────
  const handleInputChange = (name: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Usando “as string[]” in inizializzazione, prev[name] è già string[]
  const handleMultiSelect = (name: "segmento" | "trends", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v: string) => v !== value)
        : [...prev[name], value],
    }));
  };

  const handleTrendSelection = (trendId: string) => {
    if (selectedTrends.includes(trendId)) {
      setSelectedTrends((prev) => prev.filter((t) => t !== trendId));
    } else if (selectedTrends.length < 4) {
      setSelectedTrends((prev) => [...prev, trendId]);
    }
  };

  const handleTrendDetailChange = (
    trendId: string,
    field: keyof TrendDetail,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      trendDetails: {
        ...prev.trendDetails,
        [trendId]: {
          ...prev.trendDetails[trendId],
          [field]: value,
        },
      },
    }));
  };

  // ────────── NAVIGAZIONE SEZIONI ──────────
  const nextSection = () => {
    if (currentSection === 2) {
      setFormData((prev) => ({ ...prev, trends: selectedTrends }));
    }
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const nextTrend = () => {
    if (currentTrendIndex < selectedTrends.length - 1) {
      setCurrentTrendIndex((prev) => prev + 1);
    } else {
      nextSection();
    }
  };

  const prevTrend = () => {
    if (currentTrendIndex > 0) {
      setCurrentTrendIndex((prev) => prev - 1);
    } else {
      prevSection();
    }
  };

  // ────────── INVIO QUESTIONARIO ──────────
  const handleSubmit = async () => {
    console.log("handleSubmit chiamato");
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // ✅ CAST NECESSARIO: querySelector restituisce “Element | null”
      const emailInput = document.querySelector(
        'input[type="email"]'
      ) as HTMLInputElement | null;
      const email = emailInput ? emailInput.value : "";

      const dataToSubmit = {
        ...formData,
        email,
        timestamp: new Date().toISOString(),
      };

      const result = await questionnaireAPI.submit(dataToSubmit);

      if (result.success) {
        setSubmitSuccess(true);
        console.log("Questionario inviato con successo!");
      }
    } catch (error: any) {
      // ✅ Typing esplicito “error: any” altrimenti TS dà “unknown”
      setSubmitError(error.message);
      console.error("Errore invio:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ────────── PROGRESS BAR ──────────
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-50">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-white rounded-full border-2 border-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="pt-8 pb-4 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Icons.Leaf className="w-8 h-8 text-green-600 animate-pulse" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                I fabbisogni di innovazione del settore agroalimentare
              </h1>
              <Icons.Settings className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <p className="text-gray-600">{sections[currentSection].subtitle}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 pb-20">
          <div
            className={`transition-all duration-300 ${
              animateCard ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {/* ===== Sezione 0: Welcome ===== */}
            {currentSection === 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
                <div className="mb-8">
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse opacity-20"></div>
                    <div className="relative flex items-center justify-center w-full h-full">
                      <Icons.Star className="w-20 h-20 text-blue-600" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold mb-4">
                    Costruiamo il futuro dell'Agroalimentare
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Il tuo contributo è fondamentale per mappare i bisogni di
                    innovazione delle imprese del Lazio. Insieme possiamo
                    accelerare la trasformazione digitale e sostenibile del
                    settore. Lazio Innova utilizzerà i dati in maniera aggregata
                    ed esclusivamente in forma anonima
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                    <Icons.Clock className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">10 minuti</h3>
                    <p className="text-sm text-gray-600">
                      Tempo stimato di compilazione
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                    <Icons.Globe className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Tecnologie emergenti</h3>
                    <p className="text-sm text-gray-600">
                      Esplora le ultime innovazioni nell’AgriFoodTech
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                    <Icons.TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Impatto concreto</h3>
                    <p className="text-sm text-gray-600">
                      Contribuisci alla definizione di nuovi programmi
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ===== Sezione 1: Profilo Aziendale ===== */}
            {currentSection === 1 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Profilo Aziendale</h2>

                {/* —————— Dimensione aziendale —————— */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Dimensione aziendale
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Fino a 9", "10-49", "50-249", "Oltre 250"].map(
                      (size) => (
                        <button
                          key={size}
                          onClick={() => handleInputChange("dimensione", size)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            formData.dimensione === size
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icons.Users className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm">{size}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* —————— Multi‐selezione dei 9 trend —————— */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Seleziona i trend più rilevanti per la tua azienda
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        id: "1",
                        icon: <Icons.Leaf className="w-6 h-6 text-green-600" />,
                        name: "Sostenibilità come driver principale",
                        description:
                          "La filiera si riprogetta per ridurre sprechi, emissioni e materiali non riciclabili: obiettivi normativi UE e preferenze dei consumatori spingono verso processi circolari, energy-&-water saving, packaging riutilizzabile e trasporti low-carbon.",
                      },
                      {
                        id: "2",
                        icon: (
                          <Icons.Settings className="w-6 h-6 text-purple-600" />
                        ),
                        name: "Personalizzazione e qualità premium",
                        description:
                          "Dal product design alla consegna, l’offerta si adatta ai bisogni nutrizionali e ai gusti del singolo, trasformando l’esperienza in valore aggiunto e giustificando prezzi più alti per soluzioni “su misura”.",
                      },
                      {
                        id: "3",
                        icon: <Icons.Globe className="w-6 h-6 text-blue-600" />,
                        name: "Omnicanalità e customer journey integrata",
                        description:
                          "Canali fisici, digitali e social convergono in un percorso d’acquisto senza soluzione di continuità; dati e stock sono sincronizzati per garantire coerenza di assortimento, prezzo e servizio, qualunque touch-point scelga il cliente.",
                      },
                      {
                        id: "4",
                        icon: (
                          <Icons.Activity className="w-6 h-6 text-indigo-600" />
                        ),
                        name: "Efficienza e resilienza della filiera",
                        description:
                          "L’uso di sensori, IA e analytics ottimizza risorse e tempi, riduce i rischi di fermo, permette di reagire rapidamente a shock sanitari, climatici o geopolitici, mantenendo stabilità di qualità, costi e disponibilità del prodotto.",
                      },
                      {
                        id: "5",
                        icon: <Icons.Code className="w-6 h-6 text-teal-600" />,
                        name: "Digitalizzazione e automazione diffusa",
                        description:
                          "Robot collaborativi, magazzini automatici, blockchain e piattaforme cloud tracciano, movimentano e controllano in tempo reale materie prime, semilavorati e prodotti finiti, abbattendo errori manuali e costi operativi.",
                      },
                      {
                        id: "6",
                        icon: (
                          <Icons.ShoppingCart className="w-6 h-6 text-red-600" />
                        ),
                        name: "Nuovi mercati e prodotti di frontiera",
                        description:
                          "Novel food, plant-based, funzionali e nutraceutici ampliano l’offerta: tecniche di processo avanzate ne garantiscono gusto e sicurezza, mentre canali digital-first accelerano l’adozione presso target attenti a salute ed etica.",
                      },
                      {
                        id: "7",
                        icon: (
                          <Icons.MapPin className="w-6 h-6 text-orange-600" />
                        ),
                        name: "Internazionalizzazione digitale e Made in Italy distribuito",
                        description:
                          "E-commerce cross-border, marketplace D2C e food-box tematiche portano i prodotti italiani direttamente ai consumatori globali, valorizzando storytelling territoriale e certificazioni d’origine senza passare dai canali tradizionali.",
                      },
                      {
                        id: "8",
                        icon: (
                          <Icons.Users className="w-6 h-6 text-yellow-600" />
                        ),
                        name: "Modelli emergenti di acquisto e consumo",
                        description:
                          "Community-group buying, abbonamenti, social-commerce e contenuti live trasformano il consumatore in co-creatore e ambassador del brand, influenzando formulazione, confezione e dinamiche di lancio dei prodotti.",
                      },
                      {
                        id: "9",
                        icon: <Icons.Truck className="w-6 h-6 text-cyan-600" />,
                        name: "Logistica dell’ultimo miglio evoluta",
                        description:
                          "Micro-hub urbani, flotte elettriche, robot e droni abiliteranno consegne rapide, tracciate e a basso impatto, integrandosi con produzione just-in-time e canali omnicanale per garantire freschezza, convenienza e sostenibilità.",
                      },
                    ].map((trend) => (
                      <label
                        key={trend.id}
                        className={`flex flex-col justify-between p-4 bg-white rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                          formData.segmento.includes(trend.id)
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div className="mr-3">{trend.icon}</div>
                          <h4 className="font-semibold text-gray-800">
                            {trend.name}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-4 leading-snug">
                          {trend.description}
                        </p>

                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.segmento.includes(trend.id)}
                          onChange={() =>
                            handleMultiSelect("segmento", trend.id)
                          }
                        />
                        {formData.segmento.includes(trend.id) && (
                          <Icons.Check className="w-5 h-5 text-green-600 self-end" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* —————— Quota export —————— */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quota export
                  </label>
                  <div className="flex gap-2">
                    {["0%", "1-10%", "11-30%", "31-50%", "Oltre 50%"].map(
                      (value) => (
                        <button
                          key={value}
                          onClick={() => handleInputChange("export", value)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${
                            formData.export === value
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {value}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* —————— Livello di digitalizzazione —————— */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Livello di digitalizzazione
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 rounded-xl opacity-50"></div>
                    <div className="relative bg-white bg-opacity-90 rounded-xl p-1">
                      <div className="flex">
                        {[
                          "Molto basso",
                          "Basso",
                          "Medio",
                          "Alto",
                          "Molto alto",
                        ].map((level) => (
                          <button
                            key={level}
                            onClick={() =>
                              handleInputChange("digitalizzazione", level)
                            }
                            className={`flex-1 py-3 px-2 text-xs transition-all rounded-lg ${
                              formData.digitalizzazione === level
                                ? "bg-white shadow-lg transform scale-105 font-semibold"
                                : ""
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* ===== Sezione 2: Trend Selection ===== */}
            {currentSection === 2 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Seleziona le tecnologie emergenti
                  </h2>
                  <p className="text-gray-600">
                    Scegli preferibilmente almeno 4 tecnologie rilevanti per la
                    tua impresa nei prossimi 2-3 anni
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i < selectedTrends.length
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {selectedTrends.length}/4 selezionati
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Raggruppa per categoria principale */}
                  {Object.entries(categoryInfo).map(
                    ([categoryKey, categoryData]) => {
                      // Ottieni tutte le subcategorie per questa categoria
                      const subcategories = [
                        ...new Set(
                          trends
                            .filter((t) => t.category === categoryKey)
                            .map((t) => t.subcategory)
                        ),
                      ];

                      return (
                        <div key={categoryKey} className="space-y-4">
                          <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <span className="text-2xl">
                              {categoryData.icon}
                            </span>
                            {categoryData.displayName}
                          </h3>

                          {/* Mostra le tecnologie raggruppate per subcategoria */}
                          {subcategories.map((subcategory) => (
                            <div key={subcategory} className="ml-4">
                              <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                                <span>
                                  {subcategoryInfo[subcategory]?.icon}
                                </span>
                                {subcategory}
                              </h4>
                              <div className="grid md:grid-cols-2 gap-3">
                                {trends
                                  .filter(
                                    (t) =>
                                      t.category === categoryKey &&
                                      t.subcategory === subcategory
                                  )
                                  .map((trend) => (
                                    <button
                                      key={trend.id}
                                      onClick={() =>
                                        handleTrendSelection(trend.id)
                                      }
                                      disabled={
                                        !selectedTrends.includes(trend.id) &&
                                        selectedTrends.length >= 4
                                      }
                                      className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                                        selectedTrends.includes(trend.id)
                                          ? "border-transparent transform scale-105 shadow-lg"
                                          : selectedTrends.length >= 4
                                          ? "border-gray-200 opacity-50 cursor-not-allowed"
                                          : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                                      }`}
                                    >
                                      {selectedTrends.includes(trend.id) && (
                                        <div
                                          className={`absolute inset-0 bg-gradient-to-r ${trend.color} opacity-10 rounded-2xl`}
                                        ></div>
                                      )}
                                      <div className="relative flex items-center gap-3">
                                        <span className="text-2xl">
                                          {trend.icon}
                                        </span>
                                        <div className="flex-1">
                                          <span
                                            className={`block ${
                                              selectedTrends.includes(trend.id)
                                                ? "font-semibold"
                                                : ""
                                            }`}
                                          >
                                            {trend.name}
                                          </span>
                                          <span className="text-xs text-gray-500 mt-1">
                                            {trend.id}
                                          </span>
                                        </div>
                                        {selectedTrends.includes(trend.id) && (
                                          <Icons.Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        )}
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* ===== Sezione 3: Trend Details ===== */}
            {currentSection === 3 && selectedTrends.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                {(() => {
                  const currentTrend = trends.find(
                    (t) => t.id === selectedTrends[currentTrendIndex]
                  );

                  if (!currentTrend) return null; // safety check

                  const trendDetails =
                    formData.trendDetails[currentTrend.id] ?? {};

                  return (
                    <>
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-16 h-16 bg-gradient-to-r ${currentTrend.color} rounded-2xl flex items-center justify-center text-3xl`}
                            >
                              {currentTrend.icon}
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold">
                                {currentTrend.name}
                              </h2>
                              <p className="text-gray-600">
                                Trend {currentTrendIndex + 1} di{" "}
                                {selectedTrends.length}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {selectedTrends.map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  idx === currentTrendIndex
                                    ? "bg-blue-600 w-8"
                                    : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ===== Consapevolezza ===== */}
                      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Icons.Lightbulb className="w-5 h-5 text-blue-600" />
                          Consapevolezza
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quanto conosce questo trend tecnologico?
                            </label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() =>
                                    handleTrendDetailChange(
                                      currentTrend.id,
                                      "familiarita",
                                      level
                                    )
                                  }
                                  className={`flex-1 py-3 rounded-lg transition-all ${
                                    trendDetails.familiarita === level
                                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                                      : "bg-white border-2 border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Per nulla</span>
                              <span>Molto bene</span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <label className="flex items-center p-4 bg-white rounded-xl cursor-pointer hover:shadow-md transition-all">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={!!trendDetails.esempi}
                                onChange={(e) =>
                                  handleTrendDetailChange(
                                    currentTrend.id,
                                    "esempi",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="text-sm">
                                Conosco applicazioni concrete nel mio settore
                              </span>
                            </label>
                            <label className="flex items-center p-4 bg-white rounded-xl cursor-pointer hover:shadow-md transition-all">
                              <input
                                type="checkbox"
                                className="mr-3"
                                checked={!!trendDetails.aggiornamento}
                                onChange={(e) =>
                                  handleTrendDetailChange(
                                    currentTrend.id,
                                    "aggiornamento",
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="text-sm">
                                Mi sono aggiornato negli ultimi 12 mesi
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* ===== Interesse Strategico ===== */}
                      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Icons.TrendingUp className="w-5 h-5 text-green-600" />
                          Interesse Strategico
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quanto è rilevante questa tecnologia per la
                              competitività della sua azienda?
                            </label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() =>
                                    handleTrendDetailChange(
                                      currentTrend.id,
                                      "rilevanza",
                                      level
                                    )
                                  }
                                  className={`flex-1 py-3 rounded-lg transition-all ${
                                    trendDetails.rilevanza === level
                                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                                      : "bg-white border-2 border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Orizzonte di investimento
                              </label>
                              <select
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                                value={trendDetails.orizzonte || ""}
                                onChange={(e) =>
                                  handleTrendDetailChange(
                                    currentTrend.id,
                                    "orizzonte",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Seleziona...</option>
                                <option value="12mesi">Entro 12 mesi</option>
                                <option value="1-2anni">1-2 anni</option>
                                <option value="3-5anni">3-5 anni</option>
                                <option value="oltre5">Oltre 5 anni</option>
                                <option value="mai">Mai</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget previsto (24 mesi)
                              </label>
                              <select
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                                value={trendDetails.budget || ""}
                                onChange={(e) =>
                                  handleTrendDetailChange(
                                    currentTrend.id,
                                    "budget",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Seleziona...</option>
                                <option value="0">0 €</option>
                                <option value="<50k">Meno di 50.000 €</option>
                                <option value="50-200k">
                                  50.000 - 200.000 €
                                </option>
                                <option value=">200k">Oltre 200.000 €</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ===== Barriere (condizionale) ===== */}
                      {(trendDetails.rilevanza! >= 4 ||
                        ["12mesi", "1-2anni"].includes(
                          trendDetails.orizzonte || ""
                        )) && (
                        <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Icons.X className="w-5 h-5 text-orange-600" />
                            Barriere ed Esigenze
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Competenze interne disponibili
                              </label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <button
                                    key={level}
                                    onClick={() =>
                                      handleTrendDetailChange(
                                        currentTrend.id,
                                        "competenze",
                                        level
                                      )
                                    }
                                    className={`flex-1 py-2 rounded transition-all text-sm ${
                                      trendDetails.competenze === level
                                        ? "bg-orange-500 text-white"
                                        : "bg-white border border-gray-200"
                                    }`}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Difficoltà di finanziamento
                              </label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <button
                                    key={level}
                                    onClick={() =>
                                      handleTrendDetailChange(
                                        currentTrend.id,
                                        "funding",
                                        level
                                      )
                                    }
                                    className={`flex-1 py-2 rounded transition-all text-sm ${
                                      trendDetails.funding === level
                                        ? "bg-red-500 text-white"
                                        : "bg-white border border-gray-200"
                                    }`}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* ===== Sezione 4: Conclusione ===== */}
            {currentSection === 4 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                    <Icons.Check className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    Grazie per il tuo contributo!
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Le tue risposte sono preziose per costruire il futuro
                    dell'innovazione agroalimentare nel Lazio.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-8">
                  <h3 className="font-semibold mb-3">Prossimi passi</h3>
                  <ul className="text-left space-y-2 max-w-md mx-auto">
                    <li className="flex items-start gap-2">
                      <span>
                        Seguici su lazioinnova.it per partecipare ai focus group
                        e workshop di approfondimento
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Invio in corso..." : "Invia questionario"}
                  </button>

                  {submitError && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                      Errore: {submitError}
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                      ✅ Questionario inviato con successo!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== Navigazione tra sezioni ===== */}
            <div className="flex justify-between items-center mt-8">
              {/* Pulsante Indietro */}
              <button
                onClick={currentSection === 3 ? prevTrend : prevSection}
                disabled={currentSection === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                  currentSection === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:shadow-md hover:scale-105"
                }`}
              >
                <Icons.ChevronLeft className="w-5 h-5" />
                Indietro
              </button>

              {/* Indicatori di avanzamento */}
              <div className="flex gap-2">
                {sections.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentSection ? "bg-blue-600 w-8" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Pulsante Avanti (solo se NON sei all’ultima sezione) */}
              {currentSection < sections.length - 1 && (
                <button
                  onClick={currentSection === 3 ? nextTrend : nextSection}
                  disabled={
                    (currentSection === 1 &&
                      (!formData.dimensione ||
                        formData.segmento.length === 0)) ||
                    (currentSection === 2 && selectedTrends.length === 0)
                  }
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                    (currentSection === 1 &&
                      (!formData.dimensione ||
                        formData.segmento.length === 0)) ||
                    (currentSection === 2 && selectedTrends.length === 0)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-lg hover:scale-105"
                  }`}
                >
                  Avanti
                  <Icons.ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Aggiungi il Footer qui, sotto il contenuto del questionario */}
        <Footer />
      </div>
    </>
  );
};

export default AgriFoodQuestionario;
