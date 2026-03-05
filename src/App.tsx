import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Anchor, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronDown, 
  Shield, 
  Waves, 
  LayoutDashboard,
  UserPlus,
  LogIn,
  X
} from 'lucide-react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import RegistrationForm from './components/RegistrationForm';
import EventAssistant from './components/EventAssistant';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Falha no login. Verifique se você é um administrador autorizado.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
  };

  const isAdmin = user?.email === 'virgilioferriris@gmail.com';

  if (loading) {
    return (
      <div className="min-h-screen brand-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-gradient selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
              <div className="bg-orange-600 p-2 rounded-xl">
                <Anchor className="text-white" size={24} />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white hidden sm:block">
                Rio Lontra <span className="text-orange-500">2026</span>
              </span>
            </div>
            {/* Discrete access point for Admin */}
            <button 
              onClick={() => setView(view === 'home' ? 'admin' : 'home')}
              className="w-1 h-1 bg-white/10 hover:bg-orange-500/40 rounded-full transition-colors cursor-default"
              title="."
            />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href="#inscricao" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20 whitespace-nowrap"
            >
              Inscreva-se
            </a>
          </div>
        </div>
      </nav>

      {view === 'home' ? (
        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://picsum.photos/seed/river/1920/1080?blur=2" 
                alt="Rio Lontra Background" 
                className="w-full h-full object-cover opacity-30"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-black/50 via-brand-black to-brand-black" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-sm font-bold tracking-widest uppercase mb-6 border border-orange-500/20">
                  27º Passeio Náutico
                </span>
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-tight">
                  Descida do <br />
                  <span className="text-orange-500 italic">Rio Lontra</span>
                </h1>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
              >
                Uma jornada épica pelas águas do Rio Lontra. Tradição, aventura e a 
                maior reunião náutica da região. Prepare sua embarcação!
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6 pt-8"
              >
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="text-orange-500" size={20} />
                  <span className="font-medium">21 de Março, 2026</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="text-orange-500" size={20} />
                  <span className="font-medium">Barra da Grota, TO</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="pt-12"
              >
                <ChevronDown className="mx-auto text-slate-500" size={32} />
              </motion.div>
            </div>
          </section>

          {/* Info Section */}
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="glass p-8 rounded-3xl space-y-4">
                <div className="bg-orange-500/20 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-500">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold">Inscrição Completa</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Sua inscrição garante almoço exclusivo, transporte de combustível 
                  e a camiseta oficial do 27º Passeio Náutico.
                </p>
              </div>
              <div className="glass p-8 rounded-3xl space-y-4">
                <div className="bg-orange-500/20 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-500">
                  <Waves size={24} />
                </div>
                <h3 className="text-xl font-bold">Roteiro Seguro</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Saída da Barra da Grota com destino à ponte do Rio Lontra, seguindo até Xambioá. 
                  Equipes de apoio e segurança durante todo o trajeto.
                </p>
              </div>
              <div className="glass p-8 rounded-3xl space-y-4">
                <div className="bg-orange-500/20 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-500">
                  <Phone size={24} />
                </div>
                <h3 className="text-xl font-bold">Suporte 24h</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Dúvidas? Fale conosco: (63) 99286-4932 ou use nosso 
                  assistente inteligente no canto da tela.
                </p>
              </div>
            </div>
          </section>

          {/* Registration Section */}
          <section id="inscricao" className="py-24 px-6 bg-slate-900/30">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Faça sua Inscrição</h2>
              <p className="text-slate-400">
                Preencha os dados abaixo para garantir sua vaga no maior evento náutico do ano.
              </p>
            </div>
            <RegistrationForm />
          </section>

          {/* Footer */}
          <footer className="py-12 px-6 border-t border-white/5 text-center">
            <div className="flex justify-center gap-8 mb-8">
              <a href="mailto:aquanautica@hotmail.com" className="text-slate-500 hover:text-orange-500 transition-colors">
                <Mail size={24} />
              </a>
              <a href="tel:63992864932" className="text-slate-500 hover:text-orange-500 transition-colors">
                <Phone size={24} />
              </a>
            </div>
            <p className="text-slate-600 text-xs uppercase tracking-widest">
              © 2026 Descida do Rio Lontra • Organização Aqua Náutica
            </p>
          </footer>
        </main>
      ) : (
        <main className="pt-24 sm:pt-32 px-4 sm:px-6 max-w-7xl mx-auto pb-24">
          {!user ? (
            <div className="max-w-md mx-auto glass p-12 rounded-3xl text-center space-y-8">
              <div className="bg-orange-500/20 w-20 h-20 rounded-full flex items-center justify-center text-orange-500 mx-auto">
                <Shield size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold">Acesso Restrito</h2>
                <p className="text-slate-400">Entre com sua conta Google autorizada para gerenciar o evento.</p>
              </div>
              <button 
                onClick={handleLogin}
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all transform hover:scale-[1.02]"
              >
                <LogIn size={20} /> Entrar com Google
              </button>
              <button 
                onClick={() => setView('home')}
                className="text-slate-500 hover:text-white text-sm transition-colors"
              >
                Voltar para o site
              </button>
            </div>
          ) : !isAdmin ? (
            <div className="max-w-md mx-auto glass p-12 rounded-3xl text-center space-y-6">
              <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center text-red-500 mx-auto">
                <X size={32} />
              </div>
              <h2 className="text-2xl font-bold">Acesso Negado</h2>
              <p className="text-slate-400">Sua conta ({user.email}) não tem permissão de administrador.</p>
              <button onClick={handleLogout} className="text-orange-500 font-bold hover:underline">Sair e tentar outra conta</button>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold">Painel de Controle</h1>
                  <p className="text-slate-400 text-sm sm:text-base">Gerenciamento de inscritos e estatísticas</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-colors"
                  >
                    Sair
                  </button>
                  <button 
                    onClick={() => setView('home')}
                    className="text-orange-500 hover:underline text-sm font-medium"
                  >
                    Voltar para o site
                  </button>
                </div>
              </div>
              <AdminDashboard />
            </>
          )}
        </main>
      )}

      <EventAssistant />
    </div>
  );
}
