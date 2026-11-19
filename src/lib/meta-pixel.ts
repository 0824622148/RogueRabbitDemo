/**
 * Facebook / Meta pixel.
 *
 * Nothing loads and nothing reaches Meta until the visitor accepts cookies in
 * CookieBanner. Before that window.fbq doesn't exist, so the track functions
 * below do nothing.
 *
 * Client-side navigations need no code here: fbevents.js sends its own PageView
 * on every URL change, so tracking them again would double-count.
 */

export const META_PIXEL_ID = '1612126510713659'

/** Holds 'accepted' or 'declined'. Read by the inline base code as well as CookieBanner. */
export const COOKIE_CONSENT_KEY = 'rr_cookie_consent'

/**
 * Meta's base code wrapped in window.rrStartPixel, which runs straight away for
 * a returning visitor who already accepted, or when CookieBanner calls it.
 * It always stays off the admin area.
 */
export const META_PIXEL_BASE_CODE = `
window.rrStartPixel = function () {
if (location.pathname.indexOf('/admin') === 0) return;
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
};
try {
if (localStorage.getItem('${COOKIE_CONSENT_KEY}') === 'accepted') window.rrStartPixel();
} catch (e) {}
`

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    rrStartPixel?: () => void
  }
}

interface PixelLine {
  slug: string
  unitPrice: number
  qty: number
}

function linesParams(lines: PixelLine[]) {
  return {
    content_type: 'product',
    content_ids: lines.map((l) => l.slug),
    contents: lines.map((l) => ({ id: l.slug, quantity: l.qty })),
    num_items: lines.reduce((s, l) => s + l.qty, 0),
    value: Math.round(lines.reduce((s, l) => s + l.unitPrice * l.qty, 0) * 100) / 100,
    currency: 'ZAR',
  }
}

export function trackViewContent(slug: string, unitPrice: number, name: string) {
  window.fbq?.('track', 'ViewContent', {
    ...linesParams([{ slug, unitPrice, qty: 1 }]),
    content_name: name,
  })
}

export function trackAddToCart(slug: string, unitPrice: number, qty: number, name: string) {
  window.fbq?.('track', 'AddToCart', {
    ...linesParams([{ slug, unitPrice, qty }]),
    content_name: name,
  })
}

export function trackInitiateCheckout(lines: PixelLine[]) {
  window.fbq?.('track', 'InitiateCheckout', linesParams(lines))
}

/** Value is the goods only, excluding delivery. The order reference is the event ID. */
export function trackPurchase(lines: PixelLine[], orderRef: string) {
  window.fbq?.('track', 'Purchase', linesParams(lines), { eventID: orderRef })
}
