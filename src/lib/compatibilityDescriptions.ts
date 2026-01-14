// Compatibility descriptions for each zodiac sign combination
// Each combination has descriptions for different compatibility levels

type CompatibilityLevel = 'high' | 'medium' | 'low';

interface DescriptionSet {
  sr: string;
  en: string;
  fr: string;
  de: string;
  es: string;
  ru: string;
}

type SignPairDescriptions = {
  [level in CompatibilityLevel]: DescriptionSet;
};

// Helper to get the correct key for a sign pair (alphabetically sorted)
export const getSignPairKey = (sign1: string, sign2: string): string => {
  const sorted = [sign1, sign2].sort();
  return `${sorted[0]}-${sorted[1]}`;
};

// Get compatibility level based on percentage
export const getCompatibilityLevel = (percentage: number): CompatibilityLevel => {
  if (percentage >= 80) return 'high';
  if (percentage >= 60) return 'medium';
  return 'low';
};

// Descriptions for all sign combinations
const compatibilityDescriptions: { [key: string]: SignPairDescriptions } = {
  // Fire + Fire combinations
  'aries-aries': {
    high: {
      sr: 'Dva Ovna zajedno stvaraju eksplozivnu kombinaciju strasti i energije! Vaš odnos je uzbudljiv i dinamičan.',
      en: 'Two Aries together create an explosive combination of passion and energy! Your relationship is exciting and dynamic.',
      fr: 'Deux Béliers ensemble créent une combinaison explosive de passion et d\'énergie!',
      de: 'Zwei Widder zusammen schaffen eine explosive Kombination aus Leidenschaft und Energie!',
      es: '¡Dos Aries juntos crean una combinación explosiva de pasión y energía!',
      ru: 'Два Овна вместе создают взрывную комбинацию страсти и энергии!'
    },
    medium: {
      sr: 'Dva Ovna imaju vatrenu hemiju, ali morate naučiti kompromis. Radite na strpljenju i slušanju jedno drugog.',
      en: 'Two Aries have fiery chemistry, but you need to learn compromise. Work on patience and listening to each other.',
      fr: 'Deux Béliers ont une chimie ardente, mais vous devez apprendre le compromis.',
      de: 'Zwei Widder haben feurige Chemie, aber Sie müssen Kompromisse lernen.',
      es: 'Dos Aries tienen química ardiente, pero necesitan aprender a comprometerse.',
      ru: 'У двух Овнов огненная химия, но вам нужно научиться идти на компромисс.'
    },
    low: {
      sr: 'Dva Ovna mogu biti previše slični - potrebno je raditi na komunikaciji i izbegavati konflikte.',
      en: 'Two Aries can be too similar - work on communication and avoiding conflicts.',
      fr: 'Deux Béliers peuvent être trop similaires - travaillez sur la communication.',
      de: 'Zwei Widder können zu ähnlich sein - arbeiten Sie an der Kommunikation.',
      es: 'Dos Aries pueden ser demasiado similares - trabajen en la comunicación.',
      ru: 'Два Овна могут быть слишком похожи - работайте над общением.'
    }
  },
  'aries-leo': {
    high: {
      sr: 'Ovan i Lav su vatrena kombinacija koja odiše strašću i uzbuđenjem! Zajedno osvajate svet.',
      en: 'Aries and Leo are a fiery combination radiating passion and excitement! Together you conquer the world.',
      fr: 'Bélier et Lion sont une combinaison ardente rayonnant de passion!',
      de: 'Widder und Löwe sind eine feurige Kombination voller Leidenschaft!',
      es: '¡Aries y Leo son una combinación ardiente que irradia pasión!',
      ru: 'Овен и Лев - огненная комбинация, излучающая страсть!'
    },
    medium: {
      sr: 'Vatreni Ovan i Lav imaju sjajnu hemiju, ali ego može biti prepreka. Slavite uspehe zajedno.',
      en: 'Fiery Aries and Leo have great chemistry, but ego can be an obstacle. Celebrate successes together.',
      fr: 'Bélier et Lion ardents ont une grande chimie, mais l\'ego peut être un obstacle.',
      de: 'Feuriger Widder und Löwe haben tolle Chemie, aber das Ego kann ein Hindernis sein.',
      es: 'Aries y Leo ardientes tienen gran química, pero el ego puede ser un obstáculo.',
      ru: 'У огненных Овна и Льва отличная химия, но эго может быть препятствием.'
    },
    low: {
      sr: 'Ovan i Lav moraju naučiti da dele reflektore. Fokusirajte se na zajedničke ciljeve umesto takmičenja.',
      en: 'Aries and Leo need to learn to share the spotlight. Focus on common goals instead of competition.',
      fr: 'Bélier et Lion doivent apprendre à partager les projecteurs.',
      de: 'Widder und Löwe müssen lernen, das Rampenlicht zu teilen.',
      es: 'Aries y Leo deben aprender a compartir el centro de atención.',
      ru: 'Овен и Лев должны научиться делить внимание.'
    }
  },
  'aries-sagittarius': {
    high: {
      sr: 'Ovan i Strelac su neodoljiva vatrena kombinacija! Zajedno idete u avanture i nikada vam nije dosadno.',
      en: 'Aries and Sagittarius are an irresistible fire combination! Together you go on adventures and never get bored.',
      fr: 'Bélier et Sagittaire sont une combinaison de feu irrésistible!',
      de: 'Widder und Schütze sind eine unwiderstehliche Feuerkombination!',
      es: '¡Aries y Sagitario son una combinación de fuego irresistible!',
      ru: 'Овен и Стрелец - неотразимая огненная комбинация!'
    },
    medium: {
      sr: 'Avanturistički duh vas spaja, ali morate raditi na stabilnosti. Pronađite balans između slobode i posvećenosti.',
      en: 'Adventurous spirit connects you, but you need to work on stability. Find balance between freedom and commitment.',
      fr: 'L\'esprit aventurier vous connecte, mais travaillez sur la stabilité.',
      de: 'Abenteuerlust verbindet Sie, aber arbeiten Sie an Stabilität.',
      es: 'El espíritu aventurero los conecta, pero trabajen en la estabilidad.',
      ru: 'Дух приключений вас связывает, но работайте над стабильностью.'
    },
    low: {
      sr: 'Oboje volite slobodu, što može dovesti do nedostatka strukture. Postavite jasne granice i očekivanja.',
      en: 'You both love freedom, which can lead to lack of structure. Set clear boundaries and expectations.',
      fr: 'Vous aimez tous les deux la liberté, ce qui peut mener au manque de structure.',
      de: 'Sie beide lieben Freiheit, was zu mangelnder Struktur führen kann.',
      es: 'Ambos aman la libertad, lo que puede llevar a falta de estructura.',
      ru: 'Вы оба любите свободу, что может привести к отсутствию структуры.'
    }
  },
  'leo-leo': {
    high: {
      sr: 'Dva Lava zajedno stvaraju kraljevski par! Vaša veza je puna glamura, strasti i uzajamnog divljenja.',
      en: 'Two Leos together create a royal couple! Your relationship is full of glamour, passion and mutual admiration.',
      fr: 'Deux Lions ensemble créent un couple royal!',
      de: 'Zwei Löwen zusammen bilden ein königliches Paar!',
      es: '¡Dos Leo juntos crean una pareja real!',
      ru: 'Два Льва вместе создают королевскую пару!'
    },
    medium: {
      sr: 'Dva Lava imaju sjajnu hemiju, ali morate naučiti da delite pažnju. Slavite jedno drugo.',
      en: 'Two Leos have great chemistry, but you need to learn to share attention. Celebrate each other.',
      fr: 'Deux Lions ont une grande chimie, mais apprenez à partager l\'attention.',
      de: 'Zwei Löwen haben tolle Chemie, aber lernen Sie, Aufmerksamkeit zu teilen.',
      es: 'Dos Leo tienen gran química, pero aprendan a compartir la atención.',
      ru: 'У двух Львов отличная химия, но научитесь делить внимание.'
    },
    low: {
      sr: 'Dva Lava mogu se takmičiti za dominaciju. Radite na kompromisu i uzajamnom poštovanju.',
      en: 'Two Leos can compete for dominance. Work on compromise and mutual respect.',
      fr: 'Deux Lions peuvent rivaliser pour la domination. Travaillez sur le compromis.',
      de: 'Zwei Löwen können um Dominanz konkurrieren. Arbeiten Sie am Kompromiss.',
      es: 'Dos Leo pueden competir por la dominancia. Trabajen en el compromiso.',
      ru: 'Два Льва могут соперничать за доминирование. Работайте над компромиссом.'
    }
  },
  'leo-sagittarius': {
    high: {
      sr: 'Lav i Strelac su blistava vatrena kombinacija! Zajedno ste život zabave i inspiracije.',
      en: 'Leo and Sagittarius are a brilliant fire combination! Together you are the life of the party and inspiration.',
      fr: 'Lion et Sagittaire sont une brillante combinaison de feu!',
      de: 'Löwe und Schütze sind eine brillante Feuerkombination!',
      es: '¡Leo y Sagitario son una brillante combinación de fuego!',
      ru: 'Лев и Стрелец - блестящая огненная комбинация!'
    },
    medium: {
      sr: 'Vaša energija je zarazna, ali Lavu treba više pažnje nego što Strelac pruža. Komunicirajte potrebe.',
      en: 'Your energy is contagious, but Leo needs more attention than Sagittarius provides. Communicate needs.',
      fr: 'Votre énergie est contagieuse, mais Lion a besoin de plus d\'attention.',
      de: 'Ihre Energie ist ansteckend, aber Löwe braucht mehr Aufmerksamkeit.',
      es: 'Su energía es contagiosa, pero Leo necesita más atención.',
      ru: 'Ваша энергия заразительна, но Льву нужно больше внимания.'
    },
    low: {
      sr: 'Lav želi posvećenost, Strelac slobodu. Pronađite sredinu koja zadovoljava oboje.',
      en: 'Leo wants commitment, Sagittarius wants freedom. Find a middle ground that satisfies both.',
      fr: 'Lion veut l\'engagement, Sagittaire veut la liberté. Trouvez un terrain d\'entente.',
      de: 'Löwe will Engagement, Schütze will Freiheit. Finden Sie einen Mittelweg.',
      es: 'Leo quiere compromiso, Sagitario quiere libertad. Encuentren un punto medio.',
      ru: 'Лев хочет преданности, Стрелец - свободы. Найдите золотую середину.'
    }
  },
  'sagittarius-sagittarius': {
    high: {
      sr: 'Dva Strelca zajedno znači beskrajne avanture! Vaš odnos je pun smeha, putovanja i filozofskih razgovora.',
      en: 'Two Sagittarians together means endless adventures! Your relationship is full of laughter, travel and philosophical talks.',
      fr: 'Deux Sagittaires ensemble signifie des aventures sans fin!',
      de: 'Zwei Schützen zusammen bedeuten endlose Abenteuer!',
      es: '¡Dos Sagitario juntos significan aventuras sin fin!',
      ru: 'Два Стрельца вместе - это бесконечные приключения!'
    },
    medium: {
      sr: 'Slobodni duhovi koji se savršeno razumeju, ali nekad vam treba više uzemljenja. Gradite stabilnost zajedno.',
      en: 'Free spirits who understand each other perfectly, but sometimes you need more grounding. Build stability together.',
      fr: 'Esprits libres qui se comprennent parfaitement, mais vous avez besoin de plus d\'ancrage.',
      de: 'Freie Geister, die sich perfekt verstehen, aber manchmal brauchen Sie mehr Erdung.',
      es: 'Espíritus libres que se entienden perfectamente, pero necesitan más arraigo.',
      ru: 'Свободные духи, которые прекрасно понимают друг друга, но иногда нужно заземление.'
    },
    low: {
      sr: 'Oboje bežite od obaveza, što može značiti da veza nikad ne dobije dubinu. Suočite se sa emocijama.',
      en: 'You both avoid commitments, which can mean the relationship never gains depth. Face your emotions.',
      fr: 'Vous évitez tous les deux les engagements. Affrontez vos émotions.',
      de: 'Sie beide meiden Verpflichtungen. Stellen Sie sich Ihren Gefühlen.',
      es: 'Ambos evitan los compromisos. Enfrenten sus emociones.',
      ru: 'Вы оба избегаете обязательств. Столкнитесь со своими эмоциями.'
    }
  },

  // Earth + Earth combinations
  'taurus-taurus': {
    high: {
      sr: 'Dva Bika su stub stabilnosti! Vaš odnos je pun uživanja, lojalnosti i trajne ljubavi.',
      en: 'Two Taurus are a pillar of stability! Your relationship is full of enjoyment, loyalty and lasting love.',
      fr: 'Deux Taureaux sont un pilier de stabilité!',
      de: 'Zwei Stiere sind eine Säule der Stabilität!',
      es: '¡Dos Tauro son un pilar de estabilidad!',
      ru: 'Два Тельца - столп стабильности!'
    },
    medium: {
      sr: 'Delite ljubav prema komforu i sigurnosti, ali pazite na tvrdoglavost. Budite fleksibilniji.',
      en: 'You share love for comfort and security, but watch out for stubbornness. Be more flexible.',
      fr: 'Vous partagez l\'amour du confort, mais attention à l\'entêtement.',
      de: 'Sie teilen die Liebe zu Komfort, aber achten Sie auf Sturheit.',
      es: 'Comparten el amor por la comodidad, pero cuidado con la terquedad.',
      ru: 'Вы разделяете любовь к комфорту, но берегитесь упрямства.'
    },
    low: {
      sr: 'Dva Bika mogu zapasti u rutinu. Unesite novine i iznenađenja u vašu vezu.',
      en: 'Two Taurus can fall into routine. Bring novelty and surprises into your relationship.',
      fr: 'Deux Taureaux peuvent tomber dans la routine. Apportez de la nouveauté.',
      de: 'Zwei Stiere können in Routine verfallen. Bringen Sie Neuheit.',
      es: 'Dos Tauro pueden caer en la rutina. Traigan novedad.',
      ru: 'Два Тельца могут впасть в рутину. Привнесите новизну.'
    }
  },
  'taurus-virgo': {
    high: {
      sr: 'Bik i Devica su savršen zemaljski par! Zajedno gradite sigurnu i stabilnu budućnost.',
      en: 'Taurus and Virgo are a perfect earth pair! Together you build a secure and stable future.',
      fr: 'Taureau et Vierge sont un couple de terre parfait!',
      de: 'Stier und Jungfrau sind ein perfektes Erdpaar!',
      es: '¡Tauro y Virgo son una pareja de tierra perfecta!',
      ru: 'Телец и Дева - идеальная земная пара!'
    },
    medium: {
      sr: 'Praktični pristup život vas spaja, ali Devica može biti previše kritična. Prihvatite nesavršenosti.',
      en: 'Practical approach to life connects you, but Virgo can be too critical. Accept imperfections.',
      fr: 'L\'approche pratique vous connecte, mais Vierge peut être trop critique.',
      de: 'Praktischer Ansatz verbindet Sie, aber Jungfrau kann zu kritisch sein.',
      es: 'El enfoque práctico los conecta, pero Virgo puede ser demasiado crítico.',
      ru: 'Практичный подход вас связывает, но Дева может быть слишком критичной.'
    },
    low: {
      sr: 'Bik voli uživanje, Devica perfekciju - pronađite ravnotežu između opuštanja i reda.',
      en: 'Taurus loves enjoyment, Virgo loves perfection - find balance between relaxation and order.',
      fr: 'Taureau aime le plaisir, Vierge aime la perfection - trouvez l\'équilibre.',
      de: 'Stier liebt Genuss, Jungfrau liebt Perfektion - finden Sie Balance.',
      es: 'Tauro ama el disfrute, Virgo ama la perfección - encuentren el equilibrio.',
      ru: 'Телец любит удовольствие, Дева - совершенство. Найдите баланс.'
    }
  },
  'taurus-capricorn': {
    high: {
      sr: 'Bik i Jarac su moćan zemaljski duo! Vaša veza je zasnovana na poštovanju, ambiciji i trajnoj ljubavi.',
      en: 'Taurus and Capricorn are a powerful earth duo! Your relationship is based on respect, ambition and lasting love.',
      fr: 'Taureau et Capricorne sont un duo de terre puissant!',
      de: 'Stier und Steinbock sind ein mächtiges Erdduo!',
      es: '¡Tauro y Capricornio son un poderoso dúo de tierra!',
      ru: 'Телец и Козерог - мощный земной дуэт!'
    },
    medium: {
      sr: 'Delite vrednosti i ciljeve, ali Jarac može biti previše fokusiran na posao. Pravite vreme za romantiku.',
      en: 'You share values and goals, but Capricorn can be too work-focused. Make time for romance.',
      fr: 'Vous partagez des valeurs, mais Capricorne peut être trop concentré sur le travail.',
      de: 'Sie teilen Werte, aber Steinbock kann zu arbeitsorientiert sein.',
      es: 'Comparten valores, pero Capricornio puede estar muy enfocado en el trabajo.',
      ru: 'Вы разделяете ценности, но Козерог может быть слишком сосредоточен на работе.'
    },
    low: {
      sr: 'Oba znaka mogu biti tvrdoglava i fokusirana na materijalno. Ne zaboravite na emocionalnu povezanost.',
      en: 'Both signs can be stubborn and material-focused. Don\'t forget emotional connection.',
      fr: 'Les deux signes peuvent être têtus et matérialistes. N\'oubliez pas la connexion émotionnelle.',
      de: 'Beide Zeichen können stur und materiell sein. Vergessen Sie die emotionale Verbindung nicht.',
      es: 'Ambos signos pueden ser tercos y materialistas. No olviden la conexión emocional.',
      ru: 'Оба знака могут быть упрямыми и материалистичными. Не забывайте об эмоциональной связи.'
    }
  },
  'virgo-virgo': {
    high: {
      sr: 'Dve Device zajedno stvaraju harmoničan i organizovan par! Razumete se na dubokom nivou.',
      en: 'Two Virgos together create a harmonious and organized couple! You understand each other deeply.',
      fr: 'Deux Vierges ensemble créent un couple harmonieux et organisé!',
      de: 'Zwei Jungfrauen zusammen bilden ein harmonisches und organisiertes Paar!',
      es: '¡Dos Virgo juntos crean una pareja armoniosa y organizada!',
      ru: 'Две Девы вместе создают гармоничную и организованную пару!'
    },
    medium: {
      sr: 'Perfekcionizam vas spaja, ali i razdvaja. Naučite da prihvatite greške kao deo života.',
      en: 'Perfectionism connects and divides you. Learn to accept mistakes as part of life.',
      fr: 'Le perfectionnisme vous connecte et vous divise. Acceptez les erreurs.',
      de: 'Perfektionismus verbindet und trennt Sie. Akzeptieren Sie Fehler.',
      es: 'El perfeccionismo los conecta y divide. Acepten los errores.',
      ru: 'Перфекционизм вас связывает и разделяет. Примите ошибки.'
    },
    low: {
      sr: 'Previše kritike može uništiti vezu. Fokusirajte se na pozitivno i slavite male pobede.',
      en: 'Too much criticism can destroy the relationship. Focus on the positive and celebrate small wins.',
      fr: 'Trop de critique peut détruire la relation. Concentrez-vous sur le positif.',
      de: 'Zu viel Kritik kann die Beziehung zerstören. Konzentrieren Sie sich auf das Positive.',
      es: 'Demasiada crítica puede destruir la relación. Concéntrense en lo positivo.',
      ru: 'Слишком много критики может разрушить отношения. Сосредоточьтесь на позитиве.'
    }
  },
  'virgo-capricorn': {
    high: {
      sr: 'Devica i Jarac su power couple! Zajedno ostvarujete sve što zamislite kroz marljiv rad.',
      en: 'Virgo and Capricorn are a power couple! Together you achieve everything through hard work.',
      fr: 'Vierge et Capricorne sont un power couple!',
      de: 'Jungfrau und Steinbock sind ein Power-Paar!',
      es: '¡Virgo y Capricornio son una pareja poderosa!',
      ru: 'Дева и Козерог - мощная пара!'
    },
    medium: {
      sr: 'Ambicija vas spaja, ali ne zaboravite na zabavu. Uživajte u putovanju, ne samo u cilju.',
      en: 'Ambition connects you, but don\'t forget to have fun. Enjoy the journey, not just the destination.',
      fr: 'L\'ambition vous connecte, mais n\'oubliez pas de vous amuser.',
      de: 'Ambition verbindet Sie, aber vergessen Sie nicht den Spaß.',
      es: 'La ambición los conecta, pero no olviden divertirse.',
      ru: 'Амбиции вас связывают, но не забывайте веселиться.'
    },
    low: {
      sr: 'Previše fokusa na posao i obaveze. Uvedite spontanost i romantiku u svakodnevni život.',
      en: 'Too much focus on work and duties. Introduce spontaneity and romance into daily life.',
      fr: 'Trop de concentration sur le travail. Introduisez de la spontanéité.',
      de: 'Zu viel Fokus auf Arbeit. Bringen Sie Spontaneität ein.',
      es: 'Demasiado enfoque en el trabajo. Introduzcan espontaneidad.',
      ru: 'Слишком много внимания работе. Внесите спонтанность.'
    }
  },
  'capricorn-capricorn': {
    high: {
      sr: 'Dva Jarca su nepokolebljiv tim! Vaša veza je zasnovana na zajedničkim ciljevima i dubokom poštovanju.',
      en: 'Two Capricorns are an unstoppable team! Your relationship is based on shared goals and deep respect.',
      fr: 'Deux Capricornes sont une équipe inarrêtable!',
      de: 'Zwei Steinböcke sind ein unaufhaltsames Team!',
      es: '¡Dos Capricornio son un equipo imparable!',
      ru: 'Два Козерога - неостановимая команда!'
    },
    medium: {
      sr: 'Razumete potrebu za uspehom, ali ne zanemarujte emotivnu stranu. Otvorite se jedno drugom.',
      en: 'You understand the need for success, but don\'t neglect the emotional side. Open up to each other.',
      fr: 'Vous comprenez le besoin de succès, mais ne négligez pas l\'émotionnel.',
      de: 'Sie verstehen das Erfolgsbedürfnis, aber vernachlässigen Sie nicht das Emotionale.',
      es: 'Entienden la necesidad de éxito, pero no descuiden lo emocional.',
      ru: 'Вы понимаете потребность в успехе, но не пренебрегайте эмоциями.'
    },
    low: {
      sr: 'Dva Jarca mogu biti previše hladna i fokusirana na karijeru. Unesite toplinu u vašu vezu.',
      en: 'Two Capricorns can be too cold and career-focused. Bring warmth into your relationship.',
      fr: 'Deux Capricornes peuvent être trop froids. Apportez de la chaleur.',
      de: 'Zwei Steinböcke können zu kalt sein. Bringen Sie Wärme.',
      es: 'Dos Capricornio pueden ser demasiado fríos. Traigan calidez.',
      ru: 'Два Козерога могут быть слишком холодными. Привнесите тепло.'
    }
  },

  // Air + Air combinations
  'gemini-gemini': {
    high: {
      sr: 'Dva Blizanca nikad nisu dosadna! Vaša veza je puna intelektualne stimulacije i beskrajnih razgovora.',
      en: 'Two Geminis are never boring! Your relationship is full of intellectual stimulation and endless conversations.',
      fr: 'Deux Gémeaux ne sont jamais ennuyeux!',
      de: 'Zwei Zwillinge sind nie langweilig!',
      es: '¡Dos Géminis nunca son aburridos!',
      ru: 'Два Близнеца никогда не скучают!'
    },
    medium: {
      sr: 'Mentalna veza je jaka, ali možda vam fali emocionalna dubina. Radite na intimnosti.',
      en: 'Mental connection is strong, but you may lack emotional depth. Work on intimacy.',
      fr: 'La connexion mentale est forte, mais il peut manquer de profondeur émotionnelle.',
      de: 'Die mentale Verbindung ist stark, aber emotionale Tiefe fehlt vielleicht.',
      es: 'La conexión mental es fuerte, pero puede faltar profundidad emocional.',
      ru: 'Ментальная связь сильна, но может не хватать эмоциональной глубины.'
    },
    low: {
      sr: 'Promenljivost oba partnera može stvoriti nestabilnost. Postavite temelje i držite se dogovora.',
      en: 'Changeability of both partners can create instability. Set foundations and stick to agreements.',
      fr: 'La variabilité des deux partenaires peut créer de l\'instabilité.',
      de: 'Die Veränderlichkeit beider Partner kann Instabilität schaffen.',
      es: 'La variabilidad de ambos puede crear inestabilidad.',
      ru: 'Изменчивость обоих может создать нестабильность.'
    }
  },
  'gemini-libra': {
    high: {
      sr: 'Blizanci i Vaga su savršen vazdušni par! Razumete se na intelektualnom i socijalnom nivou.',
      en: 'Gemini and Libra are a perfect air pair! You understand each other intellectually and socially.',
      fr: 'Gémeaux et Balance sont un couple d\'air parfait!',
      de: 'Zwillinge und Waage sind ein perfektes Luftpaar!',
      es: '¡Géminis y Libra son una pareja de aire perfecta!',
      ru: 'Близнецы и Весы - идеальная воздушная пара!'
    },
    medium: {
      sr: 'Uživate u društvu i razgovorima, ali odlučivanje može biti izazov. Budite odlučniji zajedno.',
      en: 'You enjoy company and conversations, but decision-making can be a challenge. Be more decisive together.',
      fr: 'Vous aimez la compagnie, mais la prise de décision peut être un défi.',
      de: 'Sie genießen Gesellschaft, aber Entscheidungen können eine Herausforderung sein.',
      es: 'Disfrutan la compañía, pero tomar decisiones puede ser un desafío.',
      ru: 'Вам нравится общение, но принятие решений может быть проблемой.'
    },
    low: {
      sr: 'Previše analiziranja i premalo akcije. Prestanite da pričate i počnite da radite!',
      en: 'Too much analyzing and too little action. Stop talking and start doing!',
      fr: 'Trop d\'analyse et pas assez d\'action. Passez à l\'action!',
      de: 'Zu viel Analyse und zu wenig Aktion. Handeln Sie!',
      es: 'Demasiado análisis y poca acción. ¡Pasen a la acción!',
      ru: 'Слишком много анализа и мало действий. Начните действовать!'
    }
  },
  'gemini-aquarius': {
    high: {
      sr: 'Blizanci i Vodolija su intelektualni srodnici! Vaša veza je puna inovacija i uzbudljivih ideja.',
      en: 'Gemini and Aquarius are intellectual soulmates! Your relationship is full of innovation and exciting ideas.',
      fr: 'Gémeaux et Verseau sont des âmes sœurs intellectuelles!',
      de: 'Zwillinge und Wassermann sind intellektuelle Seelenverwandte!',
      es: '¡Géminis y Acuario son almas gemelas intelectuales!',
      ru: 'Близнецы и Водолей - интеллектуальные родственные души!'
    },
    medium: {
      sr: 'Delite ljubav prema slobodi i novim idejama, ali emotivna ekspresija vam može faliti.',
      en: 'You share love for freedom and new ideas, but emotional expression may be lacking.',
      fr: 'Vous partagez l\'amour de la liberté, mais l\'expression émotionnelle peut manquer.',
      de: 'Sie teilen die Liebe zur Freiheit, aber emotionaler Ausdruck fehlt vielleicht.',
      es: 'Comparten el amor por la libertad, pero puede faltar expresión emocional.',
      ru: 'Вы разделяете любовь к свободе, но эмоционального выражения может не хватать.'
    },
    low: {
      sr: 'Previše fokusa na um, premalo na srce. Povežite se na emotivnom nivou.',
      en: 'Too much focus on the mind, too little on the heart. Connect on an emotional level.',
      fr: 'Trop de concentration sur l\'esprit, pas assez sur le cœur.',
      de: 'Zu viel Fokus auf den Verstand, zu wenig auf das Herz.',
      es: 'Demasiado enfoque en la mente, poco en el corazón.',
      ru: 'Слишком много внимания уму, мало - сердцу.'
    }
  },
  'libra-libra': {
    high: {
      sr: 'Dve Vage zajedno stvaraju harmoničan i elegantan par! Uživate u lepoti i ravnoteži.',
      en: 'Two Libras together create a harmonious and elegant couple! You enjoy beauty and balance.',
      fr: 'Deux Balances ensemble créent un couple harmonieux et élégant!',
      de: 'Zwei Waagen zusammen bilden ein harmonisches und elegantes Paar!',
      es: '¡Dos Libra juntos crean una pareja armoniosa y elegante!',
      ru: 'Две Весы вместе создают гармоничную и элегантную пару!'
    },
    medium: {
      sr: 'Delite ljubav prema harmoniji, ali izbegavanje konflikta može stvoriti probleme. Suočite se s problemima.',
      en: 'You share love for harmony, but avoiding conflict can create problems. Face issues head-on.',
      fr: 'Vous partagez l\'amour de l\'harmonie, mais éviter les conflits peut créer des problèmes.',
      de: 'Sie teilen die Liebe zur Harmonie, aber Konfliktvermeidung kann Probleme schaffen.',
      es: 'Comparten el amor por la armonía, pero evitar conflictos puede crear problemas.',
      ru: 'Вы разделяете любовь к гармонии, но избегание конфликтов может создать проблемы.'
    },
    low: {
      sr: 'Nijedan neće doneti odluku. Razvijte sposobnost donošenja odluka i suočavanja s konfliktima.',
      en: 'Neither will make a decision. Develop decision-making skills and face conflicts.',
      fr: 'Aucun ne prendra de décision. Développez vos compétences décisionnelles.',
      de: 'Keiner wird eine Entscheidung treffen. Entwickeln Sie Entscheidungsfähigkeiten.',
      es: 'Ninguno tomará una decisión. Desarrollen habilidades de toma de decisiones.',
      ru: 'Никто не примет решение. Развивайте навыки принятия решений.'
    }
  },
  'libra-aquarius': {
    high: {
      sr: 'Vaga i Vodolija su progresivan par! Zajedno menjate svet i inspirišete jedni druge.',
      en: 'Libra and Aquarius are a progressive couple! Together you change the world and inspire each other.',
      fr: 'Balance et Verseau sont un couple progressif!',
      de: 'Waage und Wassermann sind ein progressives Paar!',
      es: '¡Libra y Acuario son una pareja progresista!',
      ru: 'Весы и Водолей - прогрессивная пара!'
    },
    medium: {
      sr: 'Delite viziju boljeg sveta, ali Vagi treba više pažnje nego što Vodolija daje. Komunicirajte potrebe.',
      en: 'You share a vision of a better world, but Libra needs more attention than Aquarius gives. Communicate needs.',
      fr: 'Vous partagez une vision, mais Balance a besoin de plus d\'attention.',
      de: 'Sie teilen eine Vision, aber Waage braucht mehr Aufmerksamkeit.',
      es: 'Comparten una visión, pero Libra necesita más atención.',
      ru: 'Вы разделяете видение, но Весам нужно больше внимания.'
    },
    low: {
      sr: 'Vodolija može biti previše nezavisna za Vagu. Pronađite balans između zajedništva i slobode.',
      en: 'Aquarius can be too independent for Libra. Find balance between togetherness and freedom.',
      fr: 'Verseau peut être trop indépendant pour Balance.',
      de: 'Wassermann kann zu unabhängig für Waage sein.',
      es: 'Acuario puede ser demasiado independiente para Libra.',
      ru: 'Водолей может быть слишком независим для Весов.'
    }
  },
  'aquarius-aquarius': {
    high: {
      sr: 'Dve Vodolije zajedno su revolucionaran par! Vaša veza je puna inovacija i zajedničkih ideala.',
      en: 'Two Aquarians together are a revolutionary couple! Your relationship is full of innovation and shared ideals.',
      fr: 'Deux Verseaux ensemble sont un couple révolutionnaire!',
      de: 'Zwei Wassermänner zusammen sind ein revolutionäres Paar!',
      es: '¡Dos Acuario juntos son una pareja revolucionaria!',
      ru: 'Два Водолея вместе - революционная пара!'
    },
    medium: {
      sr: 'Razumete potrebu za slobodom, ali emotivna distanca može biti problem. Otvorite se emocijama.',
      en: 'You understand the need for freedom, but emotional distance can be a problem. Open up to emotions.',
      fr: 'Vous comprenez le besoin de liberté, mais la distance émotionnelle peut être un problème.',
      de: 'Sie verstehen das Freiheitsbedürfnis, aber emotionale Distanz kann problematisch sein.',
      es: 'Entienden la necesidad de libertad, pero la distancia emocional puede ser un problema.',
      ru: 'Вы понимаете потребность в свободе, но эмоциональная дистанция может быть проблемой.'
    },
    low: {
      sr: 'Previše nezavisnosti može značiti dva odvojena života. Radite na zajedničkim aktivnostima.',
      en: 'Too much independence can mean two separate lives. Work on shared activities.',
      fr: 'Trop d\'indépendance peut signifier deux vies séparées.',
      de: 'Zu viel Unabhängigkeit kann zwei getrennte Leben bedeuten.',
      es: 'Demasiada independencia puede significar dos vidas separadas.',
      ru: 'Слишком много независимости может означать две отдельные жизни.'
    }
  },

  // Water + Water combinations
  'cancer-cancer': {
    high: {
      sr: 'Dva Raka stvaraju najnežniju vezu! Vaš dom je pun ljubavi, brige i emotivne sigurnosti.',
      en: 'Two Cancers create the gentlest bond! Your home is full of love, care and emotional security.',
      fr: 'Deux Cancers créent le lien le plus doux!',
      de: 'Zwei Krebse schaffen die zarteste Bindung!',
      es: '¡Dos Cáncer crean el vínculo más tierno!',
      ru: 'Два Рака создают самую нежную связь!'
    },
    medium: {
      sr: 'Razumete emocije jedno drugog, ali pazite na preteranu osetljivost. Komunicirajte otvoreno.',
      en: 'You understand each other\'s emotions, but watch out for over-sensitivity. Communicate openly.',
      fr: 'Vous comprenez les émotions de l\'autre, mais attention à la sensibilité excessive.',
      de: 'Sie verstehen die Gefühle des anderen, aber achten Sie auf Überempfindlichkeit.',
      es: 'Entienden las emociones del otro, pero cuidado con la sensibilidad excesiva.',
      ru: 'Вы понимаете эмоции друг друга, но берегитесь чрезмерной чувствительности.'
    },
    low: {
      sr: 'Previše emocija bez racionalne ravnoteže. Naučite da izađete iz komfor zone zajedno.',
      en: 'Too many emotions without rational balance. Learn to step out of your comfort zone together.',
      fr: 'Trop d\'émotions sans équilibre rationnel.',
      de: 'Zu viele Emotionen ohne rationale Balance.',
      es: 'Demasiadas emociones sin equilibrio racional.',
      ru: 'Слишком много эмоций без рационального баланса.'
    }
  },
  'cancer-scorpio': {
    high: {
      sr: 'Rak i Škorpija su intenzivna vodena veza! Vaša ljubav je duboka, strastvena i transformativna.',
      en: 'Cancer and Scorpio are an intense water connection! Your love is deep, passionate and transformative.',
      fr: 'Cancer et Scorpion sont une connexion d\'eau intense!',
      de: 'Krebs und Skorpion sind eine intensive Wasserverbindung!',
      es: '¡Cáncer y Escorpio son una conexión de agua intensa!',
      ru: 'Рак и Скорпион - интенсивная водная связь!'
    },
    medium: {
      sr: 'Emotivna dubina vas spaja, ali ljubomora može biti izazov. Gradite poverenje svakodnevno.',
      en: 'Emotional depth connects you, but jealousy can be a challenge. Build trust daily.',
      fr: 'La profondeur émotionnelle vous connecte, mais la jalousie peut être un défi.',
      de: 'Emotionale Tiefe verbindet Sie, aber Eifersucht kann eine Herausforderung sein.',
      es: 'La profundidad emocional los conecta, pero los celos pueden ser un desafío.',
      ru: 'Эмоциональная глубина вас связывает, но ревность может быть проблемой.'
    },
    low: {
      sr: 'Intenzitet emocija može biti iscrpljujući. Dajte prostora jedno drugom i vežbajte opuštanje.',
      en: 'Intensity of emotions can be exhausting. Give each other space and practice relaxation.',
      fr: 'L\'intensité des émotions peut être épuisante. Donnez-vous de l\'espace.',
      de: 'Die Intensität der Emotionen kann erschöpfend sein. Geben Sie sich Raum.',
      es: 'La intensidad de las emociones puede ser agotadora. Dense espacio.',
      ru: 'Интенсивность эмоций может быть изнурительной. Давайте друг другу пространство.'
    }
  },
  'cancer-pisces': {
    high: {
      sr: 'Rak i Ribe su sanjiva vodena bajka! Vaša veza je puna romantike, intuicije i duhovne veze.',
      en: 'Cancer and Pisces are a dreamy water fairytale! Your relationship is full of romance, intuition and spiritual connection.',
      fr: 'Cancer et Poissons sont un conte de fées aquatique rêveur!',
      de: 'Krebs und Fische sind ein verträumtes Wassermärchen!',
      es: '¡Cáncer y Piscis son un cuento de hadas acuático soñador!',
      ru: 'Рак и Рыбы - мечтательная водная сказка!'
    },
    medium: {
      sr: 'Intuitivno se razumete, ali realnost može biti izazov. Uzemljite svoje snove praktičnim koracima.',
      en: 'You understand each other intuitively, but reality can be a challenge. Ground your dreams with practical steps.',
      fr: 'Vous vous comprenez intuitivement, mais la réalité peut être un défi.',
      de: 'Sie verstehen sich intuitiv, aber die Realität kann eine Herausforderung sein.',
      es: 'Se entienden intuitivamente, pero la realidad puede ser un desafío.',
      ru: 'Вы понимаете друг друга интуитивно, но реальность может быть проблемой.'
    },
    low: {
      sr: 'Previše sanjarenja, premalo akcije. Postavite konkretne ciljeve i pratite ih zajedno.',
      en: 'Too much daydreaming, too little action. Set concrete goals and follow through together.',
      fr: 'Trop de rêverie, pas assez d\'action.',
      de: 'Zu viel Träumerei, zu wenig Aktion.',
      es: 'Demasiado soñar despiertos, poca acción.',
      ru: 'Слишком много мечтаний, мало действий.'
    }
  },
  'scorpio-scorpio': {
    high: {
      sr: 'Dve Škorpije zajedno su vulkanska strast! Vaša veza je intenzivna, transformativna i nezaboravna.',
      en: 'Two Scorpios together are volcanic passion! Your relationship is intense, transformative and unforgettable.',
      fr: 'Deux Scorpions ensemble sont une passion volcanique!',
      de: 'Zwei Skorpione zusammen sind vulkanische Leidenschaft!',
      es: '¡Dos Escorpio juntos son pasión volcánica!',
      ru: 'Два Скорпиона вместе - вулканическая страсть!'
    },
    medium: {
      sr: 'Razumete dubinu jedno drugog, ali borba za kontrolu može biti problem. Delite moć ravnopravno.',
      en: 'You understand each other\'s depth, but power struggles can be a problem. Share power equally.',
      fr: 'Vous comprenez la profondeur de l\'autre, mais les luttes de pouvoir peuvent être un problème.',
      de: 'Sie verstehen die Tiefe des anderen, aber Machtkämpfe können problematisch sein.',
      es: 'Entienden la profundidad del otro, pero las luchas de poder pueden ser un problema.',
      ru: 'Вы понимаете глубину друг друга, но борьба за власть может быть проблемой.'
    },
    low: {
      sr: 'Dva Škorpiona mogu stvoriti destruktivnu dinamiku. Radite na poverenju i puštanju kontrole.',
      en: 'Two Scorpios can create destructive dynamics. Work on trust and letting go of control.',
      fr: 'Deux Scorpions peuvent créer une dynamique destructrice.',
      de: 'Zwei Skorpione können destruktive Dynamiken schaffen.',
      es: 'Dos Escorpio pueden crear dinámicas destructivas.',
      ru: 'Два Скорпиона могут создать деструктивную динамику.'
    }
  },
  'scorpio-pisces': {
    high: {
      sr: 'Škorpija i Ribe su mistična vodena veza! Vaša ljubav je duboka, intuitivna i gotovo telepatska.',
      en: 'Scorpio and Pisces are a mystical water connection! Your love is deep, intuitive and almost telepathic.',
      fr: 'Scorpion et Poissons sont une connexion d\'eau mystique!',
      de: 'Skorpion und Fische sind eine mystische Wasserverbindung!',
      es: '¡Escorpio y Piscis son una conexión de agua mística!',
      ru: 'Скорпион и Рыбы - мистическая водная связь!'
    },
    medium: {
      sr: 'Spiritualna veza je jaka, ali Škorpija može biti previše intenzivna za osetljive Ribe.',
      en: 'Spiritual connection is strong, but Scorpio can be too intense for sensitive Pisces.',
      fr: 'La connexion spirituelle est forte, mais Scorpion peut être trop intense pour les Poissons.',
      de: 'Die spirituelle Verbindung ist stark, aber Skorpion kann zu intensiv für Fische sein.',
      es: 'La conexión espiritual es fuerte, pero Escorpio puede ser demasiado intenso para Piscis.',
      ru: 'Духовная связь сильна, но Скорпион может быть слишком интенсивен для Рыб.'
    },
    low: {
      sr: 'Previše emocija može potopiti brod. Naučite da plivate zajedno umesto da se utapate.',
      en: 'Too many emotions can sink the ship. Learn to swim together instead of drowning.',
      fr: 'Trop d\'émotions peuvent couler le navire.',
      de: 'Zu viele Emotionen können das Schiff versenken.',
      es: 'Demasiadas emociones pueden hundir el barco.',
      ru: 'Слишком много эмоций может потопить корабль.'
    }
  },
  'pisces-pisces': {
    high: {
      sr: 'Dve Ribe zajedno su sanjiva romansa! Vaša veza je puna umetnosti, duhovnosti i bezuslovne ljubavi.',
      en: 'Two Pisces together are a dreamy romance! Your relationship is full of art, spirituality and unconditional love.',
      fr: 'Deux Poissons ensemble sont une romance rêveuse!',
      de: 'Zwei Fische zusammen sind eine verträumte Romanze!',
      es: '¡Dos Piscis juntos son un romance soñador!',
      ru: 'Две Рыбы вместе - мечтательный роман!'
    },
    medium: {
      sr: 'Razumete maštu jedno drugog, ali ko će se baviti stvarnošću? Podelite praktične obaveze.',
      en: 'You understand each other\'s imagination, but who will deal with reality? Share practical duties.',
      fr: 'Vous comprenez l\'imagination de l\'autre, mais qui s\'occupera de la réalité?',
      de: 'Sie verstehen die Fantasie des anderen, aber wer kümmert sich um die Realität?',
      es: 'Entienden la imaginación del otro, pero ¿quién se ocupará de la realidad?',
      ru: 'Вы понимаете воображение друг друга, но кто займется реальностью?'
    },
    low: {
      sr: 'Dve Ribe mogu plutati bez smera. Postavite zajedničke ciljeve i držite se kursa.',
      en: 'Two Pisces can float aimlessly. Set common goals and stay on course.',
      fr: 'Deux Poissons peuvent flotter sans but.',
      de: 'Zwei Fische können ziellos treiben.',
      es: 'Dos Piscis pueden flotar sin rumbo.',
      ru: 'Две Рыбы могут плыть без цели.'
    }
  },

  // Fire + Earth (challenging)
  'aries-taurus': {
    high: {
      sr: 'Ovan donosi uzbuđenje, Bik stabilnost - zajedno ste kompletni! Vaša veza ima i strast i sigurnost.',
      en: 'Aries brings excitement, Taurus stability - together you are complete! Your relationship has both passion and security.',
      fr: 'Bélier apporte l\'excitation, Taureau la stabilité - ensemble vous êtes complets!',
      de: 'Widder bringt Aufregung, Stier Stabilität - zusammen sind Sie komplett!',
      es: 'Aries trae emoción, Tauro estabilidad - ¡juntos son completos!',
      ru: 'Овен приносит волнение, Телец - стабильность. Вместе вы полны!'
    },
    medium: {
      sr: 'Ovan želi akciju, Bik mir - pronađite ritam koji odgovara oboma.',
      en: 'Aries wants action, Taurus wants peace - find a rhythm that suits both.',
      fr: 'Bélier veut l\'action, Taureau veut la paix - trouvez un rythme qui convient aux deux.',
      de: 'Widder will Aktion, Stier will Ruhe - finden Sie einen Rhythmus für beide.',
      es: 'Aries quiere acción, Tauro quiere paz - encuentren un ritmo que convenga a ambos.',
      ru: 'Овен хочет действий, Телец - покоя. Найдите ритм для обоих.'
    },
    low: {
      sr: 'Vatreni Ovan i uporan Bik mogu se sudarati. Naučite da cenite različitosti umesto da se borite.',
      en: 'Fiery Aries and stubborn Taurus can clash. Learn to appreciate differences instead of fighting.',
      fr: 'Bélier ardent et Taureau têtu peuvent s\'affronter.',
      de: 'Feuriger Widder und sturer Stier können zusammenstoßen.',
      es: 'Aries ardiente y Tauro terco pueden chocar.',
      ru: 'Огненный Овен и упрямый Телец могут сталкиваться.'
    }
  },
  'aries-virgo': {
    high: {
      sr: 'Ovan i Devica se odlično dopunjuju! Vaša energija i njena preciznost stvaraju savršen tim.',
      en: 'Aries and Virgo complement each other greatly! Your energy and their precision create a perfect team.',
      fr: 'Bélier et Vierge se complètent parfaitement!',
      de: 'Widder und Jungfrau ergänzen sich großartig!',
      es: '¡Aries y Virgo se complementan perfectamente!',
      ru: 'Овен и Дева отлично дополняют друг друга!'
    },
    medium: {
      sr: 'Ovan je impulsivan, Devica analitična - naučite od razlika jedno drugog.',
      en: 'Aries is impulsive, Virgo is analytical - learn from each other\'s differences.',
      fr: 'Bélier est impulsif, Vierge est analytique - apprenez de vos différences.',
      de: 'Widder ist impulsiv, Jungfrau analytisch - lernen Sie voneinander.',
      es: 'Aries es impulsivo, Virgo es analítico - aprendan de sus diferencias.',
      ru: 'Овен импульсивен, Дева аналитична - учитесь друг у друга.'
    },
    low: {
      sr: 'Devica kritikuje, Ovan se buni. Fokusirajte se na poštovanje i strpljenje.',
      en: 'Virgo criticizes, Aries rebels. Focus on respect and patience.',
      fr: 'Vierge critique, Bélier se rebelle. Concentrez-vous sur le respect.',
      de: 'Jungfrau kritisiert, Widder rebelliert. Konzentrieren Sie sich auf Respekt.',
      es: 'Virgo critica, Aries se rebela. Concéntrense en el respeto.',
      ru: 'Дева критикует, Овен бунтует. Сосредоточьтесь на уважении.'
    }
  },
  'aries-capricorn': {
    high: {
      sr: 'Ovan i Jarac zajedno mogu osvojiti svet! Kombinacija ambicije i energije je neporaživa.',
      en: 'Aries and Capricorn together can conquer the world! The combination of ambition and energy is unbeatable.',
      fr: 'Bélier et Capricorne ensemble peuvent conquérir le monde!',
      de: 'Widder und Steinbock zusammen können die Welt erobern!',
      es: '¡Aries y Capricornio juntos pueden conquistar el mundo!',
      ru: 'Овен и Козерог вместе могут покорить мир!'
    },
    medium: {
      sr: 'Ovan želi brze rezultate, Jarac dugoročne. Uskladite tempo i ciljeve.',
      en: 'Aries wants quick results, Capricorn wants long-term. Align your pace and goals.',
      fr: 'Bélier veut des résultats rapides, Capricorne à long terme.',
      de: 'Widder will schnelle Ergebnisse, Steinbock langfristige.',
      es: 'Aries quiere resultados rápidos, Capricornio a largo plazo.',
      ru: 'Овен хочет быстрых результатов, Козерог - долгосрочных.'
    },
    low: {
      sr: 'Sudar autoriteta. Oboje želite voditi - naučite da delite liderstvo.',
      en: 'Clash of authorities. You both want to lead - learn to share leadership.',
      fr: 'Conflit d\'autorités. Vous voulez tous les deux diriger.',
      de: 'Zusammenstoß der Autoritäten. Sie beide wollen führen.',
      es: 'Choque de autoridades. Ambos quieren liderar.',
      ru: 'Столкновение авторитетов. Оба хотите лидировать.'
    }
  },
  'leo-taurus': {
    high: {
      sr: 'Lav i Bik su snažan par! Zajedno uživate u luksuzima života i gradite stabilnost.',
      en: 'Leo and Taurus are a powerful pair! Together you enjoy life\'s luxuries and build stability.',
      fr: 'Lion et Taureau sont un couple puissant!',
      de: 'Löwe und Stier sind ein starkes Paar!',
      es: '¡Leo y Tauro son una pareja poderosa!',
      ru: 'Лев и Телец - сильная пара!'
    },
    medium: {
      sr: 'Oboje ste uporni i volite luksuz, ali tvrdoglavost može biti problem. Vežbajte fleksibilnost.',
      en: 'You\'re both persistent and love luxury, but stubbornness can be an issue. Practice flexibility.',
      fr: 'Vous êtes tous deux persistants et aimez le luxe, mais l\'entêtement peut être un problème.',
      de: 'Sie sind beide hartnäckig und lieben Luxus, aber Sturheit kann ein Problem sein.',
      es: 'Ambos son persistentes y aman el lujo, pero la terquedad puede ser un problema.',
      ru: 'Вы оба упорны и любите роскошь, но упрямство может быть проблемой.'
    },
    low: {
      sr: 'Dva fiksna znaka koji ne popuštaju. Kompromis je ključ vašeg uspeha.',
      en: 'Two fixed signs that won\'t budge. Compromise is key to your success.',
      fr: 'Deux signes fixes qui ne cèdent pas.',
      de: 'Zwei fixe Zeichen, die nicht nachgeben.',
      es: 'Dos signos fijos que no ceden.',
      ru: 'Два фиксированных знака, которые не уступают.'
    }
  },
  'leo-virgo': {
    high: {
      sr: 'Lav sija, Devica organizuje - zajedno ste efikasan i briljantan tim!',
      en: 'Leo shines, Virgo organizes - together you are an efficient and brilliant team!',
      fr: 'Lion brille, Vierge organise - ensemble vous êtes une équipe brillante!',
      de: 'Löwe strahlt, Jungfrau organisiert - zusammen sind Sie ein brillantes Team!',
      es: '¡Leo brilla, Virgo organiza - juntos son un equipo brillante!',
      ru: 'Лев сияет, Дева организует - вместе вы блестящая команда!'
    },
    medium: {
      sr: 'Lavu treba pohvala, Devici detalji. Naučite da govorite jezikom ljubavi jedno drugog.',
      en: 'Leo needs praise, Virgo needs details. Learn to speak each other\'s love language.',
      fr: 'Lion a besoin de louanges, Vierge a besoin de détails.',
      de: 'Löwe braucht Lob, Jungfrau braucht Details.',
      es: 'Leo necesita elogios, Virgo necesita detalles.',
      ru: 'Льву нужна похвала, Деве - детали.'
    },
    low: {
      sr: 'Devica kritikuje, Lav se vređa. Gradite jedno drugo umesto da rušite.',
      en: 'Virgo criticizes, Leo gets offended. Build each other up instead of tearing down.',
      fr: 'Vierge critique, Lion s\'offense.',
      de: 'Jungfrau kritisiert, Löwe ist beleidigt.',
      es: 'Virgo critica, Leo se ofende.',
      ru: 'Дева критикует, Лев обижается.'
    }
  },
  'leo-capricorn': {
    high: {
      sr: 'Lav i Jarac su moćni par! Zajedno osvajate vrhove uspeha.',
      en: 'Leo and Capricorn are a powerful couple! Together you conquer the peaks of success.',
      fr: 'Lion et Capricorne sont un couple puissant!',
      de: 'Löwe und Steinbock sind ein mächtiges Paar!',
      es: '¡Leo y Capricornio son una pareja poderosa!',
      ru: 'Лев и Козерог - могущественная пара!'
    },
    medium: {
      sr: 'Lav želi slavu, Jarac poštovanje. Nađite način da zadovoljite oba ego.',
      en: 'Leo wants fame, Capricorn wants respect. Find a way to satisfy both egos.',
      fr: 'Lion veut la gloire, Capricorne le respect.',
      de: 'Löwe will Ruhm, Steinbock will Respekt.',
      es: 'Leo quiere fama, Capricornio respeto.',
      ru: 'Лев хочет славы, Козерог - уважения.'
    },
    low: {
      sr: 'Oba znaka žele voditi. Naučite da radite kao tim, ne kao rivali.',
      en: 'Both signs want to lead. Learn to work as a team, not as rivals.',
      fr: 'Les deux signes veulent diriger.',
      de: 'Beide Zeichen wollen führen.',
      es: 'Ambos signos quieren liderar.',
      ru: 'Оба знака хотят лидировать.'
    }
  },
  'sagittarius-taurus': {
    high: {
      sr: 'Strelac donosi avanture, Bik stabilnost - balans koji može funkcionisati!',
      en: 'Sagittarius brings adventures, Taurus brings stability - a balance that can work!',
      fr: 'Sagittaire apporte l\'aventure, Taureau la stabilité!',
      de: 'Schütze bringt Abenteuer, Stier bringt Stabilität!',
      es: '¡Sagitario trae aventuras, Tauro estabilidad!',
      ru: 'Стрелец приносит приключения, Телец - стабильность!'
    },
    medium: {
      sr: 'Strelac želi putovati, Bik ostati kod kuće. Pronađite kompromis u ritmu života.',
      en: 'Sagittarius wants to travel, Taurus wants to stay home. Find a compromise in life rhythm.',
      fr: 'Sagittaire veut voyager, Taureau rester à la maison.',
      de: 'Schütze will reisen, Stier zu Hause bleiben.',
      es: 'Sagitario quiere viajar, Tauro quedarse en casa.',
      ru: 'Стрелец хочет путешествовать, Телец - остаться дома.'
    },
    low: {
      sr: 'Različiti životni stilovi. Potrebno je mnogo rada da bi ovo funkcionisalo.',
      en: 'Different lifestyles. It takes a lot of work to make this work.',
      fr: 'Différents styles de vie. Beaucoup de travail est nécessaire.',
      de: 'Unterschiedliche Lebensstile. Es braucht viel Arbeit.',
      es: 'Diferentes estilos de vida. Se necesita mucho trabajo.',
      ru: 'Разные образы жизни. Нужно много работы.'
    }
  },
  'sagittarius-virgo': {
    high: {
      sr: 'Strelac i Devica se dopunjuju - optimizam i praktičnost zajedno!',
      en: 'Sagittarius and Virgo complement each other - optimism and practicality together!',
      fr: 'Sagittaire et Vierge se complètent!',
      de: 'Schütze und Jungfrau ergänzen sich!',
      es: '¡Sagitario y Virgo se complementan!',
      ru: 'Стрелец и Дева дополняют друг друга!'
    },
    medium: {
      sr: 'Strelac sanja veliko, Devica vidi detalje. Spojite viziju i plan.',
      en: 'Sagittarius dreams big, Virgo sees details. Combine vision and plan.',
      fr: 'Sagittaire rêve grand, Vierge voit les détails.',
      de: 'Schütze träumt groß, Jungfrau sieht Details.',
      es: 'Sagitario sueña en grande, Virgo ve detalles.',
      ru: 'Стрелец мечтает масштабно, Дева видит детали.'
    },
    low: {
      sr: 'Devica kritikuje, Strelac beži. Gradite poverenje i prihvatanje.',
      en: 'Virgo criticizes, Sagittarius runs. Build trust and acceptance.',
      fr: 'Vierge critique, Sagittaire fuit.',
      de: 'Jungfrau kritisiert, Schütze flieht.',
      es: 'Virgo critica, Sagitario huye.',
      ru: 'Дева критикует, Стрелец убегает.'
    }
  },
  'sagittarius-capricorn': {
    high: {
      sr: 'Strelac i Jarac - optimizam susreće ambiciju! Moćna kombinacija za uspeh.',
      en: 'Sagittarius and Capricorn - optimism meets ambition! A powerful combination for success.',
      fr: 'Sagittaire et Capricorne - l\'optimisme rencontre l\'ambition!',
      de: 'Schütze und Steinbock - Optimismus trifft Ambition!',
      es: '¡Sagitario y Capricornio - el optimismo se encuentra con la ambición!',
      ru: 'Стрелец и Козерог - оптимизм встречает амбиции!'
    },
    medium: {
      sr: 'Strelac je spontan, Jarac planira. Pronađite ravnotežu između slobode i strukture.',
      en: 'Sagittarius is spontaneous, Capricorn plans. Find balance between freedom and structure.',
      fr: 'Sagittaire est spontané, Capricorne planifie.',
      de: 'Schütze ist spontan, Steinbock plant.',
      es: 'Sagitario es espontáneo, Capricornio planifica.',
      ru: 'Стрелец спонтанен, Козерог планирует.'
    },
    low: {
      sr: 'Jarac hoće red, Strelac slobodu. Morate naći zajednički jezik.',
      en: 'Capricorn wants order, Sagittarius wants freedom. You must find common ground.',
      fr: 'Capricorne veut l\'ordre, Sagittaire la liberté.',
      de: 'Steinbock will Ordnung, Schütze will Freiheit.',
      es: 'Capricornio quiere orden, Sagitario libertad.',
      ru: 'Козерог хочет порядка, Стрелец - свободы.'
    }
  },

  // Fire + Air (harmonious)
  'aries-gemini': {
    high: {
      sr: 'Ovan i Blizanci su dinamičan duo! Nikad vam nije dosadno i uvek imate nešto novo da istražite.',
      en: 'Aries and Gemini are a dynamic duo! You\'re never bored and always have something new to explore.',
      fr: 'Bélier et Gémeaux sont un duo dynamique!',
      de: 'Widder und Zwillinge sind ein dynamisches Duo!',
      es: '¡Aries y Géminis son un dúo dinámico!',
      ru: 'Овен и Близнецы - динамичный дуэт!'
    },
    medium: {
      sr: 'Energija i ideje vas spajaju, ali fokus može nedostajati. Postavite jasne prioritete.',
      en: 'Energy and ideas connect you, but focus may be lacking. Set clear priorities.',
      fr: 'L\'énergie et les idées vous connectent, mais le focus peut manquer.',
      de: 'Energie und Ideen verbinden Sie, aber Fokus fehlt vielleicht.',
      es: 'La energía y las ideas los conectan, pero puede faltar enfoque.',
      ru: 'Энергия и идеи вас связывают, но фокуса может не хватать.'
    },
    low: {
      sr: 'Previše raspršene energije. Fokusirajte se na ono što je zaista važno za vas.',
      en: 'Too much scattered energy. Focus on what really matters to you.',
      fr: 'Trop d\'énergie dispersée.',
      de: 'Zu viel verstreute Energie.',
      es: 'Demasiada energía dispersa.',
      ru: 'Слишком рассеянная энергия.'
    }
  },
  'aries-libra': {
    high: {
      sr: 'Ovan i Vaga su suprotnosti koje se privlače! Vaša hemija je neodoljiva.',
      en: 'Aries and Libra are opposites that attract! Your chemistry is irresistible.',
      fr: 'Bélier et Balance sont des opposés qui s\'attirent!',
      de: 'Widder und Waage sind Gegensätze, die sich anziehen!',
      es: '¡Aries y Libra son opuestos que se atraen!',
      ru: 'Овен и Весы - противоположности, которые притягиваются!'
    },
    medium: {
      sr: 'Ovan je direktan, Vaga diplomatska. Naučite od stilova jedno drugog.',
      en: 'Aries is direct, Libra is diplomatic. Learn from each other\'s styles.',
      fr: 'Bélier est direct, Balance est diplomatique.',
      de: 'Widder ist direkt, Waage ist diplomatisch.',
      es: 'Aries es directo, Libra es diplomático.',
      ru: 'Овен прямолинеен, Весы дипломатичны.'
    },
    low: {
      sr: 'Ovan hoće da vodi, Vaga da balansira. Naučite kompromis.',
      en: 'Aries wants to lead, Libra wants to balance. Learn compromise.',
      fr: 'Bélier veut diriger, Balance veut équilibrer.',
      de: 'Widder will führen, Waage will ausgleichen.',
      es: 'Aries quiere liderar, Libra quiere equilibrar.',
      ru: 'Овен хочет лидировать, Весы - балансировать.'
    }
  },
  'aries-aquarius': {
    high: {
      sr: 'Ovan i Vodolija su inovativni par! Zajedno menjate pravila igre.',
      en: 'Aries and Aquarius are an innovative couple! Together you change the rules of the game.',
      fr: 'Bélier et Verseau sont un couple innovant!',
      de: 'Widder und Wassermann sind ein innovatives Paar!',
      es: '¡Aries y Acuario son una pareja innovadora!',
      ru: 'Овен и Водолей - инновационная пара!'
    },
    medium: {
      sr: 'Oboje volite slobodu i nezavisnost, ali Ovnu treba više pažnje. Komunicirajte potrebe.',
      en: 'You both love freedom and independence, but Aries needs more attention. Communicate needs.',
      fr: 'Vous aimez tous les deux la liberté, mais Bélier a besoin de plus d\'attention.',
      de: 'Sie beide lieben Freiheit, aber Widder braucht mehr Aufmerksamkeit.',
      es: 'Ambos aman la libertad, pero Aries necesita más atención.',
      ru: 'Вы оба любите свободу, но Овну нужно больше внимания.'
    },
    low: {
      sr: 'Vodolija može biti previše distancirana za strastvenog Ovna. Radite na intimnosti.',
      en: 'Aquarius can be too distant for passionate Aries. Work on intimacy.',
      fr: 'Verseau peut être trop distant pour le passionné Bélier.',
      de: 'Wassermann kann zu distanziert für den leidenschaftlichen Widder sein.',
      es: 'Acuario puede ser demasiado distante para el apasionado Aries.',
      ru: 'Водолей может быть слишком отстраненным для страстного Овна.'
    }
  },
  'leo-gemini': {
    high: {
      sr: 'Lav i Blizanci su zabavan par! Uvek imate o čemu da pričate i smejete se zajedno.',
      en: 'Leo and Gemini are a fun couple! You always have something to talk about and laugh together.',
      fr: 'Lion et Gémeaux sont un couple amusant!',
      de: 'Löwe und Zwillinge sind ein lustiges Paar!',
      es: '¡Leo y Géminis son una pareja divertida!',
      ru: 'Лев и Близнецы - веселая пара!'
    },
    medium: {
      sr: 'Lav želi pažnju, Blizanci su rasejanji. Fokusirajte se na kvalitetno vreme zajedno.',
      en: 'Leo wants attention, Gemini is scattered. Focus on quality time together.',
      fr: 'Lion veut l\'attention, Gémeaux est dispersé.',
      de: 'Löwe will Aufmerksamkeit, Zwillinge sind zerstreut.',
      es: 'Leo quiere atención, Géminis está disperso.',
      ru: 'Лев хочет внимания, Близнецы рассеяны.'
    },
    low: {
      sr: 'Blizanci mogu flertovati previše za posesivnog Lava. Gradite poverenje.',
      en: 'Gemini may flirt too much for possessive Leo. Build trust.',
      fr: 'Gémeaux peut trop flirter pour le Lion possessif.',
      de: 'Zwillinge flirten vielleicht zu viel für den besitzergreifenden Löwen.',
      es: 'Géminis puede coquetear demasiado para el posesivo Leo.',
      ru: 'Близнецы могут слишком флиртовать для собственнического Льва.'
    }
  },
  'leo-libra': {
    high: {
      sr: 'Lav i Vaga su glamurozan par! Uživate u lepoti, umetnosti i društvenom životu zajedno.',
      en: 'Leo and Libra are a glamorous couple! You enjoy beauty, art and social life together.',
      fr: 'Lion et Balance sont un couple glamour!',
      de: 'Löwe und Waage sind ein glamouröses Paar!',
      es: '¡Leo y Libra son una pareja glamorosa!',
      ru: 'Лев и Весы - гламурная пара!'
    },
    medium: {
      sr: 'Oboje volite lepotu i harmoniju, ali Lav želi više pažnje. Vaga treba da izrazi divljenje.',
      en: 'You both love beauty and harmony, but Leo wants more attention. Libra needs to express admiration.',
      fr: 'Vous aimez tous les deux la beauté, mais Lion veut plus d\'attention.',
      de: 'Sie beide lieben Schönheit, aber Löwe will mehr Aufmerksamkeit.',
      es: 'Ambos aman la belleza, pero Leo quiere más atención.',
      ru: 'Вы оба любите красоту, но Льву нужно больше внимания.'
    },
    low: {
      sr: 'Vaga je previše neodlučna za nestrpljivog Lava. Radite na odlučnosti zajedno.',
      en: 'Libra is too indecisive for impatient Leo. Work on decisiveness together.',
      fr: 'Balance est trop indécise pour le Lion impatient.',
      de: 'Waage ist zu unentschlossen für den ungeduldigen Löwen.',
      es: 'Libra es demasiado indeciso para el impaciente Leo.',
      ru: 'Весы слишком нерешительны для нетерпеливого Льва.'
    }
  },
  'leo-aquarius': {
    high: {
      sr: 'Lav i Vodolija su fascinantni suprotnosti! Vaša veza je puna kreativnosti i inovacija.',
      en: 'Leo and Aquarius are fascinating opposites! Your relationship is full of creativity and innovation.',
      fr: 'Lion et Verseau sont des opposés fascinants!',
      de: 'Löwe und Wassermann sind faszinierende Gegensätze!',
      es: '¡Leo y Acuario son opuestos fascinantes!',
      ru: 'Лев и Водолей - завораживающие противоположности!'
    },
    medium: {
      sr: 'Lav želi pažnju, Vodolija nezavisnost. Pronađite balans između individualnosti i zajedništva.',
      en: 'Leo wants attention, Aquarius wants independence. Find balance between individuality and togetherness.',
      fr: 'Lion veut l\'attention, Verseau l\'indépendance.',
      de: 'Löwe will Aufmerksamkeit, Wassermann will Unabhängigkeit.',
      es: 'Leo quiere atención, Acuario independencia.',
      ru: 'Лев хочет внимания, Водолей - независимости.'
    },
    low: {
      sr: 'Vodolija je previše hladna za toplokrvnog Lava. Radite na emotivnoj povezanosti.',
      en: 'Aquarius is too cold for warm-blooded Leo. Work on emotional connection.',
      fr: 'Verseau est trop froid pour le Lion chaleureux.',
      de: 'Wassermann ist zu kalt für den warmherzigen Löwen.',
      es: 'Acuario es demasiado frío para el cálido Leo.',
      ru: 'Водолей слишком холоден для теплокровного Льва.'
    }
  },
  'sagittarius-gemini': {
    high: {
      sr: 'Strelac i Blizanci su avanturistički par! Zajedno istražujete svet i ideje.',
      en: 'Sagittarius and Gemini are an adventurous pair! Together you explore the world and ideas.',
      fr: 'Sagittaire et Gémeaux sont un couple aventurier!',
      de: 'Schütze und Zwillinge sind ein abenteuerlustiges Paar!',
      es: '¡Sagitario y Géminis son una pareja aventurera!',
      ru: 'Стрелец и Близнецы - авантюрная пара!'
    },
    medium: {
      sr: 'Oboje ste nestalni, što može značiti da veza nema dubine. Usidrite se zajedno.',
      en: 'You\'re both changeable, which can mean the relationship lacks depth. Ground yourselves together.',
      fr: 'Vous êtes tous les deux changeants, ce qui peut signifier que la relation manque de profondeur.',
      de: 'Sie sind beide wechselhaft, was bedeuten kann, dass der Beziehung Tiefe fehlt.',
      es: 'Ambos son cambiantes, lo que puede significar que la relación carece de profundidad.',
      ru: 'Вы оба переменчивы, что может означать недостаток глубины в отношениях.'
    },
    low: {
      sr: 'Previše neobaveznosti. Ako želite da ovo traje, posvetite se jedno drugom.',
      en: 'Too much casualness. If you want this to last, commit to each other.',
      fr: 'Trop de désinvolture. Si vous voulez que cela dure, engagez-vous.',
      de: 'Zu viel Lässigkeit. Wenn Sie wollen, dass es hält, verpflichten Sie sich.',
      es: 'Demasiada informalidad. Si quieren que esto dure, comprométanse.',
      ru: 'Слишком много непринужденности. Если хотите, чтобы это длилось, посвятите себя друг другу.'
    }
  },
  'sagittarius-libra': {
    high: {
      sr: 'Strelac i Vaga su optimističan par! Zajedno širite horizonte i uživate u životu.',
      en: 'Sagittarius and Libra are an optimistic couple! Together you expand horizons and enjoy life.',
      fr: 'Sagittaire et Balance sont un couple optimiste!',
      de: 'Schütze und Waage sind ein optimistisches Paar!',
      es: '¡Sagitario y Libra son una pareja optimista!',
      ru: 'Стрелец и Весы - оптимистичная пара!'
    },
    medium: {
      sr: 'Strelac je direktan, Vaga diplomatska. Cene te razlike, ne frustrirajte se.',
      en: 'Sagittarius is direct, Libra is diplomatic. Appreciate these differences, don\'t get frustrated.',
      fr: 'Sagittaire est direct, Balance est diplomatique.',
      de: 'Schütze ist direkt, Waage ist diplomatisch.',
      es: 'Sagitario es directo, Libra es diplomático.',
      ru: 'Стрелец прямолинеен, Весы дипломатичны.'
    },
    low: {
      sr: 'Vaga želi vezu, Strelac slobodu. Naučite da se prilagodite jedno drugom.',
      en: 'Libra wants relationship, Sagittarius wants freedom. Learn to adapt to each other.',
      fr: 'Balance veut une relation, Sagittaire veut la liberté.',
      de: 'Waage will Beziehung, Schütze will Freiheit.',
      es: 'Libra quiere relación, Sagitario libertad.',
      ru: 'Весы хотят отношений, Стрелец - свободы.'
    }
  },
  'sagittarius-aquarius': {
    high: {
      sr: 'Strelac i Vodolija su slobodni duhovi! Vaša veza je puna inovacija i avantura.',
      en: 'Sagittarius and Aquarius are free spirits! Your relationship is full of innovation and adventure.',
      fr: 'Sagittaire et Verseau sont des esprits libres!',
      de: 'Schütze und Wassermann sind freie Geister!',
      es: '¡Sagitario y Acuario son espíritus libres!',
      ru: 'Стрелец и Водолей - свободные духи!'
    },
    medium: {
      sr: 'Razumete potrebu za nezavisnošću, ali emotivna bliskost može nedostajati.',
      en: 'You understand the need for independence, but emotional closeness may be lacking.',
      fr: 'Vous comprenez le besoin d\'indépendance, mais la proximité émotionnelle peut manquer.',
      de: 'Sie verstehen das Bedürfnis nach Unabhängigkeit, aber emotionale Nähe fehlt vielleicht.',
      es: 'Entienden la necesidad de independencia, pero puede faltar cercanía emocional.',
      ru: 'Вы понимаете потребность в независимости, но эмоциональной близости может не хватать.'
    },
    low: {
      sr: 'Previše distancirani za pravu intimnost. Radite na emotivnoj povezanosti.',
      en: 'Too distant for real intimacy. Work on emotional connection.',
      fr: 'Trop distants pour une vraie intimité.',
      de: 'Zu distanziert für echte Intimität.',
      es: 'Demasiado distantes para intimidad real.',
      ru: 'Слишком отстранены для настоящей близости.'
    }
  },

  // Fire + Water (challenging)
  'aries-cancer': {
    high: {
      sr: 'Ovan štiti Raka, Rak neguje Ovna - kada funkcioniše, to je predivno!',
      en: 'Aries protects Cancer, Cancer nurtures Aries - when it works, it\'s beautiful!',
      fr: 'Bélier protège Cancer, Cancer nourrit Bélier!',
      de: 'Widder beschützt Krebs, Krebs nährt Widder!',
      es: '¡Aries protege a Cáncer, Cáncer nutre a Aries!',
      ru: 'Овен защищает Рака, Рак заботится об Овне!'
    },
    medium: {
      sr: 'Ovan je impulsivan, Rak emotivan. Naučite da razumete različite načine izražavanja.',
      en: 'Aries is impulsive, Cancer is emotional. Learn to understand different ways of expression.',
      fr: 'Bélier est impulsif, Cancer est émotionnel.',
      de: 'Widder ist impulsiv, Krebs ist emotional.',
      es: 'Aries es impulsivo, Cáncer es emocional.',
      ru: 'Овен импульсивен, Рак эмоционален.'
    },
    low: {
      sr: 'Ovan može povrediti osetljivog Raka. Potrebna je pažnja i razumevanje.',
      en: 'Aries can hurt sensitive Cancer. Care and understanding are needed.',
      fr: 'Bélier peut blesser le Cancer sensible.',
      de: 'Widder kann den sensiblen Krebs verletzen.',
      es: 'Aries puede herir al sensible Cáncer.',
      ru: 'Овен может ранить чувствительного Рака.'
    }
  },
  'aries-scorpio': {
    high: {
      sr: 'Ovan i Škorpija su strastvena kombinacija! Vaša veza je intenzivna i nezaboravna.',
      en: 'Aries and Scorpio are a passionate combination! Your relationship is intense and unforgettable.',
      fr: 'Bélier et Scorpion sont une combinaison passionnée!',
      de: 'Widder und Skorpion sind eine leidenschaftliche Kombination!',
      es: '¡Aries y Escorpio son una combinación apasionada!',
      ru: 'Овен и Скорпион - страстная комбинация!'
    },
    medium: {
      sr: 'Oboje ste dominantni, što može stvoriti konflikte. Delite moć ravnopravno.',
      en: 'You\'re both dominant, which can create conflicts. Share power equally.',
      fr: 'Vous êtes tous les deux dominants, ce qui peut créer des conflits.',
      de: 'Sie sind beide dominant, was Konflikte schaffen kann.',
      es: 'Ambos son dominantes, lo que puede crear conflictos.',
      ru: 'Вы оба доминантны, что может создать конфликты.'
    },
    low: {
      sr: 'Borba za kontrolu može uništiti vezu. Naučite da popuštate i verujete.',
      en: 'Power struggle can destroy the relationship. Learn to yield and trust.',
      fr: 'La lutte pour le pouvoir peut détruire la relation.',
      de: 'Machtkampf kann die Beziehung zerstören.',
      es: 'La lucha por el poder puede destruir la relación.',
      ru: 'Борьба за власть может разрушить отношения.'
    }
  },
  'aries-pisces': {
    high: {
      sr: 'Ovan vodi, Ribe inspirišu - magična kombinacija kada se razumete!',
      en: 'Aries leads, Pisces inspires - a magical combination when you understand each other!',
      fr: 'Bélier dirige, Poissons inspire - une combinaison magique!',
      de: 'Widder führt, Fische inspiriert - eine magische Kombination!',
      es: '¡Aries lidera, Piscis inspira - una combinación mágica!',
      ru: 'Овен ведет, Рыбы вдохновляют - магическая комбинация!'
    },
    medium: {
      sr: 'Ovan je direktan, Ribe intuitivne. Naučite da komunicirate na različitim nivoima.',
      en: 'Aries is direct, Pisces is intuitive. Learn to communicate on different levels.',
      fr: 'Bélier est direct, Poissons est intuitif.',
      de: 'Widder ist direkt, Fische ist intuitiv.',
      es: 'Aries es directo, Piscis es intuitivo.',
      ru: 'Овен прямолинеен, Рыбы интуитивны.'
    },
    low: {
      sr: 'Ovan može biti previše grub za osetljive Ribe. Vežbajte nežnost.',
      en: 'Aries can be too harsh for sensitive Pisces. Practice gentleness.',
      fr: 'Bélier peut être trop dur pour les Poissons sensibles.',
      de: 'Widder kann zu hart für die sensiblen Fische sein.',
      es: 'Aries puede ser demasiado duro para el sensible Piscis.',
      ru: 'Овен может быть слишком резок для чувствительных Рыб.'
    }
  },
  'leo-cancer': {
    high: {
      sr: 'Lav i Rak su zaštitnici porodice! Zajedno gradite topao i siguran dom.',
      en: 'Leo and Cancer are family protectors! Together you build a warm and secure home.',
      fr: 'Lion et Cancer sont protecteurs de la famille!',
      de: 'Löwe und Krebs sind Familienbeschützer!',
      es: '¡Leo y Cáncer son protectores de la familia!',
      ru: 'Лев и Рак - защитники семьи!'
    },
    medium: {
      sr: 'Lavu treba pažnja, Raku sigurnost. Dajte jedno drugom ono što vam treba.',
      en: 'Leo needs attention, Cancer needs security. Give each other what you need.',
      fr: 'Lion a besoin d\'attention, Cancer de sécurité.',
      de: 'Löwe braucht Aufmerksamkeit, Krebs braucht Sicherheit.',
      es: 'Leo necesita atención, Cáncer seguridad.',
      ru: 'Льву нужно внимание, Раку - безопасность.'
    },
    low: {
      sr: 'Lavova potreba za pažnjom može frustrirati Raka. Gradite međusobno razumevanje.',
      en: 'Leo\'s need for attention can frustrate Cancer. Build mutual understanding.',
      fr: 'Le besoin d\'attention du Lion peut frustrer le Cancer.',
      de: 'Löwes Aufmerksamkeitsbedürfnis kann Krebs frustrieren.',
      es: 'La necesidad de atención de Leo puede frustrar a Cáncer.',
      ru: 'Потребность Льва во внимании может расстраивать Рака.'
    }
  },
  'leo-scorpio': {
    high: {
      sr: 'Lav i Škorpija su moćna kombinacija! Vaša strast je intenzivna i magnetska.',
      en: 'Leo and Scorpio are a powerful combination! Your passion is intense and magnetic.',
      fr: 'Lion et Scorpion sont une combinaison puissante!',
      de: 'Löwe und Skorpion sind eine mächtige Kombination!',
      es: '¡Leo y Escorpio son una combinación poderosa!',
      ru: 'Лев и Скорпион - мощная комбинация!'
    },
    medium: {
      sr: 'Oba znaka su fiksna i tvrdoglava. Naučite da popuštate i kompromisujete.',
      en: 'Both signs are fixed and stubborn. Learn to yield and compromise.',
      fr: 'Les deux signes sont fixes et têtus.',
      de: 'Beide Zeichen sind fix und stur.',
      es: 'Ambos signos son fijos y tercos.',
      ru: 'Оба знака фиксированные и упрямые.'
    },
    low: {
      sr: 'Borba za dominaciju. Oboje želite kontrolu - moramo naučiti deliti.',
      en: 'Power struggle. You both want control - you must learn to share.',
      fr: 'Lutte pour la domination.',
      de: 'Machtkampf.',
      es: 'Lucha por la dominación.',
      ru: 'Борьба за доминирование.'
    }
  },
  'leo-pisces': {
    high: {
      sr: 'Lav je kralj, Ribe su muz - zajedno stvarate umetnost ljubavi!',
      en: 'Leo is the king, Pisces is the muse - together you create the art of love!',
      fr: 'Lion est le roi, Poissons est la muse!',
      de: 'Löwe ist der König, Fische ist die Muse!',
      es: '¡Leo es el rey, Piscis es la musa!',
      ru: 'Лев - король, Рыбы - муза!'
    },
    medium: {
      sr: 'Lav želi pažnju, Ribe daju bezuslovno. Pazite da ne iskoristite Ribinu dobrotu.',
      en: 'Leo wants attention, Pisces gives unconditionally. Be careful not to take advantage of Pisces\' kindness.',
      fr: 'Lion veut l\'attention, Poissons donne inconditionnellement.',
      de: 'Löwe will Aufmerksamkeit, Fische gibt bedingungslos.',
      es: 'Leo quiere atención, Piscis da incondicionalmente.',
      ru: 'Лев хочет внимания, Рыбы дают безусловно.'
    },
    low: {
      sr: 'Lav može gušiti osetljive Ribe. Dajte prostora za maštu i mir.',
      en: 'Leo can overwhelm sensitive Pisces. Give space for imagination and peace.',
      fr: 'Lion peut submerger les Poissons sensibles.',
      de: 'Löwe kann die sensiblen Fische überwältigen.',
      es: 'Leo puede abrumar al sensible Piscis.',
      ru: 'Лев может подавлять чувствительных Рыб.'
    }
  },
  'sagittarius-cancer': {
    high: {
      sr: 'Strelac širi horizonte, Rak pruža sigurno gnezdo. Kada se spoji - magija!',
      en: 'Sagittarius expands horizons, Cancer provides a safe nest. When combined - magic!',
      fr: 'Sagittaire élargit les horizons, Cancer fournit un nid sûr!',
      de: 'Schütze erweitert Horizonte, Krebs bietet ein sicheres Nest!',
      es: '¡Sagitario expande horizontes, Cáncer proporciona un nido seguro!',
      ru: 'Стрелец расширяет горизонты, Рак создает безопасное гнездо!'
    },
    medium: {
      sr: 'Strelac želi da putuje, Rak da ostane kod kuće. Pronađite kompromis.',
      en: 'Sagittarius wants to travel, Cancer wants to stay home. Find a compromise.',
      fr: 'Sagittaire veut voyager, Cancer veut rester à la maison.',
      de: 'Schütze will reisen, Krebs will zu Hause bleiben.',
      es: 'Sagitario quiere viajar, Cáncer quedarse en casa.',
      ru: 'Стрелец хочет путешествовать, Рак - остаться дома.'
    },
    low: {
      sr: 'Strelčeva potreba za slobodom može povrediti Rakovu potrebu za sigurnošću.',
      en: 'Sagittarius\' need for freedom can hurt Cancer\'s need for security.',
      fr: 'Le besoin de liberté du Sagittaire peut blesser le Cancer.',
      de: 'Das Freiheitsbedürfnis des Schützen kann Krebs verletzen.',
      es: 'La necesidad de libertad de Sagitario puede herir a Cáncer.',
      ru: 'Потребность Стрельца в свободе может ранить Рака.'
    }
  },
  'sagittarius-scorpio': {
    high: {
      sr: 'Strelac i Škorpija su intenzivan par! Kada se razumete, sve je moguće.',
      en: 'Sagittarius and Scorpio are an intense couple! When you understand each other, anything is possible.',
      fr: 'Sagittaire et Scorpion sont un couple intense!',
      de: 'Schütze und Skorpion sind ein intensives Paar!',
      es: '¡Sagitario y Escorpio son una pareja intensa!',
      ru: 'Стрелец и Скорпион - интенсивная пара!'
    },
    medium: {
      sr: 'Strelac je lagan, Škorpija intenzivan. Naučite da poštujete različite pristupe.',
      en: 'Sagittarius is light, Scorpio is intense. Learn to respect different approaches.',
      fr: 'Sagittaire est léger, Scorpion est intense.',
      de: 'Schütze ist leicht, Skorpion ist intensiv.',
      es: 'Sagitario es ligero, Escorpio es intenso.',
      ru: 'Стрелец легкий, Скорпион интенсивный.'
    },
    low: {
      sr: 'Škorpija je ljubomorna, Strelac flertuje. Ovo može stvoriti ozbiljne probleme.',
      en: 'Scorpio is jealous, Sagittarius flirts. This can create serious problems.',
      fr: 'Scorpion est jaloux, Sagittaire flirte.',
      de: 'Skorpion ist eifersüchtig, Schütze flirtet.',
      es: 'Escorpio es celoso, Sagitario coquetea.',
      ru: 'Скорпион ревнив, Стрелец флиртует.'
    }
  },
  'sagittarius-pisces': {
    high: {
      sr: 'Strelac i Ribe su sanjarski duo! Zajedno istražujete duhov i fizički svet.',
      en: 'Sagittarius and Pisces are a dreamy duo! Together you explore the spiritual and physical world.',
      fr: 'Sagittaire et Poissons sont un duo rêveur!',
      de: 'Schütze und Fische sind ein verträumtes Duo!',
      es: '¡Sagitario y Piscis son un dúo soñador!',
      ru: 'Стрелец и Рыбы - мечтательный дуэт!'
    },
    medium: {
      sr: 'Oba znaka bežite od stvarnosti na svoj način. Uzemljite snove u akciju.',
      en: 'Both signs escape reality in your own way. Ground dreams into action.',
      fr: 'Les deux signes échappent à la réalité à leur manière.',
      de: 'Beide Zeichen fliehen auf ihre Weise vor der Realität.',
      es: 'Ambos signos escapan de la realidad a su manera.',
      ru: 'Оба знака убегают от реальности по-своему.'
    },
    low: {
      sr: 'Previše neobaveznosti može značiti da veza nikad ne dobije temelj.',
      en: 'Too much casualness can mean the relationship never gets grounded.',
      fr: 'Trop de désinvolture peut signifier que la relation ne s\'enracine jamais.',
      de: 'Zu viel Lässigkeit kann bedeuten, dass die Beziehung nie Fuß fasst.',
      es: 'Demasiada informalidad puede significar que la relación nunca se arraigue.',
      ru: 'Слишком много непринужденности может означать, что отношения никогда не станут серьезными.'
    }
  },

  // Earth + Air (challenging)
  'taurus-gemini': {
    high: {
      sr: 'Bik daje stabilnost, Blizanci raznolikost - zanimljiva kombinacija!',
      en: 'Taurus gives stability, Gemini gives variety - an interesting combination!',
      fr: 'Taureau apporte la stabilité, Gémeaux la variété!',
      de: 'Stier gibt Stabilität, Zwillinge Vielfalt!',
      es: '¡Tauro da estabilidad, Géminis variedad!',
      ru: 'Телец дает стабильность, Близнецы - разнообразие!'
    },
    medium: {
      sr: 'Bik želi rutinu, Blizanci promenu. Pronađite sredinu koja odgovara oboma.',
      en: 'Taurus wants routine, Gemini wants change. Find a middle ground that suits both.',
      fr: 'Taureau veut la routine, Gémeaux le changement.',
      de: 'Stier will Routine, Zwillinge will Veränderung.',
      es: 'Tauro quiere rutina, Géminis cambio.',
      ru: 'Телец хочет рутины, Близнецы - перемен.'
    },
    low: {
      sr: 'Previše različiti ritmi. Potreban je ozbiljan kompromis da bi ovo funkcionisalo.',
      en: 'Too different rhythms. Serious compromise is needed for this to work.',
      fr: 'Des rythmes trop différents.',
      de: 'Zu unterschiedliche Rhythmen.',
      es: 'Ritmos demasiado diferentes.',
      ru: 'Слишком разные ритмы.'
    }
  },
  'taurus-libra': {
    high: {
      sr: 'Bik i Vaga - oba vladana Venerom! Delite ljubav prema lepoti i harmoniji.',
      en: 'Taurus and Libra - both ruled by Venus! You share love for beauty and harmony.',
      fr: 'Taureau et Balance - tous deux gouvernés par Vénus!',
      de: 'Stier und Waage - beide von Venus regiert!',
      es: '¡Tauro y Libra - ambos regidos por Venus!',
      ru: 'Телец и Весы - оба управляются Венерой!'
    },
    medium: {
      sr: 'Volite lepotu, ali Bik je praktičan, Vaga društvena. Nađite balans između kuće i sveta.',
      en: 'You love beauty, but Taurus is practical, Libra is social. Find balance between home and world.',
      fr: 'Vous aimez la beauté, mais Taureau est pratique, Balance est sociale.',
      de: 'Sie lieben Schönheit, aber Stier ist praktisch, Waage ist gesellig.',
      es: 'Aman la belleza, pero Tauro es práctico, Libra es social.',
      ru: 'Вы любите красоту, но Телец практичен, Весы общительны.'
    },
    low: {
      sr: 'Bik je tvrdoglav, Vaga neodlučna. Oba problema zajedno stvaraju frustraciju.',
      en: 'Taurus is stubborn, Libra is indecisive. Both problems together create frustration.',
      fr: 'Taureau est têtu, Balance est indécise.',
      de: 'Stier ist stur, Waage ist unentschlossen.',
      es: 'Tauro es terco, Libra es indeciso.',
      ru: 'Телец упрям, Весы нерешительны.'
    }
  },
  'taurus-aquarius': {
    high: {
      sr: 'Bik i Vodolija - kada se razumete, spajate tradiciju i inovaciju!',
      en: 'Taurus and Aquarius - when you understand each other, you combine tradition and innovation!',
      fr: 'Taureau et Verseau - quand vous vous comprenez, vous combinez tradition et innovation!',
      de: 'Stier und Wassermann - wenn Sie sich verstehen, verbinden Sie Tradition und Innovation!',
      es: '¡Tauro y Acuario - cuando se entienden, combinan tradición e innovación!',
      ru: 'Телец и Водолей - когда понимаете друг друга, объединяете традиции и инновации!'
    },
    medium: {
      sr: 'Bik želi sigurnost, Vodolija promenu. Veoma različite potrebe koje zahtevaju kompromis.',
      en: 'Taurus wants security, Aquarius wants change. Very different needs requiring compromise.',
      fr: 'Taureau veut la sécurité, Verseau veut le changement.',
      de: 'Stier will Sicherheit, Wassermann will Veränderung.',
      es: 'Tauro quiere seguridad, Acuario cambio.',
      ru: 'Телец хочет безопасности, Водолей - перемен.'
    },
    low: {
      sr: 'Previše različiti. Potreban je ogroman trud da bi ovo uopšte funkcionisalo.',
      en: 'Too different. Enormous effort is needed for this to work at all.',
      fr: 'Trop différents.',
      de: 'Zu unterschiedlich.',
      es: 'Demasiado diferentes.',
      ru: 'Слишком разные.'
    }
  },
  'virgo-gemini': {
    high: {
      sr: 'Devica i Blizanci - oba vladana Merkurom! Mentalna veza je neverovatna.',
      en: 'Virgo and Gemini - both ruled by Mercury! The mental connection is incredible.',
      fr: 'Vierge et Gémeaux - tous deux gouvernés par Mercure!',
      de: 'Jungfrau und Zwillinge - beide von Merkur regiert!',
      es: '¡Virgo y Géminis - ambos regidos por Mercurio!',
      ru: 'Дева и Близнецы - оба управляются Меркурием!'
    },
    medium: {
      sr: 'Razumete se intelektualno, ali Devica želi red, Blizanci haos. Nađite sredinu.',
      en: 'You understand each other intellectually, but Virgo wants order, Gemini wants chaos. Find middle ground.',
      fr: 'Vous vous comprenez intellectuellement, mais Vierge veut l\'ordre, Gémeaux le chaos.',
      de: 'Sie verstehen sich intellektuell, aber Jungfrau will Ordnung, Zwillinge will Chaos.',
      es: 'Se entienden intelectualmente, pero Virgo quiere orden, Géminis caos.',
      ru: 'Вы понимаете друг друга интеллектуально, но Дева хочет порядка, Близнецы - хаоса.'
    },
    low: {
      sr: 'Devica je kritična, Blizanci površni. Oba problema zajedno stvaraju konflikt.',
      en: 'Virgo is critical, Gemini is superficial. Both problems together create conflict.',
      fr: 'Vierge est critique, Gémeaux est superficiel.',
      de: 'Jungfrau ist kritisch, Zwillinge ist oberflächlich.',
      es: 'Virgo es crítico, Géminis es superficial.',
      ru: 'Дева критична, Близнецы поверхностны.'
    }
  },
  'virgo-libra': {
    high: {
      sr: 'Devica i Vaga - perfekcionisti na različite načine! Kada se usaglasite, magija.',
      en: 'Virgo and Libra - perfectionists in different ways! When aligned, magic.',
      fr: 'Vierge et Balance - perfectionnistes de différentes manières!',
      de: 'Jungfrau und Waage - Perfektionisten auf verschiedene Weise!',
      es: '¡Virgo y Libra - perfeccionistas de diferentes maneras!',
      ru: 'Дева и Весы - перфекционисты по-разному!'
    },
    medium: {
      sr: 'Devica se fokusira na detalje, Vaga na odnose. Naučite da cenite različite prioritete.',
      en: 'Virgo focuses on details, Libra on relationships. Learn to appreciate different priorities.',
      fr: 'Vierge se concentre sur les détails, Balance sur les relations.',
      de: 'Jungfrau konzentriert sich auf Details, Waage auf Beziehungen.',
      es: 'Virgo se enfoca en detalles, Libra en relaciones.',
      ru: 'Дева сосредоточена на деталях, Весы - на отношениях.'
    },
    low: {
      sr: 'Devica kritikuje, Vaga izbegava konflikt. Komunikacija može patiti.',
      en: 'Virgo criticizes, Libra avoids conflict. Communication can suffer.',
      fr: 'Vierge critique, Balance évite le conflit.',
      de: 'Jungfrau kritisiert, Waage meidet Konflikt.',
      es: 'Virgo critica, Libra evita el conflicto.',
      ru: 'Дева критикует, Весы избегают конфликтов.'
    }
  },
  'virgo-aquarius': {
    high: {
      sr: 'Devica i Vodolija - inteligentni um susreće inovativnu viziju!',
      en: 'Virgo and Aquarius - intelligent mind meets innovative vision!',
      fr: 'Vierge et Verseau - l\'esprit intelligent rencontre la vision innovante!',
      de: 'Jungfrau und Wassermann - intelligenter Geist trifft innovative Vision!',
      es: '¡Virgo y Acuario - mente inteligente se encuentra con visión innovadora!',
      ru: 'Дева и Водолей - умный ум встречает инновационное видение!'
    },
    medium: {
      sr: 'Devica je praktična, Vodolija teorijska. Spojite ideje sa akcijom.',
      en: 'Virgo is practical, Aquarius is theoretical. Connect ideas with action.',
      fr: 'Vierge est pratique, Verseau est théorique.',
      de: 'Jungfrau ist praktisch, Wassermann ist theoretisch.',
      es: 'Virgo es práctico, Acuario es teórico.',
      ru: 'Дева практична, Водолей теоретичен.'
    },
    low: {
      sr: 'Devica želi red, Vodolija revoluciju. Veoma različite vizije.',
      en: 'Virgo wants order, Aquarius wants revolution. Very different visions.',
      fr: 'Vierge veut l\'ordre, Verseau veut la révolution.',
      de: 'Jungfrau will Ordnung, Wassermann will Revolution.',
      es: 'Virgo quiere orden, Acuario quiere revolución.',
      ru: 'Дева хочет порядка, Водолей - революции.'
    }
  },
  'capricorn-gemini': {
    high: {
      sr: 'Jarac i Blizanci - ambicija susreće versatilnost! Moćan poslovni par.',
      en: 'Capricorn and Gemini - ambition meets versatility! A powerful business pair.',
      fr: 'Capricorne et Gémeaux - l\'ambition rencontre la polyvalence!',
      de: 'Steinbock und Zwillinge - Ambition trifft Vielseitigkeit!',
      es: '¡Capricornio y Géminis - la ambición se encuentra con la versatilidad!',
      ru: 'Козерог и Близнецы - амбиции встречают универсальность!'
    },
    medium: {
      sr: 'Jarac je ozbiljan, Blizanci laki. Pronađite ravnotežu između posla i zabave.',
      en: 'Capricorn is serious, Gemini is light. Find balance between work and fun.',
      fr: 'Capricorne est sérieux, Gémeaux est léger.',
      de: 'Steinbock ist ernst, Zwillinge ist leicht.',
      es: 'Capricornio es serio, Géminis es ligero.',
      ru: 'Козерог серьезен, Близнецы легкие.'
    },
    low: {
      sr: 'Previše različiti pristupi životu. Potreban je ogroman trud.',
      en: 'Too different approaches to life. Enormous effort is needed.',
      fr: 'Des approches trop différentes de la vie.',
      de: 'Zu unterschiedliche Lebensansätze.',
      es: 'Enfoques de vida demasiado diferentes.',
      ru: 'Слишком разные подходы к жизни.'
    }
  },
  'capricorn-libra': {
    high: {
      sr: 'Jarac i Vaga - ambicija i elegancija! Moćan par u društvu.',
      en: 'Capricorn and Libra - ambition and elegance! A powerful couple in society.',
      fr: 'Capricorne et Balance - ambition et élégance!',
      de: 'Steinbock und Waage - Ambition und Eleganz!',
      es: '¡Capricornio y Libra - ambición y elegancia!',
      ru: 'Козерог и Весы - амбиции и элегантность!'
    },
    medium: {
      sr: 'Jarac je fokusiran na karijeru, Vaga na odnose. Balansrajte prioritete.',
      en: 'Capricorn focuses on career, Libra on relationships. Balance priorities.',
      fr: 'Capricorne se concentre sur la carrière, Balance sur les relations.',
      de: 'Steinbock konzentriert sich auf Karriere, Waage auf Beziehungen.',
      es: 'Capricornio se enfoca en la carrera, Libra en las relaciones.',
      ru: 'Козерог сосредоточен на карьере, Весы - на отношениях.'
    },
    low: {
      sr: 'Jarac je hladan, Vagi treba harmonija. Radite na emotivnoj povezanosti.',
      en: 'Capricorn is cold, Libra needs harmony. Work on emotional connection.',
      fr: 'Capricorne est froid, Balance a besoin d\'harmonie.',
      de: 'Steinbock ist kalt, Waage braucht Harmonie.',
      es: 'Capricornio es frío, Libra necesita armonía.',
      ru: 'Козерог холоден, Весам нужна гармония.'
    }
  },
  'capricorn-aquarius': {
    high: {
      sr: 'Jarac i Vodolija - tradicija i inovacija! Kada radite zajedno, nema granica.',
      en: 'Capricorn and Aquarius - tradition and innovation! When working together, no limits.',
      fr: 'Capricorne et Verseau - tradition et innovation!',
      de: 'Steinbock und Wassermann - Tradition und Innovation!',
      es: '¡Capricornio y Acuario - tradición e innovación!',
      ru: 'Козерог и Водолей - традиции и инновации!'
    },
    medium: {
      sr: 'Jarac ceni status quo, Vodolija ga ruši. Pronađite sredinu.',
      en: 'Capricorn values status quo, Aquarius breaks it. Find a middle ground.',
      fr: 'Capricorne valorise le statu quo, Verseau le brise.',
      de: 'Steinbock schätzt den Status quo, Wassermann bricht ihn.',
      es: 'Capricornio valora el statu quo, Acuario lo rompe.',
      ru: 'Козерог ценит статус-кво, Водолей его ломает.'
    },
    low: {
      sr: 'Previše različite vizije budućnosti. Moremo razgovarati o zajedničkim ciljevima.',
      en: 'Too different visions of the future. We must discuss common goals.',
      fr: 'Des visions de l\'avenir trop différentes.',
      de: 'Zu unterschiedliche Zukunftsvisionen.',
      es: 'Visiones del futuro demasiado diferentes.',
      ru: 'Слишком разные видения будущего.'
    }
  },

  // Earth + Water (harmonious)
  'taurus-cancer': {
    high: {
      sr: 'Bik i Rak su idealan par za porodicu! Gradite topao dom pun ljubavi i sigurnosti.',
      en: 'Taurus and Cancer are an ideal family couple! You build a warm home full of love and security.',
      fr: 'Taureau et Cancer sont un couple familial idéal!',
      de: 'Stier und Krebs sind ein ideales Familienpaar!',
      es: '¡Tauro y Cáncer son una pareja familiar ideal!',
      ru: 'Телец и Рак - идеальная семейная пара!'
    },
    medium: {
      sr: 'Delite ljubav prema domu, ali Bik je tvrdoglav, Rak emotivan. Strpljenje je ključ.',
      en: 'You share love for home, but Taurus is stubborn, Cancer is emotional. Patience is key.',
      fr: 'Vous partagez l\'amour du foyer, mais Taureau est têtu, Cancer est émotionnel.',
      de: 'Sie teilen die Liebe zum Zuhause, aber Stier ist stur, Krebs ist emotional.',
      es: 'Comparten el amor por el hogar, pero Tauro es terco, Cáncer es emocional.',
      ru: 'Вы разделяете любовь к дому, но Телец упрям, Рак эмоционален.'
    },
    low: {
      sr: 'Bik može biti previše hladan za emotivnog Raka. Radite na emotivnoj ekspresiji.',
      en: 'Taurus can be too cold for emotional Cancer. Work on emotional expression.',
      fr: 'Taureau peut être trop froid pour le Cancer émotionnel.',
      de: 'Stier kann zu kalt für den emotionalen Krebs sein.',
      es: 'Tauro puede ser demasiado frío para el emocional Cáncer.',
      ru: 'Телец может быть слишком холодным для эмоционального Рака.'
    }
  },
  'taurus-scorpio': {
    high: {
      sr: 'Bik i Škorpija su magnetni suprotnosti! Vaša strast je duboka i intenzivna.',
      en: 'Taurus and Scorpio are magnetic opposites! Your passion is deep and intense.',
      fr: 'Taureau et Scorpion sont des opposés magnétiques!',
      de: 'Stier und Skorpion sind magnetische Gegensätze!',
      es: '¡Tauro y Escorpio son opuestos magnéticos!',
      ru: 'Телец и Скорпион - магнетические противоположности!'
    },
    medium: {
      sr: 'Oba znaka su tvrdoglava i fiksna. Naučite da popuštate i delite kontrolu.',
      en: 'Both signs are stubborn and fixed. Learn to yield and share control.',
      fr: 'Les deux signes sont têtus et fixes.',
      de: 'Beide Zeichen sind stur und fix.',
      es: 'Ambos signos son tercos y fijos.',
      ru: 'Оба знака упрямы и фиксированы.'
    },
    low: {
      sr: 'Borba za dominaciju. Oboje želite kontrolu - moramo naučiti kompromis.',
      en: 'Power struggle. You both want control - you must learn compromise.',
      fr: 'Lutte pour la domination.',
      de: 'Machtkampf.',
      es: 'Lucha por la dominación.',
      ru: 'Борьба за доминирование.'
    }
  },
  'taurus-pisces': {
    high: {
      sr: 'Bik i Ribe su romantičan duo! Bik uzemljuje Ribine snove u stvarnost.',
      en: 'Taurus and Pisces are a romantic duo! Taurus grounds Pisces\' dreams into reality.',
      fr: 'Taureau et Poissons sont un duo romantique!',
      de: 'Stier und Fische sind ein romantisches Duo!',
      es: '¡Tauro y Piscis son un dúo romántico!',
      ru: 'Телец и Рыбы - романтический дуэт!'
    },
    medium: {
      sr: 'Bik je praktičan, Ribe sanjarke. Spojite snove sa akcijom.',
      en: 'Taurus is practical, Pisces is dreamy. Connect dreams with action.',
      fr: 'Taureau est pratique, Poissons est rêveur.',
      de: 'Stier ist praktisch, Fische ist verträumt.',
      es: 'Tauro es práctico, Piscis es soñador.',
      ru: 'Телец практичен, Рыбы мечтательны.'
    },
    low: {
      sr: 'Bik može biti previše grub za osetljive Ribe. Vežbajte nežnost.',
      en: 'Taurus can be too rough for sensitive Pisces. Practice gentleness.',
      fr: 'Taureau peut être trop dur pour les Poissons sensibles.',
      de: 'Stier kann zu grob für die sensiblen Fische sein.',
      es: 'Tauro puede ser demasiado duro para el sensible Piscis.',
      ru: 'Телец может быть слишком груб для чувствительных Рыб.'
    }
  },
  'virgo-cancer': {
    high: {
      sr: 'Devica i Rak su brižni par! Zajedno se starate jedno o drugom sa puno ljubavi.',
      en: 'Virgo and Cancer are a caring couple! Together you take care of each other with lots of love.',
      fr: 'Vierge et Cancer sont un couple attentionné!',
      de: 'Jungfrau und Krebs sind ein fürsorgliches Paar!',
      es: '¡Virgo y Cáncer son una pareja cariñosa!',
      ru: 'Дева и Рак - заботливая пара!'
    },
    medium: {
      sr: 'Devica je kritična, Rak osetljiv. Pazite na ton i budite nežniji.',
      en: 'Virgo is critical, Cancer is sensitive. Watch your tone and be gentler.',
      fr: 'Vierge est critique, Cancer est sensible.',
      de: 'Jungfrau ist kritisch, Krebs ist empfindlich.',
      es: 'Virgo es crítico, Cáncer es sensible.',
      ru: 'Дева критична, Рак чувствителен.'
    },
    low: {
      sr: 'Devicina kritika može povrediti Raka duboko. Naučite konstruktivnu komunikaciju.',
      en: 'Virgo\'s criticism can hurt Cancer deeply. Learn constructive communication.',
      fr: 'La critique de Vierge peut blesser profondément Cancer.',
      de: 'Jungfraus Kritik kann Krebs tief verletzen.',
      es: 'La crítica de Virgo puede herir profundamente a Cáncer.',
      ru: 'Критика Девы может глубоко ранить Рака.'
    }
  },
  'virgo-scorpio': {
    high: {
      sr: 'Devica i Škorpija su intenzivan i analitičan par! Zajedno prodirte u dubine.',
      en: 'Virgo and Scorpio are an intense and analytical couple! Together you go deep.',
      fr: 'Vierge et Scorpion sont un couple intense et analytique!',
      de: 'Jungfrau und Skorpion sind ein intensives und analytisches Paar!',
      es: '¡Virgo y Escorpio son una pareja intensa y analítica!',
      ru: 'Дева и Скорпион - интенсивная и аналитическая пара!'
    },
    medium: {
      sr: 'Oba znaka su perfekcionisti. Naučite da prihvatite nesavršenosti jedno drugog.',
      en: 'Both signs are perfectionists. Learn to accept each other\'s imperfections.',
      fr: 'Les deux signes sont perfectionnistes.',
      de: 'Beide Zeichen sind Perfektionisten.',
      es: 'Ambos signos son perfeccionistas.',
      ru: 'Оба знака - перфекционисты.'
    },
    low: {
      sr: 'Devica kritikuje, Škorpija se osveti. Opasna dinamika - radite na poštovanju.',
      en: 'Virgo criticizes, Scorpio retaliates. Dangerous dynamic - work on respect.',
      fr: 'Vierge critique, Scorpion se venge.',
      de: 'Jungfrau kritisiert, Skorpion revanchiert sich.',
      es: 'Virgo critica, Escorpio se venga.',
      ru: 'Дева критикует, Скорпион мстит.'
    }
  },
  'virgo-pisces': {
    high: {
      sr: 'Devica i Ribe su suprotnosti koje se privlače! Vaša veza je balans između snova i realnosti.',
      en: 'Virgo and Pisces are opposites that attract! Your relationship is a balance between dreams and reality.',
      fr: 'Vierge et Poissons sont des opposés qui s\'attirent!',
      de: 'Jungfrau und Fische sind Gegensätze, die sich anziehen!',
      es: '¡Virgo y Piscis son opuestos que se atraen!',
      ru: 'Дева и Рыбы - противоположности, которые притягиваются!'
    },
    medium: {
      sr: 'Devica je analitična, Ribe intuitivne. Naučite od jedno drugog.',
      en: 'Virgo is analytical, Pisces is intuitive. Learn from each other.',
      fr: 'Vierge est analytique, Poissons est intuitif.',
      de: 'Jungfrau ist analytisch, Fische ist intuitiv.',
      es: 'Virgo es analítico, Piscis es intuitivo.',
      ru: 'Дева аналитична, Рыбы интуитивны.'
    },
    low: {
      sr: 'Devicina kritika može slomiti osetljive Ribe. Budite nežniji.',
      en: 'Virgo\'s criticism can break sensitive Pisces. Be gentler.',
      fr: 'La critique de Vierge peut briser les Poissons sensibles.',
      de: 'Jungfraus Kritik kann die sensiblen Fische brechen.',
      es: 'La crítica de Virgo puede romper al sensible Piscis.',
      ru: 'Критика Девы может сломить чувствительных Рыб.'
    }
  },
  'capricorn-cancer': {
    high: {
      sr: 'Jarac i Rak su suprotnosti koje grade zajedno! Ambicija i briga stvaraju sigurnost.',
      en: 'Capricorn and Cancer are opposites that build together! Ambition and care create security.',
      fr: 'Capricorne et Cancer sont des opposés qui construisent ensemble!',
      de: 'Steinbock und Krebs sind Gegensätze, die zusammen bauen!',
      es: '¡Capricornio y Cáncer son opuestos que construyen juntos!',
      ru: 'Козерог и Рак - противоположности, которые строят вместе!'
    },
    medium: {
      sr: 'Jarac je fokusiran na karijeru, Rak na porodicu. Balansrajte obe sfere.',
      en: 'Capricorn focuses on career, Cancer on family. Balance both spheres.',
      fr: 'Capricorne se concentre sur la carrière, Cancer sur la famille.',
      de: 'Steinbock konzentriert sich auf Karriere, Krebs auf Familie.',
      es: 'Capricornio se enfoca en la carrera, Cáncer en la familia.',
      ru: 'Козерог сосредоточен на карьере, Рак - на семье.'
    },
    low: {
      sr: 'Jarac je hladan, Raku treba toplina. Radite na emotivnoj povezanosti.',
      en: 'Capricorn is cold, Cancer needs warmth. Work on emotional connection.',
      fr: 'Capricorne est froid, Cancer a besoin de chaleur.',
      de: 'Steinbock ist kalt, Krebs braucht Wärme.',
      es: 'Capricornio es frío, Cáncer necesita calidez.',
      ru: 'Козерог холоден, Раку нужно тепло.'
    }
  },
  'capricorn-scorpio': {
    high: {
      sr: 'Jarac i Škorpija su moćan duo! Ambicija i intenzitet zajedno osvajaju svet.',
      en: 'Capricorn and Scorpio are a powerful duo! Ambition and intensity together conquer the world.',
      fr: 'Capricorne et Scorpion sont un duo puissant!',
      de: 'Steinbock und Skorpion sind ein mächtiges Duo!',
      es: '¡Capricornio y Escorpio son un dúo poderoso!',
      ru: 'Козерог и Скорпион - мощный дуэт!'
    },
    medium: {
      sr: 'Oba znaka su ambiciozna i tajnovita. Gradite poverenje otvorenom komunikacijom.',
      en: 'Both signs are ambitious and secretive. Build trust through open communication.',
      fr: 'Les deux signes sont ambitieux et secrets.',
      de: 'Beide Zeichen sind ehrgeizig und geheimnisvoll.',
      es: 'Ambos signos son ambiciosos y reservados.',
      ru: 'Оба знака амбициозны и скрытны.'
    },
    low: {
      sr: 'Previše fokusa na moć i kontrolu. Ne zaboravite na ljubav i nežnost.',
      en: 'Too much focus on power and control. Don\'t forget love and tenderness.',
      fr: 'Trop de concentration sur le pouvoir et le contrôle.',
      de: 'Zu viel Fokus auf Macht und Kontrolle.',
      es: 'Demasiado enfoque en el poder y el control.',
      ru: 'Слишком много внимания власти и контролю.'
    }
  },
  'capricorn-pisces': {
    high: {
      sr: 'Jarac i Ribe se idealno dopunjuju! Jarac uzemljuje Ribine snove.',
      en: 'Capricorn and Pisces complement each other ideally! Capricorn grounds Pisces\' dreams.',
      fr: 'Capricorne et Poissons se complètent idéalement!',
      de: 'Steinbock und Fische ergänzen sich ideal!',
      es: '¡Capricornio y Piscis se complementan idealmente!',
      ru: 'Козерог и Рыбы идеально дополняют друг друга!'
    },
    medium: {
      sr: 'Jarac je praktičan, Ribe sanjarke. Spojite snove sa akcijom.',
      en: 'Capricorn is practical, Pisces is dreamy. Connect dreams with action.',
      fr: 'Capricorne est pratique, Poissons est rêveur.',
      de: 'Steinbock ist praktisch, Fische ist verträumt.',
      es: 'Capricornio es práctico, Piscis es soñador.',
      ru: 'Козерог практичен, Рыбы мечтательны.'
    },
    low: {
      sr: 'Jarac je previše hladan za emotivne Ribe. Radite na toplini.',
      en: 'Capricorn is too cold for emotional Pisces. Work on warmth.',
      fr: 'Capricorne est trop froid pour les Poissons émotionnels.',
      de: 'Steinbock ist zu kalt für die emotionalen Fische.',
      es: 'Capricornio es demasiado frío para el emocional Piscis.',
      ru: 'Козерог слишком холоден для эмоциональных Рыб.'
    }
  },

  // Air + Water (challenging)
  'gemini-cancer': {
    high: {
      sr: 'Blizanci i Rak - um susreće srce! Kada se razumete, magija.',
      en: 'Gemini and Cancer - mind meets heart! When you understand each other, magic.',
      fr: 'Gémeaux et Cancer - l\'esprit rencontre le cœur!',
      de: 'Zwillinge und Krebs - Verstand trifft Herz!',
      es: '¡Géminis y Cáncer - la mente se encuentra con el corazón!',
      ru: 'Близнецы и Рак - ум встречает сердце!'
    },
    medium: {
      sr: 'Blizanci su lagani, Rak duboko oseća. Naučite da komunicirate na oba nivoa.',
      en: 'Gemini is light, Cancer feels deeply. Learn to communicate on both levels.',
      fr: 'Gémeaux est léger, Cancer ressent profondément.',
      de: 'Zwillinge ist leicht, Krebs fühlt tief.',
      es: 'Géminis es ligero, Cáncer siente profundamente.',
      ru: 'Близнецы легки, Рак глубоко чувствует.'
    },
    low: {
      sr: 'Blizanci mogu biti previše površni za emotivnog Raka. Radite na dubini.',
      en: 'Gemini can be too superficial for emotional Cancer. Work on depth.',
      fr: 'Gémeaux peut être trop superficiel pour le Cancer émotionnel.',
      de: 'Zwillinge kann zu oberflächlich für den emotionalen Krebs sein.',
      es: 'Géminis puede ser demasiado superficial para el emocional Cáncer.',
      ru: 'Близнецы могут быть слишком поверхностны для эмоционального Рака.'
    }
  },
  'gemini-scorpio': {
    high: {
      sr: 'Blizanci i Škorpija - lakost susreće dubinu! Fascinantna kombinacija.',
      en: 'Gemini and Scorpio - lightness meets depth! A fascinating combination.',
      fr: 'Gémeaux et Scorpion - la légèreté rencontre la profondeur!',
      de: 'Zwillinge und Skorpion - Leichtigkeit trifft Tiefe!',
      es: '¡Géminis y Escorpio - la ligereza se encuentra con la profundidad!',
      ru: 'Близнецы и Скорпион - легкость встречает глубину!'
    },
    medium: {
      sr: 'Blizanci flertuju, Škorpija je ljubomorna. Gradite poverenje polako.',
      en: 'Gemini flirts, Scorpio is jealous. Build trust slowly.',
      fr: 'Gémeaux flirte, Scorpion est jaloux.',
      de: 'Zwillinge flirtet, Skorpion ist eifersüchtig.',
      es: 'Géminis coquetea, Escorpio es celoso.',
      ru: 'Близнецы флиртуют, Скорпион ревнует.'
    },
    low: {
      sr: 'Škorpijina ljubomora može ugušiti Blizance. Ozbiljan konflikt.',
      en: 'Scorpio\'s jealousy can suffocate Gemini. Serious conflict.',
      fr: 'La jalousie du Scorpion peut étouffer Gémeaux.',
      de: 'Skorpions Eifersucht kann Zwillinge ersticken.',
      es: 'Los celos de Escorpio pueden asfixiar a Géminis.',
      ru: 'Ревность Скорпиона может задушить Близнецов.'
    }
  },
  'gemini-pisces': {
    high: {
      sr: 'Blizanci i Ribe - dva promenljiva znaka! Kreativnost i mašta zajedno.',
      en: 'Gemini and Pisces - two mutable signs! Creativity and imagination together.',
      fr: 'Gémeaux et Poissons - deux signes mutables!',
      de: 'Zwillinge und Fische - zwei veränderliche Zeichen!',
      es: '¡Géminis y Piscis - dos signos mutables!',
      ru: 'Близнецы и Рыбы - два изменчивых знака!'
    },
    medium: {
      sr: 'Oba znaka su promenljiva, što može stvoriti nestabilnost. Gradite temelje.',
      en: 'Both signs are changeable, which can create instability. Build foundations.',
      fr: 'Les deux signes sont changeants, ce qui peut créer de l\'instabilité.',
      de: 'Beide Zeichen sind wechselhaft, was Instabilität schaffen kann.',
      es: 'Ambos signos son cambiantes, lo que puede crear inestabilidad.',
      ru: 'Оба знака изменчивы, что может создать нестабильность.'
    },
    low: {
      sr: 'Previše haosa i bez temelja. Postavite jasne granice i ciljeve.',
      en: 'Too much chaos and no foundation. Set clear boundaries and goals.',
      fr: 'Trop de chaos et pas de fondation.',
      de: 'Zu viel Chaos und kein Fundament.',
      es: 'Demasiado caos y sin fundamento.',
      ru: 'Слишком много хаоса и нет основы.'
    }
  },
  'libra-cancer': {
    high: {
      sr: 'Vaga i Rak - harmonija i briga! Zajedno stvarate topao i lep dom.',
      en: 'Libra and Cancer - harmony and care! Together you create a warm and beautiful home.',
      fr: 'Balance et Cancer - harmonie et attention!',
      de: 'Waage und Krebs - Harmonie und Fürsorge!',
      es: '¡Libra y Cáncer - armonía y cuidado!',
      ru: 'Весы и Рак - гармония и забота!'
    },
    medium: {
      sr: 'Vaga je društvena, Rak je porodičan. Balansrajte između kuće i sveta.',
      en: 'Libra is social, Cancer is family-oriented. Balance between home and world.',
      fr: 'Balance est sociale, Cancer est familial.',
      de: 'Waage ist gesellig, Krebs ist familienorientiert.',
      es: 'Libra es social, Cáncer es familiar.',
      ru: 'Весы общительны, Рак ориентирован на семью.'
    },
    low: {
      sr: 'Vaga izbegava konflikt, Rak se povlači. Komunikacija može patiti.',
      en: 'Libra avoids conflict, Cancer withdraws. Communication can suffer.',
      fr: 'Balance évite le conflit, Cancer se retire.',
      de: 'Waage meidet Konflikt, Krebs zieht sich zurück.',
      es: 'Libra evita el conflicto, Cáncer se retira.',
      ru: 'Весы избегают конфликтов, Рак замыкается.'
    }
  },
  'libra-scorpio': {
    high: {
      sr: 'Vaga i Škorpija - elegancija susreće intenzitet! Fascinantan par.',
      en: 'Libra and Scorpio - elegance meets intensity! A fascinating couple.',
      fr: 'Balance et Scorpion - l\'élégance rencontre l\'intensité!',
      de: 'Waage und Skorpion - Eleganz trifft Intensität!',
      es: '¡Libra y Escorpio - la elegancia se encuentra con la intensidad!',
      ru: 'Весы и Скорпион - элегантность встречает интенсивность!'
    },
    medium: {
      sr: 'Vaga želi harmoniju, Škorpija intenzitet. Pronađite sredinu.',
      en: 'Libra wants harmony, Scorpio wants intensity. Find a middle ground.',
      fr: 'Balance veut l\'harmonie, Scorpion veut l\'intensité.',
      de: 'Waage will Harmonie, Skorpion will Intensität.',
      es: 'Libra quiere armonía, Escorpio quiere intensidad.',
      ru: 'Весы хотят гармонии, Скорпион - интенсивности.'
    },
    low: {
      sr: 'Škorpija je previše intenzivna za laganu Vagu. Stres i konfuzija.',
      en: 'Scorpio is too intense for light Libra. Stress and confusion.',
      fr: 'Scorpion est trop intense pour la légère Balance.',
      de: 'Skorpion ist zu intensiv für die leichte Waage.',
      es: 'Escorpio es demasiado intenso para la ligera Libra.',
      ru: 'Скорпион слишком интенсивен для легких Весов.'
    }
  },
  'libra-pisces': {
    high: {
      sr: 'Vaga i Ribe - romantičan duo! Delite ljubav prema lepoti i harmoniji.',
      en: 'Libra and Pisces - a romantic duo! You share love for beauty and harmony.',
      fr: 'Balance et Poissons - un duo romantique!',
      de: 'Waage und Fische - ein romantisches Duo!',
      es: '¡Libra y Piscis - un dúo romántico!',
      ru: 'Весы и Рыбы - романтический дуэт!'
    },
    medium: {
      sr: 'Oba znaka mogu biti neodlučni. Naučite da donosite odluke zajedno.',
      en: 'Both signs can be indecisive. Learn to make decisions together.',
      fr: 'Les deux signes peuvent être indécis.',
      de: 'Beide Zeichen können unentschlossen sein.',
      es: 'Ambos signos pueden ser indecisos.',
      ru: 'Оба знака могут быть нерешительными.'
    },
    low: {
      sr: 'Previše mašte, premalo akcije. Ko će voditi? Postavite jasne uloge.',
      en: 'Too much imagination, too little action. Who will lead? Set clear roles.',
      fr: 'Trop d\'imagination, pas assez d\'action.',
      de: 'Zu viel Fantasie, zu wenig Aktion.',
      es: 'Demasiada imaginación, poca acción.',
      ru: 'Слишком много воображения, мало действий.'
    }
  },
  'aquarius-cancer': {
    high: {
      sr: 'Vodolija i Rak - inovacija susreće brigu! Neobična ali zanimljiva kombinacija.',
      en: 'Aquarius and Cancer - innovation meets care! An unusual but interesting combination.',
      fr: 'Verseau et Cancer - l\'innovation rencontre l\'attention!',
      de: 'Wassermann und Krebs - Innovation trifft Fürsorge!',
      es: '¡Acuario y Cáncer - la innovación se encuentra con el cuidado!',
      ru: 'Водолей и Рак - инновации встречают заботу!'
    },
    medium: {
      sr: 'Vodolija je distancirana, Rak emotivan. Radite na emotivnoj povezanosti.',
      en: 'Aquarius is distant, Cancer is emotional. Work on emotional connection.',
      fr: 'Verseau est distant, Cancer est émotionnel.',
      de: 'Wassermann ist distanziert, Krebs ist emotional.',
      es: 'Acuario es distante, Cáncer es emocional.',
      ru: 'Водолей отстранен, Рак эмоционален.'
    },
    low: {
      sr: 'Previše različiti. Vodolija može biti hladna za emotivnog Raka.',
      en: 'Too different. Aquarius can be cold for emotional Cancer.',
      fr: 'Trop différents.',
      de: 'Zu unterschiedlich.',
      es: 'Demasiado diferentes.',
      ru: 'Слишком разные.'
    }
  },
  'aquarius-scorpio': {
    high: {
      sr: 'Vodolija i Škorpija - dva fiksna znaka! Intenzivna i transformativna veza.',
      en: 'Aquarius and Scorpio - two fixed signs! An intense and transformative relationship.',
      fr: 'Verseau et Scorpion - deux signes fixes!',
      de: 'Wassermann und Skorpion - zwei fixe Zeichen!',
      es: '¡Acuario y Escorpio - dos signos fijos!',
      ru: 'Водолей и Скорпион - два фиксированных знака!'
    },
    medium: {
      sr: 'Oba znaka su tvrdoglava. Naučite kompromis i popuštanje.',
      en: 'Both signs are stubborn. Learn compromise and yielding.',
      fr: 'Les deux signes sont têtus.',
      de: 'Beide Zeichen sind stur.',
      es: 'Ambos signos son tercos.',
      ru: 'Оба знака упрямы.'
    },
    low: {
      sr: 'Borba za kontrolu. Dva fiksna znaka koji ne popuštaju.',
      en: 'Power struggle. Two fixed signs that won\'t budge.',
      fr: 'Lutte pour le contrôle.',
      de: 'Machtkampf.',
      es: 'Lucha por el control.',
      ru: 'Борьба за контроль.'
    }
  },
  'aquarius-pisces': {
    high: {
      sr: 'Vodolija i Ribe - vizionari! Delite ljubav prema humanitarnim idealima.',
      en: 'Aquarius and Pisces - visionaries! You share love for humanitarian ideals.',
      fr: 'Verseau et Poissons - visionnaires!',
      de: 'Wassermann und Fische - Visionäre!',
      es: '¡Acuario y Piscis - visionarios!',
      ru: 'Водолей и Рыбы - визионеры!'
    },
    medium: {
      sr: 'Vodolija je intelektualna, Ribe emotivne. Spojite um i srce.',
      en: 'Aquarius is intellectual, Pisces is emotional. Connect mind and heart.',
      fr: 'Verseau est intellectuel, Poissons est émotionnel.',
      de: 'Wassermann ist intellektuell, Fische ist emotional.',
      es: 'Acuario es intelectual, Piscis es emocional.',
      ru: 'Водолей интеллектуален, Рыбы эмоциональны.'
    },
    low: {
      sr: 'Vodolija je previše hladna za osetljive Ribe. Radite na toplini.',
      en: 'Aquarius is too cold for sensitive Pisces. Work on warmth.',
      fr: 'Verseau est trop froid pour les Poissons sensibles.',
      de: 'Wassermann ist zu kalt für die sensiblen Fische.',
      es: 'Acuario es demasiado frío para el sensible Piscis.',
      ru: 'Водолей слишком холоден для чувствительных Рыб.'
    }
  },
};

