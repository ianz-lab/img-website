// ===================================
// IM Global - Interactive Scripts
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // Navigation
    // ===================================

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Scroll effect for navbar
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===================================
    // Smooth Scrolling
    // ===================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // Animated Stats Counter
    // ===================================

    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.stats');
        const sectionTop = statsSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const prefix = stat.getAttribute('data-prefix') || '';
                const suffix = stat.getAttribute('data-suffix') || '';
                const duration = 2000;
                const startTime = Date.now();

                function updateNumber() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function for smooth animation
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(target * easeOut);

                    stat.textContent = prefix + current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    }
                }

                updateNumber();
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load

    // ===================================
    // Scroll Reveal Animation
    // ===================================

    const revealElements = document.querySelectorAll(
        '.stat-card, .feature-item, .investment-card, .process-step, .team-card'
    );

    function revealOnScroll() {
        revealElements.forEach((el, index) => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 50) {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 50);
            }
        });
    }

    // Initialize reveal elements
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', revealOnScroll);
    setTimeout(revealOnScroll, 100); // Initial check after slight delay

    // ===================================
    // Contact Form Handling
    // ===================================

    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Show success message (in production, you'd send this to a server)
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        button.textContent = 'Message Sent!';
        button.style.background = '#22c55e';
        button.disabled = true;

        // Reset form
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);

        // Log for testing (remove in production)
        console.log('Form submitted:', data);
    });

    // ===================================
    // Parallax Effect for Hero
    // ===================================

    const heroSection = document.querySelector('.hero');

    window.addEventListener('scroll', function () {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            const heroContent = document.querySelector('.hero-content');
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });

    // ===================================
    // Active Navigation Link Highlight
    // ===================================

    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ===================================
    // Expandable Content / Read More
    // ===================================

    const expandButtons = document.querySelectorAll('.expand-btn');

    expandButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            const btnText = this.querySelector('span');

            this.classList.toggle('active');
            targetContent.classList.toggle('active');

            // Update button text based on current language
            const currentLang = document.documentElement.lang || 'en';
            if (targetContent.classList.contains('active')) {
                btnText.textContent = currentLang === 'tr' ? 'Daha Az Göster' : 'Show Less';
            } else {
                btnText.textContent = currentLang === 'tr' ? 'Devamını Oku' : 'Read More';
            }
        });
    });

    // ===================================
    // Language Toggle (English / Turkish)
    // ===================================

    const langToggle = document.getElementById('langToggle');
    const langOptions = langToggle.querySelectorAll('.lang-option');

    // Translation data - Warm, natural Turkish with proper special characters
    const translations = {
        en: {
            // Navigation
            'nav.whyUs': 'Why Us',
            'nav.investments': 'Investments',
            'nav.process': 'Process',
            'nav.team': 'Our Team',
            'nav.getStarted': 'Get Started',

            // Hero
            'hero.badge': 'California Real Estate Investment',
            'hero.titleLine1': 'Your Bridge to',
            'hero.titleLine2': 'U.S. Real Estate',
            'hero.subtitle': 'More than providing opportunities, we guide international investors through every stage of planning, execution, and growth in the United States.\n',
            'hero.cta1': 'Start Your Journey',
            'hero.cta2': 'Learn More',
            'hero.scroll': 'Scroll to explore',

            // Stats
            'stats.titlePre': 'Why Invest in ',
            'stats.titleHighlight': 'U.S. Real Estate?',
            'stats.subtitle': 'The United States remains one of the most secure and profitable real estate markets in the world, offering stability, transparency, and long-term growth that few countries can match.',
            'stats.trillion': 'Trillion',
            'stats.billion': 'Billion',
            'stats.rent': 'Rent',
            'stats.marketValue': 'Overall U.S. Real Estate Market Value',
            'stats.intlPurchases': 'International Purchases Each Year',
            'stats.renters': 'of U.S. Households Rent Their Homes',

            // Why Us
            'whyUs.titlePre': 'Why Choose ',
            'whyUs.intro1': 'We do more than transact; we build relationships. Every client is treated as a partner. We listen first; your goals, concerns, vision, then tailor the path.',
            'whyUs.intro2': 'With deep roots in Southern California and access to 500+ offices nationwide, we bridge cultural, legal, and financial complexities so you don’t have to navigate them alone.',
            'whyUs.feature1Title': 'Global Reach + Local Expertise',
            'whyUs.feature1Text': 'Backed by Realty ONE Group\'s 500+ offices worldwide, but locally rooted in Southern California. We connect global investors to U.S. real estate opportunities with insight into both cultural and financial considerations.',
            'whyUs.feature1Expanded': 'We are more than agents, we\'re your partners through every stage of U.S. real estate ownership. Our investor services are designed to provide international buyers with a seamless U.S. real estate experience. We don\'t just manage transactions; we guide people. Every client\'s story is unique, and we take the time to understand your goals, concerns, and vision before mapping out the right path forward.',
            'whyUs.feature2Title': 'Proven Track Record',
            'whyUs.feature2Text': 'Realty ONE Group closed $33.7B in sales across 87,000+ transactions, we deliver results you can trust.',
            'whyUs.feature2Expanded': 'We have grown into one of the fastest expanding real estate brands in the world, closing tens of thousands of transactions annually and surpassing $30+ billion in yearly sales volume. With 500+ offices worldwide and over 19,000 professionals, our network consistently delivers results at scale.',
            'whyUs.feature3Title': 'Transparent Guidance',
            'whyUs.feature3Text': 'We simplify complex legal, tax, and ownership structures for cross-border buyers, ensuring clarity at every step.',
            'whyUs.feature3Expanded': 'When one of our overseas clients came to us, they were excited about investing in the U.S. but overwhelmed by the process. We walked them through the options step by step, made sure nothing was lost in translation, and kept every detail coordinated. The result? A smooth transaction, a smart investment, and the confidence to expand their portfolio further. We specialize in representing you through the entire process; identifying opportunities, negotiating contracts, and managing all moving parts with the same care we would for our own families.',
            'whyUs.feature4Title': 'Full Service Support',
            'whyUs.feature4Text': 'Your investment journey doesn\'t end at closing. We provide ongoing portfolio support.',
            'whyUs.feature4Expanded1': 'Beyond the transaction, we connect you with trusted professionals we\'ve built relationships with over years of experience. This way, your investment is not only well structured and legally compliant, but also built for long term success and peace of mind.',
            'whyUs.feature4Item1': '1. Market analysis and strategy for investors',
            'whyUs.feature4Item2': '2. Introductions to vetted attorneys, CPAs, and property managers',
            'whyUs.feature4Item3': '3. Long-term portfolio planning and support',
            'whyUs.whoWeAre': 'Who We Are',
            'whyUs.whoWeAreText1': 'We are a Southern California based real estate group with U.S.-wide and international brokerage reach, dedicated to connecting investors from around the world with opportunities across the American market.',
            'whyUs.whoWeAreText2': 'We started this company to help international investors overcome the unique hurdles of buying property in the U.S. from abroad; from navigating legal and financial systems to bridging cultural and language gaps.',
            'whyUs.whoWeAreText3': 'By combining local expertise with global perspective, we ensure every client can navigate cultural, legal, and financial differences with confidence. At the core of our mission is transforming investments into long term growth, and transactions into lasting relationships.',

            // Investments
            'investments.titlePre': 'Types of ',
            'investments.titleHighlight': 'Investments',
            'investments.intro': 'We help investors identify the right type of property to match their unique objectives. Whether you\'re looking for rental income through residential or multi family properties, long term appreciation in prime commercial markets, or a U.S. base for your business, we tailor your investment search to your priorities. Our expertise ensures you enter the right market segment with confidence and clarity.',
            'investments.residentialTitle': 'Residential',
            'investments.residentialText': 'Single family homes, condos, and multi family properties for rental income or appreciation.',
            'investments.commercialTitle': 'Commercial',
            'investments.commercialText': 'Office, retail, and mixed use spaces in prime markets with long term growth potential.',
            'investments.industrialTitle': 'Industrial',
            'investments.industrialText': 'Warehouses, logistics centers, and specialized facilities suited for today\'s supply chain demands.',
            'investments.businessTitle': 'Business Opportunities',
            'investments.businessText': 'U.S. based franchises, hospitality, and small businesses for investors seeking an operational foothold.',

            // Process
            'process.titlePre': 'How We ',
            'process.titleHighlight': 'Simplify the Process',
            'process.intro': 'Investing across borders can feel complex, but we simplify it. From the first consultation, we provide a clear step by step process that eliminates confusion. Our streamlined client interface ensures you have real time access to every update, document, and communication, no matter where you are in the world. We outline what you need to know, when you need to know it, and connect you with specialists for anything requiring deeper expertise.',
            'process.step1Title': 'Personalized Consultation',
            'process.step1Text': 'Your journey starts with a conversation. We take the time to understand your vision, whether it\'s finding a new residence, acquiring a commercial property, or building a high-yield investment portfolio.',
            'process.step2Title': 'Market Analysis & Strategy',
            'process.step2Text': 'We go beyond simple listings. Our team uses advanced market analytics to identify and source the most promising investment properties. We consider factors like market trends, potential for appreciation, and rental yield to craft a strategy that matches your objectives.',
            'process.step3Title': 'Comprehensive Property Search',
            'process.step3Text': 'With access to exclusive listings and the nationwide Realty ONE Group network, we find the ideal property for you. Our search spans all categories:',
            'process.step3Item1': '<strong>Residential:</strong> Find the perfect home to live in.',
            'process.step3Item2': '<strong>Commercial / Industrial:</strong> Secure the ideal space for your business.',
            'process.step3Item3': '<strong>Business Opportunities:</strong> Identify existing businesses with profitable real estate holdings.',
            'process.step4Title': 'Expert Navigation & Due Diligence',
            'process.step4Text': 'The U.S. real estate market has unique legal and financial requirements for foreign investors. We provide end-to-end support, from navigating legal frameworks and foreign investment laws to coordinating virtual property tours and managing cross-border communications.',
            'process.step5Title': 'Seamless Closing',
            'process.step5Text': 'We handle the details to ensure a smooth and efficient transaction, no matter where you are in the world. Our goal is to make the process as transparent and straightforward as possible, so you can focus on your investment.',

            // Team
            'team.titlePre': 'Our ',
            'team.titleHighlight': 'Trusted Network',
            'team.intro': 'Success in U.S. real estate requires more than finding the right property, it requires the right team. That\'s why we\'ve built a trusted network of professionals who specialize in supporting international investors. From attorneys to CPAs and property managers, we connect you to the experts who ensure your investment is legally sound, financially efficient, and managed effectively. Together, we help you build confidence and security in your U.S. portfolio.',
            'team.meldaRole': 'Real Estate Agent | Co-Founder IM Global Co.',
            'team.meldaBio': 'Originally from Turkey, Melda Mariona brings an international perspective to the U.S. real estate market. With a background in engineering and project management, she approaches each investment with precision, structure, and problem solving expertise. Today, she focuses on helping buyers, sellers, and investors navigate the U.S. market with clarity and confidence, combining technical insight with a client first approach to unlock opportunities across residential, commercial, and investment property types.',
            'team.ianRole': 'Real Estate Agent | Co-Founder IM Global Co.',
            'team.ianBio': 'Before launching his career as a trusted real estate advisor, Ian Zeljak spent years as an electrician working in residential, commercial, and industrial environments. That hands on experience gives him an insider\'s perspective few agents can offer. Today, Ian combines that practical knowledge with deep market expertise to help investors confidently pursue opportunities across every property type.',
            'team.networkTitle': 'Our Professional Network',
            'team.saimeRole': 'Attorney',
            'team.saimeBio': 'Saime Atakan is an attorney licensed in California, New York and Istanbul. She owns her own law firm in Beverly Hills, California. She successfully handles cross border transactions, mergers and acquisitions. She also practices immigration law and real estate law. She helps investors navigate complex legal and financial structures with clarity, ensuring their assets are protected and their investments positioned for success.',
            'team.burcuRole': 'Attorney',
            'team.burcuBio': 'Burcu Tansu is a Los Angeles based attorney specializing in immigration law, with strong connections to the Turkish American community. She helps clients navigate U.S. immigration systems, visa processes, and legal challenges with clarity, compassion, and expertise.',
            'team.ariRole': 'Accountant',
            'team.ariBio': 'Ari Demiral is a Los Angeles based accountant with over 35 years of experience in tax planning, accounting, and business advisory services, as well as experience as a professor and university lecturer. With roots in Turkey and a deep understanding of both U.S. and international financial practices, he helps investors, business owners, and individuals structure deals, minimize tax exposure, and build long term financial success.',
            'team.ayseRole': 'Türkiye Real Estate Investment Consultant',
            'team.ayseBio': 'Experienced Licensed Real Estate Professional in Kadıköy, Istanbul, Türkiye with a demonstrated history of working in the real estate industry. Skilled in Marketing Management, Negotiation, Market Planning, Business Planning, and International Marketing. Strong real estate professional with a Bachelor\'s degree focused in English Language and Literature/Letters from Hacettepe Üniversitesi.',

            // Contact
            'contact.titlePre': 'Get in ',
            'contact.titleHighlight': 'Touch',
            'contact.ctaText': 'Ready to explore the opportunities? Your American Future Starts Here. Contact us today to begin your personalized real estate journey.',
            'contact.officeLocations': 'Office Locations',
            'contact.formTitle': 'Send Us a Message',
            'contact.namePlaceholder': 'Your Name',
            'contact.emailPlaceholder': 'Your Email',
            'contact.phonePlaceholder': 'Your Phone (with country code)',
            'contact.interestDefault': 'What are you interested in?',
            'contact.interestResidential': 'Residential Investment',
            'contact.interestCommercial': 'Commercial Investment',
            'contact.interestIndustrial': 'Industrial Investment',
            'contact.interestBusiness': 'Business Opportunities',
            'contact.interestOther': 'Other',
            'contact.messagePlaceholder': 'Tell us about your investment goals...',
            'contact.sendButton': 'Send Message',

            // Footer
            'footer.tagline': 'Your bridge to U.S. real estate investment.',
            'footer.disclaimer': 'All information provided on this website is deemed reliable but not guaranteed. It is intended for informational purposes only and should not be construed as legal, financial, or real estate advice. Users are encouraged to conduct their own due diligence and consult appropriate professionals before making any real estate decisions. Property listings and information are subject to change without notice. This website does not constitute a solicitation if your property is already listed with another real estate broker.',

            // Common
            'common.readMore': 'Read More',
            'common.showLess': 'Show Less'
        },
        tr: {
            // Navigation
            'nav.whyUs': 'Neden Biz',
            'nav.investments': 'Yatırımlar',
            'nav.process': 'Süreç',
            'nav.team': 'Ekibimiz',
            'nav.getStarted': 'Haydi Başlayalım',

            // Hero
            'hero.badge': 'Kaliforniya Gayrimenkul Yatırımı',
            'hero.titleLine1': 'Amerika\'da Gayrimenkul Yatırımlarına',
            'hero.titleLine2': 'Açılan Stratejik Yolunuz',
            'hero.subtitle': 'Uluslararası yatırımcılara yalnızca fırsatlar sunmakla kalmıyor; ABD’deki yatırımlarının planlama, uygulama ve büyüme aşamalarının tamamında rehberlik ediyoruz.',
            'hero.cta1': 'Yolculuğunuza Başlayın',
            'hero.cta2': 'Daha Fazlasını Öğrenin',
            'hero.scroll': 'Keşfetmek için kaydırın',

            // Stats
            'stats.titlePre': 'Neden ',
            'stats.titleHighlight': 'ABD Gayrimenkulüne Yatırım?',
            'stats.subtitle': 'Amerika Birleşik Devletleri, dünyanın en güvenli ve en kârlı gayrimenkul pazarlarından biri olmaya devam ediyor — çok az ülkenin sunabileceği istikrar, şeffaflık ve uzun vadeli büyüme potansiyeli sunuyor.',
            'stats.trillion': 'Trilyon',
            'stats.billion': 'Milyar',
            'stats.rent': 'Kira',
            'stats.marketValue': 'Toplam ABD Gayrimenkul Piyasa Değeri',
            'stats.intlPurchases': 'Yıllık Uluslararası Alımlar',
            'stats.renters': 'ABD Hanelerinin Kiracı Oranı',

            // Why Us
            'whyUs.titlePre': 'Neden ',
            'whyUs.intro1': 'Biz sadece alım-satım işlemleri yapmıyoruz; kalıcı ilişkiler kuruyoruz. Her müşterimize bir iş ortağı gözüyle bakıyoruz. Önce sizi dinliyoruz; hedeflerinizi, endişelerinizi, hayallerinizi sonra da size özel bir yol haritası çiziyoruz.',
            'whyUs.intro2': 'Güney Kaliforniya’daki güçlü yerel bağlarımız ve ülke genelinde 500’den fazla ofise erişimimizle, kültürel, hukuki ve finansal karmaşıklıkları sizin yerinize yönetiyoruz; böylece bu süreci tek başınıza yürütmek zorunda kalmıyorsunuz.',
            'whyUs.feature1Title': 'Küresel Erişim + Yerel Deneyim',
            'whyUs.feature1Text': 'Realty ONE Group\'un dünya genelindeki 500\'den fazla ofisiyle destekleniyoruz, ama kalbimiz Güney Kaliforniya\'da atıyor. Küresel yatırımcıları hem kültürel hem de finansal dinamikleri anlayarak ABD fırsatlarıyla buluşturuyoruz.',
            'whyUs.feature1Expanded': 'Biz sıradan emlak danışmanları değiliz — ABD gayrimenkul yolculuğunuzun her aşamasında yanınızda olan ortaklarınızız. Hizmetlerimiz, uluslararası alıcılara kusursuz bir deneyim sunmak için tasarlandı. Sadece işlem yönetmiyoruz; insanlara yol gösteriyoruz. Her müşterinin hikâyesi farklı ve doğru yolu çizmeden önce hedeflerinizi, kaygılarınızı ve vizyonunuzu anlamak için gereken zamanı ayırıyoruz.',
            'whyUs.feature2Title': 'Kanıtlanmış Başarı',
            'whyUs.feature2Text': 'Realty ONE Group, 87.000\'den fazla işlemde 33,7 milyar dolarlık satış gerçekleştirdi — güvenebileceğiniz sonuçlar sunuyoruz.',
            'whyUs.feature2Expanded': 'Dünyanın en hızlı büyüyen gayrimenkul markalarından biri olduk. Her yıl on binlerce işlem kapatıyor ve yıllık 30 milyar doların üzerinde satış hacmine ulaşıyoruz. Dünya genelinde 500\'den fazla ofis ve 19.000\'i aşkın profesyonelle, ağımız her ölçekte tutarlı sonuçlar sunuyor.',
            'whyUs.feature3Title': 'Şeffaf Rehberlik',
            'whyUs.feature3Text': 'Uluslararası alıcılar için karmaşık hukuki, vergisel ve mülkiyet yapılarını anlaşılır hale getiriyoruz — her adımda tam netlik sağlıyoruz.',
            'whyUs.feature3Expanded': 'Yurt dışından gelen bir müşterimiz bize başvurduğunda, ABD\'de yatırım yapma fikrinden çok heyecanlıydı ama süreç ona karmaşık geliyordu. Seçenekleri adım adım anlattık, hiçbir detayın gözden kaçmamasını sağladık ve her şeyi koordineli yürüttük. Sonuç mu? Pürüzsüz bir işlem, akıllıca bir yatırım ve portföyünü genişletme güveni. Fırsatları belirleme, sözleşmeleri müzakere etme ve tüm süreci kendi ailemizin işiymiş gibi özenle yönetme konusunda uzmanız.',
            'whyUs.feature4Title': 'Kapsamlı Destek',
            'whyUs.feature4Text': 'Yatırım yolculuğunuz kapanışla bitmiyor — sürekli portföy desteği sağlıyoruz.',
            'whyUs.feature4Expanded1': 'İşlemin ötesinde, yıllar içinde birlikte çalıştığımız güvenilir profesyonellerle sizi tanıştırıyoruz. Böylece yatırımınız sadece iyi yapılandırılmış ve yasalara uygun olmakla kalmaz; uzun vadeli başarı ve gönül rahatlığı için sağlam temeller üzerine kurulur.',
            'whyUs.feature4Item1': '1. Yatırımcılar için piyasa analizi ve strateji',
            'whyUs.feature4Item2': '2. Güvenilir avukatlar, mali müşavirler ve mülk yöneticileriyle tanışma',
            'whyUs.feature4Item3': '3. Uzun vadeli portföy planlaması ve destek',
            'whyUs.whoWeAre': 'Biz Kimiz',
            'whyUs.whoWeAreText1': 'Dünya genelindeki yatırımcıları Amerika pazarındaki fırsatlarla buluşturmaya kendini adamış, ABD çapında ve uluslararası erişime sahip Güney Kaliforniya merkezli bir gayrimenkul grubuyuz.',
            'whyUs.whoWeAreText2': 'Bu şirketi, uluslararası yatırımcıların yurt dışından ABD\'de mülk alırken karşılaştıkları kendine özgü zorlukları aşmalarına yardımcı olmak için kurduk — hukuki ve finansal sistemlerde yol bulmaktan kültürel ve dil engellerini aşmaya kadar her konuda.',
            'whyUs.whoWeAreText3': 'Yerel uzmanlığı küresel bakış açısıyla harmanlayarak, her müşterimizin kültürel, hukuki ve finansal farklılıkları güvenle aşmasını sağlıyoruz. Misyonumuzun özü: yatırımları uzun vadeli büyümeye, işlemleri kalıcı dostluklara dönüştürmek.',

            // Investments
            'investments.titlePre': 'Yatırım ',
            'investments.titleHighlight': 'Türleri',
            'investments.intro': 'Yatırımcıların kendilerine en uygun mülk türünü bulmalarına yardımcı oluyoruz. İster konut veya çok daireli mülklerden kira geliri, ister birinci sınıf ticari pazarlarda uzun vadeli değer artışı, ister işiniz için bir ABD üssü arıyor olun — araştırmanızı önceliklerinize göre şekillendiriyoruz. Uzmanlığımız sayesinde doğru pazara güvenle ve netlikle adım atarsınız.',
            'investments.residentialTitle': 'Konut',
            'investments.residentialText': 'Kira geliri veya değer artışı için müstakil evler, daireler ve çok daireli mülkler.',
            'investments.commercialTitle': 'Ticari',
            'investments.commercialText': 'Uzun vadeli büyüme potansiyeli olan seçkin lokasyonlarda ofis, mağaza ve karma kullanımlı alanlar.',
            'investments.industrialTitle': 'Endüstriyel',
            'investments.industrialText': 'Günümüzün tedarik zinciri ihtiyaçlarına uygun depolar, lojistik merkezleri ve özel tesisler.',
            'investments.businessTitle': 'İş Fırsatları',
            'investments.businessText': 'Operasyonel bir zemin arayan yatırımcılar için ABD merkezli franchising, otelcilik ve küçük işletmeler.',

            // Process
            'process.titlePre': 'Süreci Nasıl ',
            'process.titleHighlight': 'Kolaylaştırıyoruz',
            'process.intro': 'Sınır ötesi yatırım yapmak karmaşık görünebilir ama biz bunu kolaylaştırıyoruz. İlk görüşmeden itibaren kafanızdaki tüm soru işaretlerini gideren net, adım adım bir süreç sunuyoruz. Kullanıcı dostu sistemimiz sayesinde dünyanın neresinde olursanız olun — her güncellemeye, belgeye ve iletişime anında ulaşabilirsiniz. Neyi ne zaman bilmeniz gerektiğini net olarak belirtiyor ve uzmanlık gerektiren konularda sizi doğru kişilerle buluşturuyoruz.',
            'process.step1Title': 'Size Özel Danışmanlık',
            'process.step1Text': 'Yolculuğunuz bir sohbetle başlıyor. Vizyonunuzu anlamak için zaman ayırıyoruz — ister yeni bir yuva, ister ticari bir mülk, ister yüksek getirili bir yatırım portföyü hayaliniz olsun.',
            'process.step2Title': 'Piyasa Analizi ve Strateji',
            'process.step2Text': 'Basit listelerin ötesine geçiyoruz. Ekibimiz, en umut verici yatırım fırsatlarını bulmak için gelişmiş piyasa analizleri kullanıyor. Piyasa trendlerini, değer artış potansiyelini ve kira getirisini değerlendirerek hedeflerinize uygun bir strateji oluşturuyoruz.',
            'process.step3Title': 'Kapsamlı Mülk Araştırması',
            'process.step3Text': 'Özel listelere ve ülke çapındaki Realty ONE Group ağına erişimimizle size ideal mülkü buluyoruz. Araştırmamız tüm kategorileri kapsıyor:',
            'process.step3Item1': '<strong>Konut:</strong> Yaşamak için hayalinizdeki evi bulun.',
            'process.step3Item2': '<strong>Ticari / Endüstriyel:</strong> İşletmeniz için ideal alanı güvence altına alın.',
            'process.step3Item3': '<strong>İş Fırsatları:</strong> Değerli gayrimenkul varlıklarına sahip mevcut işletmeleri keşfedin.',
            'process.step4Title': 'Uzman Rehberliği ve Detaylı İnceleme',
            'process.step4Text': 'ABD gayrimenkul piyasası, yabancı yatırımcılar için kendine özgü hukuki ve finansal gereksinimler içerir. Yasal çerçevelerde yol bulmaktan sanal mülk turları düzenlemeye ve sınır ötesi iletişimleri yönetmeye kadar uçtan uca destek sağlıyoruz.',
            'process.step5Title': 'Sorunsuz Kapanış',
            'process.step5Text': 'Dünyanın neresinde olursanız olun pürüzsüz ve verimli bir işlem için tüm detayları hallediyoruz. Amacımız süreci olabildiğince şeffaf ve anlaşılır tutmak — böylece siz yatırımınıza odaklanabilirsiniz.',

            // Team
            'team.titlePre': 'Güvenilir ',
            'team.titleHighlight': 'Ağımız',
            'team.intro': 'ABD gayrimenkulünde başarı, sadece doğru mülkü bulmakla olmaz — doğru ekiple olur. İşte bu yüzden uluslararası yatırımcılara destek konusunda uzmanlaşmış güvenilir bir profesyonel ağı oluşturduk. Avukatlardan mali müşavirlere, mülk yöneticilerine kadar — yatırımınızın hukuki açıdan sağlam, finansal açıdan verimli ve etkin bir şekilde yönetilmesini sağlayan uzmanlarla sizi bir araya getiriyoruz.',
            'team.meldaRole': 'Gayrimenkul Danışmanı | IM Global Co. Kurucu Ortağı',
            'team.meldaBio': 'Türkiye kökenli Melda Mariona, ABD gayrimenkul piyasasına uluslararası bir perspektif getiriyor. Mühendislik ve proje yönetimi geçmişiyle her yatırıma titizlik, disiplin ve çözüm odaklı bir yaklaşımla eğiliyor. Bugün, konut, ticari ve yatırım amaçlı mülklerde fırsatları keşfetmek için teknik bilgiyi müşteri odaklı yaklaşımla harmanlayarak alıcılara, satıcılara ve yatırımcılara ABD piyasasında güvenle yol gösteriyor.',
            'team.ianRole': 'Gayrimenkul Danışmanı | IM Global Co. Kurucu Ortağı',
            'team.ianBio': 'Güvenilir bir gayrimenkul danışmanı olmadan önce Ian Zeljak, yıllarca konut, ticari ve endüstriyel projelerde elektrikçi olarak çalıştı. Bu saha deneyimi, ona çok az danışmanın sahip olduğu bir içeriden bakış açısı kazandırıyor. Bugün Ian, bu pratik bilgiyi derin piyasa uzmanlığıyla birleştirerek yatırımcıların her mülk türünde doğru fırsatları güvenle yakalamasına yardımcı oluyor.',
            'team.networkTitle': 'Profesyonel Ağımız',
            'team.saimeRole': 'Avukat',
            'team.saimeBio': 'Saime Atakan, Kaliforniya, New York ve İstanbul\'da lisanslı bir avukattır. Beverly Hills, Kaliforniya\'da kendi hukuk bürosunu yönetmektedir. Sınır ötesi işlemler, şirket birleşmeleri ve satın almalar konusunda başarıyla çalışmaktadır. Ayrıca göçmenlik hukuku ve gayrimenkul hukuku alanlarında da hizmet vermektedir. Yatırımcıların karmaşık hukuki ve finansal yapılarda netlikle ilerlemelerine yardımcı olarak varlıklarını korumalarını ve yatırımlarını başarıya taşımalarını sağlıyor.',
            'team.burcuRole': 'Avukat',
            'team.burcuBio': 'Burcu Tansu, göçmenlik hukuku konusunda uzmanlaşmış, Türk-Amerikan topluluğuyla güçlü bağları olan Los Angeles merkezli bir avukattır. Müvekkillerinin ABD göçmenlik sisteminde, vize süreçlerinde ve hukuki zorluklarda netlik, anlayış ve uzmanlıkla yol almasına yardımcı oluyor.',
            'team.ariRole': 'Mali Müşavir',
            'team.ariBio': 'Ari Demiral, vergi planlaması, muhasebe ve iş danışmanlığı alanlarında 35 yılı aşkın deneyime sahip, aynı zamanda üniversite öğretim üyeliği yapmış Los Angeles merkezli bir mali müşavirdir. Türkiye kökenli olup hem ABD hem de uluslararası finansal uygulamalara hâkim; yatırımcılara, işletme sahiplerine ve bireylere işlem yapılandırma, vergi yükünü azaltma ve uzun vadeli finansal başarı inşa etme konularında destek oluyor.',
            'team.ayseRole': 'Türkiye Gayrimenkul Yatırım Danışmanı',
            'team.ayseBio': 'İstanbul Kadıköy\'de gayrimenkul sektöründe kanıtlanmış deneyime sahip Lisanslı Gayrimenkul Profesyoneli. Pazarlama Yönetimi, Müzakere, Pazar Planlaması, İş Planlaması ve Uluslararası Pazarlama konularında yetkin. Hacettepe Üniversitesi İngiliz Dili ve Edebiyatı bölümü mezunu, güçlü bir gayrimenkul profesyoneli.',

            // Contact
            'contact.titlePre': 'İletişime ',
            'contact.titleHighlight': 'Geçin',
            'contact.ctaText': 'Fırsatları keşfetmeye hazır mısınız? Amerikan Geleceğiniz Burada Başlıyor. Size özel gayrimenkul yolculuğunuza bugün başlamak için bize ulaşın.',
            'contact.officeLocations': 'Ofis Lokasyonlarımız',
            'contact.formTitle': 'Bize Mesaj Gönderin',
            'contact.namePlaceholder': 'Adınız',
            'contact.emailPlaceholder': 'E-posta Adresiniz',
            'contact.phonePlaceholder': 'Telefon Numaranız (ülke koduyla birlikte)',
            'contact.interestDefault': 'Neyle ilgileniyorsunuz?',
            'contact.interestResidential': 'Konut Yatırımı',
            'contact.interestCommercial': 'Ticari Yatırım',
            'contact.interestIndustrial': 'Endüstriyel Yatırım',
            'contact.interestBusiness': 'İş Fırsatları',
            'contact.interestOther': 'Diğer',
            'contact.messagePlaceholder': 'Yatırım hedeflerinizi bizimle paylaşın...',
            'contact.sendButton': 'Mesaj Gönder',

            // Footer
            'footer.tagline': 'ABD gayrimenkul yatırımına köprünüz.',
            'footer.disclaimer': 'Bu web sitesinde sunulan tüm bilgiler güvenilir kabul edilmekle birlikte garanti edilmemektedir. Bilgiler yalnızca bilgilendirme amaçlıdır ve hukuki, finansal veya gayrimenkul danışmanlığı olarak yorumlanmamalıdır. Kullanıcıların herhangi bir gayrimenkul kararı vermeden önce kendi araştırmalarını yapmaları ve ilgili uzmanlara danışmaları önerilir. Mülk listeleri ve bilgiler önceden haber verilmeksizin değişebilir. Mülkünüz halihazırda başka bir gayrimenkul komisyoncusuyla listelenmiş ise bu web sitesi bir talep teşkil etmez.',

            // Common
            'common.readMore': 'Devamını Oku',
            'common.showLess': 'Daha Az Göster'
        }
    };

    let currentLang = localStorage.getItem('imglobal-lang') || 'en';

    // Initialize language on page load - always apply to pick up any text changes
    applyTranslations(currentLang);
    updateLangToggleUI(currentLang);

    // Language toggle click handler
    langToggle.addEventListener('click', function () {
        currentLang = currentLang === 'en' ? 'tr' : 'en';
        localStorage.setItem('imglobal-lang', currentLang);
        applyTranslations(currentLang);
        updateLangToggleUI(currentLang);
    });

    function updateLangToggleUI(lang) {
        langOptions.forEach(option => {
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        document.documentElement.lang = lang;
    }

    function applyTranslations(lang) {
        const t = translations[lang];

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (key.includes('Item')) {
                    el.innerHTML = t[key]; // Allow HTML for list items with <strong>
                } else {
                    el.textContent = t[key];
                }
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) {
                el.placeholder = t[key];
            }
        });

        // Update expand buttons text
        document.querySelectorAll('.expand-btn').forEach(btn => {
            const content = document.getElementById(btn.getAttribute('data-target'));
            const btnText = btn.querySelector('span');
            if (content && content.classList.contains('active')) {
                btnText.textContent = t['common.showLess'];
            } else {
                btnText.textContent = t['common.readMore'];
            }
        });
    }

});
