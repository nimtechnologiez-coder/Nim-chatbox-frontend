import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/nimlogo.png';

const isLoggedIn = () => Boolean(localStorage.getItem('access'));

const suggestions = [
  'Explain Django REST API in simple terms',
  'Write a React Login page code',
  'How to connect MySQL with Django?',
  'Suggest project ideas for freshers',
];

const stats = [
  { value: 'Tamil', label: 'Tanglish + English replies' },
  { value: 'AI', label: 'Smart Gemini powered answers' },
  { value: '24/7', label: 'Available whenever you need' },
  { value: 'JWT', label: 'Secure account based chat' },
];

const steps = [
  {
    title: 'Create Account',
    desc: 'Register with your name, email, and password. Your chat history stays connected to your account.',
  },
  {
    title: 'Ask Anything',
    desc: 'Type in Tamil, English, or Tanglish. Nim understands your style and replies naturally.',
  },
  {
    title: 'Continue Smarter',
    desc: 'Open old chats, edit your messages, delete conversations, and continue from where you stopped.',
  },
];

const features = [
  {
    title: 'Tamil + Tanglish Support',
    desc: 'Ask in your own comfortable language. Nim keeps the reply simple and natural.',
    icon: 'தமிழ்',
  },
  {
    title: 'Code Friendly Answers',
    desc: 'Get neat explanations, formatted code, project ideas, debugging help, and step-by-step solutions.',
    icon: '</>',
  },
  {
    title: 'Saved Chat History',
    desc: 'Every conversation is organized in your sidebar, so you can reopen old chats anytime.',
    icon: '⌘',
  },
  {
    title: 'Edit and Regenerate',
    desc: 'Made a mistake in your message? Edit it and generate a fresh AI response instantly.',
    icon: '✎',
  },
  {
    title: 'Clean Chat UI',
    desc: 'A smooth ChatGPT-style interface with readable messages, sidebar history, and simple actions.',
    icon: '◐',
  },
  {
    title: 'Private Login System',
    desc: 'JWT authentication keeps the chat experience account-based and safer for every user.',
    icon: '♢',
  },
];

const faqs = [
  {
    q: 'Is Nim Chatbox free to use?',
    a: 'Yes. Create an account, login, and start chatting with Nim instantly.',
  },
  {
    q: 'Can I ask in Tamil or Tanglish?',
    a: 'Yes. You can type in Tamil, Tanglish, or English. Nim replies in the same comfortable style.',
  },
  {
    q: 'Will my chat history be saved?',
    a: 'Yes. Your conversations are saved to your account, so you can continue them later.',
  },
  {
    q: 'Can I edit a message after sending it?',
    a: 'Yes. You can edit your message and Nim can regenerate a new AI response for it.',
  },
  {
    q: 'Can I delete old conversations?',
    a: 'Yes. You can delete unwanted conversations from the Recent Chats section.',
  },
];

