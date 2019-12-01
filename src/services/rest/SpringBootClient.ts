import { AbstractClient, FetchOptions } from './AbstractClient';

export interface SpringBootError {
  error: string;
  message: string;
  timestamp: string;
  status: number;
  exception: string;
  path: string;
}

export class SpringBootClient extends AbstractClient {
  constructor(fetchOptions: FetchOptions) {
    const { reqInit } = fetchOptions;
    const headers = {
      'Content-Type': 'application/json',
    };
    const req: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers,
      credentials: 'include',
      ...reqInit,
    };
    super({
      ...fetchOptions,
      reqInit: req,
    });
  }

  doFetch(uri: string, req?: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) =>
      super.doFetch(uri, req).then(res => {
        if (res.ok) resolve(res);
        else {
          console.error(res);
          res.json().then((error: SpringBootError) => {
            console.error(error);
            reject(error.message);
          });
        }
      }),
    );
  }
}
