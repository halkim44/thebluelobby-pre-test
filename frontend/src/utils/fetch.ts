type Options = {
  body?: Object;
  headers?: Record<string, string>;
};

export enum HttpMethod {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DELETE = "delete",
}

export const initFetch = (apiUrl: string) => {
  return <T>(
    method: HttpMethod,
    url: string,
    opts: Options = { body: {}, headers: {} }
  ): Promise<T> => {
    if (!/^(http|https)\:\/\//.test(url)) {
      url = apiUrl + url;
    }

    const headers = Object.assign(opts.headers || {}, {
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    const config: RequestInit = {
      credentials: "include",
      method: method.toUpperCase(),
      headers,
      body: JSON.stringify(opts.body || {}),
    };
    if (method == HttpMethod.GET) {
      delete config["body"];
    }
    return fetch(url, config).then((resp) => {
      if (resp.status >= 400) {
        return resp.json().then((v) => Promise.reject(v.error));
      }
      return resp.status === 204 ? Promise.resolve() : resp.json();
    });
  };
};
