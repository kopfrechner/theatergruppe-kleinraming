interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${import.meta.env.STRAPI_URL || 'http://localhost:1337'}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const options: any = {
    headers: {},
  };

  if (import.meta.env.STRAPI_API_TOKEN && import.meta.env.STRAPI_API_TOKEN !== 'your_token_here' && import.meta.env.STRAPI_API_TOKEN !== '') {
    options.headers['Authorization'] = `Bearer ${import.meta.env.STRAPI_API_TOKEN}`;
  }

  const res = await fetch(url.toString(), options);

  const json = await res.json();
  
  if (wrappedByKey && json && json[wrappedByKey]) {
    return json[wrappedByKey] as T;
  }

  return (json?.data || json || []) as T;
}
