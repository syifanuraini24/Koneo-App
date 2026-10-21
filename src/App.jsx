import { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  
  const [summary, setSummary] = useState({ pemasukan: 0, pengeluaran: 0, saldo: 0 });

  // Ganti dengan URL Google Apps Script kamu
  const GAS_URL = "https://script.google.com/macros/library/d/1znMs2pYzxTCNdFtw5rEWAuiABVhd8W5zrIcxS5vI9rrdeku-bXx3W1Ob/2";

  useEffect(() => {
    if (isLoggedIn && activeTab === "dashboard") {
      fetchDashboard();
    }
  }, [isLoggedIn, activeTab]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(GAS_URL);
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Gagal memuat data dashboard", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if ((user === "syifa" && password === "pass-syifa123") || 
        (user === "andi" && password === "pass-andi123")) {
      setIsLoggedIn(true);
    } else {
      alert("Username atau password salah!");
    }
  };

  const submitTransaksi = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("action", "transaksi");
    formData.append("tanggal", e.target.tanggal.value);
    formData.append("tipe", e.target.tipe.value);
    formData.append("nominal", e.target.nominal.value);
    formData.append("keterangan", e.target.keterangan.value);
    formData.append("user", user);

    await fetch(GAS_URL, { method: "POST", body: formData, mode: "no-cors" });
    alert("Transaksi berhasil dicatat!");
    e.target.reset();
    setLoading(false);
    setActiveTab("dashboard");
  };

  const submitRencana = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("action", "rencana");
    formData.append("tanggal", e.target.tanggal.value);
    formData.append("item", e.target.item.value);
    formData.append("harga", e.target.harga.value);
    formData.append("user", user);

    await fetch(GAS_URL, { method: "POST", body: formData, mode: "no-cors" });
    alert("Rencana belanja berhasil dicatat!");
    e.target.reset();
    setLoading(false);
  };

  const formatRp = (angka) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(angka);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Keuangan Kita</h1>
            <p className="text-sm text-gray-500 mt-1">Transparansi itu penting 💙</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Username (syifa / andi)" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setUser(e.target.value.toLowerCase())} 
                required 
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <p className="text-xs text-gray-400 mt-2">
                *Password Syifa: <b>pass-syifa123</b> <br/>
                *Password Andi: <b>pass-andi123</b>
              </p>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition">
              Masuk
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:p-8">
      <div className="max-w-md mx-auto bg-white md:rounded-2xl shadow-sm md:shadow-lg overflow-hidden min-h-screen md:min-h-0">
        
        <div className="bg-blue-600 p-5 text-white flex justify-between items-center rounded-b-2xl md:rounded-none">
          <div>
            <p className="text-sm opacity-80">Selamat datang,</p>
            <h1 className="text-xl font-bold capitalize">{user}</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition">
            Keluar
          </button>
        </div>

        <div className="flex border-b mt-2">
          <button onClick={() => setActiveTab("dashboard")} className={`flex-1 p-3 text-sm font-medium ${activeTab === "dashboard" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>Dashboard</button>
          <button onClick={() => setActiveTab("transaksi")} className={`flex-1 p-3 text-sm font-medium ${activeTab === "transaksi" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>Catat</button>
          <button onClick={() => setActiveTab("rencana")} className={`flex-1 p-3 text-sm font-medium ${activeTab === "rencana" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}>Rencana</button>
        </div>

        <div className="p-5">
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Sisa Saldo Saat Ini</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-1">{formatRp(summary.saldo)}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <p className="text-xs text-green-600 font-medium mb-1">Total Pemasukan</p>
                  <p className="text-lg font-bold text-gray-800">{formatRp(summary.pemasukan)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-xs text-red-600 font-medium mb-1">Total Pengeluaran</p>
                  <p className="text-lg font-bold text-gray-800">{formatRp(summary.pengeluaran)}</p>
                </div>
              </div>
              <button onClick={fetchDashboard} className="w-full mt-2 text-sm text-gray-500 hover:text-blue-600 underline">
                Refresh Data
              </button>
            </div>
          )}

          {activeTab === "transaksi" && (
            <form onSubmit={submitTransaksi} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-medium">Tanggal</label>
                <input type="date" name="tanggal" className="w-full p-2.5 mt-1 border rounded-lg bg-gray-50" required />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Jenis Transaksi</label>
                <select name="tipe" className="w-full p-2.5 mt-1 border rounded-lg bg-gray-50" required>
                  <option value="Uang Keluar">Uang Keluar 🔻</option>
                  <option value="Uang Masuk">Uang Masuk 🟢</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Nominal (Rp)</label>
                <input type="number" name="nominal" placeholder="Contoh: 50000" className="w-full p-2.5 mt-1 border rounded-lg bg-gray-50" required />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Untuk Apa?</label>
                <input type="text" name="keterangan" placeholder="Contoh: Beli token listrik" className="w-full p-2.5 mt-1 border rounded-lg bg-gray-50" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition mt-4">
                {loading ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </form>
          )}

          {activeTab === "rencana" && (
            <form onSubmit={submitRencana} className="space-y-4">
               <div>
                <label className="text-sm text-gray-600 font-medium">Target Tanggal Beli</label>
                <input type="date" name="tanggal" className="w-full p-2.5 mt-1 border rounded-lg bg-gray-50" required />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Nama Barang / Keperluan</label>
                <input type="text" name="item" placeholder="Contoh: Susu Anak" className="w-full p-2.5 mt-1 border rounded-lg bg-gray-50" required />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Estimasi Harga (Rp)</label>
                <input type="number" name="harga" placeholder="Contoh: 150000" className="w-full p-2.5 mt-1 border rounded-lg bg-gray-50" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-semibold p-3 rounded-lg hover:bg-indigo-700 transition mt-4">
                {loading ? "Menyimpan..." : "Masukkan Rencana Belanja"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}