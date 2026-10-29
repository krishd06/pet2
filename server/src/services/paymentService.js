import { getDb } from '../db/index.js';

// Payment service running in TEST/MOCK mode
// If Razorpay keys are configured, Razorpay Test Mode can be used; otherwise a mock flow simulates success/failure.
export async function createPaymentOrder({ userId, amountInr, purpose, referenceId }) {
  const db = getDb();
  const orderId = 'order_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  const paymentRecordId = 'pay_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

  const razorpayKey = process.env.RAZORPAY_KEY_ID;
  const isRazorpayConfigured = Boolean(razorpayKey && !razorpayKey.includes('placeholder'));

  const mode = isRazorpayConfigured ? 'razorpay_test' : 'mock';

  // Save pending payment record in Neon/Postgres
  await db.query(
    `INSERT INTO payments (id, user_id, order_id, amount_inr, currency, purpose, reference_id, mode, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [paymentRecordId, userId || null, orderId, amountInr, 'INR', purpose, referenceId || null, mode, 'pending']
  );

  return {
    orderId,
    paymentRecordId,
    amountInr,
    currency: 'INR',
    mode,
    razorpayKeyId: isRazorpayConfigured ? razorpayKey : null,
    isMock: !isRazorpayConfigured,
    message: isRazorpayConfigured 
      ? 'Razorpay Test Mode Order initialized'
      : 'PawMatch Mock Payment Sandbox initialized (Test Mode)'
  };
}

export async function processPaymentVerification({ orderId, paymentId, status = 'captured', simulatedFailure = false }) {
  const db = getDb();

  const finalStatus = simulatedFailure ? 'failed' : (status === 'captured' ? 'captured' : 'failed');
  const actualPaymentId = paymentId || ('pay_mock_' + Math.random().toString(36).substr(2, 9));

  // Update payment status in Neon
  await db.query(
    `UPDATE payments
     SET payment_id = $1, status = $2
     WHERE order_id = $3`,
    [actualPaymentId, finalStatus, orderId]
  );

  const result = await db.query(
    `SELECT * FROM payments WHERE order_id = $1`,
    [orderId]
  );

  const payment = result.rows && result.rows[0];

  return {
    success: finalStatus === 'captured',
    payment,
    status: finalStatus
  };
}
