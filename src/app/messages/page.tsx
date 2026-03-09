import { BottomNav } from "@/components/layout/BottomNav";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="text-xl font-bold text-zinc-900">Messages</h1>
        <p className="mt-2 text-zinc-600">Coming in a later phase.</p>
      </main>
      <BottomNav activeTab="message" />
    </div>
  );
}
