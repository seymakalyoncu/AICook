import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getChildPercentile, getMealRecommendation, getChildPrediction } from "../../services/mlEngine";

const ChildSuggestion = () => {
  const location = useLocation();
  const selectedChild = location.state?.selectedChild;

  const [percentile, setPercentile] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [prediction, setPrediction] = useState(null);  // Yeni state tahmin için

  const [loadingPercentile, setLoadingPercentile] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [loadingPrediction, setLoadingPrediction] = useState(false);  // Tahmin yükleniyor durumu

  const [errorPercentile, setErrorPercentile] = useState(null);
  const [errorRecommendation, setErrorRecommendation] = useState(null);
  const [errorPrediction, setErrorPrediction] = useState(null);  // Tahmin hatası

  useEffect(() => {
    if (!selectedChild) return;

    const token = localStorage.getItem("token");

    const fetchPercentile = async () => {
      setLoadingPercentile(true);
      setErrorPercentile(null);

      try {
        const res = await getChildPercentile(selectedChild.id, token);
        setPercentile(res.data);
      } catch (err) {
        setErrorPercentile(
          err.response?.data?.error ||
          err.message ||
          "Percentile verisi alınırken hata oluştu."
        );
      } finally {
        setLoadingPercentile(false);
      }
    };

    const fetchRecommendation = async () => {
      setLoadingRecommendation(true);
      setErrorRecommendation(null);

      try {
        const res = await getMealRecommendation(selectedChild.id, token);
        setRecommendation(res.data.recommendation || res.data);
      } catch (err) {
        setErrorRecommendation(
          err.response?.data?.error ||
          err.message ||
          "Öneri verisi alınırken hata oluştu."
        );
      } finally {
        setLoadingRecommendation(false);
      }
    };

const fetchPrediction = async () => {
  setLoadingPrediction(true);
  setErrorPrediction(null);

  try {
    const res = await getChildPrediction(selectedChild.id, token);
    const data = res.data.result || res.data;

    if (typeof data === "object" && data !== null) {
      setPrediction(data);
    } else {
      setPrediction(null);
      setErrorPrediction("Tahmin verisi beklenen formatta değil.");
    }
  } catch (err) {
    setErrorPrediction(
      err.response?.data?.error ||
      err.message ||
      "Tahmin verisi alınırken hata oluştu."
    );
  } finally {
    setLoadingPrediction(false);
  }
};

    fetchPercentile();
    fetchRecommendation();
    fetchPrediction();  // Tahmin verisini çağır

  }, [selectedChild]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-700 flex flex-col px-6 py-8">
      {/* Header */}
      <header className="w-full text-center mb-6">
        <h1 className="text-2xl font-semibold text-[#8B5E3C]">
          Değerlendirme, Tahminleme ve Yapay Zeka Destekli Öneriler   
        </h1>
        <br/>
        <p className="text-2xl font-semibold text-[#8B5E3C]">
          {selectedChild.name} {selectedChild.surname}
        </p>
      </header>

      {/* Ana içerik: 3 kutu yan yana, responsive */}
      <main className="flex flex-col md:flex-row gap-6 justify-center items-start mb-12">
        {/* Percentile Bilgileri */}
        <section className="flex-1 bg-[#FFF176] rounded-lg p-6 shadow-md min-w-[280px]">
          <h2 className="text-xl font-semibold mb-4 text-[#D95F45]  text-center">
            Değerlendirme
          </h2>

          {loadingPercentile && (
            <p className="text-[#D95F45] font-medium text-lg">Yükleniyor...</p>
          )}

          {errorPercentile && <p className="text-red-600 font-semibold">{errorPercentile}</p>}

          {!loadingPercentile && !errorPercentile && percentile && (
            <div className="text-[#D95F45] text-base space-y-3">
              <p>
                <strong>Boy Persentil Sonucu:</strong> {percentile.height_percentile}
              </p>
              <p>
                <strong>Kilo Persentil Sonucu:</strong> {percentile.weight_percentile}
              </p>
            </div>
          )}
        </section>

        {/* Tahminleme */}
        <section className="flex-1 bg-[#FFB74D] rounded-lg p-6 shadow-md min-w-[280px]">
          <h2 className="text-[#8B5E3C] text-xl font-semibold mb-4 text-center">Tahminleme</h2>

          {loadingPrediction && (
            <p className="text-[#8B5E3C] font-medium text-lg">Tahmin yükleniyor...</p>
          )}

          {errorPrediction && (
            <p className="text-red-700 font-semibold">{errorPrediction}</p>
          )}

          {!loadingPrediction && !errorPrediction && prediction && (
            <div className="text-[#8B5E3C] text-base space-y-3">
              <p><strong>Tahmin Edilen Yazma Tarihi:</strong> {prediction.predicted_date || "Veri yok"}</p>
              <p><strong>Gerçek Yazma Tarihi:</strong> {prediction.real_date || "Henüz bu beceri kazanılmadı."}</p>
            </div>
          )}

          {!loadingPrediction && !errorPrediction && !prediction && (
            <p>Tahmin verisi bulunamadı.</p>
          )}
        </section>

        {/* Öneriler */}
        <section className="flex-1 bg-[#FF6600] rounded-lg p-6 shadow-md min-w-[280px] text-white">
          <h2 className="text-xl font-semibold mb-4  text-center">Öneri</h2>

          {loadingRecommendation && (
            <p className="text-orange-200 font-medium text-lg">Öneri yükleniyor...</p>
          )}

          {errorRecommendation && (
            <p className="text-yellow-200 font-semibold">{errorRecommendation}</p>
          )}

          {!loadingRecommendation && !errorRecommendation && recommendation && (
            <p>{recommendation}</p>
          )}

          {!loadingRecommendation && !errorRecommendation && !recommendation && (
            <p>Öneri verisi bulunamadı.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ChildSuggestion;
