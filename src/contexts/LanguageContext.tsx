import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'sr' | 'en' | 'fr' | 'de' | 'es' | 'ru';

interface Translations {
  [key: string]: {
    sr: string;
    en: string;
    fr: string;
    de: string;
    es: string;
    ru: string;
  };
}

export const translations: Translations = {
  // Brand
  'brand.name': { 
    sr: 'Astro whisper', 
    en: 'Astro whisper', 
    fr: 'Astro whisper', 
    de: 'Astro whisper', 
    es: 'Astro whisper', 
    ru: 'Astro whisper' 
  },
  // Navigation
  'nav.home': { 
    sr: 'Početna', 
    en: 'Home', 
    fr: 'Accueil', 
    de: 'Startseite', 
    es: 'Inicio', 
    ru: 'Главная' 
  },
  'nav.products': { 
    sr: 'Proizvodi', 
    en: 'Products', 
    fr: 'Produits', 
    de: 'Produkte', 
    es: 'Productos', 
    ru: 'Продукты' 
  },
  'nav.blog': { 
    sr: 'Blog', 
    en: 'Blog', 
    fr: 'Blog', 
    de: 'Blog', 
    es: 'Blog', 
    ru: 'Блог' 
  },
  'nav.about': { 
    sr: 'O nama', 
    en: 'About', 
    fr: 'À propos', 
    de: 'Über uns', 
    es: 'Sobre nosotros', 
    ru: 'О нас' 
  },
  'nav.contact': { 
    sr: 'Kontakt', 
    en: 'Contact', 
    fr: 'Contact', 
    de: 'Kontakt', 
    es: 'Contacto', 
    ru: 'Контакты' 
  },

  // Hero
  'hero.title': { 
    sr: 'Otkrij svoju kosmičku mapu', 
    en: 'Discover Your Cosmic Map', 
    fr: 'Découvrez votre carte cosmique', 
    de: 'Entdecke deine kosmische Karte', 
    es: 'Descubre tu mapa cósmico', 
    ru: 'Откройте свою космическую карту' 
  },
  'hero.subtitle': { 
    sr: 'Personalizovani astrološki izveštaji, konsultacije i ritualni setovi za vaše duhovno putovanje', 
    en: 'Personalized astrological reports, consultations and ritual sets for your spiritual journey', 
    fr: 'Rapports astrologiques personnalisés, consultations et ensembles rituels pour votre voyage spirituel', 
    de: 'Personalisierte astrologische Berichte, Beratungen und rituelle Sets für Ihre spirituelle Reise', 
    es: 'Informes astrológicos personalizados, consultas y sets rituales para tu viaje espiritual', 
    ru: 'Персонализированные астрологические отчеты, консультации и ритуальные наборы для вашего духовного путешествия' 
  },
  'hero.cta': { 
    sr: 'Započni putovanje', 
    en: 'Start Your Journey', 
    fr: 'Commencez votre voyage', 
    de: 'Beginne deine Reise', 
    es: 'Comienza tu viaje', 
    ru: 'Начни свое путешествие' 
  },

  // How it works
  'how.title': { 
    sr: 'Kako funkcioniše', 
    en: 'How It Works', 
    fr: 'Comment ça marche', 
    de: 'Wie es funktioniert', 
    es: 'Cómo funciona', 
    ru: 'Как это работает' 
  },
  'how.step1.title': { 
    sr: 'Unos podataka', 
    en: 'Enter Your Data', 
    fr: 'Entrez vos données', 
    de: 'Geben Sie Ihre Daten ein', 
    es: 'Ingresa tus datos', 
    ru: 'Введите ваши данные' 
  },
  'how.step1.desc': { 
    sr: 'Unesite datum, vreme i mesto rođenja', 
    en: 'Enter your birth date, time and place', 
    fr: 'Entrez votre date, heure et lieu de naissance', 
    de: 'Geben Sie Ihr Geburtsdatum, Uhrzeit und Ort ein', 
    es: 'Ingresa tu fecha, hora y lugar de nacimiento', 
    ru: 'Введите дату, время и место рождения' 
  },
  'how.step2.title': { 
    sr: 'Izbor paketa', 
    en: 'Choose Package', 
    fr: 'Choisissez un forfait', 
    de: 'Wählen Sie ein Paket', 
    es: 'Elige un paquete', 
    ru: 'Выберите пакет' 
  },
  'how.step2.desc': { 
    sr: 'Odaberite uslugu koja vam odgovara', 
    en: 'Select the service that suits you', 
    fr: 'Sélectionnez le service qui vous convient', 
    de: 'Wählen Sie den Service, der zu Ihnen passt', 
    es: 'Selecciona el servicio que te convenga', 
    ru: 'Выберите подходящую услугу' 
  },
  'how.step3.title': { 
    sr: 'Personalizovani izveštaj', 
    en: 'Personalized Report', 
    fr: 'Rapport personnalisé', 
    de: 'Personalisierter Bericht', 
    es: 'Informe personalizado', 
    ru: 'Персонализированный отчет' 
  },
  'how.step3.desc': { 
    sr: 'Primite detaljnu analizu vaše natalne karte', 
    en: 'Receive detailed analysis of your natal chart', 
    fr: 'Recevez une analyse détaillée de votre thème natal', 
    de: 'Erhalten Sie eine detaillierte Analyse Ihres Geburtshoroskops', 
    es: 'Recibe un análisis detallado de tu carta natal', 
    ru: 'Получите детальный анализ вашей натальной карты' 
  },

  // Product Groups
  'products.monthly': { 
    sr: 'Mesečna pretplata za dnevni horoskop', 
    en: 'Monthly subscription for daily horoscope', 
    fr: 'Abonnement mensuel au horoscope quotidien', 
    de: 'Monatsabo für tägliches Horoskop', 
    es: 'Suscripción mensual al horóscopo diario', 
    ru: 'Ежемесячная подписка на ежедневный гороскоп' 
  },
  'products.reports': { 
    sr: 'Astrološki izveštaji', 
    en: 'Astrological Reports', 
    fr: 'Rapports astrologiques', 
    de: 'Astrologische Berichte', 
    es: 'Informes astrológicos', 
    ru: 'Астрологические отчеты' 
  },
  'products.consultations': { 
    sr: 'Brze konsultacije', 
    en: 'Quick Consultations', 
    fr: 'Consultations rapides', 
    de: 'Schnelle Beratungen', 
    es: 'Consultas rápidas', 
    ru: 'Быстрые консультации' 
  },
  'products.featured': {
    sr: 'Izdvojene usluge',
    en: 'Featured Services',
    fr: 'Featured Services',
    de: 'Featured Services',
    es: 'Featured Services',
    ru: 'Featured Services'
  },
  'products.physical': { 
    sr: 'Fizički setovi', 
    en: 'Physical Sets', 
    fr: 'Ensembles physiques', 
    de: 'Physische Sets', 
    es: 'Sets físicos', 
    ru: 'Физические наборы' 
  },
  'products.viewAll': { 
    sr: 'Pogledaj sve', 
    en: 'View All', 
    fr: 'Voir tout', 
    de: 'Alle anzeigen', 
    es: 'Ver todo', 
    ru: 'Смотреть все' 
  },
  'products.order': { 
    sr: 'Naruči', 
    en: 'Order', 
    fr: 'Commander', 
    de: 'Bestellen', 
    es: 'Pedir', 
    ru: 'Заказать' 
  },
  'products.sale': {
    sr: 'Akcija',
    en: 'Sale',
    fr: 'Promo',
    de: 'Aktion',
    es: 'Oferta',
    ru: 'Акция'
  },
  'products.monthly.desc': { 
    sr: 'Osnovni ili premium dnevni horoskop za Vaš znak', 
    en: 'Basic or premium daily horoscope for your sign', 
    fr: 'Horoscope quotidien de base ou premium pour votre signe', 
    de: 'Basis- oder Premium-Tageshoroskop für Ihr Zeichen', 
    es: 'Horóscopo diario básico o premium para tu signo', 
    ru: 'Базовый или премиальный ежедневный гороскоп для вашего знака' 
  },
  'products.reports.desc': { 
    sr: 'Detaljni astrološki izveštaji i analize', 
    en: 'Detailed astrological reports and analyses', 
    fr: 'Rapports et analyses astrologiques détaillés', 
    de: 'Detaillierte astrologische Berichte und Analysen', 
    es: 'Informes y análisis astrológicos detallados', 
    ru: 'Подробные астрологические отчеты и анализы' 
  },
  'products.consultations.desc': { 
    sr: 'Brzi astrološki odgovori', 
    en: 'Quick astrological answers', 
    fr: 'Réponses astrologiques rapides', 
    de: 'Schnelle astrologische Antworten', 
    es: 'Respuestas astrológicas rápidas', 
    ru: 'Быстрые астрологические ответы' 
  },
  'products.physical.desc': { 
    sr: 'Kristali, sveće i ritualni setovi', 
    en: 'Crystals, candles and ritual sets', 
    fr: 'Cristaux, bougies et ensembles rituels', 
    de: 'Kristalle, Kerzen und rituelle Sets', 
    es: 'Cristales, velas y sets rituales', 
    ru: 'Кристаллы, свечи и ритуальные наборы' 
  },

  // Featured partner services
  'featured.partner.basic.title': {
    sr: 'Opis vašeg budućeg partnera',
    en: 'Future Partner Description',
    fr: 'Future Partner Description',
    de: 'Future Partner Description',
    es: 'Future Partner Description',
    ru: 'Future Partner Description'
  },
  'featured.partner.basic.desc': {
    sr: 'Kratak astro uvid u osobine i energiju budućeg partnera.',
    en: 'A short astro insight into the qualities and energy of your future partner.',
    fr: 'A short astro insight into the qualities and energy of your future partner.',
    de: 'A short astro insight into the qualities and energy of your future partner.',
    es: 'A short astro insight into the qualities and energy of your future partner.',
    ru: 'A short astro insight into the qualities and energy of your future partner.'
  },
  'featured.partner.when.title': {
    sr: 'Opis vašeg budućeg partnera i gde ćete ga upoznati',
    en: 'Future Partner + When You’ll Meet',
    fr: 'Future Partner + When You’ll Meet',
    de: 'Future Partner + When You’ll Meet',
    es: 'Future Partner + When You’ll Meet',
    ru: 'Future Partner + When You’ll Meet'
  },
  'featured.partner.when.desc': {
    sr: 'Uvid u osobine partnera i period kada je moguće upoznavanje.',
    en: 'Insight into partner traits and the likely period of meeting.',
    fr: 'Insight into partner traits and the likely period of meeting.',
    de: 'Insight into partner traits and the likely period of meeting.',
    es: 'Insight into partner traits and the likely period of meeting.',
    ru: 'Insight into partner traits and the likely period of meeting.'
  },

  // Monthly packages
  'monthly.basic.title': { 
    sr: 'Osnovni paket', 
    en: 'Basic Package', 
    fr: 'Forfait de base', 
    de: 'Basispaket', 
    es: 'Paquete básico', 
    ru: 'Базовый пакет' 
  },
  'monthly.basic.desc': { 
    sr: 'Dnevni horoskop za Vaš znak', 
    en: 'Daily horoscope for your sign', 
    fr: 'Horoscope quotidien pour votre signe', 
    de: 'Tägliches Horoskop für Ihr Zeichen', 
    es: 'Horóscopo diario para tu signo', 
    ru: 'Ежедневный гороскоп для вашего знака' 
  },
  'monthly.premium.title': { 
    sr: 'Premium paket', 
    en: 'Premium Package', 
    fr: 'Forfait Premium', 
    de: 'Premium-Paket', 
    es: 'Paquete Premium', 
    ru: 'Премиум пакет' 
  },
  'monthly.premium.desc': { 
    sr: 'Detaljniji dnevni horoskop za Vaš znak', 
    en: 'More detailed daily horoscope for your sign', 
    fr: 'Horoscope quotidien plus détaillé pour votre signe', 
    de: 'Detaillierteres tägliches Horoskop für Ihr Zeichen', 
    es: 'Horóscopo diario más detallado para tu signo', 
    ru: 'Более подробный ежедневный гороскоп для вашего знака' 
  },
  'monthly.perMonth': { 
    sr: 'mesečno', 
    en: 'per month', 
    fr: 'par mois', 
    de: 'pro Monat', 
    es: 'por mes', 
    ru: 'в месяц' 
  },

  // Reports
  'reports.natal.title': { 
    sr: 'Analiza natalne karte', 
    en: 'Natal Chart Analysis', 
    fr: 'Analyse du thème natal', 
    de: 'Analyse des Geburtshoroskops', 
    es: 'Análisis de la carta natal', 
    ru: 'Анализ натальной карты' 
  },
  'reports.natal.desc': { 
    sr: 'Natalna karta pokazuje naše talente, izazove, emotivne obrasce, način razmišljanja, odnose, karijeru i životni put. Detaljna analiza natalne karte pomaže u boljem razumevanju sebe, sopstvenih izbora i pravca u kom se život razvija.', 
    en: 'The natal chart reveals talents, challenges, emotional patterns, mindset, relationships, career, and life path. A detailed analysis helps you understand yourself, your choices, and the direction your life is taking.', 
    fr: 'Le thème natal révèle talents, défis, schémas émotionnels, façon de penser, relations, carrière et chemin de vie. Une analyse détaillée aide à mieux se comprendre et à clarifier ses choix.', 
    de: 'Das Geburtshoroskop zeigt Talente, Herausforderungen, emotionale Muster, Denkweise, Beziehungen, Karriere und Lebensweg. Eine detaillierte Analyse hilft, sich selbst und die eigenen Entscheidungen besser zu verstehen.', 
    es: 'La carta natal revela talentos, desafíos, patrones emocionales, forma de pensar, relaciones, carrera y rumbo de vida. Un análisis detallado ayuda a comprenderte mejor y a orientar tus decisiones.', 
    ru: 'Натальная карта показывает таланты, вызовы, эмоциональные модели, мышление, отношения, карьеру и жизненный путь. Подробный анализ помогает лучше понять себя и направление жизни.' 
  },
  'reports.yearly.title': { 
    sr: 'Godišnja Astro analiza natalne karte', 
    en: 'Yearly Natal Chart Astro Analysis', 
    fr: 'Analyse annuelle du thème natal', 
    de: 'Jahresanalyse des Geburtshoroskops', 
    es: 'Análisis anual de la carta natal', 
    ru: 'Годовой астроанализ натальной карты' 
  },
  'reports.yearly.desc': { 
    sr: 'Godišnja analiza ili godišnji horoskop je opšti pregled godine na osnovu tranzita planeta kroz tvoj natalni horoskop. Pokazuje ti šta će ti biti u fokusu te godine (ljubav, posao, zdravlje, lični razvoj...), koje prilike će se otvarati i na šta treba da obratiš pažnju.', 
    en: 'The yearly analysis or yearly horoscope is a general overview of the year based on planetary transits through your natal chart. It shows what will be in focus (love, work, health, personal growth...), which opportunities may open, and what to pay attention to.', 
    fr: 'L’analyse annuelle, ou horoscope annuel, est un aperçu de l’année basé sur les transits planétaires dans votre thème natal. Elle montre ce qui sera au centre (amour, travail, santé, développement personnel...) et où porter votre attention.', 
    de: 'Die Jahresanalyse ist ein Überblick über das Jahr anhand der Planetentransite in Ihrem Geburtshoroskop. Sie zeigt Schwerpunkte (Liebe, Arbeit, Gesundheit, persönliche Entwicklung...) sowie Chancen und worauf Sie achten sollten.', 
    es: 'El análisis anual es una visión general del año basada en los tránsitos planetarios por tu carta natal. Muestra qué estará en foco (amor, trabajo, salud, crecimiento personal...) y qué oportunidades pueden abrirse.', 
    ru: 'Годовой анализ — это общий обзор года на основе транзитов планет по вашей натальной карте. Он показывает ключевые темы (любовь, работа, здоровье, развитие...) и на что стоит обратить внимание.' 
  },
  'reports.solar.title': { 
    sr: 'Solarni horoskop', 
    en: 'Solar Return Horoscope', 
    fr: 'Horoscope solaire', 
    de: 'Solarhoroskop', 
    es: 'Horóscopo solar', 
    ru: 'Солярный гороскоп' 
  },
  'reports.solar.desc': { 
    sr: 'Solarni horoskop je lični horoskop koji se gleda od rođendana do rođendana. Radi se za tačan trenutak kada se Sunce vrati na isti stepen na kom je bilo u tvom natalu. Solar ti pokazuje kakva će ti biti ta godina na ličnom planu, kakve promene i prekretnice su moguće. Solar je konkretniji i precizniji od godišnjeg horoskopa.', 
    en: 'A personal horoscope from birthday to birthday, calculated for the exact moment the Sun returns to the same degree as in your natal chart. It shows the year’s themes, changes, and turning points. It is more concrete and precise than the yearly horoscope.', 
    fr: 'Un horoscope personnel de date d’anniversaire à date d’anniversaire, calculé au moment exact où le Soleil revient au même degré. Il montre les thèmes, changements et tournants possibles de l’année. Il est plus concret et précis que l’horoscope annuel.', 
    de: 'Ein persönliches Horoskop von Geburtstag zu Geburtstag, berechnet für den exakten Moment der Sonnenrückkehr. Es zeigt Themen, Veränderungen und mögliche Wendepunkte des Jahres und ist konkreter als der Jahresausblick.', 
    es: 'Un horóscopo personal de cumpleaños a cumpleaños, calculado en el momento exacto en que el Sol regresa al mismo grado natal. Muestra temas, cambios y posibles giros del año. Es más concreto que el horóscopo anual.', 
    ru: 'Личный гороскоп от дня рождения до дня рождения, рассчитанный на момент возвращения Солнца в тот же градус. Он показывает темы, изменения и возможные поворотные моменты года и более точен, чем годовой прогноз.' 
  },
  'reports.synastry.title': { 
    sr: 'Uporedni horoskop i Sinastrija', 
    en: 'Relationship Horoscope & Synastry', 
    fr: 'Horoscope comparé et synastrie', 
    de: 'Partnerhoroskop und Synastrie', 
    es: 'Horóscopo comparativo y sinastría', 
    ru: 'Сравнительный гороскоп и синастрия' 
  },
  'reports.synastry.desc': { 
    sr: 'Detaljna astrološka analiza odnosa između dve osobe. Pokazuje kako se dve osobe međusobno doživljavaju, gde postoji sklad, a gde tenzija, i da li postoji potencijal za vezu, brak, saradnju ili karmički odnos. Posmatraju se aspekti između planeta obe natalne karte, emotivne i psihološke veze. Ova analiza daje odgovor na pitanja zašto se dve osobe snažno privlače, gde postoji sklad a gde izazovi, u kom pravcu odnos može da se razvija i da li je odnos karmički.', 
    en: 'A detailed astrological analysis of the relationship between two people. It shows how they perceive each other, where harmony and tension exist, and whether there is potential for a relationship, marriage, cooperation, or a karmic bond. It examines aspects between both natal charts and emotional/psychological ties.', 
    fr: 'Une analyse astrologique détaillée de la relation entre deux personnes. Elle montre la perception mutuelle, où se trouvent l’harmonie et les tensions, et s’il existe un potentiel de relation, mariage, collaboration ou lien karmique. Elle étudie les aspects entre les deux thèmes natals et les liens émotionnels.', 
    de: 'Eine detaillierte astrologische Analyse der Beziehung zwischen zwei Personen. Sie zeigt Wahrnehmung, Harmonie und Spannung sowie das Potenzial für Beziehung, Ehe, Zusammenarbeit oder karmische Verbindung. Analysiert werden die Aspekte zwischen beiden Geburtshoroskopen und die emotionalen Bindungen.', 
    es: 'Un análisis astrológico detallado de la relación entre dos personas. Muestra cómo se perciben, dónde hay armonía y tensión y si existe potencial de relación, matrimonio, colaboración o vínculo kármico. Analiza los aspectos entre ambas cartas natales.', 
    ru: 'Подробный астрологический анализ отношений между двумя людьми. Он показывает, как они воспринимают друг друга, где есть гармония и напряжение и есть ли потенциал для отношений, брака, сотрудничества или кармической связи.' 
  },
  'reports.questions.title': { 
    sr: 'Pojedinačna Astro pitanja (ljubav, zdravlje, posao..)', 
    en: 'Single Astro Questions (love, health, work...)', 
    fr: 'Questions astro individuelles (amour, santé, travail...)', 
    de: 'Einzelne Astro-Fragen (Liebe, Gesundheit, Beruf...)', 
    es: 'Preguntas astro individuales (amor, salud, trabajo...)', 
    ru: 'Индивидуальные астрологические вопросы (любовь, здоровье, работа...)' 
  },
  'reports.questions.desc': { 
    sr: 'Ova usluga omogućava ti brz i precizan astrološki odgovor na jedno konkretno pitanje iz oblasti ljubavi, karijere ili zdravlja. Na osnovu tvoje natalne karte i analize tranzita dobićeš jasan uvid u situaciju, savete i smernice za donošenje odluka.', 
    en: 'This service provides a quick and precise astrological answer to one specific question in love, career, or health. Based on your natal chart and transit analysis, you receive clear insight and guidance for decisions.', 
    fr: 'Ce service offre une réponse astrologique rapide et précise à une question précise sur l’amour, la carrière ou la santé. Basée sur votre thème natal et les transits, elle apporte des conseils clairs.', 
    de: 'Dieser Service liefert eine schnelle und präzise astrologische Antwort auf eine konkrete Frage zu Liebe, Karriere oder Gesundheit. Basierend auf Geburtshoroskop und Transiten erhalten Sie klare Hinweise.', 
    es: 'Este servicio ofrece una respuesta astrológica rápida y precisa a una pregunta concreta sobre amor, carrera o salud. Basado en tu carta natal y los tránsitos, recibes orientación clara.', 
    ru: 'Эта услуга дает быстрый и точный ответ на один конкретный вопрос о любви, карьере или здоровье. На основе натальной карты и транзитов вы получите четкие рекомендации.' 
  },
  'reports.bundle': { 
    sr: '3 izveštaja po ceni 2', 
    en: '3 reports for the price of 2', 
    fr: '3 rapports pour le prix de 2', 
    de: '3 Berichte zum Preis von 2', 
    es: '3 informes por el precio de 2', 
    ru: '3 отчета по цене 2' 
  },

  // Consultations
  'consult.email.title': { 
    sr: 'Astro-odgovor (24h)', 
    en: 'Astro Answer (24h)', 
    fr: 'Réponse astro (24h)', 
    de: 'Astro-Antwort (24h)', 
    es: 'Respuesta astro (24h)', 
    ru: 'Астро-ответ (24ч)' 
  },
  'consult.email.desc': { 
    sr: 'Brzi astrološki odgovor putem e-maila u roku od 24 sata', 
    en: 'Quick astrological answer via email within 24 hours', 
    fr: 'Réponse astrologique rapide par e-mail dans les 24 heures', 
    de: 'Schnelle astrologische Antwort per E-Mail innerhalb von 24 Stunden', 
    es: 'Respuesta astrológica rápida por correo electrónico en 24 horas', 
    ru: 'Быстрый астрологический ответ по электронной почте в течение 24 часов' 
  },
  'consult.vip.title': { 
    sr: 'VIP odgovor (1h)', 
    en: 'VIP Answer (1h)', 
    fr: 'Réponse VIP (1h)', 
    de: 'VIP-Antwort (1h)', 
    es: 'Respuesta VIP (1h)', 
    ru: 'VIP-ответ (1ч)' 
  },
  'consult.vip.desc': { 
    sr: 'Prioritetni odgovor u roku od jednog sata', 
    en: 'Priority answer within one hour', 
    fr: 'Réponse prioritaire dans l\'heure', 
    de: 'Prioritätsantwort innerhalb einer Stunde', 
    es: 'Respuesta prioritaria en una hora', 
    ru: 'Приоритетный ответ в течение часа' 
  },
  'consult.live.title': { 
    sr: 'Poziv sa astrologom (15 min)', 
    en: 'Astrologer Call (15 min)', 
    fr: 'Astrologer Call (15 min)', 
    de: 'Astrologer Call (15 min)', 
    es: 'Astrologer Call (15 min)', 
    ru: 'Astrologer Call (15 min)' 
  },
  'consult.live.desc': { 
    sr: '15-minutni poziv sa astrologom', 
    en: '15-minute call with an astrologer', 
    fr: '15-minute call with an astrologer', 
    de: '15-minute call with an astrologer', 
    es: '15-minute call with an astrologer', 
    ru: '15-minute call with an astrologer' 
  },
  'consult.note': { 
    sr: 'Svi odgovori se zasnivaju na natalnoj karti i aktuelnim tranzitima', 
    en: 'All answers are based on the natal chart and current transits', 
    fr: 'Toutes les réponses sont basées sur le thème natal et les transits actuels', 
    de: 'Alle Antworten basieren auf dem Geburtshoroskop und aktuellen Transiten', 
    es: 'Todas las respuestas se basan en la carta natal y los tránsitos actuales', 
    ru: 'Все ответы основаны на натальной карте и текущих транзитах' 
  },

  // Physical sets
  'physical.talisman.title': { 
    sr: 'Talisman set', 
    en: 'Talisman Set', 
    fr: 'Ensemble Talisman', 
    de: 'Talisman-Set', 
    es: 'Set Talismán', 
    ru: 'Набор Талисман' 
  },
  'physical.talisman.desc': { 
    sr: 'Sveća, kristal i mirisni štapići + skraćeni natalni izveštaj i afirmacije', 
    en: 'Candle, crystal and incense sticks + shortened natal report and affirmations', 
    fr: 'Bougie, cristal et bâtons d\'encens + rapport natal abrégé et affirmations', 
    de: 'Kerze, Kristall und Räucherstäbchen + verkürzter Natalbericht und Affirmationen', 
    es: 'Vela, cristal e incienso + informe natal abreviado y afirmaciones', 
    ru: 'Свеча, кристалл и благовония + сокращенный натальный отчет и аффирмации' 
  },
  'physical.crystal.title': { 
    sr: 'Premium kristal set', 
    en: 'Premium Crystal Set', 
    fr: 'Ensemble Cristal Premium', 
    de: 'Premium-Kristall-Set', 
    es: 'Set de Cristal Premium', 
    ru: 'Премиум набор кристаллов' 
  },
  'physical.crystal.desc': { 
    sr: 'Veći izbor kristala + manifestaciona sveska i kratki astro vodič', 
    en: 'Larger selection of crystals + manifestation notebook and short astro guide', 
    fr: 'Plus grand choix de cristaux + cahier de manifestation et court guide astro', 
    de: 'Größere Auswahl an Kristallen + Manifestationsnotizbuch und kurzer Astro-Guide', 
    es: 'Mayor selección de cristales + cuaderno de manifestación y guía astro corta', 
    ru: 'Большой выбор кристаллов + тетрадь для манифестации и краткий астро-гид' 
  },

  // Form
  'form.title': { 
    sr: 'Naruči uslugu', 
    en: 'Order Service', 
    fr: 'Commander un service', 
    de: 'Service bestellen', 
    es: 'Solicitar servicio', 
    ru: 'Заказать услугу' 
  },
  'form.name': { 
    sr: 'Ime i prezime', 
    en: 'Full Name', 
    fr: 'Nom complet', 
    de: 'Vollständiger Name', 
    es: 'Nombre completo', 
    ru: 'Полное имя' 
  },
  'form.firstName': { 
    sr: 'Ime', 
    en: 'First Name', 
    fr: 'Prénom', 
    de: 'Vorname', 
    es: 'Nombre', 
    ru: 'Имя' 
  },
  'form.lastName': { 
    sr: 'Prezime', 
    en: 'Last Name', 
    fr: 'Nom de famille', 
    de: 'Nachname', 
    es: 'Apellido', 
    ru: 'Фамилия' 
  },
  'form.gender': {
    sr: 'Pol',
    en: 'Gender',
    fr: 'Genre',
    de: 'Geschlecht',
    es: 'Género',
    ru: 'Пол'
  },
  'form.genderSelect': {
    sr: 'Izaberite pol',
    en: 'Select gender',
    fr: 'Sélectionner le genre',
    de: 'Geschlecht wählen',
    es: 'Seleccionar género',
    ru: 'Выберите пол'
  },
  'form.gender.male': {
    sr: 'Muški',
    en: 'Male',
    fr: 'Homme',
    de: 'Männlich',
    es: 'Masculino',
    ru: 'Мужской'
  },
  'form.gender.female': {
    sr: 'Ženski',
    en: 'Female',
    fr: 'Femme',
    de: 'Weiblich',
    es: 'Femenino',
    ru: 'Женский'
  },
  'form.birthdate': { 
    sr: 'Datum rođenja', 
    en: 'Birth Date', 
    fr: 'Date de naissance', 
    de: 'Geburtsdatum', 
    es: 'Fecha de nacimiento', 
    ru: 'Дата рождения' 
  },
  'form.birthtime': { 
    sr: 'Vreme rođenja', 
    en: 'Birth Time', 
    fr: 'Heure de naissance', 
    de: 'Geburtszeit', 
    es: 'Hora de nacimiento', 
    ru: 'Время рождения' 
  },
  'form.birthplace': { 
    sr: 'Mesto rođenja', 
    en: 'Birth Place', 
    fr: 'Lieu de naissance', 
    de: 'Geburtsort', 
    es: 'Lugar de nacimiento', 
    ru: 'Место рождения' 
  },
  'form.birthCity': { 
    sr: 'Grad rođenja', 
    en: 'Birth City', 
    fr: 'Ville de naissance', 
    de: 'Geburtsstadt', 
    es: 'Ciudad de nacimiento', 
    ru: 'Город рождения' 
  },
  'form.birthCountry': { 
    sr: 'Država rođenja', 
    en: 'Birth Country', 
    fr: 'Pays de naissance', 
    de: 'Geburtsland', 
    es: 'País de nacimiento', 
    ru: 'Страна рождения' 
  },
  'form.email': { 
    sr: 'Email adresa', 
    en: 'Email Address', 
    fr: 'Adresse e-mail', 
    de: 'E-Mail-Adresse', 
    es: 'Dirección de correo electrónico', 
    ru: 'Адрес электронной почты' 
  },
  'form.note': { 
    sr: 'Napomena', 
    en: 'Note', 
    fr: 'Note', 
    de: 'Anmerkung', 
    es: 'Nota', 
    ru: 'Примечание' 
  },
  'form.consultationDescription': { 
    sr: 'Opišite vaše pitanje ili situaciju', 
    en: 'Describe your question or situation', 
    fr: 'Décrivez votre question ou situation', 
    de: 'Beschreiben Sie Ihre Frage oder Situation', 
    es: 'Describe tu pregunta o situación', 
    ru: 'Опишите ваш вопрос или ситуацию' 
  },
  'form.submit': { 
    sr: 'Pošalji narudžbinu', 
    en: 'Submit Order', 
    fr: 'Soumettre la commande', 
    de: 'Bestellung absenden', 
    es: 'Enviar pedido', 
    ru: 'Отправить заказ' 
  },
  'form.previewTitle': {
    sr: 'Pregled porudžbine',
    en: 'Order Preview',
    fr: 'Aperçu de la commande',
    de: 'Bestellvorschau',
    es: 'Vista previa del pedido',
    ru: 'Предпросмотр заказа'
  },
  'form.previewHint': {
    sr: 'Proverite unete podatke pre slanja.',
    en: 'Check your details before submitting.',
    fr: 'Vérifiez vos informations avant l\'envoi.',
    de: 'Bitte prüfen Sie Ihre Angaben vor dem Absenden.',
    es: 'Revisa tus datos antes de enviar.',
    ru: 'Проверьте данные перед отправкой.'
  },
  'form.preview': {
    sr: 'Pregledaj porudžbinu',
    en: 'Review order',
    fr: 'Aperçu de la commande',
    de: 'Bestellung prüfen',
    es: 'Revisar pedido',
    ru: 'Просмотреть заказ'
  },
  'form.edit': {
    sr: 'Izmeni',
    en: 'Edit',
    fr: 'Modifier',
    de: 'Bearbeiten',
    es: 'Editar',
    ru: 'Изменить'
  },
  'form.confirm': {
    sr: 'Poruči',
    en: 'Place order',
    fr: 'Passer la commande',
    de: 'Bestellung aufgeben',
    es: 'Realizar pedido',
    ru: 'Оформить заказ'
  },
  'form.required': { 
    sr: 'Obavezna polja označena su sa *', 
    en: 'Required fields are marked with *', 
    fr: 'Les champs obligatoires sont marqués d\'un *', 
    de: 'Pflichtfelder sind mit * gekennzeichnet', 
    es: 'Los campos obligatorios están marcados con *', 
    ru: 'Обязательные поля отмечены *' 
  },
  'form.success': { 
    sr: 'Hvala! Vaša narudžbina je primljena.', 
    en: 'Thank you! Your order has been received.', 
    fr: 'Merci ! Votre commande a été reçue.', 
    de: 'Danke! Ihre Bestellung wurde empfangen.', 
    es: '¡Gracias! Su pedido ha sido recibido.', 
    ru: 'Спасибо! Ваш заказ получен.' 
  },
  'form.yourData': {
    sr: 'Vaši podaci',
    en: 'Your data',
    fr: 'Vos données',
    de: 'Ihre Daten',
    es: 'Tus datos',
    ru: 'Ваши данные'
  },
  'form.partnerData': {
    sr: 'Podaci partnera',
    en: 'Partner data',
    fr: 'Données du partenaire',
    de: 'Partnerdaten',
    es: 'Datos del socio',
    ru: 'Данные партнера'
  },

  // Footer
  'footer.rights': { 
    sr: 'Sva prava zadržana', 
    en: 'All rights reserved', 
    fr: 'Tous droits réservés', 
    de: 'Alle Rechte vorbehalten', 
    es: 'Todos los derechos reservados', 
    ru: 'Все права защищены' 
  },
  'footer.faq': { 
    sr: 'Česta pitanja', 
    en: 'FAQ', 
    fr: 'FAQ', 
    de: 'FAQ', 
    es: 'Preguntas frecuentes', 
    ru: 'Часто задаваемые вопросы' 
  },
  'footer.terms': { 
    sr: 'Uslovi korišćenja', 
    en: 'Terms of Service', 
    fr: 'Conditions d\'utilisation', 
    de: 'Nutzungsbedingungen', 
    es: 'Términos de servicio', 
    ru: 'Условия использования' 
  },
  'footer.privacy': { 
    sr: 'Pravila privatnosti', 
    en: 'Privacy Policy', 
    fr: 'Politique de confidentialité', 
    de: 'Datenschutzrichtlinie', 
    es: 'Política de privacidad', 
    ru: 'Политика конфиденциальности' 
  },
  'footer.social': { 
    sr: 'Pratite nas', 
    en: 'Follow Us', 
    fr: 'Suivez-nous', 
    de: 'Folgen Sie uns', 
    es: 'Síguenos', 
    ru: 'Подписывайтесь' 
  },

  // Blog
  'blog.title': { 
    sr: 'Kosmički blog', 
    en: 'Cosmic Blog', 
    fr: 'Blog cosmique', 
    de: 'Kosmischer Blog', 
    es: 'Blog cósmico', 
    ru: 'Космический блог' 
  },
  'blog.readMore': { 
    sr: 'Saznaj više', 
    en: 'Read More', 
    fr: 'Lire la suite', 
    de: 'Mehr lesen', 
    es: 'Leer más', 
    ru: 'Читать далее' 
  },
  'blog.back': { 
    sr: 'Nazad na blog', 
    en: 'Back to Blog', 
    fr: 'Retour au blog', 
    de: 'Zurück zum Blog', 
    es: 'Volver al blog', 
    ru: 'Вернуться в блог' 
  },

  // About
  'about.title': { 
    sr: 'O nama', 
    en: 'About Us', 
    fr: 'À propos de nous', 
    de: 'Über uns', 
    es: 'Sobre nosotros', 
    ru: 'О нас' 
  },
  'about.text': { 
    sr: 'Dobrodošli u svet astrologije gde se drevna mudrost susreće sa modernim pristupom. Naš tim iskusnih astrologa posvećen je pružanju personalizovanih i tačnih astroloških izveštaja.', 
    en: 'Welcome to the world of astrology where ancient wisdom meets modern approach. Our team of experienced astrologers is dedicated to providing personalized and accurate astrological reports.', 
    fr: 'Bienvenue dans le monde de l\'astrologie où la sagesse ancienne rencontre l\'approche moderne. Notre équipe d\'astrologues expérimentés se consacre à fournir des rapports astrologiques personnalisés et précis.', 
    de: 'Willkommen in der Welt der Astrologie, wo alte Weisheit auf modernen Ansatz trifft. Unser Team erfahrener Astrologen widmet sich der Erstellung personalisierter und genauer astrologischer Berichte.', 
    es: 'Bienvenido al mundo de la astrología donde la sabiduría antigua se encuentra con el enfoque moderno. Nuestro equipo de astrólogos experimentados se dedica a proporcionar informes astrológicos personalizados y precisos.', 
    ru: 'Добро пожаловать в мир астрологии, где древняя мудрость встречается с современным подходом. Наша команда опытных астрологов посвящена созданию персонализированных и точных астрологических отчетов.' 
  },

  // Contact
  'contact.title': { 
    sr: 'Kontakt', 
    en: 'Contact', 
    fr: 'Contact', 
    de: 'Kontakt', 
    es: 'Contacto', 
    ru: 'Контакты' 
  },
  'contact.text': { 
    sr: 'Imate pitanja? Kontaktirajte nas putem emaila ili društvenih mreža.', 
    en: 'Have questions? Contact us via email or social media.', 
    fr: 'Vous avez des questions ? Contactez-nous par e-mail ou sur les réseaux sociaux.', 
    de: 'Haben Sie Fragen? Kontaktieren Sie uns per E-Mail oder über soziale Medien.', 
    es: '¿Tiene preguntas? Contáctenos por correo electrónico o redes sociales.', 
    ru: 'Есть вопросы? Свяжитесь с нами по электронной почте или в социальных сетях.' 
  },

  // Products page
  'products.title': { 
    sr: 'Naši Proizvodi', 
    en: 'Our Products', 
    fr: 'Nos produits', 
    de: 'Unsere Produkte', 
    es: 'Nuestros productos', 
    ru: 'Наши продукты' 
  },
  'products.subtitle': { 
    sr: 'Izaberite uslugu koja vam najviše odgovara', 
    en: 'Choose the service that suits you best', 
    fr: 'Choisissez le service qui vous convient le mieux', 
    de: 'Wählen Sie den Service, der am besten zu Ihnen passt', 
    es: 'Elija el servicio que mejor le convenga', 
    ru: 'Выберите услугу, которая вам больше подходит' 
  },

  // Compatibility Calculator
  'compatibility.title': {
    sr: 'Kalkulator ljubavne kompatibilnosti',
    en: 'Love Compatibility Calculator',
    fr: 'Calculateur de compatibilité amoureuse',
    de: 'Liebeskompatibilitätsrechner',
    es: 'Calculadora de compatibilidad amorosa',
    ru: 'Калькулятор любовной совместимости'
  },
  'compatibility.subtitle': {
    sr: 'Otkrijte vašu astrološku hemiju - unesite dva datuma rođenja',
    en: 'Discover your astrological chemistry - enter two birth dates',
    fr: 'Découvrez votre alchimie astrologique - entrez deux dates de naissance',
    de: 'Entdecken Sie Ihre astrologische Chemie - geben Sie zwei Geburtsdaten ein',
    es: 'Descubre tu química astrológica - ingresa dos fechas de nacimiento',
    ru: 'Откройте вашу астрологическую химию - введите две даты рождения'
  },
  'compatibility.person1': {
    sr: 'Prvi datum rođenja',
    en: 'First birth date',
    fr: 'Première date de naissance',
    de: 'Erstes Geburtsdatum',
    es: 'Primera fecha de nacimiento',
    ru: 'Первая дата рождения'
  },
  'compatibility.person2': {
    sr: 'Drugi datum rođenja',
    en: 'Second birth date',
    fr: 'Deuxième date de naissance',
    de: 'Zweites Geburtsdatum',
    es: 'Segunda fecha de nacimiento',
    ru: 'Вторая дата рождения'
  },
  'compatibility.selectDate': {
    sr: 'Izaberi datum',
    en: 'Select date',
    fr: 'Sélectionner une date',
    de: 'Datum auswählen',
    es: 'Seleccionar fecha',
    ru: 'Выбрать дату'
  },
  'compatibility.calculate': {
    sr: 'Izračunaj kompatibilnost',
    en: 'Calculate compatibility',
    fr: 'Calculer la compatibilité',
    de: 'Kompatibilität berechnen',
    es: 'Calcular compatibilidad',
    ru: 'Рассчитать совместимость'
  },
  'compatibility.loadingTitle': {
    sr: 'Zvezde se poravnavaju...',
    en: 'Aligning the stars...',
    fr: 'Alignement des étoiles...',
    de: 'Die Sterne richten sich aus...',
    es: 'Alineando las estrellas...',
    ru: 'Звезды выстраиваются...'
  },
  'compatibility.loadingSubtitle': {
    sr: 'Pripremamo vaš astro uvid.',
    en: 'Preparing your cosmic insight.',
    fr: 'Préparation de votre lecture cosmique.',
    de: 'Wir bereiten Ihre kosmische Deutung vor.',
    es: 'Preparando tu lectura cósmica.',
    ru: 'Готовим ваш космический ответ.'
  },
  'compatibility.result': {
    sr: 'Vaša kompatibilnost',
    en: 'Your compatibility',
    fr: 'Votre compatibilité',
    de: 'Ihre Kompatibilität',
    es: 'Su compatibilidad',
    ru: 'Ваша совместимость'
  },
  'compatibility.upsell.title': {
    sr: 'Želite detaljniju analizu?',
    en: 'Want a more detailed analysis?',
    fr: 'Vous voulez une analyse plus détaillée?',
    de: 'Möchten Sie eine detailliertere Analyse?',
    es: '¿Quieres un análisis más detallado?',
    ru: 'Хотите более детальный анализ?'
  },
  'compatibility.upsell.text': {
    sr: 'Ovo je samo osnovni uvid. Za pravu preciznost potrebna je analiza celokupne natalne karte oba partnera, uključujući pozicije svih planeta, aspekte i kuće.',
    en: 'This is just a basic insight. For true precision, a complete analysis of both partners\' natal charts is needed, including all planetary positions, aspects, and houses.',
    fr: 'Ce n\'est qu\'un aperçu de base. Pour une vraie précision, une analyse complète des thèmes natals des deux partenaires est nécessaire.',
    de: 'Dies ist nur ein grundlegender Einblick. Für echte Präzision ist eine vollständige Analyse beider Geburtshoroskope erforderlich.',
    es: 'Esto es solo una visión básica. Para una precisión real, se necesita un análisis completo de las cartas natales de ambos socios.',
    ru: 'Это лишь базовый обзор. Для точности нужен полный анализ натальных карт обоих партнеров.'
  },
  'compatibility.upsell.cta': {
    sr: 'Naruči Uporedni horoskop',
    en: 'Order Relationship Horoscope',
    fr: 'Commander l\'horoscope comparé',
    de: 'Partnerhoroskop bestellen',
    es: 'Pedir horóscopo comparativo',
    ru: 'Заказать сравнительный гороскоп'
  },
  'compatibility.desc.default': {
    sr: 'Vaši znakovi imaju jedinstvenu dinamiku koja može stvoriti duboku vezu uz malo truda i razumevanja.',
    en: 'Your signs have a unique dynamic that can create a deep connection with some effort and understanding.',
    fr: 'Vos signes ont une dynamique unique qui peut créer une connexion profonde avec un peu d\'effort.',
    de: 'Ihre Zeichen haben eine einzigartige Dynamik, die mit etwas Mühe eine tiefe Verbindung schaffen kann.',
    es: 'Sus signos tienen una dinámica única que puede crear una conexión profunda con algo de esfuerzo.',
    ru: 'У ваших знаков уникальная динамика, которая может создать глубокую связь при некотором усилии.'
  },

  // Share functionality
  'compatibility.share.title': {
    sr: 'Podeli:',
    en: 'Share:',
    fr: 'Partager:',
    de: 'Teilen:',
    es: 'Compartir:',
    ru: 'Поделиться:'
  },
  'compatibility.share.copied': {
    sr: 'Kopirano u clipboard!',
    en: 'Copied to clipboard!',
    fr: 'Copié dans le presse-papiers!',
    de: 'In die Zwischenablage kopiert!',
    es: '¡Copiado al portapapeles!',
    ru: 'Скопировано в буфер обмена!'
  },
  'compatibility.share.instagramCopied': {
    sr: 'Kopirano! Nalepite u Instagram Stories ili post.',
    en: 'Copied! Paste it in Instagram Stories or post.',
    fr: 'Copié! Collez-le dans Instagram Stories ou post.',
    de: 'Kopiert! Fügen Sie es in Instagram Stories oder Post ein.',
    es: '¡Copiado! Pégalo en Instagram Stories o publicación.',
    ru: 'Скопировано! Вставьте в Instagram Stories или пост.'
  },
  'compatibility.share.tiktokCopied': {
    sr: 'Kopirano! Nalepite u TikTok opis.',
    en: 'Copied! Paste it in TikTok description.',
    fr: 'Copié! Collez-le dans la description TikTok.',
    de: 'Kopiert! Fügen Sie es in die TikTok-Beschreibung ein.',
    es: '¡Copiado! Pégalo en la descripción de TikTok.',
    ru: 'Скопировано! Вставьте в описание TikTok.'
  },

  // Zodiac signs
  'zodiac.aries': { sr: 'Ovan', en: 'Aries', fr: 'Bélier', de: 'Widder', es: 'Aries', ru: 'Овен' },
  'zodiac.taurus': { sr: 'Bik', en: 'Taurus', fr: 'Taureau', de: 'Stier', es: 'Tauro', ru: 'Телец' },
  'zodiac.gemini': { sr: 'Blizanci', en: 'Gemini', fr: 'Gémeaux', de: 'Zwillinge', es: 'Géminis', ru: 'Близнецы' },
  'zodiac.cancer': { sr: 'Rak', en: 'Cancer', fr: 'Cancer', de: 'Krebs', es: 'Cáncer', ru: 'Рак' },
  'zodiac.leo': { sr: 'Lav', en: 'Leo', fr: 'Lion', de: 'Löwe', es: 'Leo', ru: 'Лев' },
  'zodiac.virgo': { sr: 'Devica', en: 'Virgo', fr: 'Vierge', de: 'Jungfrau', es: 'Virgo', ru: 'Дева' },
  'zodiac.libra': { sr: 'Vaga', en: 'Libra', fr: 'Balance', de: 'Waage', es: 'Libra', ru: 'Весы' },
  'zodiac.scorpio': { sr: 'Škorpija', en: 'Scorpio', fr: 'Scorpion', de: 'Skorpion', es: 'Escorpio', ru: 'Скорпион' },
  'zodiac.sagittarius': { sr: 'Strelac', en: 'Sagittarius', fr: 'Sagittaire', de: 'Schütze', es: 'Sagitario', ru: 'Стрелец' },
  'zodiac.capricorn': { sr: 'Jarac', en: 'Capricorn', fr: 'Capricorne', de: 'Steinbock', es: 'Capricornio', ru: 'Козерог' },
  'zodiac.aquarius': { sr: 'Vodolija', en: 'Aquarius', fr: 'Verseau', de: 'Wassermann', es: 'Acuario', ru: 'Водолей' },
  'zodiac.pisces': { sr: 'Ribe', en: 'Pisces', fr: 'Poissons', de: 'Fische', es: 'Piscis', ru: 'Рыбы' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Map country codes to languages
const countryToLanguage: Record<string, Language> = {
  RS: 'sr', // Serbia
  BA: 'sr', // Bosnia
  ME: 'sr', // Montenegro
  HR: 'sr', // Croatia (Serbian similar)
  GB: 'en', // UK
  US: 'en', // USA
  AU: 'en', // Australia
  CA: 'en', // Canada
  IE: 'en', // Ireland
  FR: 'fr', // France
  BE: 'fr', // Belgium
  CH: 'fr', // Switzerland (also German)
  DE: 'de', // Germany
  AT: 'de', // Austria
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AR: 'es', // Argentina
  CO: 'es', // Colombia
  RU: 'ru', // Russia
  BY: 'ru', // Belarus
  KZ: 'ru', // Kazakhstan
  UA: 'ru', // Ukraine
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sr');
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    // Only detect once on initial load
    if (isDetected) return;

    const detectLanguageByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        const countryName = data.country_name;

        if (typeof window !== 'undefined') {
          if (countryCode) {
            window.localStorage.setItem('astro_country_code', String(countryCode));
          }
          if (countryName) {
            window.localStorage.setItem('astro_country', String(countryName));
          }
        }
        
        if (countryCode && countryToLanguage[countryCode]) {
          setLanguage(countryToLanguage[countryCode]);
        }
      } catch (error) {
        console.log('Could not detect location, using default language');
      } finally {
        setIsDetected(true);
      }
    };

    detectLanguageByIP();
  }, [isDetected]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
