import { AsyncLocalStorage } from 'node:async_hooks';

export type CorrelationContext = Readonly<{ correlationId: string }>;

const storage = new AsyncLocalStorage<CorrelationContext>();

export const correlationContext = {
  run<T>(context: CorrelationContext, work: () => T): T {
    return storage.run(context, work);
  },
  current(): CorrelationContext | undefined {
    return storage.getStore();
  },
};
