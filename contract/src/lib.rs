use solana_program::{
    account_info::next_account_info, entrypoint,entrypoint::{ ProgramResult}, program::invoke_signed, pubkey::Pubkey, system_instruction::create_account, system_program::ID as SYSTEM_PROGRAM_ID
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let iter = &mut accounts.iter();
    let payer_account = next_account_info(iter)?;
    let pda_account = next_account_info(iter)?;
    let payer_pubkey = payer_account.key;
    let system_program = next_account_info(iter)?;

    //rederivingas the program doesnot trust 

    let (pda, bump) = Pubkey::find_program_address(
        &[b"bimal", payer_pubkey.as_ref()],
        &program_id,
    );

    let ix = create_account(
        &payer_account.key,
        &pda,
        1000000000,
        4,
        &SYSTEM_PROGRAM_ID,
    );
    let signer_seeds = &[b"bimal", payer_pubkey.as_ref(), &[bump]];

    invoke_signed(&ix, accounts, &[signer_seeds])?;

    Ok(())
}