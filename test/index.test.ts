import { test, expect, beforeAll, describe } from "bun:test";
import { LiteSVM } from "litesvm";
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, } from "@solana/web3.js";

describe("Create pda from client", () => {
  let litesvm: LiteSVM;
  let pda: PublicKey;
  let bump: number;
  let programId: PublicKey;
  let payer: Keypair;

  beforeAll(() => {
    litesvm = new LiteSVM();
    programId = PublicKey.unique();
    payer = Keypair.generate();
    litesvm.addProgramFromFile(programId, "./pdasign.so");
    litesvm.airdrop(payer.publicKey, BigInt(100000000000));
    [pda, bump] = PublicKey.findProgramAddressSync([Buffer.from("bimal"), payer.publicKey.toBuffer()], programId);
    
    let ix = new TransactionInstruction({
      keys: [
        {
          pubkey: payer.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        }
      ],
      programId,
      data: Buffer.from("")
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = litesvm.latestBlockhash();
    tx.sign(payer);
    let res = litesvm.sendTransaction(tx);
    console.log(res.toString())
  });

  test("should create pda", () => {
    const balance = litesvm.getBalance(pda);
    console.log(balance)
    expect(Number(balance)).toBeGreaterThan(0);
    expect(Number(balance)).toBe(1000000000);
  });
  
});