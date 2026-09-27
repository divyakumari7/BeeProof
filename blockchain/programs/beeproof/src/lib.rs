use anchor_lang::prelude::*;

declare_id!("8eLXGBggKm9Svwpq1UXUbrZeFTvEEosfwkXYcSP7WxeY");

#[program]
pub mod beeproof {
    use super::*;

    pub fn register_batch(
        ctx: Context<RegisterBatch>,
        batch_number: String,
        canonical_hash: String,
    ) -> Result<()> {
        let batch_account = &mut ctx.accounts.batch_record;
        batch_account.authority = ctx.accounts.authority.key();
        batch_account.batch_number = batch_number;
        batch_account.canonical_hash = canonical_hash;
        batch_account.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Batch registered on Solana Devnet (Batch ID + SHA-256 Hash only)");
        Ok(())
    }

    pub fn update_integrity_hash(
        ctx: Context<UpdateIntegrityHash>,
        canonical_hash: String,
    ) -> Result<()> {
        let batch_account = &mut ctx.accounts.batch_record;
        batch_account.canonical_hash = canonical_hash;
        batch_account.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("Integrity SHA-256 hash updated on Solana Devnet");
        Ok(())
    }
}

#[account]
pub struct BatchRecord {
    pub authority: Pubkey,
    pub batch_number: String,
    pub canonical_hash: String,
    pub updated_at: i64,
}

#[derive(Accounts)]
#[instruction(batch_number: String, canonical_hash: String)]
pub struct RegisterBatch<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + (4 + 64) + (4 + 128) + 8,
        seeds = [b"batch", batch_number.as_bytes()],
        bump
    )]
    pub batch_record: Account<'info, BatchRecord>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(canonical_hash: String)]
pub struct UpdateIntegrityHash<'info> {
    #[account(mut, has_one = authority)]
    pub batch_record: Account<'info, BatchRecord>,
    pub authority: Signer<'info>,
}