// Get description for a sign pair based on compatibility level
export const getCompatibilityDescription = (
  sign1: string,
  sign2: string,
  percentage: number,
  language: 'sr' | 'en' | 'fr' | 'de' | 'es' | 'ru'
): string => {
  const key = getSignPairKey(sign1, sign2);
  const level = getCompatibilityLevel(percentage);
  const descriptions = compatibilityDescriptions[key];

  if (descriptions && descriptions[level]) {
    return descriptions[level][language];
  }

  // Fallback descriptions based on level
  const fallbackDescriptions: { [level in CompatibilityLevel]: DescriptionSet } = {
    high: {
      sr: 'Vaša veza ima odličan potencijal! Uživajte u harmoniji i nastavite da gradite na ovoj vezi. Negujte iskren razgovor i zajedničke planove, jer tu najviše blistate.',
      en: 'Your relationship has excellent potential! Enjoy the harmony and continue building on this connection. Keep communication open and celebrate shared goals to deepen the bond.',
      fr: 'Votre relation a un excellent potentiel! Profitez de l\'harmonie. En cultivant la communication et des projets communs, le lien se renforcera.',
      de: 'Ihre Beziehung hat ausgezeichnetes Potenzial! Genießen Sie die Harmonie. Mit offener Kommunikation und gemeinsamen Zielen wächst die Verbindung weiter.',
      es: '¡Su relación tiene un excelente potencial! Disfruten de la armonía. Con comunicación abierta y metas compartidas, el vínculo se fortalece.',
      ru: 'У ваших отношений отличный потенциал! Наслаждайтесь гармонией. Открытый диалог и общие планы сделают связь еще крепче.'
    },
    medium: {
      sr: 'Vaši znakovi imaju jedinstvenu dinamiku. Sa trudom i razumevanjem možete stvoriti duboku vezu. Fokusirajte se na kompromis i poštovanje različitih potreba.',
      en: 'Your signs have a unique dynamic. With effort and understanding, you can create a deep connection. Focus on compromise and respecting each other\'s needs.',
      fr: 'Vos signes ont une dynamique unique. Avec effort et compréhension, vous pouvez créer une connexion profonde. Misez sur le compromis et le respect des besoins de l\'autre.',
      de: 'Ihre Zeichen haben eine einzigartige Dynamik. Mit Mühe und Verständnis können Sie eine tiefe Verbindung schaffen. Setzen Sie auf Kompromisse und Respekt für unterschiedliche Bedürfnisse.',
      es: 'Sus signos tienen una dinámica única. Con esfuerzo y comprensión, pueden crear una conexión profunda. Apuesten por el compromiso y el respeto de las necesidades del otro.',
      ru: 'У ваших знаков уникальная динамика. С усилием и пониманием вы можете создать глубокую связь. Делайте ставку на компромисс и уважение потребностей друг друга.'
    },
    low: {
      sr: 'Ova veza zahteva ozbiljan rad i kompromis. Fokusirajte se na komunikaciju i razumevanje razlika. Strpljenje i jasne granice mogu pomoći da se odnos stabilizuje.',
      en: 'This relationship requires serious work and compromise. Focus on communication and understanding differences. Patience and clear boundaries can help stabilize the connection.',
      fr: 'Cette relation nécessite un travail sérieux et des compromis. Concentrez-vous sur la communication et la compréhension des différences. La patience et des limites claires peuvent stabiliser le lien.',
      de: 'Diese Beziehung erfordert ernsthafte Arbeit und Kompromisse. Konzentrieren Sie sich auf Kommunikation und das Verständnis von Unterschieden. Geduld und klare Grenzen können Stabilität bringen.',
      es: 'Esta relación requiere trabajo serio y compromiso. Concéntrense en la comunicación y en comprender las diferencias. La paciencia y los límites claros pueden estabilizar el vínculo.',
      ru: 'Эти отношения требуют серьезной работы и компромиссов. Сосредоточьтесь на общении и понимании различий. Терпение и четкие границы помогут стабилизировать связь.'
    }
  };

  return fallbackDescriptions[level][language];
};
