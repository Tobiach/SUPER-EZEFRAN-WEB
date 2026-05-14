import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  User, 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Phone,
  Truck,
  CreditCard,
  RefreshCcw,
  CheckCircle2,
  Instagram,
  Facebook,
  PhoneCall,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Data ---

interface Product {
  id: number | string;
  name: string;
  price: number | string;
  oldPrice?: number;
  category: string;
  emoji?: string;
  bgColor?: string;
  driveId?: string;
  localPath?: string;
  isOffer?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const CATEGORIES = [
  { id: 'Ofertas', name: 'Ofertas', emoji: '🔥', driveId: '1pxNNopT-1K3M_aoO20ch3zv3u2Gy2wuP' },
  { id: 'Almacén', name: 'Almacén', emoji: '🛒', driveId: '1ytKSzbrZXAepAdcrt6vflfiXzh3hPPZ7' },
  { id: 'Bebidas', name: 'Bebidas', emoji: '🍺', driveId: '1ENZa3BDVjkIQfdvwW4TQ_fJFASlJV0Hz' },
  { id: 'Carnes', name: 'Carnes', emoji: '🥩', localPath: 'input_file_3.png' },
  { id: 'Lácteos', name: 'Lácteos', emoji: '🥛', localPath: 'input_file_2.png' },
  { id: 'Frutas', name: 'Frutas y Verduras', emoji: '🥦', localPath: 'input_file_4.png' },
  { id: 'Limpieza', name: 'Limpieza', emoji: '🧴', localPath: 'input_file_6.png' },
  { id: 'Panadería', name: 'Panadería', emoji: '🍞', localPath: 'input_file_5.png' },
  { 
    id: 'Cuidado Personal', 
    name: 'Cuidado Personal', 
    emoji: '💄', 
    driveId: '1TSbDE3u0xw55ygaB-6M0PwP1osr40sLE' 
  },
  { 
    id: 'Regalos', 
    name: 'Regalos para Mamá', 
    emoji: '💝', 
    driveId: '1dneAD2aqHrsebCN-hr1ZailM0n38xBad' 
  },
  { 
    id: 'Mascotas', 
    name: 'Mascotas', 
    emoji: '🐾', 
    localPath: '/cuidado_de_mascotas/mascota1.jpg' 
  },
  { 
    id: 'Electrodomésticos', 
    name: 'Electrodomésticos', 
    emoji: '⚡', 
    localPath: '/electrodomesticos/airfryer1.jpg' 
  },
];

const PRODUCTS: Product[] = [
  { id: 1, name: 'Aceite de Girasol 1.5L', price: 1990, oldPrice: 2800, category: 'Almacén', emoji: '🌻', bgColor: '#FFF9C4', isOffer: true },
  { id: 2, name: 'Yerba Mate 1kg', price: 2990, oldPrice: 4200, category: 'Almacén', emoji: '🧉', bgColor: '#DCEDC8', isOffer: true },
  { id: 3, name: 'Pollo Entero x kg', price: 2600, oldPrice: 3500, category: 'Carnes', localPath: 'input_file_3.png', bgColor: '#FFE0B2', isOffer: true },
  { id: 4, name: 'Arroz Largo Fino 1kg', price: 1450, category: 'Almacén', localPath: 'input_file_0.png', bgColor: '#FFFFFF' },
  { id: 5, name: 'Fideos Tallarines 500g', price: 1200, category: 'Almacén', localPath: 'input_file_1.png', bgColor: '#FFFFFF' },
  { id: 6, name: 'Leche Entera 1L', price: 1550, category: 'Lácteos', localPath: 'input_file_2.png', bgColor: '#FFFFFF' },
  { id: 7, name: 'Gaseosa Cola 2.25L', price: 2400, category: 'Bebidas', driveId: '1ENZa3BDVjkIQfdvwW4TQ_fJFASlJV0Hz', bgColor: '#FFEBEE' },
  { id: 8, name: 'Agua Mineral 2L', price: 1100, category: 'Bebidas', driveId: '15bOATFqNwdVr-WvEzwBDc44d6_PvK1cp', bgColor: '#E1F5FE' },
  { id: 9, name: 'Queso Cremoso x kg', price: 6800, category: 'Lácteos', driveId: '1s8iV8YB_Bu0-fm1SZr88Uno9giSKrj0y', bgColor: '#FFF9C4' },
  { id: 10, name: 'Asado de Novillo x kg', price: 9500, category: 'Carnes', localPath: '/ofertas/asado.jpg', bgColor: '#FFEBEE' },
  { id: 11, name: 'Pan Felipe x kg', price: 1800, category: 'Panadería', driveId: '1AJLdnKn2acN1xFAJx7n0qdEHzfc7GQR6', bgColor: '#FFF3E0' },
  { id: 12, name: 'Manzana Roja x kg', price: 1600, category: 'Frutas', localPath: 'input_file_4.png', bgColor: '#FFFFFF' },
  { id: 13, name: 'Detergente Lavavajilla', price: 2100, category: 'Limpieza', localPath: 'input_file_6.png', bgColor: '#FFFFFF' },
  { id: 14, name: 'Harina 000 1kg', price: 950, category: 'Almacén', localPath: 'input_file_5.png', bgColor: '#FFFFFF' },
  { id: 15, name: 'Yogur de Frutilla 1kg', price: 2300, category: 'Lácteos', localPath: 'input_file_7.png', bgColor: '#FFFFFF' },
  // ELECTRO
  { id: 'e1', name: 'Air Fryer Maryland', price: 280000, category: 'Electrodomésticos', localPath: '/electrodomesticos/airfryer1.jpg', bgColor: '#FFFFFF' },
  { id: 'e5', name: 'Air Fryer Janford', price: 485000, category: 'Electrodomésticos', localPath: '/electrodomesticos/airfryer2.jpg', bgColor: '#FFFFFF' },
  { id: 'e7', name: 'Licuadora RAF 2L', price: 280000, category: 'Electrodomésticos', localPath: '/electrodomesticos/licuadora1.jpg', bgColor: '#FFFFFF' },
  // PETS
  { id: 'p1', name: 'Whiskas Gatos 500g', price: 15000, category: 'Mascotas', localPath: '/cuidado_de_mascotas/mascota1.jpg', bgColor: '#F9F4EE' },
  { id: 'p4', name: 'Pronto Dog Adultos', price: 85000, category: 'Mascotas', localPath: '/cuidado_de_mascotas/mascota2.jpg', bgColor: '#F9F4EE' },
];

const CLASICO_IMAGES = [
  '/disfruta_del_clasico/clasico1.jpg',
  '/disfruta_del_clasico/clasico2.jpg',
  '/disfruta_del_clasico/clasico3.jpg',
  '/disfruta_del_clasico/clasico4.jpg',
  '/disfruta_del_clasico/clasico5.jpg'
];

const ELECTRO_PRODUCTS = [
  { id: 'e1', name: 'Air Fryer Maryland', price: '280.000', localPath: '/electrodomesticos/airfryer1.jpg' },
  { id: 'e2', name: 'Air Fryer Premium', price: '', localPath: '/electrodomesticos/airfryer2.jpg' },
  { id: 'e3', name: 'Air Fryer Digital', price: '', localPath: '/electrodomesticos/airfryer3.jpg' },
  { id: 'e4', name: 'Air Fryer Selection', price: '', localPath: '/electrodomesticos/airfryer4.jpg' },
  { id: 'e5', name: 'Air Fryer Janford', price: '485.000', localPath: '/electrodomesticos/airfryer5.jpg' },
  { id: 'e6', name: 'Air Fryer Compact', price: '', localPath: '/electrodomesticos/airfryer6.jpg' },
  { id: 'e7', name: 'Licuadora RAF 2L', price: '280.000', localPath: '/electrodomesticos/licuadora1.jpg' },
  { id: 'e8', name: 'Licuadora RAF Basic', price: '165.000', localPath: '/electrodomesticos/licuadora2.jpg' },
  { id: 'e9', name: 'Licuadora RAF Power', price: '199.000', localPath: '/electrodomesticos/licuadora3.jpg' },
  { id: 'e10', name: 'Licuadora RAF Chef', price: '145.000', localPath: '/electrodomesticos/licuadora4.jpg' },
  { id: 'e11', name: 'Licuadora RAF Pro', price: '165.000', localPath: '/electrodomesticos/licuadora5.jpg' },
];

const PET_PRODUCTS = [
  { id: 'p1', name: 'Whiskas Gatos 500g', localPath: '/cuidado_de_mascotas/mascota1.jpg' },
  { id: 'p2', name: 'Pedigree + Waltham', localPath: '/cuidado_de_mascotas/mascota2.jpg' },
  { id: 'p3', name: 'BoNut Gatos Premium', localPath: '/cuidado_de_mascotas/mascota3.jpg' },
  { id: 'p4', name: 'Pronto Dog Adultos', localPath: '/cuidado_de_mascotas/mascota4.jpg' },
  { id: 'p5', name: 'Primogato Premium', localPath: '/cuidado_de_mascotas/mascota5.jpg' },
  { id: 'p6', name: 'Pronto Cat Castrados', localPath: '/cuidado_de_mascotas/mascota6.jpg' },
  { id: 'p7', name: 'Mix Pedigree & Whiskas', localPath: '/cuidado_de_mascotas/mascota7.jpg' },
  { id: 'p8', name: 'Pronto Dog Cachorros', localPath: '/cuidado_de_mascotas/mascota_promo1.jpg' },
  { id: 'p9', name: 'Pronto Cat Crecimiento', localPath: '/cuidado_de_mascotas/mascota_promo2.jpg' },
  { id: 'p10', name: 'Caricare Gatos', localPath: '/cuidado_de_mascotas/mascota_promo3.jpg' },
];

// --- Components ---

const DriveImage = ({ driveId, localPath, alt, className, style, objectFit = 'cover' }: { driveId?: string, localPath?: string, alt: string, className?: string, style?: React.CSSProperties, objectFit?: 'cover' | 'contain' }) => {
  // If localPath is provided, use it directly. Otherwise use Google Drive
  const src = localPath || `https://lh3.googleusercontent.com/d/${driveId}`;
  return (
    <img 
      src={src}
      alt={alt}
      className={className}
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit, 
        objectPosition: 'center',
        ...style 
      }}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        // If Google blocks the direct link, fallback to a CSS placeholder
        target.style.display = 'none';
        if (target.parentElement) {
          target.parentElement.style.background = 'linear-gradient(135deg, #8B0000, #5A0000)';
          target.parentElement.classList.add('flex', 'items-center', 'justify-center');
        }
      }}
    />
  );
};

