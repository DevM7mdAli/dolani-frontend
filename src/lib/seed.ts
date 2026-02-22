import { config } from 'dotenv';
import { getPayload } from 'payload';

import configPromise from '../payload.config';

config({ path: '.env.local' });
config({ path: '.env' });

export const seed = async () => {
  const payload = await getPayload({ config: configPromise });

  payload.logger.info('Seeding Landing Page data...');

  // English Data
  await payload.updateGlobal({
    slug: 'landing-page',
    locale: 'en',
    data: {
      nav: {
        logoText: 'Dolani',
        logoSubtext: 'Indoor Navigation',
        features: 'Features',
        howItWorks: 'How It Works',
        technology: 'Technology',
        team: 'Team',
        faq: 'FAQ',
        viewDemo: 'View Demo',
        login: 'Login',
        language: 'Language',
      },
      hero: {
        headline: "You'll Never Get Lost,",
        headlineHighlight: 'on Campus.',
        subheadline:
          'Smart indoor navigation powered by BLE beacons. Real-time faculty tracking, emergency routes, and bilingual support—designed for everyone.',
        downloadApp: 'Download App',
        watchDemo: 'Watch Demo',
        activeUsers: '145+ Active Users',
        activeUsersText: 'Trusted by CCSIT students & faculty',
        heroImage: null,
      },
      features: {
        badge: 'POWERFUL FEATURES',
        title: 'Everything You Need',
        subtitle:
          'A complete navigation solution designed specifically for university environments',
        items: [
          {
            icon: 'Map',
            title: 'Precision Navigation',
            description:
              '1-meter accuracy with turn-by-turn directions. BLE beacon technology ensures you never take a wrong turn.',
            linkText: 'Learn more',
          },
          {
            icon: 'Users',
            title: 'Faculty Finder',
            description:
              "Real-time availability status with office hours. Find professors instantly and know if they're free to meet.",
            linkText: 'Learn more',
          },
          {
            icon: 'Search',
            title: 'Smart Search',
            description:
              'Find any room instantly by name, code, or type. Filter by labs, offices, lecture halls, and more.',
            linkText: 'Learn more',
          },
          {
            icon: 'ShieldAlert',
            title: 'Emergency Mode',
            description:
              'One-tap emergency evacuation routing. Automatically guides you to the nearest safe exit with no elevators.',
            linkText: 'Learn more',
          },
          {
            icon: 'Globe',
            title: 'Bilingual Support',
            description:
              'Seamless Arabic and English interface. Switch languages instantly to match your preference.',
            linkText: 'Learn more',
          },
          {
            icon: 'WifiOff',
            title: 'Offline First',
            description:
              'Works without internet. Only Bluetooth required—perfect for areas with spotty Wi-Fi coverage.',
            linkText: 'Learn more',
          },
        ],
      },
      howItWorks: {
        badge: 'HOW IT WORKS',
        title: 'BLE Beacon Technology',
        subtitle: 'Industry-leading positioning system with meter-level precision',
        steps: [
          {
            number: '1',
            title: 'Detection',
            description:
              'Your device continuously scans for BLE beacon signals positioned every 8 meters throughout the building.',
          },
          {
            number: '2',
            title: 'Positioning',
            description:
              'Advanced trilateration algorithms calculate your exact position using signal strength and smoothing filters.',
          },
          {
            number: '3',
            title: 'Navigation',
            description:
              'The A* pathfinding algorithm generates the optimal route to your destination in real-time.',
          },
        ],
        whyChooseBadge: 'WHY CHOOSE DOLANI',
        whyChooseTitle: 'Built for Saudi Universities',
        whyChooseSubtitle:
          "Designed with insights from students, faculty, and the Saudi government's digital accessibility standards.",
        whyChooseItems: [
          {
            icon: 'ShieldCheck',
            title: 'Privacy Protected',
            description:
              'All positioning happens on-device. Your location is never stored or transmitted.',
          },
          {
            icon: 'BatteryCharging',
            title: 'Battery Efficient',
            description:
              'Optimized BLE scanning uses minimal power—works all day on a single charge.',
          },
          {
            icon: 'AlertTriangle',
            title: 'Emergency Ready',
            description:
              'Instant evacuation mode with admin control for campus-wide safety alerts.',
          },
        ],
        whyChooseImage: null,
        statBadge1Value: '98%',
        statBadge1Label: 'Satisfaction Rate',
        statBadge2Value: '145+',
        statBadge2Label: 'Active Users',
      },
      techStack: {
        badge: 'TECHNOLOGY STACK',
        title: 'Enterprise-Grade Infrastructure',
        subtitle: 'Built with modern, scalable technologies for reliability and performance',
        items: [
          {
            icon: 'Smartphone',
            title: 'React Native',
            description: 'Cross-platform mobile development',
            color: '#38bdf8',
          },
          {
            icon: 'Server',
            title: 'NestJS',
            description: 'Scalable backend framework',
            color: '#f43f5e',
          },
          {
            icon: 'Database',
            title: 'PostgreSQL',
            description: 'Reliable data storage',
            color: '#3b82f6',
          },
          {
            icon: 'Flame',
            title: 'Firebase',
            description: 'Real-time updates',
            color: '#f59e0b',
          },
        ],
        bottomItems: [
          {
            icon: 'Bluetooth',
            title: 'BLE 4.0+',
            description: 'Bluetooth Low Energy protocol',
          },
          {
            icon: 'Code2',
            title: 'TypeScript',
            description: 'Type-safe development',
          },
          {
            icon: 'Shield',
            title: 'JWT Auth',
            description: 'Secure authentication',
          },
        ],
      },
      team: {
        badge: 'OUR TEAM',
        title: 'Meet the Minds Behind Dolani',
        subtitle: 'Group 06 CCSIT - Final Year Project 2026',
        members: [
          {
            icon: 'Code',
            name: 'Mohammed Ali',
            role: 'Frontend & Mobile Lead',
            description: 'React Native, TypeScript, UI/UX Implementation',
          },
          {
            icon: 'Database',
            name: 'Abdullah Mohammed',
            role: 'Backend & Cloud Lead',
            description: 'NestJS, PostgreSQL, API Design',
          },
          {
            icon: 'Cpu',
            name: 'Ali Ghazi',
            role: 'IoT & Hardware Lead',
            description: 'BLE Beacons, Hardware Setup, Testing',
          },
          {
            icon: 'Palette',
            name: 'Mohammed Shafiq',
            role: 'UI/UX Design Lead',
            description: 'Design System, User Research, Figma',
          },
        ],
      },
      faq: {
        badge: 'FAQ',
        title: 'Common Questions',
        subtitle: 'Everything you need to know about Dolani',
        questions: [
          {
            question: 'Do I need internet to use Dolani?',
            answer:
              'Yes, an internet connection is required to fetch real-time faculty status, but navigation data is cached for offline use.',
          },
          {
            question: 'What phones are supported?',
            answer: 'Dolani works on any iOS or Android device with Bluetooth 4.0 (BLE) support.',
          },
          {
            question: 'Is my location data private?',
            answer:
              'Absolutely. Your location is calculated locally on your device and is never stored or sent to our servers.',
          },
          {
            question: 'How accurate is the navigation?',
            answer:
              'Our BLE beacon technology provides meter-level precision, ensuring you get accurate turn-by-turn directions.',
          },
          {
            question: 'How does emergency mode work?',
            answer:
              'In an emergency, the app automatically calculates the fastest route to the nearest safe exit, avoiding elevators and hazardous areas.',
          },
          {
            question: 'Can I use Dolani in other buildings?',
            answer:
              'Currently, Dolani is optimized for the CCSIT building. We plan to expand to other campus buildings in the future.',
          },
        ],
      },
      cta: {
        title: 'Ready to Navigate Smarter?',
        subtitle:
          'Join 145+ students and faculty already using Dolani to find their way around campus.',
        downloadIos: 'Download for iOS',
        downloadAndroid: 'Download for Android',
        feature1: 'Free for all students',
        feature2: 'No credit card required',
        feature3: 'Works offline',
      },
      footer: {
        logoText: 'Dolani',
        logoSubtext: 'Indoor Navigation System',
        description:
          'Built for reliability. Works even when campus Wi-Fi is unstable. Powered by BLE beacon technology for meter-level precision.',
        quickLinksTitle: 'Quick Links',
        quickLinks: [
          { label: 'Features', url: '#features' },
          { label: 'How It Works', url: '#how-it-works' },
          { label: 'Technology', url: '#technology' },
          { label: 'Team', url: '#team' },
          { label: 'FAQ', url: '#faq' },
        ],
        resourcesTitle: 'Resources',
        resources: [
          { label: 'View Demo', url: '#' },
          { label: 'Faculty Portal', url: '/signin' },
          { label: 'API Documentation', url: '#' },
          { label: 'User Guide', url: '#' },
          { label: 'Contact Support', url: '#' },
        ],
        copyright: '© 2026 Dolani - Group 06 CCSIT Final Year Project. All rights reserved.',
      },
    },
  });

  // Arabic Data
  await payload.updateGlobal({
    slug: 'landing-page',
    locale: 'ar',
    data: {
      nav: {
        logoText: 'دولاني',
        logoSubtext: 'التوجيه الداخلي',
        features: 'المميزات',
        howItWorks: 'كيف يعمل',
        technology: 'التقنية',
        team: 'الفريق',
        faq: 'الأسئلة الشائعة',
        viewDemo: 'عرض تجريبي',
        login: 'تسجيل الدخول',
        language: 'اللغة',
      },
      hero: {
        headline: 'لن تضيع أبداً',
        headlineHighlight: 'في الحرم الجامعي.',
        subheadline:
          'توجيه داخلي ذكي مدعوم بتقنية BLE. تتبع حالة أعضاء هيئة التدريس، مسارات الطوارئ، ودعم ثنائي اللغة - مصمم للجميع.',
        downloadApp: 'حمل التطبيق',
        watchDemo: 'شاهد العرض',
        activeUsers: '+145 مستخدم نشط',
        activeUsersText: 'موثوق من قبل طلاب وأعضاء هيئة التدريس في كلية علوم الحاسب',
        heroImage: null,
      },
      features: {
        badge: 'مميزات قوية',
        title: 'كل ما تحتاجه',
        subtitle: 'حل توجيه متكامل مصمم خصيصاً للبيئات الجامعية',
        items: [
          {
            icon: 'Map',
            title: 'توجيه دقيق',
            description:
              'دقة تصل إلى متر واحد مع توجيه خطوة بخطوة. تضمن تقنية BLE أنك لن تسلك طريقاً خاطئاً أبداً.',
            linkText: 'اعرف المزيد',
          },
          {
            icon: 'Users',
            title: 'الباحث عن الأعضاء',
            description:
              'حالة التوافر في الوقت الفعلي مع الساعات المكتبية. ابحث عن الأساتذة فوراً واعرف ما إذا كانوا متاحين للقاء.',
            linkText: 'اعرف المزيد',
          },
          {
            icon: 'Search',
            title: 'بحث ذكي',
            description:
              'ابحث عن أي غرفة فوراً بالاسم أو الرمز أو النوع. قم بالتصفية حسب المعامل والمكاتب وقاعات المحاضرات والمزيد.',
            linkText: 'اعرف المزيد',
          },
          {
            icon: 'ShieldAlert',
            title: 'وضع الطوارئ',
            description:
              'توجيه إخلاء الطوارئ بنقرة واحدة. يوجهك تلقائياً إلى أقرب مخرج آمن بدون مصاعد.',
            linkText: 'اعرف المزيد',
          },
          {
            icon: 'Globe',
            title: 'دعم ثنائي اللغة',
            description:
              'واجهة سلسة باللغتين العربية والإنجليزية. قم بتبديل اللغات فوراً لتناسب تفضيلاتك.',
            linkText: 'اعرف المزيد',
          },
          {
            icon: 'WifiOff',
            title: 'يعمل بدون إنترنت',
            description:
              'يعمل بدون إنترنت. يتطلب البلوتوث فقط - مثالي للمناطق ذات تغطية الواي فاي الضعيفة.',
            linkText: 'اعرف المزيد',
          },
        ],
      },
      howItWorks: {
        badge: 'كيف يعمل',
        title: 'تقنية منارات BLE',
        subtitle: 'نظام تحديد المواقع الرائد في الصناعة بدقة تصل إلى مستوى المتر',
        steps: [
          {
            number: '1',
            title: 'الاكتشاف',
            description:
              'يقوم جهازك بمسح مستمر لإشارات منارات BLE الموضوعة كل 8 أمتار في جميع أنحاء المبنى.',
          },
          {
            number: '2',
            title: 'تحديد الموقع',
            description:
              'تحسب خوارزميات التثليث المتقدمة موقعك الدقيق باستخدام قوة الإشارة ومرشحات التنعيم.',
          },
          {
            number: '3',
            title: 'التوجيه',
            description: 'تولد خوارزمية A* المسار الأمثل لوجهتك في الوقت الفعلي.',
          },
        ],
        whyChooseBadge: 'لماذا تختار دولاني',
        whyChooseTitle: 'مبني للجامعات السعودية',
        whyChooseSubtitle:
          'مصمم برؤى من الطلاب وأعضاء هيئة التدريس ومعايير الوصول الرقمي للحكومة السعودية.',
        whyChooseItems: [
          {
            icon: 'ShieldCheck',
            title: 'الخصوصية محمية',
            description: 'يتم تحديد الموقع بالكامل على الجهاز. لا يتم تخزين موقعك أو نقله أبداً.',
          },
          {
            icon: 'BatteryCharging',
            title: 'كفاءة البطارية',
            description: 'يستخدم مسح BLE المحسن طاقة قليلة - يعمل طوال اليوم بشحنة واحدة.',
          },
          {
            icon: 'AlertTriangle',
            title: 'جاهز للطوارئ',
            description: 'وضع إخلاء فوري مع تحكم إداري لتنبيهات السلامة على مستوى الحرم الجامعي.',
          },
        ],
        whyChooseImage: null,
        statBadge1Value: '٩٨٪',
        statBadge1Label: 'معدل الرضا',
        statBadge2Value: '+١٤٥',
        statBadge2Label: 'مستخدم نشط',
      },
      techStack: {
        badge: 'حزمة التقنية',
        title: 'بنية تحتية على مستوى المؤسسات',
        subtitle: 'مبني بتقنيات حديثة وقابلة للتطوير من أجل الموثوقية والأداء',
        items: [
          {
            icon: 'Smartphone',
            title: 'React Native',
            description: 'تطوير تطبيقات الهواتف متعددة المنصات',
            color: '#38bdf8',
          },
          {
            icon: 'Server',
            title: 'NestJS',
            description: 'إطار عمل خلفي قابل للتطوير',
            color: '#f43f5e',
          },
          {
            icon: 'Database',
            title: 'PostgreSQL',
            description: 'تخزين بيانات موثوق',
            color: '#3b82f6',
          },
          {
            icon: 'Flame',
            title: 'Firebase',
            description: 'تحديثات في الوقت الفعلي',
            color: '#f59e0b',
          },
        ],
        bottomItems: [
          {
            icon: 'Bluetooth',
            title: 'BLE 4.0+',
            description: 'بروتوكول البلوتوث منخفض الطاقة',
          },
          {
            icon: 'Code2',
            title: 'TypeScript',
            description: 'تطوير آمن من حيث النوع',
          },
          {
            icon: 'Shield',
            title: 'JWT Auth',
            description: 'مصادقة آمنة',
          },
        ],
      },
      team: {
        badge: 'فريقنا',
        title: 'تعرف على العقول خلف دولاني',
        subtitle: 'المجموعة 06 كلية علوم الحاسب - مشروع التخرج 2026',
        members: [
          {
            icon: 'Code',
            name: 'محمد علي',
            role: 'قائد الواجهات الأمامية والهواتف',
            description: 'React Native, TypeScript, تنفيذ واجهة المستخدم',
          },
          {
            icon: 'Database',
            name: 'عبدالله محمد',
            role: 'قائد الواجهات الخلفية والسحابة',
            description: 'NestJS, PostgreSQL, تصميم واجهة برمجة التطبيقات',
          },
          {
            icon: 'Cpu',
            name: 'علي غازي',
            role: 'قائد إنترنت الأشياء والعتاد',
            description: 'منارات BLE, إعداد العتاد, الاختبار',
          },
          {
            icon: 'Palette',
            name: 'محمد شفيق',
            role: 'قائد تصميم واجهة المستخدم',
            description: 'نظام التصميم, أبحاث المستخدمين, Figma',
          },
        ],
      },
      faq: {
        badge: 'الأسئلة الشائعة',
        title: 'أسئلة شائعة',
        subtitle: 'كل ما تحتاج لمعرفته حول دولاني',
        questions: [
          {
            question: 'هل أحتاج إلى إنترنت لاستخدام دولاني؟',
            answer:
              'نعم، يلزم الاتصال بالإنترنت لجلب حالة أعضاء هيئة التدريس في الوقت الفعلي، ولكن يتم تخزين بيانات التنقل للاستخدام دون اتصال.',
          },
          {
            question: 'ما هي الهواتف المدعومة؟',
            answer: 'يعمل دولاني على أي جهاز iOS أو Android يدعم تقنية البلوتوث 4.0 (BLE).',
          },
          {
            question: 'هل بيانات موقعي خاصة؟',
            answer:
              'بالتأكيد. يتم حساب موقعك محلياً على جهازك ولا يتم تخزينه أو إرساله إلى خوادمنا أبداً.',
          },
          {
            question: 'ما مدى دقة التوجيه؟',
            answer:
              'توفر تقنية منارات BLE الخاصة بنا دقة تصل إلى مستوى المتر، مما يضمن حصولك على توجيهات دقيقة خطوة بخطوة.',
          },
          {
            question: 'كيف يعمل وضع الطوارئ؟',
            answer:
              'في حالة الطوارئ، يحسب التطبيق تلقائياً أسرع طريق إلى أقرب مخرج آمن، متجنباً المصاعد والمناطق الخطرة.',
          },
          {
            question: 'هل يمكنني استخدام دولاني في مباني أخرى؟',
            answer:
              'حالياً، تم تحسين دولاني لمبنى كلية علوم الحاسب. نخطط للتوسع إلى مباني الحرم الجامعي الأخرى في المستقبل.',
          },
        ],
      },
      cta: {
        title: 'جاهز للتنقل بذكاء أكبر؟',
        subtitle:
          'انضم إلى أكثر من 145 طالباً وعضو هيئة تدريس يستخدمون دولاني بالفعل لإيجاد طريقهم في الحرم الجامعي.',
        downloadIos: 'تحميل لنظام iOS',
        downloadAndroid: 'تحميل لنظام Android',
        feature1: 'مجاني لجميع الطلاب',
        feature2: 'لا يتطلب بطاقة ائتمان',
        feature3: 'يعمل بدون إنترنت',
      },
      footer: {
        logoText: 'دولاني',
        logoSubtext: 'نظام التوجيه الداخلي',
        description:
          'مبني للموثوقية. يعمل حتى عندما تكون شبكة الواي فاي في الحرم الجامعي غير مستقرة. مدعوم بتقنية منارات BLE لدقة تصل إلى مستوى المتر.',
        quickLinksTitle: 'روابط سريعة',
        quickLinks: [
          { label: 'المميزات', url: '#features' },
          { label: 'كيف يعمل', url: '#how-it-works' },
          { label: 'التقنية', url: '#technology' },
          { label: 'الفريق', url: '#team' },
          { label: 'الأسئلة الشائعة', url: '#faq' },
        ],
        resourcesTitle: 'الموارد',
        resources: [
          { label: 'عرض تجريبي', url: '#' },
          { label: 'بوابة الأعضاء', url: '/signin' },
          { label: 'وثائق API', url: '#' },
          { label: 'دليل المستخدم', url: '#' },
          { label: 'اتصل بالدعم', url: '#' },
        ],
        copyright: '© 2026 دولاني - المجموعة 06 كلية علوم الحاسب مشروع التخرج. جميع الحقوق محفوظة.',
      },
    },
  });

  payload.logger.info('Landing Page data seeded successfully!');
  process.exit(0);
};

seed();
