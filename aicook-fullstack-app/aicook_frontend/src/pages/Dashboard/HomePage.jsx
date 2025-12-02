import { useEffect, useState } from "react";
import WeatherWidget from "../../components/WeatherWidget";
import { userInfo } from "../../services/accounts";
import { getParentById } from "../../services/parents";
import { getBabySitterById } from "../../services/babysitters";
import { getChildrenByParent } from "../../services/children";

export default function HomePage() {
  const [parentData, setParentData] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateChildStats = (birthDay, birthMonth, birthYear) => {
    if (!birthDay || !birthMonth || !birthYear) {
      return { months: "Bilinmiyor", daysUntilBirthday: "Bilinmiyor" };
    }

    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const today = new Date();

    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months += today.getMonth() - birthDate.getMonth();
    if (today.getDate() < birthDate.getDate()) months--;

    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const diffTime = nextBirthday - today;
    const daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { months, daysUntilBirthday };
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await userInfo(token);

      if (response.data.parent_id !== undefined) {
        localStorage.setItem("userType", "SuperUser");
        localStorage.setItem("parent_id", response.data.parent_id);
      }

      if (response.data.babysitter_id !== undefined) {
        localStorage.setItem("userType", "Staff");
        localStorage.setItem("babysitter_id", response.data.babysitter_id);
      }

      const userType = localStorage.getItem("userType");

      try {
        if (userType === "SuperUser") {
          const parentId = localStorage.getItem("parent_id");
          const res = await getParentById(parentId, token);
          setParentData(res.data);

          const children = await getChildrenByParent(parentId, token);
          setChildrenData(children.data);
        } else if (userType === "Staff") {
          const babysitterId = localStorage.getItem("babysitter_id");
          const bsRes = await getBabySitterById(babysitterId, token);
          const parentId = bsRes.data.parent;

          const parentRes = await getParentById(parentId, token);
          setParentData(parentRes.data);

          const children = await getChildrenByParent(parentId, token);
          setChildrenData(children.data);
        } else {
          setError("Kullanıcı tipi tanımlı değil.");
        }
      } catch (err) {
        console.error(err);
        setError("Veri alınırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-background text-bodyText font-sans px-8 py-12">
      {/* Eğer çocuk yoksa hoş geldiniz mesajı */}
      {childrenData.length === 0 && (
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[24px] font-semibold mb-4 tracking-wide">Hoş Geldiniz...</h1>
          <p className="text-[16px] font-light text-helperText">
            Çocuk verileri, gelişim raporları ve daha fazlası gibi özelliklere erişmek için lütfen veri girişi yapınız.
          </p>
        </div>
      )}

      {/* Eğer çocuk varsa çocuk bilgileri göster */}
      {childrenData.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-4">
          {childrenData.map((child) => {
            const { months, daysUntilBirthday } = calculateChildStats(
              child.birth_day,
              child.birth_month,
              child.birth_year
            );
            return (
              <div key={child.id} className="p-4 rounded-xl shadow bg-white border border-gray-200">
                <h2 className="text-lg font-bold">{child.name}</h2>
                <p>👶 {months} aylık</p>
                <p className={daysUntilBirthday < 7 ? "text-red-600 font-medium" : ""}>
                  🎂 Doğum gününe {daysUntilBirthday} gün kaldı
                </p>
              </div>
            );
          })}
        </div>
      )}

      {parentData?.city_name && (
        <div className="absolute bottom-6 right-6">
          <WeatherWidget city={parentData.city_name} />
        </div>
      )}
    </div>
  );
}
