import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { supabaseClient } from '../../../../lib/supabaseClient';
import { hashPassword } from '../../../../lib/hash';

// GET all admin users
export async function GET() {
  const { data: users, error } = await supabaseClient
    .from('admin_user')
    .select('id, email, name, role, created_at');
  if (error) throw error;
  return NextResponse.json(users);
}

// POST create new admin user (expects JSON body { email, name?, password, role? })
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const { email, name, password, role } = await request.json();
  const hashed = await hashPassword(password);
  const { data: user, error } = await supabaseClient
    .from('admin_user')
    .insert({ email, name, password: hashed, role: role ?? 'admin' })
    .single();
  if (error) throw error;
  return NextResponse.json(user, { status: 201 });
}

// PUT update admin user (expects { id, email?, name?, password?, role? })
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const { id, email, name, password, role } = await request.json();
  const updates: any = {};
  if (email) updates.email = email;
  if (name) updates.name = name;
  if (role) updates.role = role;
  if (password) updates.password = await hashPassword(password);
  const { data: updated, error } = await supabaseClient
    .from('admin_user')
    .update(updates)
    .eq('id', id)
    .single();
  if (error) throw error;
  return NextResponse.json(updated);
}

// DELETE admin user (expects { id })
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const { id } = await request.json();
  const { error } = await supabaseClient.from('admin_user').delete().eq('id', id);
  if (error) throw error;
  return NextResponse.json({ success: true });
}
