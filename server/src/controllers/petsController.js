import { PetContent } from '../models/index.js';
import { getAllBreedsData } from '../services/breedService.js';

export async function getPets(req, res) {
  try {
    const { species, size, energy, budgetBand, isNative, apartmentFriendly, search } = req.query;

    let pets = await getAllBreedsData();

    if (species && species !== 'all') {
      const sp = species.toLowerCase();
      if (sp === 'rabbit' || sp === 'small_pet') {
        pets = pets.filter(p => ['rabbit', 'guinea-pig', 'hamster', 'exotic-mammal', 'small_pet'].includes(p.species.toLowerCase()));
      } else if (sp === 'fish' || sp === 'aquarium') {
        pets = pets.filter(p => ['fish', 'turtle', 'reptile', 'aquatic'].includes(p.species.toLowerCase()));
      } else {
        pets = pets.filter(p => p.species.toLowerCase() === sp);
      }
    }
    if (size && size !== 'all') {
      pets = pets.filter(p => p.size.toLowerCase() === size.toLowerCase());
    }
    if (energy && energy !== 'all') {
      const e = parseInt(energy, 10);
      pets = pets.filter(p => p.energy_level === e);
    }
    if (budgetBand && budgetBand !== 'all') {
      pets = pets.filter(p => p.budget_band.toLowerCase() === budgetBand.toLowerCase());
    }
    if (isNative !== undefined) {
      const nat = isNative === 'true' || isNative === true;
      pets = pets.filter(p => Boolean(p.is_native) === nat);
    }
    if (apartmentFriendly !== undefined) {
      const apt = apartmentFriendly === 'true' || apartmentFriendly === true;
      pets = pets.filter(p => Boolean(p.apartment_friendly) === apt);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      pets = pets.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.breed && p.breed.toLowerCase().includes(q)) ||
        (p.species && p.species.toLowerCase().includes(q))
      );
    }

    return res.json({ pets, total: pets.length });
  } catch (err) {
    console.error('Get pets error:', err);
    return res.status(500).json({ error: 'Failed to fetch pets' });
  }
}

export async function getPetBySlug(req, res) {
  try {
    const { slug } = req.params;
    const allPets = await getAllBreedsData();

    const pet = allPets.find(p => p.slug === slug || p.slug === slug.toLowerCase());
    if (!pet) {
      return res.status(404).json({ error: 'Pet profile not found' });
    }

    // Optional rich Mongo content if present
    let richContent = null;
    try {
      richContent = await PetContent.findOne({ petSlug: slug });
    } catch (e) {
      // Non-blocking
    }

    return res.json({
      pet: {
        ...pet,
        richContent: richContent || null
      }
    });
  } catch (err) {
    console.error('Get pet by slug error:', err);
    return res.status(500).json({ error: 'Failed to fetch pet details' });
  }
}
