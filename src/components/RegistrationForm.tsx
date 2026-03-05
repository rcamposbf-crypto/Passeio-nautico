import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Anchor, Ship, User, Phone, Mail, CreditCard, HeartPulse, CheckCircle, Copy } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    boat_type: 'Jet Ski',
    jet_ski_power: '130',
    tshirt_size: 'M',
    emergency_contact: '',
    has_passenger: false,
    passenger_tshirt_size: 'M',
    accepted_terms: false
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accepted_terms) {
      alert("Você precisa aceitar os termos de responsabilidade.");
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    
    // Sanitize CPF and Phone (remove non-digits for consistency)
    const sanitizedCpf = formData.cpf.replace(/\D/g, '');
    const sanitizedPhone = formData.phone.replace(/\D/g, '');
    
    try {
      // Check if CPF already exists
      const q = query(collection(db, 'registrations'), where('cpf', '==', sanitizedCpf));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setStatus('error');
        setErrorMessage("Este CPF já possui uma inscrição cadastrada.");
        return;
      }

      const payload = {
        ...formData,
        cpf: sanitizedCpf,
        phone: sanitizedPhone,
        createdAt: new Date().toISOString(),
        paid: false
      };

      await addDoc(collection(db, 'registrations'), payload);
      setStatus('success');
    } catch (err: any) {
      console.error("Erro ao salvar no Firestore:", err);
      setStatus('error');
      setErrorMessage(`Erro ao salvar inscrição: ${err.message || 'Falha na comunicação com o banco de dados'}.`);
    }
  };

  if (status === 'success') {
    const pixKey = "63992864932";
    const pixName = "Wadson dos Santos de Melo";

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-2xl text-center max-w-xl mx-auto"
      >
        <CheckCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Inscrição Realizada!</h2>
        <p className="text-slate-400 mb-6">
          Sua participação no 27º Passeio Náutico está confirmada no sistema. 
          <br />
          <span className="text-orange-500 font-bold">Para validar sua inscrição, realize o pagamento via PIX:</span>
        </p>

        <div className="bg-slate-900/80 p-6 rounded-2xl mb-6 w-full max-w-[400px] mx-auto shadow-2xl border border-orange-500/30">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Valor a Pagar</p>
              <p className="text-white font-black text-4xl">
                {formData.has_passenger ? "R$ 550,00" : "R$ 400,00"}
              </p>
              <p className="text-orange-500 text-sm font-bold mt-1">
                {formData.has_passenger ? "Inscrição com Passageiro" : "Inscrição Individual"}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Chave PIX (Celular)</p>
              <button 
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(pixKey);
                  alert("Chave PIX copiada com sucesso!");
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl flex items-center justify-between group transition-all border border-slate-700 hover:border-orange-500/50"
              >
                <span className="text-xl font-mono font-bold tracking-wider">{pixKey}</span>
                <Copy size={20} className="text-orange-500 group-hover:scale-110 transition-transform" />
              </button>
              <p className="text-slate-500 text-[10px] mt-2 uppercase">Favorecido: {pixName}</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-400 mb-8 p-4 bg-slate-900/50 rounded-lg">
          <p>Após o pagamento, envie o comprovante para o WhatsApp:</p>
          <p className="text-orange-500 font-bold text-lg">(63) 99286-4932</p>
        </div>

        <button 
          onClick={() => setStatus('idle')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Nova Inscrição
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... (previous fields) */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User size={16} className="text-orange-500" /> Nome Completo
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <CreditCard size={16} className="text-orange-500" /> CPF
            </label>
            <input
              required
              type="text"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="000.000.000-00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone size={16} className="text-orange-500" /> Telefone / WhatsApp
            </label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail size={16} className="text-orange-500" /> E-mail
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Ship size={16} className="text-orange-500" /> Tipo de Embarcação
            </label>
            <select
              value={formData.boat_type}
              onChange={(e) => setFormData({ ...formData, boat_type: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            >
              <option value="Jet Ski">Jet Ski</option>
              <option value="Lancha">Lancha</option>
              <option value="Barco de Alumínio">Barco de Alumínio</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {formData.boat_type === 'Jet Ski' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="text-sm font-medium flex items-center gap-2">
                <Ship size={16} className="text-orange-500" /> Potência do Jet Ski (HP)
              </label>
              <select
                value={formData.jet_ski_power}
                onChange={(e) => setFormData({ ...formData, jet_ski_power: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              >
                <option value="130">130</option>
                <option value="170">170</option>
                <option value="230">230</option>
                <option value="300">300</option>
                <option value="325">325</option>
              </select>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Anchor size={16} className="text-orange-500" /> Tamanho da Camiseta
            </label>
            <select
              value={formData.tshirt_size}
              onChange={(e) => setFormData({ ...formData, tshirt_size: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            >
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
              <option value="XG">XG</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <HeartPulse size={16} className="text-orange-500" /> Contato de Emergência (Nome e Telefone)
          </label>
          <input
            type="text"
            value={formData.emergency_contact}
            onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            placeholder="Nome - (00) 00000-0000"
          />
        </div>

        {/* Passenger Selection */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.has_passenger}
              onChange={(e) => setFormData({ ...formData, has_passenger: e.target.checked })}
              className="w-6 h-6 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500"
            />
            <div>
              <span className="font-bold text-white block">Inscrição COM Passageiro?</span>
              <span className="text-xs text-slate-400">
                Sem passageiro: R$ 400,00 | Com passageiro: R$ 550,00
              </span>
            </div>
          </label>

          {formData.has_passenger && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-4 border-t border-slate-700 space-y-2"
            >
              <label className="text-sm font-medium flex items-center gap-2">
                <Anchor size={16} className="text-orange-500" /> Tamanho da Camiseta do Passageiro
              </label>
              <select
                value={formData.passenger_tshirt_size}
                onChange={(e) => setFormData({ ...formData, passenger_tshirt_size: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              >
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
                <option value="GG">GG</option>
                <option value="XG">XG</option>
              </select>
            </motion.div>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-4 pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 space-y-2 max-h-32 overflow-y-auto p-4 bg-slate-900/50 rounded-lg">
            <p>Declaro que participo do 27º Passeio Náutico – Descida do Rio Lontra, no dia 21 de março de 2026, de forma voluntária, assumindo total responsabilidade por meus atos, pela condução da embarcação sob minha responsabilidade e por quaisquer danos que eu venha a causar a mim, a terceiros ou ao meio ambiente.</p>
            <p>Declaro estar ciente dos riscos inerentes à atividade náutica e comprometo-me a cumprir as normas de navegação, as orientações da organização do evento e as regras de segurança vigentes.</p>
            <p>Isento a organização do evento, apoiadores e equipes de apoio de qualquer responsabilidade decorrente de atos praticados por mim durante a realização do evento.</p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.accepted_terms}
              onChange={(e) => setFormData({ ...formData, accepted_terms: e.target.checked })}
              className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Li e aceito os termos de responsabilidade
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {status === 'loading' ? 'Processando...' : 'Confirmar Inscrição'}
        </button>

        {status === 'error' && (
          <div className="text-red-500 text-center space-y-2 animate-pulse">
            <p className="text-sm font-bold">Ocorreu um erro ao processar sua inscrição:</p>
            <p className="text-xs bg-red-500/10 p-2 rounded border border-red-500/20">
              {errorMessage}
            </p>
            <p className="text-xs text-slate-400">Tente novamente ou entre em contato com o suporte.</p>
          </div>
        )}
      </form>
    </div>
  );
}
