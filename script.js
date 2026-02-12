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
    // Contact form handling is done via Web3Forms in index.html




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
            const customKey = btnText.getAttribute('data-i18n');
            if (targetContent.classList.contains('active')) {
                btnText.textContent = currentLang === 'tr' ? 'Daha Az Göster' : 'Show Less';
            } else if (customKey) {
                // Restore custom label from translations
                const t = window._translations && window._translations[currentLang];
                btnText.textContent = (t && t[customKey]) || btnText.textContent;
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
            'hero.titleLine1b': '',
            'hero.titleLine2': 'U.S. Real Estate',
            'hero.subtitle': 'More than providing opportunities, we guide international investors through every stage of planning, execution, and growth in the United States.\n',
            'hero.cta1': 'Start Your Journey',
            'hero.cta2': 'Learn More',
            'hero.scroll': 'Scroll to explore',

            // Stats
            'stats.titlePre': 'Why Invest in ',
            'stats.titleHighlight': 'U.S. Real Estate?',
            'stats.subtitle': 'The United States remains one of the most secure and profitable real estate markets in the world.\n\nOffering stability, transparency, and long term growth that few countries can match.',
            'stats.trillion': 'Trillion',
            'stats.billion': 'Billion',
            'stats.rent': 'Rent',
            'stats.marketValue': 'Overall U.S. Real Estate Market Value',
            'stats.intlPurchases': 'International Purchases Each Year',
            'stats.renters': 'U.S. Households Rent Their Homes',

            // Why Us
            'whyUs.titlePre': 'Why Choose ',
            'whyUs.intro1': 'We do more than transact; we build relationships.\n\nEvery client is treated as a partner. We listen first; your goals, concerns, vision, then tailor the path.',
            'whyUs.intro2': 'With deep roots in Southern California and access to 500+ offices nationwide, we bridge cultural, legal, and financial complexities so you don’t have to navigate them alone.',
            'whyUs.feature1Title': 'Global Reach + Local Expertise',
            'whyUs.feature1Text': 'Backed by Realty ONE Group\'s 500+ offices worldwide, but locally rooted in Southern California. We connect global investors to U.S. real estate opportunities with insight into both cultural and financial considerations.',
            'whyUs.feature1Expanded': 'We are more than agents, we\'re your partners through every stage of U.S. real estate ownership. \n\nOur investor services are designed to provide international buyers with a seamless U.S. real estate experience. We don\'t just manage transactions; we guide our clients. \n\nEvery client\'s story is unique, and we take the time to understand your goals, concerns, and vision before mapping out the right path forward.',
            'whyUs.feature2Title': 'Proven Track Record',
            'whyUs.feature2Text': 'Realty ONE Group closed $33.7B in sales across 87,000+ transactions, we deliver results you can trust.',
            'whyUs.feature2Expanded': 'We have grown into one of the fastest expanding real estate brands in the world, closing tens of thousands of transactions annually and surpassing $30+ billion in yearly sales volume. With 500+ offices worldwide and over 19,000 professionals, our network consistently delivers results at scale.',
            'whyUs.feature3Title': 'Transparent Guidance',
            'whyUs.feature3Text': 'We simplify complex legal, tax, and ownership structures for cross border buyers, ensuring clarity at every step.',
            'whyUs.feature3Expanded': 'International investors are often drawn to the U.S. market, yet the legal, financial, and cultural aspects of the process can be complex. We clarify every option step by step, ensure that no detail is overlooked, and carefully coordinate each stage of the process. The result is a smooth transaction, a well-structured investment, and a strong foundation for long-term growth.\n\nWe represent you throughout the entire investment process; from identifying opportunities to negotiating contracts and managing every moving part with the same level of care and attention we would give our own families.',
            'whyUs.feature4Title': 'Full Service Support',
            'whyUs.feature4Text': 'Your investment journey doesn’t end with the purchase; it’s only the beginning. We provide ongoing support for your portfolio.',
            'whyUs.feature4Expanded1': 'Throughout every stage of the investment process, we support you with our trusted network of professionals built through years of experience. \n\nThis ensures your investment is not only legally compliant and well structured, but also designed for long term success and peace of mind.',
            'whyUs.feature4Item1': '1. Market analysis and strategy for investors',
            'whyUs.feature4Item2': '2. Introductions to vetted attorneys, CPAs, and property managers',
            'whyUs.feature4Item3': '3. Long term portfolio planning and support',
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
            'investments.commercialTitle': 'Commercial ',
            'investments.commercialText': 'Office, retail, and mixed use spaces in prime markets with long term growth potential.',
            'investments.industrialTitle': 'Industrial',
            'investments.industrialText': 'Warehouses, logistics centers, and specialized facilities suited for today\'s supply chain demands.',
            'investments.businessTitle': 'Business Opportunities',
            'investments.businessText': 'U.S. based franchises, hospitality, and small businesses for investors seeking an operational foothold.',

            // Process
            'process.titlePre': 'How We ',
            'process.titleHighlight': 'Simplify the Process',
            'process.intro': 'Investing across borders can feel complex, but we simplify it. From the first consultation, we provide a clear step by step process that eliminates confusion.\n\nOur streamlined client interface ensures you have real time access to every update, document, and communication, no matter where you are in the world. We outline what you need to know, when you need to know it, and connect you with specialists for anything requiring deeper expertise.',
            'process.step1Title': 'Personalized Consultation',
            'process.step1Text': 'Your investment journey begins with a comprehensive initial consultation. Whether your objective is to acquire a new residence, purchase a commercial property, or build a high yield investment portfolio, we take the time to thoroughly assess your vision, expectations, and priorities.',
            'process.step2Title': 'Market Analysis & Strategy',
            'process.step2Text': 'We are not limited to existing listings; we identify high potential investment opportunities through advanced market analysis.\n\nBy evaluating market trends, long term appreciation potential, and rental income, we develop strategies that are closely aligned with your investment objectives.',
            'process.step3Title': 'Comprehensive Property Search',
            'process.step3Text': 'Leveraging our nationwide Realty ONE Group network and broad market access, we identify the most suitable properties for you with care and precision. Our research spans all asset categories from residential and multifamily to commercial and industrial and includes the proactive identification of off market investment opportunities.',
            'process.step3Item1': '<strong>Residential:</strong> Find the perfect home to live in.',
            'process.step3Item2': '<strong>Commercial / Industrial:</strong> Secure the ideal space for your business.',
            'process.step3Item3': '<strong>Business Opportunities:</strong> Identify existing businesses with profitable real estate holdings.',
            'process.step4Title': 'Expert Navigation & Due Diligence',
            'process.step4Text': 'The U.S. real estate market has unique legal and financial requirements for foreign investors. Throughout this process, we provide end to end support from offering guidance on relevant legal frameworks and foreign investment regulations to coordinating virtual property tours and effectively managing cross border communication.',
            'process.step5Title': 'Seamless Closing',
            'process.step5Text': 'No matter where you are in the world, we carefully manage every detail to ensure a smooth and efficient transaction. By providing a transparent and streamlined process, we allow you to focus on your investment with clarity and confidence.',

            // Team
            'team.titlePre': 'Our ',
            'team.titleHighlight': 'Trusted Network',
            'team.intro': 'Sustainable success in the U.S. real estate market requires a strong team and the right expertise. Through our trusted network of professionals built to support international investors, we help ensure your investments are legally compliant, financially efficient, and effectively managed.',
            'team.meldaRole': 'Real Estate Agent | Co-Founder IM Global Co.',
            'team.meldaBio': 'With a professional background spanning from Turkey to the United States, Melda Mariona brings a value driven, international perspective to the U.S. real estate market. Grounded in engineering and project management, she manages investment processes with a structured, analytical, and results oriented approach.\n\nToday, she supports buyers, sellers, and investors in navigating the U.S. market with clarity, confidence, and strategic guidance, helping them effectively identify opportunities across residential, commercial, and investment property segments.',
            'team.ianRole': 'Real Estate Agent | Co-Founder IM Global Co.',
            'team.ianBio': 'Before beginning his career in real estate advisory, Ian Zeljak gained extensive field experience in infrastructure and building systems across residential, commercial, and industrial projects. This technical background provides him with a deep structural and operational perspective that few advisors possess. \n\nToday, Ian combines this hands on expertise with strong market knowledge to guide investors in confidently evaluating opportunities and making informed decisions across all real estate segments.',
            'team.networkTitle': 'Our Professional Network',
            'team.saimeRole': 'Attorney',
            'team.saimeBio': 'Saime Atakan is an attorney licensed in California, New York and Istanbul. She owns her own law firm in Beverly Hills, California. She successfully handles cross border transactions, mergers and acquisitions. She also practices immigration law and real estate law. She helps investors navigate complex legal and financial structures with clarity, ensuring their assets are protected and their investments positioned for success.',
            'team.tayfunRole': 'CPA',
            'team.tayfunBio': 'Tayfun Tuysuzoglu is a U.S. Certified Public Accountant with over 20 years of experience in accounting, finance, and tax advisory. A graduate of Bilkent University (Industrial Engineering), he earned Master\'s degrees in Finance and Accounting from Texas A&M University.\n\nHis career includes experience at Big Four firms PricewaterhouseCoopers (PwC) and Deloitte, where he worked with clients across diverse industries, developing deep expertise in financial analysis, compliance, and accounting optimization.\n\nThrough Tuysuzoglu CPA, he provides expert guidance on U.S. accounting and complex tax matters, supporting both corporate and individual clients in navigating today\'s evolving financial landscape.',
            'team.tayfunDisclaimerTitle': 'Independent Professional Notice',
            'team.tayfunDisclaimer': 'Tuysuzoglu CPA is an independent professional accounting service provider and a separate legal entity. Tuysuzoglu CPA is not an employee, agent, or representative of IM Global Inc.\n\nThe inclusion of Tuysuzoglu CPA on this website is for informational purposes only. IM Global Inc. does not receive financial compensation, referral fees, or commissions for referencing this professional. Clients are under no obligation to use their services and are encouraged to conduct their own due diligence before engaging any CPA. IM Global Inc. does not guarantee or warrant the services provided by third-party professionals. Information on this website does not constitute tax, legal, or accounting advice.',
            'team.burcuRole': 'Attorney',
            'team.burcuBio': 'Burcu Tansu is a Los Angeles based attorney specializing in immigration law, with strong connections to the Turkish American community. She helps clients navigate U.S. immigration systems, visa processes, and legal challenges with clarity, compassion, and expertise.',
            'team.ariRole': 'Accountant',
            'team.ariBio': 'Ari Demiral is a Los Angeles based accountant with over 35 years of experience in tax planning, accounting, and business advisory services, as well as experience as a professor and university lecturer. With roots in Turkey and a deep understanding of both U.S. and international financial practices, he helps investors, business owners, and individuals structure deals, minimize tax exposure, and build long term financial success.',
            'team.ayseRole': 'Türkiye Real Estate Investment Consultant',
            'team.ayseBio': 'A licensed real estate professional based in Kadıköy, Istanbul, with a proven track record in the real estate industry. Brings strong expertise in marketing management, negotiation, market planning, business planning, and international marketing, delivering strategic and results driven services to both local and international clients. Holds a Bachelor’s degree in English Language and Literature from Hacettepe University, combining strong communication skills with a professional approach to real estate advisory.',

            // Contact
            'contact.titlePre': 'Get in ',
            'contact.titleHighlight': 'Touch',
            'contact.ctaText': 'Ready to explore new opportunities? Your future in U.S. real estate starts here. Contact us today to begin a personalized real estate journey built around your goals.',
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
            'hero.titleLine1': 'Amerika\'da',
            'hero.titleLine1b': 'Gayrimenkul Yatırımına',
            'hero.titleLine2': 'Açılan Stratejik Yolunuz',
            'hero.subtitle': 'Uluslararası yatırımcılara yalnızca fırsatlar sunmakla kalmıyor; ABD’deki yatırımlarının planlama, uygulama ve büyüme aşamalarının tamamında rehberlik ediyoruz.',
            'hero.cta1': 'Yolculuğunuza Başlayın',
            'hero.cta2': 'Daha Fazlasını Öğrenin',
            'hero.scroll': 'Keşfetmek için kaydırın',

            // Stats
            'stats.titlePre': 'Neden ',
            'stats.titleHighlight': 'ABD Gayrimenkulüne Yatırım?',
            'stats.subtitle': 'Amerika Birleşik Devletleri, dünyanın en güvenli ve en karlı gayrimenkul pazarlarından biri olmaya devam ediyor.\n\nÇok az ülkenin sunabileceği istikrar, şeffaflık ve uzun vadeli büyüme potansiyeli sunuyor.',
            'stats.trillion': 'Trilyon',
            'stats.billion': 'Milyar',
            'stats.rent': 'Kira',
            'stats.marketValue': 'Toplam ABD Gayrimenkul Piyasa Değeri',
            'stats.intlPurchases': 'Yıllık Uluslararası Gayrımenkul Alımı',
            'stats.renters': 'ABD’de Konutlarda Kiracı Oranı',

            // Why Us
            'whyUs.titlePre': 'Neden ',
            'whyUs.intro1': 'Biz sadece alım satım işlemleri yapmıyoruz; kalıcı ilişkiler kuruyoruz. \n\nHer müşterimize bir iş ortağı gözüyle bakıyoruz. Önce sizi dinliyoruz; hedeflerinizi, endişelerinizi, hayallerinizi sonra da size özel bir yol haritası çiziyoruz.',
            'whyUs.intro2': 'Güney Kaliforniya’daki güçlü yerel bağlarımız ve ülke genelinde 500’den fazla ofise erişimimizle, kültürel, hukuki ve finansal karmaşıklıkları sizin yerinize yönetiyoruz; böylece bu süreci tek başınıza yürütmek zorunda kalmıyorsunuz.',
            'whyUs.feature1Title': 'Küresel Erişim + Yerel Deneyim',
            'whyUs.feature1Text': 'Realty ONE Group’un dünya çapındaki 500+ ofisinin desteğiyle, Güney Kaliforniya’daki yerel deneyimimizi bir araya getiriyor; kültürel ve finansal unsurları dikkate alarak küresel yatırımcıları ABD gayrimenkul fırsatlarıyla buluşturuyoruz.',
            'whyUs.feature1Expanded': 'Biz sadece emlak danışmanları değiliz; ABD’de gayrimenkul sahibi olma sürecinin her aşamasında yanınızda olan stratejik iş ortaklarıyız.\n\nYatırımcı hizmetlerimiz, uluslararası alıcılara ABD’de sorunsuz ve güvenli bir gayrimenkul deneyimi sunmak üzere tasarlanmıştır. Biz sadece işlemleri yönetmiyor, müşterilerimize rehberlik ediyoruz. \n\nHer müşterinin hikayesi kendine özgüdür; bu nedenle doğru yolu birlikte belirlemeden önce hedeflerinizi, endişelerinizi ve vizyonunuzu anlamaya zaman ayırıyoruz.',
            'whyUs.feature2Title': 'Kanıtlanmış Başarı',
            'whyUs.feature2Text': 'Realty ONE Group, 87.000\'den fazla işlemde 33,7 milyar dolarlık satış gerçekleştirdi. Biz güvenebileceğiniz sonuçlar sunuyoruz.',
            'whyUs.feature2Expanded': 'Dünyanın en hızlı büyüyen gayrimenkul markalarından biri olduk. Her yıl on binlerce işlem kapatıyor ve yıllık 30 milyar doların üzerinde satış hacmine ulaşıyoruz. Dünya genelinde 500\'den fazla ofis ve 19.000\'i aşkın profesyonelle, ağımız her ölçekte tutarlı sonuçlar sunuyor.',
            'whyUs.feature3Title': 'Şeffaf Rehberlik',
            'whyUs.feature3Text': 'Uluslararası alıcılar için karmaşık hukuki, vergisel ve mülkiyet yapılarını anlaşılır hale getiriyoruz, her adımda tam netlik sağlıyoruz.',
            'whyUs.feature3Expanded': 'Uluslararası yatırımcılar ABD pazarına ilgi duyar ancak sürecin hukuki, finansal ve kültürel detayları çoğu zaman karmaşık olabilir. Biz, tüm seçenekleri adım adım netleştirir, hiçbir detayın gözden kaçmamasını sağlar ve sürecin her aşamasını titizlikle koordine ederiz. Sonuç; sorunsuz bir işlem, doğru yapılandırılmış bir yatırım ve uzun vadeli büyüme için sağlam bir temel olur.\n\nYatırım sürecinin tamamında sizi temsil eder; fırsatların belirlenmesinden sözleşme müzakerelerine ve tüm süreç yönetimine kadar her adımı, kendi ailemiz için gösterdiğimiz özenle yürütürüz.',
            'whyUs.feature4Title': 'Kapsamlı Destek',
            'whyUs.feature4Text': 'Yatırım yolculuğunuz satın almayla bitmez; bu yalnızca başlangıçtır. Portföyünüz için sürekli destek sunuyoruz.',
            'whyUs.feature4Expanded1': 'Yatırım sürecinin her aşamasında, yıllar içinde güvene dayalı ilişkiler kurduğumuz profesyonel ağımızla sizi destekliyoruz. \n\nBu sayede yatırımınız yalnızca hukuki ve yapısal açıdan sağlam olmakla kalmaz; aynı zamanda uzun vadeli başarı ve gönül rahatlığı sunacak şekilde kurgulanır.',
            'whyUs.feature4Item1': '1. Yatırımcılar için piyasa analizi ve stratejiler',
            'whyUs.feature4Item2': '2. Güvenilir avukatlar, mali müşavirler ve mülk yöneticileriyle tanışma',
            'whyUs.feature4Item3': '3. Uzun vadeli portföy planlaması ve destek',
            'whyUs.whoWeAre': 'Biz Kimiz',
            'whyUs.whoWeAreText1': 'Dünya genelindeki yatırımcıları Amerika pazarındaki fırsatlarla buluşturmaya kendini adamış, ABD çapında ve uluslararası erişime sahip Güney Kaliforniya merkezli bir gayrimenkul grubuyuz.',
            'whyUs.whoWeAreText2': 'Bu şirketi, uluslararası yatırımcıların yurt dışından ABD\'de mülk alırken karşılaştıkları kendine özgü zorlukları aşmalarına yardımcı olmak için kurduk. \n\nHukuki ve finansal sistemlerde yol bulmaktan kültürel ve dil engellerini aşmaya kadar her konuda yardımcı oluyoruz.',
            'whyUs.whoWeAreText3': 'Yerel uzmanlığı küresel bakış açısıyla harmanlayarak, her müşterimizin kültürel, hukuki ve finansal farklılıkları güvenle aşmasını sağlıyoruz. Misyonumuzun özü; yatırımları uzun vadeli büyümeye, işlemleri kalıcı dostluklara dönüştürmek.',

            // Investments
            'investments.titlePre': 'Yatırım ',
            'investments.titleHighlight': 'Türleri',
            'investments.intro': 'Yatırımcıların, kendilerine özgü hedeflerine en uygun gayrimenkul türünü belirlemelerine yardımcı oluyoruz. İster konut (residential) veya apartman tipi konutlardan (multifamily) kira geliri elde etmeyi, ister seçkin ticari piyasalarda uzun vadeli değer artışını, ister işiniz için ABD’de bir üs oluşturmayı hedefleyin; yatırım arayışınızı önceliklerinize göre şekillendiriyoruz. Uzmanlığımız sayesinde, doğru pazar segmentine güven ve netlikle adım atmanızı sağlıyoruz. ',
            'investments.residentialTitle': 'Konut Nitelikli Gayrimenkuller (Residential)',
            'investments.residentialText': 'Kira geliri veya değer artışı için müstakil evler, daireler ve apartman tipi konutlar.',
            'investments.commercialTitle': 'Ticari Konutlar',
            'investments.commercialText': 'Uzun vadeli büyüme potansiyeli olan seçkin lokasyonlarda ofis, mağaza ve karma kullanımlı alanlar.',
            'investments.industrialTitle': 'Endüstriyel Gayrimenkuller (Industrial)',
            'investments.industrialText': 'Günümüzün tedarik zinciri ihtiyaçlarına uygun depolar, lojistik merkezleri ve özel tesisler.',
            'investments.businessTitle': 'Stratejik İş ve Yatırım Fırsatları',
            'investments.businessText': 'Operasyonel bir zemin arayan yatırımcılar için ABD merkezli franchising, otelcilik ve küçük işletmeler.',

            // Process
            'process.titlePre': 'Süreci Nasıl ',
            'process.titleHighlight': 'Kolaylaştırıyoruz',
            'process.intro': 'Sınır ötesi yatırım yapmak karmaşık görünebilir ama biz bunu kolaylaştırıyoruz. İlk görüşmeden itibaren kafanızdaki tüm soru işaretlerini gideren net, adım adım bir süreç sunuyoruz. \n\nKullanıcı dostu sistemimiz sayesinde dünyanın neresinde olursanız olun, her güncellemeye, belgeye ve iletişime anında ulaşabilirsiniz. Neyi ne zaman bilmeniz gerektiğini net olarak belirtiyor ve uzmanlık gerektiren konularda sizi doğru kişilerle buluşturuyoruz.',
            'process.step1Title': 'Size Özel Danışmanlık',
            'process.step1Text': 'Yatırım yolculuğunuz, kapsamlı bir ön değerlendirme görüşmesiyle başlar. Yeni bir konut edinme, ticari bir gayrimenkul satın alma ya da yüksek getirili bir yatırım portföyü oluşturma hedefleriniz doğrultusunda; vizyonunuzu, beklentilerinizi ve önceliklerinizi detaylı şekilde analiz ederiz.',
            'process.step2Title': 'Piyasa Analizi ve Strateji',
            'process.step2Text': 'Mevcut ilanlarla sınırlı kalmıyor; gelişmiş piyasa analizleriyle yüksek potansiyelli yatırım fırsatlarını tespit ediyoruz.\n\nPiyasa trendlerini, uzun vadeli değer artışını ve kira gelirini dikkate alarak, yatırım hedeflerinizle birebir uyumlu stratejiler geliştiriyoruz.',
            'process.step3Title': 'Kapsamlı Gayrimenkul Arama Süreci',
            'process.step3Text': 'Ülke çapındaki Realty ONE Group ağına ve geniş pazar erişimimize dayanarak, size en uygun mülkü titizlikle belirliyoruz. Araştırma sürecimiz; konut nitelikli gayrimenkullerden, apartman tipi konutlara, ticari ve endüstriyel mülklere kadar tüm kategorileri kapsar ve off market yatırım fırsatlarının da aktif olarak tespit edilmesini içerir.',
            'process.step3Item1': '<strong>Konut Nitelikli Gayrimenkuller (Residential):</strong> Yaşamak için hayalinizdeki evi bulun.',
            'process.step3Item2': '<strong>Ticari / Endüstriyel:</strong> İşletmeniz için ideal alanı güvence altına alın.',
            'process.step3Item3': '<strong>Stratejik İş ve Yatırım Fırsatları:</strong> Değerli gayrimenkul varlıklarına sahip mevcut işletmeleri keşfedin.',
            'process.step4Title': 'Uzman Rehberlik ve Detaylı İnceleme',
            'process.step4Text': 'ABD gayrimenkul piyasası, yabancı yatırımcılar için kendine özgü hukuki ve finansal gereklilikler içerir. Bu süreçte; ilgili hukuki çerçeveler ve yabancı yatırım mevzuatı konusunda rehberlik sağlamaktan, sanal mülk turları organize etmeye ve sınır ötesi iletişimi etkin şekilde yönetmeye kadar uçtan uca destek sunuyoruz.',
            'process.step5Title': 'Sorunsuz Satın Alma Süreci',
            'process.step5Text': 'Dünyanın neresinde olursanız olun, sorunsuz ve verimli bir işlem süreci sağlamak için tüm ayrıntıları titizlikle yönetiyoruz. Şeffaf ve yalın bir süreç sunarak, yatırımınıza netlik ve güvenle odaklanmanıza olanak tanıyoruz.',

            // Team
            'team.titlePre': 'Güvenilir ',
            'team.titleHighlight': 'Profesyonel Ağımız',
            'team.intro': 'ABD gayrimenkul piyasasında sürdürülebilir başarı, güçlü bir ekip ve doğru uzmanlık gerektirir. Uluslararası yatırımcıları desteklemek üzere oluşturduğumuz güvenilir profesyonel ağ ile, yatırımlarınızın hukuki uyumunu, finansal verimliliğini ve etkin yönetimini güvence altına alıyoruz.',
            'team.meldaRole': 'Gayrimenkul Danışmanı | IM Global Co. Kurucu Ortağı',
            'team.meldaBio': 'Türkiye’den ABD’ye uzanan profesyonel geçmişiyle Melda Mariona, ABD gayrimenkul piyasasında uluslararası yatırımcılara değer katan bir bakış açısı sunmaktadır. Mühendislik ve proje yönetimi temelli yaklaşımı sayesinde, yatırım süreçlerini yapılandırılmış, analitik ve sonuç odaklı şekilde yönetir. \n\nGünümüzde, alıcılar, satıcılar ve yatırımcılar için ABD pazarında netlik, güven ve stratejik yönlendirme sağlayarak; konut, ticari ve yatırım amaçlı gayrimenkul segmentlerinde fırsatları etkin şekilde değerlendirmelerine yardımcı olmaktadır.',
            'team.ianRole': 'Gayrimenkul Danışmanı | IM Global Co. Kurucu Ortağı',
            'team.ianBio': 'Gayrimenkul danışmanlığı kariyerine başlamadan önce Ian Zeljak, konut, ticari ve endüstriyel projelerde altyapı ve yapı sistemleri alanında uzun yıllara dayanan bir saha deneyimi edinmiştir. Bu teknik geçmiş, kendisine pek az danışmanın sahip olduğu derin bir yapısal ve operasyonel bakış açısı kazandırmıştır. \n\nBugün Ian, bu uygulamaya dayalı uzmanlığını güçlü piyasa bilgisiyle birleştirerek, yatırımcıların tüm gayrimenkul segmentlerinde fırsatları güvenle değerlendirmelerine ve bilinçli kararlar almalarına rehberlik etmektedir.',
            'team.networkTitle': 'Profesyonel Ağımız',
            'team.saimeRole': 'Avukat',
            'team.saimeBio': 'Saime Atakan, Kaliforniya, New York ve İstanbul\'da lisanslı bir avukattır. Beverly Hills, Kaliforniya\'da kendi hukuk bürosunu yönetmektedir. Sınır ötesi işlemler, şirket birleşmeleri ve satın almalar konusunda başarıyla çalışmaktadır. Ayrıca göçmenlik hukuku ve gayrimenkul hukuku alanlarında da hizmet vermektedir. Yatırımcıların karmaşık hukuki ve finansal yapılarda netlikle ilerlemelerine yardımcı olarak varlıklarını korumalarını ve yatırımlarını başarıya taşımalarını sağlıyor.',
            'team.tayfunRole': 'ABD Lisanslı Certified Public Accountant (CPA)',
            'team.tayfunBio': 'Tayfun Tuysuzoglu, muhasebe, finans ve vergi danışmanlığı alanlarında 20 yılı aşkın deneyime sahip, ABD lisanslı bir Serbest Muhasebeci Mali Müşavir (CPA)\'dır. Bilkent Üniversitesi Endüstri Mühendisliği mezunu olup, Texas A&M University\'de Finans ve Muhasebe alanlarında yüksek lisans dereceleri almıştır.\n\nKariyeri boyunca, \"Big Four\" olarak bilinen PricewaterhouseCoopers (PwC) ve Deloitte firmalarında görev almış; farklı sektörlerden geniş bir müşteri portföyüyle çalışarak finansal analiz, mevzuata uyum ve muhasebe süreçlerinin optimize edilmesi konularında derin bir uzmanlık geliştirmiştir.\n\nTuysuzoglu CPA bünyesinde, ABD muhasebe sistemi ve karmaşık vergi konularında uzman rehberlik sunmakta; kurumsal ve bireysel müşterilerin günümüzün gelişen finansal yapısında güvenle ilerlemelerine destek olmaktadır.',
            'team.tayfunDisclaimerTitle': 'Bağımsız Profesyonel Bildirimi',
            'team.tayfunDisclaimer': 'Tuysuzoglu CPA, bağımsız bir profesyonel muhasebe hizmet sağlayıcısı olup ayrı bir tüzel kişiliktir. Tuysuzoglu CPA, IM Global Inc.\'in çalışanı, temsilcisi veya acentesi değildir.\n\nTuysuzoglu CPA\'nın bu web sitesinde yer alması yalnızca bilgilendirme amaçlıdır. IM Global Inc., bu profesyonelin tavsiye edilmesi karşılığında herhangi bir mali ödeme, yönlendirme ücreti veya komisyon almamaktadır. Müşteriler, bu hizmetleri kullanmak zorunda değildir ve bir CPA ile çalışmadan önce kendi değerlendirmelerini ve gerekli incelemelerini yapmaları tavsiye edilir. IM Global Inc., üçüncü taraf profesyoneller tarafından sunulan hizmetleri garanti etmez veya taahhüt etmez. Bu web sitesinde yer alan bilgiler vergi, hukuki veya muhasebe danışmanlığı niteliği taşımaz.',
            'team.burcuRole': 'Avukat',
            'team.burcuBio': 'Burcu Tansu, göçmenlik hukuku konusunda uzmanlaşmış, Türk-Amerikan topluluğuyla güçlü bağları olan Los Angeles merkezli bir avukattır. Müvekkillerinin ABD göçmenlik sisteminde, vize süreçlerinde ve hukuki zorluklarda netlik, anlayış ve uzmanlıkla yol almasına yardımcı oluyor.',
            'team.ariRole': 'Mali Müşavir',
            'team.ariBio': 'Ari Demiral, vergi planlaması, muhasebe ve iş danışmanlığı alanlarında 35 yılı aşkın deneyime sahip, aynı zamanda üniversite öğretim üyeliği yapmış Los Angeles merkezli bir mali müşavirdir. Türkiye kökenli olup hem ABD hem de uluslararası finansal uygulamalara hâkim; yatırımcılara, işletme sahiplerine ve bireylere işlem yapılandırma, vergi yükünü azaltma ve uzun vadeli finansal başarı inşa etme konularında destek oluyor.',
            'team.ayseRole': 'Türkiye Gayrimenkul Yatırım Danışmanı',
            'team.ayseBio': 'Kadıköy, İstanbul merkezli lisanslı bir gayrimenkul profesyoneli olarak, gayrimenkul sektöründe güçlü ve kanıtlanmış bir deneyime sahiptir. Pazarlama yönetimi, müzakere, pazar planlaması, iş planlaması ve uluslararası pazarlama alanlarındaki uzmanlığıyla; yerel ve uluslararası müşterilere stratejik ve sonuç odaklı hizmet sunmaktadır. Hacettepe Üniversitesi İngiliz Dili ve Edebiyatı bölümünden lisans derecesine sahip olup, güçlü iletişim becerilerini gayrimenkul danışmanlığı alanındaki profesyonel yaklaşımıyla birleştirmektedir.',

            // Contact
            'contact.titlePre': 'İletişime ',
            'contact.titleHighlight': 'Geçin',
            'contact.ctaText': 'Fırsatları keşfetmeye hazır mısınız? Amerika’daki geleceğiniz burada başlıyor. Kişiye özel gayrimenkul yolculuğunuza başlamak için bugün bizimle iletişime geçin.',
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
    window._translations = translations;

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
            const customKey = btnText.getAttribute('data-i18n');
            if (content && content.classList.contains('active')) {
                btnText.textContent = t['common.showLess'];
            } else if (customKey && t[customKey]) {
                // Use custom translation key instead of generic Read More
                btnText.textContent = t[customKey];
            } else {
                btnText.textContent = t['common.readMore'];
            }
        });
    }

});