export default function Landing() {
  const loggedIn = isLoggedIn();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => setOpenFaq((prev) => (prev === i ? null : i));

  return (
    <div className="landingPage landingRedesign">
      <nav className="landingNav">
        <Link className="brandBlock" to="/">
          <div className="brandIcon">
            <img src={logo} alt="Nim Chatbox Logo" />
          </div>
          <div>
            <strong>Nim Chatbox</strong>
            <span>AI assistant</span>
          </div>
        </Link>

        <div className="navLinks">
          <a href="#demo">Preview</a>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="navActions">
          {loggedIn ? (
            <Link className="navBtnPrimary" to="/chat">Open Chat</Link>
          ) : (
            <>
              <Link className="navBtnGhost" to="/login">Login</Link>
              <Link className="navBtnPrimary" to="/register">Start Free</Link>
            </>
          )}
        </div>
      </nav>

      <header className="heroSection">
        <div className="heroDecor heroDecorOne"></div>
        <div className="heroDecor heroDecorTwo"></div>
        <div className="heroGridPattern"></div>

        <div className="heroContent">
          <span className="heroBadge">Built for your personal AI companion.</span>

          <h1>
            Chat smarter with your own
            <span> AI companion.</span>
          </h1>

          <p className="heroSub">
            Nim Chatbox helps you learn code, solve doubts, generate ideas,
            and continue conversations in Tamil, Tanglish, or English.
          </p>

          <div className="heroActions">
            {loggedIn ? (
              <Link className="heroPrimaryBtn" to="/chat">Open Chatbox</Link>
            ) : (
              <>
                <Link className="heroPrimaryBtn" to="/register">Create Free Account</Link>
                <Link className="heroSecondaryBtn" to="/login">Login</Link>
              </>
            )}
          </div>

          <div className="suggestionPills">
            {suggestions.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="heroShowcase" aria-hidden="true">
          <div className="showcaseHeader">
            <div className="showcaseDots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <strong>Nim Chat</strong>
          </div>

          <div className="showcaseBody">
            <div className="showcaseMessage userBubble">
              Bro, Django REST API simple ah explain pannu
            </div>

            <div className="showcaseMessage aiBubble">
              Sure macha. Django REST API means backend la data send and receive panna use panra system.
              React frontend request send pannum, Django JSON response kudukkum.
            </div>

            <div className="showcaseCode">
              <span>POST</span>
              <p>/api/chat/reply/</p>
            </div>

            <div className="typingLine">
              <span></span>
              <span></span>
              <span></span>
              Nim is thinking
            </div>
          </div>
        </div>
      </header>

      <section className="statsStrip" aria-label="Nim Chatbox highlights">
        {stats.map((stat) => (
          <div className="statCard" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="demoSection" id="demo">
        <div className="demoCopy">
          <span className="sectionEyebrow">Live Preview</span>
          <h2>Designed like a clean modern AI product</h2>
          <p>
            The landing page now has a fresh hero layout, floating chat preview,
            soft gradient background, modern cards, and clean call-to-action sections.
          </p>
        </div>

        <div className="previewPanel">
          <div className="previewSidebar">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="previewMain">
            <div className="previewQuestion">Suggest project ideas for freshers</div>
            <div className="previewAnswer">
              <strong>Nim Answer</strong>
              <p>
                Build a Student Management App, AI FAQ Chatbot, Expense Tracker,
                or Mini CRM. Add login, CRUD, dashboard, and database integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="howSection" id="how">
        <span className="sectionEyebrow centerText">Simple flow</span>
        <h2>Start chatting in three steps</h2>
        <p className="sectionSub">
          No complex setup. Create your account and start asking questions instantly.
        </p>

        <div className="stepsGrid">
          {steps.map((step, i) => (
            <div className="stepCard" key={step.title}>
              <div className="stepNumber">{String(i + 1).padStart(2, '0')}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featuresSection" id="features">
        <span className="sectionEyebrow centerText">Features</span>
        <h2>Everything needed for a smooth AI chat experience</h2>
        <p className="sectionSub">
          Nim is built for daily learning, coding doubts, project support, and quick answers.
        </p>

        <div className="featuresGrid">
          {features.map((feature) => (
            <div className="featureCard" key={feature.title}>
              <div className="featureIcon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="faqSection" id="faq">
        <span className="sectionEyebrow centerText">FAQ</span>
        <h2>Frequently Asked Questions</h2>
        <p className="sectionSub">
          Common questions about Nim Chatbox and how it works.
        </p>

        <div className="faqList">
          {faqs.map((item, i) => (
            <div
              className={`faqItem ${openFaq === i ? 'faqOpen' : ''}`}
              key={item.q}
            >
              <button
                type="button"
                className="faqQuestion"
                onClick={() => toggleFaq(i)}
              >
                <span>{item.q}</span>
                <span className="faqChevron">+</span>
              </button>

              <div className="faqAnswer">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ctaSection">
        <div>
          <span className="sectionEyebrow">Ready?</span>
          <h2>Ask your first question now</h2>
          <p>Create a free account and start using Nim Chatbox in seconds.</p>
        </div>

        <div className="ctaActions">
          {loggedIn ? (
            <Link className="navBtnPrimary heroBtn" to="/chat">Open Chat</Link>
          ) : (
            <>
              <Link className="navBtnPrimary heroBtn" to="/register">Create Account</Link>
              <Link className="navBtnGhost heroBtn" to="/login">Login</Link>
            </>
          )}
        </div>
      </section>

      <footer className="landingFooter">
        <div className="footerBrand">
          <div className="brandBlock">
            <div className="brandIcon">
              <img src={logo} alt="Nim Chatbox Logo" />
            </div>
            <div>
              <strong>Nim Chatbox</strong>
              <span>AI assistant</span>
            </div>
          </div>
          <p>AI assistant that speaks Tamil, Tanglish, and English. Built for students and developers.</p>
        </div>

        <div className="footerCol">
          <h4>Product</h4>
          <ul>
            <li><a href="#demo">Preview</a></li>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#features">Features</a></li>
          </ul>
        </div>

        <div className="footerCol">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>
      </footer>

      <p className="footerBottom">
        Nim Chatbox may occasionally make mistakes. Please verify important information.
      </p>
    </div>
  );
}
