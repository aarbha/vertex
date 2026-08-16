import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion, useInView, animate } from 'motion/react';
import { AnimatedHeading } from './components/AnimatedHeading';
import { FadeIn } from './components/FadeIn';
import { ScrollReveal } from './components/ScrollReveal';
import { X, Send, MessageSquareText, ArrowUp, ChevronDown, CheckCircle2, Menu, Upload, Cpu, FileCheck, Home, Building2, Factory, Building, Leaf, TreePine, Wind } from 'lucide-react';

const NAV_SECTIONS = [
  { label: "How It Works", id: "how-it-works" },
  { label: "Building Types", id: "building-types" },
  { label: "Green Spaces", id: "green-spaces" },
  { label: "Government", id: "government" },
] as const;

function StatCounter({ prefix = '', value, suffix = '', label }: { prefix?: string; value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (prefersReduced) {
      ref.current.textContent = prefix + value + suffix;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, prefix, suffix, prefersReduced]);

  return (
    <div className="flex flex-col items-start gap-1.5">
      <span ref={ref} className="text-3xl md:text-4xl font-bold tracking-tight text-white text-shadow-ambient">0</span>
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold">{label}</span>
    </div>
  );
}

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [activeSection, setActiveSection] = useState('hero');
  const [showProgressButton, setShowProgressButton] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sectionsRef = {
    hero: useRef<HTMLElement>(null),
    'how-it-works': useRef<HTMLElement>(null),
    'building-types': useRef<HTMLElement>(null),
    'green-spaces': useRef<HTMLElement>(null),
    government: useRef<HTMLElement>(null),
  };

  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();
  const videoScale = useTransform(scrollYProgress, [0, 0.6], [1, prefersReduced ? 1 : 1.02]);
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', prefersReduced ? '0%' : '3%']);

  const scrollToSection = (sectionId: keyof typeof sectionsRef) => {
    sectionsRef[sectionId].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowProgressButton(window.scrollY > 400);
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionsRef).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setChatOpen(false);
      setMessage('');
      setEmail('');
    }, 2500);
  };

  return (
    <div id="app-container" className="relative w-full min-h-screen bg-black text-white font-sans">

      {/* Background Video */}
      <motion.div
        id="bg-video-wrapper"
        className="fixed -top-6 left-0 w-full h-[calc(100%+48px)] z-0 select-none pointer-events-none"
        style={{ scale: videoScale, y: videoY }}
      >
        <video
          id="bg-video"
          className="video-enter w-full h-full object-cover"
          src="/video-project-7.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/5 via-black/8 to-black/50 z-[1]" />

      {/* Vignette + grain */}
      <div className="fixed inset-0 z-[2] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
      <div className="fixed inset-0 z-[2] pointer-events-none grain-overlay opacity-[0.05]" />

      {/* Navbar */}
      <header id="navbar-container" className="sticky top-0 w-full px-6 md:px-12 lg:px-16 pt-6 pb-2 select-none z-40 transition-all duration-300">
        <nav
          id="main-nav"
          className={`liquid-glass rounded-xl px-4 flex items-center justify-between transition-all duration-500 ${scrolled ? 'nav-scrolled py-2.5' : 'py-3.5'}`}
        >
          <motion.div
            id="scroll-progress"
            className="absolute top-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700"
            style={{ scaleX: scrollYProgress }}
          />

          <div
            id="logo"
            onClick={() => scrollToSection('hero')}
            className="text-2xl font-bold tracking-tight text-zinc-100 text-shadow-ambient cursor-pointer hover:opacity-85 transition-opacity font-logo"
          >
            VERTEX<span className="text-gold-500">.</span>
          </div>

          <div id="nav-links" className="hidden md:flex items-center gap-8 text-sm">
            {NAV_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id as keyof typeof sectionsRef)}
                  className={`relative py-1 cursor-pointer font-semibold tracking-wide transition-all duration-300 hover:text-white text-shadow-ambient ${
                    isActive ? "text-white opacity-100" : "text-white opacity-70 hover:opacity-100"
                  }`}
                >
                  {section.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-gold-300 to-gold-700 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              id="nav-chat-btn"
              onClick={() => setChatOpen(true)}
              className="hidden sm:block bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 hover:shadow-[0_8px_24px_rgba(255,255,255,0.15)] hover:-translate-y-px transition-all duration-300 cursor-pointer"
            >
              Get Started
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_SECTIONS.map((section, i) => (
              <motion.button
                key={section.id}
                onClick={() => {
                  scrollToSection(section.id as keyof typeof sectionsRef);
                  setMenuOpen(false);
                }}
                className="text-3xl font-semibold tracking-tight text-white/85 hover:text-white transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: 0.07 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {section.label}
              </motion.button>
            ))}
            <motion.button
              onClick={() => {
                setMenuOpen(false);
                setChatOpen(true);
              }}
              className="gold-btn px-8 py-3 rounded-lg font-bold text-sm cursor-pointer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ delay: 0.07 * NAV_SECTIONS.length, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Get Started
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 1: HERO */}
      <section
        id="hero"
        ref={sectionsRef.hero}
        className="min-h-[calc(100vh-100px)] flex flex-col justify-end w-full px-6 md:px-12 lg:px-16 pb-16 lg:pb-24 z-10 relative"
      >
        <div id="hero-grid" className="grid grid-cols-1 lg:grid-cols-2 lg:items-end gap-10 lg:gap-16 w-full">

          <div id="hero-left-column" className="flex flex-col items-start max-w-2xl lg:max-w-4xl xl:max-w-5xl select-none">
            <AnimatedHeading text="Engineering greener\nbuildings with AI." className="text-glow" />

            <FadeIn delay={805} duration={1000} className="w-full">
              <p id="hero-subheading" className="text-base md:text-lg text-white font-semibold mb-5 max-w-lg leading-loose text-shadow-ambient">
                Upload your layout. Our AI analyzes every square meter and recommends optimal green spaces — for homes, offices, factories, and apartments.
              </p>
            </FadeIn>

            <FadeIn delay={1205} duration={1000} className="w-full">
              <div id="hero-buttons" className="flex flex-wrap gap-4 items-center">
                <button
                  id="hero-chat-btn"
                  onClick={() => setChatOpen(true)}
                  className="bg-white text-black px-8 py-3 rounded-lg font-medium text-sm md:text-base hover:bg-gray-100 hover:shadow-[0_12px_32px_rgba(255,255,255,0.18)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  Get Started
                </button>
                <button
                  id="hero-explore-btn"
                  onClick={() => scrollToSection('how-it-works')}
                  className="gold-btn px-8 py-3 rounded-lg font-bold text-sm md:text-base cursor-pointer flex items-center gap-2"
                >
                  See How It Works <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </FadeIn>
          </div>

          <div id="hero-right-column" className="flex items-end justify-start lg:justify-end select-none">
            <FadeIn delay={1405} duration={1000} className="w-full sm:w-auto">
              <div
                id="tag-card"
                className="liquid-glass border border-white/20 px-6 py-3 rounded-xl inline-block transition-all duration-500 hover:-translate-y-1 hover:border-white/40 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]"
              >
                <span className="text-lg md:text-xl lg:text-2xl font-bold text-white tracking-widest uppercase">
                  Analyze. Greenify. Comply.
                </span>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS */}
      <section
        id="how-it-works"
        ref={sectionsRef['how-it-works']}
        className="min-h-screen py-24 px-6 md:px-12 lg:px-16 flex items-center justify-center relative z-10 w-full"
      >
        <div className="section-numeral absolute top-8 right-6 md:right-16 text-[9rem] md:text-[14rem] opacity-70 z-0" aria-hidden="true">01</div>
        <ScrollReveal className="w-full max-w-4xl relative z-10">
          <div className="liquid-glass panel-glass rounded-2xl p-8 md:p-12 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
              <div className="md:col-span-5 flex flex-col space-y-4">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-400 font-bold px-2.5 py-1 w-fit select-none">
                  HOW IT WORKS
                </span>
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-100 text-shadow-ambient leading-tight">
                  Three steps to a greener building.
                </h2>
              </div>
              <div className="md:col-span-7 flex flex-col space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                    <Upload className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-white mb-1">Upload Your Floor Plan</h4>
                    <p className="text-white/80 text-[15px] font-medium leading-relaxed">Submit your building layout — residential, commercial, industrial, or multi-unit. Our system accepts all common formats.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                    <Cpu className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-white mb-1">AI Analyzes Your Layout</h4>
                    <p className="text-white/80 text-[15px] font-medium leading-relaxed">Our engine studies orientation, sunlight exposure, structural load, and local climate to find optimal greening opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                    <FileCheck className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-wide uppercase text-white mb-1">Get Recommendations + Government Copy</h4>
                    <p className="text-white/80 text-[15px] font-medium leading-relaxed">Receive tailored green space plans with plant selections, placement maps, and an automated report ready for authorities.</p>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="gold-btn px-6 py-2.5 rounded-lg text-sm tracking-wide font-bold cursor-pointer flex items-center gap-2"
                  >
                    Start Your Project <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="border-t border-white/10 mt-10 pt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter value={1200} suffix="+" label="Buildings Analyzed" />
              <StatCounter value={340} suffix="K m²" label="Green Space Recommended" />
              <StatCounter value={85} suffix="+" label="Plant Species in Database" />
              <StatCounter value={28} label="Cities Covered" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 3: BUILDING TYPES */}
      <section
        id="building-types"
        ref={sectionsRef['building-types']}
        className="min-h-screen py-24 px-6 md:px-12 lg:px-16 flex items-center justify-center relative z-10 w-full"
      >
        <div className="section-numeral absolute top-8 left-2 md:left-8 text-[9rem] md:text-[14rem] opacity-70 z-0" aria-hidden="true">02</div>
        <ScrollReveal className="w-full max-w-4xl relative z-10">
          <div className="liquid-glass panel-glass rounded-2xl p-8 md:p-12 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
              <div className="md:col-span-5 flex flex-col space-y-4">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-400 font-bold px-2.5 py-1 w-fit select-none">
                  BUILDING TYPES
                </span>
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-100 text-shadow-ambient leading-tight">
                  Intelligent green design for every structure.
                </h2>
              </div>
              <div className="md:col-span-7 flex flex-col gap-4">
                {[
                  { icon: Home, label: "Residential", desc: "Houses and villas — rooftop gardens, vertical walls, courtyard greening." },
                  { icon: Building, label: "Multi-Unit", desc: "Flats and apartments — shared green zones, balcony planters, facade coverage." },
                  { icon: Building2, label: "Commercial", desc: "Offices and retail — lobby biophilia, rooftop terraces, parking shade trees." },
                  { icon: Factory, label: "Industrial", desc: "Factories and warehouses — perimeter buffers, stormwater gardens, air filtration belts." },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                      <item.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-wide uppercase text-white mb-1">{item.label}</h4>
                      <p className="text-white/80 text-[15px] font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 4: GREEN SPACES */}
      <section
        id="green-spaces"
        ref={sectionsRef['green-spaces']}
        className="min-h-screen py-24 px-6 md:px-12 lg:px-16 flex items-center justify-center relative z-10 w-full"
      >
        <div className="section-numeral absolute top-8 right-2 md:right-8 text-[9rem] md:text-[14rem] opacity-70 z-0" aria-hidden="true">03</div>
        <ScrollReveal className="w-full max-w-4xl relative z-10">
          <div className="liquid-glass panel-glass rounded-2xl p-8 md:p-12 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
              <div className="md:col-span-5 flex flex-col space-y-4">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-400 font-bold px-2.5 py-1 w-fit select-none">
                  GREEN INTELLIGENCE
                </span>
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-100 text-shadow-ambient leading-tight">
                  Know exactly where and what to plant.
                </h2>
              </div>
              <div className="md:col-span-7 flex flex-col space-y-6">
                <p className="text-white text-base md:text-lg leading-loose font-semibold text-shadow-ambient">
                  Our AI considers orientation, sunlight exposure, climate zone, soil conditions, and structural load to recommend optimal plant and tree species for every location in your building layout.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Leaf, label: "Species Selection", desc: "AI-matched plants for your climate and structure" },
                    { icon: TreePine, label: "Placement Maps", desc: "Exact locations optimized for growth and impact" },
                    { icon: Wind, label: "Environmental Impact", desc: "CO₂ reduction, cooling, and air quality gains" },
                  ].map((item) => (
                    <div key={item.label} className="liquid-glass rounded-xl p-4 border border-white/5 flex flex-col items-start gap-2">
                      <item.icon className="w-5 h-5 text-gold-400" />
                      <h5 className="text-xs font-bold tracking-wide uppercase text-white">{item.label}</h5>
                      <p className="text-white/70 text-[13px] font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="gold-btn px-6 py-2.5 rounded-lg text-sm tracking-wide font-bold cursor-pointer flex items-center gap-2"
                  >
                    Start a Project <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 5: GOVERNMENT */}
      <section
        id="government"
        ref={sectionsRef.government}
        className="min-h-screen py-24 px-6 md:px-12 lg:px-16 flex items-center justify-center relative z-10 w-full"
      >
        <div className="section-numeral absolute top-8 left-2 md:left-8 text-[9rem] md:text-[14rem] opacity-70 z-0" aria-hidden="true">04</div>
        <ScrollReveal className="w-full max-w-4xl relative z-10">
          <div className="liquid-glass panel-glass rounded-2xl p-8 md:p-12 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">

              <div className="md:col-span-12 flex flex-col space-y-4 mb-4">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-400 font-bold px-2.5 py-1 w-fit select-none">
                  GOVERNMENT READY
                </span>
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-100 text-shadow-ambient leading-tight">
                  Automated compliance documentation.
                </h2>
              </div>

              <div className="md:col-span-7 flex flex-col space-y-6">
                <p className="text-white text-base md:text-lg leading-loose font-semibold text-shadow-ambient">
                  Every analysis generates a government-ready report. Your green space plan is automatically formatted for submission to local authorities — including species lists, placement maps, environmental impact summaries, and regulatory compliance checklists.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="bg-white text-black px-8 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 hover:shadow-[0_12px_32px_rgba(255,255,255,0.18)] hover:-translate-y-0.5 transition-all duration-300 pointer-events-auto"
                  >
                    Get Your Report
                  </button>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="liquid-glass panel-glass border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-2">ANALYSIS CAPABILITIES</h4>
                    <ul className="text-xs text-white font-semibold space-y-2.5 font-mono">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> AI LAYOUT ANALYSIS
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> SPECIES RECOMMENDATION ENGINE
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> AUTOMATED REPORT GENERATION
                      </li>
                    </ul>
                  </div>
                  <div className="text-3xl font-light tracking-tight text-white/90">
                    EST. 2026
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer id="footer" className="relative z-10 mt-12 border-t border-gold-500/30 bg-black/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-6 flex flex-col space-y-5">
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-white select-none font-logo">
                VERTEX<span className="text-gold-500">.</span>
              </div>
              <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-md">
                AI-powered green space planning for every building. Where architecture meets nature, intelligently.
              </p>
            </div>

            <div className="md:col-span-2 flex flex-col space-y-3">
              <h5 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Platform</h5>
              {NAV_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id as keyof typeof sectionsRef)}
                  className="text-sm text-white/70 hover:text-gold-400 text-left transition-colors cursor-pointer w-fit"
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="md:col-span-2 flex flex-col space-y-3">
              <h5 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Connect</h5>
              <button
                onClick={() => setChatOpen(true)}
                className="text-sm text-white/70 hover:text-gold-400 text-left transition-colors cursor-pointer w-fit"
              >
                Get Started
              </button>
              <span className="text-sm text-white/70">hello@vertex.example</span>
            </div>

            <div className="md:col-span-2 flex flex-col space-y-3">
              <h5 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">Legal</h5>
              <span className="text-sm text-white/50">Privacy Policy</span>
              <span className="text-sm text-white/50">Terms of Use</span>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-xs text-white/40">© 2026 VERTEX. All rights reserved.</span>
            <span className="text-xs text-white/40">Built with absolute focus.</span>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showProgressButton && (
          <motion.button
            id="back-to-top"
            onClick={() => scrollToSection('hero')}
            className="fixed bottom-6 right-6 z-40 bg-white text-black p-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl cursor-pointer"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            id="chat-backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              id="chat-modal"
              className="liquid-glass w-full max-w-md border border-white/20 rounded-2xl p-6 relative flex flex-col"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                id="close-chat"
                onClick={() => {
                  setChatOpen(false);
                  setSubmitted(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 animate-pulse">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-medium tracking-tight">Request Received</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    We'll review your project details and reach out with next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-gold-400" />
                    <h3 className="text-lg font-semibold tracking-tight">Start Your Project</h3>
                  </div>
                  <p className="text-sm text-gray-300 font-light">
                    Tell us about your building and we'll get you started with AI-powered green planning.
                  </p>
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/40 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Tell us about your building project
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="We're developing a 20-story residential tower and need green space recommendations..."
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/40 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors pointer-events-auto cursor-pointer"
                  >
                    Submit Project
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
