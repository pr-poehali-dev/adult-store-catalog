import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "catalog" | "cart";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  tag?: string;
  image: string;
  rating: number;
  reviews: number;
}

interface CartItem extends Product {
  qty: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Velvet Rose Massage Oil",
    price: 1890,
    oldPrice: 2490,
    category: "Уход",
    tag: "ХИТ",
    image: "https://cdn.poehali.dev/projects/bdab6e45-3cd0-4e49-af3d-fa2c3fbf460c/files/a7cdedad-8901-4571-8880-4e50530b0c13.jpg",
    rating: 4.9,
    reviews: 128,
  },
  {
    id: 2,
    name: "Black Obsidian Luxury Set",
    price: 5490,
    category: "Наборы",
    tag: "NEW",
    image: "https://cdn.poehali.dev/projects/bdab6e45-3cd0-4e49-af3d-fa2c3fbf460c/files/18c6805d-43a8-4b5c-adbd-8cd20066f027.jpg",
    rating: 4.8,
    reviews: 64,
  },
  {
    id: 3,
    name: "Crimson Night Parfum",
    price: 3290,
    oldPrice: 3990,
    category: "Парфюм",
    image: "https://cdn.poehali.dev/projects/bdab6e45-3cd0-4e49-af3d-fa2c3fbf460c/files/47ae8180-569b-4ae8-a0c5-1bb14c91e0ad.jpg",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 4,
    name: "Gold Silk Body Elixir",
    price: 2190,
    category: "Уход",
    tag: "ХИТ",
    image: "https://cdn.poehali.dev/projects/bdab6e45-3cd0-4e49-af3d-fa2c3fbf460c/files/a7cdedad-8901-4571-8880-4e50530b0c13.jpg",
    rating: 5.0,
    reviews: 201,
  },
  {
    id: 5,
    name: "Midnight Fantasy Kit",
    price: 7890,
    category: "Наборы",
    tag: "NEW",
    image: "https://cdn.poehali.dev/projects/bdab6e45-3cd0-4e49-af3d-fa2c3fbf460c/files/18c6805d-43a8-4b5c-adbd-8cd20066f027.jpg",
    rating: 4.6,
    reviews: 43,
  },
  {
    id: 6,
    name: "Rose & Oud Candle Set",
    price: 1490,
    category: "Интерьер",
    image: "https://cdn.poehali.dev/projects/bdab6e45-3cd0-4e49-af3d-fa2c3fbf460c/files/47ae8180-569b-4ae8-a0c5-1bb14c91e0ad.jpg",
    rating: 4.5,
    reviews: 77,
  },
];

const CATEGORIES = ["Все", "Уход", "Наборы", "Парфюм", "Интерьер"];

