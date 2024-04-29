import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

describe("counter", () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;
  const connection = anchor.getProvider().connection;
  const wallet = provider.wallet as anchor.Wallet;

  const [ counterPDA ] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };
  
  const log = async (signature: string): Promise<string> => {

    return signature;
  };
  
  it("Is initialized!", async () => {
    
    const tx = await program.methods.initialize().accounts({
      signer: wallet.publicKey,
      counter: counterPDA,
      systemProgram: SystemProgram.programId
    }).rpc();

    const accountData = await program.account.counter.fetch(counterPDA);
    console.log(`Count initialized. Great suceess!`);  
    console.log(`Transaction Signature: https://explorer.solana.com/transaction/${tx}?cluster=custom&customUrl=${connection.rpcEndpoint}`);
      
    } 
  );

  it("Incremented!", async () => {
    
    const tx = await program.methods.increment().accounts({
      signer: wallet.publicKey,
      counter: counterPDA,
    }).rpc();

    const accountData = await program.account.counter.fetch(counterPDA);
    console.log(`Count incremented to ${accountData.count}. Great suceess!`);
    console.log(`Transaction Signature: https://explorer.solana.com/transaction/${tx}?cluster=custom&customUrl=${connection.rpcEndpoint}`);

    } 
  );

  it("Decremented!", async () => {
    
    const tx = await program.methods.decrement().accounts({
      signer: wallet.publicKey,
      counter: counterPDA,
    }).rpc();

    const accountData = await program.account.counter.fetch(counterPDA);
    console.log(`Count decremented to ${accountData.count}. Great suceess!`);
    console.log(`Transaction Signature: https://explorer.solana.com/transaction/${tx}?cluster=custom&customUrl=${connection.rpcEndpoint}`);

    } 
  );
});
