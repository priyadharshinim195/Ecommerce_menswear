import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // { type: 'error' | 'ok', msg }

  const onSubmit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ type: 'error', msg: 'Please enter a valid email address.' });
      return;
    }
    setStatus({ type: 'ok', msg: 'Thank you. Demo only: no email was sent.' });
    setEmail('');
  };

  return (
    <section id="newsletter" className="section newsletter">
      <div className="container newsletter-inner">
        <p className="eyebrow">Newsletter</p>
        <h2>Early access, quietly delivered</h2>
        <p className="section-sub">New drops and editorial notes. No noise.</p>
        <form className="news-form" onSubmit={onSubmit} noValidate>
          <label className="visually-hidden" htmlFor="news-email">Email address</label>
          <input
            id="news-email"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <button className="btn btn-gold" type="submit">Subscribe</button>
        </form>
        {status && (
          <p className={`news-status ${status.type}`} role="status">{status.msg}</p>
        )}
      </div>
    </section>
  );
}
