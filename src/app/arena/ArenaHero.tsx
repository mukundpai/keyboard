export function ArenaHero() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="absolute left-1/2 top-[-6rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.035)_0%,rgba(255,255,255,0.01)_50%,transparent_75%)] blur-[120px]" />
      <div className="absolute right-[-4rem] top-[10%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(200,200,200,0.025)_0%,transparent_70%)] blur-[100px]" />
      <div className="absolute left-[5%] bottom-[15%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_70%)] blur-[90px]" />

      {/* Fine grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.15]" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[hsl(var(--bg))] to-transparent" />
    </div>
  );
}