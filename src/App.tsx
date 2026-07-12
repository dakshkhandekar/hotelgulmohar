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
  Waves,
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
    desc: 'Elegantly appointed with city views, a king bed, and premium amenities for a luxurious stay.',
    image:
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Suite',
    size: '68 sqm',
    guests: '2-3 Guests',
    price: '$340',
    desc: 'Spacious living area with a private balcony overlooking the garden and ocean horizon.',
    image:
      'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Presidential Suite',
    size: '120 sqm',
    guests: '4 Guests',
    price: '$680',
    desc: 'The pinnacle of luxury. Two bedrooms, a private terrace, butler service, and panoramic views.',
    image:
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const DINING = [
  {
    name: 'The Grand Terrace',
    type: 'Fine Dining',
    hours: '7:00 AM – 11:00 PM',
    desc: 'An award-winning restaurant offering contemporary cuisine with locally sourced ingredients and breathtaking views.',
    image:
      'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Ember & Oak Bar',
    type: 'Lounge & Bar',
    hours: '4:00 PM – 1:00 AM',
    desc: 'A sophisticated bar featuring handcrafted cocktails, rare whiskeys, and live jazz on Friday evenings.',
    image:
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'The Poolside Café',
    type: 'Casual Dining',
    hours: '8:00 AM – 6:00 PM',
    desc: 'Light refreshments, tropical drinks, and fresh salads served in a breezy poolside setting.',
    image:
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const AMENITIES = [
  { icon: Wifi, label: 'High-Speed Wi-Fi' },
  { icon: Waves, label: 'Infinity Pool' },
  { icon: Car, label: 'Valet Parking' },
  { icon: Coffee, label: 'In-Room Dining' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
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

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="font-sans text-stone-800 bg-white">
      {/* ── Fixed Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-stone-900 shadow-xl' : 'bg-stone-900/80 backdrop-blur-sm'
        }`}
      >
        {/* Logo Row */}
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          <div className="flex items-center gap-3">
            <img src="/image copy copy.png" alt="Hotel Gulmohar Logo" className="w-12 h-12 object-contain" />
            <span className="text-white font-serif text-xl tracking-widest uppercase">
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
        <div className="bg-amber-400 px-6 md:px-10 py-1.5 flex flex-wrap items-center justify-center gap-4">
          <span className="text-stone-900 text-xs font-bold tracking-wide uppercase">GST No: 27AMRPK6595M1ZY</span>
          <span className="text-stone-700 text-xs">|</span>
          <span className="text-stone-900 text-xs font-bold tracking-wide uppercase">For Booking</span>
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
        <img
          src="/image copy.png"
          alt="Hotel Gulmohar"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/30 to-stone-900/70" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-24">
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Welcome to Luxury
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-6">
            Hotel
            <br />
            <span className="text-amber-400">Gulmohar</span>
          </h1>
          <p className="text-stone-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Where timeless elegance meets modern comfort. Experience the art of
            exceptional hospitality in the heart of the city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollTo('about')}
              className="px-8 py-4 bg-amber-400 text-stone-900 text-sm font-bold tracking-widest uppercase hover:bg-amber-300 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Discover More
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-8 py-4 border border-white/50 text-white text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-colors duration-200"
            >
              Contact Us
            </button>
          </div>
        </div>

        <button
          onClick={() => scrollTo('accommodation')}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* ── Amenities Strip ── */}
      <div className="bg-stone-900 py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {AMENITIES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm text-stone-300">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Accommodation Section ── */}
      <section
        id="accommodation"
        ref={(el) => { sectionRefs.current['accommodation'] = el; }}
        className="py-24 px-6 bg-stone-50"
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

          <div className="grid md:grid-cols-3 gap-8">
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
                  />
  
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
        ref={(el) => { sectionRefs.current['dining'] = el; }}
        className="py-24 px-6 bg-white"
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

          <div className="grid md:grid-cols-3 gap-8">
            {DINING.map((venue) => (
              <div
                key={venue.name}
                className="group overflow-hidden border border-stone-100 hover:border-amber-200 transition-colors duration-300 shadow-sm hover:shadow-lg"
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 tracking-wide border border-white/30">
                      {venue.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-stone-900 mb-1">
                    {venue.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{venue.hours}</span>
                  </div>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {venue.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote / Divider ── */}
      <div
        className="relative py-28 px-6 flex items-center justify-center overflow-hidden"
      >
        <img
          src="https://images.pexels.com/photos/2869215/pexels-photo-2869215.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Hotel ambiance"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/70" />
        <div className="relative z-10 text-center max-w-2xl">
          <p className="text-amber-400 text-4xl font-serif leading-none mb-4">"</p>
          <p className="text-white font-serif text-2xl md:text-3xl leading-relaxed italic">
            Every visit is a story worth telling. We exist to make yours
            unforgettable.
          </p>
          <p className="text-amber-400 text-sm tracking-widest uppercase mt-6 font-semibold">
            — The Gulmohar Team
          </p>
        </div>
      </div>

      {/* ── About Section ── */}
      <section
        id="about"
        ref={(el) => { sectionRefs.current['about'] = el; }}
        className="py-24 px-6 bg-stone-50"
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
                Founded in 1928, Hotel Gulmohar has stood as a symbol of
                elegance and warmth for nearly a century. Our founders believed
                that true luxury is not merely about opulence — it is about
                feeling genuinely welcome, cared for, and at home.
              </p>
              <p className="text-stone-500 leading-relaxed mb-8">
                Today, we carry forward that same ethos with a team of over 200
                dedicated hospitality professionals, world-class facilities, and
                an unwavering commitment to creating moments that matter.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '95+', label: 'Years of Service' },
                  { value: '180', label: 'Rooms & Suites' },
                  { value: '4.9', label: 'Guest Rating' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="font-serif text-3xl text-stone-900 mb-1">
                      {value}
                    </div>
                    <div className="text-xs text-stone-400 tracking-wide uppercase">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Hotel lobby"
                className="w-full h-96 md:h-[520px] object-cover shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 border-4 border-amber-400 hidden md:block" />
              <div className="absolute -top-6 -right-6 bg-stone-900 text-white p-6 shadow-xl hidden md:block">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 mb-2" />
                <div className="font-serif text-2xl mb-1">5 Star</div>
                <div className="text-xs text-stone-400 tracking-wide uppercase">
                  Luxury Hotel
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section
        id="contact"
        ref={(el) => { sectionRefs.current['contact'] = el; }}
        className="py-24 px-6 bg-white"
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
                src="https://maps.google.com/maps?q=18.530805,73.144267&z=16&hl=en&output=embed"
                className="w-full h-[400px] block border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
              <div className="text-stone-600">
                <p className="font-serif text-base text-stone-900">
                  NH 17, Chikani, Maharashtra 402106
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
                A timeless landmark of luxury and warmth since 1928. Your home
                away from home.
              </p>
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
                  NH 17, Chikani, Maharashtra 402106
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
