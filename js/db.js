/* ==========================================================================
   GENESEON ACADEMY - RELATIONAL IN-MEMORY + LOCALSTORAGE DATABASE
   ========================================================================== */

const STORAGE_KEY = 'ja_academy_db_v1';

// Initial Mock Seed Data
const initialDB = {
  users: [
    {
      id: 'usr_admin',
      name: 'Super Admin',
      email: 'admin@jaacademy.com',
      mobile: '01711000001',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      educationType: null,
      batchOrTarget: 'Admin Portal',
      status: 'active',
      joinedAt: '2025-01-01'
    },
    {
      id: 'usr_ssc',
      name: 'তানভীর আহমেদ (Tanvir)',
      email: 'tanvir.ssc@jaacademy.com',
      mobile: '01811223344',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      educationType: 'SSC',
      batchOrTarget: 'SSC 2026 Batch',
      status: 'active',
      streak: 12,
      joinedAt: '2025-06-15',
      enrolledCourses: ['crs_ssc_phy_math'],
      completedLessons: ['les_ssc_01', 'les_ssc_02'],
      unlockedProducts: ['prod_ssc_pdf']
    },
    {
      id: 'usr_hsc',
      name: 'নুসরাত জাহান (Nusrat)',
      email: 'nusrat.hsc@jaacademy.com',
      mobile: '01911334455',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      educationType: 'HSC',
      batchOrTarget: 'HSC 2025 Science Batch',
      status: 'active',
      streak: 8,
      joinedAt: '2025-07-20',
      enrolledCourses: ['crs_hsc_science'],
      completedLessons: ['les_hsc_01'],
      unlockedProducts: []
    },
    {
      id: 'usr_job',
      name: 'আব্দুল হান্নান (Hannan)',
      email: 'hannan.bcs@jaacademy.com',
      mobile: '01711445566',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      educationType: 'JOB',
      batchOrTarget: '47th BCS & Primary Teacher',
      status: 'active',
      streak: 21,
      joinedAt: '2025-04-10',
      enrolledCourses: ['crs_bcs_preli'],
      completedLessons: ['les_bcs_01', 'les_bcs_02', 'les_bcs_03'],
      unlockedProducts: ['prod_bcs_pdf']
    }
  ],

  courses: [
    {
      id: 'crs_ssc_phy_math',
      slug: 'ssc-physics-higher-math-2026',
      category: 'SSC',
      title: 'SSC 2026 পদার্থবিজ্ঞান ও উচ্চতর গণিত পূর্ণাঙ্গ প্রস্তুতি',
      titleEn: 'SSC 2026 Physics & Higher Math Complete Masterclass',
      instructor: {
        name: 'ইঞ্জি. মো. রফিকুল ইসলাম (BUET)',
        role: 'সিনিয়র মেন্টর ও লেখক',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      previewVideo: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      price: 1500,
      originalPrice: 3000,
      discount: 50,
      rating: 4.9,
      studentsCount: 2450,
      totalClasses: 48,
      duration: '75+ Hours',
      language: 'Bangla',
      isPublished: true,
      description: 'এসএসসি ২০২৬ পরীক্ষার্থীদের জন্য পদার্থবিজ্ঞান ও উচ্চতর গণিতের বেসিক টু অ্যাডভান্সড পূর্ণাঙ্গ কোর্স। রয়েছে অধ্যায়ভিত্তিক লাইভ ক্লাস, রেকর্ডেড লেকচার, মডেল টেস্ট এবং সার্বক্ষণিক এআই ডাউট সলভ সুবিধা।',
      whatYouWillLearn: [
        'পদার্থবিজ্ঞান ১ম ও ২য় পত্রের সকল গাণিতিক সমস্যার শর্টকাট টেকনিক',
        'উচ্চতর গণিতের জ্যামিতি, ত্রিকোণমিতি ও স্থানাঙ্ক জ্যামিতির নিখুঁত দখল',
        'বিগত ১০ বছরের বোর্ড প্রশ্ন ও শীর্ষ স্কুলের টেস্ট পেপার সমাধান',
        'CQ ও MCQ দ্রুত নির্ভুল সমাধানের বিশেষ মেথড'
      ],
      chapters: [
        {
          id: 'chap_ssc_01',
          title: 'অধ্যায় ০১: ভৌত রাশি ও পরিমাপ (Physical Quantities)',
          lessons: [
            { id: 'les_ssc_01', title: 'ক্লাস ০১: ভার্নিয়ার স্কেল ও স্লাইড ক্যালিপার্স', duration: '45 min', type: 'video', isPreview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', pdfUrl: '#', notes: 'ভার্নিয়ার ধ্রুবক VC = s/n সূত্রটির পুঙ্খানুপুঙ্খ ব্যাখ্যা ও টেস্ট পেপারের গুরুত্বপূর্ণ অঙ্ক।' },
            { id: 'les_ssc_02', title: 'ক্লাস ০২: স্ক্রু গজ ও ত্রুটির হিসাব', duration: '50 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', pdfUrl: '#', notes: 'পিচ এবং লঘিষ্ঠ গণন সংক্রান্ত বোর্ডের সকল জটিল প্রশ্ন সমাধান।' }
          ]
        },
        {
          id: 'chap_ssc_02',
          title: 'অধ্যায় ০২: গতি ও বল (Motion & Dynamics)',
          lessons: [
            { id: 'les_ssc_03', title: 'ক্লাস ০১: গতির সমীকরণ ও গ্রাফ এনালাইসিস', duration: '55 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', pdfUrl: '#', notes: 's-t এবং v-t গ্রাফ থেকে ত্বরণ ও অতিক্রান্ত দূরত্ব নির্ণয়ের সহজ উপায়।' },
            { id: 'les_ssc_04', title: 'ক্লাস ০২: নিউটনের গতিসূত্র ও ভরবেগের সংরক্ষণশীলতা', duration: '60 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', pdfUrl: '#', notes: 'বন্দুক ও গুলির পশ্চাৎবেগ এবং সংঘর্ষের গাণিতিক সমস্যা সমাধান।' }
          ]
        }
      ]
    },
    {
      id: 'crs_hsc_science',
      slug: 'hsc-2025-science-physics-chemistry-math',
      category: 'HSC',
      title: 'HSC 2025 সায়েন্স কমপ্লিট বান্ডেল (Physics + Chemistry + Math)',
      titleEn: 'HSC 2025 Complete Science Bundle',
      instructor: {
        name: 'ড. আশরাফুল হক ও টিম (DU, BUET)',
        role: 'এডুকেশন ডিরেক্টর',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
      previewVideo: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      price: 2400,
      originalPrice: 5000,
      discount: 52,
      rating: 4.95,
      studentsCount: 3890,
      totalClasses: 90,
      duration: '140+ Hours',
      language: 'Bangla',
      isPublished: true,
      description: 'এইচএসসি ২০২৫ ও ইঞ্জিনিয়ারিং/ভার্সিটি ভর্তি পরীক্ষার মজবুত ভিত্তি তৈরির জন্য সেরা কোর্স।',
      whatYouWillLearn: [
        'পদার্থবিজ্ঞান ও উচ্চতর গণিতের ক্যালকুলাস ও ভেক্টর গভীর প্রস্তুতি',
        'জৈব রসায়নের ১০০% বিক্রিয়া মনে রাখার ম্যাজিক চার্ট',
        'প্রতি সপ্তাহে অল বাংলাদেশ লাইভ মডেল টেস্ট'
      ],
      chapters: [
        {
          id: 'chap_hsc_01',
          title: 'অধ্যায় ০১: ভেক্টর ও গতিবিদ্যা (Vectors)',
          lessons: [
            { id: 'les_hsc_01', title: 'লেকচার ০১: ভেক্টর ডট ও ক্রস গুণনের প্রয়োগ', duration: '52 min', type: 'video', isPreview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', pdfUrl: '#', notes: 'নদী-নৌকার সর্বনিম্ন সময়ে ও সর্বনিম্ন দূরত্বে পারাপারের সেরা টেকনিক।' }
          ]
        }
      ]
    },
    {
      id: 'crs_bcs_preli',
      slug: '47th-bcs-preliminary-special-batch',
      category: 'JOB',
      title: '৪৭তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ প্রস্তুতি কোর্স (All 10 Subjects)',
      titleEn: '47th BCS Preliminary Comprehensive Master Course',
      instructor: {
        name: 'নাজমুল হাসান (৩৭তম বিসিএস প্রশাসন ক্যাডার)',
        role: 'বিসিএস মেন্টর ও লেখক',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      previewVideo: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      price: 2999,
      originalPrice: 6000,
      discount: 50,
      rating: 4.98,
      studentsCount: 5200,
      totalClasses: 120,
      duration: '200+ Hours',
      language: 'Bangla',
      isPublished: true,
      description: 'বিসিএস প্রিলির ২০০ নম্বরের সুনির্দিষ্ট সিলেবাসভিত্তিক প্রস্তুতি। প্রতিটি টপিকের লেকচার শিট ও সাম্প্রতিক তথ্যাবলী অন্তর্ভুক্ত।',
      whatYouWillLearn: [
        'বাংলা সাহিত্য ও ব্যাকরণের গুরুত্বপূর্ণ ৭০ মার্কসের স্পেশাল প্রস্তুতি',
        'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলীর ১০০% সাম্প্রতিক তথ্যের আপডেট',
        'গাণিতিক যুক্তি ও মানসিক দক্ষতার ৫০ নম্বরে ফুল মার্কস নিশ্চিত করার হ্যাকস'
      ],
      chapters: [
        {
          id: 'chap_bcs_01',
          title: 'অধ্যায় ০১: বাংলা ভাষা ও সাহিত্য (Bangla Literature & Grammar)',
          lessons: [
            { id: 'les_bcs_01', title: 'ক্লাস ০১: প্রাচীন ও মধ্যযুগ (চর্যাপদ ও মঙ্গলকাব্য)', duration: '65 min', type: 'video', isPreview: true, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', pdfUrl: '#', notes: 'চর্যাপদের আবিষ্কার, পদকর্তা ও মধ্যযুগের শ্রীকৃষ্ণকীর্তন কাব্যের পুঙ্খানুপুঙ্খ তথ্য।' },
            { id: 'les_bcs_02', title: 'ক্লাস ০২: আধুনিক যুগ ও পঞ্চপাণ্ডব', duration: '60 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', pdfUrl: '#', notes: 'মাইকেল মধুসূদন দত্ত থেকে শুরু করে রবীন্দ্রনাথ ও নজরুলের সাহিত্যকর্ম।' }
          ]
        },
        {
          id: 'chap_bcs_02',
          title: 'অধ্যায় ০২: গাণিতিক যুক্তি ও শর্টকাট (Math)',
          lessons: [
            { id: 'les_bcs_03', title: 'ক্লাস ০১: শতকরা, লাভ-ক্ষতি ও সুদকষা', duration: '58 min', type: 'video', isPreview: false, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', pdfUrl: '#', notes: '১০ সেকেন্ডে জটিল লাভ-ক্ষতির অংক সমাধান পদ্ধতি।' }
          ]
        }
      ]
    },
    {
      id: 'crs_primary_job',
      slug: 'primary-assistant-teacher-fast-track',
      category: 'JOB',
      title: 'প্রাথমিক সহকারী শিক্ষক নিয়োগ চূড়ান্ত প্রস্তুতি ব্যাচ',
      titleEn: 'Primary Assistant Teacher Fast-Track Batch',
      instructor: {
        name: 'ফারহানা ইসলাম ও প্যানেল',
        role: 'সিনিয়র ফ্যাকাল্টি',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
      },
      thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
      price: 1200,
      originalPrice: 2500,
      discount: 52,
      rating: 4.85,
      studentsCount: 1980,
      totalClasses: 45,
      duration: '60+ Hours',
      language: 'Bangla',
      isPublished: true,
      description: '৮০ নম্বরের লিখিত পরীক্ষায় ৭৫+ তোলার জন্য স্পেশাল রিভিশন ও প্র্যাকটিস কোর্স।'
    }
  ],

  exams: [
    {
      id: 'ex_ssc_01',
      title: 'SSC 2026 পদার্থবিজ্ঞান বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট - ০১',
      category: 'SSC',
      subject: 'Physics',
      totalQuestions: 15,
      durationMinutes: 15,
      totalMarks: 15,
      negativeMarking: 0.25,
      accessType: 'free',
      isLive: true,
      startDate: '2025-10-01',
      endDate: '2026-03-30',
      questionIds: ['q_ssc_01', 'q_ssc_02', 'q_ssc_03', 'q_ssc_04', 'q_ssc_05']
    },
    {
      id: 'ex_hsc_01',
      title: 'HSC 2025 উচ্চতর গণিত ভেক্টর ও ক্যালকুলাস মেগা টেস্ট',
      category: 'HSC',
      subject: 'Higher Math',
      totalQuestions: 15,
      durationMinutes: 15,
      totalMarks: 15,
      negativeMarking: 0.25,
      accessType: 'free',
      isLive: true,
      startDate: '2025-10-01',
      endDate: '2026-05-30',
      questionIds: ['q_hsc_01', 'q_hsc_02', 'q_hsc_03', 'q_hsc_04']
    },
    {
      id: 'ex_job_01',
      title: '৪৭তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ মডেল টেস্ট - ০১ (All Subject)',
      category: 'JOB',
      subject: 'BCS Preliminary',
      totalQuestions: 20,
      durationMinutes: 20,
      totalMarks: 20,
      negativeMarking: 0.5,
      accessType: 'free',
      isLive: true,
      startDate: '2025-10-01',
      endDate: '2026-12-30',
      questionIds: ['q_job_01', 'q_job_02', 'q_job_03', 'q_job_04', 'q_job_05']
    }
  ],

  questions: [
    // SSC Questions
    {
      id: 'q_ssc_01',
      category: 'SSC',
      subject: 'Physics',
      chapter: 'ভৌত রাশি ও পরিমাপ',
      topic: 'স্লাইড ক্যালিপার্স',
      year: '2024',
      board: 'Dhaka Board',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'একটি ভার্নিয়ার স্কেলের মূল স্কেলের ক্ষুদ্রতম এক ভাগের মান 1 mm এবং ভার্নিয়ারের 20 ভাগ মূল স্কেলের 19 ভাগের সমান হলে ভার্নিয়ার ধ্রুবক (VC) কত?',
      options: [
        '0.05 mm',
        '0.01 mm',
        '0.02 mm',
        '0.5 mm'
      ],
      correctIndex: 0,
      explanation: 'ভার্নিয়ার ধ্রুবক VC = s / n = 1 mm / 20 = 0.05 mm। তাই সঠিক উত্তর (ক) 0.05 mm।'
    },
    {
      id: 'q_ssc_02',
      category: 'SSC',
      subject: 'Physics',
      chapter: 'গতি (Motion)',
      topic: 'পরন্ত বস্তুর সূত্র',
      year: '2023',
      board: 'Rajshahi Board',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'একটি বস্তুকে 49 m/s বেগে খাড়া উপরের দিকে নিক্ষেপ করা হলে এটি কত উচ্চতায় উঠবে? (g = 9.8 m/s²)',
      options: [
        '120 m',
        '122.5 m',
        '245 m',
        '98 m'
      ],
      correctIndex: 1,
      explanation: 'সর্বোচ্চ উচ্চতা H = u² / (2g) = (49 × 49) / (2 × 9.8) = 2401 / 19.6 = 122.5 মিটার।'
    },
    {
      id: 'q_ssc_03',
      category: 'SSC',
      subject: 'Higher Math',
      chapter: 'ত্রিকোণমিতি',
      topic: 'রেডিয়ান পরিমাপ',
      year: '2024',
      board: 'Chittagong Board',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'বৃত্তের চাপ s এবং ব্যাসার্ধ r হলে এবং কেন্দ্রস্থ কোণ θ (রেডিয়ানে) হলে কোনটি সঠিক?',
      options: [
        's = rθ',
        'r = sθ',
        'θ = sr',
        's = r / θ'
      ],
      correctIndex: 0,
      explanation: 'আমরা জানি, বৃত্তচাপ s = rθ (যেখানে θ কোণটি রেডিয়ানে প্রকাশিত)।'
    },
    {
      id: 'q_ssc_04',
      category: 'SSC',
      subject: 'Chemistry',
      chapter: 'পদার্থের গঠন',
      topic: 'আইসোটোপ',
      year: '2023',
      board: 'Comilla Board',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'যেসব পরমাণুর প্রোটন সংখ্যা সমান কিন্তু ভর সংখ্যা ভিন্ন, তাদেরকে কী বলা হয়?',
      options: [
        'আইসোবার',
        'আইসোটোন',
        'আইসোটোপ',
        'আইসোমার'
      ],
      correctIndex: 2,
      explanation: 'প্রোটন সংখ্যা সমান হলে তাদেরকে আইসোটোপ বলে। মনে রাখার সহজ উপায়: আইসোটোপ-এর শেষে "প" মানে প্রোটন সমান।'
    },
    {
      id: 'q_ssc_05',
      category: 'SSC',
      subject: 'Physics',
      chapter: 'বল (Force)',
      topic: 'ভরবেগ ও ত্বরণ',
      year: '2024',
      board: 'Dinajpur Board',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: '5 kg ভরের একটি স্থির বস্তুর উপর 20 N বল 3 সেকেন্ড ধরে প্রয়োগ করলে বস্তুটির শেষ বেগ কত হবে?',
      options: [
        '12 m/s',
        '15 m/s',
        '4 m/s',
        '60 m/s'
      ],
      correctIndex: 0,
      explanation: 'ত্বরণ a = F / m = 20 / 5 = 4 m/s²। শেষ বেগ v = u + at = 0 + (4 × 3) = 12 m/s।'
    },

    // HSC Questions
    {
      id: 'q_hsc_01',
      category: 'HSC',
      subject: 'Physics',
      chapter: 'ভেক্টর',
      topic: 'ডট গুণন ও লম্ব ভেক্টর',
      year: '2024',
      board: 'Dhaka Board',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'A = 2i + 3j - k এবং B = 3i - 2j + m k ভেক্টর দুটি পরস্পর লম্ব হলে m এর মান কত?',
      options: [
        '0',
        '6',
        '-6',
        '12'
      ],
      correctIndex: 0,
      explanation: 'দুটি ভেক্টর পরস্পর লম্ব হওয়ার শর্ত হলো A·B = 0। সুতরাং: (2)(3) + (3)(-2) + (-1)(m) = 0 => 6 - 6 - m = 0 => m = 0।'
    },
    {
      id: 'q_hsc_02',
      category: 'HSC',
      subject: 'Chemistry',
      chapter: 'জৈব রসায়ন',
      topic: 'অ্যালকোহল ও অ্যালকিন',
      year: '2023',
      board: 'Rajshahi Board',
      difficulty: 'Hard',
      questionType: 'MCQ',
      text: 'গাঢ় H₂SO₄ এর উপস্থিতিতে ১৬৫°-১৭০°C তাপমাত্রায় ইথানলকে উত্তপ্ত করলে প্রধান উৎপাদ কোনটি?',
      options: [
        'ডাইইথাইল ইথার',
        'ইথিন (CH₂=CH₂)',
        'ইথেন',
        'ইথান্যাল'
      ],
      correctIndex: 1,
      explanation: '১৬৫°-১৭০°C তাপমাত্রায় অতিরিক্ত গাঢ় সালফিউরিক এসিড ইথানল থেকে এক অণু পানি অপসারণ করে ইথিন (অ্যালকিন) তৈরি করে।'
    },
    {
      id: 'q_hsc_03',
      category: 'HSC',
      subject: 'Higher Math',
      chapter: 'ক্যালকুলাস',
      topic: 'অন্তরীকরণ',
      year: '2024',
      board: 'Jessore Board',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'd/dx (ln sin x) এর মান কত?',
      options: [
        'cot x',
        'tan x',
        'sec x',
        '-cot x'
      ],
      correctIndex: 0,
      explanation: 'd/dx(ln sin x) = (1/sin x) × d/dx(sin x) = (1/sin x) × cos x = cot x।'
    },
    {
      id: 'q_hsc_04',
      category: 'HSC',
      subject: 'Physics',
      chapter: 'কাজ, শক্তি ও ক্ষমতা',
      topic: 'সংরক্ষণশীল বল',
      year: '2023',
      board: 'Sylhet Board',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'নিচের কোনটি অসংরক্ষণশীল (Non-conservative) বলের উদাহরণ?',
      options: [
        'মহাকর্ষ বল',
        'ঘর্ষণ বল (Friction)',
        'স্থির তড়িৎ বল',
        'স্প্রিং বল'
      ],
      correctIndex: 1,
      explanation: 'ঘর্ষণ বল একটি অসংরক্ষণশীল বল, কারণ ঘর্ষণের বিরুদ্ধে কৃতকাজ পুনরুদ্ধার করা যায় না এবং তা তাপে রূপান্তরিত হয়।'
    },

    // Job / BCS Questions
    {
      id: 'q_job_01',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'বাংলা ভাষা ও সাহিত্য',
      topic: 'চর্যাপদ',
      year: '45th BCS',
      board: 'BPSC',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'চর্যাপদের সবচেয়ে বেশি পদ কে রচনা করেছেন?',
      options: [
        'লুইপা',
        'কাহ্নপা',
        'ভুসুকুপা',
        'শবরপা'
      ],
      correctIndex: 1,
      explanation: 'চর্যাপদের সর্বাধিক ১৩টি পদ রচনা করেছেন কাহ্নপা (কাহ্নপাদ)। ২য় সর্বোচ্চ ৮টি পদ রচনা করেছেন ভুসুকুপা এবং চর্যাপদের আদি কবি লুইপা।'
    },
    {
      id: 'q_job_02',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'বাংলাদেশ বিষয়াবলী',
      topic: 'মুক্তিযুদ্ধ ও সংবিধান',
      year: '46th BCS',
      board: 'BPSC',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: 'বাংলাদেশের সংবিধান কত তারিখে গৃহীত হয়?',
      options: [
        '৪ নভেম্বর ১৯৭২',
        '১৬ ডিসেম্বর ১৯৭২',
        '২৬ মার্চ ১৯৭১',
        '১০ জানুয়ারি ১৯৭২'
      ],
      correctIndex: 0,
      explanation: 'গণপরিষদে বাংলাদেশের সংবিধান গৃহীত হয় ৪ নভেম্বর ১৯৭২ এবং এটি কার্যকর হয় ১৬ ডিসেম্বর ১৯৭২ থেকে। ৪ নভেম্বর জাতীয় সংবিধান দিবস।'
    },
    {
      id: 'q_job_03',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'আন্তর্জাতিক বিষয়াবলী',
      topic: 'জাতিসংঘ ও চুক্তি',
      year: '44th BCS',
      board: 'BPSC',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'জাতিসংঘের বর্তমান সদস্য সংখ্যা কতটি?',
      options: [
        '১৯১ টি',
        '১৯২ টি',
        '১৯৩ টি',
        '১৯৫ টি'
      ],
      correctIndex: 2,
      explanation: 'জাতিসংঘের বর্তমান পূর্ণ সদস্য রাষ্ট্র ১৯৩টি। সর্বশেষ সদস্য রাষ্ট্র হলো দক্ষিণ সুদান (২০১১ সালে যোগদান করে)।'
    },
    {
      id: 'q_job_04',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'গাণিতিক যুক্তি',
      topic: 'শতকরা ও লাভ-ক্ষতি',
      year: '45th BCS',
      board: 'BPSC',
      difficulty: 'Medium',
      questionType: 'MCQ',
      text: 'একটি দ্রব্যের ক্রয়মূল্য ও বিক্রয়মূল্যের অনুপাত ৫:৬ হলে শতকরা লাভের হার কত?',
      options: [
        '১০%',
        '১৫%',
        '২০%',
        '২৫%'
      ],
      correctIndex: 2,
      explanation: 'ক্রয়মূল্য ৫ টাকা হলে বিক্রয়মূল্য ৬ টাকা। লাভ = ৬ - ৫ = ১ টাকা। সুতরাং শতকরা লাভ = (১ / ৫) × ১০০% = ২০%।'
    },
    {
      id: 'q_job_05',
      category: 'JOB',
      subject: 'BCS Preliminary',
      chapter: 'ইংরেজি সাহিত্য',
      topic: 'Shakespeare',
      year: '46th BCS',
      board: 'BPSC',
      difficulty: 'Easy',
      questionType: 'MCQ',
      text: '"To be, or not to be, that is the question" — is a famous soliloquy from which play?',
      options: [
        'Macbeth',
        'Othello',
        'Hamlet',
        'King Lear'
      ],
      correctIndex: 2,
      explanation: 'This famous philosophical quote is from William Shakespeare\'s tragedy play "Hamlet" (spoken by Prince Hamlet in Act 3, Scene 1).'
    }
  ],

  products: [
    {
      id: 'prod_bcs_book',
      slug: 'bcs-46th-preliminary-question-bank-book',
      type: 'physical',
      category: 'Books',
      educationTypes: ['JOB'],
      name: 'জেনেসিওন একাডেমি বিসিএস প্রিলিমিনারি প্রশ্নব্যাংক ও পুঙ্খানুপুঙ্খ ব্যাখ্যা (১০ম-৪৬তম বিসিএস)',
      price: 480,
      originalPrice: 650,
      discount: 26,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      stock: 350,
      description: '১০ম থেকে ৪৬তম বিসিএস প্রিলিমিনারি পরীক্ষার প্রতিটি প্রশ্নের নির্ভুল ও সাম্প্রতিক রেফারেন্স সহ ব্যাখ্যা সংবলিত হার্ডকভার বই। সাথে থাকছে হোম ডেলিভারি সুবিধা।',
      included: [
        'হার্ডকভার প্রিমিয়াম প্রিন্টেড বই (৭২০ পৃষ্ঠা)',
        'অধ্যায়ভিত্তিক সাজানো বিগত বছরের প্রশ্নোত্তর',
        'ফ্রি স্পেশাল অনলাইন মডেল টেস্ট অ্যাক্সেস'
      ]
    },
    {
      id: 'prod_ssc_pdf',
      slug: 'ssc-higher-math-shortcut-formula-sheet',
      type: 'digital',
      category: 'PDF',
      educationTypes: ['SSC'],
      name: 'SSC উচ্চতর গণিত ১০০+ শর্টকাট সূত্র ও কনসেপ্ট চিটশিট (HD PDF)',
      price: 99,
      originalPrice: 250,
      discount: 60,
      rating: 4.88,
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'পরীক্ষার আগের রাতের জন্য এসএসসি উচ্চতর গণিতের সকল প্রয়োজনীয় সূত্রের কালারফুল এইচডি ডিজিটাল গাইড। পেমেন্ট করলেই সরাসরি ডাউনলোড করুন।'
    },
    {
      id: 'prod_hsc_notes',
      slug: 'hsc-chemistry-organic-reaction-map-pdf',
      type: 'digital',
      category: 'Notes',
      educationTypes: ['HSC'],
      name: 'HSC জৈব রসায়ন পূর্ণাঙ্গ বিক্রিয়া ফ্লোচার্ট ও রোডম্যাপ (HD Printable PDF)',
      price: 149,
      originalPrice: 350,
      discount: 57,
      rating: 4.96,
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      description: 'জৈব রসায়নের রূপান্তর ও বিক্রিয়া মনে রাখার একমাত্র অল-ইন-ওয়ান ডিজিটাল চার্ট।'
    },
    {
      id: 'prod_model_tests',
      slug: 'ssc-hsc-job-model-test-paper-bundle',
      type: 'physical',
      category: 'Model Tests',
      educationTypes: ['SSC', 'HSC', 'JOB'],
      name: 'জেনেসিওন একাডেমি ২০টি পূর্ণাঙ্গ মডেল টেস্ট ও ওএমআর শিট বান্ডেল (হোম ডেলিভারি)',
      price: 320,
      originalPrice: 500,
      discount: 36,
      rating: 4.75,
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
      stock: 120,
      description: 'আসল পরীক্ষার মতো ওএমআর শিটে প্র্যাকটিস করার জন্য ২০ সেট মুদ্রিত মডেল টেস্ট পেপার।'
    }
  ],

  orders: [
    {
      id: 'ord_1001',
      userId: 'usr_ssc',
      userName: 'তানভীর আহমেদ',
      items: [{ id: 'crs_ssc_phy_math', name: 'SSC 2026 পদার্থবিজ্ঞান ও উচ্চতর গণিত', price: 1500, type: 'course' }],
      totalAmount: 1500,
      paymentGateway: 'bKash',
      transactionId: 'TRX98762514',
      status: 'completed',
      date: '2025-09-12'
    },
    {
      id: 'ord_1002',
      userId: 'usr_job',
      userName: 'আব্দুল হান্নান',
      items: [{ id: 'crs_bcs_preli', name: '৪৭তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ কোর্স', price: 2999, type: 'course' }],
      totalAmount: 2999,
      paymentGateway: 'Nagad',
      transactionId: 'NGD55443322',
      status: 'completed',
      date: '2025-09-15'
    }
  ],

  examAttempts: [
    {
      id: 'atm_1',
      userId: 'usr_ssc',
      examId: 'ex_ssc_01',
      examTitle: 'SSC 2026 পদার্থবিজ্ঞান বোর্ড স্ট্যান্ডার্ড মডেল টেস্ট - ০১',
      score: 4.75,
      totalMarks: 5,
      percentage: 95,
      correct: 5,
      wrong: 0,
      skipped: 0,
      timeTaken: '08:45',
      meritRank: '14 / 1,420',
      percentile: '99.0%',
      submittedAt: '2025-10-02 18:30',
      answers: { 'q_ssc_01': 0, 'q_ssc_02': 1, 'q_ssc_03': 0, 'q_ssc_04': 2, 'q_ssc_05': 0 }
    }
  ],

  notifications: [],

};

// Database Engine with LocalStorage Sync
class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        let dataNeedsSave = false;
        const seededProducts = new Map(
          initialDB.products.map(product => [product.id, product])
        );
        data.products = (data.products || []).map(product => {
          const updatedName = product.name
            ?.replace(/JA\s*Academy/gi, 'Geneseon Academy')
            .replace(/জেএ\s*একাডেমি/g, 'জেনেসিওন একাডেমি');
          if (updatedName !== product.name) dataNeedsSave = true;
          return {
            ...product,
            name: updatedName,
            educationTypes: product.educationTypes ||
              seededProducts.get(product.id)?.educationTypes || []
          };
        });
        const legacyCoupon = (data.coupons || []).find(coupon => coupon.code === 'JA50');
        if (legacyCoupon && !data.coupons.some(coupon => coupon.code === 'GENESEON50')) {
          data.coupons.push({ ...legacyCoupon, code: 'GENESEON50' });
          dataNeedsSave = true;
        }
        if (dataNeedsSave) this.save(data);
        return data;
      }
    } catch (e) {
      console.error('Error loading DB from localStorage:', e);
    }
    this.save(initialDB);
    return JSON.parse(JSON.stringify(initialDB));
  }

  save(data = null) {
    if (data) this.data = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Error saving DB to localStorage:', e);
    }
  }

  reset() {
    this.save(initialDB);
    return this.data;
  }

  // Users & Auth
  getUsers() { return this.data.users || []; }
  getUserById(id) { return this.data.users.find(u => u.id === id); }
  getUserByEmailOrMobile(identifier) {
    return this.data.users.find(u => u.email === identifier || u.mobile === identifier);
  }
  addUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }
  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.save();
      return this.data.users[idx];
    }
    return null;
  }
  mergeServerContent(resources) {
    ['courses', 'exams', 'questions'].forEach(collection => {
      const serverItems = resources[collection] || [];
      const merged = new Map((this.data[collection] || []).map(item => [item.id, item]));
      serverItems.forEach(item => merged.set(item.id, item));
      this.data[collection] = Array.from(merged.values());
    });
    if (Array.isArray(resources.products)) {
      this.data.products = resources.products;
    }
    this.save();
  }

  // Courses
  getCourses() { return this.data.courses || []; }
  getCourseById(id) { return this.data.courses.find(c => c.id === id || c.slug === id); }
  addCourse(course) {
    this.data.courses.unshift(course);
    this.save();
    return course;
  }
  updateCourse(id, updates) {
    const idx = this.data.courses.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.courses[idx] = { ...this.data.courses[idx], ...updates };
      this.save();
      return this.data.courses[idx];
    }
    return null;
  }
  deleteCourse(id) {
    this.data.courses = this.data.courses.filter(c => c.id !== id);
    this.save();
  }

  // Exams
  getExams() { return this.data.exams || []; }
  getExamById(id) { return this.data.exams.find(e => e.id === id); }
  addExam(exam) {
    this.data.exams.unshift(exam);
    this.save();
    return exam;
  }
  deleteExam(id) {
    this.data.exams = this.data.exams.filter(e => e.id !== id);
    this.save();
  }

  // Questions
  getQuestions() { return this.data.questions || []; }
  getQuestionById(id) { return this.data.questions.find(q => q.id === id); }
  addQuestion(q) {
    this.data.questions.unshift(q);
    this.save();
    return q;
  }
  updateQuestion(id, updates) {
    const idx = this.data.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      this.data.questions[idx] = { ...this.data.questions[idx], ...updates };
      this.save();
      return this.data.questions[idx];
    }
    return null;
  }
  deleteQuestion(id) {
    this.data.questions = this.data.questions.filter(q => q.id !== id);
    this.save();
  }

  // Products & Store
  getProducts() { return this.data.products || []; }
  getProductById(id) { return this.data.products.find(p => p.id === id || p.slug === id); }
  saveProduct(product) {
    const index = this.data.products.findIndex(item => item.id === product.id);
    if (index === -1) this.data.products.unshift(product);
    else this.data.products[index] = product;
    this.save();
    return product;
  }
  addProduct(prod) {
    this.data.products.unshift(prod);
    this.save();
    return prod;
  }
  deleteProduct(id) {
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.save();
  }

  // Orders
  getOrders() { return this.data.orders || []; }
  addOrder(order) {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  // Attempts
  getExamAttempts(userId) {
    if (!userId) return this.data.examAttempts || [];
    return (this.data.examAttempts || []).filter(a => a.userId === userId);
  }
  getAttemptById(id) {
    return (this.data.examAttempts || []).find(a => a.id === id);
  }
  addExamAttempt(attempt) {
    if (!this.data.examAttempts) this.data.examAttempts = [];
    this.data.examAttempts.unshift(attempt);
    this.save();
    return attempt;
  }

  // Notifications
  getNotifications(userId) {
    return (this.data.notifications || []).filter(n => n.userId === 'all' || n.userId === userId);
  }
  setServerNotifications(notifications) {
    this.data.notifications = notifications;
    this.save();
  }
  markNotificationsRead(ids) {
    const readIds = new Set(ids);
    (this.data.notifications || []).forEach(notification => {
      if (readIds.has(notification.id)) notification.isRead = true;
    });
    this.save();
  }
  markNotificationRead(id) {
    const n = (this.data.notifications || []).find(notif => notif.id === id);
    if (n) {
      n.isRead = true;
      this.save();
    }
  }

}

export const db = new Database();
