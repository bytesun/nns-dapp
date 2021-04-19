import LedgerService, { E8s } from "./model";
import { BinaryBlob, blobFromUint8Array, DerEncodedBlob, Principal, SignIdentity } from "@dfinity/agent";
import GOVERNANCE_CANISTER_ID from "../governance/canisterId";
import * as convert from "../converter";
import { sha224 } from "@dfinity/agent/lib/cjs/utils/sha224";
import crc from "crc";
import randomBytes from "randombytes";

export type CreateNeuronRequest = {
    stake: E8s
    dissolveDelayInSecs: bigint,
    fromSubAccountId?: number
}

export type CreateNeuronResponse = any;

// Ported from https://github.com/dfinity-lab/dfinity/blob/master/rs/nns/integration_tests/src/ledger.rs#L29
export default async function(
    identity: SignIdentity,
    ledgerService: LedgerService, 
    request: CreateNeuronRequest) : Promise<CreateNeuronResponse> {

    const publicKey = identity.getPublicKey().toDer();
    const nonce = new Uint8Array(randomBytes(8));
    const toSubAccount = await buildSubAccount(nonce, publicKey);

    const accountIdentifier = buildAccountIdentifier(GOVERNANCE_CANISTER_ID, toSubAccount);
    const blockHeight = await ledgerService.sendICPTs({
        memo: nonce,
        amount: request.stake,
        to: accountIdentifier,
        fromSubAccountId: request.fromSubAccountId
    });

    const result = await ledgerService.notify({
        toCanister: GOVERNANCE_CANISTER_ID,
        blockHeight,
        toSubAccount,
        fromSubAccountId: request.fromSubAccountId
    });

    return {
        result
    };
}

// 32 bytes
export async function buildSubAccount(nonce: Uint8Array, publicKey: DerEncodedBlob) : Promise<Uint8Array> {
    const padding = convert.asciiStringToByteArray("neuron-claim");
    const array = new Uint8Array([
        0x0c, 
        ...padding, 
        ...publicKey, 
        ...nonce]);
    const result = await crypto.subtle.digest("SHA-256", array);
    return new Uint8Array(result);
}

// hex string of length 64
// ported from https://github.com/dfinity-lab/dfinity/blob/master/rs/rosetta-api/canister/src/account_identifier.rs
export function buildAccountIdentifier(principal: Principal, subAccount: Uint8Array) : string {
    // Hash (sha224) the principal, the subAccount and some padding
    const padding = convert.asciiStringToByteArray("\x0Aaccount-id");
    const array = new Uint8Array([
        ...padding, 
        ...principal.toBlob(), 
        ...subAccount]);
    const hash = sha224(array);
    
    // Prepend the checksum of the hash and convert to a hex string
    const checksum = calculateCrc32(hash);
    const array2 = new Uint8Array([
        ...checksum,
        ...hash
    ]);
    return blobFromUint8Array(array2).toString("hex");
}

// 4 bytes
function calculateCrc32(bytes: BinaryBlob) : Uint8Array {
    const checksumArrayBuf = new ArrayBuffer(4);
    const view = new DataView(checksumArrayBuf);
    view.setUint32(0, crc.crc32(Buffer.from(bytes)), false);
    return Buffer.from(checksumArrayBuf);
}