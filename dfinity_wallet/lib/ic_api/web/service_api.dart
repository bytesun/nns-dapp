@JS()
library dfinity_agent.js;

import 'package:dfinity_wallet/data/canister.dart';
import 'package:js/js.dart';
import '../models.dart';
import 'js_utils.dart';

@JS('createServiceApi')
external ServiceApi createServiceApi(String host, dynamic identity);

@JS("ServiceApi")
class ServiceApi {
  external ServiceApi(String host, dynamic identity);

  @JS("acquireICPTs")
  external Promise<void> acquireICPTs(String accountIdentifier, BigInt icpts);

  @JS("getAccount")
  external Promise<dynamic> getAccount();

  @JS("getBalances")
  external Promise<dynamic> getBalances(Object request);

  @JS("createSubAccount")
  external Promise<dynamic> createSubAccount(String name);

  @JS("sendICPTs")
  external Promise<dynamic> sendICPTs(Object request);

  @JS("createNeuron")
  external Promise<void> createNeuron(dynamic request);

  @JS("integrationTest")
  external Promise<void> integrationTest();

  @JS("getTransactions")
  external Promise<dynamic> getTransactions(dynamic request);

  @JS("createDummyProposals")
  external Promise<dynamic> createDummyProposals(String neuronId);

  @JS("registerHardwareWallet")
  external Promise<void> registerHardwareWallet(String name, dynamic ledgerIdentity);

  @JS("getNeuron")
  external Promise<dynamic> getNeuron(dynamic neuronId);

  @JS("getNeurons")
  external Promise<dynamic> getNeurons();

  @JS("getPendingProposals")
  external Promise<dynamic> getPendingProposals();

  @JS("getProposalInfo")
  external Promise<dynamic> getProposalInfo(dynamic proposalId);

  @JS("listProposals")
  external Promise<dynamic> listProposals(dynamic request);

  @JS("addHotKey")
  external Promise<dynamic> addHotKey(dynamic request);

  @JS("removeHotKey")
  external Promise<dynamic> removeHotKey(dynamic request);

  @JS("startDissolving")
  external Promise<dynamic> startDissolving(dynamic request);

  @JS("stopDissolving")
  external Promise<dynamic> stopDissolving(dynamic request);

  @JS("increaseDissolveDelay")
  external Promise<dynamic> increaseDissolveDelay(dynamic request);

  @JS("follow")
  external Promise<dynamic> follow(dynamic request);

  @JS("registerVote")
  external Promise<dynamic> registerVote(dynamic request);

  @JS("spawn")
  external Promise<dynamic> spawn(dynamic request);

  @JS("split")
  external Promise<dynamic> split(dynamic request);

  @JS("disburse")
  external Promise<dynamic> disburse(dynamic request);

  @JS("disburseToNeuron")
  external Promise<dynamic> disburseToNeuron(dynamic request);

  @JS("makeMotionProposal")
  external Promise<dynamic> makeMotionProposal(dynamic request);

  // Canisters
  @JS("createCanister")
  external Promise<dynamic> createCanister(CreateCanisterRequest request);

  @JS("topupCanister")
  external Promise<void> topupCanister(TopupCanisterRequest request);

  @JS("attachCanister")
  external Promise<void> attachCanister(AttachCanisterRequest request);

  @JS("getCanisters")
  external Promise<dynamic> getCanisters();

  @JS("getICPToCyclesExchangeRate")
  external Promise<double> getICPToCyclesExchangeRate();
}




@JS()
@anonymous
class IncreaseDissolveDelayRequest {
  external dynamic get neuronId;

  external num get additionalDissolveDelaySeconds;

  external factory IncreaseDissolveDelayRequest(
      {dynamic neuronId, num additionalDissolveDelaySeconds});
}

@JS()
@anonymous
class FollowRequest {
  external dynamic neuronId;
  external int topic;
  external List<dynamic> followees;

  external factory FollowRequest(
      {dynamic neuronId, int topic, List<dynamic> followees});
}

@JS()
@anonymous
class NeuronIdentifierRequest {
  external dynamic neuronId;

  external factory NeuronIdentifierRequest({dynamic neuronId});
}

@JS()
@anonymous
class CreateNeuronRequest {
  external dynamic stake;
  external int? fromSubAccountId;

  external factory CreateNeuronRequest({dynamic stake, int? fromSubAccountId});
}

@JS()
@anonymous
class DisperseNeuronRequest {
  external dynamic neuronId;
  external dynamic amount;
  external String toAccountId;

  external factory DisperseNeuronRequest(
      {dynamic neuronId, dynamic amount, String toAccountId});
}

@JS()
@anonymous
class SendICPTsRequest {
  external dynamic to;
  external dynamic amount;
  external int? fromSubAccountId;

  external factory SendICPTsRequest(
      {dynamic to, dynamic amount, int? fromSubAccountId});
}

@JS()
@anonymous
class RegisterVoteRequest {
  external dynamic neuronId;
  external dynamic proposal;
  external int vote;

  external factory RegisterVoteRequest(
      {dynamic neuronId, dynamic proposal, int vote});
}

@JS()
@anonymous
class SpawnRequest {
  external dynamic neuronId;
  external dynamic newController;

  external factory SpawnRequest({dynamic neuronId, dynamic newController});
}

@JS()
@anonymous
class CreateCanisterRequest {
  external dynamic stake;
  external int? fromSubAccountId;
  external String name;

  external factory CreateCanisterRequest(
      {dynamic stake, int? fromSubAccountId, String name});
}

@JS()
@anonymous
class TopupCanisterRequest {
  external dynamic stake;
  external int? fromSubAccountId;
  external dynamic targetCanisterId;

  external factory TopupCanisterRequest(
      {dynamic stake, int? fromSubAccountId, dynamic targetCanisterId});
}

@JS()
@anonymous
class AttachCanisterRequest {
  external String name;
  external dynamic canisterId;

  external factory AttachCanisterRequest({String name, dynamic canisterId});
}

enum AttachCanisterResult {
  Ok,
  CanisterAlreadyAttached,
  NameAlreadyTaken,
  CanisterLimitExceeded,
}



class CreateCanisterResponse {
  final String? canisterId;
  final Canister? canister;
  final String? errorMessage;
  final CreateCanisterResult result;

  CreateCanisterResponse({required this.result, this.canisterId, this.canister, this.errorMessage});
}

enum CreateCanisterResult {
  Ok,
  FailedToCreateCanister,
  CanisterAlreadyAttached,
  NameAlreadyTaken,
  CanisterLimitExceeded
}