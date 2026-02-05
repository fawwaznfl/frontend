import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { LocalizationProvider, StaticTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";


export default function EditShift() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nama, setNama] = useState("");
  const [jamMasuk, setJamMasuk] = useState<any>(null);
  const [jamPulang, setJamPulang] = useState<any>(null);
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showJamMasuk, setShowJamMasuk] = useState(false);
  const [showJamPulang, setShowJamPulang] = useState(false);
  const [viewMasuk, setViewMasuk] = useState<"hours" | "minutes">("hours");
  const [viewPulang, setViewPulang] = useState<"hours" | "minutes">("hours");

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  // Fetch detail shift untuk edit
  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/shifts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = res.data.data;

      setNama(d.nama);
      setJamMasuk(d.jam_masuk ? dayjs(`2000-01-01 ${d.jam_masuk}`) : null);
      setJamPulang(d.jam_pulang ? dayjs(`2000-01-01 ${d.jam_pulang}`) : null);

      setCompanyId(d.company_id || "");
    } catch (err) {
      console.error("Error fetching shift:", err);
      Swal.fire("Error", "Data shift tidak ditemukan.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchDetail();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!nama || !jamMasuk || !jamPulang || !companyId) {
      Swal.fire("Gagal", "Semua field wajib diisi!", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/shifts/${id}`,
        {
          nama,
          jam_masuk: jamMasuk.format("HH:mm"),
          jam_pulang: jamPulang.format("HH:mm"),
          company_id: companyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Berhasil", "Shift berhasil diperbarui.", "success");
      navigate("/shift");
    } catch (err: any) {
      console.error("API Error:", err.response?.data);
      Swal.fire("Gagal", "Terjadi kesalahan saat mengedit shift.", "error");
    }
  };

  // USER INTERFACE
  return (
    <>
      <PageMeta title="Edit Shift" description="Edit Shift" />
      <PageHeader
        pageTitle="Edit Shift"
        titleClass="text-[32px] dark:text-white"
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="space-y-5 sm:space-y-6">
          <ComponentCard className="dark:bg-gray-800 dark:border-gray-700 p-6">

            {loading ? (
              <p className="text-gray-700 dark:text-gray-300">Loading...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Nama Shift */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium dark:text-white">
                    Nama Shift
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Shift Pagi"
                    className="border px-3 py-2 rounded-xl
                              dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Jam Masuk */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm font-medium dark:text-white">
                    Jam Masuk
                  </label>

                  <input
                    type="text"
                    readOnly
                    placeholder="Pilih jam masuk"
                    value={jamMasuk ? jamMasuk.format("HH:mm") : ""}
                    onClick={() => setShowJamMasuk(!showJamMasuk)}
                    className="border px-3 py-2 rounded-xl cursor-pointer
                              dark:bg-gray-700 dark:text-white"
                  />

                  {showJamMasuk && (
                    <div
                      className="absolute z-50 mt-2 bg-white dark:bg-gray-700
                                border rounded-2xl p-3 shadow-xl"
                    >
                      <StaticTimePicker
                        value={jamMasuk}
                        views={["hours", "minutes"]}
                        openTo="hours"
                        ampm={false}
                        minutesStep={5}
                        onChange={(val) => setJamMasuk(val)}
                        onAccept={() => setShowJamMasuk(false)}
                      />
                    </div>
                  )}
                </div>

                {/* Jam Pulang */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-sm font-medium dark:text-white">
                    Jam Pulang
                  </label>

                  <input
                    type="text"
                    readOnly
                    placeholder="Pilih jam pulang"
                    value={jamPulang ? jamPulang.format("HH:mm") : ""}
                    onClick={() => setShowJamPulang(!showJamPulang)}
                    className="border px-3 py-2 rounded-xl cursor-pointer
                              dark:bg-gray-700 dark:text-white"
                  />

                  {showJamPulang && (
                    <div
                      className="absolute z-50 mt-2 bg-white dark:bg-gray-700
                                border rounded-2xl p-3 shadow-xl"
                    >
                      <StaticTimePicker
                        value={jamPulang}
                        views={["hours", "minutes"]}
                        openTo="hours"
                        ampm={false}
                        minutesStep={5}
                        onChange={(val) => setJamPulang(val)}
                        onAccept={() => setShowJamPulang(false)}
                      />
                    </div>
                  )}
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium dark:text-white">
                    Company
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="border px-3 py-2 rounded-xl
                              dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Pilih Company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700
                              text-white px-6 py-2 rounded-xl"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/shift")}
                    className="bg-gray-500 hover:bg-gray-600
                              text-white px-6 py-2 rounded-xl"
                  >
                    Batal
                  </button>
                </div>

              </form>
            )}
          </ComponentCard>
        </div>
      </LocalizationProvider>
    </>
  );

}
