'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Hl, { LIT_MS, emojiCursor } from '../Hl';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { MAX_USER_MESSAGES, PUSHBACK } from '../../lib/limits';
import LinkCard, { URL_RE } from './LinkCard';

type Role = 'user' | 'assistant';
type Message = { id: number; role: Role; content: string; local?: boolean };
type Face = 'neutral' | 'smile' | 'grin' | 'thinking' | 'thinking2' | 'thinking3';
type Phase = 'home' | 'leaving' | 'chat' | 'returning';
type Box = { left: number; top: number; width: number; height: number };

const FACES: Record<Face, string> = {
    neutral: '/images/headshots/headshot-neutral.png',
    smile: '/images/headshots/headshot-smile.png',
    grin: '/images/headshots/headshot-grin.png',
    thinking: '/images/headshots/headshot-thinking-1.png',
    thinking2: '/images/headshots/headshot-thinking-2.png',
    thinking3: '/images/headshots/headshot-thinking-3.png',
};
// stop-motion frames played while hovering the photo on the home screen
const HOVER_FRAMES: Face[] = ['neutral', 'smile', 'grin'];
const FRAME_MS = 110;
const FLIGHT_MS = 1050;
// expressions the face cycles through while text streams in
const TALK_FACES: Face[] = ['smile', 'grin', 'neutral', 'smile', 'grin', 'smile', 'neutral', 'grin'];
const TALK_MS = 150;
// chin-rub frames cycled while the model is thinking (there and back, so the hand keeps moving)
const THINK_FACES: Face[] = ['thinking', 'thinking2', 'thinking3', 'thinking2'];
const THINK_MS = 260;

const GREETING = [
    "hey! i'm the virtual version of brian 👋",
    "ask me about my research, projects, or what i'm up to. i'm still in beta so i might get stuff wrong!",
];
const SUGGESTIONS = ["what are you working on?", "tell me about your research", "what projects have you built?", "how can i reach you?"];