export default function Index() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem("velvet_age_verified");
    if (verified === "true") setAgeVerified(true);
  }, []);

  const handleAgeConfirm = () => {
    localStorage.setItem("velvet_age_verified", "true");
    setAgeVerified(true);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const filtered = selectedCategory === "Все"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  if (!ageVerified) {
    return <AgeGate onConfirm={handleAgeConfirm} />;
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* NAVBAR */}
      <nav className="glass sticky top-0 z-50 border-b" style={{ borderColor: "rgba(255,45,120,0.2)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage("home")} className="font-playfair text-2xl font-bold tracking-wider" style={{ color: "#ff2d78" }}>
            VELVET
          </button>
          <div className="hidden md:flex gap-8">
            {(["home", "catalog"] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="font-montserrat text-sm font-medium tracking-widest uppercase transition-colors"
                style={{ color: page === p ? "#ff2d78" : "rgba(245,240,240,0.7)" }}
              >
                {p === "home" ? "Главная" : "Каталог"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage("cart")}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{ background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.3)", color: "#f5f0f0" }}
          >
            <Icon name="ShoppingBag" size={18} />
            <span className="hidden sm:inline">Корзина</span>
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center animate-fade-in-scale"
                style={{ background: "#ff2d78", color: "#fff" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {page === "home" && <HomePage onCatalog={() => setPage("catalog")} onAdd={addToCart} addedId={addedId} />}
      {page === "catalog" && (
        <CatalogPage
          products={filtered}
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          onAdd={addToCart}
          addedId={addedId}
        />
      )}
      {page === "cart" && (
        <CartPage
          cart={cart}
          total={cartTotal}
          onRemove={removeFromCart}
          onQty={changeQty}
          onCatalog={() => setPage("catalog")}
        />
      )}
    </div>
  );
}

/* ─── AGE GATE ─── */
function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a0815 50%, #0a0a0a 100%)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ff2d78, transparent)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, #d4a843, transparent)", filter: "blur(80px)", opacity: 0.08 }}
        />
      </div>

      <div
        className="relative animate-fade-in-scale text-center px-8 py-12 max-w-md w-full mx-4 rounded-2xl"
        style={{ background: "rgba(17,17,17,0.95)", border: "1px solid rgba(255,45,120,0.3)", boxShadow: "0 0 60px rgba(255,45,120,0.15)" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-neon"
          style={{ background: "linear-gradient(135deg, rgba(255,45,120,0.2), rgba(212,168,67,0.2))", border: "2px solid rgba(255,45,120,0.5)" }}
        >
          <span className="text-3xl">🔞</span>
        </div>

        <h1 className="font-playfair text-4xl font-bold mb-2" style={{ color: "#f5f0f0" }}>
          Добро пожаловать
        </h1>
        <p className="font-playfair italic text-xl mb-6" style={{ color: "#ff2d78" }}>в VELVET</p>

        <div
          className="mb-8 p-4 rounded-xl"
          style={{ background: "rgba(255,45,120,0.06)", border: "1px solid rgba(255,45,120,0.15)" }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: "rgba(245,240,240,0.9)" }}>
            Вам исполнилось <strong style={{ color: "#ff2d78" }}>18 лет</strong>?
          </p>
          <p className="text-xs mt-2" style={{ color: "rgba(245,240,240,0.45)" }}>
            Данный сайт содержит товары для взрослых. Вход разрешён только лицам, достигшим совершеннолетия.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 rounded-xl font-semibold text-sm tracking-widest uppercase transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #ff2d78, #d4a843)", color: "#fff", boxShadow: "0 8px 30px rgba(255,45,120,0.35)" }}
          >
            Мне есть 18 лет — войти
          </button>
          <button
            className="w-full py-3 rounded-xl text-sm transition-colors hover:bg-white/5"
            style={{ color: "rgba(245,240,240,0.35)", background: "transparent" }}
            onClick={() => window.history.back()}
          >
            Нет, я покину сайт
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── HOME PAGE ─── */
function HomePage({
  onCatalog,
  onAdd,
  addedId,
}: {
  onCatalog: () => void;
  onAdd: (p: Product) => void;
  addedId: number | null;
}) {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://cdn.poehali.dev/projects/bdab6e45-3cd0-4e49-af3d-fa2c3fbf460c/files/47ae8180-569b-4ae8-a0c5-1bb14c91e0ad.jpg"
            alt="hero"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.93) 0%, rgba(26,8,18,0.78) 50%, rgba(10,10,10,0.7) 100%)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase mb-8 animate-fade-in"
              style={{ background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.3)", color: "#ff6ba8" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              Эксклюзивная коллекция
            </div>

            <h1
              className="font-playfair text-6xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in stagger-1"
              style={{ color: "#f5f0f0" }}
            >
              Роскошь без
              <br />
              <span style={{ color: "#ff2d78", textShadow: "0 0 40px rgba(255,45,120,0.4)" }}>ограничений</span>
            </h1>

            <p
              className="text-lg mb-10 animate-fade-in stagger-2"
              style={{ color: "rgba(245,240,240,0.65)", lineHeight: 1.8 }}
            >
              Премиальные товары для взрослых — с элегантностью, качеством и полной конфиденциальностью доставки.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in stagger-3">
              <button
                onClick={onCatalog}
                className="px-8 py-4 rounded-full font-semibold text-sm tracking-widest uppercase transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #ff2d78, #c0306b)", color: "#fff", boxShadow: "0 8px 30px rgba(255,45,120,0.4)" }}
              >
                Перейти в каталог
              </button>
              <button
                className="px-8 py-4 rounded-full font-medium text-sm tracking-widest uppercase transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(245,240,240,0.3)", color: "#f5f0f0" }}
              >
                Узнать больше
              </button>
            </div>
          </div>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 animate-fade-in stagger-4">
          {[
            { icon: "Lock", text: "Конф. доставка" },
            { icon: "Star", text: "Топ качество" },
            { icon: "Truck", text: "Быстрая доставка" },
          ].map((b) => (
            <div
              key={b.text}
              className="flex items-center gap-3 px-4 py-3 rounded-xl glass"
              style={{ border: "1px solid rgba(255,45,120,0.2)" }}
            >
              <Icon name={b.icon} size={16} style={{ color: "#ff2d78" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(245,240,240,0.7)" }}>{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 border-y" style={{ borderColor: "rgba(255,45,120,0.1)" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "Package", title: "Анонимная упаковка", desc: "Без логотипов и маркировки" },
            { icon: "Shield", title: "Безопасная оплата", desc: "SSL шифрование данных" },
            { icon: "RotateCcw", title: "Возврат 14 дней", desc: "Без лишних вопросов" },
            { icon: "Sparkles", title: "Оригинал 100%", desc: "Только сертифицированные бренды" },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`text-center p-5 rounded-2xl animate-fade-in stagger-${i + 1}`}
              style={{ background: "rgba(255,45,120,0.04)", border: "1px solid rgba(255,45,120,0.1)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(255,45,120,0.12)" }}
              >
                <Icon name={f.icon} size={20} style={{ color: "#ff2d78" }} />
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: "#f5f0f0" }}>{f.title}</p>
              <p className="text-xs" style={{ color: "rgba(245,240,240,0.45)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: "#ff2d78" }}>Популярное</p>
            <h2 className="font-playfair text-4xl font-bold" style={{ color: "#f5f0f0" }}>Хиты продаж</h2>
          </div>
          <button
            onClick={onCatalog}
            className="text-sm font-medium flex items-center gap-1 transition-all hover:gap-2"
            style={{ color: "rgba(245,240,240,0.5)" }}
          >
            Все товары <Icon name="ArrowRight" size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} addedId={addedId} delay={i + 1} />
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section
        className="mx-4 mb-20 rounded-3xl overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #1a0815 0%, #0d0d1a 100%)", border: "1px solid rgba(255,45,120,0.2)" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #ff2d78, transparent)", filter: "blur(60px)" }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#d4a843" }}>
              Специальное предложение
            </p>
            <h2 className="font-playfair text-4xl font-bold mb-3" style={{ color: "#f5f0f0" }}>
              Скидка <span style={{ color: "#ff2d78" }}>20%</span>
              <br />
              на первый заказ
            </h2>
            <p className="text-sm" style={{ color: "rgba(245,240,240,0.55)" }}>
              Введите промокод <strong style={{ color: "#d4a843" }}>VELVET20</strong> при оформлении
            </p>
          </div>
          <button
            onClick={onCatalog}
            className="shrink-0 px-10 py-4 rounded-full font-semibold text-sm tracking-widest uppercase transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #ff2d78, #d4a843)", color: "#fff", boxShadow: "0 8px 30px rgba(255,45,120,0.35)" }}
          >
            Получить скидку
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── CATALOG PAGE ─── */
function CatalogPage({
  products,
  categories,
  selected,
  onSelect,
  onAdd,
  addedId,
}: {
  products: Product[];
  categories: string[];
  selected: string;
  onSelect: (c: string) => void;
  onAdd: (p: Product) => void;
  addedId: number | null;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: "#ff2d78" }}>Наш ассортимент</p>
        <h1 className="font-playfair text-5xl font-bold" style={{ color: "#f5f0f0" }}>Каталог</h1>
      </div>

      <div className="flex gap-3 flex-wrap mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            style={
              selected === c
                ? { background: "linear-gradient(135deg, #ff2d78, #c0306b)", color: "#fff", boxShadow: "0 4px 20px rgba(255,45,120,0.3)" }
                : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(245,240,240,0.6)" }
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} addedId={addedId} delay={Math.min(i + 1, 6)} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-24" style={{ color: "rgba(245,240,240,0.35)" }}>
          <Icon name="PackageSearch" size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-playfair text-xl">В этой категории пока нет товаров</p>
        </div>
      )}
    </div>
  );
}

