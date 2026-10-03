import { useEffect, useRef, useState } from 'react';

const BASE = import.meta.env.VITE_API_URL || '';
async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(BASE + '/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}
function useApi(path) {
  const [data, setData] = useState([]);
  const [tick, setTick] = useState(0);
  useEffect(() => { api(path).then(setData).catch(() => setData([])); }, [path, tick]);
  return [data, () => setTick((t) => t + 1)];
}

const PROGRAMS = [
  ['Boarding School', 'Residential life with study hours, house system and weekend activities.', 'Class 5 to 12', '🏡'],
  ['Defence Academy', 'NDA-focused academics, physical training, shooting, fencing and SSB coaching.', 'NDA foundation', '🎖️'],
  ['IIT and NEET Preparation', 'Integrated school and coaching with weekly tests and doubt sessions.', 'IIT / NEET', '🔬'],
];
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: delay + 'ms' }}>{children}</div>;
}

function Doors() {
  const [open, setOpen] = useState(0);
  return (
    <div className="doors">{PROGRAMS.map(([t, d, tag, icon], i) => (
      <article key={t} tabIndex={0} data-icon={icon} className={`door d${i}${open === i ? ' open' : ''}`}
        onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)} onClick={() => setOpen(i)}>
        <span className="tag">{tag}</span><h3>{t}</h3><p>{d}</p><a href="#admissions">Enquire about this program</a>
      </article>))}
    </div>);
}

const CATS = ['All', 'Admissions', 'Exams', 'Events', 'General'];

function Notices() {
  const [cat, setCat] = useState('All');
  const [items] = useApi('/notices' + (cat === 'All' ? '' : '?category=' + cat));
  return (
    <section id="notices"><h2>Notices and news</h2>
      <div className="tabs">{CATS.map((c) => <button key={c} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}</div>
      {!items.length && <p>No notices in this category.</p>}
      {items.map((n, i) => (
        <div className="notice" key={n._id} style={{ animationDelay: i * 60 + 'ms' }}>
          <time>{new Date(n.publishAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</time>
          <span>{n.pinned && <b>Pinned: </b>}{n.title}</span>
        </div>))}
    </section>);
}

function Sports() {
  const [items] = useApi('/sports');
  return (
    <section id="sports"><h2>Sports at SBPS</h2>
      <div className="grid">{items.map((s, i) => <Reveal className="card" key={s._id} delay={i * 70}><h3>{s.name}</h3><p>Coach: {s.coach || 'To be added'}</p><p>{s.description}</p></Reveal>)}</div>
    </section>);
}

function Achievers() {
  const [items] = useApi('/achievements');
  return (
    <section id="achievements"><h2>Achievers</h2>
      <div className="grid">{items.map((a, i) => (
        <Reveal className="card" key={a._id} delay={i * 90}><small>{a.category}{a.year ? ' ' + a.year : ''}</small><h3>{a.title}</h3><p>{a.story}</p>
          <a href={`${BASE}/share/achievements/${a.slug}`}>Share this story</a></Reveal>))}</div>
    </section>);
}

function Enquiry() {
  const [msg, setMsg] = useState('');
  async function submit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    try { await api('/enquiries', { method: 'POST', body: f }); setMsg('Enquiry sent. The admissions team will contact you.'); e.target.reset(); }
    catch (err) { setMsg(err.message); }
  }
  return (
    <section id="admissions"><h2>Apply for admission</h2>
      <Reveal><form onSubmit={submit}>
        <label>Parent name<input name="parentName" required /></label>
        <label>Phone (WhatsApp)<input name="phone" type="tel" required /></label>
        <label>Program<select name="program"><option value="Boarding">Boarding School</option><option value="Defence">Defence Academy</option><option value="IIT-NEET">IIT / NEET</option></select></label>
        <label>Class applying for<input name="grade" /></label>
        <button className="btn" type="submit">Send enquiry</button><p role="status">{msg}</p>
      </form></Reveal>
    </section>);
}

function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem('t') || '');
  const [msg, setMsg] = useState('');
  const [notices, reload] = useApi('/notices');
  const [leads] = useApi('/enquiries');
  async function login(e) {
    e.preventDefault();
    try { const { token: t } = await api('/auth/login', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); sessionStorage.setItem('t', t); setToken(t); setMsg(''); }
    catch (err) { setMsg(err.message); }
  }
  async function add(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    try { await api('/notices', { method: 'POST', token, body: { title: f.title, category: f.category, pinned: !!f.pinned } }); e.target.reset(); reload(); setMsg('Published'); }
    catch (err) { setMsg(err.message); }
  }
  if (!token) return (
    <main className="wrap"><h2>Staff login</h2>
      <form onSubmit={login}><label>Email<input name="email" type="email" required /></label>
        <label>Password<input name="password" type="password" required /></label>
        <button className="btn">Log in</button><p role="status">{msg}</p></form></main>);
  return (
    <main className="wrap"><h2>Admin panel</h2>
      <button className="btn alt" onClick={() => { sessionStorage.removeItem('t'); setToken(''); }}>Log out</button>
      <form onSubmit={add}><h3>Add notice</h3>
        <label>Title<input name="title" required minLength="3" /></label>
        <label>Category<select name="category">{CATS.slice(1).map((c) => <option key={c}>{c}</option>)}</select></label>
        <label><span><input type="checkbox" name="pinned" /> Pin to top</span></label>
        <button className="btn">Publish notice</button><p role="status">{msg}</p></form>
      {notices.map((n) => <div className="notice" key={n._id}><span>{n.title}</span>
        <button className="btn alt" onClick={async () => { await api('/notices/' + n._id, { method: 'DELETE', token }); reload(); }}>Delete</button></div>)}
    </main>);
}

export default function App() {
  const [route, setRoute] = useState(location.hash);
  const [sc, setSc] = useState(false);
  useEffect(() => { const f = () => setSc(scrollY > 10); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f); }, []);
  useEffect(() => { const h = () => setRoute(location.hash); addEventListener('hashchange', h); return () => removeEventListener('hashchange', h); }, []);
  return (
    <>
      <div className="brandbar"><div className="wrap brand"><img src="/crest.svg" alt="SBPS crest" width="76" height="76" />
        <div><p className="bn">Social Baluni Public School</p>
          <p className="ba">Affiliated to CBSE, New Delhi, Affiliation No. 3530479, School Code 81702</p>
          <p className="bl"><b>Nursery to Class XII</b> Haridwar, Bypass Road, Dehradun</p></div></div></div>
      <header className={sc ? 'sc' : ''}><div className="wrap bar"><a className="logo" href="#"></a>
        <nav><a href="#notices">Notices</a><a href="#sports">Sports</a><a href="#achievements">Achievers</a><a href="#admissions">Admissions</a><a href="#/admin">Staff login</a></nav></div></header>
      {route === '#/admin' ? <Admin /> : <>
        <div className="hero"><div className="sun" aria-hidden="true" />
          <div className="wrap"><h1><span>Three paths.</span><span>One campus in Dehradun.</span></h1>
            <p className="lead">Choose the path your child is aiming for.</p><Doors /></div><div className="ridge" aria-hidden="true" /></div>
        <main className="wrap"><Notices /><Sports /><Achievers /><Enquiry /></main></>}
      <footer><div className="wrap text-center">Social Baluni Public School, Dehradun, Uttarakhand | All rights reserved</div></footer>
    </>
  );
}
