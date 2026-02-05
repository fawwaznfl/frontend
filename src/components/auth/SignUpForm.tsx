import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import api from "../../api/axios";

interface Company {
  id: number;
  name: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    no_telp: "",
    company_id: "",
    password: "",
    password_confirmation: "",
  });

  // FETCH COMPANIES 
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/v1/public/companies");
        setCompanies(res.data.data);
      } catch (err) {
        console.error("Gagal load company", err);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Company",
          text: "Tidak bisa mengambil data company.",
        });
      }
    };

    fetchCompanies();
  }, []);

  // HANDLE CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/register", formData);

      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: "Akun kamu berhasil dibuat. Silakan login.",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Oke",
      }).then(() => navigate("/"));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan saat registrasi.";

      Swal.fire({
        icon: "error",
        title: "Gagal Registrasi",
        text: errorMessage,
        confirmButtonColor: "#dc2626",
      });

      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // USER INTERFACE
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Register
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Nama Lengkap */}
              <div>
                <Label>
                  Nama Lengkap<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Masukan Nama Kamu"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Username */}
              <div>
                <Label>
                  Username<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="Masukan Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Masukan Email Kamu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Nomor Telepon */}
              <div>
                <Label>
                  Nomor Telepon<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="no_telp"
                  placeholder="Masukan Nomor Telepon Kamu"
                  value={formData.no_telp}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Company */}
              <div>
                <Label>
                  Company<span className="text-error-500">*</span>
                </Label>
                <select
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm
                             focus:border-brand-500 focus:ring-brand-500
                             dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                >
                  <option value="">-- Pilih Company --</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Masukan password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div>
                <Label>
                  Konfirmasi Password
                  <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Ulangi Password"
                    type={showPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                  {loading ? "Mendaftar..." : "Register"}
                </button>
              </div>

              {message && (
                <p className="text-center text-sm mt-3 text-gray-700 dark:text-gray-300">
                  {message}
                </p>
              )}
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Sudah Punya Akun?{" "}
              <Link
                to="/"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
