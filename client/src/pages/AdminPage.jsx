import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Sliders,
  Award,
  PawPrint,
  HeartHandshake,
  Trash2,
  Edit2,
  Plus,
  AlertCircle,
  CheckCircle2,
  BarChart2,
  Building
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'animals' | 'shelters'

  // Modal for creating/editing animal
  const [isAnimalModalOpen, setIsAnimalModalOpen] = useState(false);
  const [animalForm, setAnimalForm] = useState({
    id: null,
    name: '',
    species: 'dog',
    breed: '',
    city: 'Mumbai',
    age_months: 12,
    gender: 'male',
    size: 'medium',
    description: '',
    photo_url: '',
    vaccinated: true,
    neutered: true
  });

  // Modal for creating/editing shelter
  const [isShelterModalOpen, setIsShelterModalOpen] = useState(false);
  const [shelterForm, setShelterForm] = useState({
    id: null,
    name: '',
    city: 'Mumbai',
    phone: '',
    email: '',
    website: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    async function loadAdminData() {
      setLoading(true);
      try {
        const [statsRes, animalsRes, sheltersRes] = await Promise.all([
          api.getAdminStats().catch(() => null),
          api.getAnimals().catch(() => ({ animals: [] })),
          api.getShelters().catch(() => ({ shelters: [] }))
        ]);

        if (statsRes) setStats(statsRes);
        if (animalsRes?.animals) setAnimals(animalsRes.animals);
        if (sheltersRes?.shelters) setShelters(sheltersRes.shelters);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-sand-900">Administrator Access Required</h2>
        <p className="text-xs text-sand-800">
          This portal is reserved for shelter coordinators and platform administrators.
        </p>
        <button
          onClick={() => {
            localStorage.setItem('pawmatch_token', '');
            window.location.href = '/auth';
          }}
          className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
        >
          Sign In as Demo Admin
        </button>
      </div>
    );
  }

  // --- Animal CRUD handlers ---
  async function handleSaveAnimal(e) {
    e.preventDefault();
    try {
      if (animalForm.id) {
        await api.updateAnimal(animalForm.id, animalForm);
      } else {
        await api.createAnimal(animalForm);
      }
      setIsAnimalModalOpen(false);
      const res = await api.getAnimals();
      setAnimals(res.animals || []);
    } catch (err) {
      alert('Error saving animal: ' + err.message);
    }
  }

  async function handleDeleteAnimal(id) {
    if (window.confirm('Are you sure you want to delete this adoptable animal?')) {
      try {
        await api.deleteAnimal(id);
        setAnimals(animals.filter((a) => a.id !== id));
      } catch (err) {
        alert('Failed to delete animal: ' + err.message);
      }
    }
  }

  // --- Shelter CRUD handlers ---
  async function handleSaveShelter(e) {
    e.preventDefault();
    try {
      if (shelterForm.id) {
        await api.updateShelter(shelterForm.id, shelterForm);
      } else {
        await api.createShelter(shelterForm);
      }
      setIsShelterModalOpen(false);
      const res = await api.getShelters();
      setShelters(res.shelters || []);
    } catch (err) {
      alert('Error saving shelter: ' + err.message);
    }
  }

  async function handleDeleteShelter(id) {
    if (window.confirm('Are you sure you want to delete this shelter?')) {
      try {
        await api.deleteShelter(id);
        setShelters(shelters.filter((s) => s.id !== id));
      } catch (err) {
        alert('Failed to delete shelter: ' + err.message);
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-200 text-sand-900 text-xs font-bold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
            Platform Administration
          </h1>
          <p className="text-sm text-sand-800 mt-1">
            Real-time assessment metrics, adoptable animal inventory, and shelter listings.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-sand-100 p-1.5 rounded-2xl border border-sand-200">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'stats' ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-800 hover:text-sand-900'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('animals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'animals' ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-800 hover:text-sand-900'
            }`}
          >
            Animals ({animals.length})
          </button>
          <button
            onClick={() => setActiveTab('shelters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'shelters' ? 'bg-white text-sand-900 shadow-sm' : 'text-sand-800 hover:text-sand-900'
            }`}
          >
            Shelters ({shelters.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Stats & Overview */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          
          {/* Top Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card">
              <span className="block text-xs font-bold text-sand-800 uppercase tracking-wider mb-1">Total Assessments</span>
              <span className="text-3xl font-black text-brand-600">{stats?.totalAssessments || 0}</span>
              <span className="text-[10px] text-sand-800 block mt-1">Run across urban India</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card">
              <span className="block text-xs font-bold text-sand-800 uppercase tracking-wider mb-1">Adoptable Animals</span>
              <span className="text-3xl font-black text-emerald-600">{animals.length}</span>
              <span className="text-[10px] text-sand-800 block mt-1">Active shelter rescues</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card">
              <span className="block text-xs font-bold text-sand-800 uppercase tracking-wider mb-1">Verified Shelters</span>
              <span className="text-3xl font-black text-sand-900">{shelters.length}</span>
              <span className="text-[10px] text-sand-800 block mt-1">Across 8 major cities</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-card">
              <span className="block text-xs font-bold text-sand-800 uppercase tracking-wider mb-1">Native Breeds Bonus</span>
              <span className="text-3xl font-black text-brand-600">+6 pts</span>
              <span className="text-[10px] text-sand-800 block mt-1">Active Indian context modifier</span>
            </div>
          </div>

          {/* Tier Distribution & Popular Breeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-card space-y-4">
              <h3 className="font-extrabold text-lg text-sand-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-brand-600" />
                <span>Compatibility Tier Distribution</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                {Object.entries(stats?.tierDistribution || {}).map(([tier, count]) => (
                  <div key={tier} className="bg-sand-50 p-3 rounded-2xl border border-sand-200 flex justify-between items-center">
                    <span className="font-bold text-sand-900">{tier}</span>
                    <span className="px-3 py-1 rounded-full bg-sand-200 text-sand-900 font-extrabold text-xs">
                      {count} matches
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-card space-y-4">
              <h3 className="font-extrabold text-lg text-sand-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Most Frequently Matched Breeds</span>
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                {(stats?.popularPets || []).length === 0 ? (
                  <p className="text-xs text-sand-800 italic">No assessment history yet.</p>
                ) : (
                  (stats?.popularPets || []).map((p, idx) => (
                    <div key={idx} className="bg-sand-50 p-3 rounded-2xl border border-sand-200 flex justify-between items-center">
                      <span className="font-bold text-sand-900">#{idx + 1} {p.name}</span>
                      <span className="text-xs text-brand-700 font-bold">{p.count} times top match</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Animals Inventory */}
      {activeTab === 'animals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-sand-900">Manage Adoptable Animals</h2>
            <button
              onClick={() => {
                setAnimalForm({
                  id: null,
                  name: '',
                  species: 'dog',
                  breed: 'Indian Pariah',
                  city: 'Mumbai',
                  age_months: 12,
                  gender: 'male',
                  size: 'medium',
                  description: '',
                  photo_url: '',
                  vaccinated: true,
                  neutered: true
                });
                setIsAnimalModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Animal</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-sand-200 shadow-card overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-50 border-b border-sand-200 text-sand-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 font-bold">Animal</th>
                  <th className="p-4 font-bold">Breed / Species</th>
                  <th className="p-4 font-bold">City</th>
                  <th className="p-4 font-bold">Age</th>
                  <th className="p-4 font-bold">Health</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {animals.map((anim) => (
                  <tr key={anim.id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-4 font-bold text-sand-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sand-200 overflow-hidden flex-shrink-0">
                        {anim.photo_url ? (
                          <img src={anim.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <PawPrint className="w-4 h-4 text-sand-800 m-2" />
                        )}
                      </div>
                      <span>{anim.name}</span>
                    </td>
                    <td className="p-4 text-sand-800">
                      <span className="font-semibold text-sand-900 block">{anim.breed}</span>
                      <span className="capitalize">{anim.species}</span>
                    </td>
                    <td className="p-4 text-sand-800">{anim.city}</td>
                    <td className="p-4 text-sand-800">~{Math.round(anim.age_months / 12 * 10) / 10} yrs</td>
                    <td className="p-4 text-emerald-800 font-medium">
                      {anim.vaccinated ? 'Vaccinated' : ''} {anim.neutered ? '• Neutered' : ''}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setAnimalForm(anim);
                          setIsAnimalModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-sand-200 text-sand-800 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAnimal(anim.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Shelters Inventory */}
      {activeTab === 'shelters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-sand-900">Manage Partner Shelters</h2>
            <button
              onClick={() => {
                setShelterForm({
                  id: null,
                  name: '',
                  city: 'Mumbai',
                  phone: '',
                  email: '',
                  website: '',
                  address: '',
                  description: ''
                });
                setIsShelterModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-soft transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Shelter</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shelters.map((sh) => (
              <div key={sh.id} className="bg-white p-5 rounded-2xl border border-sand-200 shadow-card space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-brand-600">{sh.city}</span>
                    <h4 className="font-extrabold text-base text-sand-900">{sh.name}</h4>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setShelterForm(sh);
                        setIsShelterModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-sand-100 text-sand-800"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteShelter(sh.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sand-800">{sh.address}</p>
                <div className="flex flex-wrap gap-3 pt-2 border-t border-sand-100 text-sand-800">
                  <span>Phone: <strong>{sh.phone}</strong></span>
                  <span>Email: <strong>{sh.email}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Animal Add/Edit Modal */}
      {isAnimalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-sand-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-xl text-sand-900">
              {animalForm.id ? 'Edit Adoptable Animal' : 'Add New Adoptable Animal'}
            </h3>

            <form onSubmit={handleSaveAnimal} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-sand-900 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={animalForm.name}
                  onChange={(e) => setAnimalForm({ ...animalForm, name: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Species</label>
                  <select
                    value={animalForm.species}
                    onChange={(e) => setAnimalForm({ ...animalForm, species: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="small_pet">Small Pet</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Breed</label>
                  <input
                    type="text"
                    required
                    value={animalForm.breed}
                    onChange={(e) => setAnimalForm({ ...animalForm, breed: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-sand-900 mb-1">City</label>
                  <select
                    value={animalForm.city}
                    onChange={(e) => setAnimalForm({ ...animalForm, city: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  >
                    {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Age (Months)</label>
                  <input
                    type="number"
                    value={animalForm.age_months}
                    onChange={(e) => setAnimalForm({ ...animalForm, age_months: Number(e.target.value) })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Gender</label>
                  <select
                    value={animalForm.gender}
                    onChange={(e) => setAnimalForm({ ...animalForm, gender: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={animalForm.photo_url}
                  onChange={(e) => setAnimalForm({ ...animalForm, photo_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Description</label>
                <textarea
                  value={animalForm.description}
                  onChange={(e) => setAnimalForm({ ...animalForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAnimalModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-sand-300 text-xs font-bold text-sand-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold"
                >
                  Save Animal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shelter Add/Edit Modal */}
      {isShelterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-sand-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-xl text-sand-900">
              {shelterForm.id ? 'Edit Partner Shelter' : 'Add New Shelter'}
            </h3>

            <form onSubmit={handleSaveShelter} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-sand-900 mb-1">Shelter Name</label>
                <input
                  type="text"
                  required
                  value={shelterForm.name}
                  onChange={(e) => setShelterForm({ ...shelterForm, name: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-sand-900 mb-1">City</label>
                  <select
                    value={shelterForm.city}
                    onChange={(e) => setShelterForm({ ...shelterForm, city: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  >
                    {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sand-900 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={shelterForm.phone}
                    onChange={(e) => setShelterForm({ ...shelterForm, phone: e.target.value })}
                    className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={shelterForm.email}
                  onChange={(e) => setShelterForm({ ...shelterForm, email: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Website</label>
                <input
                  type="url"
                  value={shelterForm.website}
                  onChange={(e) => setShelterForm({ ...shelterForm, website: e.target.value })}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div>
                <label className="block font-bold text-sand-900 mb-1">Physical Address</label>
                <textarea
                  value={shelterForm.address}
                  onChange={(e) => setShelterForm({ ...shelterForm, address: e.target.value })}
                  rows={2}
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sand-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShelterModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-sand-300 text-xs font-bold text-sand-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold"
                >
                  Save Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
