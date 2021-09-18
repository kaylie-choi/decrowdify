import clientPromise from '../../lib/mongodb'

export default async function handle(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("areas")

  const {
    body: { name },
    method,
  } = req

  switch(method) {
    case 'GET':
      const areas = await collection 
        .find({})
        .sort({ name: 1 })
        .toArray();

      res.status(200).json(areas);
      break
    case 'POST':
      const area = await collection
        .insertOne({
          name: name
        })
      res.status(201).json(area);
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

