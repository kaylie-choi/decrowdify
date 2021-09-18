import clientPromise from '../../lib/mongodb'

export default async function handle(_req, res) {
  const client = await clientPromise;
  const db = client.db();

  const areas = await db
    .collection("areas")
    .find({})
    .sort({ name: 1 })
    .toArray();

  res.status(200).json(areas);
}

