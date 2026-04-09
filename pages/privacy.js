// ============================================================
// FoodHive World — pages/privacy.js
// Privacy & Policy Page matching FoodHive design system
// Fonts: Caveat (titles) + Nunito (body) + Playfair Display (serif)
// Colors: --orange #E8873A, --cream #FAF6EE, --dark #2C1810
// ============================================================

import Head from 'next/head'
import Link from 'next/link'

const LAST_UPDATED = 'April 9, 2026'

const SECTIONS = [
  {
    id: 'information-we-collect',
    icon: '📋',
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Information You Provide',
        text: 'When you interact with FoodHive, you may provide us with certain information voluntarily. This includes your name and email address if you choose to comment on recipes, ratings and reviews you submit, feedback or messages you send through our contact form, and any preferences you set while using the platform.',
      },
      {
        subtitle: 'Information Collected Automatically',
        text: 'Like most websites, FoodHive automatically collects certain technical data when you visit. This includes your IP address, browser type and version, pages you visit and time spent on each page, referring URLs, device type (mobile, desktop, tablet), and general geographic location based on IP.',
      },
      {
        subtitle: 'Cookies & Similar Technologies',
        text: 'We use cookies and similar tracking technologies to enhance your experience on FoodHive. These help us remember your preferences, analyze site traffic, and improve our content. You can control cookie settings through your browser, though disabling them may affect some functionality.',
      },
    ],
  },
  {
    id: 'how-we-use',
    icon: '🔍',
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'To Provide & Improve FoodHive',
        text: 'Your information helps us deliver and continuously improve our recipe platform. We use it to display personalized recipe recommendations, process likes and comments you submit, respond to your questions and feedback, fix bugs and improve site performance, and develop new features that serve our community better.',
      },
      {
        subtitle: 'Analytics & Research',
        text: 'We analyze aggregated, anonymized usage data to understand which cuisines and recipes are most popular, how users navigate our platform, what features are most valuable, and how we can better serve food enthusiasts worldwide. This data never identifies you personally.',
      },
      {
        subtitle: 'Communications',
        text: 'If you have opted in, we may send you updates about new recipes, featured cuisines, or platform improvements. You can unsubscribe from any communication at any time using the link in our emails or by contacting us directly.',
      },
    ],
  },
  {
    id: 'data-sharing',
    icon: '🤝',
    title: 'Data Sharing & Disclosure',
    content: [
      {
        subtitle: 'We Do Not Sell Your Data',
        text: 'FoodHive does not sell, trade, or rent your personal information to third parties. Your data is not a product. Our business is built around sharing authentic world recipes — not monetizing user information.',
      },
      {
        subtitle: 'Service Providers',
        text: 'We work with trusted third-party services that help us operate FoodHive. These include Vercel (hosting), Supabase (database for likes and comments), and Airtable (recipe data management). Each provider is contractually bound to protect your data and use it only for services rendered to us.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required by law, court order, or government regulation, or if we believe in good faith that such disclosure is necessary to protect the rights, property, or safety of FoodHive, our users, or the public.',
      },
    ],
  },
  {
    id: 'data-storage',
    icon: '🗄️',
    title: 'Data Storage & Security',
    content: [
      {
        subtitle: 'Where Your Data Lives',
        text: 'FoodHive is hosted on Vercel\'s global edge network. Recipe interaction data (likes, comments, ratings) is stored securely in Supabase with row-level security (RLS) policies that restrict access to authorized operations only. Recipe content is managed through Airtable with strict access controls.',
      },
      {
        subtitle: 'Security Measures',
        text: 'We implement industry-standard security practices including HTTPS encryption for all data in transit, secure environment variables for all API keys and credentials, access controls limiting who can view or modify database records, and regular security reviews of our codebase and dependencies.',
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your data only for as long as necessary to provide our services. Comments and likes you submit are stored until you request deletion. Anonymous analytics data may be retained in aggregate form indefinitely. You may request deletion of your data at any time by contacting us.',
      },
    ],
  },
  {
    id: 'your-rights',
    icon: '⚖️',
    title: 'Your Rights & Choices',
    content: [
      {
        subtitle: 'Access & Correction',
        text: 'You have the right to know what personal data we hold about you and to request corrections if any information is inaccurate. Simply reach out to us through our contact page and we will respond within 30 days.',
      },
      {
        subtitle: 'Deletion',
        text: 'You can request deletion of any personal data we hold — including comments you have posted, ratings you have submitted, or any other identifiable information. We will process such requests promptly, typically within 7 business days.',
      },
      {
        subtitle: 'Opt-Out',
        text: 'You may opt out of any non-essential data collection at any time. This includes marketing communications (via unsubscribe links), analytics tracking (via browser settings or opt-out tools), and cookies (via browser preferences). Note that opting out of essential cookies may affect core site functionality.',
      },
    ],
  },
  {
    id: 'third-party',
    icon: '🔗',
    title: 'Third-Party Links & Services',
    content: [
      {
        subtitle: 'External Links',
        text: 'FoodHive recipes and content may include links to external websites — such as ingredient suppliers, cooking equipment reviews, or related food blogs. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before sharing any personal information.',
      },
      {
        subtitle: 'Embedded Content',
        text: 'Some pages may embed content from third-party platforms such as YouTube videos for recipe demonstrations. These services may collect data about your interaction with that content according to their own privacy policies, which are independent of FoodHive.',
      },
    ],
  },
  {
    id: 'children',
    icon: '👨‍👩‍👧',
    title: "Children's Privacy",
    content: [
      {
        subtitle: 'Age Requirement',
        text: 'FoodHive is intended for general audiences and is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information without parental consent, please contact us immediately and we will promptly delete such information.',
      },
    ],
  },
  {
    id: 'changes',
    icon: '📝',
    title: 'Changes to This Policy',
    content: [
      {
        subtitle: 'Policy Updates',
        text: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make significant changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. Continued use of FoodHive after any changes constitutes your acceptance of the updated policy.',
      },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — FoodHive World</title>
        <meta
          name="description"
          content="FoodHive World Privacy Policy — Learn how we collect, use, and protect your data on our global recipe platform."
        />
        <link rel="canonical" href="https://food-hive-one.vercel.app/privacy" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Caveat:wght@600;700&family=Nunito:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            Food<span>Hive</span>.
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/recipes" className="nav-link">Recipes</Link>
            <Link href="/#explore" className="nav-link">Menu</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>
          <div className="nav-right">
            <Link href="/recipes" className="nav-cta">Explore Recipes →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pp-hero">
        <div className="pp-hero-blob" />
        <div className="pp-hero-inner">
          <div className="pp-eyebrow">Legal</div>
          <h1 className="pp-hero-title">
            Privacy &amp; <em>Policy</em>
          </h1>
          <p className="pp-hero-sub">
            We believe in radical transparency. Here's exactly how FoodHive handles your data —
            in plain, honest language.
          </p>
          <div className="pp-hero-meta">
            <span className="pp-badge">🔒 Your data is never sold</span>
            <span className="pp-badge">📅 Last updated: {LAST_UPDATED}</span>
          </div>
        </div>
        <div className="pp-hero-visual">
          <div className="pp-shield">
            <div className="pp-shield-icon">🛡️</div>
            <div className="pp-shield-ring pp-ring-1" />
            <div className="pp-shield-ring pp-ring-2" />
            <div className="pp-shield-ring pp-ring-3" />
          </div>
        </div>
      </section>

      {/* ── QUICK NAV ── */}
      <section className="pp-quicknav-section">
        <div className="pp-container">
          <p className="pp-quicknav-label">Jump to section</p>
          <div className="pp-quicknav-grid">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="pp-quicknav-chip">
                <span>{s.icon}</span>
                <span>{s.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="pp-intro-section">
        <div className="pp-container pp-intro-grid">
          <div className="pp-intro-left">
            <div className="pp-section-eyebrow">Our Commitment</div>
            <h2 className="pp-section-title">
              Food brings people together.<br />
              <em>Trust keeps them here.</em>
            </h2>
          </div>
          <div className="pp-intro-right">
            <p className="pp-intro-text">
              FoodHive was built by food lovers, for food lovers. Our mission is to share
              authentic recipes from around the world — not to collect or exploit your personal
              data. This Privacy Policy explains what information we gather, why we gather it,
              and how we protect it.
            </p>
            <p className="pp-intro-text">
              We've written this in plain language because legalese shouldn't stand between you
              and understanding your rights. If you have any questions after reading, our team
              is always a message away.
            </p>
            <div className="pp-intro-commitment">
              <div className="pp-commit-item">
                <span className="pp-commit-icon">✅</span>
                <span>No data selling — ever</span>
              </div>
              <div className="pp-commit-item">
                <span className="pp-commit-icon">✅</span>
                <span>Industry-standard encryption</span>
              </div>
              <div className="pp-commit-item">
                <span className="pp-commit-icon">✅</span>
                <span>You can delete your data anytime</span>
              </div>
              <div className="pp-commit-item">
                <span className="pp-commit-icon">✅</span>
                <span>Transparent third-party usage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN POLICY SECTIONS ── */}
      <section className="pp-sections-wrapper">
        <div className="pp-container">
          {SECTIONS.map((section, idx) => (
            <div
              key={section.id}
              id={section.id}
              className={`pp-policy-block ${idx % 2 === 0 ? '' : 'pp-policy-block-alt'}`}
            >
              <div className="pp-policy-block-header">
                <div className="pp-policy-icon">{section.icon}</div>
                <div>
                  <div className="pp-policy-num">0{idx + 1}</div>
                  <h2 className="pp-policy-title">{section.title}</h2>
                </div>
              </div>
              <div className="pp-policy-content">
                {section.content.map((item, i) => (
                  <div key={i} className="pp-policy-item">
                    <h3 className="pp-policy-subtitle">{item.subtitle}</h3>
                    <p className="pp-policy-text">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section className="pp-contact-section">
        <div className="pp-container">
          <div className="pp-contact-card">
            <div className="pp-contact-left">
              <div className="pp-contact-icon">📬</div>
              <h2 className="pp-contact-title">Have Questions?</h2>
              <p className="pp-contact-text">
                Our team is happy to answer any questions about this Privacy Policy, how we
                handle your data, or to process a data deletion request.
              </p>
              <div className="pp-contact-details">
                <div className="pp-contact-row">
                  <span>📧</span>
                  <span>privacy@foodhive.world</span>
                </div>
                <div className="pp-contact-row">
                  <span>🌐</span>
                  <span>food-hive-one.vercel.app</span>
                </div>
                <div className="pp-contact-row">
                  <span>⏱️</span>
                  <span>We respond within 48 hours</span>
                </div>
              </div>
            </div>
            <div className="pp-contact-right">
              <Link href="/about" className="pp-contact-btn-primary">
                Visit About Page →
              </Link>
              <Link href="/recipes" className="pp-contact-btn-secondary">
                Explore Recipes
              </Link>
              <p className="pp-contact-fine">
                By using FoodHive, you agree to the terms of this Privacy Policy.
                Last updated {LAST_UPDATED}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pp-footer">
        <div className="pp-container">
          <div className="pp-footer-grid">
            <div className="pp-footer-brand">
              <Link href="/" className="pp-footer-logo">
                Food<span>Hive</span>.
              </Link>
              <p className="pp-footer-tagline">
                Authentic recipes from 10 world cuisines — crafted with love.
              </p>
            </div>
            <div className="pp-footer-col">
              <div className="pp-footer-heading">Explore</div>
              <Link href="/recipes" className="pp-footer-link">All Recipes</Link>
              <Link href="/#explore" className="pp-footer-link">Categories</Link>
              <Link href="/#countries" className="pp-footer-link">Cuisines</Link>
            </div>
            <div className="pp-footer-col">
              <div className="pp-footer-heading">Company</div>
              <Link href="/about" className="pp-footer-link">About FoodHive</Link>
              <Link href="/privacy" className="pp-footer-link pp-footer-link-active">Privacy Policy</Link>
            </div>
          </div>
          <div className="pp-footer-bottom">
            <span>© {new Date().getFullYear()} FoodHive World. All rights reserved.</span>
            <span>Made with ❤️ for food lovers everywhere.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Caveat:wght@600;700&family=Nunito:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --orange:   #E8873A;
          --orange-d: #C96B20;
          --cream:    #FAF6EE;
          --cream2:   #F0E8D6;
          --cream3:   #E8DCC8;
          --dark:     #2C1810;
          --gray:     #7A6A5A;
          --gray-l:   #B5A898;
          --r-sm:     8px;
          --r-md:     16px;
          --r-lg:     24px;
          --r-full:   999px;
        }

        body { font-family: 'Nunito', sans-serif; background: var(--cream); color: var(--dark); }
        a { text-decoration: none; color: inherit; }

        /* ── NAVBAR ── */
        .navbar {
          position: sticky; top: 0; z-index: 200;
          background: rgba(250,246,238,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--cream2);
          height: 64px;
        }
        .navbar-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 48px; height: 100%;
          display: flex; align-items: center; gap: 32px;
        }
        .logo {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900;
          color: var(--orange); flex-shrink: 0;
          letter-spacing: -0.3px;
        }
        .logo span { color: var(--orange); }
        .nav-links { display: flex; align-items: center; gap: 2px; margin-left: 12px; }
        .nav-link {
          font-size: 14px; font-weight: 600; color: var(--gray);
          padding: 8px 16px; border-radius: var(--r-full); transition: all .2s;
        }
        .nav-link:hover { color: var(--dark); background: var(--cream2); }
        .nav-right { margin-left: auto; }
        .nav-cta {
          background: var(--orange); color: white;
          font-size: 14px; font-weight: 700;
          padding: 10px 22px; border-radius: var(--r-full);
          transition: all .2s;
        }
        .nav-cta:hover { background: var(--orange-d); transform: translateY(-1px); }

        /* ── HERO ── */
        .pp-hero {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, var(--dark) 0%, #3D2218 100%);
          min-height: 380px;
          display: flex; align-items: center;
          padding: 80px 48px;
          gap: 60px;
        }
        .pp-hero-blob {
          position: absolute; top: -120px; right: -80px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,135,58,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .pp-hero-inner {
          max-width: 1200px; margin: 0 auto;
          flex: 1; position: relative; z-index: 1;
        }
        .pp-eyebrow {
          font-size: 11px; font-weight: 800;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--orange); margin-bottom: 16px;
        }
        .pp-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 6vw, 72px);
          font-weight: 700; color: white;
          line-height: 1.1; margin-bottom: 20px;
        }
        .pp-hero-title em { color: var(--orange); font-style: italic; }
        .pp-hero-sub {
          font-size: 16px; color: rgba(255,255,255,0.65);
          line-height: 1.7; max-width: 540px; margin-bottom: 28px;
        }
        .pp-hero-meta { display: flex; gap: 12px; flex-wrap: wrap; }
        .pp-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.75);
          font-size: 13px; font-weight: 600;
          padding: 8px 16px; border-radius: var(--r-full);
        }
        .pp-hero-visual {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pp-shield {
          position: relative;
          width: 160px; height: 160px;
          display: flex; align-items: center; justify-content: center;
        }
        .pp-shield-icon { font-size: 72px; position: relative; z-index: 2; }
        .pp-shield-ring {
          position: absolute; border-radius: 50%;
          border: 1.5px solid rgba(232,135,58,0.3);
          animation: pulse-ring 3s ease-in-out infinite;
        }
        .pp-ring-1 { width: 100px; height: 100px; animation-delay: 0s; }
        .pp-ring-2 { width: 130px; height: 130px; animation-delay: 0.5s; }
        .pp-ring-3 { width: 160px; height: 160px; animation-delay: 1s; }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.04); }
        }

        /* ── QUICK NAV ── */
        .pp-quicknav-section {
          background: white;
          border-bottom: 1px solid var(--cream2);
          padding: 24px 0;
        }
        .pp-container { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .pp-quicknav-label {
          font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 2px;
          color: var(--gray-l); margin-bottom: 14px;
        }
        .pp-quicknav-grid {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .pp-quicknav-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--cream); border: 1px solid var(--cream3);
          color: var(--gray); font-size: 12px; font-weight: 700;
          padding: 7px 14px; border-radius: var(--r-full);
          transition: all .2s;
        }
        .pp-quicknav-chip:hover {
          background: var(--orange); color: white;
          border-color: var(--orange);
          transform: translateY(-1px);
        }

        /* ── INTRO ── */
        .pp-intro-section { padding: 80px 0; background: var(--cream); }
        .pp-intro-grid {
          display: grid; grid-template-columns: 1fr 1.4fr; gap: 64px;
          align-items: start;
        }
        .pp-section-eyebrow {
          font-size: 11px; font-weight: 800;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--orange); margin-bottom: 16px;
        }
        .pp-section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 700; color: var(--dark); line-height: 1.25;
        }
        .pp-section-title em { color: var(--orange); font-style: italic; }
        .pp-intro-text {
          font-size: 15px; color: var(--gray);
          line-height: 1.8; margin-bottom: 18px;
        }
        .pp-intro-commitment {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
          margin-top: 28px;
        }
        .pp-commit-item {
          display: flex; align-items: center; gap: 10px;
          background: white; border: 1px solid var(--cream2);
          border-radius: var(--r-md); padding: 12px 16px;
          font-size: 13px; font-weight: 700; color: var(--dark);
        }
        .pp-commit-icon { font-size: 16px; }

        /* ── POLICY SECTIONS ── */
        .pp-sections-wrapper { padding: 20px 0 80px; }
        .pp-policy-block {
          padding: 60px 0;
          border-bottom: 1px solid var(--cream2);
          scroll-margin-top: 80px;
        }
        .pp-policy-block-alt { background: white; padding: 60px 48px; border-radius: var(--r-lg); margin: 0 0 4px; }
        .pp-policy-block-alt .pp-container { padding: 0; }
        .pp-policy-block-header {
          display: flex; align-items: flex-start; gap: 20px;
          margin-bottom: 36px;
        }
        .pp-policy-icon {
          width: 56px; height: 56px; border-radius: var(--r-md);
          background: var(--cream2);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; flex-shrink: 0;
        }
        .pp-policy-num {
          font-size: 11px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--orange); margin-bottom: 4px;
        }
        .pp-policy-title {
          font-family: 'Caveat', cursive;
          font-size: 32px; font-weight: 700; color: var(--dark);
        }
        .pp-policy-content {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px; margin-left: 76px;
        }
        .pp-policy-item {
          background: var(--cream); border: 1px solid var(--cream2);
          border-radius: var(--r-md); padding: 24px;
          transition: all .2s;
        }
        .pp-policy-item:hover { border-color: var(--cream3); box-shadow: 0 4px 16px rgba(44,24,16,0.06); }
        .pp-policy-subtitle {
          font-family: 'Caveat', cursive;
          font-size: 18px; font-weight: 700; color: var(--dark);
          margin-bottom: 10px;
        }
        .pp-policy-text { font-size: 13.5px; color: var(--gray); line-height: 1.8; }

        /* ── CONTACT SECTION ── */
        .pp-contact-section { padding: 60px 0; background: var(--cream2); }
        .pp-contact-card {
          background: linear-gradient(135deg, var(--dark) 0%, #3D2218 100%);
          border-radius: 24px; padding: 60px;
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px;
          align-items: center; position: relative; overflow: hidden;
        }
        .pp-contact-card::before {
          content: '';
          position: absolute; top: -80px; right: -60px;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,135,58,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .pp-contact-icon { font-size: 48px; margin-bottom: 16px; }
        .pp-contact-title {
          font-family: 'Playfair Display', serif;
          font-size: 36px; font-weight: 700; color: white;
          margin-bottom: 14px;
        }
        .pp-contact-text {
          font-size: 14px; color: rgba(255,255,255,0.6);
          line-height: 1.8; margin-bottom: 28px;
        }
        .pp-contact-details { display: flex; flex-direction: column; gap: 10px; }
        .pp-contact-row {
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7);
        }
        .pp-contact-right {
          display: flex; flex-direction: column;
          align-items: flex-start; gap: 14px; position: relative; z-index: 1;
        }
        .pp-contact-btn-primary {
          display: inline-block; background: var(--orange); color: white;
          font-size: 15px; font-weight: 700;
          padding: 14px 32px; border-radius: var(--r-full);
          transition: all .2s; width: 100%; text-align: center;
        }
        .pp-contact-btn-primary:hover { background: var(--orange-d); transform: translateY(-2px); }
        .pp-contact-btn-secondary {
          display: inline-block; background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8);
          font-size: 15px; font-weight: 700;
          padding: 14px 32px; border-radius: var(--r-full);
          transition: all .2s; width: 100%; text-align: center;
        }
        .pp-contact-btn-secondary:hover { background: rgba(255,255,255,0.14); transform: translateY(-2px); }
        .pp-contact-fine {
          font-size: 11px; color: rgba(255,255,255,0.3);
          line-height: 1.6; text-align: center; margin-top: 6px;
        }

        /* ── FOOTER ── */
        .pp-footer { background: var(--dark); padding: 60px 0 32px; }
        .pp-footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr;
          gap: 48px; margin-bottom: 48px;
        }
        .pp-footer-logo {
          font-family: 'Nunito', sans-serif;
          font-size: 24px; font-weight: 900; color: var(--orange);
          display: block; margin-bottom: 12px;
        }
        .pp-footer-logo span { color: var(--orange); }
        .pp-footer-tagline { font-size: 13px; color: rgba(255,255,255,0.35); line-height: 1.7; }
        .pp-footer-heading {
          font-size: 11px; font-weight: 800;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(255,255,255,0.4); margin-bottom: 16px;
        }
        .pp-footer-link {
          display: block; font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 10px; transition: color .15s;
        }
        .pp-footer-link:hover { color: var(--orange); }
        .pp-footer-link-active { color: var(--orange) !important; }
        .pp-footer-bottom {
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; justify-content: space-between; align-items: center;
          font-size: 12px; color: rgba(255,255,255,0.25);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .navbar-inner { padding: 0 24px; }
          .nav-links { display: none; }
          .pp-hero { padding: 60px 24px; flex-direction: column; min-height: auto; }
          .pp-hero-visual { display: none; }
          .pp-container { padding: 0 24px; }
          .pp-intro-grid { grid-template-columns: 1fr; gap: 32px; }
          .pp-intro-commitment { grid-template-columns: 1fr; }
          .pp-policy-content { grid-template-columns: 1fr; margin-left: 0; }
          .pp-policy-block-alt { padding: 40px 24px; }
          .pp-contact-card { grid-template-columns: 1fr; padding: 40px 28px; gap: 32px; }
          .pp-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .pp-footer-brand { grid-column: 1 / -1; }
          .pp-footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
          .pp-quicknav-section { padding: 20px 0; }
        }
      `}</style>
    </>
  )
}
