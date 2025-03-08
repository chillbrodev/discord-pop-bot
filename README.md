# EverQuest Planes of Power Flag Tracker Bot

A Discord bot designed to track progress through EverQuest's Planes of Power expansion. Players can track flag completion, share progress with guildmates, and see which flags they are eligible to complete next.

Built using [Deno](https://deno.land/) and Typescript. Utilizes [Supabase](https://supabase.com/) for storage of Player Flags. Supabase is a powerful managed Postgres solution with a generous free tier. The project includes a Database (DB) Type abstraction so that any storage can be used. If no desire to use Supabase then remove references to Supabase and implement another DB type.

The Bot is designed for a PER Server usage, there is no interaction across servers.

## Features

- 🚩 **Flag Tracking**: Track which Planes of Power flags you have completed
- 🔄 **Progress Sharing**: View your guildmates' progress through the expansion
- 📊 **Guild Statistics**: See how your guild is progressing as a whole
- 📋 **Next Steps**: Find out which flags you're eligible to complete next

### Setup

1. Clone the repository
2. Review the `.env.example` and create a `.env`. Supply the values.
3. Run `deno task test` to run the tests.
4. Run `deno task main` to bootup the bot. MUST supply Discord Token.
