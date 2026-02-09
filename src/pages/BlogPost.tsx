import { useEffect, useState, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import OrderDialog from '@/components/OrderDialog';
import { BlogAsset, BlogPost as ApiBlogPost, getBlogPost } from '@/lib/api';
import { normalizeExternalImageUrl } from '@/lib/blog';
import heroImage from '@/assets/hero-zodiac.jpg';

const productData: Record<string, { titleSr: string; titleEn: string; priceCents: number }> = {
  'partner-description': { titleSr: 'Opis vašeg budućeg partnera', titleEn: 'Future Partner Description', priceCents: 600 },
  'partner-description-when': { titleSr: 'Opis vašeg budućeg partnera i gde ćete ga upoznati', titleEn: 'Future Partner + When You’ll Meet', priceCents: 800 },
  'report-natal': { titleSr: 'Analiza natalne karte', titleEn: 'Natal Chart Analysis', priceCents: 8000 },
  'report-yearly': { titleSr: 'Godišnji astro izveštaj', titleEn: 'Annual Astro Report', priceCents: 5000 },
  'report-solar': { titleSr: 'Solarni horoskop', titleEn: 'Solar Return Horoscope', priceCents: 6000 },
  'report-synastry': { titleSr: 'Uporedni horoskop i Sinastrija', titleEn: 'Relationship Horoscope & Synastry', priceCents: 8000 },
  'report-questions': { titleSr: 'Pojedinačna Astro pitanja', titleEn: 'Single Astro Questions', priceCents: 2000 },
  'report-love': { titleSr: 'Ljubavna analiza', titleEn: 'Love Analysis', priceCents: 1000 },
  'report-career': { titleSr: 'Finansijski izveštaj', titleEn: 'Financial Report', priceCents: 1200 },
  'consult-email': { titleSr: 'Astro-odgovor (24h)', titleEn: 'Astro Answer (24h)', priceCents: 10000 },
  'consult-vip': { titleSr: 'VIP odgovor (1h)', titleEn: 'VIP Answer (1h)', priceCents: 15000 },
  'consult-live': { titleSr: 'Poziv sa astrologom (15 min)', titleEn: 'Astrologer Call (15 min)', priceCents: 9900 },
};

interface BlogPostData {
  id: string;
  titleSr: string;
  titleEn: string;
  excerptSr: string;
  excerptEn: string;
  contentSr: string;
  contentEn: string;
  date: string;
  image: string;
  productId?: string;
}

const blogPosts: BlogPostData[] = [
  {
    id: '1',
    titleSr: 'Kako čitati svoju natalnu kartu',
    titleEn: 'How to Read Your Natal Chart',
    excerptSr: 'Natalna karta je snimak neba u trenutku vašeg rođenja. Otkrijte šta planete govore o vama...',
    excerptEn: 'A natal chart is a snapshot of the sky at the moment of your birth. Discover what the planets say about you...',
    contentSr: `Natalna karta, poznata i kao horoskopska karta, predstavlja snimak neba u tačnom trenutku vašeg rođenja. Ova drevna praksa omogućava nam da razumemo kosmičke uticaje koji oblikuju našu ličnost, talente i životni put.

## Šta je natalna karta?

Natalna karta je dijagram koji prikazuje položaj Sunca, Meseca i planeta u trenutku vašeg rođenja. Svaki element ima svoje značenje i uticaj na različite aspekte vašeg života.

## Ključni elementi

**Sunčev znak** - Predstavlja vašu suštinu, ego i životnu energiju. To je znak koji većina ljudi zna kao svoj "horoskopski znak".

**Mesečev znak** - Otkriva vaše emocije, intuiciju i unutrašnji svet. Mesec upravlja našim instinktima i potrebama.

**Ascendent (Podznak)** - Pokazuje kako vas drugi vide i vaš pristup životu. To je znak koji je izlazio na istočnom horizontu u trenutku rođenja.

## Kuće u natalnoj karti

Natalna karta je podeljena na 12 kuća, svaka predstavlja različitu sferu života:
- 1. kuća: Identitet i fizički izgled
- 4. kuća: Dom i porodica
- 7. kuća: Partnerstva i brak
- 10. kuća: Karijera i javni imidž

## Kako početi?

Prvi korak je da prikupite tačne podatke o svom rođenju: datum, vreme i mesto. Što su podaci precizniji, to će vaša natalna karta biti tačnija.

Naši personalizovani izveštaji pružaju dubinsku analizu vaše natalne karte, pomažući vam da razumete sebe na potpuno nov način.`,
    contentEn: `A natal chart, also known as a birth chart, represents a snapshot of the sky at the exact moment of your birth. This ancient practice allows us to understand the cosmic influences that shape our personality, talents, and life path.

## What is a natal chart?

A natal chart is a diagram showing the position of the Sun, Moon, and planets at the time of your birth. Each element has its meaning and influence on different aspects of your life.

## Key Elements

**Sun Sign** - Represents your essence, ego, and life energy. This is the sign most people know as their "zodiac sign."

**Moon Sign** - Reveals your emotions, intuition, and inner world. The Moon governs our instincts and needs.

**Ascendant (Rising Sign)** - Shows how others see you and your approach to life. This is the sign that was rising on the eastern horizon at the time of birth.

## Houses in the natal chart

The natal chart is divided into 12 houses, each representing a different sphere of life:
- 1st house: Identity and physical appearance
- 4th house: Home and family
- 7th house: Partnerships and marriage
- 10th house: Career and public image

## How to start?

The first step is to gather accurate birth data: date, time, and place. The more precise the data, the more accurate your natal chart will be.

Our personalized reports provide in-depth analysis of your natal chart, helping you understand yourself in a completely new way.`,
    date: '2024-12-20',
    image: heroImage,
    productId: 'report-yearly',
  },
  {
    id: '2',
    titleSr: 'Mesečevi tranziti i njihov uticaj',
    titleEn: 'Moon Transits and Their Impact',
    excerptSr: 'Mesec putuje kroz sve znakove zodijaka u roku od mesec dana. Saznajte kako to utiče na vas...',
    excerptEn: 'The Moon travels through all zodiac signs within a month. Learn how this affects you...',
    contentSr: `Mesec je najbrža planeta u astrologiji, prolazeći kroz svih 12 znakova zodijaka za otprilike 28 dana. Ovaj brzi ciklus značajno utiče na naše svakodnevne emocije i energiju.

## Zašto su Mesečevi tranziti važni?

Mesec upravlja našim emocijama, intuicijom i podsvešću. Kada prelazi iz jednog znaka u drugi, menja se naše emocionalno stanje i način na koji reagujemo na svet oko nas.

## Mesec kroz znakove

**Mesec u vatrenim znakovima (Ovan, Lav, Strelac)** - Donosi energiju, entuzijazam i želju za akcijom.

**Mesec u zemljanim znakovima (Bik, Devica, Jarac)** - Pruža stabilnost, praktičnost i fokus na materijalne stvari.

**Mesec u vazdušnim znakovima (Blizanci, Vaga, Vodolija)** - Stimuliše komunikaciju, društvene aktivnosti i intelektualne poduhvate.

**Mesec u vodenim znakovima (Rak, Škorpija, Ribe)** - Pojačava emocionalnu osetljivost, intuiciju i potrebu za intimnošću.

## Kako pratiti Mesečeve tranzite?

Praćenje Mesečevih tranzita može vam pomoći da bolje planirate aktivnosti i razumete zašto se osećate na određeni način.

Naši mesečni paketi uključuju detaljne informacije o svim važnim tranzitima koji vas očekuju.`,
    contentEn: `The Moon is the fastest planet in astrology, passing through all 12 zodiac signs in approximately 28 days. This rapid cycle significantly affects our daily emotions and energy.

## Why are Moon transits important?

The Moon governs our emotions, intuition, and subconscious. When it moves from one sign to another, our emotional state and how we react to the world around us changes.

## Moon through the signs

**Moon in fire signs (Aries, Leo, Sagittarius)** - Brings energy, enthusiasm, and desire for action.

**Moon in earth signs (Taurus, Virgo, Capricorn)** - Provides stability, practicality, and focus on material things.

**Moon in air signs (Gemini, Libra, Aquarius)** - Stimulates communication, social activities, and intellectual endeavors.

**Moon in water signs (Cancer, Scorpio, Pisces)** - Enhances emotional sensitivity, intuition, and need for intimacy.

## How to track Moon transits?

Tracking Moon transits can help you better plan activities and understand why you feel a certain way.

Our monthly packages include detailed information about all the important transits that await you.`,
    date: '2024-12-18',
    image: heroImage,
  },
  {
    id: '3',
    titleSr: 'Rituali za pun Mesec',
    titleEn: 'Full Moon Rituals',
    excerptSr: 'Pun Mesec je vreme za otpuštanje i manifestaciju. Otkrijte moćne rituale za ovo posebno vreme...',
    excerptEn: 'Full Moon is a time for release and manifestation. Discover powerful rituals for this special time...',
    contentSr: `Pun Mesec je jedan od najmoćnijih trenutaka u lunarnom ciklusu. To je vreme kada je Mesečeva energija na vrhuncu, idealno za ritualne prakse i manifestaciju.

## Značaj punog Meseca

Pun Mesec simbolizuje kulminaciju, ispunjenje i oslobađanje. To je vreme za:
- Otpuštanje onoga što više ne služi
- Zahvalnost za postignuto
- Jasnoću i uvide
- Završetak ciklusa

## Rituali za pun Mesec

### Ritual otpuštanja

1. Napišite na papir ono čega želite da se oslobodite
2. Zapalite sveću i fokusirajte se na nameru
3. Spalite papir (na siguran način)
4. Meditirajte dok posmatrate kako dim nosi vaše brige

### Ritual manifestacije

1. Pripremite kristale (posebno mesečev kamen)
2. Napišite afirmacije i ciljeve
3. Postavite kristale pod mesečevu svetlost
4. Vizualizujte ostvarenje želja

## Kristali za pun Mesec

- Mesečev kamen - pojačava intuiciju
- Labradorit - pruža zaštitu
- Selenit - pročišćava energiju

Naš Talisman set sadrži sve što vam je potrebno za moćne ritualne prakse.`,
    contentEn: `The Full Moon is one of the most powerful moments in the lunar cycle. It is a time when the Moon's energy is at its peak, ideal for ritual practices and manifestation.

## The significance of the Full Moon

The Full Moon symbolizes culmination, fulfillment, and release. It is a time for:
- Releasing what no longer serves you
- Gratitude for achievements
- Clarity and insights
- Completing cycles

## Full Moon Rituals

### Release Ritual

1. Write down what you want to release on paper
2. Light a candle and focus on your intention
3. Burn the paper (safely)
4. Meditate while watching the smoke carry away your concerns

### Manifestation Ritual

1. Prepare crystals (especially moonstone)
2. Write affirmations and goals
3. Place crystals under moonlight
4. Visualize the fulfillment of your wishes

## Crystals for the Full Moon

- Moonstone - enhances intuition
- Labradorite - provides protection
- Selenite - purifies energy

Our Talisman set contains everything you need for powerful ritual practices.`,
    date: '2024-12-15',
    image: heroImage,
  },
  {
    id: '4',
    titleSr: 'Ljubavna kompatibilnost znakova',
    titleEn: 'Love Compatibility of Signs',
    excerptSr: 'Koji znakovi su idealni partneri? Otkrijte tajne astrološke kompatibilnosti u ljubavi...',
    excerptEn: 'Which signs make ideal partners? Discover the secrets of astrological love compatibility...',
    contentSr: `Astrološka kompatibilnost je fascinantna oblast koja nam pomaže da razumemo dinamiku između različitih zodijačkih znakova u ljubavnim odnosima.

## Elementi i kompatibilnost

Zodijački znakovi su podeljeni u četiri elementa, a znakovi istog ili kompatibilnog elementa obično imaju bolju hemiju.

**Vatreni znakovi (Ovan, Lav, Strelac)** - Strastveni, energični, spontani
- Najbolja kompatibilnost: Vatreni i vazdušni znakovi

**Zemljani znakovi (Bik, Devica, Jarac)** - Stabilni, pouzdani, praktični
- Najbolja kompatibilnost: Zemljani i vodeni znakovi

**Vazdušni znakovi (Blizanci, Vaga, Vodolija)** - Komunikativni, intelektualni, društveni
- Najbolja kompatibilnost: Vazdušni i vatreni znakovi

**Vodeni znakovi (Rak, Škorpija, Ribe)** - Emotivni, intuitivni, duboki
- Najbolja kompatibilnost: Vodeni i zemljani znakovi

## Više od Sunčevog znaka

Prava astrološka kompatibilnost uzima u obzir mnogo više od Sunčevog znaka:
- Mesečev znak (emocionalna kompatibilnost)
- Venera (stil ljubavi)
- Mars (strast i privlačnost)
- 7. kuća (partnerstvo)

Naša Ljubavna analiza pruža detaljan uvid u kompatibilnost između dva horoskopa.`,
    contentEn: `Astrological compatibility is a fascinating field that helps us understand the dynamics between different zodiac signs in love relationships.

## Elements and Compatibility

Zodiac signs are divided into four elements, and signs of the same or compatible element usually have better chemistry.

**Fire signs (Aries, Leo, Sagittarius)** - Passionate, energetic, spontaneous
- Best compatibility: Fire and air signs

**Earth signs (Taurus, Virgo, Capricorn)** - Stable, reliable, practical
- Best compatibility: Earth and water signs

**Air signs (Gemini, Libra, Aquarius)** - Communicative, intellectual, social
- Best compatibility: Air and fire signs

**Water signs (Cancer, Scorpio, Pisces)** - Emotional, intuitive, deep
- Best compatibility: Water and earth signs

## Beyond the Sun Sign

True astrological compatibility takes into account much more than the Sun sign:
- Moon sign (emotional compatibility)
- Venus (love style)
- Mars (passion and attraction)
- 7th house (partnership)

Our Love Analysis provides detailed insight into the compatibility between two horoscopes.`,
    date: '2024-12-10',
    image: heroImage,
    productId: 'report-love',
  },
];

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const { language, t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dynamicPost, setDynamicPost] = useState<ApiBlogPost | null>(null);
  const [dynamicLoading, setDynamicLoading] = useState(false);
  const [dynamicError, setDynamicError] = useState<string | null>(null);

  const staticPost = blogPosts.find((p) => p.id === postId);
  const shouldLoadDynamic = Boolean(postId && !staticPost);

  useEffect(() => {
    if (!shouldLoadDynamic || !postId) return;
    let active = true;
    setDynamicLoading(true);
    setDynamicError(null);
    getBlogPost(postId)
      .then(({ post }) => {
        if (!active) return;
        setDynamicPost(post);
      })
      .catch((error) => {
        console.error('Failed to load blog post:', error);
        if (!active) return;
        setDynamicError(language === 'sr'
          ? 'Objava nije pronađena.'
          : 'Post not found.');
      })
      .finally(() => {
        if (active) setDynamicLoading(false);
      });
    return () => {
      active = false;
    };
  }, [language, postId, shouldLoadDynamic]);

  const linkifyText = (text: string) => {
    const regex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const matchText = match[0];
      const start = match.index;
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }
      const href = matchText.startsWith('http') ? matchText : `https://${matchText}`;
      parts.push(
        <a
          key={`${matchText}-${start}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-4"
        >
          {matchText}
        </a>
      );
      lastIndex = start + matchText.length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  };

  const renderInlineContent = (text: string) => {
    const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/;
    const parts: ReactNode[] = [];
    let remaining = text;
    let index = 0;

    while (true) {
      const match = pattern.exec(remaining);
      if (!match) {
        parts.push(...linkifyText(remaining));
        break;
      }

      const [fullMatch, linkText, linkUrl, boldText, italicText] = match;
      const start = match.index;
      if (start > 0) {
        parts.push(...linkifyText(remaining.slice(0, start)));
      }

      if (linkText && linkUrl) {
        const href = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
        parts.push(
          <a
            key={`inline-link-${index}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-4"
          >
            {linkText}
          </a>
        );
      } else if (boldText) {
        parts.push(
          <strong key={`inline-bold-${index}`} className="text-foreground font-semibold">
            {boldText}
          </strong>
        );
      } else if (italicText) {
        parts.push(
          <em key={`inline-italic-${index}`} className="text-foreground/90 italic">
            {italicText}
          </em>
        );
      }

      remaining = remaining.slice(start + fullMatch.length);
      index += 1;
    }

    return parts;
  };

  const renderDynamicContent = (content: string, images: BlogAsset[]) => {
    const paragraphs = content.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
    const inlineImage = images[1];
    const inlineImageBlock = inlineImage ? (
      <img
        src={normalizeExternalImageUrl(inlineImage.url)}
        alt={inlineImage.name || 'Blog image'}
        className="w-full rounded-xl border border-border object-cover"
      />
    ) : null;

    if (!paragraphs.length) {
      return inlineImageBlock;
    }

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <div key={`${paragraph.slice(0, 12)}-${index}`} className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {renderInlineContent(paragraph)}
            </p>
            {index === 0 && inlineImageBlock}
          </div>
        ))}
      </div>
    );
  };

  if (dynamicLoading && !staticPost) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (!staticPost && !dynamicPost) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {dynamicError || (language === 'sr' ? 'Članak nije pronađen' : 'Article not found')}
          </h1>
          <Button asChild variant="cosmic">
            <Link to="/blog">{t('blog.back')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const title = staticPost
    ? (language === 'sr' ? staticPost.titleSr : staticPost.titleEn)
    : (dynamicPost?.title || '');
  const date = staticPost?.date || dynamicPost?.published_at || dynamicPost?.created_at || '';
  const heroImageUrl =
    normalizeExternalImageUrl(staticPost?.image || dynamicPost?.images?.[0]?.url || '') || heroImage;
  const staticContent = staticPost ? (language === 'sr' ? staticPost.contentSr : staticPost.contentEn) : '';
  const attachments = dynamicPost?.attachments || [];
  const productInfo = staticPost?.productId ? productData[staticPost.productId] : null;
  const productName = productInfo ? (language === 'sr' ? productInfo.titleSr : productInfo.titleEn) : '';
  const productPriceCents = productInfo?.priceCents || 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('blog.back')}
            </Link>
          </Button>

          <article>
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <img
                src={heroImageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <time dateTime={date}>
                {date ? new Date(date).toLocaleDateString(
                  language === 'sr' ? 'sr-RS' : 'en-US',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                ) : ''}
              </time>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              {title}
            </h1>

            {staticPost ? (
              <div className="prose prose-invert prose-purple max-w-none">
                {staticContent.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-foreground mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-foreground mt-6 mb-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('**') || paragraph.includes('\n**')) {
                    return (
                      <div key={index} className="text-muted-foreground mb-4">
                        {paragraph.split('\n').map((line, lineIndex) => {
                          const boldMatch = line.match(/^\*\*(.+?)\*\*\s*-?\s*(.*)$/);
                          if (boldMatch) {
                            return (
                              <p key={lineIndex} className="mb-2">
                                <strong className="text-foreground">{boldMatch[1]}</strong>
                                {boldMatch[2] && ` - ${boldMatch[2]}`}
                              </p>
                            );
                          }
                          if (line.startsWith('- ')) {
                            return (
                              <li key={lineIndex} className="ml-4 list-disc">
                                {line.replace('- ', '')}
                              </li>
                            );
                          }
                          return <p key={lineIndex}>{line}</p>;
                        })}
                      </div>
                    );
                  }
                  if (paragraph.startsWith('- ') || paragraph.includes('\n- ')) {
                    return (
                      <ul key={index} className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        {paragraph.split('\n').map((line, lineIndex) => (
                          <li key={lineIndex}>{line.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return (
                      <ol key={index} className="list-decimal list-inside text-muted-foreground mb-4 space-y-1">
                        {paragraph.split('\n').map((line, lineIndex) => (
                          <li key={lineIndex}>{line.replace(/^\d+\.\s*/, '')}</li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={index} className="text-muted-foreground mb-4">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {dynamicPost ? renderDynamicContent(dynamicPost.content || '', dynamicPost.images || []) : null}
              </div>
            )}

            {!staticPost && attachments.length > 0 && (
              <div className="mt-8 rounded-2xl border border-border bg-secondary/30 p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {language === 'sr' ? 'Preuzmi priloge' : 'Download attachments'}
                </h3>
                <div className="space-y-2">
                  {attachments.map((file) => (
                    <a
                      key={file.url}
                      href={file.url}
                      className="block text-sm text-primary underline underline-offset-4"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {file.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {staticPost?.productId && (
              <div className="mt-12 p-6 bg-secondary/30 rounded-2xl border border-border text-center">
                <p className="text-foreground mb-4">
                  {language === 'sr'
                    ? 'Želite da saznate više? Naručite personalizovani izveštaj!'
                    : 'Want to learn more? Order a personalized report!'}
                </p>
                <Button variant="cosmic" onClick={() => setIsDialogOpen(true)}>
                  {t('products.order')}
                </Button>
              </div>
            )}
          </article>

          {staticPost?.productId && (
            <OrderDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              productId={staticPost.productId}
              productName={productName}
              priceCents={productPriceCents}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
