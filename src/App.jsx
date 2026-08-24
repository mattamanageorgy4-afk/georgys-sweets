import React, { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, Check, ChevronLeft, MapPin, Home as HomeIcon, Truck, CreditCard, Wallet } from "lucide-react";

/* Real Georgy's Sweets logo, embedded so it always renders. */
const LOGO_URI = "/images/logo.png";

const PRODUCT_PHOTOS = {
  "biscoff-cookie": "/images/biscoff-cookie.jpg",
  "pumpkin-roll": "/images/pumpkin-roll.jpg",
  "carrot-loaf": "/images/carrot-loaf.jpg",
  "crumb-loaf": "/images/crumb-loaf.jpg",
};


/* ------------------------------------------------------------------
   CONFIG — edit these before launch. Nothing fake is shown to
   customers; anything not yet decided says so plainly instead.
------------------------------------------------------------------ */
const CONFIG = {
  pickup: {
    // TODO: replace with your real pickup address.
    address: "Your pickup address goes here — add it in CONFIG.pickup.address",
    instructions: "Text or call when you get here and I'll bring it right out. Try to grab it within your pickup window.",
  },
  delivery: {
    // TODO: set a delivery fee once you've decided on one. Leave null to keep it "to be confirmed".
    feeCents: null,
    note: "I'll follow up with you directly about the delivery fee and timing after you order.",
  },
  bagFeeCents: 50,
  businessName: "Georgy's Sweets",
  est: "2022",
};

const PRODUCTS = [
  {
    id: "biscoff-cookie",
    name: "Biscoff Pumpkin Cookies",
    price: 4.0,
    unit: "each",
    blurb: "A soft pumpkin cookie with Biscoff flavor mixed in.",
    icon: "cookie",
    photo: PRODUCT_PHOTOS["biscoff-cookie"],
  },
  {
    id: "pumpkin-roll",
    name: "Pumpkin Cinnamon Rolls",
    price: 4.0,
    unit: "each",
    blurb: "Soft pumpkin cinnamon rolls with a sweet topping.",
    icon: "roll",
    photo: PRODUCT_PHOTOS["pumpkin-roll"],
  },
  {
    id: "carrot-loaf",
    name: "Carrot Cake Loaf",
    price: 12.0,
    unit: "loaf",
    blurb: "A full-size carrot cake, baked as a loaf.",
    icon: "loaf-carrot",
    photo: PRODUCT_PHOTOS["carrot-loaf"],
  },
  {
    id: "crumb-loaf",
    name: "Cinnamon Crumb Cake Loaf",
    price: 12.0,
    unit: "loaf",
    blurb: "A full-size cinnamon crumb cake, baked as a loaf.",
    icon: "loaf-crumb",
    photo: PRODUCT_PHOTOS["crumb-loaf"],
  },
];

const money = (n) => `$${n.toFixed(2)}`;

/* ------------------------------------------------------------------
   Maryland zip check — approximate cottage-food service area check.
   Covers the standard MD zip ranges (206xx–219xx). Good enough to
   gate the delivery option; not a substitute for real verification.
------------------------------------------------------------------ */
function isMarylandZip(zip) {
  const z = parseInt(String(zip).trim().slice(0, 5), 10);
  if (Number.isNaN(z)) return null;
  return (z >= 20601 && z <= 20916) || (z >= 21001 && z <= 21930);
}

/* ------------------------------------------------------------------
   Icons — a small consistent line-illustration set, echoing the
   logo's hand-drawn rolling-pin mark. Same stroke weight throughout.
------------------------------------------------------------------ */
function ProductIcon({ type }) {
  const stroke = "var(--brown)";
  const common = { fill: "none", stroke, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "cookie") {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="52" r="30" fill="var(--beige-soft)" stroke={stroke} strokeWidth="2.2" />
        <path d="M38 40q6 8 2 14M58 38q4 6 8 4M42 60q6 4 10 -2M62 56q6 2 6 8" {...common} />
        <circle cx="40" cy="46" r="2.2" fill={stroke} />
        <circle cx="58" cy="50" r="2.2" fill={stroke} />
        <circle cx="48" cy="64" r="2.2" fill={stroke} />
        <circle cx="64" cy="42" r="2.2" fill={stroke} />
      </svg>
    );
  }
  if (type === "roll") {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="52" r="30" fill="var(--beige-soft)" stroke={stroke} strokeWidth="2.2" />
        <path
          d="M50 30a20 20 0 1 1 -14 6"
          {...common}
        />
        <path d="M50 38a12 12 0 1 1 -8.5 3.6" {...common} />
        <circle cx="50" cy="52" r="3.5" fill={stroke} />
        <path d="M30 66q20 8 40 0" {...common} />
      </svg>
    );
  }
  if (type === "loaf-carrot") {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="52" r="30" fill="var(--beige-soft)" stroke={stroke} strokeWidth="2.2" />
        <rect x="30" y="46" width="40" height="20" rx="4" fill="none" stroke={stroke} strokeWidth="2.2" />
        <path d="M30 46q20 -8 40 0" {...common} />
        <path d="M40 40l3 -8M50 39l0 -9M60 40l-3 -8" {...common} />
        <path d="M48 37q2 -3 4 0" {...common} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <circle cx="50" cy="52" r="30" fill="var(--beige-soft)" stroke={stroke} strokeWidth="2.2" />
      <rect x="30" y="48" width="40" height="18" rx="4" fill="none" stroke={stroke} strokeWidth="2.2" />
      <path d="M32 48q18 -10 36 0" {...common} />
      <circle cx="40" cy="43" r="1.6" fill={stroke} />
      <circle cx="48" cy="40" r="1.6" fill={stroke} />
      <circle cx="56" cy="43" r="1.6" fill={stroke} />
      <circle cx="62" cy="46" r="1.6" fill={stroke} />
      <circle cx="36" cy="46" r="1.6" fill={stroke} />
    </svg>
  );
}

