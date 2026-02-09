import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";

interface FormData {
  jam_masuk: string;
  jam_pulang: string;
  lokasi_masuk: string;
  lokasi_pulang: string;
  status: string;
  verifikasi: string;
  keterangan: string;
}

export default function EditAbsen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FormData>({
    jam_masuk: "",
    jam_pulang: "",
    lokasi_masuk: "",
    lokasi_pulang: "",
    status: "hadir",
    verifikasi: "pending",
    keterangan: "",
  });

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const res = await api.get(`/absensi/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = res.data.data;

      setForm({
        jam_masuk: d.jam_masuk || "",
        jam_pulang: d.jam_pulang || "",
        lokasi_masuk: d.lokasi_masuk || "",
        lokasi_pulang: d.lokasi_pulang || "",
        status: d.status || "hadir",
        verifikasi: d.verifikasi || "pending",
        keterangan: d.keterangan || "",
      });

    } catch (err) {
      Swal.fire("Error", "Gagal load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ================= HANDLE INPUT =================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {};

    Object.keys(form).forEach((key) => {
        let value = (form as any)[key];

        // Hanya kirim field jika tidak kosong
        if (value !== "") {
        // Pastikan jam_masuk & jam_pulang sesuai format HH:MM
        if ((key === "jam_masuk" || key === "jam_pulang") && value.length === 8) {
            // Format "HH:MM:SS" → ambil HH:MM
            value = value.slice(0, 5);
        }
        payload[key] = value;
        }
    });

    try {
        await api.put(`/absensi/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire("Berhasil", "Absensi berhasil diperbarui", "success");
        navigate("/data-absen");
    } catch (err: any) {
        console.error(err.response?.data || err);
        Swal.fire("Gagal", "Update gagal", "error");
    }
    };



  if (loading) return <p>Loading...</p>;

  // ================= UI =================
  return (
    <>
      <PageMeta title="Edit Absen" description="Edit absensi pegawai" />

      <PageHeader
        pageTitle="Edit Absen"
        rightContent={
          <button
            onClick={() => navigate("/absen")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl"
          >
            ⬅ Back
          </button>
        }
      />

      <div className="space-y-5 mt-4">
        <ComponentCard title="Form Edit Absensi">
          <form onSubmit={handleSubmit} className="space-y-4">

            <Input label="Jam Masuk" name="jam_masuk" value={form.jam_masuk} onChange={handleChange} type="time" />
            <Input label="Jam Pulang" name="jam_pulang" value={form.jam_pulang} onChange={handleChange} type="time" />

            <Input label="Lokasi Masuk" name="lokasi_masuk" value={form.lokasi_masuk} onChange={handleChange} />
            <Input label="Lokasi Pulang" name="lokasi_pulang" value={form.lokasi_pulang} onChange={handleChange} />

            <Select label="Status" name="status" value={form.status} onChange={handleChange}
              options={["hadir","sakit","izin","cuti","dinas_luar","libur","alpha"]}
            />

            <Select label="Verifikasi" name="verifikasi" value={form.verifikasi} onChange={handleChange}
              options={["pending","disetujui","ditolak"]}
            />

            <div>
              <label>Keterangan</label>
              <textarea
                name="keterangan"
                value={form.keterangan}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">
              Simpan Perubahan
            </button>

          </form>
        </ComponentCard>
      </div>
    </>
  );
}


// ================= REUSABLE INPUT =================
function Input({ label, ...props }: any) {
  return (
    <div>
      <label>{label}</label>
      <input {...props} className="w-full p-2 border rounded" />
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div>
      <label>{label}</label>
      <select {...props} className="w-full p-2 border rounded">
        {options.map((o: string) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
