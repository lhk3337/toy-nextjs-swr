import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dataFetch = await fetch(<RequestInfo | URL>process.env.PRODUCT_URL);
  const data = await dataFetch.json();
  if (!data) {
    res.status(404).end();
  }
  res.json({
    data,
  });
}
