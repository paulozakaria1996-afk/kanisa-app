import React, { useState } from 'react';
import { Member, Gender, calculateAge, getAgeCategory, ChurchSettings } from '../types/church';
import { 
  UserPlus, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  CheckCircle2, 
  IdCard, 
  Church, 
  Printer, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface MemberRegistrationSectionProps {
  settings: ChurchSettings;
  onRegisterMember: (newMember: Member) => void;
  onGoToGiving: () => void;
}

export const MemberRegistrationSection: React.FC<MemberRegistrationSectionProps> = ({
  settings,
  onRegisterMember,
  onGoToGiving,
}) => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('Mwanaume');
  const [dob, setDob] = useState('1998-05-15');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [residence, setResidence] = useState('');
  const [department, setDepartment] = useState('Umoja wa Vijana');
  const [maritalStatus, setMaritalStatus] = useState<'Hajaoa / Hajaolewa' | 'Ameoa / Ameolewa' | 'Mjane'>('Hajaoa / Hajaolewa');
  const [baptismStatus, setBaptismStatus] = useState<'Amebatizwa' | 'Bado Hajabatizwa'>('Amebatizwa');
  const [notes, setNotes] = useState('');

  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  // Live calculation of age & demographic group
  const currentAge = dob ? calculateAge(dob) : 0;
  const currentCategory = getAgeCategory(currentAge);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !dob) return;

    const newMember: Member = {
      id: 'm-' + Date.now(),
      fullName: fullName.trim(),
      gender,
      dob,
      phone: phone.trim(),
      email: email.trim(),
      residence: residence.trim() || 'Dar es Salaam',
      department,
      maritalStatus,
      baptismStatus,
      registeredAt: new Date().toISOString(),
      notes: notes.trim(),
    };

    onRegisterMember(newMember);
    setRegisteredMember(newMember);
    setShowSuccessCard(true);

    // Reset inputs
    setFullName('');
    setPhone('');
    setEmail('');
    setResidence('');
    setNotes('');
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Header kicker and title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-semibold tracking-wider uppercase text-blue-900 bg-blue-50 px-3 py-1 rounded-md">
          Utambuzi wa Washirika
        </span>
        <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
          Fomu ya Usajili wa Mshirika Kanisani
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Tafadhali jaza taarifa zako kwa usahihi ikijumuisha jinsia na tarehe ya kuzaliwa ili kuwezesha upangaji wa huduma na takwimu za uongozi wa kanisa.
        </p>
      </div>

      {showSuccessCard && registeredMember ? (
        /* Success & Member ID Card View */
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-6">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Hongera! Usajili Wako Umekamilika Salama</h4>
              <p className="text-xs text-emerald-800">
                Taarifa zako zimepokelewa katika kanzidata ya uongozi wa kanisa. Hiki hapa kitambulisho chako cha mshirika.
              </p>
            </div>
          </div>

          {/* Printable Church Member ID Card */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-2xl p-6 shadow-2xl border border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-blue-800/80 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 font-bold">
                  <Church className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">{settings.churchName}</h4>
                  <p className="text-[11px] text-amber-300/90 font-medium">KITAMBULISHO CHA MSHIRIKA</p>
                </div>
              </div>
              <IdCard className="w-6 h-6 text-blue-300" />
            </div>

            <div className="grid grid-cols-3 gap-4 items-center mb-4">
              <div className="col-span-1 flex flex-col items-center justify-center bg-blue-900/50 border border-blue-700/50 rounded-xl p-3 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-xl font-bold mb-1">
                  {registeredMember.fullName.charAt(0)}
                </div>
                <span className="text-[10px] text-blue-200 font-mono">ID: {registeredMember.id.slice(-6).toUpperCase()}</span>
              </div>

              <div className="col-span-2 space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Jina Kamili</span>
                  <span className="font-semibold text-white text-sm">{registeredMember.fullName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Jinsia</span>
                    <span className="font-medium text-blue-100">{registeredMember.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Umri / Kundi</span>
                    <span className="font-medium text-amber-300">
                      {calculateAge(registeredMember.dob)} miaka ({getAgeCategory(calculateAge(registeredMember.dob))})
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Idara / Kundi</span>
                  <span className="font-medium text-blue-100">{registeredMember.department}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-300">
              <span>Simu: {registeredMember.phone}</span>
              <span>Makazi: {registeredMember.residence}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrintCard}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Chapisha Kitambulisho
            </button>
            <button
              onClick={onGoToGiving}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Toa Sadaka / Fungu la Kumi Sasa
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSuccessCard(false)}
              className="px-4 py-2.5 text-xs font-medium text-blue-900 hover:underline cursor-pointer"
            >
              Sajili Mshirika Mwingine
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Personal info */}
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-900" />
                Taarifa Binafsi za Mshirika
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jina Kamili la Mshirika <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="mfano: Paulo Zakaria au Grace Neema"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>

                {/* Gender (Mwanaume / Mwanamke) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jinsia <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGender('Mwanaume');
                        if (currentCategory === 'Mtu Mzima') setDepartment('Wazee wa Kanisa');
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        gender === 'Mwanaume'
                          ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Mwanaume</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGender('Mwanamke');
                        if (currentCategory === 'Mtu Mzima') setDepartment('Umoja wa Wanawake');
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        gender === 'Mwanamke'
                          ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Mwanamke</span>
                    </button>
                  </div>
                </div>

                {/* Date of Birth & Live Classification */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Tarehe ya Kuzaliwa <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      Umri: {currentAge} miaka · {currentCategory}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={dob}
                      max="2026-10-24"
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {currentCategory === 'Mtoto' && 'Mtoto (Chini ya miaka 13) ataorodheshwa chini ya idara ya watoto/Sunday School.'}
                    {currentCategory === 'Kijana' && 'Kijana (Miaka 13 hadi 35) ataorodheshwa kwenye kundi la vijana.'}
                    {currentCategory === 'Mtu Mzima' && 'Mtu mzima (Zaidi ya miaka 35) ataorodheshwa kwenye wazee na jumuiya za wazazi.'}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nambari ya Simu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+255 754 000 000 au 0713..."
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Barua Pepe (Barua pepe si lazima)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jina@email.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Residence / Mtaa */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mtaa / Eneo la Makazi (Makazi) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={residence}
                      onChange={(e) => setResidence(e.target.value)}
                      placeholder="mfano: Mbezi Beach, Makonde, Sinza, Tegeta, n.k."
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Step 2: Church Department & Spiritual Details */}
            <div className="pt-2">
              <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Church className="w-4 h-4 text-blue-900" />
                Idara ya Kanisa na Huduma
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kundi / Idara ya Huduma
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    <option value="Umoja wa Vijana">Umoja wa Vijana (Youth)</option>
                    <option value="Kwaya Kuu">Kwaya Kuu</option>
                    <option value="Sunday School">Sunday School (Watoto)</option>
                    <option value="Umoja wa Wanawake">Umoja wa Wanawake</option>
                    <option value="Wanaume">Umoja wa Wanaume</option>
                    <option value="Wazee wa Kanisa">Wazee wa Kanisa / Baraza</option>
                    <option value="Kamati ya Ujenzi">Kamati ya Ujenzi na Miradi</option>
                    <option value="Huduma ya Maombi">Huduma ya Maombi & Maombezi</option>
                    <option value="Uinjilisti">Uinjilisti na Misaada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Hali ya Ndoa
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    <option value="Hajaoa / Hajaolewa">Hajaoa / Hajaolewa</option>
                    <option value="Ameoa / Ameolewa">Ameoa / Ameolewa</option>
                    <option value="Mjane">Mjane</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Hali ya Ubatizo
                  </label>
                  <select
                    value={baptismStatus}
                    onChange={(e) => setBaptismStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    <option value="Amebatizwa">Amebatizwa kwa Maji Mengi</option>
                    <option value="Bado Hajabatizwa">Bado Hajabatizwa (Anahitaji Ubatizo)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Maelezo ya Ziada / Ushirika Maalum (Hiari)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Mfano: Mwanafamilia wa kiongozi, ujuzi wa muziki, gitaa, ualimu wa watoto..."
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Data zako zitalindwa kwa uaminifu chini ya neno maalum la uongozi wa kanisa.
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                Kamilisha Usajili wa Mshirika
              </button>
            </div>

          </form>
        </div>
      )}

    </section>
  );
};
