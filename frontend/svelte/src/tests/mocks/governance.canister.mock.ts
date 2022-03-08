import {
  GovernanceCanister,
  ICP,
  LedgerCanister,
  ListProposalsRequest,
  ListProposalsResponse,
  NeuronId,
  NeuronInfo,
  ProposalInfo,
  StakeNeuronError,
  Vote,
} from "@dfinity/nns";
import type { Principal } from "@dfinity/principal";
import { neuronMock } from "./neurons.mock";

// eslint-disable-next-line
// @ts-ignore
export class MockGovernanceCanister extends GovernanceCanister {
  constructor(private proposals: ProposalInfo[]) {
    super();
  }

  create() {
    return this;
  }

  public listProposals = async ({
    request,
    certified = true,
  }: {
    request: ListProposalsRequest;
    certified?: boolean;
  }): Promise<ListProposalsResponse> => {
    return {
      proposals: this.proposals,
    };
  };

  public getProposal = async ({
    proposalId,
  }: {
    proposalId: any;
  }): Promise<ProposalInfo | undefined> => {
    return { id: BigInt(404) } as unknown as ProposalInfo;
  };

  public listNeurons = async ({
    certified,
    principal,
    neuronIds,
  }: {
    certified: boolean;
    principal: Principal;
    neuronIds?: bigint[] | undefined;
  }): Promise<NeuronInfo[]> => {
    return [
      {
        ...neuronMock,
      },
    ];
  };

  public getNeuron = async ({
    certified,
    principal,
    neuronId,
  }: {
    certified: boolean;
    principal: Principal;
    neuronId: NeuronId;
  }): Promise<NeuronInfo | undefined> => {
    return neuronMock;
  };

  public registerVote = async ({
    neuronId,
    vote,
    proposalId,
  }: {
    neuronId: bigint;
    vote: Vote;
    proposalId: bigint;
  }) => {
    return vote === Vote.YES
      ? { Ok: null }
      : { Err: { errorMessage: "error", errorType: 0 } };
  };

  public stakeNeuron = async ({
    stake,
    principal,
    ledgerCanister,
  }: {
    stake: ICP;
    principal: Principal;
    ledgerCanister: LedgerCanister;
  }): Promise<NeuronId | StakeNeuronError> => {
    return neuronMock.neuronId;
  };
}