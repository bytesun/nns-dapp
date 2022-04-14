import { E8S_PER_ICP, TRANSACTION_FEE_E8S } from "./icp.constants";

export const MIN_NEURON_STAKE_SPLITTABLE =
  2 * E8S_PER_ICP + TRANSACTION_FEE_E8S;

export const MAX_NEURONS_MERGED = 2;