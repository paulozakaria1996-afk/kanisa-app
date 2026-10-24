import React from 'react';
import { Member, Donation, ChurchSettings, calculateAge, getAgeCategory } from '../types/church';
import { User, Phone, Mail, MapPin, Calendar, HeartHandshake, CheckCircle2, Church, IdCard, Printer } from 'lucide-react';

interface MemberProfileSectionProps {
  member: Member;
  donations: Donation[];
  settings: ChurchSettings;
  onGoToGiving: () => void;
  onLogout: () => void;
}

export const MemberProfileSection: React.FC<MemberProfileSectionProps> = ({
  member,
  donations,
  settings,
  onGoToGiving,
  onLogout,
}) => {
  const age = calculateAge(member.dob);
  const category = getAgeCategory(age);
  const myDonations = donations.filter(d => 
    d.memberPhone.replace(/\s+/g, '') === member.phone.replace(/\s+/g, '') ||
    d.memberName.toLowerCase() === member.fullName.toLowerCase()
  );
  const totalGiven = myDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            {member.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded">
                Mshirika
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ID: {member.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{member.fullName}</h2>
            <p className="text-xs text-slate-500">{member.department} · {member.residence}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToGiving}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
          >
            Toa Sadaka Sasa
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Toka
          </button>
        </div>
      </div>

      {/* Member Card Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-900" />
            Taarifa Binafsi
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Jinsia:</span>
              <span className="font-semibold text-slate-800">{member.gender}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Tarehe ya Kuzaliwa:</span>
              <span className="font-mono text-slate-800">{member.dob}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Umri na Kundi:</span>
              <span className="font-bold text-amber-700">{age} miaka ({category})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nambari ya Simu:</span>
              <span className="font-mono text-slate-800">{member.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Makazi:</span>
              <span className="text-slate-800">{member.residence}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Idara / Huduma:</span>
              <span className="font-semibold text-blue-900">{member.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Tarehe ya Kujiunga:</span>
              <span className="font-mono text-slate-800">{member.registeredAt.split('T')[0]}</span>
            </div>
          </div>
        </div>

        {/* Giving Record */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              Sadaka Zangu Mtandaoni
            </h3>
            <span className="font-mono font-bold text-xs text-blue-900">
              Jumla: {totalGiven.toLocaleString()} {settings.currency}
            </span>
          </div>

          <div className="space-y-2.5">
            {myDonations.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Bado hujatoa sadaka kwa njia ya mtandao. Bonyeza 'Toa Sadaka Sasa' ili kutoa fungu la kumi au sadaka ya shukrani.
              </p>
            ) : (
              myDonations.map((don) => (
                <div key={don.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">{don.category}</span>
                    <span className="text-[11px] text-slate-500">{don.paymentMethod} · {don.receiptNo}</span>
                  </div>
                  <span className="font-mono font-bold text-blue-900">
                    {don.amount.toLocaleString()} {settings.currency}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
