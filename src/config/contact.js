// Saytda göstərilən əlaqə məlumatları. Nömrəni dəyişmək üçün yalnız
// bu faylı redaktə etmək kifayətdir — bütün komponentlər buradan oxuyur.
const raw = '+48 572 497 098';

// WhatsApp yalnız rəqəm qəbul edir: boşluqlar, tire və parantez atılır.
export const WHATSAPP_DIGITS = raw.replace(/\D/g, '');

export const WHATSAPP_DISPLAY = raw;

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_DIGITS}`;

/** Hazır "Salam" mesajı — URL-də kodlanmış şəkildə. */
export const WHATSAPP_MESSAGE = encodeURIComponent('Salam, məlumat almaq istəyirəm.');

export function whatsappLink(message) {
  return `${WHATSAPP_LINK}?text=${message ? encodeURIComponent(message) : WHATSAPP_MESSAGE}`;
}
