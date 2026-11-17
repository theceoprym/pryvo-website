const CANONICAL_HOST = 'pryvo.de';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const websiteHost = url.hostname === CANONICAL_HOST || url.hostname === 'www.' + CANONICAL_HOST;

    // Preserve the page and query string while consolidating all public variants.
    if (websiteHost && (url.protocol !== 'https:' || url.hostname !== CANONICAL_HOST)) {
      url.protocol = 'https:';
      url.hostname = CANONICAL_HOST;
      url.port = '';
      return Response.redirect(url.href, 301);
    }

    const response = await env.ASSETS.fetch(request);
    const type = response.headers.get('Content-Type') || '';
    if (/^text\/html(?:;|$)/i.test(type) && !/charset\s*=/i.test(type)) {
      const headers = new Headers(response.headers);
      headers.set('Content-Type', 'text/html; charset=utf-8');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
    return response;
  }
};
