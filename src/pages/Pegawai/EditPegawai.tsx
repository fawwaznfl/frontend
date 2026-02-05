import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageHeader from "../../PageHeader";
import ComponentCard from "../../components/common/ComponentCard";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Label from "../../components/form/Label";
import DatePicker from "../../components/form/date-picker";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";

interface PegawaiForm {
  name: string;
  username: string;
  email: string;
  telepon: string;
  tgl_lahir: string | null;
  masa_berlaku: string | null;
  gender: string | null;
  divisi_id: number | null;
  lokasi_id: number | null;
  role_id: number | null;
  dashboard_type: string;
  status: string | null;
  company_id: number | null;
  tgl_join: string;
  status_nikah: string; 
  status_pajak: string; 
  ktp: string;
  terlambat: string;
  kartu_keluarga: string;
  bpjs_kesehatan: string;
  bpjs_ketenagakerjaan: string;
  npwp: string;
  sim: string;
  izin: string;
  mangkir: string;
  tunjangan_bpjs_kesehatan: string;
  potongan_bpjs_kesehatan: string;
  potongan_bpjs_ketenagakerjaan: string;
  tunjangan_pajak: string;
  tunjangan_bpjs_ketenagakerjaan: string;
  saldo_kasbon: string;
  izin_cuti: string;
  izin_telat: string;
  izin_pulang_cepat: string;
  izin_lainnya: string;
  no_pkwt: string;
  no_kontrak: string;
  tanggal_mulai_pwkt: string;
  tanggal_berakhir_pwkt: string;
  rekening: string;
  nama_rekening: string;
  alamat: string;
  gaji_pokok: string;
  makan_transport: string;
  lembur: string;
  kehadiran: string;
  thr: string;
  bonus_pribadi: string;
  bonus_team: string;
  bonus_jackpot: string;
  kasbon_periode: "bulan" | "tahun";
  terlambat_satuan: "hari" | "jam" | "menit";

  
}

