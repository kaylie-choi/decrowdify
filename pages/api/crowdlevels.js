import clientPromise from '../../lib/mongodb'
import { ObjectID } from 'mongodb'

export default async function handle(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("crowdlevels");
  const method = req.method;
  let location_id;

  switch(method) {
    case 'GET':
      location_id = req.query.location_id;

      let queryParams = {};
      if (location_name) {
        const location = await db.collection("locations").findOne({ _id: ObjectID(location_id) });
        if (!location) {
          res.status(404).end("Location not found");
        }
        queryParams = { location_id: location._id };
      } else {
        res.status(400).end("Missing paramater location_id");
      }

      const foundCrowdlevel = await collection
        .findOne(queryParams)
        .sort({ createdAt: -1 })

      res.status(200).json(foundCrowdlevel);
      break;
    case 'POST':
      location_id = req.body.location_id;
      const crowdlevel = req.body.crowdlevel;

      console.log(location_id);
      const location = await db.collection("locations").findOne({ _id: ObjectID(location_id) });
      if (!location) {
        res.status(404).end("Location not found");
        break;
      }

      const createdCrowdlevel = await collection
        .insertOne({
          location_id: ObjectID(location_id),
          crowdlevel: crowdlevel,
          createdAt: new Date()
        });
      res.status(201).json(createdCrowdlevel);
      break
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
