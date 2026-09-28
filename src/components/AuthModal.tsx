import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  IdCard,
  ShieldCheck,
  Truck,
  Heart,
  Clock,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

const BENEFITS = [
  { icon: Truck, text: 'Tele-entrega com histórico de pedidos' },
  { icon: Clock, text: 'Agendamento de serviços e coletas' },
  { icon: Heart, text: 'Favoritos e lista de compras recorrente' },
];

export const AuthModal: React.FC = () => {
  const { authModal, closeAuth, setAuthMode, settings } = useCart();

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!authModal) return null;

  const isLogin = authModal === 'login';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-6 animate-in fade-in duration-150">
        <button
          onClick={closeAuth}
          className="absolute top-4 right-4 z-10 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Fechar"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-5">
          {/* ZONE 1: Brand / Benefits Sidebar */}
          <div className="md:col-span-2 bg-emerald-900 text-white p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-800 flex items-center justify-center mb-4">
                <User className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="text-lg font-bold leading-tight">Sua conta Fanfar</h3>
              <p className="text-xs text-emerald-200 mt-1.5 leading-relaxed">
                Entre para acompanhar seus pedidos, salvar endereços de entrega e receber ofertas
                exclusivas da farmácia de Frederico Westphalen.
              </p>

              <ul className="mt-5 space-y-3">
                {BENEFITS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 text-xs text-emerald-50">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center shrink-0 mt-px">
                      <Icon className="w-3 h-3 text-emerald-300" />
                    </span>
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-5 border-t border-emerald-800">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Seus dados protegidos conforme a LGPD
              </div>
              <p className="text-[10px] text-emerald-400/80 mt-1 leading-relaxed">
                {settings.pharmacistResponsible} · CRF/RS {settings.crfRs}
              </p>
            </div>
          </div>

          {/* ZONE 2: Forms Side */}
          <div className="md:col-span-3 p-6 sm:p-8">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  isLogin
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  isLogin
                    ? 'text-slate-500 hover:text-slate-700'
                    : 'bg-white text-emerald-800 shadow-sm'
                }`}
              >
                Criar conta
              </button>
            </div>

            <div className="mb-5">
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {isLogin ? 'Acesse sua conta' : 'Criar minha conta'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {isLogin
                  ? 'Informe seus dados para continuar a compra.'
                  : 'Leva menos de um minuto. Você poderá editar depois.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 max-h-[52vh] overflow-y-auto pr-1">
              {isLogin ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail ou CPF
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="voce@email.com"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Continuar conectado</span>
                    </label>
                    <button
                      type="button"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Ex: Maria Oliveira"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        CPF *
                      </label>
                      <div className="relative">
                        <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="000.000.000-00"
                          className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="(55) 99999-9999"
                          className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="voce@email.com"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Senha *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mínimo 6 caracteres"
                          className="w-full pl-9 pr-9 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirmar senha *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Repita a senha"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer leading-relaxed pt-0.5">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                    />
                    <span>
                      Li e concordo com a{' '}
                      <span className="font-semibold text-emerald-700">Política de Privacidade</span>{' '}
                      e autorizo o contato da Fanfar Farmácias por WhatsApp e e-mail.
                    </span>
                  </label>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <User className="w-4 h-4" />
                <span>{isLogin ? 'Entrar na minha conta' : 'Criar minha conta'}</span>
              </button>

              <div className="flex items-center gap-3 pt-1">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] text-slate-400">ou entre com</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  className="py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-red-500" />
                  <span>Google</span>
                </button>
              </div>
            </form>

            <p className="text-[11px] text-slate-500 text-center mt-4 pt-4 border-t border-slate-100">
              {isLogin ? 'Ainda não possui conta?' : 'Já possui cadastro na Fanfar?'}{' '}
              <button
                type="button"
                onClick={() => setAuthMode(isLogin ? 'register' : 'login')}
                className="font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
              >
                {isLogin ? 'Criar conta agora' : 'Entrar na minha conta'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
