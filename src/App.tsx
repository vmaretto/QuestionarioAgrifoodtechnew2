import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { questionnaireAPI } from "./api/questionnaire";

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

type TrendDetails = {
  [trendId: string]: TrendDetail;
};

const [formData, setFormData] = useState<{
  dimensione: string;
  segmento: string[];
  export: string;
  digitalizzazione: string;
  budget: string;
  collaborazioni: string;
  trends: string[];
  trendDetails: TrendDetails;
}>({
  dimensione: "",
  segmento: [],
  export: "",
  digitalizzazione: "",
  budget: "",
  collaborazioni: "",
  trends: [],
  trendDetails: {},
});

const AgriFoodQuestionario = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    dimensione: "",
    segmento: [],
    export: "",
    digitalizzazione: "",
    budget: "",
    collaborazioni: "",
    trends: [],
    trendDetails: {},
  });
  const [selectedTrends, setSelectedTrends] = useState([]);
  const [currentTrendIndex, setCurrentTrendIndex] = useState(0);
  const [animateCard, setAnimateCard] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const trends = [
    {
      id: "automazione",
      name: "Automazione e robotica industriale",
      category: "trasformazione",
      icon: "🤖",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "ai-processi",
      name: "AI per processi produttivi",
      category: "trasformazione",
      icon: "🧠",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "biotech",
      name: "Biotecnologie e fermentazione",
      category: "trasformazione",
      icon: "🧬",
      color: "from-green-500 to-teal-600",
    },
    {
      id: "conservazione",
      name: "Tecnologie di conservazione",
      category: "trasformazione",
      icon: "❄️",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "packaging",
      name: "Packaging sostenibile",
      category: "trasformazione",
      icon: "📦",
      color: "from-emerald-500 to-green-600",
    },
    {
      id: "smart-retail",
      name: "Smart retail",
      category: "distribuzione",
      icon: "🏪",
      color: "from-orange-500 to-red-600",
    },
    {
      id: "ecommerce",
      name: "E-commerce avanzato",
      category: "distribuzione",
      icon: "💻",
      color: "from-indigo-500 to-purple-600",
    },
    {
      id: "blockchain",
      name: "Tracciabilità blockchain",
      category: "distribuzione",
      icon: "🔗",
      color: "from-slate-500 to-gray-600",
    },
    {
      id: "crm",
      name: "CRM e personalizzazione",
      category: "distribuzione",
      icon: "🎯",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: "ai-logistica",
      name: "AI per logistica",
      category: "logistica",
      icon: "🚚",
      color: "from-yellow-500 to-orange-600",
    },
    {
      id: "cold-chain",
      name: "Cold chain 4.0",
      category: "logistica",
      icon: "🌡️",
      color: "from-blue-400 to-cyan-600",
    },
    {
      id: "automazione-log",
      name: "Automazione logistica",
      category: "logistica",
      icon: "🏭",
      color: "from-gray-500 to-slate-600",
    },
    {
      id: "quick-commerce",
      name: "Quick commerce",
      category: "logistica",
      icon: "⚡",
      color: "from-amber-500 to-yellow-600",
    },
  ];

  const sections = [
    { title: "Benvenuto", subtitle: "Innovazione AgriFoodTech Lazio" },
    { title: "Profilo Aziendale", subtitle: "Conosciamoci meglio" },
    { title: "Trend Tecnologici", subtitle: "Seleziona le tue priorità" },
    { title: "Approfondimento", subtitle: "Dettagli sui trend selezionati" },
    { title: "Conclusione", subtitle: "Grazie per la partecipazione" },
  ];

  useEffect(() => {
    setAnimateCard(true);
    const timer = setTimeout(() => setAnimateCard(false), 300);
    return () => clearTimeout(timer);
  }, [currentSection, currentTrendIndex]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
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
    field: string,
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

  const handleSubmit = async () => {
    console.log("handleSubmit chiamato"); // PER DEBUG
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const emailInput = document.querySelector('input[type="email"]');
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
    } catch (error) {
      setSubmitError(error.message);
      console.error("Errore invio:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Progress Bar Creativa */}
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
              AgriFoodTech Assessment
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
          {/* Section 0: Welcome */}
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
                  settore.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl">
                  <Icons.Clock className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">15 minuti</h3>
                  <p className="text-sm text-gray-600">
                    Tempo stimato di compilazione
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <Icons.Globe className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Report personalizzato</h3>
                  <p className="text-sm text-gray-600">
                    Confronta i tuoi dati con il mercato
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                  <Icons.TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Impatto concreto</h3>
                  <p className="text-sm text-gray-600">
                    Contribuisci alle policy regionali
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 1: Company Profile */}
          {currentSection === 1 && (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Profilo Aziendale</h2>

              {/* Dimensione */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dimensione aziendale
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Fino a 9", "10-49", "50-249", "Oltre 250"].map((size) => (
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
                  ))}
                </div>
              </div>

              {/* Segmento */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Segmento della filiera (multi-selezione)
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: "produzione",
                      label: "Produzione primaria/agricola",
                      icon: "🌾",
                    },
                    {
                      id: "trasformazione",
                      label: "Trasformazione alimentare",
                      icon: "🏭",
                    },
                    {
                      id: "packaging",
                      label: "Packaging e confezionamento",
                      icon: "📦",
                    },
                    {
                      id: "logistica",
                      label: "Logistica e trasporto",
                      icon: "🚚",
                    },
                    {
                      id: "distribuzione",
                      label: "Distribuzione e vendita",
                      icon: "🛒",
                    },
                  ].map((segment) => (
                    <label
                      key={segment.id}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.segmento.includes(segment.id)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.segmento.includes(segment.id)}
                        onChange={() =>
                          handleMultiSelect("segmento", segment.id)
                        }
                      />
                      <span className="text-2xl mr-3">{segment.icon}</span>
                      <span className="flex-1">{segment.label}</span>
                      {formData.segmento.includes(segment.id) && (
                        <Icons.Check className="w-5 h-5 text-green-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Export */}
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

              {/* Digitalizzazione */}
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
                      ].map((level, idx) => (
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

          {/* Section 2: Trend Selection */}
          {currentSection === 2 && (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Seleziona i Trend Tecnologici
                </h2>
                <p className="text-gray-600">
                  Scegli fino a 4 trend più rilevanti per la tua impresa nei
                  prossimi 2-3 anni
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

              <div className="space-y-4">
                {["trasformazione", "distribuzione", "logistica"].map(
                  (category) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {category === "trasformazione" && "🔧 Trasformazione"}
                        {category === "distribuzione" && "🛍️ Distribuzione"}
                        {category === "logistica" && "📍 Logistica"}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {trends
                          .filter((t) => t.category === category)
                          .map((trend) => (
                            <button
                              key={trend.id}
                              onClick={() => handleTrendSelection(trend.id)}
                              disabled={
                                !selectedTrends.includes(trend.id) &&
                                selectedTrends.length >= 4
                              }
                              className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                                selectedTrends.includes(trend.id)
                                  ? "border-transparent transform scale-105"
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
                                <span className="text-2xl">{trend.icon}</span>
                                <span
                                  className={`flex-1 ${
                                    selectedTrends.includes(trend.id)
                                      ? "font-semibold"
                                      : ""
                                  }`}
                                >
                                  {trend.name}
                                </span>
                                {selectedTrends.includes(trend.id) && (
                                  <Icons.Check className="w-5 h-5 text-green-600" />
                                )}
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Section 3: Trend Details */}
          {currentSection === 3 && selectedTrends.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {(() => {
                const currentTrend = trends.find(
                  (t) => t.id === selectedTrends[currentTrendIndex]
                );
                if (!currentTrend) return null;
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
                              {currentTrend?.name}
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

                    {/* Consapevolezza */}
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
                                  formData.trendDetails[currentTrend?.id]
                                    ?.familiarita === level
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
                              checked={
                                formData.trendDetails[currentTrend?.id]
                                  ?.esempi || false
                              }
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
                              checked={
                                formData.trendDetails[currentTrend?.id]
                                  ?.aggiornamento || false
                              }
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

                    {/* Interesse */}
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
                                  formData.trendDetails[currentTrend?.id]
                                    ?.rilevanza === level
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
                              value={
                                formData.trendDetails[currentTrend?.id]
                                  ?.orizzonte || ""
                              }
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
                              value={
                                formData.trendDetails[currentTrend?.id]
                                  ?.budget || ""
                              }
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

                    {/* Barriere (shown only if rilevanza >= 4 or orizzonte <= 2 anni) */}
                    {(formData.trendDetails[currentTrend?.id]?.rilevanza >= 4 ||
                      ["12mesi", "1-2anni"].includes(
                        formData.trendDetails[currentTrend?.id]?.orizzonte
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
                                    formData.trendDetails[currentTrend?.id]
                                      ?.competenze === level
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
                                    formData.trendDetails[currentTrend?.id]
                                      ?.funding === level
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

          {/* Section 4: Conclusion */}
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
                    <Icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>
                      Riceverai il report personalizzato entro 30 giorni
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>
                      Potrai partecipare ai focus group di approfondimento
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <span>
                      Sarai invitato al workshop di co-design delle soluzioni
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email per ricevere il report
                  </label>
                  <input
                    type="email"
                    placeholder="tuaemail@azienda.it"
                    className="w-full max-w-md mx-auto block p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
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
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
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

          <button
            onClick={currentSection === 3 ? nextTrend : nextSection}
            disabled={
              (currentSection === 1 &&
                (!formData.dimensione || formData.segmento.length === 0)) ||
              (currentSection === 2 && selectedTrends.length === 0)
            }
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              (currentSection === 1 &&
                (!formData.dimensione || formData.segmento.length === 0)) ||
              (currentSection === 2 && selectedTrends.length === 0)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            {currentSection === 4 ? "Invia" : "Avanti"}
            <Icons.ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default AgriFoodQuestionario;
