import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { db, storage } from "@/service/firebase"
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ApiResponse } from "@/types/api";
import { Account } from "@/types/frontend/entities";
import { api } from "@/service/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const fetchAccountByEmail = (email: string): Promise<ApiResponse<Account>> => {
    return api.get<Account>(`accounts/${email}/info` )
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);

  const account = (await fetchAccountByEmail(session?.user?.email ?? '')).data ?? undefined; 
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { content, roomId } = await req.json();

  try {
    // Call API to get sender information
    const sender = { id: account?.id, name: session.user.name };

    const messageRef = ref(storage, `messages/${roomId}/${Date.now()}`);
    await uploadString(
      messageRef,
      JSON.stringify({
        content,
        sender: sender.id,
        timestamp: serverTimestamp(),
      })
    );

    const downloadURL = await getDownloadURL(messageRef);

    const messageDoc = await addDoc(collection(db, "messages"), {
      content,
      sender: sender.id,
      roomId,
      timestamp: serverTimestamp(),
      downloadURL,
    });

    const message = {
      id: messageDoc.id,
      content,
      sender,
      timestamp: Date.now(),
      downloadURL,
    };

    // Emit the message to all clients in the room
    // This part will be handled by the client-side Socket.IO connection

    return NextResponse.json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ message: "Error sending message" }, { status: 500 });
  }
}

