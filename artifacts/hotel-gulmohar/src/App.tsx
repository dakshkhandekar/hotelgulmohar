import { useEffect, useRef, useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Bed,
  UtensilsCrossed,
  Info,
  Home,
  MessageSquare,
  Star,
  Wifi,
  Car,
  Coffee,
  Baby,
  ArrowRight,
  Clock,
} from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'accommodation', label: 'Accommodation', icon: Bed },
  { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
  { id: 'about', label: 'About', icon: Info },
  { id: 'contact', label: 'Contact', icon: MessageSquare },
];

const ROOMS = [
  {
    name: 'Deluxe Room',
    size: '42 sqm',
    guests: '2 Guests',
    price: '$180',
    desc: 'Elegantly appointed with premium amenities, a comfortable king bed, and warm wooden furnishings for a luxurious stay.',
    image: '/image copy copy copy.webp',
  },
  {
    name: 'Suite',
    size: '68 sqm',
    guests: '2-3 Guests',
    price: '$340',
    desc: 'Spacious suite with a separate living area, elegant decor, and premium furnishings for the ultimate comfort.',
    image: '/images/suite-room.webp',
  },
];

const DINING = [
  {
    name: 'The Grand Banquet Hall',
    type: 'Fine Dining',
    hours: '',
    desc: 'An award-winning restaurant offering contemporary cuisine with locally sourced ingredients and breathtaking views.',
    image: '/dining-banquet-hall.webp',
    images: ['/dining-banquet-hall.webp', '/banquet-hall-angle2.webp', '/banquet-hall-angle3.webp'],
    interval: 5000,
  },
  {
    name: 'Perfectly Seasoned',
    type: 'Lounge & Bar',
    hours: '',
    desc: 'A multi-cuisine restaurant serving freshly prepared dishes with bold flavors and locally sourced ingredients — a feast for every palate.',
    image: '/food-1.webp',
    images: ['/food-1.webp', '/food-2.webp', '/food-3.webp', '/food-4.webp'],
    interval: 6000,
  },
];

const AMENITIES = [
  { icon: Wifi, label: 'High-Speed Wi-Fi' },
  { icon: Baby, label: 'Kids Zone' },
  { icon: Car, label: 'Valet Parking' },
  { icon: Coffee, label: 'In-Room Dining' },
];


