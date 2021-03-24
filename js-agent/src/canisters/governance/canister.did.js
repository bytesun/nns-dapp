export default ({ IDL }) => {
  const Proposal = IDL.Rec();
  const GovernanceError = IDL.Record({
    'error_message' : IDL.Text,
    'error_type' : IDL.Int32,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : GovernanceError });
  const MethodAuthzInfo = IDL.Record({
    'method_name' : IDL.Text,
    'principal_ids' : IDL.Vec(IDL.Vec(IDL.Nat8)),
  });
  const CanisterAuthzInfo = IDL.Record({
    'methods_authz' : IDL.Vec(MethodAuthzInfo),
  });
  const NeuronId = IDL.Record({ 'id' : IDL.Nat64 });
  const Ballot = IDL.Record({ 'vote' : IDL.Int32, 'voting_power' : IDL.Nat64 });
  const ExternalUpdate = IDL.Record({
    'update_type' : IDL.Int32,
    'payload' : IDL.Vec(IDL.Nat8),
  });
  const Spawn = IDL.Record({ 'new_controller' : IDL.Opt(IDL.Principal) });
  const Split = IDL.Record({ 'amount_doms' : IDL.Nat64 });
  const Follow = IDL.Record({
    'topic' : IDL.Int32,
    'followees' : IDL.Vec(NeuronId),
  });
  const RemoveHotKey = IDL.Record({
    'hot_key_to_remove' : IDL.Opt(IDL.Principal),
  });
  const AddHotKey = IDL.Record({ 'new_hot_key' : IDL.Opt(IDL.Principal) });
  const IncreaseDissolveDelay = IDL.Record({
    'additional_dissolve_delay_seconds' : IDL.Nat32,
  });
  const Operation = IDL.Variant({
    'RemoveHotKey' : RemoveHotKey,
    'AddHotKey' : AddHotKey,
    'StopDissolving' : IDL.Record({}),
    'StartDissolving' : IDL.Record({}),
    'IncreaseDissolveDelay' : IncreaseDissolveDelay,
  });
  const Configure = IDL.Record({ 'operation' : IDL.Opt(Operation) });
  const RegisterVote = IDL.Record({
    'vote' : IDL.Int32,
    'proposal' : IDL.Opt(NeuronId),
  });
  const DisburseToNeuron = IDL.Record({
    'dissolve_delay_seconds' : IDL.Nat64,
    'kyc_verified' : IDL.Bool,
    'amount_doms' : IDL.Nat64,
    'new_controller' : IDL.Opt(IDL.Principal),
    'nonce' : IDL.Nat64,
  });
  const Amount = IDL.Record({ 'doms' : IDL.Nat64 });
  const Disburse = IDL.Record({
    'to_subaccount' : IDL.Vec(IDL.Nat8),
    'to_account' : IDL.Opt(IDL.Principal),
    'amount' : IDL.Opt(Amount),
  });
  const Command = IDL.Variant({
    'Spawn' : Spawn,
    'Split' : Split,
    'Follow' : Follow,
    'Configure' : Configure,
    'RegisterVote' : RegisterVote,
    'DisburseToNeuron' : DisburseToNeuron,
    'MakeProposal' : Proposal,
    'Disburse' : Disburse,
  });
  const ManageNeuron = IDL.Record({
    'id' : IDL.Opt(NeuronId),
    'command' : IDL.Opt(Command),
  });
  const ApproveKyc = IDL.Record({ 'principals' : IDL.Vec(IDL.Principal) });
  const NetworkEconomics = IDL.Record({
    'reject_cost_doms' : IDL.Nat64,
    'node_reward_xdr_per_billing_period' : IDL.Nat64,
    'manage_neuron_cost_per_proposal_doms' : IDL.Nat64,
    'neuron_minimum_stake_doms' : IDL.Nat64,
    'neuron_spawn_dissolve_delay_seconds' : IDL.Nat64,
    'maximum_node_provider_rewards_xdr_100ths' : IDL.Nat64,
    'minimum_icp_xdr_rate' : IDL.Nat64,
  });
  const NodeProvider = IDL.Record({ 'id' : IDL.Opt(IDL.Principal) });
  const RewardNodeProvider = IDL.Record({
    'node_provider' : IDL.Opt(NodeProvider),
    'xdr_amount_100ths' : IDL.Nat64,
  });
  const Change = IDL.Variant({
    'ToRemove' : NodeProvider,
    'ToAdd' : NodeProvider,
  });
  const AddOrRemoveNodeProvider = IDL.Record({ 'change' : IDL.Opt(Change) });
  const Motion = IDL.Record({ 'motion_text' : IDL.Text });
  const Action = IDL.Variant({
    'ExternalUpdate' : ExternalUpdate,
    'ManageNeuron' : ManageNeuron,
    'ApproveKyc' : ApproveKyc,
    'NetworkEconomics' : NetworkEconomics,
    'RewardNodeProvider' : RewardNodeProvider,
    'AddOrRemoveNodeProvider' : AddOrRemoveNodeProvider,
    'Motion' : Motion,
  });
  Proposal.fill(
    IDL.Record({
      'url' : IDL.Text,
      'action' : IDL.Opt(Action),
      'summary' : IDL.Text,
    })
  );
  const Tally = IDL.Record({
    'no' : IDL.Nat64,
    'yes' : IDL.Nat64,
    'total' : IDL.Nat64,
    'timestamp_seconds' : IDL.Nat64,
  });
  const ProposalInfo = IDL.Record({
    'id' : IDL.Opt(NeuronId),
    'ballots' : IDL.Vec(IDL.Tuple(IDL.Nat64, Ballot)),
    'reject_cost_doms' : IDL.Nat64,
    'proposal_timestamp_seconds' : IDL.Nat64,
    'reward_event_round' : IDL.Nat64,
    'failed_timestamp_seconds' : IDL.Nat64,
    'proposal' : IDL.Opt(Proposal),
    'proposer' : IDL.Opt(NeuronId),
    'tally_at_decision_time' : IDL.Opt(Tally),
    'executed_timestamp_seconds' : IDL.Nat64,
  });
  const BallotInfo = IDL.Record({
    'vote' : IDL.Int32,
    'proposal_id' : IDL.Opt(NeuronId),
  });
  const DissolveState = IDL.Variant({
    'DissolveDelaySeconds' : IDL.Nat64,
    'WhenDissolvedTimestampSeconds' : IDL.Nat64,
  });
  const Followees = IDL.Record({ 'followees' : IDL.Vec(NeuronId) });
  const NeuronStakeTransfer = IDL.Record({
    'to_subaccount' : IDL.Vec(IDL.Nat8),
    'from' : IDL.Opt(IDL.Principal),
    'memo' : IDL.Nat64,
    'neuron_stake_doms' : IDL.Nat64,
    'from_subaccount' : IDL.Vec(IDL.Nat8),
    'transfer_timestamp' : IDL.Nat64,
    'block_height' : IDL.Nat64,
  });
  const Neuron = IDL.Record({
    'id' : IDL.Opt(NeuronId),
    'controller' : IDL.Opt(IDL.Principal),
    'recent_ballots' : IDL.Vec(BallotInfo),
    'kyc_verified' : IDL.Bool,
    'not_for_profit' : IDL.Bool,
    'cached_neuron_stake_doms' : IDL.Nat64,
    'created_timestamp_seconds' : IDL.Nat64,
    'maturity_doms_equivalent' : IDL.Nat64,
    'aging_since_timestamp_seconds' : IDL.Nat64,
    'neuron_fees_doms' : IDL.Nat64,
    'hot_keys' : IDL.Vec(IDL.Principal),
    'account' : IDL.Vec(IDL.Nat8),
    'dissolve_state' : IDL.Opt(DissolveState),
    'followees' : IDL.Vec(IDL.Tuple(IDL.Int32, Followees)),
    'transfer' : IDL.Opt(NeuronStakeTransfer),
  });
  const Result_1 = IDL.Variant({ 'Ok' : Neuron, 'Err' : GovernanceError });
  const NeuronInfo = IDL.Record({
    'dissolve_delay_seconds' : IDL.Nat64,
    'recent_ballots' : IDL.Vec(BallotInfo),
    'created_timestamp_seconds' : IDL.Nat64,
    'state' : IDL.Int32,
    'retrieved_at_timestamp_seconds' : IDL.Nat64,
    'voting_power' : IDL.Nat64,
    'age_seconds' : IDL.Nat64,
  });
  const Result_2 = IDL.Variant({ 'Ok' : NeuronInfo, 'Err' : GovernanceError });
  const SpawnResponse = IDL.Record({ 'created_neuron_id' : IDL.Opt(NeuronId) });
  const MakeProposalResponse = IDL.Record({
    'proposal_id' : IDL.Opt(NeuronId),
  });
  const DisburseResponse = IDL.Record({ 'transfer_block_height' : IDL.Nat64 });
  const Command_1 = IDL.Variant({
    'Spawn' : SpawnResponse,
    'Split' : SpawnResponse,
    'Follow' : IDL.Record({}),
    'Configure' : IDL.Record({}),
    'RegisterVote' : IDL.Record({}),
    'DisburseToNeuron' : SpawnResponse,
    'MakeProposal' : MakeProposalResponse,
    'Disburse' : DisburseResponse,
  });
  const ManageNeuronResponse = IDL.Record({ 'command' : IDL.Opt(Command_1) });
  const Result_3 = IDL.Variant({
    'Ok' : ManageNeuronResponse,
    'Err' : GovernanceError,
  });
  const AuthzChangeOp = IDL.Variant({
    'Authorize' : IDL.Record({ 'add_self' : IDL.Bool }),
    'Deauthorize' : IDL.Null,
  });
  const MethodAuthzChange = IDL.Record({
    'principal' : IDL.Opt(IDL.Principal),
    'method_name' : IDL.Text,
    'canister' : IDL.Principal,
    'operation' : AuthzChangeOp,
  });
  return IDL.Service({
    'claim_neuron' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Nat64, IDL.Nat64],
        [Result],
        [],
      ),
    'current_authz' : IDL.Func([], [CanisterAuthzInfo], ['query']),
    'execute_eligible_proposals' : IDL.Func([], [], []),
    'get_finalized_proposals' : IDL.Func(
        [],
        [IDL.Vec(ProposalInfo)],
        ['query'],
      ),
    'get_full_neuron' : IDL.Func([IDL.Nat64], [Result_1], ['query']),
    'get_neuron_ids' : IDL.Func([], [IDL.Vec(IDL.Nat64)], ['query']),
    'get_neuron_info' : IDL.Func([IDL.Nat64], [Result_2], ['query']),
    'get_pending_proposals' : IDL.Func([], [IDL.Vec(ProposalInfo)], ['query']),
    'get_proposal_info' : IDL.Func(
        [IDL.Nat64],
        [IDL.Opt(ProposalInfo)],
        ['query'],
      ),
    'manage_neuron' : IDL.Func([ManageNeuron], [Result_3], []),
    'submit_proposal' : IDL.Func(
        [IDL.Nat64, Proposal, IDL.Principal],
        [IDL.Nat64],
        [],
      ),
    'update_authz' : IDL.Func([IDL.Vec(MethodAuthzChange)], [], []),
  });
};
export const init = ({ IDL }) => { return []; };