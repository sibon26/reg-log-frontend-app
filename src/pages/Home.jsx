import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './HomeShowroom.css';

// ── Currency Formatter for Indian Rupees ─────────────────────────
const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
};

// ── Commercial Bike Showroom Fleet (Priced in Indian Rupees) ────
const BIKES = [
  {
    id: 'ducati-panigale-v4',
    name: 'Panigale V4 S',
    brand: 'Ducati',
    category: 'supersport',
    price: '₹33,48,000',
    priceLakh: '₹33.48 Lakh',
    priceNum: 3348000,
    badge: 'Flagship Superbike',
    badgeClass: 'badge-red',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    displacement: '1,103 cc',
    power: '215.5 HP',
    topSpeed: '305 km/h',
    efficiency: '14 km/l',
    desc: 'The pinnacle of Italian racing engineering. Equipped with Öhlins Smart EC 2.0 electronic suspension and MotoGP aerodynamics.'
  },
  {
    id: 'kawasaki-ninja-zx10r',
    name: 'Ninja ZX-10R KRT',
    brand: 'Kawasaki',
    category: 'supersport',
    price: '₹16,79,000',
    priceLakh: '₹16.79 Lakh',
    priceNum: 1679000,
    badge: 'WSBK Champion',
    badgeClass: 'badge-green',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    displacement: '998 cc',
    power: '203 HP',
    topSpeed: '299 km/h',
    efficiency: '15 km/l',
    desc: 'World Superbike dominant machine featuring aerodynamic winglets, quickshifter, launch control, and race-tuned chassis.'
  },
  {
    id: 'bmw-s1000rr',
    name: 'S 1000 RR M Sport',
    brand: 'BMW Motorrad',
    category: 'supersport',
    price: '₹25,25,000',
    priceLakh: '₹25.25 Lakh',
    priceNum: 2525000,
    badge: 'Track Beast',
    badgeClass: 'badge-blue',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
    displacement: '999 cc',
    power: '205 HP',
    topSpeed: '303 km/h',
    efficiency: '15.5 km/l',
    desc: 'BMW ShiftCam technology provides unmatched low-end torque and screaming top-end power. Complete with M Carbon wheels.'
  },
  {
    id: 'harley-fat-boy',
    name: 'Fat Boy 114 Cruiser',
    brand: 'Harley-Davidson',
    category: 'cruiser',
    price: '₹25,69,000',
    priceLakh: '₹25.69 Lakh',
    priceNum: 2569000,
    badge: 'Heritage Icon',
    badgeClass: 'badge-gold',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    displacement: '1,868 cc',
    power: '94 HP',
    topSpeed: '180 km/h',
    efficiency: '18 km/l',
    desc: 'The original fat-custom icon with steamroller stance, Milwaukee-Eight 114 V-Twin roar, and solid-disc Lakester cast wheels.'
  },
  {
    id: 'triumph-rocket-3',
    name: 'Rocket 3 R Storm',
    brand: 'Triumph',
    category: 'cruiser',
    price: '₹22,50,000',
    priceLakh: '₹22.50 Lakh',
    priceNum: 2250000,
    badge: 'World Largest Engine',
    badgeClass: 'badge-red',
    image: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=800&q=80',
    displacement: '2,458 cc',
    power: '180 HP',
    topSpeed: '235 km/h',
    efficiency: '14.5 km/l',
    desc: 'The ultimate muscle roadster. Produces an earth-shattering 225 Nm of torque with instant thrust at any gear.'
  },
  {
    id: 'ducati-desertx',
    name: 'DesertX Rally Edition',
    brand: 'Ducati',
    category: 'adventure',
    price: '₹23,70,000',
    priceLakh: '₹23.70 Lakh',
    priceNum: 2370000,
    badge: 'Dakar Ready',
    badgeClass: 'badge-gold',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
    displacement: '937 cc',
    power: '110 HP',
    topSpeed: '215 km/h',
    efficiency: '18.5 km/l',
    desc: 'Dedicated off-road explorer with 21" front spoked rim, KYB long-travel closed-cartridge fork, and high ground clearance.'
  },
  {
    id: 'ktm-1290-superduke',
    name: '1290 Super Duke R Evo',
    brand: 'KTM',
    category: 'street',
    price: '₹19,95,000',
    priceLakh: '₹19.95 Lakh',
    priceNum: 1995000,
    badge: 'The Beast',
    badgeClass: 'badge-red',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    displacement: '1,301 cc',
    power: '180 HP',
    topSpeed: '289 km/h',
    efficiency: '16 km/l',
    desc: 'Uncompromising hyper-naked streetfighter with WP semi-active suspension and an ultra-lightweight trellis frame.'
  },
  {
    id: 'yamaha-r1m',
    name: 'YZF-R1M Carbon',
    brand: 'Yamaha',
    category: 'supersport',
    price: '₹28,50,000',
    priceLakh: '₹28.50 Lakh',
    priceNum: 2850000,
    badge: 'Carbon Limited',
    badgeClass: 'badge-blue',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=800&q=80',
    displacement: '998 cc',
    power: '200 HP',
    topSpeed: '299 km/h',
    efficiency: '15 km/l',
    desc: 'Crossplane crankshaft CP4 engine delivering thrilling MotoGP exhaust sound, Öhlins ERS suspension, and carbon fiber bodywork.'
  },
  {
    id: 'zero-srf-electric',
    name: 'Zero SR/F Hyper-Electric',
    brand: 'Zero Motorcycles',
    category: 'electric',
    price: '₹18,50,000',
    priceLakh: '₹18.50 Lakh',
    priceNum: 1850000,
    badge: '100% Electric',
    badgeClass: 'badge-green',
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80',
    displacement: 'Electric 17.3 kWh',
    power: '110 HP',
    topSpeed: '200 km/h',
    efficiency: '256 km Range',
    desc: 'Zero-emission hyper-naked with Cypher III+ operating system, 190 Nm instant torque, and 0-100 km/h in under 3.5 seconds.'
  }
];

