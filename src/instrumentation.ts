/**
 * Next.js Instrumentation Hook
 * Runs once per server-side process before modules are evaluated.
 * This patches the broken localStorage stub that Next.js 15 injects when
 * running with --localstorage-file (without a valid path), which provides a
 * localStorage object without the standard Storage interface methods.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const g = globalThis as typeof globalThis & { localStorage?: unknown };
    if (g.localStorage !== undefined && typeof (g.localStorage as Storage)?.getItem !== 'function') {
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: (_key: string) => null,
          setItem: (_key: string, _value: string) => {},
          removeItem: (_key: string) => {},
          clear: () => {},
          key: (_index: number) => null,
          length: 0,
        } satisfies Storage,
        writable: true,
        configurable: true,
      });
    }
  }
}