// /recruiter: the link handed out at career fairs. The visitor lands straight in the chat with a thank-you;
// the last line links to the site's pages inline (rendered as named links, see SITE_PAGES).
const RECRUITER_GREETING = [
    "hey! it's brian, well, the ai version of me 👋",
    "thanks for chatting with me at the ucsd career fair. i hope you enjoyed our conversation as much as i did!",
    "i'm looking for an internship for summer 2027 (spring works too). keep chatting with me here, or explore my https://brianzliu.com/projects, https://brianzliu.com/resume or https://brianzliu.com/ on your own.",
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// pages of this site are named inline (with the same emoji cursor as that page's heading) instead of getting a preview card
const SITE_PAGES: Record<string, { label: string; emoji: string }> = {
    '/': { label: 'homepage', emoji: '👋' },
    '/projects': { label: 'projects', emoji: '🚀' },
    '/resume': { label: 'resume', emoji: '📄' },
    '/resume.pdf': { label: 'resume (pdf)', emoji: '📄' },
    '/blog': { label: 'blog', emoji: '✏️' },
};
function sitePage(url: string) {
    try {
        const u = new URL(url);
        if (!['brianzliu.com', 'www.brianzliu.com', 'brianliu.io', 'www.brianliu.io'].includes(u.hostname)) return null;
        const page = SITE_PAGES[u.pathname.replace(/(.)\/$/, '$1')];
        return page ? { ...page, path: u.pathname } : null;
    } catch { return null; }
}
const isOwnSite = (url: string) => sitePage(url) !== null;

// plain-text urls in a bubble become tappable links; this site's pages become named inline links
function linkify(text: string, onSitePage?: (path: string) => void) {
    const parts: React.ReactNode[] = [];
    let last = 0;
    for (const m of text.matchAll(URL_RE)) {
        parts.push(text.slice(last, m.index));
        const page = sitePage(m[0]);
        parts.push(page
            ? <a key={m.index} href={page.path} target={onSitePage ? undefined : '_blank'} rel="noreferrer" className="sitelink" style={{ '--hl-cursor': emojiCursor(page.emoji) } as React.CSSProperties}
                onClick={onSitePage ? (e) => { e.preventDefault(); onSitePage(page.path); } : undefined}>{page.label}</a>
            : <a key={m.index} href={m[0]} target="_blank" rel="noreferrer" className="bubble__link">{m[0]}</a>);
        last = m.index + m[0].length;
    }
    parts.push(text.slice(last));
    return parts;
}

// Hand-drawn arrow from the end of the "chat with an AI version of me" phrase to the photo. It runs along the phrase's own (empty)
// line, up the right margin outside the text column, and in to the photo, so it never crosses the paragraph. The wobble comes
// from an SVG displacement filter. Returns null when there's no margin to run up (narrow windows), and the label shows instead.
function scribbleArrow(from: DOMRect, to: DOMRect, textRight: number) {
    const lane = textRight + 26;
    if (window.innerWidth - lane < 24) return null;
    const ax = from.right + 8, ay = from.top + from.height * 0.55;
    const dx = to.right + 12, dy = to.top + to.height * 0.55;
    const r = Math.max(8, Math.min(40, (ay - dy) / 2));
    const f = (n: number) => n.toFixed(1);
    const line = `M${f(ax)} ${f(ay)} L${f(lane - r)} ${f(ay + 1.5)} Q${f(lane)} ${f(ay)} ${f(lane)} ${f(ay - r)} L${f(lane - 2)} ${f(dy + r)} Q${f(lane)} ${f(dy)} ${f(lane - r)} ${f(dy - 1)} L${f(dx)} ${f(dy)}`;
    const head = `M${f(dx + 11)} ${f(dy - 8)} L${f(dx)} ${f(dy)} L${f(dx + 12)} ${f(dy + 6)}`;
    return { line, head };
}

const toBox = (r: DOMRect): Box => ({ left: r.left, top: r.top, width: r.width, height: r.height });

function Suggestions({ items, onPick }: { items: string[]; onPick: (s: string) => void }) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [edge, setEdge] = useState({ left: false, right: false });

    const update = useCallback(() => {
        const el = rowRef.current;
        if (!el) return;
        setEdge({ left: el.scrollLeft > 2, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
    }, []);

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [update]);

    const scroll = (dir: -1 | 1) => rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.6, behavior: 'smooth' });

    return (
        <div className="sugg" data-left={edge.left} data-right={edge.right}>
            <button type="button" className="sugg__arrow sugg__arrow--left" aria-label="scroll suggestions left" tabIndex={-1} onClick={() => scroll(-1)}>
                <span><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3 5 8l5 5" /></svg></span>
            </button>
            <div ref={rowRef} className="sugg__row" onScroll={update}>
                {items.map((s) => <button key={s} type="button" onClick={() => onPick(s)}>{s}</button>)}
            </div>
            <button type="button" className="sugg__arrow sugg__arrow--right" aria-label="scroll suggestions right" tabIndex={-1} onClick={() => scroll(1)}>
                <span><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 3 5 5-5 5" /></svg></span>
            </button>
        </div>
    );
}

