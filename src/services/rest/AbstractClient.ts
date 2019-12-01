import { SomeFetch } from './index';

export interface FetchOptions {
  rootUrl: string;
  reqInit?: RequestInit;
  fetch?: SomeFetch;
}

export abstract class AbstractClient {
  fetch: SomeFetch;

  protected constructor(public fetchOptions: FetchOptions) {
    this.fetch = fetchOptions.fetch || fetch;
  }

  /**
   * url = rootUrl + uri
   * @param uri
   * @param init
   */
  doFetch(uri: string, req?: RequestInit): Promise<Response> {
    const { rootUrl, reqInit } = this.fetchOptions;
    return this.fetch(rootUrl + uri, { ...reqInit, ...req });
  }

  post(uri: string, data?: object): Promise<any> {
    return this.doFetch(uri, data && { body: JSON.stringify(data) }).then(res => res.json());
  }
}
