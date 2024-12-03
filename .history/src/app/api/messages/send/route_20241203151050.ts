import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { db, storage } from "@/service/firebase"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ApiResponse } from "@/types/api";
import { Account } from "@/types/frontend/entities";
import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const fetchAccountByEmail = (email: string): Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${email}/info` )
}

export async function POST(request: Request) {
  const session = await getServerSession(options);
  const account = (await fetchAccountByEmail(session?.user?.email?? '')).data?? undefined;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, roomId } = await request.json();

    // Create a unique filename for the message
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const messageRef = ref(storage, `chats/chat-files/${roomId}/${filename}`);

    // Create metadata for the message
    const metadata = {
      contentType: 'application/json',
      customMetadata: {
        content,
        senderId: account?.id,
        roomId
      }
    };

    // Upload the message data
    const messageBlob = new Blob([JSON.stringify({ content })], { type: 'application/json' });
    await uploadBytes(messageRef, messageBlob, metadata);

    // Get the download URL
    const downloadURL = await getDownloadURL(messageRef);

    const message = {
      id: filename,
      content,
      sender: {
        id: account.id,
        name: session.user.name
      },
      timestamp: new Date().toISOString(),
      downloadURL,
      roomId
    };

    return NextResponse.json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

