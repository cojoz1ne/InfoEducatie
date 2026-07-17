import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Adresa de email este invalidă.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if the email already exists
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Acest email este deja abonat la newsletter.' },
        { status: 409 }
      );
    }

    // Save the new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    return NextResponse.json(
      { message: 'Te-ai abonat cu succes la newsletter!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'A apărut o eroare la server. Te rugăm să încerci din nou mai târziu.' },
      { status: 500 }
    );
  }
}
