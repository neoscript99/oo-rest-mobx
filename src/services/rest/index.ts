export * from './SpringBootClient';
export * from './AbstractClient';

export interface SomeFetch {
  (input: RequestInfo, init?: RequestInit): Promise<Response>;
}