function Sparkle({ size = 16, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path
        d="M12 0c0.6 5 2 8 7 9-5 1-6.4 4-7 9-0.6-5-2-8-7-9 5-1 6.4-4 7-9z"
        fill="var(--rust)"
      />
    </svg>
  );
}

/* Signature emblem — the real Georgy's Sweets logo. */
function Emblem({ size = 220 }) {
  return (
    <img
      src={LOGO_URI}
      alt="Georgy's Sweets logo"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

/* ------------------------------------------------------------------
   App
------------------------------------------------------------------ */
export default function App() {
  const [page, setPage] = useState("home"); // home | shop | checkout | confirmation
  const [cart, setCart] = useState({}); // id -> qty
  const [cartOpen, setCartOpen] = useState(false);
  const [addBag, setAddBag] = useState(false);
  const [step, setStep] = useState(0); // checkout step index
  const [fulfillment, setFulfillment] = useState(null); // 'pickup' | 'delivery'
  const [locationInput, setLocationInput] = useState("");
  const [locationChecked, setLocationChecked] = useState(false);
  const [locationValid, setLocationValid] = useState(null);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [payment, setPayment] = useState(null); // 'checkout' | 'pickup'
  const [order, setOrder] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(null);

  // Handle the customer landing back here after Stripe Checkout.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("checkout");
    if (status === "success") {
      const sessionId = params.get("session_id");
      const pending = localStorage.getItem("gs_pending_order");
      (async () => {
        try {
          if (sessionId) {
            const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`);
            const data = await res.json();
            if (!data.paid) {
              setCheckoutMessage("We couldn't confirm your payment yet. If you were charged, please contact us.");
              return;
            }
          }
          if (pending) {
            const parsed = JSON.parse(pending);
            setOrder(parsed);
            setPage("confirmation");
            localStorage.removeItem("gs_pending_order");
          }
        } catch (e) {
          setCheckoutMessage("Payment went through, but we couldn't load your order summary. We'll still receive your order.");
        }
      })();
      window.history.replaceState({}, "", window.location.pathname);
    } else if (status === "canceled") {
      setCheckoutMessage("Checkout was canceled — your order was not placed. You can try again below.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === id), qty })),
    [cart]
  );
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);
  const bagFee = addBag ? CONFIG.bagFeeCents / 100 : 0;
  const total = subtotal + bagFee;

  function setQty(id, qty) {
    setCart((c) => ({ ...c, [id]: Math.max(0, qty) }));
  }
  function addToCart(id, amount) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + amount }));
    setCartOpen(true);
  }

  function goCheckout() {
    if (cartItems.length === 0) return;
    setCartOpen(false);
    setPage("checkout");
    setStep(0);
  }

  function checkLocation() {
    const valid = isMarylandZip(locationInput) ??
      /\bmd\b|maryland/i.test(locationInput);
    setLocationValid(!!valid);
    setLocationChecked(true);
    if (!valid) setFulfillment(null);
  }

  function chooseFulfillment(type) {
    setFulfillment(type);
    if (type === "pickup") {
      // pay at pickup becomes available again
    } else {
      setPayment("checkout"); // delivery must be paid online
    }
  }

  function validateStep() {
    const e = {};
    if (step === 1) {
      if (!fulfillment) e.fulfillment = "Choose pickup or delivery to continue.";
      if (fulfillment === "delivery" && locationValid !== true) e.location = "Confirm a Maryland zip code, city, or state first.";
    }
    if (step === 2) {
      if (!contact.name.trim()) e.name = "Enter your name.";
      if (!contact.phone.trim()) e.phone = "Enter a phone number.";
      if (!contact.email.trim() || !contact.email.includes("@")) e.email = "Enter a valid email.";
    }
    if (step === 3) {
      if (!payment) e.payment = "Choose how you'd like to pay.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 4));
  }
  function prevStep() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function confirmOrder() {
    const num = "GS-" + Math.floor(1000 + Math.random() * 9000);
    const draftOrder = {
      number: num,
      items: cartItems,
      subtotal,
      bagFee,
      total,
      fulfillment,
      payment,
      contact,
      date: new Date(),
    };

    if (payment === "pickup") {
      // No charge happens — confirm immediately.
      setOrder(draftOrder);
      setPage("confirmation");
      return;
    }

    // Paying online: create a real Stripe Checkout session and redirect.
    setSubmitting(true);
    setCheckoutMessage(null);
    try {
      localStorage.setItem("gs_pending_order", JSON.stringify(draftOrder));
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ id: i.id, qty: i.qty })),
          addBag,
          bagFeeCents: CONFIG.bagFeeCents,
          contactEmail: contact.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutMessage("Something went wrong starting checkout. Please try again.");
        setSubmitting(false);
      }
    } catch (e) {
      setCheckoutMessage("Something went wrong starting checkout. Please try again.");
      setSubmitting(false);
    }
  }

  function startNewOrder() {
    setCart({});
    setAddBag(false);
    setStep(0);
    setFulfillment(null);
    setLocationInput("");
    setLocationChecked(false);
    setLocationValid(null);
    setContact({ name: "", phone: "", email: "" });
    setPayment(null);
    setOrder(null);
    setErrors({});
    setCheckoutMessage(null);
    setPage("home");
  }

  return (
    <div className="gs-root">
      <GlobalStyle />
      <Header page={page} setPage={setPage} itemCount={itemCount} onCartClick={() => setCartOpen(true)} />

      {page === "home" && <HomePage onShop={() => setPage("shop")} />}

      {page === "shop" && (
        <ShopPage cart={cart} setQty={setQty} addToCart={addToCart} />
      )}

      {page === "checkout" && (
        <CheckoutPage
          step={step}
          setStep={setStep}
          cartItems={cartItems}
          setQty={setQty}
          addBag={addBag}
          setAddBag={setAddBag}
          subtotal={subtotal}
          bagFee={bagFee}
          total={total}
          fulfillment={fulfillment}
          chooseFulfillment={chooseFulfillment}
          locationInput={locationInput}
          setLocationInput={setLocationInput}
          checkLocation={checkLocation}
          locationChecked={locationChecked}
          locationValid={locationValid}
          contact={contact}
          setContact={setContact}
          payment={payment}
          setPayment={setPayment}
          errors={errors}
          nextStep={nextStep}
          prevStep={prevStep}
          confirmOrder={confirmOrder}
          onBackToShop={() => setPage("shop")}
          submitting={submitting}
          checkoutMessage={checkoutMessage}
        />
      )}

      {page === "confirmation" && order && (
        <ConfirmationPage order={order} onNewOrder={startNewOrder} />
      )}

      {cartOpen && page !== "checkout" && (
        <CartDrawer
          cartItems={cartItems}
          setQty={setQty}
          subtotal={subtotal}
          onClose={() => setCartOpen(false)}
          onCheckout={goCheckout}
          onShop={() => {
            setCartOpen(false);
            setPage("shop");
          }}
        />
      )}

      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------
   Header
------------------------------------------------------------------ */
function Header({ page, setPage, itemCount, onCartClick }) {
  return (
    <header className="gs-header">
      <button className="gs-logo-link" onClick={() => setPage("home")} aria-label="Georgy's Sweets home">
        <span className="gs-logo-mark">
          <img src={LOGO_URI} alt="" width="32" height="32" />
        </span>
        <span className="gs-logo-text">Georgy's Sweets</span>
      </button>
      <nav className="gs-nav">
        <button className={`gs-nav-link ${page === "shop" ? "active" : ""}`} onClick={() => setPage("shop")}>
          Fall Line
        </button>
        <button className="gs-cart-btn" onClick={onCartClick} aria-label="Open cart">
          <ShoppingBag size={19} strokeWidth={1.8} />
          {itemCount > 0 && <span className="gs-cart-count">{itemCount}</span>}
        </button>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="gs-footer">
      <span>{CONFIG.businessName} · est. {CONFIG.est} · Home bakery, Maryland</span>
    </footer>
  );
}

/* ------------------------------------------------------------------
   Home
------------------------------------------------------------------ */
function HomePage({ onShop }) {
  return (
    <main className="gs-home">
      <div className="gs-home-inner">
        <Emblem size={280} />
        <p className="gs-eyebrow">Home bakery · Maryland</p>
        <h1 className="gs-home-title">Seasonal baking,<br />made in small batches.</h1>
        <p className="gs-home-copy">
          Georgy's Sweets is a home bakery based in Maryland, offering small-batch baked goods
          made to order. This season's menu features four fall selections. Orders are available
          for local pickup or delivery within Maryland.
        </p>
        <button className="gs-btn-primary" onClick={onShop}>
          Shop the Fall Line
        </button>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------
   Shop
------------------------------------------------------------------ */
function ShopPage({ cart, setQty, addToCart }) {
  return (
    <main className="gs-shop">
      <div className="gs-shop-head">
        <p className="gs-eyebrow">This season</p>
        <h1 className="gs-section-title">The Fall Line</h1>
        <p className="gs-shop-sub">These four, until the season's over.</p>
      </div>
      <div className="gs-grid">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} setQty={setQty} addToCart={addToCart} />
        ))}
      </div>
    </main>
  );
}

function ProductCard({ product, qty, setQty, addToCart }) {
  const [pendingQty, setPendingQty] = useState(1);
  return (
    <div className="gs-card">
      <div className="gs-card-photo">
        <img src={product.photo} alt={product.name} />
      </div>
      <h3 className="gs-card-name">{product.name}</h3>
      <p className="gs-card-blurb">{product.blurb}</p>
      <div className="gs-card-foot">
        <span className="gs-card-price">
          {money(product.price)} <span className="gs-card-unit">/ {product.unit}</span>
        </span>
      </div>
      <div className="gs-card-actions">
        <div className="gs-stepper">
          <button aria-label="Decrease quantity" onClick={() => setPendingQty((q) => Math.max(1, q - 1))}>
            <Minus size={14} />
          </button>
          <span>{pendingQty}</span>
          <button aria-label="Increase quantity" onClick={() => setPendingQty((q) => q + 1)}>
            <Plus size={14} />
          </button>
        </div>
        <button
          className="gs-btn-secondary gs-add-btn"
          onClick={() => {
            addToCart(product.id, pendingQty);
            setPendingQty(1);
          }}
        >
          Add to cart
        </button>
      </div>
      {qty > 0 && <p className="gs-in-cart">{qty} in your cart</p>}
    </div>
  );
}

/* ------------------------------------------------------------------
   Cart drawer
------------------------------------------------------------------ */
function CartDrawer({ cartItems, setQty, subtotal, onClose, onCheckout, onShop }) {
  return (
    <div className="gs-drawer-overlay" onClick={onClose}>
      <aside className="gs-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="gs-drawer-head">
          <h2>Your cart</h2>
          <button className="gs-icon-btn" onClick={onClose} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>
        {cartItems.length === 0 ? (
          <div className="gs-empty">
            <p>Your cart is empty.</p>
            <button className="gs-btn-secondary" onClick={onShop}>
              Browse the Fall Line
            </button>
          </div>
        ) : (
          <>
            <div className="gs-drawer-items">
              {cartItems.map((item) => (
                <div className="gs-drawer-item" key={item.id}>
                  <div className="gs-drawer-item-icon">
                    <img src={item.photo} alt={item.name} />
                  </div>
                  <div className="gs-drawer-item-info">
                    <p className="gs-drawer-item-name">{item.name}</p>
                    <p className="gs-drawer-item-price">{money(item.price)} each</p>
                    <div className="gs-stepper small">
                      <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                        <Minus size={12} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="gs-drawer-item-total">{money(item.qty * item.price)}</div>
                </div>
              ))}
            </div>
            <div className="gs-drawer-foot">
              <div className="gs-row">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <p className="gs-drawer-note">You can add a bag and pick pickup or delivery next.</p>
              <button className="gs-btn-primary full" onClick={onCheckout}>
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------
   Checkout
------------------------------------------------------------------ */
const STEPS = ["Review", "Fulfillment", "Contact", "Payment", "Confirm"];

function CheckoutPage(props) {
  const {
    step, cartItems, setQty, addBag, setAddBag, subtotal, bagFee, total,
    fulfillment, chooseFulfillment, locationInput, setLocationInput, checkLocation,
    locationChecked, locationValid, contact, setContact, payment, setPayment,
    errors, nextStep, prevStep, confirmOrder, onBackToShop,
    submitting, checkoutMessage,
  } = props;

  if (cartItems.length === 0) {
    return (
      <main className="gs-checkout">
        <div className="gs-empty">
          <p>Your cart is empty.</p>
          <button className="gs-btn-secondary" onClick={onBackToShop}>
            Browse the Fall Line
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="gs-checkout">
      <div className="gs-stepbar">
        {STEPS.map((label, i) => (
          <div key={label} className={`gs-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
            <span className="gs-step-dot">{i < step ? <Check size={12} /> : i + 1}</span>
            <span className="gs-step-label">{label}</span>
            {i < STEPS.length - 1 && <span className="gs-step-line" />}
          </div>
        ))}
      </div>

      {checkoutMessage && <p className="gs-checkout-banner">{checkoutMessage}</p>}

      <div className="gs-checkout-body">
        {step === 0 && (
          <ReviewStep cartItems={cartItems} setQty={setQty} addBag={addBag} setAddBag={setAddBag} subtotal={subtotal} bagFee={bagFee} total={total} />
        )}
        {step === 1 && (
          <FulfillmentStep
            fulfillment={fulfillment}
            chooseFulfillment={chooseFulfillment}
            locationInput={locationInput}
            setLocationInput={setLocationInput}
            checkLocation={checkLocation}
            locationChecked={locationChecked}
            locationValid={locationValid}
            errors={errors}
          />
        )}
        {step === 2 && <ContactStep contact={contact} setContact={setContact} errors={errors} />}
        {step === 3 && (
          <PaymentStep payment={payment} setPayment={setPayment} fulfillment={fulfillment} errors={errors} total={total} />
        )}
        {step === 4 && (
          <ConfirmStep
            cartItems={cartItems}
            addBag={addBag}
            bagFee={bagFee}
            subtotal={subtotal}
            total={total}
            fulfillment={fulfillment}
            payment={payment}
            contact={contact}
          />
        )}
      </div>

      <div className="gs-checkout-nav">
        {step > 0 ? (
          <button className="gs-btn-secondary" onClick={prevStep} disabled={submitting}>
            <ChevronLeft size={16} /> Back
          </button>
        ) : (
          <button className="gs-btn-secondary" onClick={onBackToShop} disabled={submitting}>
            <ChevronLeft size={16} /> Continue shopping
          </button>
        )}
        {step < 4 ? (
          <button className="gs-btn-primary" onClick={nextStep}>
            Continue
          </button>
        ) : (
          <button className="gs-btn-primary" onClick={confirmOrder} disabled={submitting}>
            {submitting ? "Redirecting to secure checkout…" : "Confirm order"}
          </button>
        )}
      </div>
    </main>
  );
}

function ReviewStep({ cartItems, setQty, addBag, setAddBag, subtotal, bagFee, total }) {
  return (
    <section className="gs-panel">
      <h2 className="gs-panel-title">Review your order</h2>
      <div className="gs-review-list">
        {cartItems.map((item) => (
          <div className="gs-review-row" key={item.id}>
            <div className="gs-review-icon">
              <img src={item.photo} alt={item.name} />
            </div>
            <div className="gs-review-info">
              <p className="gs-review-name">{item.name}</p>
              <p className="gs-review-price">{money(item.price)} each</p>
            </div>
            <div className="gs-stepper small">
              <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                <Minus size={12} />
              </button>
              <span>{item.qty}</span>
              <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                <Plus size={12} />
              </button>
            </div>
            <div className="gs-review-total">{money(item.qty * item.price)}</div>
          </div>
        ))}
      </div>

      <label className="gs-bag-option">
        <input type="checkbox" checked={addBag} onChange={(e) => setAddBag(e.target.checked)} />
        <span>Add a bag <em>(+{money(CONFIG.bagFeeCents / 100)})</em></span>
      </label>

      <div className="gs-totals">
        <div className="gs-row">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        {addBag && (
          <div className="gs-row">
            <span>Bag fee</span>
            <span>{money(bagFee)}</span>
          </div>
        )}
        <div className="gs-row gs-row-total">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>
    </section>
  );
}

function FulfillmentStep({ fulfillment, chooseFulfillment, locationInput, setLocationInput, checkLocation, locationChecked, locationValid, errors }) {
  return (
    <section className="gs-panel">
      <h2 className="gs-panel-title">Pickup or delivery</h2>

      <div className="gs-fulfill-options">
        <button className={`gs-fulfill-card ${fulfillment === "pickup" ? "active" : ""}`} onClick={() => chooseFulfillment("pickup")}>
          <HomeIcon size={20} />
          <span className="gs-fulfill-name">Pickup</span>
          <span className="gs-fulfill-desc">I'll send the address once your order's confirmed.</span>
        </button>
        <button
          className={`gs-fulfill-card ${fulfillment === "delivery" ? "active" : ""}`}
          onClick={() => {
            if (locationValid) chooseFulfillment("delivery");
          }}
          disabled={!locationValid}
        >
          <Truck size={20} />
          <span className="gs-fulfill-name">Maryland delivery</span>
          <span className="gs-fulfill-desc">Maryland only — that's what my cottage-food license allows.</span>
        </button>
      </div>

      <div className="gs-location-check">
        <p className="gs-location-label">
          <MapPin size={14} /> Enter your zip so I can check you're in Maryland
        </p>
        <div className="gs-location-row">
          <input
            type="text"
            placeholder="Zip code, or city and state"
            value={locationInput}
            onChange={(e) => {
              setLocationInput(e.target.value);
            }}
          />
          <button className="gs-btn-secondary" onClick={checkLocation}>
            Check
          </button>
        </div>
        {locationChecked && locationValid === true && (
          <p className="gs-location-ok">You're in Maryland, so delivery's an option.</p>
        )}
        {locationChecked && locationValid === false && (
          <p className="gs-location-bad">
            I can only deliver within Maryland right now — it's what my cottage-food license covers. Pickup works from anywhere though.
          </p>
        )}
      </div>

      {errors.fulfillment && <p className="gs-error">{errors.fulfillment}</p>}
      {errors.location && <p className="gs-error">{errors.location}</p>}

      {fulfillment === "delivery" && (
        <p className="gs-note">{CONFIG.delivery.note}</p>
      )}
    </section>
  );
}

function ContactStep({ contact, setContact, errors }) {
  return (
    <section className="gs-panel">
      <h2 className="gs-panel-title">Contact information</h2>
      <div className="gs-form">
        <label>
          Name
          <input type="text" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Your full name" />
          {errors.name && <span className="gs-error">{errors.name}</span>}
        </label>
        <label>
          Phone
          <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="(555) 555-0100" />
          {errors.phone && <span className="gs-error">{errors.phone}</span>}
        </label>
        <label>
          Email
          <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@email.com" />
          {errors.email && <span className="gs-error">{errors.email}</span>}
        </label>
      </div>
    </section>
  );
}

function PaymentStep({ payment, setPayment, fulfillment, errors, total }) {
  return (
    <section className="gs-panel">
      <h2 className="gs-panel-title">Payment</h2>
      <div className="gs-fulfill-options">
        <button className={`gs-fulfill-card ${payment === "checkout" ? "active" : ""}`} onClick={() => setPayment("checkout")}>
          <CreditCard size={20} />
          <span className="gs-fulfill-name">Pay during checkout</span>
          <span className="gs-fulfill-desc">Pay online now for {money(total)}.</span>
        </button>
        <button
          className={`gs-fulfill-card ${payment === "pickup" ? "active" : ""}`}
          onClick={() => fulfillment === "pickup" && setPayment("pickup")}
          disabled={fulfillment !== "pickup"}
        >
          <Wallet size={20} />
          <span className="gs-fulfill-name">Pay at pickup</span>
          <span className="gs-fulfill-desc">
            {fulfillment === "pickup" ? `Bring ${money(total)} when you pick up.` : "Only available with pickup orders."}
          </span>
        </button>
      </div>
      {errors.payment && <p className="gs-error">{errors.payment}</p>}

      {payment === "checkout" && (
        <p className="gs-note">
          You'll enter your card details securely on Stripe's checkout page after you confirm your order below — we never see or store your card number.
        </p>
      )}
    </section>
  );
}

function ConfirmStep({ cartItems, addBag, bagFee, subtotal, total, fulfillment, payment, contact }) {
  return (
    <section className="gs-panel">
      <h2 className="gs-panel-title">Review and confirm</h2>

      <div className="gs-summary-block">
        <p className="gs-summary-label">Items</p>
        {cartItems.map((item) => (
          <div className="gs-row" key={item.id}>
            <span>
              {item.qty} × {item.name}
            </span>
            <span>{money(item.qty * item.price)}</span>
          </div>
        ))}
        {addBag && (
          <div className="gs-row">
            <span>Bag fee</span>
            <span>{money(bagFee)}</span>
          </div>
        )}
      </div>

      <div className="gs-summary-block">
        <div className="gs-row">
          <span>Fulfillment</span>
          <span>{fulfillment === "pickup" ? "Pickup" : "Maryland delivery"}</span>
        </div>
        <div className="gs-row">
          <span>Payment</span>
          <span>{payment === "checkout" ? "Paid at checkout" : "Pay at pickup"}</span>
        </div>
        <div className="gs-row">
          <span>Contact</span>
          <span>{contact.name} · {contact.phone}</span>
        </div>
      </div>

      <div className="gs-totals">
        <div className="gs-row">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        {addBag && (
          <div className="gs-row">
            <span>Bag fee</span>
            <span>{money(bagFee)}</span>
          </div>
        )}
        <div className="gs-row gs-row-total">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>
      <p className="gs-note">
        {payment === "checkout"
          ? "By confirming, you'll be taken to Stripe's secure checkout page to complete payment."
          : "By confirming, your order is officially submitted."}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------
   Confirmation
------------------------------------------------------------------ */
function ConfirmationPage({ order, onNewOrder }) {
  return (
    <main className="gs-confirm">
      <div className="gs-confirm-inner">
        <span className="gs-confirm-check">
          <Check size={26} />
        </span>
        <p className="gs-eyebrow">Order confirmed</p>
        <h1 className="gs-section-title">Thank you, {order.contact.name.split(" ")[0] || "friend"}.</h1>
        <p className="gs-shop-sub">Order {order.number}</p>

        <div className="gs-summary-block wide">
          <p className="gs-summary-label">Items</p>
          {order.items.map((item) => (
            <div className="gs-row" key={item.id}>
              <span>{item.qty} × {item.name}</span>
              <span>{money(item.qty * item.price)}</span>
            </div>
          ))}
          {order.bagFee > 0 && (
            <div className="gs-row">
              <span>Bag fee</span>
              <span>{money(order.bagFee)}</span>
            </div>
          )}
          <div className="gs-row gs-row-total">
            <span>Total</span>
            <span>{money(order.total)}</span>
          </div>
        </div>

        {order.fulfillment === "pickup" ? (
          <div className="gs-pickup-box">
            <p className="gs-summary-label">Pickup details</p>
            <p className="gs-pickup-address">{CONFIG.pickup.address}</p>
            <p className="gs-pickup-instructions">{CONFIG.pickup.instructions}</p>
            <p className="gs-note">
              {order.payment === "pickup" ? `Please bring ${money(order.total)} at pickup.` : "Your payment has been received."}
            </p>
          </div>
        ) : (
          <div className="gs-pickup-box">
            <p className="gs-summary-label">Delivery details</p>
            <p className="gs-pickup-instructions">{CONFIG.delivery.note}</p>
            <p className="gs-note">I'll reach out at {order.contact.email || order.contact.phone} to sort out timing.</p>
          </div>
        )}

        <button className="gs-btn-secondary" onClick={onNewOrder}>
          Start a new order
        </button>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------
   Global styles
------------------------------------------------------------------ */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap');

      .gs-root {
        --cream: #FBF7F0;
        --paper: #FFFFFF;
        --beige: #E4D2B2;
        --beige-soft: #F1E5CC;
        --gold-light: #F3E3BD;
        --rust: #B8552E;
        --rust-dark: #97431F;
        --brown: #382B21;
        --brown-soft: #6F5F4F;
        --line: #E6DCC7;

        font-family: 'Inter', sans-serif;
        color: var(--brown);
        background: var(--cream);
        min-height: 100%;
        display: flex;
        flex-direction: column;
      }
      .gs-root * { box-sizing: border-box; }
      .gs-root button { font-family: inherit; cursor: pointer; }
      .gs-root input { font-family: inherit; }

      .wordmark-arc {
        font-family: 'Fraunces', serif;
        font-weight: 700;
        font-size: 17.5px;
        letter-spacing: 1px;
        fill: var(--rust);
      }

      .gs-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 28px; border-bottom: 1px solid var(--line);
        background: var(--cream); position: sticky; top: 0; z-index: 20;
      }
      .gs-logo-link { display: flex; align-items: center; gap: 10px; background: none; border: none; padding: 0; }
      .gs-logo-mark { display: flex; width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
      .gs-logo-mark img { width: 100%; height: 100%; object-fit: cover; }
      .gs-logo-text { font-family: 'Fraunces', serif; font-weight: 600; font-size: 18px; color: var(--brown); }
      .gs-nav { display: flex; align-items: center; gap: 20px; }
      .gs-nav-link { background: none; border: none; font-size: 14px; letter-spacing: 0.4px; color: var(--brown-soft); padding: 6px 2px; border-bottom: 2px solid transparent; }
      .gs-nav-link.active { color: var(--rust); border-color: var(--rust); }
      .gs-cart-btn { position: relative; background: none; border: none; color: var(--brown); display: flex; align-items: center; padding: 4px; }
      .gs-cart-count { position: absolute; top: -4px; right: -6px; background: var(--rust); color: #fff; font-size: 10px; min-width: 16px; height: 16px; border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 0 3px; }

      .gs-footer { text-align: center; padding: 28px 16px 32px; font-size: 12px; color: var(--brown-soft); letter-spacing: 0.3px; }

      .gs-eyebrow { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--rust); margin: 18px 0 6px; }

      /* Home */
      .gs-home { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 20px 60px; }
      .gs-home-inner { max-width: 480px; text-align: center; display: flex; flex-direction: column; align-items: center; }
      .gs-home-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 34px; line-height: 1.2; margin: 6px 0 16px; }
      .gs-home-copy { font-size: 15px; line-height: 1.65; color: var(--brown-soft); margin: 0 0 26px; }

      .gs-btn-primary { background: var(--rust); color: #fff; border: none; padding: 13px 26px; border-radius: 4px; font-size: 14px; font-weight: 600; letter-spacing: 0.3px; transition: background 0.15s ease; }
      .gs-btn-primary:hover { background: var(--rust-dark); }
      .gs-btn-primary.full { width: 100%; }
      .gs-btn-secondary { background: transparent; color: var(--brown); border: 1px solid var(--line); padding: 11px 20px; border-radius: 4px; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: border-color 0.15s ease, background 0.15s ease; }
      .gs-btn-secondary:hover { border-color: var(--rust); background: var(--beige-soft); }
      .gs-btn-secondary:disabled { opacity: 0.45; cursor: not-allowed; }

      /* Shop */
      .gs-shop { flex: 1; max-width: 1040px; margin: 0 auto; padding: 30px 24px 60px; width: 100%; }
      .gs-shop-head { text-align: center; margin-bottom: 34px; }
      .gs-section-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 30px; margin: 0 0 6px; }
      .gs-shop-sub { color: var(--brown-soft); font-size: 14px; margin: 0; }

      .gs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 22px; }
      .gs-card { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 22px; display: flex; flex-direction: column; }
      .gs-card-photo { width: 100%; aspect-ratio: 1 / 1; margin: 0 0 14px; border-radius: 8px; overflow: hidden; background: var(--beige-soft); }
      .gs-card-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .gs-card-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 17px; margin: 0 0 6px; text-align: center; }
      .gs-card-blurb { font-size: 13px; color: var(--brown-soft); line-height: 1.5; text-align: center; margin: 0 0 16px; flex: 1; }
      .gs-card-foot { text-align: center; margin-bottom: 14px; }
      .gs-card-price { font-family: 'Fraunces', serif; font-weight: 600; font-size: 18px; color: var(--rust); }
      .gs-card-unit { font-family: 'Inter', sans-serif; font-weight: 400; font-size: 12px; color: var(--brown-soft); }
      .gs-card-actions { display: flex; gap: 10px; align-items: center; }
      .gs-add-btn { flex: 1; text-align: center; justify-content: center; }
      .gs-in-cart { text-align: center; font-size: 12px; color: var(--rust); margin: 10px 0 0; }

      .gs-stepper { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 4px; overflow: hidden; }
      .gs-stepper button { background: var(--beige-soft); border: none; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: var(--brown); }
      .gs-stepper span { width: 28px; text-align: center; font-size: 13px; font-weight: 500; }
      .gs-stepper.small button { width: 24px; height: 24px; }
      .gs-stepper.small span { width: 22px; font-size: 12px; }

      /* Cart drawer */
      .gs-drawer-overlay { position: fixed; inset: 0; background: rgba(56, 43, 33, 0.35); z-index: 40; display: flex; justify-content: flex-end; }
      .gs-drawer { width: 380px; max-width: 92vw; background: var(--paper); height: 100%; display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,0.08); }
      .gs-drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; border-bottom: 1px solid var(--line); }
      .gs-drawer-head h2 { font-family: 'Fraunces', serif; font-size: 19px; margin: 0; }
      .gs-icon-btn { background: none; border: none; color: var(--brown); padding: 4px; }
      .gs-drawer-items { flex: 1; overflow-y: auto; padding: 10px 22px; }
      .gs-drawer-item { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--line); align-items: center; }
      .gs-drawer-item-icon { width: 50px; height: 50px; flex-shrink: 0; border-radius: 6px; overflow: hidden; background: var(--beige-soft); }
      .gs-drawer-item-icon img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .gs-drawer-item-info { flex: 1; }
      .gs-drawer-item-name { font-size: 13.5px; font-weight: 600; margin: 0 0 2px; }
      .gs-drawer-item-price { font-size: 12px; color: var(--brown-soft); margin: 0 0 6px; }
      .gs-drawer-item-total { font-size: 13.5px; font-weight: 600; white-space: nowrap; }
      .gs-drawer-foot { padding: 18px 22px 22px; border-top: 1px solid var(--line); }
      .gs-drawer-note { font-size: 12px; color: var(--brown-soft); margin: 6px 0 14px; }

      .gs-empty { text-align: center; padding: 60px 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }

      /* Checkout */
      .gs-checkout { flex: 1; max-width: 640px; margin: 0 auto; padding: 30px 22px 60px; width: 100%; }
      .gs-stepbar { display: flex; align-items: center; margin-bottom: 30px; }
      .gs-step { display: flex; align-items: center; flex: 1; }
      .gs-step:last-child { flex: 0; }
      .gs-step-dot { width: 22px; height: 22px; border-radius: 50%; background: var(--beige-soft); color: var(--brown-soft); font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .gs-step.active .gs-step-dot { background: var(--rust); color: #fff; }
      .gs-step.done .gs-step-dot { background: var(--brown-soft); color: #fff; }
      .gs-step-label { font-size: 11px; margin-left: 6px; color: var(--brown-soft); white-space: nowrap; display: none; }
      .gs-step.active .gs-step-label { color: var(--brown); font-weight: 600; }
      .gs-step-line { flex: 1; height: 1px; background: var(--line); margin: 0 8px; }

      .gs-panel { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 26px; }
      .gs-panel-title { font-family: 'Fraunces', serif; font-size: 21px; font-weight: 600; margin: 0 0 20px; }

      .gs-review-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 18px; }
      .gs-review-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--line); }
      .gs-review-icon { width: 46px; height: 46px; flex-shrink: 0; border-radius: 6px; overflow: hidden; background: var(--beige-soft); }
      .gs-review-icon img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .gs-review-info { flex: 1; }
      .gs-review-name { font-size: 13.5px; font-weight: 600; margin: 0; }
      .gs-review-price { font-size: 12px; color: var(--brown-soft); margin: 2px 0 0; }
      .gs-review-total { font-size: 13.5px; font-weight: 600; min-width: 56px; text-align: right; }

      .gs-bag-option { display: flex; align-items: center; gap: 10px; font-size: 14px; padding: 14px 0; border-bottom: 1px solid var(--line); margin-bottom: 16px; }
      .gs-bag-option em { font-style: normal; color: var(--brown-soft); }
      .gs-bag-option input { width: 16px; height: 16px; accent-color: var(--rust); }

      .gs-totals { display: flex; flex-direction: column; gap: 8px; }
      .gs-row { display: flex; justify-content: space-between; font-size: 14px; }
      .gs-row-total { font-weight: 700; font-size: 16px; border-top: 1px solid var(--line); padding-top: 10px; margin-top: 4px; }

      .gs-fulfill-options { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
      .gs-fulfill-card { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; text-align: left; background: var(--cream); border: 1.5px solid var(--line); border-radius: 8px; padding: 16px; color: var(--brown); }
      .gs-fulfill-card.active { border-color: var(--rust); background: var(--beige-soft); }
      .gs-fulfill-card:disabled { opacity: 0.45; cursor: not-allowed; }
      .gs-fulfill-name { font-weight: 600; font-size: 14px; }
      .gs-fulfill-desc { font-size: 12px; color: var(--brown-soft); line-height: 1.4; }

      .gs-location-check { background: var(--cream); border: 1px solid var(--line); border-radius: 8px; padding: 16px; margin-bottom: 12px; }
      .gs-location-label { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; margin: 0 0 10px; }
      .gs-location-row { display: flex; gap: 8px; }
      .gs-location-row input { flex: 1; }
      .gs-location-ok { font-size: 12.5px; color: #4C6B3E; margin: 10px 0 0; }
      .gs-location-bad { font-size: 12.5px; color: var(--rust-dark); margin: 10px 0 0; line-height: 1.5; }

      .gs-form { display: flex; flex-direction: column; gap: 16px; }
      .gs-form label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; }
      .gs-form input, .gs-location-row input, .gs-drawer input[type=text] { border: 1px solid var(--line); border-radius: 4px; padding: 10px 12px; font-size: 14px; color: var(--brown); background: var(--cream); }
      .gs-form input:focus, .gs-location-row input:focus { outline: none; border-color: var(--rust); }
      .gs-card-form { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--line); }
      .gs-card-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

      .gs-summary-block { padding: 16px 0; border-bottom: 1px solid var(--line); display: flex; flex-direction: column; gap: 8px; }
      .gs-summary-label { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--brown-soft); margin: 0 0 4px; }

      .gs-note { font-size: 12.5px; color: var(--brown-soft); line-height: 1.5; margin: 14px 0 0; }
      .gs-error { font-size: 12px; color: var(--rust-dark); font-weight: 500; margin-top: 4px; }

      .gs-checkout-nav { display: flex; justify-content: space-between; margin-top: 22px; }
      .gs-checkout-banner { background: var(--beige-soft); border: 1px solid var(--beige); border-radius: 8px; padding: 12px 16px; font-size: 13px; margin-bottom: 18px; }
      .gs-btn-primary:disabled, .gs-btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

      /* Confirmation */
      .gs-confirm { flex: 1; display: flex; justify-content: center; padding: 40px 20px 60px; }
      .gs-confirm-inner { max-width: 480px; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; }
      .gs-confirm-check { width: 48px; height: 48px; border-radius: 50%; background: var(--rust); color: #fff; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
      .gs-summary-block.wide { width: 100%; text-align: left; }
      .gs-pickup-box { width: 100%; text-align: left; background: var(--beige-soft); border: 1px solid var(--beige); border-radius: 8px; padding: 18px; margin: 18px 0 24px; }
      .gs-pickup-address { font-family: 'Fraunces', serif; font-weight: 600; font-size: 15px; margin: 0 0 8px; }
      .gs-pickup-instructions { font-size: 13px; color: var(--brown-soft); line-height: 1.55; margin: 0; }

      @media (min-width: 520px) {
        .gs-step-label { display: inline; }
      }
      @media (max-width: 520px) {
        .gs-header { padding: 14px 16px; }
        .gs-card-form-row { grid-template-columns: 1fr; }
      }
    `}</style>
  );
}
