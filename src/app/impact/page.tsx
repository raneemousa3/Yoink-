import { BottomNav } from "@/components/layout/BottomNav";

export default function ImpactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <main className="mx-auto max-w-lg px-4 py-8">
        <h1 className="text-xl font-bold text-zinc-900">Our Impact</h1>
        <p className="mt-2 text-zinc-600">Gamification & impact metrics coming soon.</p>
      </main>
      <BottomNav activeTab="impact" />
    </div>
  );
}
