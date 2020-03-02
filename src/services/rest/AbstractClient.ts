import { SomeFetch } from './index';

export interface FetchOptions {
  rootUrl: string;
  reqInit?: RequestInit;
  fetch?: SomeFetch;
}

export abstract class AbstractClient {
  fetch: SomeFetch;

  protected constructor(public fetchOptions: FetchOptions) {
    this.fetch = fetchOptions.fetch || window.fetch.bind(window);
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
    return (
      this.doFetch(uri, data && { body: JSON.stringify(data) })
        //返回为空时，如果直接调用res.json()报错，所以先拿到text
        .then(res => res.text())
        .then(text => text && JSON.parse(text))
    );
  }
}
