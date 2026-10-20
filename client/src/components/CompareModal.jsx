import React from 'react';
import { X, Check, Award, AlertCircle, IndianRupee, Sparkles } from 'lucide-react';

export default function CompareModal({ isOpen, onClose, selectedPets = [], onRemovePet }) {
  if (!isOpen || selectedPets.length === 0) return null;

  const DIMENSIONS = [
    { key: 'energy_level', label: 'Energy & Exercise', max: 5 },
    { key: 'space_demand', label: 'Space Demand', max: 5 },
    { key: 'time_attention_demand', label: 'Time & Attention', max: 5 },
    { key: 'grooming_demand', label: 'Grooming Bandwidth', max: 5 },
    { key: 'heat_tolerance', label: 'Indian Heat Tolerance', max: 5 },
    { key: 'base_monthly_cost_inr', label: 'Base Monthly Cost', isCost: true },
    { key: 'max_alone_hours', label: 'Max Safe Alone Hours', isHours: true },
    { key: 'apartment_friendly', label: 'Apartment Friendly', isBool: true }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-sand-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-sand-200 flex items-center justify-between bg-sand-50">
          <div>
            <h3 className="font-extrabold text-lg text-sand-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <span>Side-by-Side Pet Comparison ({selectedPets.length}/3)</span>
            </h3>
            <p className="text-xs text-sand-800">Compare behavioral demands, Indian climate fit, and ownership costs.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-sand-800 hover:bg-sand-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table / Columns */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[650px]">
            {selectedPets.map((item) => {
              const pet = item.pet || item;
              const score = item.matchScore;
              const tier = item.tier;

              return (
                <div key={pet.id} className="bg-sand-50 rounded-2xl p-5 border border-sand-200 relative flex flex-col">
                  {/* Remove button */}
                  <button
                    onClick={() => onRemovePet(pet.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 hover:bg-red-50 text-sand-800 hover:text-red-600 transition-colors shadow-sm"
                    title="Remove from comparison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Header info */}
                  <div className="pr-8 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      {pet.is_native && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Award className="w-3 h-3" /> Native Indie
                        </span>
                      )}
                      <span className="text-xs text-sand-800 capitalize font-medium">{pet.species}</span>
                    </div>
                    <h4 className="font-bold text-base text-sand-900">{pet.name}</h4>
                  </div>

                  {/* Match score pill if evaluated */}
                  {score !== undefined && (
                    <div className="mb-4 bg-white rounded-xl p-3 border border-sand-200 flex items-center justify-between">
                      <span className="text-xs text-sand-800 font-medium">Match Score</span>
                      <div className="text-right">
                        <span className="font-black text-lg text-brand-600">{score}%</span>
                        <span className="block text-[10px] text-sand-800 font-semibold">{tier}</span>
                      </div>
                    </div>
                  )}

                  {/* Attribute Bars */}
                  <div className="space-y-3.5 flex-1">
                    {DIMENSIONS.map((dim) => {
                      const val = pet[dim.key];

                      return (
                        <div key={dim.key} className="text-xs">
                          <div className="flex justify-between text-sand-800 mb-1">
                            <span>{dim.label}</span>
                            <span className="font-bold text-sand-900">
                              {dim.isCost
                                ? `₹${val?.toLocaleString('en-IN')}/mo`
                                : dim.isHours
                                ? `${val} hrs/day`
                                : dim.isBool
                                ? val ? 'Yes' : 'No'
                                : `${val} / 5`}
                            </span>
                          </div>

                          {!dim.isCost && !dim.isHours && !dim.isBool && (
                            <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  dim.key === 'heat_tolerance' && val >= 4
                                    ? 'bg-emerald-500'
                                    : 'bg-brand-500'
                                }`}
                                style={{ width: `${(val / dim.max) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sand-200 bg-sand-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-sand-900 text-white font-bold text-sm hover:bg-sand-800 transition-colors"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
}
