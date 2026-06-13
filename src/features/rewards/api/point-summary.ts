import { getPointTransactions } from './point-transactions';
import {
  getPointSummary,
  type PointSummary,
} from '../utils/point-transactions';

export const getCurrentPointSummary = async (): Promise<PointSummary> => {
  const transactions = await getPointTransactions();

  return getPointSummary(transactions);
};
