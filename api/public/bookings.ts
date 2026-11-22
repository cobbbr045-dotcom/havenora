import type { VercelRequest, VercelResponse } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Public booking endpoint
  if (req.method === 'GET') {
    const date = req.query.date as string;
    return res.status(200).json({
      status: 'active',
      date: date || new Date().toISOString().split('T')[0],
      timezone: 'NPT (UTC+05:45)'
    });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    if (!body.customerName || !body.phone || !body.bookingDate || !body.timeSlot) {
      return res.status(400).json({ error: 'Missing required booking parameters.' });
    }

    return res.status(200).json({
      success: true,
      reference: `HV-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Pending',
      message: 'Booking request validated.'
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
