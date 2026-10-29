import { getDb } from '../db/index.js';
import { PRICING_CONFIG } from '../config/pricing.js';
import { createPaymentOrder, processPaymentVerification } from '../services/paymentService.js';

// Get available durations, pricing, and included features from config
export async function getTrialFosterPricing(req, res) {
  return res.json({
    config: PRICING_CONFIG.trialFoster
  });
}

// Initiate paid trial booking order
export async function createTrialBookingOrder(req, res) {
  try {
    const { animalId, petName, species = 'dog', durationDays = 7, startDate } = req.body;
    const durationOpt = PRICING_CONFIG.trialFoster.durations.find(d => d.days === parseInt(durationDays, 10))
      || PRICING_CONFIG.trialFoster.durations[0];

    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : null);

    const paymentOrder = await createPaymentOrder({
      userId,
      amountInr: durationOpt.feeInr,
      purpose: 'trial_foster',
      referenceId: animalId || 'general_trial'
    });

    return res.json({
      duration: durationOpt,
      included: PRICING_CONFIG.trialFoster.includedFeatures,
      paymentOrder
    });
  } catch (err) {
    console.error('Error creating trial booking order:', err);
    return res.status(500).json({ error: 'Failed to initiate trial foster booking' });
  }
}

// Verify payment and confirm trial foster booking
export async function confirmTrialBooking(req, res) {
  try {
    const {
      orderId,
      paymentId,
      animalId,
      petName = 'Indie Companion',
      species = 'dog',
      durationDays = 7,
      startDate,
      simulateFailure = false
    } = req.body;

    const paymentResult = await processPaymentVerification({
      orderId,
      paymentId,
      status: simulateFailure ? 'failed' : 'captured',
      simulatedFailure: simulateFailure
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Trial booking payment failed or simulated cancellation in test sandbox.',
        payment: paymentResult.payment
      });
    }

    const durationOpt = PRICING_CONFIG.trialFoster.durations.find(d => d.days === parseInt(durationDays, 10))
      || PRICING_CONFIG.trialFoster.durations[0];

    const db = getDb();
    const bookingId = 'tb_' + Math.random().toString(36).substr(2, 9);
    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : 'guest');

    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start.getTime() + durationOpt.days * 24 * 60 * 60 * 1000);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    // Initial milestone scheduled check-in timeline (Days 3, 7, 14)
    const initialTimeline = [
      { day: 3, label: 'Day 3 Decompression Check-in', status: 'pending', note: '', dueDate: new Date(start.getTime() + 3*24*60*60*1000).toISOString().split('T')[0] },
      { day: 7, label: 'Day 7 Routine & Appetite Check-in', status: 'pending', note: '', dueDate: new Date(start.getTime() + 7*24*60*60*1000).toISOString().split('T')[0] }
    ];
    if (durationOpt.days >= 14) {
      initialTimeline.push({ day: 14, label: 'Day 14 Bonding & Behavior Assessment', status: 'pending', note: '', dueDate: new Date(start.getTime() + 14*24*60*60*1000).toISOString().split('T')[0] });
    }
    if (durationOpt.days >= 30) {
      initialTimeline.push({ day: 28, label: 'Day 28 Permanent Adoption Decision Check-in', status: 'pending', note: '', dueDate: new Date(start.getTime() + 28*24*60*60*1000).toISOString().split('T')[0] });
    }

    const result = await db.query(
      `INSERT INTO trial_bookings (id, user_id, animal_id, pet_name, species, duration_days, fee_inr, status, start_date, end_date, check_in_notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        bookingId,
        userId,
        animalId || null,
        petName,
        species,
        durationOpt.days,
        durationOpt.feeInr,
        'active',
        startStr,
        endStr,
        JSON.stringify(initialTimeline)
      ]
    );

    return res.status(201).json({
      success: true,
      message: `🎉 Trial Foster for ${petName} successfully booked for ${durationOpt.days} days!`,
      booking: result.rows && result.rows[0]
    });
  } catch (err) {
    console.error('Error confirming trial booking:', err);
    return res.status(500).json({ error: 'Failed to record trial foster booking' });
  }
}

// Get user's trial foster bookings
export async function getMyTrialBookings(req, res) {
  try {
    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : req.query.guestToken);
    if (!userId) {
      return res.json({ bookings: [] });
    }

    const db = getDb();
    const result = await db.query(
      `SELECT * FROM trial_bookings WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const bookings = (result.rows || []).map(b => {
      let notes = [];
      if (typeof b.check_in_notes === 'string') {
        try { notes = JSON.parse(b.check_in_notes); } catch (e) { notes = []; }
      } else if (Array.isArray(b.check_in_notes)) {
        notes = b.check_in_notes;
      }
      return { ...b, check_in_notes: notes };
    });

    return res.json({ bookings });
  } catch (err) {
    console.error('Error fetching trial bookings:', err);
    return res.status(500).json({ error: 'Failed to retrieve trial bookings' });
  }
}

// Submit a check-in note on timeline
export async function submitCheckInNote(req, res) {
  try {
    const { id } = req.params;
    const { day, note } = req.body;
    const db = getDb();

    const bookRes = await db.query('SELECT * FROM trial_bookings WHERE id = $1', [id]);
    const booking = bookRes.rows && bookRes.rows[0];
    if (!booking) {
      return res.status(404).json({ error: 'Trial booking not found' });
    }

    let notes = [];
    if (typeof booking.check_in_notes === 'string') {
      try { notes = JSON.parse(booking.check_in_notes); } catch (e) { notes = []; }
    } else if (Array.isArray(booking.check_in_notes)) {
      notes = booking.check_in_notes;
    }

    // Update specific day milestone or push new
    const existingIdx = notes.findIndex(n => n.day === parseInt(day, 10));
    if (existingIdx >= 0) {
      notes[existingIdx].note = note;
      notes[existingIdx].status = 'completed';
      notes[existingIdx].completedAt = new Date().toISOString();
    } else {
      notes.push({
        day: parseInt(day, 10),
        label: `Day ${day} Check-in`,
        status: 'completed',
        note,
        completedAt: new Date().toISOString()
      });
    }

    await db.query(
      `UPDATE trial_bookings SET check_in_notes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [JSON.stringify(notes), id]
    );

    return res.json({ success: true, message: 'Check-in note saved!', check_in_notes: notes });
  } catch (err) {
    console.error('Error submitting checkin note:', err);
    return res.status(500).json({ error: 'Failed to save check-in note' });
  }
}

// Mark final outcome: 'adopt' or 'return'
export async function finalizeTrialOutcome(req, res) {
  try {
    const { id } = req.params;
    const { outcome, finalNotes } = req.body; // outcome: 'adopt' | 'return'
    if (!outcome || !['adopt', 'return'].includes(outcome)) {
      return res.status(400).json({ error: 'Outcome must be either "adopt" or "return"' });
    }

    const db = getDb();
    const newStatus = outcome === 'adopt' ? 'adopted' : 'returned';

    await db.query(
      `UPDATE trial_bookings
       SET status = $1, final_outcome = $2, final_notes = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [newStatus, outcome, finalNotes || '', id]
    );

    return res.json({
      success: true,
      message: outcome === 'adopt' 
        ? '🎊 Wonderful news! Official adoption papers and AWBI registration certificate request initiated.'
        : '🤝 Thank you for providing a compassionate trial home! The shelter coordinator will arrange respectful return transport.'
    });
  } catch (err) {
    console.error('Error finalizing outcome:', err);
    return res.status(500).json({ error: 'Failed to finalize trial outcome' });
  }
}