export default function EditPegawai() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [companies, setCompanies] = useState<any[]>([]);
  const [lokasis, setLokasis] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [divisis, setDivisis] = useState<any[]>([]);
  const isSuperadmin = user?.dashboard_type === "superadmin";
  const isAdmin = user?.dashboard_type === "admin";

  const [periodeGaji, setPeriodeGaji] = useState<"hari" | "bulan">("bulan");
  const satuanText = periodeGaji === "hari" ? "/hari" : "/bulan";
  type SatuanGaji = "bulan" | "hari" | "jam" | "menit";

  const [satuanGaji, setSatuanGaji] = useState<SatuanGaji>("bulan");
  const satuanLabel = "/" + satuanGaji;
  type SatuanKasbon = "bulan" | "tahun";
  const [satuanKasbon, setSatuanKasbon] = useState<SatuanKasbon>("bulan");

  const [formData, setFormData] = useState<PegawaiForm>({
    name: "",
    username: "",
    email: "",
    telepon: "",
    tgl_lahir: null,
    masa_berlaku: null,
    gender: null,
    divisi_id: null,
    lokasi_id: null,
    role_id: null,
    dashboard_type: "",
    status: "",
    company_id: null,
    tgl_join: "",
    kasbon_periode: "bulan",
    status_nikah: "", 
    status_pajak: "",
    ktp: "",
    mangkir: "",
    tunjangan_bpjs_kesehatan: "",
    potongan_bpjs_kesehatan: "",
    potongan_bpjs_ketenagakerjaan: "",
    tunjangan_pajak: "",
    tunjangan_bpjs_ketenagakerjaan: "",
    saldo_kasbon: "",
    kartu_keluarga: "",
    bpjs_kesehatan: "",
    bpjs_ketenagakerjaan: "",
    npwp: "",
    sim: "",
    izin: "",
    izin_cuti: "",
    izin_telat: "",
    terlambat: "",
    izin_pulang_cepat: "",
    izin_lainnya: "",
    no_pkwt: "",
    no_kontrak: "",
    tanggal_mulai_pwkt: "",
    tanggal_berakhir_pwkt: "",
    rekening: "",
    nama_rekening: "",
    alamat: "",
    gaji_pokok: "",
    makan_transport: "",
    lembur: "",
    kehadiran: "",
    thr: "",
    bonus_pribadi: "",
    bonus_team: "",
    bonus_jackpot: "",
    terlambat_satuan: "hari",
  });

  // FETCH COMPANY / LOKASI / ROLE
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data.data || res.data);
    } catch (err) {}
  };

  const fetchLokasis = async (company_id?: number) => {
    try {
      const token = localStorage.getItem("token");

      if (user?.dashboard_type === "admin") {
        const res = await api.get(`/lokasis?company_id=${user.company_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLokasis(res.data.data || res.data);
        return;
      }

      if (company_id) {
        const res = await api.get(`/lokasis?company_id=${company_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLokasis(res.data.data || res.data);
        return;
      }

      setLokasis([]);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchRoles = async (company_id?: number) => {
    try {
      const token = localStorage.getItem("token");

      // KALAU ADMIN DI AMBIL BERDASARKAN COMPANY USER
      if (user?.dashboard_type === "admin") {
        const res = await api.get(`/roles?company_id=${user.company_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRoles(res.data.data || res.data);
        return;
      }

      // KALAU SUPERADMIN DI AMBIL BERDASARKAN USER YANG LOGIN 
      if (company_id) {
        const res = await api.get(`/roles?company_id=${company_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRoles(res.data.data || res.data);
        return;
      }

      const res = await api.get(`/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data.data || res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchDivisis = async (company_id?: number) => {
    try {
      const token = localStorage.getItem("token");

      if (user?.dashboard_type === "admin") {
        const res = await api.get(`/divisis?company_id=${user.company_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDivisis(res.data.data || res.data);
        return;
      }

      if (company_id) {
        const res = await api.get(`/divisis?company_id=${company_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDivisis(res.data.data || res.data);
        return;
      }

      const res = await api.get("/divisis", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDivisis(res.data.data || res.data);

    } catch (err) {}
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (["divisi_id", "lokasi_id", "role_id", "company_id"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // UPLOAD FOTO
  const handleFotoChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // FETCH DETAIL PEGAWAI
  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/pegawais/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      if (data.company_id) {
        await fetchRoles(data.company_id);
        await fetchDivisis(data.company_id);
        await fetchLokasis(data.company_id);
      }

      // SET FORM DATA
      setFormData({
        name: data.name ?? "",
        username: data.username ?? "",
        email: data.email ?? "",
        telepon: data.telepon ?? "",
        tgl_lahir: data.tgl_lahir ?? null,
        masa_berlaku: data.masa_berlaku ?? null,
        gender: data.gender ?? null,
        divisi_id: data.divisi_id ?? null,
        lokasi_id: data.lokasi_id ?? null,
        role_id: data.role_id ?? null,
        dashboard_type: data.dashboard_type ?? "",
        status: data.status ?? "",
        company_id: data.company_id ?? null,
        tgl_join: data.tgl_join ?? "",
        status_nikah: data.status_nikah ?? "",
        status_pajak: data.status_pajak ?? "",
        kasbon_periode: data.kasbon_periode ?? "bulan",
        ktp: data.ktp ?? "",
        mangkir: data.mangkir ?? "",
        tunjangan_bpjs_kesehatan: data.tunjangan_bpjs_kesehatan ?? "",
        potongan_bpjs_kesehatan: data.potongan_bpjs_kesehatan ?? "",
        potongan_bpjs_ketenagakerjaan: data.potongan_bpjs_ketenagakerjaan ?? "",
        tunjangan_pajak: data.tunjangan_pajak ?? "",
        tunjangan_bpjs_ketenagakerjaan: data.tunjangan_bpjs_ketenagakerjaan ?? "",
        saldo_kasbon: data.saldo_kasbon ?? "",
        kartu_keluarga: data.kartu_keluarga ?? "",
        terlambat: data.terlambat ?? "",
        bpjs_kesehatan: data.bpjs_kesehatan ?? "",
        bpjs_ketenagakerjaan: data.bpjs_ketenagakerjaan ?? "",
        npwp: data.npwp ?? "",
        sim: data.sim ?? "",
        izin: data.izin ?? "",
        izin_cuti: data.izin_cuti ?? "",
        izin_telat: data.izin_telat ?? "",
        izin_pulang_cepat: data.izin_pulang_cepat ?? "",
        izin_lainnya: data.izin_lainnya ?? "",
        no_pkwt: data.no_pkwt ?? "",
        no_kontrak: data.no_kontrak ?? "",
        tanggal_mulai_pwkt: data.tanggal_mulai_pwkt ?? "",
        tanggal_berakhir_pwkt: data.tanggal_berakhir_pwkt ?? "",
        rekening: data.rekening ?? "",
        nama_rekening: data.nama_rekening ?? "",
        alamat: data.alamat ?? "",
        gaji_pokok: data.gaji_pokok ?? "",
        makan_transport: data.makan_transport ?? "",
        lembur: data.lembur ?? "",
        kehadiran: data.kehadiran ?? "",
        thr: data.thr ?? "",
        bonus_pribadi: data.bonus_pribadi ?? "",
        bonus_team: data.bonus_team ?? "",
        bonus_jackpot: data.bonus_jackpot ?? "",
        terlambat_satuan: data.terlambat_satuan ?? "hari",
      });

      // FOTO PREVIEW
      if (data.foto_karyawan) {
        setFotoPreview(`${import.meta.env.VITE_STORAGE_URL}/${data.foto_karyawan}`);
      }

    } catch (err) {
      Swal.fire("Error", "Gagal memuat data pegawai", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchDetail();
  }, []);

    const formatRupiah = (value: string) => {
    const numberString = value.replace(/\D/g, "");
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Number(numberString));

    return formatted.replace(",00", ""); 
  };

  const handleGajiPokokChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      gaji_pokok: raw,
    }));
  };

  const handleIzinChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      izin: raw,
    }));
  };

  const handleTerlambatChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      terlambat: raw,
    }));
  };

  const handleMangkirChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setFormData((prev) => ({
      ...prev,
      mangkir: raw,
    }));
  };

  const handleBPJSKesehatanChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setFormData((prev) => ({
      ...prev,
      tunjangan_bpjs_kesehatan: raw,
    }));
  };

  const handlePotonganBPJSKesehatanChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setFormData((prev) => ({
      ...prev,
      potongan_bpjs_kesehatan: raw,
    }));
  };

  const handlePotonganBPJSKetenagakerjaanChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setFormData((prev) => ({
      ...prev,
      potongan_bpjs_ketenagakerjaan: raw,
    }));
  };

  const handleBPJSKetenagakerjaanChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setFormData((prev) => ({
      ...prev,
      tunjangan_bpjs_ketenagakerjaan: raw,
    }));
  };

  const handleTunjanganPajakChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setFormData((prev) => ({
      ...prev,
      tunjangan_pajak: raw,
    }));
  };

  const handleSaldoKasbonChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setFormData((prev) => ({
      ...prev,
      saldo_kasbon: raw,
    }));
  };

  const handleKehadiranChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      kehadiran: raw,
    }));
  };

  const handleThrChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      thr: raw,
    }));
  };

  const handleBonusJackpotChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      bonus_jackpot: raw,
    }));
  };
  
  const handleBonusTeamChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      bonus_team: raw,
    }));
  };

  const handleBonusPribadiChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      bonus_pribadi: raw,
    }));
  };

  const handleMakanTransportChange = (e: any) => {
  const raw = e.target.value.replace(/\D/g, "");
  setFormData((prev) => ({
    ...prev,
    makan_transport: raw,
  }));
};

  const handleLemburChange = (e: any) => {
  const raw = e.target.value.replace(/\D/g, "");
  setFormData((prev) => ({
    ...prev,
    lembur: raw,
  }));
};

  // SUBMIT FORM
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const body = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          body.append(key, String(value));
        }
      });


      if (fotoFile) {
        body.append("foto_karyawan", fotoFile);
      }

      await api.post(`/pegawais/${id}?_method=PUT`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Sukses", "Data pegawai berhasil diperbarui", "success");
      navigate("/pegawai");

    } catch (err: any) {
      if (err.response?.status === 422) {
        Swal.fire(
          "Validasi Gagal",
          JSON.stringify(err.response.data.errors, null, 2),
          "error"
        );
      } else {
        Swal.fire("Error", "Gagal menyimpan perubahan", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!formData.company_id) {
      setLokasis([]);
      setFormData((prev) => ({ ...prev, lokasi_id: null }));
      return;
    }

    fetchRoles(formData.company_id);
    fetchDivisis(formData.company_id);
    fetchLokasis(formData.company_id);

  }, [formData.company_id]);


  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: ["divisi_id", "lokasi_id", "role_id", "company_id"].includes(name)
        ? (value === "" ? null : Number(value))
        : value,
    }));
  };

  useEffect(() => {
  if (roles.length > 0 && formData.role_id !== null) {
    const exist = roles.some((r) => r.id == formData.role_id);

    if (!exist) return; 

    setFormData((prev) => ({
      ...prev,
      role_id: Number(prev.role_id),
    }));
  }
}, [roles]);

  // User interface
  return (
    <>
      <PageMeta title="Edit Pegawai" description="Form edit data pegawai" />
      <PageHeader
        pageTitle="Edit Pegawai"
        titleClass="text-[32px] dark:text-white"
        rightContent={
          <button
            onClick={() => navigate("/pegawai")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl"
          >
            ⬅ Back
          </button>
        }
      />

      <div className="space-y-6 mt-4">
        {loading ? (
          <ComponentCard><p>Loading...</p></ComponentCard>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ================= INFORMATION ================= */}
            <ComponentCard 
            title="Informasi Akun"
            titleClass="text-xl font-bold text-blue-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <Label>Nama Lengkap</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div>
                  <Label>Foto Pegawai</Label>
                  <label
                    className="mt-1 flex flex-col items-center justify-center w-full h-10 border-2 border-dashed 
                      rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700
                      border-gray-300 dark:border-gray-600 transition"
                  >
                    {fotoPreview ? (
                      <img
                        src={fotoPreview}
                        className="w-10 h-10 object-cover rounded-xl shadow-md"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                        <p className="text-sm font-medium">Upload Foto</p>
                        <p className="text-xs">Klik untuk memilih</p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <Label>Username</Label>
                  <Input name="username" value={formData.username} onChange={handleChange} />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div>
                  <Label>Nomor Telepon</Label>
                  <Input
                    type="number"
                    name="telepon"
                    value={formData.telepon}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan Nomor Telepon"
                  />
                </div>

                <div>
                  <Label>Tanggal Lahir</Label>
                  <DatePicker
                    id="tgl_lahir"
                    selected={formData.tgl_lahir ? new Date(formData.tgl_lahir) : undefined}
                    onChange={(val: string) =>
                      setFormData((prev) => ({ ...prev, tgl_lahir: val }))
                    }

                  />
                </div>

                <div>
                  <Label>Gender</Label>
                  <Select
                    options={[
                      { value: "laki_laki", label: "Laki-laki" },
                      { value: "perempuan", label: "Perempuan" },
                    ]}
                    value={formData.gender ?? ""}
                    onChange={(val: string) => handleSelectChange("gender", val)}
                  />
                </div>

                  <div>
                  <Label>Perusahaan</Label>

                  <select
                    name="company_id"
                    value={formData.company_id ?? ""}
                    onChange={handleChange}
                    disabled={isAdmin}
                    className={`
                      w-full px-3 py-2 rounded-xl border
                      dark:bg-gray-800 dark:border-gray-600 dark:text-white
                      ${isAdmin ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
                    `}
                  >
                    <option value="">
                      {isAdmin
                        ? "Company -"
                        : "Pilih Perusahaan"}
                    </option>

                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {isAdmin && formData.company_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      Company ditentukan oleh Superadmin
                    </p>
                  )}
                </div>

                <div>
                  <Label>Role</Label>
                  <select
                    name="role_id"
                    value={formData.role_id ?? ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Pilih Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Lokasi Kantor</Label>
                 <select
                    name="lokasi_id"
                    value={formData.lokasi_id ?? ""}
                    onChange={handleChange}
                    disabled={user?.dashboard_type === "superadmin" && !formData.company_id}
                    className="w-full px-3 py-2 rounded-xl border
                      disabled:bg-gray-100 disabled:text-gray-400
                      dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">
                      {user?.dashboard_type === "superadmin" && !formData.company_id
                        ? "Pilih perusahaan dulu"
                        : "Pilih Lokasi"}
                    </option>

                    {lokasis.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.nama_lokasi}
                      </option>
                    ))}
                  </select>

                </div>
                <div>
                  <Label>Tanggal Masuk Perusahaan</Label>
                  <DatePicker
                    id="tgl_join"
                    selected={formData.tgl_join ? new Date(formData.tgl_join) : undefined}
                    onChange={(val: string) =>
                    setFormData((prev) => ({ ...prev, tgl_join: val }))
                  }
                  />
                </div>

                <div>
                  <Label>Status Pernikahan</Label>
                  <select
                    name="status_nikah"
                    value={formData.status_nikah ?? ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Pilih Status Nikah</option>
                    <option value="menikah">Menikah</option>
                    <option value="belum_menikah">Belum Menikah</option>
                    <option value="janda">Janda</option>
                    <option value="duda">Duda</option>
                  </select>
                </div>

                <div>
                  <Label>Divisi</Label>
                  <select
                    name="divisi_id"
                    value={formData.divisi_id ?? ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Pilih Divisi</option>
                    {divisis.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Status Pajak</Label>
                  <select
                    name="status_pajak"
                    value={formData.status_pajak ?? ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Pilih Status Pajak</option>
                    <option value="TK/0">TK/0</option>
                    <option value="TK/1">TK/1</option>
                    <option value="TK/2">TK/2</option>
                    <option value="TK/3">TK/3</option>
                    <option value="K0">K0</option>
                    <option value="K1">K1</option>
                    <option value="K2">K2</option>
                    <option value="K3">K3</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                <Label>Dashboard</Label>
                <select
                  name="dashboard_type"
                  value={formData.dashboard_type ?? ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Pilih Dashboard Type</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                  <option value="pegawai">Pegawai</option>
                </select>
              </div>

                <div>
                  <Label>Nomor KTP</Label>
                  <Input
                    type="number"
                    name="ktp"
                    value={formData.ktp}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan Nomor KTP"
                  />
                </div>

                <div>
                  <Label>Nomor Kartu Keluarga</Label>
                  <Input
                    type="number"
                    name="kartu_keluarga"
                    value={formData.kartu_keluarga}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan No Kartu Keluarga"
                  />
                </div>

                <div>
                  <Label>Nomor BPJS Kesehatan</Label>
                  <Input
                    type="number"
                    name="bpjs_kesehatan"
                    value={formData.bpjs_kesehatan}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan No BPJS Kesehatan"
                  />
                </div>

                <div>
                  <Label>Nomor BPJS Ketenagakerjaan</Label>
                  <Input
                    type="number"
                    name="bpjs_ketenagakerjaan"
                    value={formData.bpjs_ketenagakerjaan}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan No BPJS Ketenagakerjaan"
                  />
                </div>

                <div>
                  <Label>Nomor NPWP</Label>
                  <Input 
                    name="npwp" 
                    value={formData.npwp} 
                    onChange={handleChange} />
                </div>

                <div>
                  <Label>Nomor SIM</Label>
                  <Input 
                    name="sim" 
                    value={formData.sim} 
                    onChange={handleChange} />
                </div>

                <div>
                  <Label>Nomor PKWT</Label>
                  <Input 
                    name="no_pkwt" 
                    value={formData.no_pkwt} 
                    onChange={handleChange} />
                </div>

                <div>
                  <Label>Nomor Kontrak</Label>
                  <Input 
                    name="no_kontrak" 
                    value={formData.no_kontrak} 
                    onChange={handleChange} />
                </div>

                <div>
                  <Label>Tanggal Mulai PKWT</Label>
                  <DatePicker
                    id="tanggal_mulai_pwkt"
                    selected={formData.tanggal_mulai_pwkt ? new Date(formData.tanggal_mulai_pwkt) : undefined}
                    onChange={(val: string) =>
                    setFormData((prev) => ({ ...prev, tanggal_mulai_pwkt: val }))
                  }
                  />
                </div>

                <div>
                  <Label>Tanggal Berakhir PKWT</Label>
                  <DatePicker
                    id="tanggal_berakhir_pwkt"
                    selected={formData.tanggal_berakhir_pwkt ? new Date(formData.tanggal_berakhir_pwkt) : undefined}
                    onChange={(val: string) =>
                      setFormData((prev) => ({ ...prev, tanggal_berakhir_pwkt: val }))
                    }
                  />
                </div>

                 <div>
                    <Label>Nomor Rekening</Label>
                    <Input 
                      name="rekening" 
                      value={formData.rekening} 
                      onChange={handleChange} />
                  </div>

                  <div>
                    <Label>Nama Rekening</Label>
                    <Input 
                      name="nama_rekening" 
                      value={formData.nama_rekening} 
                      onChange={handleChange} />
                  </div>

                  <div>
                    <Label>Alamat</Label>
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border dark:bg-gray-800 dark:border-gray-600 dark:text-white h-28"
                      placeholder="Masukkan Alamat"
                    ></textarea>
                  </div>

                  <div>
                    <Label>Masa Berlaku</Label>
                    <DatePicker
                      id="masa_berlaku"
                      selected={formData.masa_berlaku ? new Date(formData.masa_berlaku) : undefined}
                      onChange={(val: string) =>
                        setFormData((prev) => ({ ...prev, masa_berlaku: val }))
                      }
                    />
                  </div>
                
              </div>
            </ComponentCard>

            {/* ================= CUTI ================= */}
            <ComponentCard 
              title="Cuti & Izin"
              titleClass="text-xl font-bold text-blue-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Cuti</Label>
                  <Input
                    type="number"
                    name="izin_cuti"
                    value={formData.izin_cuti}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan jumlah cuti"
                  />
                </div>

                <div>
                  <Label>Izin Telat</Label>
                  <Input
                    type="number"
                    name="izin_telat"
                    value={formData.izin_telat}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan jumlah izin"
                  />
                </div>

                <div>
                  <Label>Izin Masuk</Label>
                  <Input
                    type="number"
                    name="izin_lainnya"
                    value={formData.izin_lainnya}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan jumlah izin"
                  />
                </div>

                <div>
                  <Label>Izin Pulang Cepat</Label>
                  <Input
                    type="number"
                    name="izin_pulang_cepat"
                    value={formData.izin_pulang_cepat}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="Masukkan jumlah izin"
                  />
                </div>

              </div>
            </ComponentCard>

            {/* ================= PENJUMLAHAN GAJI ================= */}
            <ComponentCard 
            title={
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-black">
                  Penjumlahan Gaji
                </span>

                <select
                    value={periodeGaji}
                    onChange={(e) => setPeriodeGaji(e.target.value as "hari" | "bulan")}
                    className="
                      rounded-lg border border-gray-300 px-2 py-1 text-sm
                      dark:border-gray-700 dark:bg-gray-900
                    "
                  >
                    <option value="bulan">Per Bulan</option>
                    <option value="hari">Per Hari</option>
                  </select>
              </div>
            }
            titleClass="text-xl font-bold text-blue-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

               {/* Gaji Pokok */}
                <div>
                  <Label>Gaji Pokok</Label>
                  <div className="relative">
                    <Input
                      name="gaji_pokok"
                      value={"Rp. " + formData.gaji_pokok}
                      onChange={handleGajiPokokChange}
                      className="pr-20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {satuanText}
                    </span>
                  </div>
                </div>

                {/* Makan & Transport */}
                <div>
                  <Label>Makan & Transport</Label>
                  <div className="relative">
                    <Input
                      name="makan_transport"
                      value={"Rp. " + formData.makan_transport}
                      onChange={handleMakanTransportChange}
                      className="pr-20"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {satuanText}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Lembur</Label>
                  <div className="relative">
                    <Input
                      name="lembur"
                      value={"Rp. " + (formData.lembur)}
                      onChange={handleLemburChange}
                      className="pr-20"  
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      /Jam
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Kehadiran</Label>
                  <div className="relative">
                    <Input
                      name="kehadiran"
                      value={"Rp. " + (formData.kehadiran)}
                      onChange={handleKehadiranChange}
                      className="pr-20"  
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      {satuanText}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>THR</Label>
                  <div className="relative">
                    <Input
                      name="thr"
                      value={"Rp. " + (formData.thr)}
                      onChange={handleThrChange}
                      className="pr-20"  
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      /Tahun
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Bonus Pribadi</Label>
                  <div className="relative">
                    <Input
                      name="bonus_pribadi" 
                      value={"Rp. " + (formData.bonus_pribadi)}
                      onChange={handleBonusPribadiChange}
                      className="pr-20"  
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      {satuanText}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Bonus Team</Label>
                  <div className="relative">
                    <Input
                      name="bonus_team"
                      value={"Rp. " + (formData.bonus_team)}
                      onChange={handleBonusTeamChange}
                      className="pr-20"  
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      {satuanText}
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Bonus Jackpot</Label>
                  <div className="relative">
                    <Input
                      name="bonus_jackpot" 
                      value={"Rp. " + (formData.bonus_jackpot)}
                      onChange={handleBonusJackpotChange}
                      className="pr-20"  
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      {satuanText}
                    </span>
                  </div>
                </div>

              </div>
            </ComponentCard>

            {/* ================= PENGURANGAN GAJI ================= */}
            <ComponentCard 
              title="Pengurangan Gaji"
              titleClass="text-xl font-bold text-blue-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                  <Label>Izin</Label>
                  <div className="relative">
                    <Input
                      name="izin"
                      value={"Rp. " + (formData.izin)}  
                      onChange={handleIzinChange}
                      className="pr-20"  
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      /hari
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Terlambat</Label>
                  <div className="relative">
                    <Input
                      name="terlambat"
                      value={"Rp. " + (formData.terlambat)}  
                      onChange={handleTerlambatChange}
                      className="pr-20"  
                    />
                    <select
                      value={formData.terlambat_satuan}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          terlambat_satuan: e.target.value as "hari" | "jam" | "menit",
                        }))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 text-sm"
                    >
                      <option value="hari">/hari</option>
                      <option value="jam">/jam</option>
                      <option value="menit">/menit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Mangkir</Label>
                  <div className="relative">
                    <Input
                      name="mangkir"
                      value={"Rp. " + (formData.mangkir)}  
                      onChange={handleMangkirChange}
                      className="pr-20"  
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                      /hari
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Saldo Kasbon</Label>
                  <div className="relative">
                    <Input
                      name="saldo_kasbon"
                      value={"Rp. " + (formData.saldo_kasbon)}  
                      onChange={handleSaldoKasbonChange}
                      className="pr-20"  
                    />
                    <select
                      value={formData.kasbon_periode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          kasbon_periode: e.target.value as "bulan" | "tahun",
                        }))
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 text-sm"
                    >
                      <option value="bulan">/bulan</option>
                      <option value="tahun">/tahun</option>
                    </select>
                  </div>
                </div>

              </div>
            </ComponentCard>

            {/* ================= TUNJANGAN & POTONGAN PAJAK / BPJS ================= */}
            <ComponentCard title="Tunjangan & Potongan Pajak / BPJS"
            titleClass="text-xl font-bold text-blue-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                  <Label>Tunjangan BPJS Kesehatan</Label>
                  <div className="relative">
                    <Input
                      name="tungangan bpjs kesehatan"
                      value={"Rp. " + (formData.tunjangan_bpjs_kesehatan)}  
                      onChange={handleBPJSKesehatanChange}
                      className="pr-20"  
                    />
                  </div>
                </div>

                <div>
                  <Label>Tunjangan BPJS Ketenagakerjaan</Label>
                  <div className="relative">
                    <Input
                      name="tungangan bpjs ketenagakerjaan"
                      value={"Rp. " + (formData.tunjangan_bpjs_ketenagakerjaan)}  
                      onChange={handleBPJSKetenagakerjaanChange}
                      className="pr-20"  
                    />
                  </div>
                </div>

                <div>
                  <Label>Potongan BPJS Kesehatan</Label>
                  <div className="relative">
                    <Input
                      name="potongan bpjs kesehatan"
                      value={"Rp. " + (formData.potongan_bpjs_kesehatan)}  
                      onChange={handlePotonganBPJSKesehatanChange}
                      className="pr-20"  
                    />
                  </div>
                </div>

                <div>
                  <Label>Potongan BPJS Ketenagakerjaan</Label>
                  <div className="relative">
                    <Input
                      name="potongan bpjs ketenagakerjaan"
                      value={"Rp. " + (formData.potongan_bpjs_ketenagakerjaan)}  
                      onChange={handlePotonganBPJSKetenagakerjaanChange}
                      className="pr-20"  
                    />
                  </div>
                </div>

                <div>
                  <Label>Tunjangan Pajak</Label>
                  <div className="relative">
                    <Input
                      name="tungangan pajak"
                      value={"Rp. " + (formData.tunjangan_pajak)}  
                      onChange={handleTunjanganPajakChange}
                      className="pr-20"  
                    />
                  </div>
                </div>

              </div>
            </ComponentCard>

            {/* ================= SAVE ================= */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}