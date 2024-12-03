export interface Message {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
    timestamp: number;
    roomId: string;
  }
  
export interface ChatRoom {
    id: string;
    name: string;
    lastMessage?: Message;
}

export interface Message {
    id: string;
    content: string;
    sender: {
        id: string;
        name: string;
    };
    timestamp: number;
    roomId: string;
}

export interface FormEvent extends React.FormEvent<HTMLFormElement> {
    preventDefault: () => void;
}
  