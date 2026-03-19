/*
 navigation contains helpers for encoding/decoding urls.
 we store the previous pages in the url for breadcrumbs, we also store filters for multi record pages.

*/

export type Crumb = {
  name: string; // most often a record
  title: string; // title for the breadcrumb
  id?: string; // if no id, then it's a multi record page
  filter?: string; // filter for multi record pages
};

export type BaseQueryParams = {
  prev?: string; // base64 encoded crumbs
  filter?: string; // filter for multi record pages
  title?: string; // title for the page, used for breadcrumbs
};

// example url: /product/1234?prev=### <- base64 encoded crumbs
// another example url: /product?prev=###&filter=abc <- multi record page with filter

export function encodeCrumbs(crumbs: Crumb[]) {
  const json = JSON.stringify(crumbs);
  return btoa(json);
}

export function decodeCrumbs(encoded: string): Crumb[] {
  try {
    const json = atob(encoded);
    return JSON.parse(json) as Crumb[];
  } catch (e) {
    console.error("Failed to decode crumbs", e);
    return [];
  }
}

export function buildUrl(name: string, title?: string, id?: string, prevCrumbs?: Crumb[], filter?: string) {
  let url = `/${name}`;
  if (id) {
    url += `/${id}`;
  }
  if (prevCrumbs) {
    url += `?prev=${encodeCrumbs(prevCrumbs)}`;
  }
  if (filter) {
    url += `${prevCrumbs ? "&" : "?"}filter=${encodeURIComponent(filter)}`;
  }
  if (title) {
    url += `${prevCrumbs || filter ? "&" : "?"}title=${encodeURIComponent(title)}`;
  }
  return url;
}
