import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Da li odgovore daje veštačka inteligencija ili astrolog?",
    a: "Analizu radi tim astrologa; AI pomaže u komunikaciji, ne u tumačenju natalne karte."
  },
  {
    q: "Šta dobijam uz pretplatu?",
    a: "Personalizovane astro izveštaje, konkretne savete i pristup dodatnim ponudama."
  },
  {
    q: "Mogu li da se odjavim kad god poželim?",
    a: "Da, otkazujete u jednom kliku iz profila i nova naplata se ne vrši."
  },
  {
    q: "Da li je plaćanje sigurno?",
    a: "Trenutno je naplata privremeno isključena dok ne završimo tehničku migraciju."
  },
  {
    q: "Postoje li direktne konsultacije sa astrologom?",
    a: "Da, možete zakazati 1‑na‑1 konsultaciju ili VIP odgovor u roku od 1 sata."
  },
  {
    q: "Koliko dugo čekam na prvi izveštaj?",
    a: "U proseku 24–48h nakon unosa podataka i potvrde porudžbine."
  },
  {
    q: "Koje podatke moram da unesem?",
    a: "Datum, vreme i mesto rođenja; precizniji podaci znače tačniji izveštaj."
  },
  {
    q: "Mogu li da menjam jezik interfejsa i izveštaja?",
    a: "Interfejs menjate u meniju jezika; izveštaje po zahtevu šaljemo na podržanim jezicima."
  },
  {
    q: "Kako dobijam izveštaje?",
    a: "Sva obaveštenja, izveštaji i linkovi stižu na e‑mail (čuvamo ih i u profilu)."
  },
  {
    q: "Šta ako nisam zadovoljan izveštajem?",
    a: "Javite se u roku od 7 dana; nudimo korekcije ili povraćaj po politici zadovoljstva."
  },
  {
    q: "Da li nudite tematske analize (ljubav, karijera, finansije)?",
    a: "Da, možete poručiti specifične ljubavne, karijerne, finansijske ili godišnje izveštaje."
  },
  {
    q: "Da li postoje dodatne premium ponude?",
    a: "Da, povremeno otključavamo ekskluzivne ponude i popuste za pretplatnike (obaveštenja stižu e‑mailom)."
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-primary/80 mb-3">FAQ</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient">Najčešća pitanja</h1>
          <p className="text-muted-foreground mt-3">
            Kliknite na pitanje da vidite odgovor. Tu smo da vam olakšamo svaku nedoumicu.
          </p>
        </div>

        <Accordion type="single" collapsible className="bg-card/60 border border-border rounded-2xl shadow-xl divide-y divide-border">
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="px-4">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold py-4">
                {idx + 1}. {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
