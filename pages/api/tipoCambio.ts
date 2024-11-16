import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [rows] = await db.query('SELECT * FROM tipo_cambio ORDER BY timestamp DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ message: 'Error al consultar la base de datos', error: error.message });
  }
}
