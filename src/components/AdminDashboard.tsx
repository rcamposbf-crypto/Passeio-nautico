import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Download, Search, RefreshCw, Ship, Shirt, Anchor, Check, X, DollarSign, Smartphone, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../firebase';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';

interface Registration {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  boat_type: string;
  jet_ski_power: string | null;
  tshirt_size: string;
  emergency_contact: string;
  has_passenger: boolean;
  passenger_tshirt_size: string | null;
  paid: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data: Registration[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Registration);
      });
      
      console.log("Registros carregados:", data.length);
      setRegistrations(data);
    } catch (err: any) {
      console.error("Erro ao buscar registros:", err);
      setRegistrations([]);
      alert(`Erro ao carregar registros: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = async (id: string, currentStatus: boolean) => {
    try {
      const regRef = doc(db, 'registrations', id);
      await updateDoc(regRef, { paid: !currentStatus });
      setRegistrations(prev => prev.map(r => r.id === id ? { ...r, paid: !currentStatus } : r));
    } catch (err: any) {
      console.error("Erro ao atualizar pagamento:", err);
      alert(`Erro ao atualizar pagamento: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filtered = registrations.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cpf.includes(searchTerm) ||
    r.boat_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: registrations.length,
    paid: registrations.filter(r => r.paid).length,
    unpaid: registrations.filter(r => !r.paid).length,
    boats: registrations.filter(r => r.boat_type !== 'Jet Ski').length,
    jets: registrations.filter(r => r.boat_type === 'Jet Ski').length
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Nome', 'CPF', 'Telefone', 'Email', 'Barco', 'Potência Jet', 'Camiseta', 'Passageiro', 'Camiseta Passageiro', 'Pago', 'Data'];
    const rows = registrations.map(r => [
      `"${r.name}"`,
      `"${r.cpf}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.boat_type}"`,
      `"${r.jet_ski_power || '-'}"`,
      `"${r.tshirt_size}"`,
      `"${r.has_passenger ? 'Sim' : 'Não'}"`,
      `"${r.has_passenger ? (r.passenger_tshirt_size || '-') : '-'}"`,
      `"${r.paid ? 'Sim' : 'Não'}"`,
      `"${new Date(r.createdAt).toLocaleDateString('pt-BR')}"`
    ]);
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "inscritos_rio_lontra.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-orange-500/20 p-3 rounded-xl text-orange-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Inscritos</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Pagos</p>
            <p className="text-2xl font-bold text-emerald-500">{stats.paid}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-red-500/20 p-3 rounded-xl text-red-500">
            <X size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Pendentes</p>
            <p className="text-2xl font-bold text-red-500">{stats.unpaid}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-orange-500/10 p-3 rounded-xl text-orange-400">
            <Ship size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Embarcações</p>
            <p className="text-2xl font-bold">{stats.boats}</p>
          </div>
        </div>
      </div>

      {/* Mobile Access Tip */}
      <div className="glass p-6 rounded-2xl border border-orange-500/10 bg-orange-500/5 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white p-3 rounded-xl shrink-0 shadow-lg shadow-orange-600/10">
          <QRCodeSVG 
            value={window.location.href} 
            size={80}
            level="H"
          />
        </div>
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2 text-orange-500 font-bold">
            <Smartphone size={20} />
            <h3>Acesse no seu Smartphone</h3>
          </div>
          <p className="text-sm text-slate-400 max-w-xl">
            Escaneie o código ao lado para abrir este painel no seu celular. O sistema é totalmente otimizado para dispositivos móveis, permitindo que você acompanhe as inscrições de qualquer lugar.
          </p>
        </div>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Painel Rio Lontra 2026',
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copiado para a área de transferência!');
            }
          }}
          className="md:ml-auto flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <Share2 size={18} /> Compartilhar Link
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou barco..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchRegistrations}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Download size={18} /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Table (Desktop) / Cards (Mobile) */}
      <div className="hidden md:block glass rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Nome</th>
              <th className="px-6 py-4 font-medium">Contato</th>
              <th className="px-6 py-4 font-medium">Barco</th>
              <th className="px-6 py-4 font-medium">Camiseta</th>
              <th className="px-6 py-4 font-medium text-center">Pagamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filtered.map((reg) => (
              <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium">{reg.name}</div>
                  <div className="text-xs text-slate-500">{reg.cpf}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">{reg.phone}</div>
                  <div className="text-xs text-slate-500">{reg.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs">
                      <Ship size={12} /> {reg.boat_type}
                    </span>
                    {reg.boat_type === 'Jet Ski' && reg.jet_ski_power && (
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        Potência: {reg.jet_ski_power} HP
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs w-fit">
                      <Shirt size={12} /> P: {reg.tshirt_size}
                    </span>
                    {reg.has_passenger && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs w-fit">
                        <Shirt size={12} /> S: {reg.passenger_tshirt_size}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => togglePayment(reg.id, reg.paid)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        reg.paid 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {reg.paid ? <Check size={14} /> : <X size={14} />}
                      {reg.paid ? 'Pago' : 'Pendente'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards (Mobile) */}
      <div className="md:hidden space-y-4">
        {filtered.map((reg) => (
          <div key={reg.id} className="glass p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{reg.name}</h3>
                <p className="text-xs text-slate-500">{reg.cpf}</p>
              </div>
              <button
                onClick={() => togglePayment(reg.id, reg.paid)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  reg.paid 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {reg.paid ? <Check size={14} /> : <X size={14} />}
                {reg.paid ? 'Pago' : 'Pendente'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Contato</p>
                <p>{reg.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Barco</p>
                <p className="text-orange-400 font-medium">
                  {reg.boat_type}
                  {reg.boat_type === 'Jet Ski' && reg.jet_ski_power && (
                    <span className="block text-[10px] text-slate-500">Potência: {reg.jet_ski_power} HP</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Camisetas</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold">P: {reg.tshirt_size}</span>
                  {reg.has_passenger && (
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">S: {reg.passenger_tshirt_size}</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Data</p>
                <p className="text-xs">{new Date(reg.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="p-12 text-center text-slate-500 glass rounded-2xl">
          Nenhum registro encontrado.
        </div>
      )}
    </div>
  );
}
