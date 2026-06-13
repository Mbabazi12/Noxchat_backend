# TODO - Fix prisma/schema.prisma + tsconfig/build errors

## Step 1: Align Prisma to Postgres
- Update `prisma/schema.prisma` datasource provider from `sqlite` to `postgresql`.

## Step 2: Fix Prisma client imports
- Update `src/config/db.ts` to import `PrismaClient` from `@prisma/client` (remove `../generated/prisma`).
- Remove/adjust `@prisma/adapter-pg` usage depending on what works with Prisma Postgres.

## Step 3: Fix missing exports in auth model
- Update `src/modules/auth/model.ts` to export the correct type from `src/modules/users/model.ts`.

## Step 4: Fix missing mongoose types/modules
- Decide to install/enable `mongoose` dependency (preferred) so models compile.

## Step 5: Fix strict TS implicit any errors
- Add explicit types in `src/modules/users/service.ts` for `tx`, `t`, `u`, `idx`.

## Step 6: Install deps + regenerate Prisma + build
- Run `npm install`
- Run `npx prisma generate`
- Run `npm run build`