export default function ChatHome({ recruiter = false }: { recruiter?: boolean }) {
    const router = useRouter();
    const greetingLines = recruiter ? RECRUITER_GREETING : GREETING;
    const [exiting, setExiting] = useState(false);
    const [phase, setPhase] = useState<Phase>('home');
    const [messages, setMessages] = useState<Message[]>([]);
    const [revealed, setRevealed] = useState<Record<number, number>>({}); // characters shown so far for streaming messages
    const [typing, setTyping] = useState(false);
    const [thinking, setThinking] = useState(false);
    const [talking, setTalking] = useState(false);
    const [talkFace, setTalkFace] = useState<Face>('neutral');
    const [thinkFace, setThinkFace] = useState<Face>('thinking');
    const [busy, setBusy] = useState(false);
    const [input, setInput] = useState('');
    const [stamp, setStamp] = useState('');
    const [hovered, setHovered] = useState(false);
    const [arrow, setArrow] = useState<{ line: string; head: string } | null>(null); // scribbled arrow from the "chat with an AI version of me" text to the photo
    const ctaRef = useRef<HTMLButtonElement>(null);
    const [lit, setLit] = useState(false); // photo stays in color for LIT_MS (5s) after being hovered
    const litTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const [hoverFrame, setHoverFrame] = useState(0);

    const avatarRef = useRef<HTMLDivElement>(null);
    const homeSlot = useRef<HTMLDivElement>(null); // invisible marker where the avatar lives on the home screen
    const phaseRef = useRef<Phase>('home');
    const session = useRef(0); // bumped on every start/exit so stale async work (greeting, replies) stops
    const threadRef = useRef<HTMLDivElement>(null);
    const nextId = useRef(1);
    const started = useRef(false);
    const alive = useRef(true);
    const cur = useRef<Box | null>(null); // current on-screen box of the flying avatar
    const scrolling = useRef(false);
    const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        alive.current = true;
        return () => { alive.current = false; clearTimeout(litTimer.current); };
    }, []);

    // hovering the photo, or the "chat with an AI version of me" phrase, colors the photo and shows the chat-with-me label
    const hoverOn = useCallback(() => {
        setHovered(true);
        setLit(true);
        clearTimeout(litTimer.current);
        litTimer.current = setTimeout(() => setLit(false), LIT_MS);
    }, []);
    const hoverOff = useCallback(() => { setHovered(false); setArrow(null); }, []);

    // hovering the phrase instead of the photo: color the photo, but point at it with a hand-drawn arrow rather than the label
    const hoverPhrase = useCallback(() => {
        hoverOn();
        const from = ctaRef.current?.getBoundingClientRect();
        const to = avatarRef.current?.getBoundingClientRect();
        const column = ctaRef.current?.closest('.home__content');
        if (!from || !to || !column) return;
        const textRight = column.getBoundingClientRect().right - parseFloat(getComputedStyle(column).paddingRight);
        setArrow(scribbleArrow(from, to, textRight));
    }, [hoverOn]);

    // stop-motion while hovering the photo (mouse only)
    useEffect(() => {
        if (phase !== 'home') return;
        const target = hovered ? HOVER_FRAMES.length - 1 : 0;
        if (hoverFrame === target) return;
        const id = setTimeout(() => setHoverFrame((f) => f + Math.sign(target - f)), FRAME_MS);
        return () => clearTimeout(id);
    }, [phase, hovered, hoverFrame]);

    // while the reply streams in, the face "talks" by cycling expressions
    useEffect(() => {
        if (!talking) return;
        let i = 0;
        const id = setInterval(() => { i = (i + 1) % TALK_FACES.length; setTalkFace(TALK_FACES[i]); }, TALK_MS);
        return () => clearInterval(id);
    }, [talking]);

    // while waiting for the model, the hand rubs the chin
    useEffect(() => {
        if (!thinking) return;
        let i = 0;
        setThinkFace(THINK_FACES[0]);
        const id = setInterval(() => { i = (i + 1) % THINK_FACES.length; setThinkFace(THINK_FACES[i]); }, THINK_MS);
        return () => clearInterval(id);
    }, [thinking]);

    // after the click the avatar is a fixed element that eases toward the slot beside the latest gray message
    const inChat = phase !== 'home';
    useLayoutEffect(() => {
        const el = avatarRef.current;
        if (!inChat || !el) return;
        const apply = (b: Box) => {
            el.style.left = `${b.left}px`;
            el.style.top = `${b.top}px`;
            el.style.width = `${b.width}px`;
            el.style.height = `${b.height}px`;
        };
        if (cur.current) apply(cur.current);

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let raf = 0;
        const tick = () => {
            raf = requestAnimationFrame(tick);
            const thread = threadRef.current;
            const returning = phaseRef.current === 'returning';
            const slot = returning ? homeSlot.current : thread?.querySelector<HTMLElement>('[data-active-slot="true"]');
            const from = cur.current;
            if (!thread || !slot || !from) return;
            const to = slot.getBoundingClientRect();
            const k = reduced || scrolling.current ? 1 : 0.16; // snap while scrolling so it stays glued to the message
            const ease = (a: number, b: number) => (Math.abs(b - a) < 0.4 ? b : a + (b - a) * k);
            const next = { left: ease(from.left, to.left), top: ease(from.top, to.top), width: ease(from.width, to.width), height: ease(from.height, to.height) };
            cur.current = next;
            apply(next);
            // a still copy stays hidden for exactly as long as the live avatar overlaps it, then fades in
            thread.querySelectorAll<HTMLElement>('[data-slot="static"]').forEach((s) => {
                const r = s.getBoundingClientRect();
                const hit = r.left < next.left + next.width && r.right > next.left && r.top < next.top + next.height && r.bottom > next.top;
                s.dataset.covered = hit ? 'true' : 'false';
            });
            const view = thread.getBoundingClientRect();
            el.style.opacity = returning || (to.bottom > view.top + 4 && to.top < view.bottom - 4) ? '1' : '0';
            // clip to the message area, so the avatar tucks under the message bar (or the top edge) exactly like the text does
            const cutTop = returning ? 0 : Math.max(0, view.top - next.top);
            const cutBottom = returning ? 0 : Math.max(0, next.top + next.height - view.bottom);
            el.style.clipPath = cutTop || cutBottom ? `inset(${cutTop}px 0px ${cutBottom}px 0px)` : '';
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            // back on the home screen the CSS positions the avatar again
            el.style.left = el.style.top = el.style.width = el.style.height = el.style.opacity = el.style.clipPath = '';
        };
    }, [inChat]);

    useLayoutEffect(() => { phaseRef.current = phase; }, [phase]);

    const onThreadScroll = () => {
        const el = threadRef.current;
        if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        scrolling.current = true;
        clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(() => { scrolling.current = false; }, 140);
    };

    // keep the newest text in view without animation (smooth scrolling fought the streaming updates and made rows jump)
    const stick = useRef(true);
    useLayoutEffect(() => {
        const el = threadRef.current;
        if (el && stick.current) el.scrollTop = el.scrollHeight;
    }, [messages, revealed, typing]);

    // adds an assistant message and types it in character by character
    const streamAssistant = useCallback(async (text: string, local = false, my = session.current) => {
        const id = nextId.current++;
        setMessages((m) => [...m, { id, role: 'assistant', content: text, local }]);
        setRevealed((r) => ({ ...r, [id]: 1 }));
        setTalking(true);
        const urls = [...text.matchAll(URL_RE)].map((m) => ({ start: m.index, end: m.index + m[0].length }));
        for (let n = 1; n < text.length; ) {
            await wait(28);
            if (!alive.current || session.current !== my) return;
            n = Math.min(text.length, n + 2 + Math.floor(Math.random() * 2));
            if (/[\uD800-\uDBFF]/.test(text[n - 1] ?? '')) n++; // never cut an emoji in half
            for (const u of urls) if (n > u.start && n < u.end) n = u.end; // links appear whole, never as half-typed urls
            setRevealed((r) => ({ ...r, [id]: n }));
        }
        setRevealed((r) => { const rest = { ...r }; delete rest[id]; return rest; });
        setTalking(false);
        setTalkFace('neutral');
    }, []);

    const nowStamp = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();

    const playGreeting = useCallback(async (my: number) => {
        for (const line of greetingLines) {
            if (!alive.current || session.current !== my) return;
            setTyping(true);
            await wait(900);
            if (!alive.current || session.current !== my) return;
            setTyping(false);
            await streamAssistant(line, true, my);
            await wait(250);
        }
    }, [streamAssistant, greetingLines]);

    // leave the chat for another page: the window fades down first, then the next page rises in
    const leaveTo = useCallback((path: string) => {
        setExiting(true);
        setTimeout(() => router.push(path), 320);
    }, [router]);

    // recruiter link: the photo flies straight from its spot into the chat, no click needed
    useEffect(() => {
        if (!recruiter) return;
        const id = setTimeout(() => void startChatRef.current?.(), 450);
        return () => clearTimeout(id);
    }, [recruiter]);

    const startChatRef = useRef<() => Promise<void>>(undefined);
    const startChat = useCallback(async () => {
        if (started.current || !avatarRef.current) return; // guards against double-starts (double click, hot reload)
        started.current = true;
        const my = ++session.current;
        window.scrollTo(0, 0);
        cur.current = toBox(avatarRef.current.getBoundingClientRect());
        setStamp(nowStamp());
        setPhase('leaving');

        await wait(FLIGHT_MS);
        if (!alive.current || session.current !== my) return;
        setPhase('chat');

        await wait(200);
        await playGreeting(my);
    }, [playGreeting]);
    useEffect(() => { startChatRef.current = startChat; }, [startChat]);

    // used when the conversation hits its message limit: clear it and say hi again without leaving the chat
    const resetChat = useCallback(async () => {
        const my = ++session.current;
        stick.current = true;
        setMessages([]); setRevealed({}); setTyping(false); setThinking(false); setTalking(false); setTalkFace('neutral');
        setBusy(false); setInput(''); setStamp(nowStamp());
        await wait(300);
        await playGreeting(my);
    }, [playGreeting]);

    // reverse of startChat: chat fades out, the avatar glides back to its home spot, the home text returns
    const goHome = useCallback(async () => {
        if (phaseRef.current !== 'chat') return;
        if (recruiter) { leaveTo('/'); return; }
        const my = ++session.current;
        window.scrollTo(0, 0);
        setHovered(false);
        setHoverFrame(0);
        setPhase('returning');
        await wait(350);
        if (!alive.current || session.current !== my) return;
        setMessages([]); setRevealed({}); setTyping(false); setThinking(false); setTalking(false); setTalkFace('neutral');
        setBusy(false); setInput(''); setStamp('');
        await wait(FLIGHT_MS - 350);
        if (!alive.current || session.current !== my) return;
        started.current = false;
        setPhase('home');
    }, [recruiter, leaveTo]);

    async function send(text: string) {
        const content = text.trim();
        if (!content || busy || phase !== 'chat' || messages.filter((m) => m.role === 'user').length >= MAX_USER_MESSAGES) return;

        const my = session.current;
        const userMessage: Message = { id: nextId.current++, role: 'user', content };
        const history = [...messages.filter((m) => !m.local), userMessage].map(({ role, content }) => ({ role, content }));
        stick.current = true;
        setMessages((m) => [...m, userMessage]);
        setInput('');
        setBusy(true);
        setThinking(true);
        await wait(500);
        if (session.current !== my) return;
        setTyping(true);

        let pushback = false; // a rejected message and its canned reply stay out of the history sent next
        let reply = "something went wrong on my end. try again in a sec!";
        try {
            const [res] = await Promise.all([
                fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history, audience: recruiter ? 'recruiter' : undefined }) }),
                wait(900),
            ]);
            const data = (await res.json()) as { reply?: string; error?: string; limit?: string };
            reply = data.reply ?? data.error ?? reply;
            pushback = data.limit === 'too-long' || data.limit === 'busy';
        } catch { /* keep the fallback message */ }

        if (session.current !== my) return;
        setTyping(false);
        setThinking(false);
        if (pushback) setMessages((m) => m.map((x) => (x.id === userMessage.id ? { ...x, local: true } : x)));
        await streamAssistant(reply, pushback, my);
        // the last allowed message gets a friendly sign-off before the composer swaps to "start a new chat"
        if (session.current === my && messages.filter((m) => m.role === 'user').length + 1 >= MAX_USER_MESSAGES) {
            await wait(600);
            if (session.current === my) await streamAssistant(PUSHBACK.sessionLimit, true, my);
        }
        if (session.current === my) setBusy(false);
    }

    const onSubmit = (e: FormEvent) => { e.preventDefault(); void send(input); };
    const onAvatarKey = (e: KeyboardEvent) => {
        if (phase === 'home' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); void startChat(); }
    };

    // rows: messages, plus a typing bubble, or an empty placeholder so the avatar has somewhere to land right after the click
    type Row = { key: string; role: Role; text?: string; typing?: boolean; placeholder?: boolean };
    const rows: Row[] = messages.map((m) => ({ key: `m${m.id}`, role: m.role, text: revealed[m.id] === undefined ? m.content : m.content.slice(0, revealed[m.id]) }));
    if (typing) rows.push({ key: 'typing', role: 'assistant', typing: true });
    else if (inChat && rows.length === 0) rows.push({ key: 'placeholder', role: 'assistant', placeholder: true });

    const hasSlot = (i: number) => rows[i].role === 'assistant' && (!rows[i + 1] || rows[i + 1].role !== 'assistant');
    let activeIndex = -1;
    rows.forEach((_, i) => { if (hasSlot(i)) activeIndex = i; });

    const lastUserId = [...messages].reverse().find((m) => m.role === 'user')?.id;
    const answered = messages.length > 0 && messages[messages.length - 1].role === 'assistant';
    const userCount = messages.filter((m) => m.role === 'user').length;
    const hasUserMessage = userCount > 0;
    const remaining = MAX_USER_MESSAGES - userCount;
    const limitReached = remaining <= 0 && !busy;
    const shown: Face = phase === 'home' || phase === 'returning' ? HOVER_FRAMES[hoverFrame] : thinking ? thinkFace : talking ? talkFace : 'neutral';
    const mode = phase === 'home' ? 'home' : phase === 'leaving' ? 'fly' : phase === 'returning' ? 'back' : 'chat';

    return (
        <main className="home" data-phase={phase} data-recruiter={recruiter} data-exit={exiting}>
            {arrow && phase === 'home' && (
                <svg className="scribble" aria-hidden="true">
                    <filter id="scribble-wobble"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter>
                    <path d={arrow.line} pathLength={1} />
                    <path d={arrow.head} pathLength={1} className="scribble__head" />
                </svg>
            )}
            <div className="home__content">
                <section className="intro">
                    <div className="intro__title">
                        <h1 className="fade" style={{ '--i': 0 } as React.CSSProperties}>
                            Hey, I&apos;m <Hl className="hl-red hl-wave">Brian Liu</Hl>.
                        </h1>

                        <div className="chat-label fade" data-hover={hovered && !arrow} style={{ '--i': 0 } as React.CSSProperties} aria-hidden="true">
                            <span>chat with me</span> <small>(beta)</small>
                        </div>

                        <div ref={homeSlot} className="avatar-slot" aria-hidden="true" />

                        <div
                            ref={avatarRef}
                            className="avatar"
                            data-mode={mode}
                                                        data-hover={hovered}
                            data-lit={lit}
                            role={phase === 'home' ? 'button' : undefined}
                            tabIndex={phase === 'home' ? 0 : -1}
                            aria-label={phase === 'home' ? 'chat with me (beta)' : undefined}
                            onClick={() => void startChat()}
                            onKeyDown={onAvatarKey}
                            onPointerEnter={(e) => { if (e.pointerType !== 'touch') hoverOn(); }}
                            onPointerLeave={(e) => { if (e.pointerType !== 'touch') hoverOff(); }}
                        >
                            {(Object.keys(FACES) as Face[]).map((key) => (
                                <Image
                                    key={key}
                                    src={FACES[key]}
                                    alt={key === 'neutral' ? 'Brian Liu' : ''}
                                    aria-hidden={key !== 'neutral' || undefined}
                                    fill
                                    sizes="160px"
                                    priority
                                    style={{ opacity: shown === key ? 1 : 0 }}
                                />
                            ))}
                        </div>
                    </div>

                    <p className="lede fade" style={{ '--i': 1 } as React.CSSProperties}>
                        I&apos;m a <Hl className="hl-blue hl-laptop">data science student</Hl> at <Hl className="hl-gold hl-sun">UCSD</Hl>.
                    </p>
                    <p className="mt-5 fade" style={{ '--i': 2 } as React.CSSProperties}>
                        I love tinkering with <Hl className="hl-green hl-science">data, software, and research</Hl>, and you can find me building hackathon projects,
                        training models, or <Hl className="hl-pink hl-palm">exploring San Diego in the sun</Hl>.
                    </p>
                    <p className="mt-5 fade" style={{ '--i': 2 } as React.CSSProperties}>
                        If you want to know more about me, take a look around the site, or{' '}
                        <span className="nowrap">
                        <button
                            type="button"
                            ref={ctaRef}
                            className="chat-cta"
                            data-lit={lit}
                            onClick={() => void startChat()}
                            onPointerEnter={(e) => { if (e.pointerType !== 'touch') hoverPhrase(); }}
                            onPointerLeave={(e) => { if (e.pointerType !== 'touch') hoverOff(); }}
                            onFocus={hoverPhrase}
                            onBlur={hoverOff}
                        >
                            chat with an AI version of me
                        </button>.</span>
                    </p>
                </section>

                <section className="section fade" style={{ '--i': 3 } as React.CSSProperties}>
                    <h2>Work</h2>
                    <div className="section__body">
                        <div className="entry">
                            <div className="entry__head">
                                <p><Link href="/resume" className="link job__org">Q-Lab, UC San Diego</Link></p>
                                <p className="job__when">Jan 2026–now</p>
                            </div>
                            <p className="job__role">Research Intern</p>
                            <p className="job__what">Building and evaluating AI systems for scientific simulation and single-cell forecasting.</p>
                        </div>
                        <div className="entry">
                            <div className="entry__head">
                                <p><Link href="https://asakana.co/" target="_blank" rel="noreferrer" className="link job__org">Asakana (YC F26)</Link></p>
                                <p className="job__when">Oct 2025–Feb 2026</p>
                            </div>
                            <p className="job__role">Product Development Intern</p>
                            <p className="job__what">Automated supplier data entry and built an AI-assisted ordering system.</p>
                        </div>
                        <div className="entry">
                            <div className="entry__head">
                                <p><Link href="/resume" className="link job__org">Rare AI Lab, UC San Diego</Link></p>
                                <p className="job__when">Sep 2024–Dec 2025</p>
                            </div>
                            <p className="job__role">Research Intern</p>
                            <p className="job__what">Built surrogate models that cut detector-simulation cost by 90%, and co-first-authored a NeurIPS 2025 workshop paper.</p>
                        </div>
                    </div>
                </section>

                <div className="links fade" style={{ '--i': 4 } as React.CSSProperties}>
                    <Link href="https://github.com/brianzliu" target="_blank" rel="noreferrer" className="link">github</Link>
                    <Link href="https://www.linkedin.com/in/brianzliu/" target="_blank" rel="noreferrer" className="link">linkedin</Link>
                    <a href="mailto:brianliu0317@gmail.com" className="link">email</a>
                    <Link href="/resume.pdf" target="_blank" className="link">resume</Link>
                </div>
            </div>

            <section className="chat__window" aria-hidden={phase === 'home'} inert={phase === 'home'}>
                <div className="chat__bar">
                    <button type="button" className="chat__back" onClick={() => void goHome()}>
                        <svg viewBox="0 0 10 16" width="9" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2 2 8l6 6" /></svg>
                        home
                    </button>
                </div>

                <div ref={threadRef} className="chat__thread" role="log" aria-live="polite" onScroll={onThreadScroll}>
                    {stamp && <div className="chat__stamp">today {stamp}</div>}
                    {rows.map((row, i) => {
                        const slot = hasSlot(i);
                        const active = i === activeIndex;
                        const next = rows[i + 1];
                        const tail = !next || next.role !== row.role;
                        const startOfGroup = i === 0 || rows[i - 1].role !== row.role;
                        const msg = messages.find((m) => `m${m.id}` === row.key);
                        // rich link cards appear once the message has finished streaming in
                        const cards = row.role === 'assistant' && msg && revealed[msg.id] === undefined ? [...new Set(msg.content.match(URL_RE) ?? [])].filter((u) => !isOwnSite(u)).slice(0, 2) : [];
                        return (
                            <div key={row.key} className="chat__row" data-role={row.role} data-start={startOfGroup}>
                                {row.role === 'assistant' && (
                                    <div className="chat__slot" data-slot={slot ? (active ? 'active' : 'static') : 'none'} data-active-slot={active}>
                                        {slot && !active && <Image src={FACES.neutral} alt="" fill sizes="64px" />}
                                    </div>
                                )}
                                {row.typing ? (
                                    <div className="bubble bubble--assistant bubble--typing" data-tail="true" aria-label="brian is typing"><i /><i /><i /></div>
                                ) : row.placeholder ? (
                                    <div className="bubble bubble--assistant" style={{ visibility: 'hidden' }}>&nbsp;</div>
                                ) : (
                                    <div className="chat__stack" data-role={row.role}>
                                        <div className={`bubble bubble--${row.role}`} data-tail={tail && !(row.role === 'assistant' && cards.length)}>{linkify(row.text ?? '', recruiter ? leaveTo : undefined)}</div>
                                        {cards.map((u) => <LinkCard key={u} url={u} />)}
                                    </div>
                                )}
                                {row.role === 'user' && <div className="chat__receipt" data-visible={msg?.id === lastUserId && (busy || answered)}>{busy ? 'delivered' : 'read'}</div>}
                            </div>
                        );
                    })}
                </div>

                <div className="chat__composer">
                    {!hasUserMessage && messages.length >= greetingLines.length && !talking && <Suggestions items={SUGGESTIONS} onPick={(s) => void send(s)} />}
                    {limitReached ? (
                        <div className="chat__limit">
                            <p>this chat has wrapped up</p>
                            <button type="button" onClick={() => void resetChat()}>start a new chat</button>
                        </div>
                    ) : (
                        <>
                            {remaining <= 3 && remaining > 0 && <div className="chat__remaining">{remaining} message{remaining === 1 ? '' : 's'} left in this chat</div>}
                        <form className="chat__form" onSubmit={onSubmit}>
                            <div className="chat__field">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="message"
                                    aria-label="message"
                                    maxLength={500}
                                    enterKeyHint="send"
                                    autoComplete="off"
                                />
                                <button type="submit" className="chat__send" aria-label="send" disabled={!input.trim() || busy} data-ready={input.trim().length > 0 && !busy}>
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" /></svg>
                                </button>
                            </div>
                        </form>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
