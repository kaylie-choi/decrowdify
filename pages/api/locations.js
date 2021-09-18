import clientPromise from '../../lib/mongodb'

export default async function handle(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("locations")

  const {
    query: { area_name },
    method,
  } = req

  switch(method) {
    case 'GET':
      let queryParams = {}
      if (area_name) {
        const area = await db.collection("areas").findOne({ name: area_name })
        queryParams = { area_id: area._id }
      }
      const locations = await collection
        .find(queryParams)
        .sort({ name: 1 })
        .toArray()

      res.status(200).json(locations);
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

