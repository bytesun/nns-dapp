import { AccountIdentifier, BlockHeight } from "../common/types";
import ServiceInterface, {
  AttachCanisterRequest,
  AttachCanisterResult,
  CanisterDetails,
  CreateSubAccountResponse,
  DetachCanisterRequest,
  DetachCanisterResponse,
  GetAccountResponse,
  GetTransactionsRequest,
  GetTransactionsResponse,
  MultiPartTransactionStatus,
  RegisterHardwareWalletRequest,
  RegisterHardwareWalletResponse,
  RemoveHardwareWalletRequest,
  RemoveHardwareWalletResponse,
  RenameSubAccountRequest,
  RenameSubAccountResponse,
} from "./model";
import { _SERVICE } from "./rawService";
import RequestConverters from "./RequestConverters";
import ResponseConverters from "./ResponseConverters";

export default class Service implements ServiceInterface {
  private readonly service: _SERVICE;
  private requestConverters: RequestConverters;
  private responseConverters: ResponseConverters;

  public constructor(service: _SERVICE) {
    this.service = service;
    this.requestConverters = new RequestConverters();
    this.responseConverters = new ResponseConverters();
  }

  public attachCanister = async (
    request: AttachCanisterRequest
  ): Promise<AttachCanisterResult> => {
    const rawRequest =
      this.requestConverters.fromAttachCanisterRequest(request);
    const rawResponse = await this.service.attach_canister(rawRequest);
    return this.responseConverters.toAttachCanisterResponse(rawResponse);
  };

  public detachCanister = async (
    request: DetachCanisterRequest
  ): Promise<DetachCanisterResponse> => {
    const rawRequest =
      this.requestConverters.fromDetachCanisterRequest(request);
    const rawResponse = await this.service.detach_canister(rawRequest);
    return this.responseConverters.toDetachCanisterResponse(rawResponse);
  };

  public getCanisters = async (): Promise<Array<CanisterDetails>> => {
    const rawResponse = await this.service.get_canisters();
    return this.responseConverters.toArrayOfCanisterDetail(rawResponse);
  };

  public getAccount = async (): Promise<GetAccountResponse> => {
    const rawResponse = await this.service.get_account();
    return this.responseConverters.toGetAccountResponse(rawResponse);
  };

  public addAccount = (): Promise<AccountIdentifier> => {
    return this.service.add_account();
  };

  public createSubAccount = async (
    name: string
  ): Promise<CreateSubAccountResponse> => {
    const rawResponse = await this.service.create_sub_account(name);
    return this.responseConverters.toCreateSubAccountResponse(rawResponse);
  };

  public renameSubAccount = async (
    request: RenameSubAccountRequest
  ): Promise<RenameSubAccountResponse> => {
    const rawRequest =
      this.requestConverters.fromRenameSubAccountRequest(request);
    const rawResponse = await this.service.rename_sub_account(rawRequest);
    return this.responseConverters.toRenameSubAccountResponse(rawResponse);
  };

  public registerHardwareWallet = async (
    request: RegisterHardwareWalletRequest
  ): Promise<RegisterHardwareWalletResponse> => {
    const rawRequest =
      this.requestConverters.fromRegisterHardwareWalletRequest(request);
    const rawResponse = await this.service.register_hardware_wallet(rawRequest);
    return this.responseConverters.toRegisterHardwareWalletResponse(
      rawResponse
    );
  };

  public removeHardwareWallet = async (
    request: RemoveHardwareWalletRequest
  ): Promise<RemoveHardwareWalletResponse> => {
    const rawRequest =
      this.requestConverters.fromRemoveHardwareWalletRequest(request);
    const rawResponse = await this.service.remove_hardware_wallet(rawRequest);
    return this.responseConverters.toRemoveHardwareWalletResponse(rawResponse);
  };

  public getTransactions = async (
    request: GetTransactionsRequest
  ): Promise<GetTransactionsResponse> => {
    const rawRequest =
      this.requestConverters.fromGetTransactionsRequest(request);
    const rawResponse = await this.service.get_transactions(rawRequest);
    return this.responseConverters.toGetTransactionsResponse(rawResponse);
  };

  public getMultiPartTransactionStatus = async (
    blockHeight: BlockHeight
  ): Promise<MultiPartTransactionStatus> => {
    const rawResponse = await this.service.get_multi_part_transaction_status(
      blockHeight
    );
    return this.responseConverters.toMultiPartTransactionStatus(rawResponse);
  };

  public getIcpToCyclesConversionRate = (): Promise<bigint> => {
    return this.service.get_icp_to_cycles_conversion_rate();
  };
}
