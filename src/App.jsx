import { useState, useEffect } from 'react';

// GANTI DENGAN URL APPS SCRIPT KAMU
const API_URL = "https://script.google.com/macros/s/AKfycbwMsbNYnwkRo71c87GGIS8-N2YhHFgm84lU4t2sD91tCPfaijHbBv8pIwJFfC_mYOepHg/exec";

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("transaksi"); // 'transaksi' atau 'rencana'
  
  // Form States
  const [tipe, setTipe] = useState("Pengeluaran");
  const [nominal, setNominal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");
  
  // Data States
  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [dataRencana, setDataRencana] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Sistem login sederhana. Password bisa disesuaikan.
    if ((user === "Syifa" && password === "syifa123") || (user === "Andi" && password === "andi123")) {
      localStorage.setItem("user", user);
      fetchData();
    } else {
      alert("Akun atau Password salah!");
      setUser("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("");
    setPassword("");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setDataTransaksi(json.transaksi);
      setDataRencana(json.rencana);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = view === "transaksi" 
      ? { action: "transaksi", tipe, nominal, keterangan, user }
      : { action: "rencana", tanggal, kebutuhan: keterangan, estimasi: nominal, user };

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    setNominal("");
    setKeterangan("");
    setTanggal("");
    alert("Data berhasil disimpan!");
    fetchData(); // Refresh data biar transparan langsung terlihat
  };

  if (!localStorage.getItem("user") && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 text-center">Login Keuangan</h2>
          <select 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
            className="w-full mb-3 p-2 border rounded" required>
            <option value="">Pilih Akun...</option>
            <option value="Syifa">Syifa</option>
            <option value="Andi">Andi</option>
          </select>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full mb-4 p-2 border rounded" required 
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Masuk</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Halo, {user}</h1>
          <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setView("transaksi")} 
            className={`flex-1 py-2 rounded ${view === 'transaksi' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            Input Harian
          </button>
          <button 
            onClick={() => setView("rencana")} 
            className={`flex-1 py-2 rounded ${view === 'rencana' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
            Rencana Beli
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
          {view === "transaksi" ? (
            <>
              <select value={tipe} onChange={(e) => setTipe(e.target.value)} className="w-full mb-3 p-2 border rounded">
                <option value="Pengeluaran">Pengeluaran</option>
                <option value="Pemasukan">Pemasukan</option>
              </select>
              <input type="number" placeholder="Nominal (Rp)" value={nominal} onChange={(e) => setNominal(e.target.value)} className="w-full mb-3 p-2 border rounded" required />
              <input type="text" placeholder="Keterangan (ex: Makan, Bensin)" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full mb-3 p-2 border rounded" required />
            </>
          ) : (
            <>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} className="w-full mb-3 p-2 border rounded" required />
              <input type="text" placeholder="Kebutuhan (ex: Beras, Pampers)" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full mb-3 p-2 border rounded" required />
              <input type="number" placeholder="Estimasi Harga (Rp)" value={nominal} onChange={(e) => setNominal(e.target.value)} className="w-full mb-3 p-2 border rounded" required />
            </>
          )}
          <button type="submit" disabled={loading} className={`w-full text-white p-2 rounded ${view === 'transaksi' ? 'bg-blue-600' : 'bg-green-600'}`}>
            {loading ? "Menyimpan..." : "Simpan Catatan"}
          </button>
        </form>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-3">
             <h3 className="font-bold">Histori Terakhir</h3>
             <button onClick={fetchData} className="text-xs text-blue-500 underline">Refresh</button>
          </div>
          
          {view === "transaksi" ? (
            <ul className="space-y-3">
              {dataTransaksi.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <span className="font-semibold block">{item[3]}</span>
                    <span className="text-xs text-gray-400">{new Date(item[0]).toLocaleDateString('id-ID')} • Oleh: {item[4]}</span>
                  </div>
                  <div className={`font-bold ${item[1] === 'Pemasukan' ? 'text-green-500' : 'text-red-500'}`}>
                    {item[1] === 'Pemasukan' ? '+' : '-'}Rp{item[2]}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <ul className="space-y-3">
              {dataRencana.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <span className="font-semibold block">{item[1]}</span>
                    <span className="text-xs text-gray-400">Target: {new Date(item[0]).toLocaleDateString('id-ID')} • Oleh: {item[3]}</span>
                  </div>
                  <div className="font-bold text-gray-700">Rp{item[2]}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}