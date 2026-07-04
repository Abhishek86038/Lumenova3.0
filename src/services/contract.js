import { rpc, TransactionBuilder, Networks, Address, Operation, xdr, scValToNative, nativeToScVal } from '@stellar/stellar-sdk';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit/sdk';

const rpcUrl = 'https://soroban-testnet.stellar.org';
export const server = new rpc.Server(rpcUrl);
export const networkPassphrase = Networks.TESTNET;

// Newly deployed Testnet contract IDs
export const CONTRACT_ID = 'CDLU7V7V2WFQB7EXJMY6S76IRJHGV3QGTMAC3UGU46UNRBWQIDDIOWMY'; 
export const BADGE_CONTRACT_ID = 'CDBRYLG3XQN744X7MUB6T4V5KUIBTPCJCEWCKD6CBLL6UOOVWADHIFUL';

export async function fetchContractState() {
  try {
    const goalRes = await server.simulateTransaction(
      new TransactionBuilder(
        await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
        { fee: '100', networkPassphrase }
      )
        .addOperation(
          Operation.invokeHostFunction({
            func: xdr.HostFunction.hostFunctionTypeInvokeContract(
              new xdr.InvokeContractArgs({
                contractAddress: Address.fromString(CONTRACT_ID).toScAddress(),
                functionName: 'get_goal',
                args: [],
              })
            ),
            auth: [],
          })
        )
        .setTimeout(30)
        .build()
    );

    const raisedRes = await server.simulateTransaction(
      new TransactionBuilder(
        await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
        { fee: '100', networkPassphrase }
      )
        .addOperation(
          Operation.invokeHostFunction({
            func: xdr.HostFunction.hostFunctionTypeInvokeContract(
              new xdr.InvokeContractArgs({
                contractAddress: Address.fromString(CONTRACT_ID).toScAddress(),
                functionName: 'get_total_raised',
                args: [],
              })
            ),
            auth: [],
          })
        )
        .setTimeout(30)
        .build()
    );

    if (goalRes.error || raisedRes.error) {
      throw new Error(`Simulation failed: ${goalRes.error || raisedRes.error}`);
    }

    const goal = goalRes.result?.retval ? scValToNative(goalRes.result.retval) : 0;
    const raised = raisedRes.result?.retval ? scValToNative(raisedRes.result.retval) : 0;
    
    return {
      goal: Number(goal),
      raised: Number(raised)
    };
  } catch (error) {
    console.error("Error fetching contract state:", error);
    throw error; // Rethrow to let the UI catch it and show a Retry button
  }
}

export async function fetchUserBadge(pubKey) {
  if (!pubKey) return 0;
  try {
    const res = await server.simulateTransaction(
      new TransactionBuilder(
        await server.getAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'),
        { fee: '100', networkPassphrase }
      )
        .addOperation(
          Operation.invokeHostFunction({
            func: xdr.HostFunction.hostFunctionTypeInvokeContract(
              new xdr.InvokeContractArgs({
                contractAddress: Address.fromString(BADGE_CONTRACT_ID).toScAddress(),
                functionName: 'get_badge',
                args: [
                  nativeToScVal(pubKey, { type: 'address' })
                ],
              })
            ),
            auth: [],
          })
        )
        .setTimeout(30)
        .build()
    );

    if (res.error) {
      throw new Error(`Badge simulation failed: ${res.error}`);
    }

    const badge = res.result?.retval ? scValToNative(res.result.retval) : 0;
    return Number(badge);
  } catch (error) {
    console.error("Error fetching user badge:", error);
    throw error;
  }
}

export async function submitDonation(pubKey, amount) {
  try {
    const account = await server.getAccount(pubKey);
    let tx = new TransactionBuilder(account, { fee: '1000', networkPassphrase })
      .addOperation(
        Operation.invokeHostFunction({
          func: xdr.HostFunction.hostFunctionTypeInvokeContract(
            new xdr.InvokeContractArgs({
              contractAddress: Address.fromString(CONTRACT_ID).toScAddress(),
              functionName: 'donate',
              args: [
                nativeToScVal(pubKey, { type: 'address' }),
                nativeToScVal(amount, { type: 'i128' }),
              ],
            })
          ),
          auth: [],
        })
      )
      .setTimeout(30)
      .build();

    const preparedTx = await server.prepareTransaction(tx);
    const { signedTxXdr } = await StellarWalletsKit.signTransaction(preparedTx.toXDR(), {
      networkPassphrase,
      address: pubKey,
    });

    const signedTx = TransactionBuilder.fromXDR(signedTxXdr, networkPassphrase);
    
    const submitResponse = await server.sendTransaction(signedTx);
    if (submitResponse.status === "ERROR") {
      throw new Error(`Transaction failed: ${JSON.stringify(submitResponse)}`);
    }

    return submitResponse;
  } catch (error) {
    console.error("Error submitting donation:", error);
    throw error;
  }
}

export async function checkTransactionStatus(txHash) {
  let attempts = 0;
  while (attempts < 15) {
    const status = await server.getTransaction(txHash);
    if (status.status !== rpc.Api.GetTransactionStatus.NOT_FOUND) {
      return status;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  throw new Error("Transaction verification timed out");
}
