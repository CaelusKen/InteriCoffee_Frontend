import { Suspense } from 'react';
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from 'next/navigation';
import Chat from '@/components/custom/chat/chat';

export default async function ChatRoom({ params }: { params: { roomId: string } }) {
  const session = await getServerSession(options);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div>
      <h1>Chat Room: {params.roomId}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Chat roomId={params.roomId} />
      </Suspense>
    </div>
  );
}

