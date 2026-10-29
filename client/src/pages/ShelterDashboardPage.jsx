import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Plus,
  Eye,
  MessageSquare,
  Trash2,
  Edit,
  CreditCard,
  AlertCircle,
  Building2,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';

export default function ShelterDashboardPage() {
  const { user, isShelter, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [shelter, setShelter] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add/Edit Pet Modal State
  const [showPetModal, setShowPetModal] = useState(false);
  const [editingPetId, setEditingPetId] = useState(null);
  const [petForm, setPetForm] = useState({
    name: '',
    species: 'dog',
    breed: 'Indian Pariah Dog (Desi)',
    age_months: 12,
    gender: 'female',
    size: 'medium',
    city: 'Mumbai',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    is_vaccinated: true,
    is_neutered: true
  });
  const [savingPet, setSavingPet] = useState(false);

  // Inquiries Modal State
  const [activePetInquiries, setActivePetInquiries] = useState(null); // { pet, inquiries: [] }
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Upgrade Plan Modal State
  const [upgradeModal, setUpgradeModal] = useState(null); // { order }
  const [upgradeStatus, setUpgradeStatus] = useState('');

  useEffect(() => {
    if (!user || (!isShelter && user.role !== 'admin')) {
      navigate('/auth?redirect=/shelter/dashboard');
      return;
    }
    loadDashboardData();
  }, [user, isShelter]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const data = await api.getShelterDashboard();
      setShelter(data.shelter);
      setPets(data.pets || []);
    } catch (err) {
      setError(err.message || 'Failed to load shelter dashboard');
    } finally {
      setLoading(false);
    }
  }

  function openCreatePetModal() {
    setEditingPetId(null);
    setPetForm({
      name: '',
      species: 'dog',
      breed: 'Indian Pariah Dog (Desi)',
      age_months: 12,
      gender: 'female',
      size: 'medium',
      city: shelter?.city || 'Mumbai',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
      is_vaccinated: true,
      is_neutered: true
    });
    setShowPetModal(true);
  }

  function openEditPetModal(pet) {
    setEditingPetId(pet.id);
    setPetForm({
      name: pet.name || '',
      species: pet.species || 'dog',
      breed: pet.breed || '',
      age_months: pet.age_months || 12,
      gender: pet.gender || 'female',
      size: pet.size || 'medium',
      city: pet.city || shelter?.city || 'Mumbai',
      description: pet.description || '',
      image_url: pet.image_url || '',
      is_vaccinated: pet.is_vaccinated !== false,
      is_neutered: pet.is_neutered !== false
    });
    setShowPetModal(true);
  }

  async function handleSavePet(e) {
    e.preventDefault();
    setSavingPet(true);
    try {
      if (editingPetId) {
        await api.updateShelterPet(editingPetId, petForm);
      } else {
        await api.createShelterPet(petForm);
      }
      setShowPetModal(false);
      await loadDashboardData();
    } catch (err) {
      alert('Error saving pet: ' + err.message);
    } finally {
      setSavingPet(false);
    }
  }

  async function handleDeletePet(petId) {
    if (!confirm('Are you sure you want to remove this adoptable pet listing?')) return;
    try {
      await api.deleteShelterPet(petId);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to delete pet: ' + err.message);
    }
  }

  async function handleViewInquiries(pet) {
    setLoadingInquiries(true);
    try {
      const data = await api.getPetInquiries(pet.id);
      setActivePetInquiries({ pet, inquiries: data.inquiries || [] });
    } catch (err) {
      alert('Failed to fetch inquiries: ' + err.message);
    } finally {
      setLoadingInquiries(false);
    }
  }

  async function handleStartUpgrade() {
    try {
      const order = await api.createShelterPlanOrder();
      setUpgradeModal({ order });
      setUpgradeStatus('ready');
    } catch (err) {
      alert('Failed to initialize upgrade: ' + err.message);
    }
  }

  async function handleConfirmMockUpgrade(shouldSucceed = true) {
    if (!upgradeModal) return;
    setUpgradeStatus('processing');
    try {
      const res = await api.verifyShelterPlan({
        orderId: upgradeModal.order.orderId,
        simulateFail: !shouldSucceed
      });
      if (res.success) {
        setUpgradeStatus('success');
        await loadDashboardData();
        await refreshUser();
      } else {
        setUpgradeStatus('failed');
      }
    } catch (err) {
      setUpgradeStatus('failed');
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <h2 className="text-lg font-bold text-sand-900">Loading Shelter Portal...</h2>
      </div>
    );
  }

  const isFeatured = shelter?.plan === 'featured';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-brand-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Shelter Partner Dashboard
            </span>
            {shelter?.verified ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 text-[11px] font-black flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Shelter
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold">
                Verification Pending
              </span>
            )}
            {isFeatured && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-amber-950 text-[11px] font-black flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured Listing Active
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{shelter?.name || user?.name}</h1>
          <p className="text-white/90 text-xs sm:text-sm">
            {shelter?.city} • {shelter?.contact_email} • {shelter?.contact_phone || 'Phone pending'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isFeatured && (
            <button
              onClick={handleStartUpgrade}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Featured (₹999/mo)</span>
            </button>
          )}
          <button
            onClick={openCreatePetModal}
            className="px-5 py-2.5 rounded-2xl bg-white text-brand-700 hover:bg-sand-50 font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>List New Pet</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-xs font-bold text-sand-800 uppercase tracking-wider">Active Listings</span>
          <div className="text-3xl font-black text-sand-900">{pets.length}</div>
          <p className="text-[11px] text-sand-800">Free unlimited listings always guaranteed</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-xs font-bold text-sand-800 uppercase tracking-wider">Total Adopter Views</span>
          <div className="text-3xl font-black text-brand-600">
            {pets.reduce((acc, p) => acc + (p.views || 0), 0)}
          </div>
          <p className="text-[11px] text-sand-800">Aggregated via MongoDB view logs</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-card space-y-1">
          <span className="text-xs font-bold text-sand-800 uppercase tracking-wider">Adoption Inquiries</span>
          <div className="text-3xl font-black text-emerald-600">
            {pets.reduce((acc, p) => acc + (p.inquiryCount || 0), 0)}
          </div>
          <p className="text-[11px] text-sand-800">Inbound leads saved in Neon SQL</p>
        </div>
      </div>

      {/* Pets Table */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-sand-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-sand-900">Your Listed Adoptable Animals</h2>
            <p className="text-xs text-sand-800">Track views, click-throughs, and adopter inquiries.</p>
          </div>
          <button
            onClick={openCreatePetModal}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
          >
            + Add Another Pet
          </button>
        </div>

        {pets.length === 0 ? (
          <div className="p-12 text-center text-xs text-sand-800 space-y-3">
            <HeartHandshake className="w-10 h-10 text-sand-800 mx-auto" />
            <p>You haven't listed any pets yet. Basic listings are 100% free!</p>
            <button
              onClick={openCreatePetModal}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
            >
              List Your First Animal
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50/80 border-b border-sand-200 text-sand-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Pet</th>
                  <th className="p-4">Breed & City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Inquiries</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {pets.map((pet) => (
                  <tr key={pet.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={pet.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100'}
                        alt={pet.name}
                        className="w-10 h-10 rounded-xl object-cover border border-sand-200"
                      />
                      <div>
                        <span className="font-extrabold text-sand-900 text-sm block">{pet.name}</span>
                        <span className="text-sand-800 capitalize text-[11px]">{pet.gender} • {pet.age_months}m</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-sand-900 block">{pet.breed}</span>
                      <span className="text-sand-800 text-[11px]">{pet.city}</span>
                    </td>
                    <td className="p-4">
                      {isFeatured ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1 w-max">
                          <Sparkles className="w-2.5 h-2.5" /> Featured Top
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-sand-100 text-sand-800 font-bold text-[10px] w-max block">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-sand-900">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-sand-700" />
                        {pet.views || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleViewInquiries(pet)}
                        className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{pet.inquiryCount || 0} Inquiries</span>
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditPetModal(pet)}
                        className="p-1.5 text-sand-800 hover:text-brand-600 rounded-lg hover:bg-sand-100 transition-colors"
                        title="Edit Pet"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        className="p-1.5 text-sand-800 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Pet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Pet Modal */}
      {showPetModal && (
        <div className="fixed inset-0 z-50 bg-sand-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-sand-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <h3 className="font-extrabold text-sand-900 text-base">
                {editingPetId ? 'Edit Pet Profile' : 'List New Adoptable Pet'}
              </h3>
              <button
                onClick={() => setShowPetModal(false)}
                className="text-sand-700 hover:text-sand-900 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePet} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-800 font-bold mb-1">Pet Name</label>
                  <input
                    type="text"
                    required
                    value={petForm.name}
                    onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                  />
                </div>
                <div>
                  <label className="block text-sand-800 font-bold mb-1">Species</label>
                  <select
                    value={petForm.species}
                    onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sand-800 font-bold mb-1">Breed / Mix</label>
                  <input
                    type="text"
                    required
                    value={petForm.breed}
                    onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                  />
                </div>
                <div>
                  <label className="block text-sand-800 font-bold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={petForm.city}
                    onChange={(e) => setPetForm({ ...petForm, city: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sand-800 font-bold mb-1">Age (Months)</label>
                  <input
                    type="number"
                    min="1"
                    value={petForm.age_months}
                    onChange={(e) => setPetForm({ ...petForm, age_months: Number(e.target.value) })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                  />
                </div>
                <div>
                  <label className="block text-sand-800 font-bold mb-1">Gender</label>
                  <select
                    value={petForm.gender}
                    onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sand-800 font-bold mb-1">Size</label>
                  <select
                    value={petForm.size}
                    onChange={(e) => setPetForm({ ...petForm, size: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sand-800 font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={petForm.image_url}
                  onChange={(e) => setPetForm({ ...petForm, image_url: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                />
              </div>

              <div>
                <label className="block text-sand-800 font-bold mb-1">Story & Personality</label>
                <textarea
                  rows="3"
                  value={petForm.description}
                  onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
                  placeholder="Describe energy level, socialization with kids/cats, leash training..."
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl px-3 py-2 text-sand-900"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petForm.is_vaccinated}
                    onChange={(e) => setPetForm({ ...petForm, is_vaccinated: e.target.checked })}
                    className="accent-brand-500 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-sand-800">Vaccinated</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petForm.is_neutered}
                    onChange={(e) => setPetForm({ ...petForm, is_neutered: e.target.checked })}
                    className="accent-brand-500 w-4 h-4 rounded"
                  />
                  <span className="font-semibold text-sand-800">Neutered / Spayed</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-sand-200">
                <button
                  type="button"
                  onClick={() => setShowPetModal(false)}
                  className="px-4 py-2 rounded-xl bg-sand-200 text-sand-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPet}
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold"
                >
                  {savingPet ? 'Saving...' : editingPetId ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inquiries Inspector Modal */}
      {activePetInquiries && (
        <div className="fixed inset-0 z-50 bg-sand-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-sand-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div>
                <h3 className="font-extrabold text-sand-900 text-base">
                  Inquiries for {activePetInquiries.pet.name}
                </h3>
                <span className="text-[11px] text-sand-800">
                  {activePetInquiries.inquiries.length} prospective adopters
                </span>
              </div>
              <button
                onClick={() => setActivePetInquiries(null)}
                className="text-sand-700 hover:text-sand-900 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {activePetInquiries.inquiries.length === 0 ? (
              <p className="text-xs text-sand-800 text-center py-6">
                No inquiries submitted yet for this pet.
              </p>
            ) : (
              <div className="space-y-3">
                {activePetInquiries.inquiries.map((inq) => (
                  <div key={inq.id} className="p-4 rounded-2xl bg-sand-50 border border-sand-200 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-sand-900 text-sm block">{inq.adopter_name}</span>
                        <span className="text-sand-800 text-[11px]">{inq.adopter_email} • {inq.adopter_phone}</span>
                      </div>
                      <span className="text-[10px] text-sand-700">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sand-800 bg-white p-2.5 rounded-xl border border-sand-200 leading-relaxed italic">
                      "{inq.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Plan Upgrade Modal */}
      {upgradeModal && (
        <div className="fixed inset-0 z-50 bg-sand-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-sand-200">
            <div className="flex items-center justify-between border-b border-sand-200 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-sand-900 text-base">Upgrade to Featured Shelter</h3>
              </div>
              <button
                onClick={() => setUpgradeModal(null)}
                className="text-sand-700 hover:text-sand-900 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-amber-900">Plan Duration:</span>
                <span className="font-bold text-amber-950">30 Days Featured</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-900">Total Fee:</span>
                <span className="font-black text-amber-950">₹999 INR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-900">Mode:</span>
                <span className="font-bold text-emerald-800 uppercase text-[10px]">Test Sandbox</span>
              </div>
            </div>

            {upgradeStatus === 'processing' && (
              <div className="py-6 text-center space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-sand-800">Authorizing simulated test upgrade...</p>
              </div>
            )}

            {upgradeStatus === 'success' && (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-black text-sand-900">Featured Tier Activated!</h4>
                <p className="text-xs text-sand-800">
                  All your adoptable animals now display a Featured badge and sort to the top of the search catalog.
                </p>
                <button
                  onClick={() => setUpgradeModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}

            {upgradeStatus === 'ready' && (
              <div className="space-y-3">
                <p className="text-xs text-sand-800 leading-relaxed text-center">
                  Rule 4: All payments operate in TEST/MOCK mode. Choose the outcome to simulate:
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleConfirmMockUpgrade(true)}
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-soft transition-colors"
                  >
                    Simulate Payment Success (₹999)
                  </button>
                  <button
                    onClick={() => handleConfirmMockUpgrade(false)}
                    className="w-full py-2.5 rounded-2xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs"
                  >
                    Simulate Payment Failure
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