const Logo = () => (
  <div className="flex items-center gap-2 select-none cursor-pointer">
    <div className="relative flex items-center justify-center">
      {/* CSS Crown/Circle Decoration */}
      <div className="absolute w-12 h-12 border-2 border-gold rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute w-10 h-10 border-t-2 border-gold rounded-full rotate-45"></div>
      <span className="text-primary-dark font-display font-bold text-xl leading-tight">SUPER</span>
      <span className="text-gold font-display font-bold text-3xl ml-1">EF</span>
    </div>
  </div>
);

const Toast: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 1000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 bg-gold text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-bold"
    >
      <CheckCircle2 size={20} />
      {message}
    </motion.div>
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreProducts, setShowMoreProducts] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [clasicoIndex, setClasicoIndex] = useState(0);
  const [petIndex, setPetIndex] = useState(0);
  const [showAllElectro, setShowAllElectro] = useState(false);
  const [showAllLocal, setShowAllLocal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWorkWithUsOpen, setIsWorkWithUsOpen] = useState(false);

  const heroRef = useRef<NodeJS.Timeout | null>(null);
  const clasicoRef = useRef<NodeJS.Timeout | null>(null);

  // --- Logic ---

  const startHeroTimer = () => {
    if (heroRef.current) clearInterval(heroRef.current);
    heroRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 4);
    }, 4000);
  };

  const startClasicoTimer = () => {
    if (clasicoRef.current) clearInterval(clasicoRef.current);
    clasicoRef.current = setInterval(() => {
      setClasicoIndex((prev) => (prev + 1) % CLASICO_IMAGES.length);
    }, 3500);
  };

  useEffect(() => {
    startHeroTimer();
    startClasicoTimer();
    return () => { 
      if (heroRef.current) clearInterval(heroRef.current);
      if (clasicoRef.current) clearInterval(clasicoRef.current);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (activeCategory !== 'Todos') {
      if (activeCategory === 'Ofertas') {
        result = result.filter(p => p.isOffer);
      } else {
        result = result.filter(p => p.category === activeCategory);
      }
    }
    if (searchQuery.trim()) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [activeCategory, searchQuery]);

  const visibleProducts = showMoreProducts ? filteredProducts : filteredProducts.slice(0, 6);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToasts(prev => [...prev, `✅ ${product.name} agregado`]);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  // --- Renders ---

  return (
    <div className="min-h-screen flex flex-col">
      {/* TOPBAR */}
      <div className="bg-primary-dark text-white py-1.5 px-4 text-[13px]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-1.5 font-medium text-gold-light">
            <MapPin size={14} strokeWidth={2.5} /> Zona de cobertura: María Auxiliadora
          </span>
          <div className="hidden md:flex gap-4">
            <span className="flex items-center gap-1.5">
              <Phone size={14} /> Pedidos: 595985104086
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> Lun-Sáb 8 a 21hs
            </span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div onClick={() => scrollToSection('top')}>
            <Logo />
          </div>

          <div className="hidden md:flex flex-1 max-w-[40%] relative">
            <input 
              type="text" 
              placeholder="¿Qué estás buscando hoy?"
              className="w-full h-11 border-2 border-gold-light/40 rounded-lg pl-4 pr-12 focus:outline-none focus:border-gold transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-0 top-0 h-11 px-5 bg-primary-dark text-white rounded-r-lg hover:bg-primary-med transition-colors">
              <Search size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <button className="relative group p-2 rounded-full hover:bg-gray-50 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} className="text-primary-dark" />
            </button>
            <button className="relative group p-2 rounded-full hover:bg-gray-50 hidden md:block">
              <User size={24} className="text-primary-dark" />
              <div className="absolute top-12 right-0 bg-white border border-gray-100 shadow-lg px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none text-sm z-50">
                Iniciar sesión
              </div>
            </button>
            <button className="relative p-2 rounded-full hover:bg-gray-50" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={24} className="text-primary-dark" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Menu */}
        <div className="bg-primary-dark overflow-x-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto px-4 flex">
            <button 
              onClick={() => setActiveCategory('Todos')}
              className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeCategory === 'Todos' ? 'bg-gold text-white' : 'text-white hover:bg-primary-med'}`}
            >
              Todos
            </button>
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToSection('productos');
                }}
                className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${activeCategory === cat.id ? 'bg-gold text-white' : 'text-white hover:bg-primary-med'}`}
              >
                <span>{cat.emoji}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <section className="relative h-[220px] md:h-[380px] overflow-hidden" id="top">
        <AnimatePresence mode="wait">
          <motion.div 
            key={heroIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center"
            style={{ 
              background: heroIndex === 0 
                ? 'linear-gradient(135deg, #8B0000 0%, #5A0000 100%)' 
                : heroIndex === 1 
                  ? 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)' 
                  : heroIndex === 2
                    ? '#1A1A1A'
                    : 'transparent'
            }}
          >
            {heroIndex === 3 && (
              <div className="absolute inset-0">
                <DriveImage localPath="/ofertas/asado.jpg" alt="Promociones de la semana" />
                <div className="absolute inset-0 bg-primary-dark/55"></div>
              </div>
            )}
            <div className="max-w-7xl mx-auto px-6 w-full text-white relative z-10">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-5xl font-display font-bold mb-2 md:mb-4 max-w-2xl"
              >
                {heroIndex === 0 && "Las mejores ofertas de la semana"}
                {heroIndex === 1 && "Carnes premium a precios imbatibles"}
                {heroIndex === 2 && "Delivery a tu puerta"}
                {heroIndex === 3 && "🥩 Promociones de la semana"}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm md:text-xl text-gold-light mb-4 md:mb-8"
              >
                {heroIndex === 0 && "Hasta 40% OFF en almacén"}
                {heroIndex === 1 && "Cortes seleccionados, frescos cada día"}
                {heroIndex === 2 && "María Auxiliadora - mismo día"}
                {heroIndex === 3 && "Las mejores ofertas directo a tu mesa"}
              </motion.p>
              <motion.button 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => heroIndex === 0 ? scrollToSection('ofertas') : heroIndex === 1 ? (setActiveCategory('Carnes'), scrollToSection('productos')) : heroIndex === 3 ? scrollToSection('clasico') : scrollToSection('productos')}
                className={`px-6 py-2.5 md:px-10 md:py-4 rounded-lg font-bold text-sm md:text-base transition-transform active:scale-95 ${heroIndex === 1 ? 'bg-primary-dark text-white hover:bg-primary-med' : 'bg-gold text-white hover:bg-gold-light'}`}
              >
                {heroIndex === 0 && "Ver Ofertas"}
                {heroIndex === 1 && "Ver Carnes"}
                {heroIndex === 2 && "Pedir ahora"}
                {heroIndex === 3 && "Ver promociones"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav Buttons */}
        <button 
          onClick={() => { setHeroIndex((prev) => (prev - 1 + 4) % 4); startHeroTimer(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors hidden md:block"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => { setHeroIndex((prev) => (prev + 1) % 4); startHeroTimer(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors hidden md:block"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2, 3].map(i => (
            <button 
              key={i} 
              onClick={() => { setHeroIndex(i); startHeroTimer(); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === heroIndex ? 'bg-gold w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="py-12 px-4 max-w-7xl mx-auto w-full">
        <h2 className="section-title">Comprá por categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => {
            const isCustom = !!cat.driveId || !!cat.localPath;
            return (
              <button 
                key={cat.id}
                onClick={() => { 
                  const targetCat = cat.id === 'Regalos' ? 'Regalos' : cat.id;
                  setActiveCategory(targetCat); 
                  scrollToSection('productos'); 
                }}
                className="relative flex flex-col items-center justify-center p-6 bg-white border-2 border-gold/20 rounded-2xl hover:bg-primary-dark group transition-all hover:border-gold overflow-hidden h-40"
              >
                {isCustom ? (
                  <>
                    <div className="absolute inset-0">
                      <DriveImage driveId={cat.driveId} localPath={cat.localPath} alt={cat.name} />
                      <div className="absolute inset-0 drive-img-overlay group-hover:opacity-70 transition-opacity"></div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center mt-auto">
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{cat.emoji}</span>
                      <span className="font-bold text-white text-center leading-tight">{cat.name}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</span>
                    <span className="font-bold text-gray-700 group-hover:text-white">{cat.name}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* DISFRUTÁ EL CLÁSICO */}
      <section className="py-16 bg-primary-dark min-h-[450px]" id="clasico">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className="text-2xl md:text-3xl text-white font-display font-bold mb-2">⚽ Disfrutá el Clásico</h2>
          <p className="text-gold-light">Las mejores promos para el partido</p>
        </div>
        <div className="relative h-[320px] md:h-[450px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={clasicoIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute inset-0"
            >
              <DriveImage localPath={CLASICO_IMAGES[clasicoIndex]} alt="Promo Clásico" />
              <div className="absolute inset-0 clasico-overlay flex flex-col justify-end p-8 md:p-12">
                <p className="text-white text-xl md:text-2xl font-bold">⚽ PROMO DEL CLÁSICO</p>
                <p className="text-gold-light mt-1 md:text-lg">Contactanos: (0985) 104 086</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <button onClick={() => { setClasicoIndex((prev) => (prev - 1 + CLASICO_IMAGES.length) % CLASICO_IMAGES.length); startClasicoTimer(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 md:flex hidden"><ChevronLeft /></button>
          <button onClick={() => { setClasicoIndex((prev) => (prev + 1) % CLASICO_IMAGES.length); startClasicoTimer(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 md:flex hidden"><ChevronRight /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {CLASICO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => { setClasicoIndex(i); startClasicoTimer(); }} className={`w-2 h-2 rounded-full transition-all ${i === clasicoIndex ? 'bg-gold w-6' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ELECTRODOMÉSTICOS SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <h2 className="section-title">⚡ Electrodomésticos</h2>
        <p className="text-gray-500 -mt-6 mb-10">Air Fryers, Licuadoras y más — Precios imbatibles</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {(showAllElectro ? ELECTRO_PRODUCTS : ELECTRO_PRODUCTS.slice(0, 6)).map(item => (
            <div key={item.id} className="border border-gold/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all bg-white flex flex-col group">
              <div className="h-48 md:h-64 overflow-hidden relative">
                <DriveImage driveId={(item as any).driveId} localPath={(item as any).localPath} alt={item.name} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-bold text-gray-800 mb-2">{item.name}</h4>
                {item.price && <p className="text-primary-dark font-bold text-lg mb-4">Gs. {item.price}</p>}
                <a 
                  href={`https://wa.me/595985104086?text=Hola! Me interesa este electrodoméstico de Super EF: ${item.name}`}
                  target="_blank" rel="noreferrer"
                  className="mt-auto py-2 bg-primary-dark text-white text-center rounded-lg font-bold text-sm hover:bg-gold transition-colors"
                >
                  Consultar
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button 
            onClick={() => setShowAllElectro(!showAllElectro)}
            className="px-8 py-3 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-white transition-all flex items-center gap-2 mx-auto"
          >
            {showAllElectro ? 'Ver menos ↑' : 'Ver todos los electrodomésticos ↓'}
          </button>
        </div>
      </section>

      {/* PETS SECTION */}
      <section className="py-20 bg-pet-bg border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">🐾 Lo mejor para tu mascota</h2>
          <p className="text-gray-500 -mt-6 mb-10">Alimentos premium para perros y gatos</p>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 px-1 scroll-smooth" id="pet-carousel">
              {PET_PRODUCTS.map(pet => (
                <div key={pet.id} className="min-w-[200px] md:min-w-[280px] bg-white border border-gold/20 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                  <div className="h-44 md:h-56 p-4 bg-[#F9F4EE] flex items-center justify-center">
                    <DriveImage driveId={(pet as any).driveId} localPath={(pet as any).localPath} alt={pet.name} objectFit="contain" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="font-bold text-gray-800 mb-4 text-sm md:text-base leading-tight h-10 line-clamp-2">{pet.name}</h4>
                    <a 
                      href={`https://wa.me/595985104086?text=Hola! Consulto por el alimento para mascotas de Super EF: ${pet.name}`}
                      target="_blank" rel="noreferrer"
                      className="mt-auto py-2 border-2 border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white text-center rounded-lg font-bold text-sm transition-all"
                    >
                      Consultar precio
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => { document.getElementById('pet-carousel')?.scrollBy({ left: -300, behavior: 'smooth' }); }}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-primary-dark md:flex hidden"
            >
              <ChevronLeft />
            </button>
            <button 
              onClick={() => { document.getElementById('pet-carousel')?.scrollBy({ left: 300, behavior: 'smooth' }); }}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-primary-dark md:flex hidden"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* REGALOS MAMÁ BANNER */}
      <section className="py-20 bg-mama-bg border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 md:gap-20">
          <div className="w-full md:w-[60%] h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
            <DriveImage driveId="1dneAD2aqHrsebCN-hr1ZailM0n38xBad" alt="Regalos para Mamá" />
          </div>
          <div className="w-full md:w-[40%] flex flex-col items-start">
            <span className="text-5xl mb-6">💝</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-4">Regalos especiales para Mamá</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Hacé de su día algo inolvidable. Contamos con regalos únicos para celebrar a quien más querés.
            </p>
            <div className="flex flex-col gap-4 w-full">
              <a 
                href="https://wa.me/595985104086?text=Hola! Quiero ver los regalos disponibles para el Día de la Madre"
                target="_blank" rel="noreferrer"
                className="w-full py-4 bg-gold text-white text-center rounded-xl font-bold text-lg hover:bg-gold-light transition-colors shadow-lg active:scale-[0.98]"
              >
                Ver regalos disponibles
              </a>
              <a 
                href="https://www.instagram.com/supermercadoezefran/"
                target="_blank" rel="noreferrer"
                className="w-full py-3 border-2 border-primary-dark text-primary-dark text-center rounded-xl font-bold hover:bg-primary-dark hover:text-white transition-all"
              >
                Seguinos en Instagram →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="bg-gold text-primary-dark py-6 overflow-hidden border-y border-gold-light/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <div className="flex items-center gap-4">
            <Truck size={36} strokeWidth={1.5} />
            <div className="leading-tight">
              <p className="font-bold uppercase tracking-wide">Envío Gratis</p>
              <p className="text-sm opacity-80">En compras +$50.000 GS</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-10 bg-primary-dark/20" />
          <div className="flex items-center gap-4">
            <CreditCard size={36} strokeWidth={1.5} />
            <div className="leading-tight">
              <p className="font-bold uppercase tracking-wide">Hasta 12 cuotas</p>
              <p className="text-sm opacity-80">Con todas las tarjetas</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-10 bg-primary-dark/20" />
          <div className="flex items-center gap-4">
            <RefreshCcw size={36} strokeWidth={1.5} />
            <div className="leading-tight">
              <p className="font-bold uppercase tracking-wide">Devolución garantizada</p>
              <p className="text-sm opacity-80">Si no estás satisfecho</p>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS SECTION */}
      <section className="py-16 px-4 bg-bg-light" id="ofertas">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="section-title mb-0">Ofertas de la semana</h2>
            <span className="bg-primary-dark text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">HOT</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.filter(p => p.isOffer).slice(0, 3).map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full" id="productos">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="section-title mb-0">
              {activeCategory === 'Todos' ? 'Todos los productos' : `Productos en ${activeCategory}`}
            </h2>
            {searchQuery && (
              <p className="text-gray-500 mt-2">Resultados para: <span className="font-bold">"{searchQuery}"</span></p>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {['Todos', 'Almacén', 'Bebidas', 'Carnes', 'Lácteos'].map(c => (
              <button 
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCategory === c ? 'bg-gold text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-400">No encontramos productos con ese nombre</h3>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-gold font-bold underline underline-offset-4">Limpiar búsqueda</button>
          </div>
        )}

        {filteredProducts.length > 6 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowMoreProducts(!showMoreProducts)}
              className="px-8 py-3 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-white transition-all flex items-center gap-2 mx-auto"
            >
              {showMoreProducts ? 'Ver menos ↑' : 'Ver más productos ↓'}
            </button>
          </div>
        )}
      </section>

      {/* APP BANNER */}
      <section className="bg-primary-dark text-white overflow-hidden py-10 md:py-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 md:py-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">¡Pedí desde tu celular!</h2>
            <p className="text-gold-light mb-8">Disponible en App Store y Google Play para una experiencia rápida.</p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 px-5 py-3 border border-white/40 rounded-xl hover:bg-white/10 transition-colors">
                <div className="bg-white/10 p-1.5 rounded-md">📱</div>
                <div className="text-left">
                  <p className="text-[10px] uppercase opacity-60">Consíguelo en</p>
                  <p className="text-sm font-bold">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-3 px-5 py-3 border border-white/40 rounded-xl hover:bg-white/10 transition-colors">
                <div className="bg-white/10 p-1.5 rounded-md">▶️</div>
                <div className="text-left">
                  <p className="text-[10px] uppercase opacity-60">Consíguelo en</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            {/* Phone Placeholder */}
            <div className="w-64 h-[320px] bg-white rounded-[40px] border-[8px] border-gray-800 relative hidden md:block translate-y-10 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl"></div>
              <div className="p-4 flex flex-col gap-4 mt-8">
                <div className="w-full h-32 bg-gray-100 rounded-xl"></div>
                <div className="w-full h-8 bg-gold rounded-md"></div>
                <div className="w-2/3 h-4 bg-gray-100 rounded-full"></div>
                <div className="w-full h-4 bg-gray-100 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 px-4 bg-bg-light">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gold shadow-md border border-gold/10 mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2 font-display">Calidad garantizada</h3>
            <p className="text-gray-500 text-sm">Productos frescos seleccionados diariamente para tu familia.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gold shadow-md border border-gold/10 mb-6">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2 font-display">Entrega rápida</h3>
            <p className="text-gray-500 text-sm">Mismo día en María Auxiliadora para que no te falte nada.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gold shadow-md border border-gold/10 mb-6">
              <PhoneCall size={32} />
            </div>
            <h3 className="text-xl font-bold text-primary-dark mb-2 font-display">Mejores precios</h3>
            <p className="text-gray-500 text-sm">Precios competitivos y promociones reales todos los días.</p>
          </div>
        </div>
      </section>

      {/* OUR STORE - NUESTRO LOCAL */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full" id="sucursales">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Gallery Column */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-48 md:h-64 rounded-xl overflow-hidden shadow-md">
                <DriveImage localPath="/electrodomesticos/licuadora2.jpg" alt="Local Super EF 1" />
              </div>
              <div className="h-48 md:h-64 rounded-xl overflow-hidden shadow-md">
                <DriveImage localPath="/electrodomesticos/airfryer4.jpg" alt="Local Super EF 2" />
              </div>
              <div className="col-span-2 h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
                <DriveImage localPath="/ofertas/negocio.jpg" alt="Local Super EF Fachada" />
              </div>
              <AnimatePresence>
                {showAllLocal && (
                  <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-48 md:h-64 rounded-xl overflow-hidden shadow-md">
                      <DriveImage driveId="1eezpQoa_GZvb0RXub7av834azyXXeO37" alt="Local Interior 1" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-48 md:h-64 rounded-xl overflow-hidden shadow-md">
                      <DriveImage driveId="1H8iRQj9GgVYb117WXCbm6vjNInOhYmyq" alt="Local Interior 2" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-2 h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
                      <DriveImage driveId="1s8iV8YB_Bu0-fm1SZr88Uno9giSKrj0y" alt="Local Apertura" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => setShowAllLocal(!showAllLocal)}
              className="mt-6 text-gold font-bold flex items-center gap-2 hover:underline"
            >
              {showAllLocal ? 'Ver menos fotos ↑' : 'Ver más fotos de nuestro local ↓'}
            </button>
          </div>

          {/* Text Column */}
          <div className="lg:w-[45%] flex flex-col justify-center">
            <span className="inline-block bg-primary-dark text-white px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-widest uppercase">🎉 ¡Abrimos nuestras puertas!</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-6">Super EF — Tu supermercado de confianza</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Desde nuestra inauguración, nos comprometemos a traerte los mejores productos a los mejores precios. Porque tu familia merece lo mejor, nos esforzamos día a día en brindarte frescura y atención de calidad.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-white"><CheckCircle2 size={14} /></div>
                Frescura garantizada
              </div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-white"><CheckCircle2 size={14} /></div>
                Precios competitivos
              </div>
              <div className="flex items-center gap-3 text-gray-700 font-semibold">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-white"><CheckCircle2 size={14} /></div>
                Atención personalizada
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#maps" 
                className="px-8 py-3 bg-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-med transition-colors"
              >
                <MapPin size={18} /> 📍 Visitanos
              </a>
              <a 
                href="https://www.instagram.com/supermercadoezefran/"
                target="_blank" rel="noreferrer"
                className="px-8 py-3 border-2 border-gold text-gold rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold hover:text-white transition-all"
              >
                <Instagram size={18} /> 📸 Ver más en Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-footer text-white pt-16" id="contacto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
          <div>
            <Logo />
            <p className="mt-6 text-sm text-gray-400 leading-relaxed">
              Super EZEFRAN es tu mercado de confianza en María Auxiliadora. Calidad premium y atención personalizada desde hace más de 10 años.
            </p>
            <div className="flex gap-4 mt-8">
              <a href="https://www.instagram.com/supermercadoezefran/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/595985104086" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gold transition-colors">
                <PhoneCall size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gold transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-xl font-bold mb-6 text-gold-light">Links útiles</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><button onClick={() => scrollToSection('top')} className="hover:text-gold transition-colors">Inicio</button></li>
              <li><button onClick={() => scrollToSection('ofertas')} className="hover:text-gold transition-colors">Ofertas</button></li>
              <li><button onClick={() => scrollToSection('sucursales')} className="hover:text-gold transition-colors">Sucursales</button></li>
              <li><button onClick={() => setIsWorkWithUsOpen(true)} className="hover:text-gold transition-colors">Trabajá con nosotros</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-bold mb-6 text-gold-light">Categorías</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              {CATEGORIES.slice(1, 6).map(c => (
                <li key={c.id}>
                  <button onClick={() => { setActiveCategory(c.id); scrollToSection('productos'); }} className="hover:text-gold transition-colors">
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl font-bold mb-6 text-gold-light">Medios de pago</h4>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold text-gray-400">
              <div className="px-3 py-2 border border-gray-800 rounded">💵 Efectivo</div>
              <div className="px-3 py-2 border border-gray-800 rounded">💳 Débito</div>
              <div className="px-3 py-2 border border-gray-800 rounded">💳 Crédito</div>
              <div className="px-3 py-2 border border-gray-800 rounded">📱 QR</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
          <p>© 2025 Super EzeFran. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex items-center justify-between bg-primary-dark text-white">
                <h3 className="text-xl font-display font-bold">Tu Carrito</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div 
                        className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl shadow-inner shrink-0" 
                        style={{ backgroundColor: item.bgColor }}
                      >
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-primary-dark font-bold">${item.price.toLocaleString()}</span>
                          {item.oldPrice && <span className="text-xs text-gray-400 line-through">${item.oldPrice.toLocaleString()}</span>}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100"><Minus size={14} /></button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100"><Plus size={14} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                    <ShoppingCart size={80} strokeWidth={1} />
                    <p className="mt-4 text-xl font-bold">Tu carrito está vacío</p>
                    <button 
                      onClick={() => { setIsCartOpen(false); scrollToSection('productos'); }}
                      className="mt-6 text-gold font-bold underline"
                    >
                      Empezar a comprar
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-gray-500">Subtotal</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-dark">${subtotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Iva incluido</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button onClick={() => setCart([])} className="py-3 border-2 border-gray-200 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors">Vaciar</button>
                  <button 
                    disabled={cart.length === 0}
                    onClick={() => setIsCheckoutOpen(true)}
                    className="py-3 bg-gold text-white rounded-lg font-bold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <Modal onClose={() => setIsCheckoutOpen(false)} title="Finalizar Pedido">
            <div className="space-y-6">
              <div className="bg-bg-light p-4 rounded-xl text-center">
                <p className="text-gray-600 mb-1">Total a abonar:</p>
                <p className="text-3xl font-bold text-primary-dark font-display">${subtotal.toLocaleString()}</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                alert('¡Pedido recibido! Te contactaremos por WhatsApp pronto.');
                setCart([]);
                setIsCheckoutOpen(false);
                setIsCartOpen(false);
              }}>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre completo</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp</label>
                  <input required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="Ej: 595985123456" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Dirección de entrega</label>
                  <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none" placeholder="Barrio, Calle, Altura" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Método de pago</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold outline-none">
                    <option>Efectivo contra entrega</option>
                    <option>Transferencia bancaria</option>
                    <option>Tarjeta de crédito / débito</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 bg-primary-dark text-white rounded-lg font-bold text-lg hover:bg-primary-med transition-colors shadow-lg">
                  Confirmar Pedido 🚀
                </button>
              </form>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* WORK WITH US MODAL */}
      <AnimatePresence>
        {isWorkWithUsOpen && (
          <Modal onClose={() => setIsWorkWithUsOpen(false)} title="Trabajá con nosotros">
            <p className="text-gray-500 mb-6">Sumate a nuestro equipo. Dejanos tus datos y te contactaremos.</p>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Gracias por tu interés. Revisaremos tu CV.'); setIsWorkWithUsOpen(false); }}>
              <input required type="text" placeholder="Nombre completo" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold" />
              <input required type="email" placeholder="Correo electrónico" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold" />
              <textarea placeholder="Contanos sobre vos..." className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold h-24" />
              <button type="submit" className="w-full py-3 bg-gold text-white rounded-lg font-bold">Enviar Postulación</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            className="fixed inset-0 bg-primary-dark z-50 p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <Logo />
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2 border border-white/20 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-display font-bold text-white">
              <button onClick={() => scrollToSection('top')}>Inicio</button>
              <button onClick={() => scrollToSection('ofertas')}>Ofertas</button>
              <button onClick={() => scrollToSection('productos')}>Categorías</button>
              <button onClick={() => scrollToSection('sucursales')}>Sucursales</button>
              <button onClick={() => scrollToSection('contacto')}>Contacto</button>
            </div>
            <div className="mt-auto border-t border-white/10 pt-8 text-gold-light">
              <p className="text-sm">📞 +595 985 104086</p>
              <p className="text-xs mt-2 opacity-60">María Auxiliadora, Paraguay</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST SYSTEM */}
      <div className="fixed bottom-0 right-0 z-[1000] p-6 pointer-events-none space-y-2">
        <AnimatePresence>
          {toasts.map((t, i) => (
            <Toast key={i} message={t} onClose={() => setToasts(prev => prev.filter((_, idx) => idx !== i))} />
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

// --- Subcomponents ---

const ProductCard: React.FC<{ product: Product, onAdd: (p: Product) => void }> = ({ product, onAdd }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
    >
      <div 
        className="h-40 md:h-52 relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: product.bgColor || '#FFFFFF' }}
      >
        {product.isOffer && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg animate-pulse z-10">
            OFERTA
          </div>
        )}
        {product.localPath || product.driveId ? (
          <DriveImage driveId={product.driveId} localPath={product.localPath} alt={product.name} className="group-hover:scale-110 transition-transform duration-500" objectFit="contain" />
        ) : (
          <span className="text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-500 select-none">{product.emoji}</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{product.category}</p>
        <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 line-clamp-2 h-10 md:h-12 leading-tight">
          {product.name}
        </h4>
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg md:text-xl font-bold text-primary-dark">${Number(product.price).toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">${product.oldPrice.toLocaleString()}</span>
            )}
          </div>
          <button 
            onClick={() => onAdd(product)}
            className="w-full py-2 bg-primary-dark text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gold transition-colors active:scale-95"
          >
            <Plus size={16} />
            <span className="hidden md:inline">Agregar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title: string }> = ({ children, onClose, title }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative z-10 shadow-2xl"
      >
        <div className="p-6 border-b flex justify-between items-center bg-primary-dark text-white">
          <h3 className="text-xl font-display font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

