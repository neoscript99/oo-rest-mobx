import { AbstractClient } from '../rest';

export abstract class RestService {
  protected constructor(protected restClient: AbstractClient) {}

  postApi(operator: string, data?: any): Promise<any> {
    return this.post(this.getApiUri(operator), data);
  }

  post(uri: string, data?: any): Promise<any> {
    return this.restClient.post(uri, data);
  }

  abstract getApiUri(operator: string): string;
}
