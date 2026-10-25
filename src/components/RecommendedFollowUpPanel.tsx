import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  MessageSquare,
  ChevronRight,
  Info
} from 'lucide-react';
import { FollowUpItem } from '../types';

interface RecommendedFollowUpPanelProps {
  followUps: FollowUpItem[];
}

export const RecommendedFollowUpPanel: React.FC<RecommendedFollowUpPanelProps> = ({
  followUps
}) => {
  const tier1Emergency = followUps.filter(f => f.urgencyTier === 1);
  const tier2Prompt = followUps.filter(f => f.urgencyTier === 2);
  const tier3Routine = followUps.filter(f => f.urgencyTier === 3);

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Recommended Clinical Follow-Up Tiers
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized into evidence-based clinical urgency tiers to help prioritize scheduling.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Tier 1: Emergency (Only rendered when warranted!) */}
        {tier1Emergency.length > 0 && (
          <div className="bg-red-50 rounded-2xl border border-red-300 p-5 shadow-xs">
            <div className="flex items-center space-x-2 text-red-900 mb-3 pb-2 border-b border-red-200">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-red-800">
                Tier 1: Immediate or Emergency Clinical Attention
              </h3>
            </div>
            <div className="space-y-3">
              {tier1Emergency.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 border border-red-200 text-xs">
                  <p className="font-bold text-red-900 text-sm mb-1">{item.finding}</p>
                  <p className="text-slate-700 mb-2">{item.whyItDeservesAttention}</p>
                  <p className="text-red-800 font-semibold mb-1">Action: {item.whatToDiscuss}</p>
                  <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    Timeframe: {item.suggestedTimeframe}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier 2: Prompt Clinical Review */}
        {tier2Prompt.length > 0 && (
          <div className="bg-orange-50/70 rounded-2xl border border-orange-200/90 p-5 shadow-2xs">
            <div className="flex items-center space-x-2 text-orange-950 mb-3 pb-2 border-b border-orange-200">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-orange-900">
                Tier 2: Prompt Clinical Review (Within 1 to 2 Weeks)
              </h3>
            </div>
            <div className="space-y-3">
              {tier2Prompt.map(item => (
                <div key={item.id} className="bg-white rounded-xl p-4 border border-orange-200/80 text-xs">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-slate-900 text-sm">{item.finding}</p>
                    <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded border border-orange-300">
                      {item.suggestedTimeframe}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-2 leading-relaxed">{item.whyItDeservesAttention}</p>
                  <div className="bg-orange-50/60 p-2.5 rounded-lg border border-orange-100 text-orange-950">
                    <span className="font-semibold text-orange-900">Suggested Discussion: </span>
                    <span>{item.whatToDiscuss}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier 3: Routine Discussion & Monitoring */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                Tier 3: Routine Appointment Discussion & Preventive Monitoring
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Standard follow-up visit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {tier3Routine.map(item => (
              <div key={item.id} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-slate-900">{item.finding}</p>
                  </div>
                  <p className="text-slate-600 mb-2 leading-relaxed">
                    {item.whyItDeservesAttention}
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                  <span className="font-semibold text-teal-800 block text-[11px] mb-0.5">Physician Discussion Goal:</span>
                  <span className="text-slate-700">{item.whatToDiscuss}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
