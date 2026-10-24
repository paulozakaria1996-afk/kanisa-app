import React, { useState } from 'react';
import { 
  Donation, 
  GivingCategory, 
  PaymentMethod, 
  ChurchSettings 
} from '../types/church';
import { 
  HeartHandshake, 
  CreditCard, 
  CheckCircle2, 
  Receipt, 
  Phone, 
  Sparkles, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  Building,
  Smartphone
} from 'lucide-react';

interface OnlineGivingSectionProps {
  settings: ChurchSettings;
  onAddDonation: (donation: Donation) => void;
  recentDonations: Donation[];
}

export const OnlineGivingSection: React.FC<OnlineGivingSectionProps> = ({
  settings,
  onAddDonation,
  recentDonations,
}) => {
  const [category, setCategory] = useState<GivingCategory>('Sadaka ya Kawaida');
  const [amount, setAmount] = useState<number>(20000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('M-Pesa');
  const [giverName, setGiverName] = useState('');
  const [giverPhone, setGiverPhone] = useState('');
  const [note, setNote] = useState('');

  // Interactive USSD & Receipt State
  const [showUssdPrompt, setShowUssdPrompt] = useState(false);
  const [ussdPin, setUssdPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedDonation, setCompletedDonation] = useState<Donation | null>(null);

  const presetAmounts = [5000, 10000, 20000, 50000, 100000, 250000];

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giverName.trim() || !giverPhone.trim() || amount <= 0) return;

    // Open realistic USSD prompt for mobile money
    setShowUssdPrompt(true);
  };

  const handleConfirmUssd = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const receiptNum = 'KAN-2026-' + Math.floor(1000 + Math.random() * 9000);
      const refCode = paymentMethod.slice(0, 2).toUpperCase() + Math.random().toString(36).substring(2, 9).toUpperCase();

      const newDonation: Donation = {
        id: 'don-' + Date.now(),
        receiptNo: receiptNum,
        memberName: giverName.trim(),
        memberPhone: giverPhone.trim(),
        category,
        amount,
        paymentMethod,
        referenceCode: refCode,
        date: new Date().toISOString(),
        status: 'Imekamilika',
        note: note.trim(),
      };

      onAddDonation(newDonation);
      setCompletedDonation(newDonation);
      setIsProcessing(false);
      setShowUssdPrompt(false);
      setUssdPin('');
    }, 1200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Kicker & Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-md">
          Utoaji wa Sadaka & Fungu la Kumi
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
          Toa Sadaka kwa Njia ya Mtandao
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          "Kila mtu na atoe kama alivyokusudia moyoni mwake, si kwa huzuni, wala si kwa lazima; maana Mungu humpenda yeye atoaye kwa moyo wa ukunjufu." — 2 Wakorintho 9:7
        </p>
      </div>

      {completedDonation ? (
        /* Digital Stakabadhi / Official Church Receipt */
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 sm:p-8 animate-fade-in max-w-xl mx-auto">
          
          <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-6">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-600" />
            <div>
              <h4 className="font-semibold text-sm">Sadaka Yako Imepokelewa Kikamilifu!</h4>
              <p className="text-xs text-emerald-800">
                Ujumbe wa uthibitisho umetumwa kwenye nambari yako ya simu. Mungu akubariki sana!
              </p>
            </div>
          </div>

          {/* Printable Official Receipt */}
          <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 relative">
            <div className="text-center border-b border-slate-200 pb-4 mb-4">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">{settings.churchName}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">STAKABADHI RASMI YA SADAKA</h3>
              <p className="text-xs text-slate-500 font-mono">Nambari: {completedDonation.receiptNo}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Mtoaji (Mshirika):</span>
                <span className="font-semibold text-slate-900">{completedDonation.memberName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Nambari ya Simu:</span>
                <span className="font-mono text-slate-900">{completedDonation.memberPhone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Aina ya Sadaka:</span>
                <span className="font-semibold text-amber-700">{completedDonation.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Njia ya Malipo:</span>
                <span className="font-medium text-slate-900">{completedDonation.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Kumbukumbu (Ref Code):</span>
                <span className="font-mono text-blue-900 font-semibold">{completedDonation.referenceCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Tarehe na Saa:</span>
                <span className="font-medium text-slate-700">
                  {new Date(completedDonation.date).toLocaleString('sw-TZ', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-slate-900">Kiasi Kilicholipwa:</span>
                <span className="text-xl font-extrabold text-blue-950 font-mono">
                  {completedDonation.amount.toLocaleString()} {settings.currency}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-slate-300 text-center text-[11px] text-slate-500">
              <p>Asante kwa uaminifu wako katika ufalme wa Mungu.</p>
              <p className="font-medium text-slate-700 mt-1">{settings.leaderName} · {settings.leaderTitle}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handlePrintReceipt}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Chapisha Stakabadhi
            </button>
            <button
              onClick={() => {
                setCompletedDonation(null);
                setAmount(20000);
                setCustomAmount('');
                setNote('');
              }}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Toa Sadaka Nyingine
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Giving Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Giving Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  1. Chagua Aina ya Sadaka au Mchango <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(['Sadaka ya Kawaida', 'Fungu la Kumi', 'Sadaka ya Shukrani', 'Harambee ya Ujenzi', 'Michango ya Huduma'] as GivingCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 text-xs font-medium rounded-xl border text-left cursor-pointer transition-all ${
                        category === cat
                          ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block font-semibold">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  2. Chagua au Ingiza Kiasi ({settings.currency}) <span className="text-red-500">*</span>
                </label>
                
                {/* Presets */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {presetAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetClick(val)}
                      className={`py-2 px-1 text-xs font-mono font-semibold rounded-lg border text-center cursor-pointer transition-all ${
                        amount === val && !customAmount
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom Amount input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                    {settings.currency}
                  </div>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Weka kiasi maalum (mfano: 35,000)..."
                    className="w-full pl-14 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 font-mono"
                  />
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  3. Njia ya Malipo ya Mtandao <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Halopesa', 'CRDB Bank', 'NMB Bank'] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === method
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="font-medium">{method}</span>
                      {method.includes('Bank') ? (
                        <Building className="w-4 h-4 opacity-75" />
                      ) : (
                        <Smartphone className="w-4 h-4 opacity-75" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Giver details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jina la Mtoaji <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={giverName}
                    onChange={(e) => setGiverName(e.target.value)}
                    placeholder="mfano: Paulo Zakaria"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nambari ya Simu ya Malipo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={giverPhone}
                      onChange={(e) => setGiverPhone(e.target.value)}
                      placeholder="0754... au 0713..."
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kusudi / Dokezo la Sadaka (Hiari)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="mfano: Fungu la kumi la mwezi huu, au Shukrani ya uzazi..."
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <HeartHandshake className="w-5 h-5" />
                Toa {amount.toLocaleString()} {settings.currency} Sasa
              </button>

            </form>
          </div>

          {/* Sidebar / Instructions & Church Accounts */}
          <div className="space-y-6">
            
            {/* Account numbers card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
              <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Nambari Rasmi za Malipo ya Kanisa
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Vodacom M-Pesa (Lipa Namba)</span>
                  <span className="font-mono text-sm font-bold text-white">{settings.mpesaTill}</span>
                  <span className="text-[10px] text-amber-300 block mt-0.5">{settings.churchName}</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Tigo Pesa (Mixx Paybill)</span>
                  <span className="font-mono text-sm font-bold text-white">{settings.tigoPaybill}</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">CRDB Bank (Akaunti ya Sadaka)</span>
                  <span className="font-mono text-xs font-bold text-white">{settings.crdbAccount}</span>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">NMB Bank (Akaunti ya Ujenzi)</span>
                  <span className="font-mono text-xs font-bold text-white">{settings.nmbAccount}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Malipo yote yanalindwa na mfumo rasmi wa kibenki.</span>
              </div>
            </div>

            {/* Recent Giving Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-900" />
                Sadaka Zilizotolewa Hivi Karibuni
              </h3>

              <div className="space-y-2.5">
                {recentDonations.slice(0, 4).map((don) => (
                  <div key={don.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block">{don.memberName}</span>
                      <span className="text-[11px] text-slate-500">{don.category} · {don.paymentMethod}</span>
                    </div>
                    <span className="font-mono font-bold text-blue-900">
                      {don.amount.toLocaleString()} {settings.currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Interactive Mobile Money USSD Prompt Modal */}
      {showUssdPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            
            <div className="p-5 border-b border-slate-800 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Ombi la Malipo ya Simu ({paymentMethod})</h3>
              <p className="text-xs text-slate-400 mt-1">Ujumbe wa USSD umetumwa kwenye simu yako</p>
            </div>

            <form onSubmit={handleConfirmUssd} className="p-5 space-y-4">
              <div className="bg-slate-800/90 rounded-xl p-3.5 border border-slate-700 text-center space-y-1">
                <span className="text-[11px] text-slate-400 block">Kiasi cha Kulipa:</span>
                <span className="text-xl font-bold font-mono text-amber-400">
                  {amount.toLocaleString()} {settings.currency}
                </span>
                <span className="text-xs text-slate-300 block">
                  Kwenda: <strong className="text-white">{settings.churchName}</strong> ({category})
                </span>
                <span className="text-[11px] text-slate-400 font-mono block">Namba ya Simu: {giverPhone}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 text-center">
                  Ingiza PIN ya Siri ya {paymentMethod} Kukamilisha:
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={ussdPin}
                  onChange={(e) => setUssdPin(e.target.value)}
                  placeholder="• • • •"
                  className="w-full py-2.5 text-center text-lg font-mono tracking-widest bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUssdPrompt(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {isProcessing ? 'Inalipa...' : 'Thibitisha Malipo'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
