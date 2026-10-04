// Safety net for facts the model must never get wrong. It runs on every reply before it is sent, so a garbled
// email or an invented version of the website's domain is corrected even if the model slips.
export const EMAIL = 'brianliu0317@gmail.com';
export const WEBSITE = 'brianzliu.com';
const OWN_HOSTS = new Set(['brianzliu.com', 'brianliu.io']); // both really are this site

export function sanitizeReply(text: string): string {
    return text
        // any email address other than the real one becomes the real one
        .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g, EMAIL)
        // brianliu.dev / brianzliu.net / etc. -> the real domain (the real ones are left alone)
        .replace(/\b(https?:\/\/)?(www\.)?(brianz?liu\.[a-z]{2,})\b/gi, (match, scheme = '', _www, host: string) =>
            OWN_HOSTS.has(host.toLowerCase()) ? match : `${scheme}${WEBSITE}`);
}
