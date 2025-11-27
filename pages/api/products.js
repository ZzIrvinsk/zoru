// NOTE: API skeleton adapted for deployment-ready usage.
// Currently reads products from /data/products.json for prototyping.
// For production, replace with a proper database (Supabase, Postgres, etc.)
import fs from 'fs'
import path from 'path'
const dataFile = path.join(process.cwd(), 'data', 'products.json')

function readData(){
  try { return JSON.parse(fs.readFileSync(dataFile,'utf-8')) } catch(e) { return [] }
}

export default function handler(req, res) {
  const method = req.method
  if(method === 'GET') {
    return res.status(200).json(readData())
  }
  // POST/PUT/DELETE intentionally not implemented here.
  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${method} Not Allowed`)
}
