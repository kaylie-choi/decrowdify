import clientPromise from '../../lib/mongodb'
import { ObjectID } from 'mongodb'

export default async function handle(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("locations");

  const {
    query: { area_id },
    method,
  } = req;

  switch(method) {
    case 'GET':
      let queryParams = {};
      if (area_id) {
        const area = await db.collection("areas").findOne({ _id: ObjectID(area_id) });
        if (!area) {
          res.status(404).end("Area Not Found");
          break;
        }
        queryParams = { area_id: area._id };
      }
      const locations = await collection
        .aggregate([
          {
            $match: queryParams
          },
          {
            $lookup: {
              from: "crowdlevels",
              localField: "_id",
              foreignField: "location_id",
              as: "crowdlevels"
            },
          },
          {
            $sort: {
              "crowdlevels.createdAt": -1
            }
          },
          {
            $unwind: {
              path: "$crowdlevels",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $set: {
              crowdlevel: "$crowdlevels.crowdlevel",
            }
          },
          {
            $set: {
              crowdlevel: "$crowdlevels.crowdlevel",
            }
          },
          {
            $unset: "crowdlevels"
          }
        ])
        .sort({ name: 1 })
        .toArray()

      res.status(200).json(locations);
      break;
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