export default function Home() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [now, setNow] = useState(new Date());

  // Filter & Search
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  // EMI Calculator State in Rupees
  const [calcPrice, setCalcPrice] = useState(2500000);
  const [downPercent, setDownPercent] = useState(20);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(8.5);

  // Test Ride Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState(BIKES[0]);
  const [rideBranch, setRideBranch] = useState('Flagship Superbike Showroom - BKC Mumbai');
  const [rideDate, setRideDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [rideTime, setRideTime] = useState('11:00 AM');
  const [submittingRide, setSubmittingRide] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Filtered bikes
  const filteredBikes = useMemo(() => {
    return BIKES.filter((b) => {
      const matchCat = category === 'all' || b.category === category;
      const matchQuery =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.brand.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [category, search]);

  // EMI Computations in Rupees
  const emiData = useMemo(() => {
    const downPayment = calcPrice * (downPercent / 100);
    const loanAmount = calcPrice - downPayment;
    const r = interestRate / 100 / 12;
    const n = tenureMonths;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalRepay = emi * n;
    const totalInterest = totalRepay - loanAmount;

    return {
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(downPayment + totalRepay)
    };
  }, [calcPrice, downPercent, tenureMonths, interestRate]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      navigate('/login');
    }
  }

  function handleOpenTestRide(bike) {
    if (bike) setSelectedBike(bike);
    setModalOpen(true);
  }

  function handleQuickCalc(bike) {
    setCalcPrice(bike.priceNum);
    document.getElementById('emi-calculator')?.scrollIntoView({ behavior: 'smooth' });
    toast.success(`Loaded ${bike.brand} ${bike.name} (${formatINR(bike.priceNum)}) into EMI Calculator!`);
  }

  function handleTestRideSubmit(e) {
    e.preventDefault();
    setSubmittingRide(true);
    setTimeout(() => {
      setSubmittingRide(false);
      setModalOpen(false);
      toast.success(
        `Test ride confirmed for ${selectedBike.brand} ${selectedBike.name} on ${rideDate} at ${rideTime}!`
      );
    }, 800);
  }

  function handleApplyFinance() {
    toast.success(
      `Instant pre-approval request submitted for ${formatINR(calcPrice)}! Our showroom loan manager will contact you.`
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'VIP';

  return (
    <div className="showroom-page">
      {/* ── Top Commercial Showroom Navbar ── */}
      <nav className="showroom-nav">
        <div className="nav-brand-group">
          <span className="nav-brand-icon">🏍️</span>
          <div className="nav-brand-title">
            <span>APEX MOTORSPORTS</span>
            <span className="nav-brand-sub">Commercial Superbike Showroom · India</span>
          </div>
        </div>

        <div className="nav-links">
          <button className="nav-link-btn" onClick={() => document.getElementById('fleet-showcase')?.scrollIntoView({ behavior: 'smooth' })}>
            Showroom Fleet
          </button>
          <button className="nav-link-btn" onClick={() => document.getElementById('emi-calculator')?.scrollIntoView({ behavior: 'smooth' })}>
            EMI &amp; Financing (₹)
          </button>
          <button className="nav-link-btn" onClick={() => document.getElementById('perks-section')?.scrollIntoView({ behavior: 'smooth' })}>
            Showroom Privileges
          </button>
          <button className="nav-link-btn" onClick={() => document.getElementById('branches-section')?.scrollIntoView({ behavior: 'smooth' })}>
            Branches &amp; Test Rides
          </button>
        </div>

        <div className="nav-user-panel">
          <div className="nav-user-badge">
            <div className="nav-avatar">{initials}</div>
            <span className="nav-username">{user?.fullName || 'Valued Member'}</span>
            <span className="nav-vip-pill">VIP Rider</span>
          </div>

          <button
            id="logout-btn"
            className="btn-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Signing out…' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* ── Hero Showcase Section ── */}
      <header className="showroom-hero">
        <div className="hero-pill">
          ✦ Authorized Commercial Superbike Showroom &amp; Dealership ✦
        </div>

        <h1 className="hero-title">
          Welcome to Home Page
          <br />
          <span className="hero-title-gradient">Unleash Pure Performance</span>
        </h1>

        <p className="hero-desc">
          Namaste <strong>{user?.fullName || 'Rider'}</strong>! Step inside Apex Motorsports India. Explore authorized
          flagship superbikes, cruisers, and electric hyper-machines starting from <strong>₹16.79 Lakh</strong> with
          certified manufacturer warranty, 0% EMI financing, and Pan-India enclosed doorstep delivery.
        </p>

        <div className="hero-cta-group">
          <button
            className="btn-hero-primary"
            onClick={() => document.getElementById('fleet-showcase')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore 2026 Fleet ↓
          </button>
          <button
            className="btn-hero-secondary"
            onClick={() => handleOpenTestRide(BIKES[0])}
          >
            Book VIP Test Ride ⚡
          </button>
          <button
            className="btn-hero-secondary"
            onClick={() => document.getElementById('emi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Rupee EMI Calculator 💰
          </button>
        </div>

        {/* Stats Ribbon */}
        <div className="hero-stats-row">
          <div className="stat-item">
            <span className="stat-val">75+</span>
            <span className="stat-lbl">Superbikes In Stock</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">0%</span>
            <span className="stat-lbl">Down Payment Options</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">3-Year</span>
            <span className="stat-lbl">Factory Warranty Pack</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">4.9 / 5</span>
            <span className="stat-lbl">Customer Rating</span>
          </div>
        </div>
      </header>

      {/* ── Fleet Showcase ── */}
      <section className="showroom-section" id="fleet-showcase">
        <div className="section-head">
          <span className="section-badge">Showroom Inventory</span>
          <h2 className="section-title">Authorized Superbike Collection</h2>
          <p className="section-subtitle">
            All prices are ex-showroom Indian Rupees. Certified, dyno-tested, and ready for immediate RTO registration.
          </p>
        </div>

        {/* Category Tabs & Search Bar */}
        <div className="fleet-filter-bar">
          <div className="category-tabs">
            {[
              { id: 'all', label: 'All Fleet (9)' },
              { id: 'supersport', label: 'SuperSport' },
              { id: 'cruiser', label: 'Cruiser' },
              { id: 'adventure', label: 'Adventure' },
              { id: 'street', label: 'Streetfighter' },
              { id: 'electric', label: 'Electric Hyper' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${category === tab.id ? 'active' : ''}`}
                onClick={() => setCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by model, brand, CC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Bike Cards Grid */}
        <div className="bike-grid">
          {filteredBikes.map((bike) => (
            <article key={bike.id} className="bike-card">
              <div className="bike-img-wrap">
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="bike-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span className={`bike-badge ${bike.badgeClass}`}>{bike.badge}</span>
                <span className="bike-category-tag">{bike.category.toUpperCase()}</span>
              </div>

              <div className="bike-info">
                <div className="bike-header-row">
                  <div>
                    <span className="bike-brand">{bike.brand}</span>
                    <h3 className="bike-name">{bike.name}</h3>
                  </div>
                  <div className="bike-price-box">
                    <div className="bike-price">{bike.price}</div>
                    <div className="bike-price-note">Ex-Showroom ({bike.priceLakh})</div>
                  </div>
                </div>

                <div className="bike-specs-grid">
                  <div className="spec-cell">
                    <span className="spec-icon">⚡</span>
                    <span className="spec-val">{bike.displacement}</span>
                    <span className="spec-key">Displacement</span>
                  </div>
                  <div className="spec-cell">
                    <span className="spec-icon">🚀</span>
                    <span className="spec-val">{bike.power}</span>
                    <span className="spec-key">Max Power</span>
                  </div>
                  <div className="spec-cell">
                    <span className="spec-icon">🏁</span>
                    <span className="spec-val">{bike.topSpeed}</span>
                    <span className="spec-key">Top Speed</span>
                  </div>
                  <div className="spec-cell">
                    <span className="spec-icon">⛽</span>
                    <span className="spec-val">{bike.efficiency}</span>
                    <span className="spec-key">Mileage</span>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
                  {bike.desc}
                </p>

                <div className="bike-actions">
                  <button
                    className="btn-card-testride"
                    onClick={() => handleOpenTestRide(bike)}
                  >
                    Book Test Ride
                  </button>
                  <button
                    className="btn-card-emi"
                    onClick={() => handleQuickCalc(bike)}
                    title="Calculate Monthly Installment"
                  >
                    Calc EMI (₹)
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Interactive EMI & Financing Calculator in Rupees ── */}
      <section className="showroom-section" id="emi-calculator">
        <div className="section-head">
          <span className="section-badge">Commercial Auto Financing in INR</span>
          <h2 className="section-title">Rupee EMI &amp; Loan Calculator (₹)</h2>
          <p className="section-subtitle">
            Customize your down payment, loan tenure, and interest rate to see your exact monthly rupee installments.
          </p>
        </div>

        <div className="calculator-card">
          <div className="calc-controls">
            {/* Bike Price Slider in Rupees */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <span>Selected Superbike Price</span>
                <span className="calc-value-display">{formatINR(calcPrice)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="4500000"
                step="50000"
                value={calcPrice}
                onChange={(e) => setCalcPrice(Number(e.target.value))}
                className="calc-slider"
              />
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                Range: ₹10 Lakh to ₹45 Lakh (Selected: {(calcPrice / 100000).toFixed(2)} Lakh)
              </span>
            </div>

            {/* Down Payment Slider */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <span>Down Payment ({downPercent}%)</span>
                <span className="calc-value-display">{formatINR(emiData.downPayment)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={downPercent}
                onChange={(e) => setDownPercent(Number(e.target.value))}
                className="calc-slider"
              />
            </div>

            {/* Loan Tenure Pills */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <span>Loan Tenure</span>
                <span className="calc-value-display">{tenureMonths} Months ({tenureMonths / 12} Years)</span>
              </div>
              <div className="tenure-pills">
                {[12, 24, 36, 48, 60].map((m) => (
                  <button
                    key={m}
                    className={`tenure-btn ${tenureMonths === m ? 'active' : ''}`}
                    onClick={() => setTenureMonths(m)}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div className="calc-field-group">
              <div className="calc-label-row">
                <span>Annual Bank Interest Rate</span>
                <span className="calc-value-display">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="6"
                max="14"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="calc-slider"
              />
            </div>
          </div>

          {/* EMI Result Column */}
          <div className="calc-result-panel">
            <div>
              <div className="emi-highlight-box">
                <div className="emi-label">Estimated Monthly EMI</div>
                <div className="emi-amount">{formatINR(emiData.monthlyEmi)}</div>
                <div className="emi-sub">For {tenureMonths} consecutive monthly installments</div>
              </div>

              <div className="breakdown-row">
                <span>Principal Loan Amount</span>
                <span className="breakdown-val">{formatINR(emiData.loanAmount)}</span>
              </div>
              <div className="breakdown-row">
                <span>Down Payment Upfront</span>
                <span className="breakdown-val">{formatINR(emiData.downPayment)}</span>
              </div>
              <div className="breakdown-row">
                <span>Total Bank Interest</span>
                <span className="breakdown-val">{formatINR(emiData.totalInterest)}</span>
              </div>
              <div className="breakdown-row" style={{ borderBottom: 'none' }}>
                <span>Total Amount Payable</span>
                <span className="breakdown-val" style={{ color: '#38bdf8' }}>{formatINR(emiData.totalCost)}</span>
              </div>
            </div>

            <button className="btn-apply-finance" onClick={handleApplyFinance}>
              Apply for 0% Instant Pre-Approval →
            </button>
          </div>
        </div>
      </section>

      {/* ── Showroom Perks & Services ── */}
      <section className="showroom-section" id="perks-section">
        <div className="section-head">
          <span className="section-badge">The Apex Guarantee</span>
          <h2 className="section-title">Commercial Showroom Privileges</h2>
          <p className="section-subtitle">
            Purchasing from an authorized dealer provides peace of mind, premium warranty coverage, and lifetime VIP services.
          </p>
        </div>

        <div className="perks-grid">
          <div className="perk-card">
            <div className="perk-icon">🛡️</div>
            <h3 className="perk-title">3-Year Factory Warranty</h3>
            <p className="perk-desc">
              Comprehensive bumper-to-bumper manufacturer warranty including engine, transmission, electronics, and TFT display.
            </p>
          </div>

          <div className="perk-card">
            <div className="perk-icon">🔧</div>
            <h3 className="perk-title">Dyno Master Service Bay</h3>
            <p className="perk-desc">
              Factory-certified master mechanics, computerized diagnostics, genuine OEM spare parts, and custom ECU performance tuning.
            </p>
          </div>

          <div className="perk-card">
            <div className="perk-icon">💳</div>
            <h3 className="perk-title">0% Zero-Down Financing</h3>
            <p className="perk-desc">
              Partnered with HDFC, ICICI &amp; Axis Auto Finance. Walk in with KYC documents and ride out with approval in 45 minutes.
            </p>
          </div>

          <div className="perk-card">
            <div className="perk-icon">🚚</div>
            <h3 className="perk-title">Pan-India Enclosed Delivery</h3>
            <p className="perk-desc">
              Hydraulic climate-controlled trailer delivery directly to your home with a complimentary full tank of high-octane fuel.
            </p>
          </div>
        </div>
      </section>

      {/* ── Verified Rider Testimonials ── */}
      <section className="showroom-section">
        <div className="section-head">
          <span className="section-badge">Customer Stories</span>
          <h2 className="section-title">From Our Superbike Community</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">
              "Buying my Panigale V4 S from Apex was an unforgettable experience. RTO registration and delivery at Mumbai was super smooth."
            </p>
            <div className="testi-author">
              <div className="testi-avatar">AK</div>
              <div>
                <div className="testi-name">Alex Kumar</div>
                <div className="testi-bike">Ducati Panigale V4 S Owner (Mumbai)</div>
              </div>
            </div>
          </div>

          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">
              "The Fat Boy 114 is a beast on the highways. Apex arranged low-interest financing and even fitted custom Vance &amp; Hines pipes."
            </p>
            <div className="testi-author">
              <div className="testi-avatar">RS</div>
              <div>
                <div className="testi-name">Rohan Sharma</div>
                <div className="testi-bike">Harley-Davidson Fat Boy Owner (Bengaluru)</div>
              </div>
            </div>
          </div>

          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">
              "The dyno service bay at Apex is world-class. My BMW S1000RR had its 1000km break-in service done with complete diagnostic reports."
            </p>
            <div className="testi-author">
              <div className="testi-avatar">MC</div>
              <div>
                <div className="testi-name">Marcus Chen</div>
                <div className="testi-bike">BMW S 1000 RR Owner (New Delhi)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Showroom Locations & Hours (India Flagship Centers) ── */}
      <section className="showroom-section" id="branches-section">
        <div className="section-head">
          <span className="section-badge">Visit In Person</span>
          <h2 className="section-title">Our Showroom Flagship Centers</h2>
          <p className="section-subtitle">
            Walk in to touch the machines, listen to the exhaust notes, and enjoy an espresso in our VIP Rider Lounge.
          </p>
        </div>

        <div className="branches-grid">
          <div className="branch-card">
            <h3 className="branch-title">Mumbai Flagship Showroom</h3>
            <p className="branch-address">
              Tower 3, G Block, Bandra Kurla Complex (BKC), Mumbai 400051
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              📞 +91 98200 12345 · 📧 mumbai@apexmotors.in
            </p>
            <span className="branch-timing">Open Mon–Sat: 9:30 AM – 8:30 PM | Sun: 10:00 AM – 6:00 PM</span>
          </div>

          <div className="branch-card">
            <h3 className="branch-title">Bengaluru Speed Arena Hub</h3>
            <p className="branch-address">
              100 Feet Road, Indiranagar, Bengaluru 560038
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              📞 +91 98450 67890 · 📧 bangalore@apexmotors.in
            </p>
            <span className="branch-timing">Open Mon–Sat: 9:30 AM – 8:30 PM | Dyno Tuning Available</span>
          </div>

          <div className="branch-card">
            <h3 className="branch-title">Delhi Aero Experience Lounge</h3>
            <p className="branch-address">
              Hospitality District, Aerocity, New Delhi 110037
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              📞 +91 98110 54321 · 📧 delhi@apexmotors.in
            </p>
            <span className="branch-timing">Open 7 Days: 9:00 AM – 9:00 PM | Test Track On-Site</span>
          </div>
        </div>
      </section>

      {/* ── Interactive Test Ride Modal ── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="testride-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px' }}>⚡</span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                Book a VIP Test Ride
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                Experience the thrill before you buy. Safety gear and insurance provided.
              </p>
            </div>

            <form onSubmit={handleTestRideSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Select Bike */}
              <div className="form-group">
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Selected Superbike
                </label>
                <select
                  value={selectedBike.id}
                  onChange={(e) => {
                    const found = BIKES.find((b) => b.id === e.target.value);
                    if (found) setSelectedBike(found);
                  }}
                  className="form-input"
                  style={{ background: '#13132b', color: '#fff' }}
                >
                  {BIKES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.brand} {b.name} ({b.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rider Name (prefilled) */}
              <div className="form-group">
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Rider Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.fullName || ''}
                  className="form-input"
                  placeholder="Your Full Name"
                  required
                />
              </div>

              {/* Contact Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="form-input"
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue={user?.mobileNumber || ''}
                    className="form-input"
                    placeholder="Mobile Number"
                    required
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={rideDate}
                    onChange={(e) => setRideDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Time Slot
                  </label>
                  <select
                    value={rideTime}
                    onChange={(e) => setRideTime(e.target.value)}
                    className="form-input"
                    style={{ background: '#13132b', color: '#fff' }}
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Showroom Branch */}
              <div className="form-group">
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Showroom Location
                </label>
                <select
                  value={rideBranch}
                  onChange={(e) => setRideBranch(e.target.value)}
                  className="form-input"
                  style={{ background: '#13132b', color: '#fff' }}
                >
                  <option value="Flagship Superbike Showroom - BKC Mumbai">Flagship Superbike Showroom - BKC Mumbai</option>
                  <option value="Apex Speed Arena Hub - Indiranagar Bengaluru">Apex Speed Arena Hub - Indiranagar Bengaluru</option>
                  <option value="Delhi Aero Experience Lounge - Aerocity">Delhi Aero Experience Lounge - Aerocity</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: '10px', background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                disabled={submittingRide}
              >
                {submittingRide ? 'Scheduling Ride…' : 'Confirm Test Ride Booking →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
