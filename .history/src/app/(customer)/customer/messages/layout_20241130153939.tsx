import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InteriCoffee - Chat Dashboard",
  description: "Customer support chat dashboard",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background p-8">
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
