import type { Identity } from "@dfinity/agent";
import type {
  EmptyResponse,
  GovernanceError,
  ListProposalsResponse,
  NeuronId,
  ProposalId,
  ProposalInfo,
  Vote,
} from "@dfinity/nns";
import { GovernanceCanister, Topic } from "@dfinity/nns";
import { LIST_PAGINATION_LIMIT } from "../constants/constants";
import type { ProposalsFiltersStore } from "../stores/proposals.store";
import { createAgent } from "../utils/agent.utils";
import { enumsExclude } from "../utils/enum.utils";

export const queryProposals = async ({
  beforeProposal,
  identity,
  filters,
}: {
  beforeProposal: ProposalId | undefined;
  identity: Identity;
  filters: ProposalsFiltersStore;
}): Promise<ProposalInfo[]> => {
  const governance: GovernanceCanister = GovernanceCanister.create({
    agent: await createAgent({ identity, host: process.env.HOST }),
  });

  const { rewards, status, topics }: ProposalsFiltersStore = filters;

  // TODO(L2-206): In Flutter, proposals are sorted on the client side -> this needs to be deferred on backend side if we still want this feature
  // sortedByDescending((element) => element.proposalTimestamp);
  // Governance canister listProposals -> https://github.com/dfinity/ic/blob/5c05a2fe2a7f8863c3772c050ece7e20907c8252/rs/sns/governance/src/governance.rs#L1226

  const { proposals }: ListProposalsResponse = await governance.listProposals({
    request: {
      limit: LIST_PAGINATION_LIMIT,
      beforeProposal,
      excludeTopic: enumsExclude<Topic>({
        obj: Topic as unknown as Topic,
        values: topics,
      }),
      includeRewardStatus: rewards,
      includeStatus: status,
    },
    certified: false,
  });

  return proposals;
};

export const queryProposal = async ({
  proposalId,
  identity,
}: {
  proposalId: ProposalId;
  identity: Identity;
}): Promise<ProposalInfo | undefined> => {
  const governance: GovernanceCanister = GovernanceCanister.create({
    agent: await createAgent({ identity, host: process.env.HOST }),
  });

  return governance.getProposal({ proposalId, certified: false });
};

export const registerVote = async ({
  neuronId,
  proposalId,
  vote,
  identity,
}: {
  neuronId: NeuronId;
  proposalId: ProposalId;
  vote: Vote;
  identity: Identity;
}): Promise<GovernanceError | undefined> => {
  const governance: GovernanceCanister = GovernanceCanister.create({
    agent: await createAgent({ identity, host: process.env.HOST }),
  });

  const response: EmptyResponse = await governance.registerVote({
    neuronId,
    vote,
    proposalId,
  });

  return "Err" in response ? response.Err : undefined;
};