import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBlogPosts, BlogPost as ApiBlogPost } from '@/lib/api';
import heroImage from '@/assets/hero-zodiac.jpg';

interface BlogPost {
  id: string;
  titleSr: string;
  titleEn: string;
  excerptSr: string;
  excerptEn: string;
  date: string;
  image: string;
  productId?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    titleSr: 'Kako čitati svoju natalnu kartu',
    titleEn: 'How to Read Your Natal Chart',
    excerptSr: 'Natalna karta je snimak neba u trenutku vašeg rođenja. Otkrijte šta planete govore o vama...',
    excerptEn: 'A natal chart is a snapshot of the sky at the moment of your birth. Discover what the planets say about you...',
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
    date: '2024-12-18',
    image: heroImage,
    productId: 'monthly-basic',
  },
  {
    id: '3',
    titleSr: 'Rituali za pun Mesec',
    titleEn: 'Full Moon Rituals',
    excerptSr: 'Pun Mesec je vreme za otpuštanje i manifestaciju. Otkrijte moćne rituale za ovo posebno vreme...',
    excerptEn: 'Full Moon is a time for release and manifestation. Discover powerful rituals for this special time...',
    date: '2024-12-15',
    image: heroImage,
  },
  {
    id: '4',
    titleSr: 'Ljubavna kompatibilnost znakova',
    titleEn: 'Love Compatibility of Signs',
    excerptSr: 'Koji znakovi su idealni partneri? Otkrijte tajne astrološke kompatibilnosti u ljubavi...',
    excerptEn: 'Which signs make ideal partners? Discover the secrets of astrological love compatibility...',
    date: '2024-12-10',
    image: heroImage,
    productId: 'report-love',
  },
];

const Blog = () => {
  const { language, t } = useLanguage();
  const [dynamicPosts, setDynamicPosts] = useState<ApiBlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getBlogPosts()
      .then(({ posts }) => {
        if (!active) return;
        setDynamicPosts(posts || []);
      })
      .catch((error) => {
        console.error('Failed to load blog posts:', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const combinedPosts = useMemo(() => {
    const normalizedDynamic = dynamicPosts.map((post) => ({
      id: `dynamic-${post.id}`,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.published_at || post.created_at,
      image: post.images?.[0]?.url || heroImage,
    }));

    const normalizedStatic = blogPosts.map((post) => ({
      id: post.id,
      slug: post.id,
      title: language === 'sr' ? post.titleSr : post.titleEn,
      excerpt: language === 'sr' ? post.excerptSr : post.excerptEn,
      date: post.date,
      image: post.image,
    }));

    return [...normalizedDynamic, ...normalizedStatic].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return bTime - aTime;
    });
  }, [dynamicPosts, language]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t('blog.title')}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'sr' 
              ? 'Otkrijte tajne zvijezda kroz naše članke o astrologiji, tranzitima i ritualima'
              : 'Discover the secrets of the stars through our articles on astrology, transits, and rituals'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {loading && combinedPosts.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
            </div>
          ) : combinedPosts.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              {language === 'sr' ? 'Nema objava.' : 'No posts yet.'}
            </div>
          ) : combinedPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover-glow cosmic-border"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                
              <Button asChild variant="cosmic" size="sm">
                <Link to={`/blog/${post.slug}`}>
                  {t('blog.readMore')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