function DiningCard({ venue }: { venue: typeof DINING[0] }) {
  const images = venue.images ?? [venue.image];
  const [current, setCurrent] = useState(0);
  const interval = venue.interval ?? 3000;

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="group overflow-hidden border border-stone-100 hover:border-amber-200 transition-colors duration-300 shadow-sm hover:shadow-lg">
      <div className="relative overflow-hidden h-52">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={venue.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${i === current ? 'opacity-100' : 'opacity-0'}`}
           loading="lazy" decoding="async" />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-amber-400 text-2xl drop-shadow-lg">★</div>
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-amber-400 w-3' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-stone-900 mb-1">{venue.name}</h3>
        {venue.hours && (
          <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>{venue.hours}</span>
          </div>
        )}
        <p className="text-stone-500 text-sm leading-relaxed">{venue.desc}</p>
      </div>
    </div>
  );
}

function CountUp({ value }: { value: string }) {
  // Split the raw value into its numeric part and any prefix/suffix (e.g. "95+", "4.9").
  const match = value.match(/^(\D*)([\d.]+)(\D*)$/);
  const prefix = match ? match[1] : '';
  const target = match ? parseFloat(match[2]) : 0;
  const suffix = match ? match[3] : '';
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0;

  const [display, setDisplay] = useState(0);
  const [pulsed, setPulsed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasRun.current) return;
        hasRun.current = true;

        const duration = 1600;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutCubic for a smooth deceleration
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
          else {
            setDisplay(target);
            setTimeout(() => setPulsed(true), 100);
          }
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className={`font-serif text-3xl text-stone-900 mb-1 tabular-nums transition-all duration-500 ${pulsed ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : ''}`}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </div>
  );
}

function WeatherWidget() {
  const [weather, setWeather] = useState<{ temp: number; feelsLike: number; humidity: number; code: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=18.5308&longitude=73.1443&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code')
      .then((res) => res.json())
      .then((data) => {
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            humidity: Math.round(data.current.relative_humidity_2m),
            code: data.current.weather_code,
          });
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const weatherEmoji = (code: number) => {
    if (code <= 1) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '🌨️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  };

  const weatherDesc = (code: number) => {
    if (code <= 0) return 'Clear Sky';
    if (code <= 1) return 'Mainly Clear';
    if (code <= 2) return 'Partly Cloudy';
    if (code <= 3) return 'Overcast';
    if (code <= 48) return 'Foggy';
    if (code <= 55) return 'Drizzle';
    if (code <= 63) return 'Light Rain';
    if (code <= 67) return 'Heavy Rain';
    if (code <= 77) return 'Snow Grains';
    if (code <= 82) return 'Rain Showers';
    if (code <= 86) return 'Snow Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Fair';
  };

  return (
    <div className="max-w-md mx-auto mt-10 mb-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-xs tracking-[0.3em] uppercase font-semibold text-stone-400">
          Current Weather
        </span>
      </div>
      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-stone-400">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading weather...</span>
        </div>
      )}
      {error && !loading && (
        <div className="text-center py-6 text-stone-400 text-sm">
          Weather temporarily unavailable
        </div>
      )}
      {weather && !loading && !error && (
        <div className="flex items-center justify-center gap-5 p-6 border border-stone-100 bg-stone-50">
          <span className="text-4xl">{weatherEmoji(weather.code)}</span>
          <div>
            <p className="font-serif text-3xl text-stone-900">{weather.temp}°C</p>
            <p className="text-sm text-stone-500">{weatherDesc(weather.code)}</p>
          </div>
          <div className="border-l border-stone-200 pl-5">
            <p className="text-xs text-stone-400">Feels like {weather.feelsLike}°C</p>
            <p className="text-xs text-stone-400 mt-1">Humidity {weather.humidity}%</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TypewriterTitle() {
  const lines = ['Hotel', 'Gulmohar'];
  const [displayedLines, setDisplayedLines] = useState<string[]>(['', '']);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) {
      setDone(true);
      return;
    }
    const text = lines[currentLine];
    if (currentChar < text.length) {
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[currentLine] = text.slice(0, currentChar + 1);
          return next;
        });
        setCurrentChar((c) => c + 1);
      }, 120);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentLine, currentChar]);

  return (
    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-6">
      {displayedLines[0]}
      <br />
      <span className="text-amber-400">{displayedLines[1]}</span>
      {!done && <span className="inline-block w-[3px] h-[0.8em] bg-amber-400 ml-2 animate-pulse align-middle" />}
    </h1>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const fadeRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0);
      const offsets = NAV_LINKS.map(({ id }) => {
        const el = sectionRefs.current[id];
        if (!el) return { id, top: Infinity };
        return { id, top: Math.abs(el.getBoundingClientRect().top - 100) };
      });
      const closest = offsets.reduce((a, b) => (a.top < b.top ? a : b));
      setActiveSection(closest.id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fade-in on scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    fadeRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="font-sans text-stone-800 bg-white">
      {/* ── Scroll Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
        <div
          className="h-full bg-amber-400 transition-[width] duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {/* ── Fixed Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-stone-900 shadow-xl py-2' : 'bg-stone-900/80 backdrop-blur-sm py-4'
        }`}
      >
        {/* Logo Row */}
        <div className="flex items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-3">
            <img src="/image copy copy.webp" alt="Hotel Gulmohar Logo" className={`object-contain transition-all duration-300 ${scrolled ? "w-9 h-9" : "w-12 h-12"}`} loading="eager" decoding="async" />
            <span className={`text-white font-serif tracking-widest uppercase transition-all duration-300 ${scrolled ? "text-lg" : "text-xl"}`}>
              Hotel Gulmohar
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-sm tracking-widest uppercase font-medium transition-colors duration-200 ${
                  activeSection === id
                    ? 'text-amber-400'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>

        {/* Contact Info Strip */}
        <div className="bg-amber-400 px-6 md:px-10 py-1.5 flex flex-wrap items-center justify-center md:justify-between gap-x-4 gap-y-1">
          <span className="text-stone-900 text-xs font-rounded font-extrabold tracking-wide">GST No: 27AMRPK6595M1ZY</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-stone-900 text-xs font-rounded font-extrabold tracking-wide">For Booking</span>
            <span className="text-stone-700 text-xs">|</span>
          <a
            href="tel:+919157912719"
            className="flex items-center gap-1.5 text-stone-900 text-xs font-semibold tracking-wide hover:text-stone-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            +91 9157912719
          </a>
          <span className="hidden sm:block text-stone-700 text-xs">|</span>
          <a
            href="mailto:booking@hotelgulmohar.com"
            className="flex items-center gap-1.5 text-stone-900 text-xs font-semibold tracking-wide hover:text-stone-700 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            booking@hotelgulmohar.com
          </a>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-stone-900 border-t border-stone-700 py-4">
            {NAV_LINKS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex items-center gap-3 w-full px-6 py-3 text-sm tracking-widest uppercase transition-colors ${
                  activeSection === id
                    ? 'text-amber-400 bg-stone-800'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}
      </header>
      {/* ── Hero Section ── */}
      <section
        id="home"
        ref={(el) => { sectionRefs.current['home'] = el; }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/image copy.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/30 to-stone-900/70" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-24 pb-24">
          <p className="hero-stagger hero-stagger-1 text-amber-400 text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Welcome to Luxury
          </p>
          <TypewriterTitle />
          <p className="hero-stagger hero-stagger-3 text-stone-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Where timeless elegance meets modern comfort. Experience the art of
            exceptional hospitality in the heart of the city.
          </p>
          <div className="hero-stagger hero-stagger-4 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:booking@hotelgulmohar.com"
              className="group px-8 py-4 bg-amber-400 text-stone-900 text-sm font-bold tracking-widest uppercase hover:bg-amber-300 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Discover More
              <Mail className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="tel:+919157912719"
              className="px-8 py-4 border border-white/50 text-white text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-colors duration-200 flex items-center justify-center"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <button
            onClick={() => scrollTo('accommodation')}
            className="pointer-events-auto flex items-center justify-center text-white/70 hover:text-white transition-colors animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-8 h-8" />
          </button>
        </div>
      </section>
      {/* ── Amenities Strip ── */}
      <div className="bg-stone-900 py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {AMENITIES.map(({ icon: Icon, label }) => (
            <div key={label} className="group flex items-center gap-3 text-white cursor-default">
              <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-400/20 group-hover:border-amber-400/60 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.4)]">
                <Icon className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
              </div>
              <span className="text-sm text-stone-300 transition-colors duration-300 group-hover:text-white">{label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* ── Accommodation Section ── */}
      <section
        id="accommodation"
        ref={(el) => { sectionRefs.current['accommodation'] = el; if (el) fadeRefs.current.push(el); }}
        className="fade-in-section py-24 px-6 bg-stone-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-600 text-xs tracking-[0.4em] uppercase font-semibold mb-3">
              Rest & Retreat
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">
              Accommodation
            </h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6" />
            <p className="text-stone-500 max-w-xl mx-auto text-base leading-relaxed">
              Each room and suite is a sanctuary of calm, crafted with meticulous
              attention to detail and stocked with the finest amenities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {ROOMS.map((room) => (
              <div
                key={room.name}
                className="bg-white group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                   loading="lazy" decoding="async" />
  
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-xl text-stone-900">
                      {room.name}
                    </h3>
                  </div>
                  <div className="flex gap-4 text-xs text-stone-400 mb-3 tracking-wide">
                    <span>{room.size}</span>
                    <span>•</span>
                    <span>{room.guests}</span>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {room.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Dining Section ── */}
      <section
        id="dining"
        ref={(el) => { sectionRefs.current['dining'] = el; if (el) fadeRefs.current.push(el); }}
        className="fade-in-section py-24 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-600 text-xs tracking-[0.4em] uppercase font-semibold mb-3">
              Taste & Savor
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">
              Dining
            </h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6" />
            <p className="text-stone-500 max-w-xl mx-auto text-base leading-relaxed">
              From sunrise breakfasts to candlelit dinners, our culinary
              experiences are crafted to delight every palate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {DINING.map((venue) => (
              <DiningCard key={venue.name} venue={venue} />
            ))}
          </div>
        </div>
      </section>
      {/* ── Quote / Divider ── */}
      <div className="group relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img
          src="/hotel-gulmohar-quote.webp"
          alt="Hotel Gulmohar building exterior"
          className="absolute inset-0 w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-500"
         loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/85 via-stone-900/40 to-transparent" />
        <div className="relative z-10 h-full flex flex-col items-start justify-center px-10 md:px-20 max-w-xl">
          <p className="text-amber-400 text-4xl font-serif leading-none mb-3">"</p>
          <p className="text-white font-serif text-lg md:text-2xl leading-relaxed italic" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            Every visit is a story worth telling. We exist to make yours
            unforgettable.
          </p>
          <p className="text-amber-400 text-xs tracking-widest uppercase mt-5 font-semibold" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            — The Gulmohar Team
          </p>
        </div>
      </div>
      {/* ── About Section ── */}
      <section
        id="about"
        ref={(el) => { sectionRefs.current['about'] = el; if (el) fadeRefs.current.push(el); }}
        className="fade-in-section py-24 px-6 bg-stone-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-600 text-xs tracking-[0.4em] uppercase font-semibold mb-3">
                Our Story
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6 leading-tight">
                A Legacy of
                <br />
                <span className="text-amber-600">Exceptional</span> Hospitality
              </h2>
              <div className="w-16 h-0.5 bg-amber-400 mb-8" />
              <p className="text-stone-500 leading-relaxed mb-5">
                Hotel Gulmohar has stood as a symbol of
                elegance and warmth for nearly a century. Our founders believed
                that true luxury is not merely about opulence — it is about
                feeling genuinely welcome, cared for, and at home.
              </p>
              <p className="text-stone-500 leading-relaxed mb-8">Today, we carry forward that same ethos with a team of over 100 dedicated hospitality professionals, world-class facilities, and an unwavering commitment to creating moments that matter.</p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '35+', label: 'Years of Service' },
                  { value: '25', label: 'Rooms & Suites' },
                  { value: '3.9', label: 'Guest Rating' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <CountUp value={value} />
                    {label === 'Guest Rating' && (
                      <div className="flex items-center justify-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i <= 3 ? 'text-amber-400 fill-amber-400' : i === 4 ? 'text-amber-400 fill-amber-400/40' : 'text-stone-300 fill-stone-300'}`}
                          />
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-stone-400 tracking-wide uppercase">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group overflow-hidden">
              <img
                src="/image copy copy copy copy.webp"
                alt="Hotel Gulmohar reception lobby"
                className="w-full h-96 md:h-[520px] object-cover shadow-xl group-hover:scale-105 transition-transform duration-500"
               loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>
      {/* ── Contact Section ── */}
      <section
        id="contact"
        ref={(el) => { sectionRefs.current['contact'] = el; if (el) fadeRefs.current.push(el); }}
        className="fade-in-section py-24 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-600 text-xs tracking-[0.4em] uppercase font-semibold mb-3">
              Get in Touch
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">
              Contact Us
            </h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-6" />
            <p className="text-stone-500 max-w-xl mx-auto text-base leading-relaxed">
              We are here to assist you. Reach us directly by phone or email — our team is available around the clock.
            </p>
          </div>

          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
            <a
              href="tel:+919157912719"
              className="group flex flex-col items-center text-center gap-5 p-10 border border-stone-100 hover:border-amber-300 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center group-hover:bg-amber-400 group-hover:border-amber-400 transition-all duration-300">
                <Phone className="w-7 h-7 text-amber-600 group-hover:text-stone-900 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-stone-400 tracking-widest uppercase mb-2">Call Us</p>
                <p className="font-serif text-2xl text-stone-900 mb-1">+91 9157912719</p>
                <p className="text-stone-400 text-xs">Available 24 hours, 7 days a week</p>
              </div>
            </a>
            <a
              href="mailto:booking@hotelgulmohar.com"
              className="group flex flex-col items-center text-center gap-5 p-10 border border-stone-100 hover:border-amber-300 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center group-hover:bg-amber-400 group-hover:border-amber-400 transition-all duration-300">
                <Mail className="w-7 h-7 text-amber-600 group-hover:text-stone-900 transition-colors" />
              </div>
              <div>
                <p className="text-xs text-stone-400 tracking-widest uppercase mb-2">Email Us</p>
                <p className="font-serif text-xl text-stone-900 mb-1">booking@hotelgulmohar.com</p>
                <p className="text-stone-400 text-xs">We reply within a few hours</p>
              </div>
            </a>
          </div>

          {/* ── Weather Widget ── */}
          <WeatherWidget />

          {/* ── Map Widget ── */}
          <div className="mt-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="w-4 h-4 text-amber-600" />
              <p className="text-xs tracking-[0.3em] uppercase font-semibold text-stone-400">
                Find Us on the Map
              </p>
            </div>
            <div className="relative shadow-lg border border-stone-100 overflow-hidden">
              <iframe
                title="Hotel Gulmohar location on Google Maps"
                src="https://maps.google.com/maps?q=18.530805,73.144267&z=18&hl=en&output=embed"
                className="w-full h-[280px] sm:h-[320px] block border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
              <div className="text-stone-600">
                <p className="font-serif text-base text-stone-900">
                  NH 17, Nagothane, Chikani, Maharashtra 402106
                </p>
                <p className="text-xs text-stone-500 font-mono">
                  18.530805° N, 73.144267° E
                </p>
              </div>
              <a
                href="https://www.google.com/maps/place/Hotel+Gulmohar/@18.5309313,73.1447904,17z/data=!4m14!1m7!3m6!1s0x3be813999880ea2b:0x59b2fca4d43de5!2sHotel+Gulmohar!8m2!3d18.530805!4d73.144267!16s%2Fg%2F1tgdgg8p!3m5!1s0x3be813999880ea2b:0x59b2fca4d43de5!8m2!3d18.530805!4d73.144267!16s%2Fg%2F1tgdgg8p?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-stone-900 text-white text-xs font-semibold tracking-wide uppercase px-5 py-3 hover:bg-amber-400 hover:text-stone-900 transition-colors duration-200 shadow-md shrink-0"
              >
                <MapPin className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nearby Attractions ── */}
      <section ref={(el) => { if (el) fadeRefs.current.push(el); }} className="fade-in-section py-16 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 text-xs tracking-[0.4em] uppercase font-semibold mb-3">
              Explore Around
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">
              Nearby Attractions
            </h2>
            <div className="w-16 h-0.5 bg-amber-400 mx-auto mb-5" />
            <p className="text-stone-500 max-w-lg mx-auto text-sm leading-relaxed">
              Step beyond the hotel and discover the rich heritage, nature, and
              coastal beauty just a short drive away.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ballaleshwar Pali Temple',
                image: '/attraction-temple.webp',
                desc: 'One of the eight sacred Ashtavinayak temples, a revered Ganesha shrine just 20 km away.',
                imgClass: 'w-full h-full object-cover object-bottom hover:scale-105 transition-transform duration-500',
              },
              {
                name: 'Sudhagad Fort',
                image: '/attraction-fort.webp',
                desc: 'A majestic hilltop fort surrounded by lush Sahyadri greenery, 15 km away — perfect for trekking enthusiasts.',
                imgClass: 'w-full h-full object-cover hover:scale-105 transition-transform duration-500',
              },
              {
                name: 'Kashid Beach',
                image: '/attraction-beach.webp',
                desc: 'A serene golden beach on the Konkan coast, 50 km away — perfect for sunsets and peaceful evening walks.',
                imgClass: 'w-full h-full object-cover hover:scale-105 transition-transform duration-500',
              },
              {
                name: 'Birla Mandir',
                image: '/attraction-birla.webp',
                desc: 'A stunning white marble temple dedicated to Lord Vishnu, 55 km away — offering a serene spiritual experience.',
                imgClass: 'w-full h-full object-cover hover:scale-105 transition-transform duration-500',
              },
              {
                name: 'Murud Beach',
                image: '/attraction-murud-beach.webp',
                desc: 'A pristine and lesser-explored beach on the Konkan coast, 65 km away — known for its calm waters, coconut palms, and stunning shoreline.',
                imgClass: 'w-full h-full object-cover hover:scale-105 transition-transform duration-500',
              },
              {
                name: 'Raigad Fort',
                image: '/attraction-raigad-fort.webp',
                desc: 'The legendary capital of Chhatrapati Shivaji Maharaj\'s empire, 60 km away — a must-visit hilltop fort steeped in Maratha history.',
                imgClass: 'w-full h-full object-cover hover:scale-105 transition-transform duration-500',
              },
            ].map((place) => (
              <div
                key={place.name}
                className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className={place.imgClass}
                   loading="lazy" decoding="async" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base text-stone-900 mb-1">
                    {place.name}
                  </h3>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    {place.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-stone-900 fill-stone-900" />
                </div>
                <span className="text-white font-serif text-lg tracking-widest uppercase">
                  Hotel Gulmohar
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                A timeless landmark of luxury and warmth. Your home
                away from home. <span className="block mt-2 text-xs text-stone-500">Since 1990</span>
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i <= 3 ? 'text-amber-400 fill-amber-400' : i === 4 ? 'text-amber-400 fill-amber-400/40' : 'text-stone-600 fill-stone-600'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-400">3.9 on Google</span>
              </div>
            </div>
            <div>
              <h4 className="text-white text-xs tracking-widest uppercase font-semibold mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {NAV_LINKS.map(({ id, label }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollTo(id)}
                      className="text-sm hover:text-amber-400 transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs tracking-widest uppercase font-semibold mb-4">
                Contact
              </h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  +91 9157912719
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  booking@hotelgulmohar.com
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  NH 17, Nagothane, Chikani, Maharashtra 402106
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>© {new Date().getFullYear()} Hotel Gulmohar. All rights reserved.</p>
            <p>Crafted with care for exceptional guests.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
