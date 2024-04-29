use anchor_lang::prelude::*;

declare_id!("HibHxEtuQb6PAHjGXu2SmkAyWJ4vgZmMutiqBxSDwqKo");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.counter.set_inner(Counter {
            count: 0,
            bump: ctx.bumps.counter,
        });
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let count = ctx.accounts.counter.count;
        ctx.accounts.counter.count = count.checked_add(1).unwrap();
        msg!("Increment great success! Count now: {}", count);
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        let count = ctx.accounts.counter.count;
        ctx.accounts.counter.count = count.checked_sub(1).unwrap();
        msg!("Decrement great success! Count now: {}", count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        seeds = [b"counter", signer.key().as_ref()],
        space = Counter::INIT_SPACE,
        bump
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"counter", signer.key().as_ref()],
        bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"counter", signer.key().as_ref()],
        bump = counter.bump
    )]
    pub counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    pub count: u8,
    pub bump: u8,
}

impl Space for Counter {
    const INIT_SPACE: usize =
        std::mem::size_of::<u64>() + std::mem::size_of::<u8>() + std::mem::size_of::<u8>();
}