/* ─── CART PAGE ─── */
function CartPage({
  cart,
  total,
  onRemove,
  onQty,
  onCatalog,
}: {
  cart: CartItem[];
  total: number;
  onRemove: (id: number) => void;
  onQty: (id: number, d: number) => void;
  onCatalog: () => void;
}) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(255,45,120,0.08)", border: "1px solid rgba(255,45,120,0.2)" }}
        >
          <Icon name="ShoppingBag" size={40} style={{ color: "rgba(255,45,120,0.5)" }} />
        </div>
        <h2 className="font-playfair text-3xl font-bold mb-3" style={{ color: "#f5f0f0" }}>Корзина пуста</h2>
        <p className="mb-8" style={{ color: "rgba(245,240,240,0.45)" }}>Добавьте товары из нашего каталога</p>
        <button
          onClick={onCatalog}
          className="px-8 py-4 rounded-full font-semibold text-sm tracking-widest uppercase transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #ff2d78, #c0306b)", color: "#fff", boxShadow: "0 8px 30px rgba(255,45,120,0.35)" }}
        >
          Перейти в каталог
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: "#ff2d78" }}>Оформление</p>
        <h1 className="font-playfair text-5xl font-bold" style={{ color: "#f5f0f0" }}>Корзина</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-2xl animate-fade-in"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1 truncate" style={{ color: "#f5f0f0" }}>{item.name}</p>
                <p className="text-xs mb-3" style={{ color: "#ff2d78" }}>{item.category}</p>
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 rounded-full px-1 py-1"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <button
                      onClick={() => onQty(item.id, -1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors hover:bg-white/10"
                      style={{ color: "#f5f0f0" }}
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-5 text-center" style={{ color: "#f5f0f0" }}>{item.qty}</span>
                    <button
                      onClick={() => onQty(item.id, 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-colors hover:bg-white/10"
                      style={{ color: "#f5f0f0" }}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold" style={{ color: "#ff2d78" }}>
                    {(item.price * item.qty).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-red-500/20"
                style={{ color: "rgba(245,240,240,0.35)" }}
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div
            className="sticky top-24 p-6 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,45,120,0.2)" }}
          >
            <h3 className="font-playfair text-xl font-bold mb-6" style={{ color: "#f5f0f0" }}>Итого</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span style={{ color: "rgba(245,240,240,0.55)" }}>
                  Товары ({cart.reduce((s, i) => s + i.qty, 0)} шт.)
                </span>
                <span style={{ color: "#f5f0f0" }}>{total.toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "rgba(245,240,240,0.55)" }}>Доставка</span>
                <span style={{ color: "#4ade80" }}>Бесплатно</span>
              </div>
              <div
                className="border-t pt-3 flex justify-between font-bold"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <span style={{ color: "#f5f0f0" }}>К оплате</span>
                <span style={{ color: "#ff2d78", fontSize: "1.2rem" }}>{total.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <input
                placeholder="Промокод"
                className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f5f0f0" }}
              />
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,45,120,0.15)", border: "1px solid rgba(255,45,120,0.3)", color: "#ff2d78" }}
              >
                Применить
              </button>
            </div>

            <button
              className="w-full py-4 rounded-xl font-semibold text-sm tracking-widest uppercase transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ff2d78, #d4a843)", color: "#fff", boxShadow: "0 8px 30px rgba(255,45,120,0.35)" }}
            >
              Оформить заказ
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Icon name="Lock" size={12} style={{ color: "rgba(245,240,240,0.35)" }} />
              <span className="text-xs" style={{ color: "rgba(245,240,240,0.35)" }}>Безопасная оплата</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({
  product,
  onAdd,
  addedId,
  delay,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  addedId: number | null;
  delay: number;
}) {
  const isAdded = addedId === product.id;

  return (
    <div
      className={`card-hover rounded-2xl overflow-hidden flex flex-col animate-fade-in stagger-${delay}`}
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {product.tag && (
          <span
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-widest"
            style={{
              background: product.tag === "NEW" ? "rgba(212,168,67,0.9)" : "rgba(255,45,120,0.9)",
              color: "#fff",
            }}
          >
            {product.tag}
          </span>
        )}
        {product.oldPrice && (
          <span
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,45,120,0.9)", color: "#fff" }}
          >
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-medium mb-1 tracking-wider" style={{ color: "rgba(255,45,120,0.7)" }}>
          {product.category}
        </p>
        <h3 className="font-playfair font-semibold text-lg mb-2 leading-tight" style={{ color: "#f5f0f0" }}>
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-4">
          <Icon name="Star" size={12} style={{ color: "#d4a843", fill: "#d4a843" }} />
          <span className="text-xs font-medium" style={{ color: "#d4a843" }}>{product.rating}</span>
          <span className="text-xs" style={{ color: "rgba(245,240,240,0.35)" }}>({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-bold text-xl" style={{ color: "#f5f0f0" }}>
              {product.price.toLocaleString("ru-RU")} ₽
            </span>
            {product.oldPrice && (
              <span className="text-sm ml-2 line-through" style={{ color: "rgba(245,240,240,0.35)" }}>
                {product.oldPrice.toLocaleString("ru-RU")} ₽
              </span>
            )}
          </div>
          <button
            onClick={() => onAdd(product)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={
              isAdded
                ? { background: "rgba(74,222,128,0.2)", border: "1px solid rgba(74,222,128,0.4)" }
                : { background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.3)" }
            }
          >
            <Icon name={isAdded ? "Check" : "ShoppingCart"} size={16} style={{ color: isAdded ? "#4ade80" : "#ff2d78" }} />
          </button>
        </div>
      </div>
    </div>
  );
}