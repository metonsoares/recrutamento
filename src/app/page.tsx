export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-6 text-center px-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Brownie do Ton
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Sistema de Recrutamento
        </p>
        <span className="text-sm text-zinc-400 dark:text-zinc-600">
          Fluxo Claude → GitHub → Vercel funcionando ✓
        </span>
      </main>
    </div>
  );
}
