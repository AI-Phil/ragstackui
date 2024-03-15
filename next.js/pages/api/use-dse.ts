import type { NextApiRequest, NextApiResponse } from 'next';

type CheckDSEResponse = {
    hasDSEConnection: boolean;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<CheckDSEResponse>) {
  const hasDSEConnection = Boolean(process.env.DSE_CONNECTION);
  res.status(200).json({ hasDSEConnection });
}
