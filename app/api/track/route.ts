import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// POST { path: string } → increments today's view count for that path.
// Fire-and-forget from the client; uses the service-role client (server-only),
// no auth check. In demo mode (no service-role key) it's a no-op.
export async function POST(req: Request) {
  const hasServiceRole =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT') &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    const { path } = await req.json();
    if (typeof path !== 'string' || !path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (hasServiceRole) {
      const supabase = createAdminClient();
      await supabase.rpc('bump_page_view', { p_path: path });
    }
  } catch {
    // Best-effort tracking — never surface errors to the caller.
  }
  return NextResponse.json({ ok: true });
}
