## Stripe test okruženje (kartica 4242 4242 4242 4242)

Ovo je minimalna integracija za testiranje checkout-a za:
- pretplate (mesečni paketi) – naplata se usklađuje na početak meseca (`billing_cycle_anchor` prvi dan narednog meseca, bez proracije),
- jednokratne usluge – naplata odmah.

### Koraci
1) Instaliraj Stripe i server zavisnosti (u root-u projekta):
   ```bash
   npm install stripe express body-parser cors dotenv @stripe/stripe-js
   ```

2) Popuni `.env` (ili `.env.local`):
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   FRONTEND_URL=http://localhost:5173
   VITE_API_BASE_URL=http://localhost:4242
   ```
   > Koristi **test** ključeve. Webhook secret dobijaš kad dodaš endpoint u Stripe Dashboard-u (test mode).

3) Pokreni dev server za Stripe (računa se kao backend):
   ```bash
   node server/stripe-server.js
   ```
   Server sluša na `http://localhost:4242`. Checkout endpoint: `POST /api/stripe/create-checkout-session`.

4) Frontend helper (`src/lib/stripeCheckout.ts`):
   ```ts
   startStripeCheckout({
     mode: 'subscription',      // ili 'payment'
     priceId: 'price_xxx',      // kreiran u Stripe-u
     quantity: 1,
     customerEmail: 'test@example.com',
     anchorToMonthStart: true,  // za pretplate: prva naplata početkom sledećeg meseca
   });
   ```
   Ovo će pozvati backend endpoint i uraditi `redirectToCheckout`.

5) Test kartice (test mode):
   - 4242 4242 4242 4242, bilo koji CVC, važeći datum
   - 4000 0027 6000 3184 – test za zahtev 3DS

### Endpoints
- `POST /api/stripe/create-checkout-session`
  - body: `{ mode: 'payment'|'subscription', priceId, quantity?, customerEmail?, anchorToMonthStart? }`
  - vraća: `{ id: sessionId }`
  - subscription dodatak: ako je `anchorToMonthStart=true`, zakucava ciklus na 1. u mesecu (`proration_behavior: 'none'`).

- `POST /api/stripe/webhook`
  - koristi raw body za Stripe potpis.
  - rukuje `checkout.session.completed` (jednokratno) i `invoice.payment_succeeded` (pretplate) – dopiši DB logiku.

### Napomene
- Ne čuvaj Stripe secret u frontendu; samo publishable key ide u `VITE_`.
- Za prod: zameni test ključeve live varijantama i ažuriraj priceId-eve.
- Ako deployuješ na Hostinger ili bilo gde: backend mora imati pristup internetu i čuvati env varijable; front neka i dalje gađa `/api/stripe/...` (podesi proxy ili apsolutni URL).
