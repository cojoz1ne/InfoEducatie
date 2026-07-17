import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import AIConversation from '@/models/AIConversation';
import AIMessage from '@/models/AIMessage';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'eduwave_super_secret_jwt_key_for_dev_only';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Token invalid sau expirat" }, { status: 401 });
    }

    const userId = decoded.user.id;
    await connectToDatabase();

    const conversations = await AIConversation.find({ user_id: userId })
      .sort({ created_at: -1 });

    const formattedConvs = conversations.map(conv => conv.toJSON());

    return NextResponse.json(formattedConvs);
  } catch (error: any) {
    console.error("GET Conversations Error:", error);
    return NextResponse.json({ error: error.message || "Eroare la preluarea conversațiilor" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Token invalid sau expirat" }, { status: 401 });
    }

    const userId = decoded.user.id;
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID-ul conversației este obligatoriu" }, { status: 400 });
    }

    const conv = await AIConversation.findOne({ _id: id, user_id: userId });
    if (!conv) {
      return NextResponse.json({ error: "Conversația nu a fost găsită sau nu îți aparține" }, { status: 404 });
    }

    await AIMessage.deleteMany({ conversation_id: id });
    await AIConversation.deleteOne({ _id: id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Conversation Error:", error);
    return NextResponse.json({ error: error.message || "Eroare la ștergerea conversației" }, { status: 500 });
  }
}
