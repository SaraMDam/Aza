import { useState, useEffect, useRef } from "react";

const R2_BASE = "https://pub-296ac8e5f201453fbddfdbd8902dad2f.r2.dev";

const SECTIONS = {
  rest:  { en: { label: "Rest & Return",   tagline: "Let the body remember how to rest" }, ar: { label: "الراحة والعودة",  tagline: "دَع الجسد يتذكّر كيف يرتاح" }, icon: "◑", accent: "#6a96d4" },
  focus: { en: { label: "Focus & Clarity", tagline: "A clear mind is a powerful mind"   }, ar: { label: "التركيز والوضوح", tagline: "الذهن الصافي ذهن قوي"        }, icon: "◈", accent: "#76b09a" },
  heart: { en: { label: "Heart & Healing", tagline: "Return to the warmth within"        }, ar: { label: "القلب والتشافي",  tagline: "عُد إلى الدفء الذي بداخلك"  }, icon: "♡", accent: "#a094b3" },
};

const allTracks = [
  { id: "t1",  audio: "drift.mp3",          en: { title: "Drift, Let Sleep Find You",  subtitle: "For Sleep & Return",  desc: "For falling asleep or drifting back. Stop trying. Let it find you." },                                                                              ar: { title: "حين تحتاج النوم .. دعه يأخذ بيدك", subtitle: "للنوم والعودة إليه",    desc: "تبحث عن النوم، أو استيقظت في منتصف الليل. هذا الصوت يمسك بيدك، ويأخذك بهدوء إلى حيث تحتاج أن تكون." }, duration: "9:36", hz: "528 Hz", sections: ["rest"] },
  { id: "t2",  audio: "joy.mp3",            en: { title: "Joy",                         subtitle: "Bloom",               desc: "For the mornings, the hard days, and every moment in between." },                                                                                   ar: { title: "بهجة .. إشراق",                    subtitle: "تفتّح",                 desc: "للصباح الجديد، واليوم الثقيل، وكل لحظة بينهما." },                                                                                             duration: "7:13", hz: "639 Hz", sections: ["heart"] },
  { id: "t3",  audio: "reset.mp3",          en: { title: "Reset .. Just Breathe",       subtitle: "The Long Exhale",     desc: "For when everything becomes too much. Breathe. Go back lighter." },                                                                                ar: { title: "ضع كل شيء جانبًا .. تنفَّس",      subtitle: "مع كل نَفَس",           desc: "لليوم الثقيل، واللحظة التي يصبح فيها كل شيء كثيرًا. ضع ما تحمله، وتنفّس. ستعود أخف." },                                                    duration: "9:24", hz: "528 Hz", sections: ["rest"] },
  { id: "t4",  audio: "for-love.mp3",       en: { title: "For Love",                    subtitle: "Where Love Lives",    desc: "Love is not something you find. It's something you return to." },                                                                                  ar: { title: "من القلب",                         subtitle: "حيث يسكن الحب",         desc: "الكون يتكلم لغة واحدة. هذا الصوت يعيدك إليها." },                                                                                             duration: "7:25", hz: "639 Hz", sections: ["heart","rest"] },
  { id: "t5",  audio: "deep-focus.mp3",     en: { title: "Locked In .. Deep Focus",     subtitle: "Mental Absorption",   desc: "For the work that demands your full attention. Lock in. Go deep. Get it done." },                                                                  ar: { title: "تركيز وصفاء .. إنجاز",            subtitle: "استيعاب ذهني",          desc: "للعمل الذي يحتاج كل انتباهك .. هيّئ ذهنك للتركيز العميق .. وابقَ فيه حتى تُنجز ما جئت من أجله." },                                          duration: "8:29", hz: "40 Hz",  sections: ["focus"] },
  { id: "t6",  audio: "back-to-center.mp3", en: { title: "Back to Center",              subtitle: "Emotional Balance",   desc: "When you feel off balance, overwhelmed, or just not yourself. This brings you back." },                                                            ar: { title: "العودة إلى مركزك",                subtitle: "توازن عاطفي",           desc: "حين تشعر أنك خارج توازنك، أو أن الأمور أكبر منك، أو أنك لست أنت. هذا يعيدك." },                                                             duration: "8:10", hz: "432 Hz", sections: ["rest","heart"] },
  { id: "t7",  audio: "quietly.mp3",        en: { title: "Quietly, Everything Changes", subtitle: "Return to Center",    desc: "For the heavy heart .. the tired mind .. the weight you have been carrying. Sit with this. Quietly, everything changes." },                        ar: { title: "في هذا الهدوء .. كل شيء يتغيّر",  subtitle: "العودة إلى المركز",     desc: "للقلب الثقيل، والعقل المتعب، وما تحمله منذ زمن. فقط اجلس مع هذا الصوت .. في هذا الهدوء .. كل شيء يتغيّر." },                              duration: "9:07", hz: "432 Hz", sections: ["heart","rest"] },
  { id: "t8",  audio: "creative-space.mp3", en: { title: "Your Creative Space",         subtitle: "Clarity Boost",       desc: "For the empty canvas. This is your space. No pressure. Just create." },                                                                            ar: { title: "فضاؤك الإبداعي",                  subtitle: "صفاء متجدّد",           desc: "للصفحة البيضاء، واللحظة التي يصمت فيها الإلهام. فضاؤك الإبداعي مفتوح لك." },                                                               duration: "8:20", hz: "40 Hz",  sections: ["focus"] },
  { id: "t9",  audio: "deep-peace.mp3",     en: { title: "Deep Peace .. Within",        subtitle: "Quiet Presence",      desc: "Your mind can be loud. Your heart can be heavy. Peace lives underneath all of it." },                                                              ar: { title: "سلامك الداخلي .. أمانك",          subtitle: "هدوء داخلي",            desc: "قد يكون العقل صاخبًا والقلب ثقيلًا .. لكن السلام موجودٌ في الأعماق .. دائمًا هناك." },                                                      duration: "5:19", hz: "432 Hz", sections: ["rest","heart"] },
  { id: "t10", audio: "this-moment.mp3",    en: { title: "This Moment .. Right Here",   subtitle: "Quiet Presence",      desc: "Not yesterday. Not tomorrow. Just this. Three minutes to come back to where you already are." },                                                   ar: { title: "هذه اللحظة .. هنا",               subtitle: "حضور هادئ",             desc: "ليس الأمس، وليس الغد. فقط هذه اللحظة. ثلاث دقائق تعيدك إلى حيث أنت." },                                                                    duration: "3:41", hz: "432 Hz", sections: ["focus","rest"] },
];

const meditationSections = {
  rest:  { accent: "#6a96d4", icon: "◑", trackIds: ["t1","t3","t6","t4","t7","t9","t10"], meditation: { id: "m1", en: { title: "Fall Asleep", desc: "Let the night carry what is left of your day. You do not have to do anything. Just breathe.", comingSoon: true }, ar: { title: "في أحضان الليل .. استسلم", desc: "في هذا الهدوء، ليس عليك أن تفعل شيئًا. فقط سلِّم، وتنفّس، ودع الليل يحمل ما تبقّى من يومك.", audio: "fall-asleep-ar.mp3" }, duration: "18:00" } },
  focus: { accent: "#76b09a", icon: "◈", trackIds: ["t5","t8","t10"],          meditation: { id: "m2", en: { title: "Clear Mind",  desc: "When the noise settles, what is real appears. A meditation to bring you back to your center.", comingSoon: true }, ar: { title: "ما وراء الضجيج", desc: "حين يهدأ الضجيج، يظهر ما هو حقيقي. تأمّل يُعيدك إلى مركزك، ويمنحك ذهنًا صافيًا وقلبًا حاضرًا.", audio: "clear-mind-ar.mp3" }, duration: "15:00" } },
  heart: { accent: "#a094b3", icon: "♡", trackIds: ["t2","t4","t6","t7","t9"], meditation: { id: "m3", en: { title: "Heal", desc: "For everything that hurts. You do not have to name it. Just be here.", comingSoon: true }, ar: { title: "تشافَ بلطف", desc: "الجسد يسمع ما لا تقوله. هذا التأمّل مساحة لكل ما يحتاج إلى راحة. مهما كان، وأينما كان.", comingSoon: true }, duration: "20:00" } },
};

const LEGAL = {
  terms_en: `TERMS OF SERVICE — Aza House Company — Effective 2026

1. ABOUT AZA
Aza is a wellness application offering guided meditations and healing music tracks, owned and operated by Aza House Company.

2. NOT MEDICAL ADVICE
Aza and its content are not a substitute for professional medical advice, diagnosis, or treatment. All content is provided for wellness and relaxation purposes only. If you are experiencing a medical or psychological condition, please consult a qualified healthcare professional.

3. AGE RESTRICTION
Aza is intended for users aged 18 and above. By using this app, you confirm that you are at least 18 years old.

4. SUBSCRIPTION AND PAYMENTS
- 7-day free trial, then $7/month or $50/year.
- Payments processed securely through Stripe.
- You may cancel at any time. Cancellation takes effect at the end of the current billing period.
- No refunds are issued for any reason, including partial billing periods.

5. YOUR ACCOUNT
- You are responsible for maintaining the confidentiality of your account.
- You may not share your account with others.
- Aza House Company reserves the right to suspend or terminate accounts that violate these terms.

6. INTELLECTUAL PROPERTY
All content on Aza including music tracks, guided meditations, text, design, and branding is the exclusive property of Aza House Company and is protected by copyright law. Unauthorized reproduction, distribution, or use of any content is strictly prohibited.

7. LIMITATION OF LIABILITY
Aza House Company shall not be liable for any direct, indirect, or consequential damages arising from the use of this application or its content.

8. CHANGES TO TERMS
Aza House Company reserves the right to update these Terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.

9. CONTACT
sara@azahousecompany.com`,

  privacy_en: `PRIVACY POLICY — Aza House Company — Effective 2026

1. WHAT WE COLLECT
- Your email address and account information
- Payment information (processed securely by Stripe — we never store your card details)
- Usage data — which tracks and meditations you listen to
- Device information — device type, operating system, browser

2. HOW WE USE YOUR INFORMATION
- To create and manage your account
- To process your subscription payments
- To improve the app experience
- To send important account notifications

3. WHAT WE DO NOT DO
- We do not sell your personal data to third parties
- We do not share your data with advertisers
- We do not use your data for any purpose outside of operating Aza

4. DATA STORAGE AND SECURITY
Your data is stored securely using industry-standard encryption. Audio content is stored on protected servers and is only accessible to authenticated subscribers.

5. THIRD-PARTY SERVICES
- Stripe — for payment processing
- Vercel — for app hosting
These services have their own privacy policies which we encourage you to review.

6. YOUR RIGHTS
- Access the personal data we hold about you
- Request deletion of your account and data
- Opt out of non-essential communications

7. GDPR COMPLIANCE
If you are located in the European Union, you have additional rights under GDPR including the right to data portability and the right to lodge a complaint with a supervisory authority.

8. CHILDRENS PRIVACY
Aza is not intended for users under the age of 18. We do not knowingly collect data from minors.

9. CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification.

10. CONTACT
sara@azahousecompany.com`,

  terms_ar: `شروط الخدمة — شركة Aza House — ساري المفعول 2026

١. عن أزا
أزا تطبيق للعافية يقدم تأملات موجّهة ونغمات موسيقية، تمتلكه وتديره شركة Aza House.

٢. ليس نصيحة طبية
أزا وما يقدمه ليس بديلاً عن المشورة الطبية المتخصصة أو التشخيص أو العلاج. جميع المحتوى مخصص لأغراض الراحة والعافية فقط. إذا كنت تعاني من حالة طبية أو نفسية، يرجى استشارة متخصص رعاية صحية مؤهل.

٣. القيود العمرية
أزا مخصص للمستخدمين الذين تبلغ أعمارهم 18 عامًا فأكثر. باستخدامك للتطبيق، تؤكد أنك بلغت هذا السن.

٤. الاشتراك والمدفوعات
- تجربة مجانية لمدة 7 أيام، ثم 7 دولار شهريًا أو 50 دولارًا سنويًا.
- تُعالَج المدفوعات بشكل آمن عبر Stripe.
- يمكنك الإلغاء في أي وقت. يسري الإلغاء في نهاية فترة الفوترة الحالية.
- لا تُقدَّم أي استردادات لأي سبب، بما في ذلك فترات الفوترة الجزئية.

٥. حسابك
- أنت مسؤول عن الحفاظ على سرية حسابك.
- لا يجوز مشاركة حسابك مع الآخرين.
- تحتفظ شركة Aza House بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط.

٦. الملكية الفكرية
جميع المحتوى على أزا بما في ذلك المقاطع الموسيقية والتأملات الموجّهة والنصوص والتصميم والعلامة التجارية هو ملك حصري لشركة Aza House ومحمي بموجب قانون حقوق النشر. يُحظر صراحةً النسخ أو التوزيع أو الاستخدام غير المصرح به لأي محتوى.

٧. تحديد المسؤولية
لن تكون شركة Aza House مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو تبعية ناجمة عن استخدام هذا التطبيق أو محتواه.

٨. التغييرات على الشروط
تحتفظ شركة Aza House بالحق في تحديث هذه الشروط في أي وقت. استمرار استخدام التطبيق بعد التغييرات يعني قبول الشروط الجديدة.

٩. التواصل
sara@azahousecompany.com`,

  privacy_ar: `سياسة الخصوصية — شركة Aza House — ساري المفعول 2026

١. ما نجمعه
- عنوان بريدك الإلكتروني ومعلومات حسابك
- معلومات الدفع (تُعالَج بأمان عبر Stripe — لا نحتفظ أبدًا ببيانات بطاقتك)
- بيانات الاستخدام — المقاطع والتأملات التي تستمع إليها
- معلومات الجهاز — نوع الجهاز ونظام التشغيل والمتصفح

٢. كيف نستخدم معلوماتك
- لإنشاء حسابك وإدارته
- لمعالجة مدفوعات اشتراكك
- لتحسين تجربة التطبيق
- لإرسال إشعارات مهمة تتعلق بحسابك

٣. ما لا نفعله
- لا نبيع بياناتك الشخصية لأطراف ثالثة
- لا نشارك بياناتك مع المعلنين
- لا نستخدم بياناتك لأي غرض خارج نطاق تشغيل أزا

٤. تخزين البيانات والأمان
تُخزَّن بياناتك بأمان باستخدام تشفير بمعايير الصناعة. يُخزَّن محتوى الصوت على خوادم محمية ولا يمكن الوصول إليه إلا للمشتركين المصادق عليهم.

٥. خدمات الطرف الثالث
- Stripe — لمعالجة الدفع
- Vercel — لاستضافة التطبيق
لهذه الخدمات سياسات خصوصية خاصة بها ننصحك بمراجعتها.

٦. حقوقك
- الوصول إلى البيانات الشخصية التي نحتفظ بها عنك
- طلب حذف حسابك وبياناتك
- إلغاء الاشتراك في الاتصالات غير الضرورية

٧. الامتثال للائحة GDPR
إذا كنت مقيمًا في الاتحاد الأوروبي، فلديك حقوق إضافية بموجب اللائحة العامة لحماية البيانات.

٨. خصوصية القاصرين
أزا غير مخصص للمستخدمين الذين تقل أعمارهم عن 18 عامًا. لا نجمع بيانات من القاصرين عن قصد.

٩. التغييرات على هذه السياسة
قد نحدّث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بالتغييرات المهمة عبر البريد الإلكتروني أو إشعار داخل التطبيق.

١٠. التواصل
sara@azahousecompany.com`,
};

const UI = {
  en: {
    welcome: "Welcome", tagline: "Sound and guidance for rest, clarity, and the return to yourself.",
    begin: "Begin", trial: "7 days free · no card required",
    unlock: "Unlock access", member: "✓ Member",
    home: "Home", meditate: "Meditate", music: "Music", playlists: "My Playlists",
    chooseSection: "Choose your path inward", allMusic: "All Music", allTracks: "10 tracks · Solfeggio & sacred tunings",
    myPlaylists: "My Playlists", buildCollection: "Build your personal collection",
    newPlaylist: "+ New", createPlaylist: "Create", cancel: "Cancel", playlistName: "Playlist name",
    playlistPlaceholder: "e.g. Evening Wind Down", noPlaylists: "No playlists yet", noPlaylistsSub: "Tap + New to create your first one",
    emptyPlaylist: "This playlist is empty", browseMusic: "Browse Music", goToMusic: "Go to Music to add tracks",
    shuffle: "⇌ Shuffle", soon: "Soon", meditation: "Meditation",
    guidedMed: "Guided Meditation", musicLabel: "Music",
    search: "Search tracks, Hz, mood...", noResults: "No tracks found",
    saveToPlaylist: "Save tracks to a playlist", createFirst: "Create a Playlist",
    addToPlaylist: "Add to playlist", added: "✓", add: "+",
    unlockFull: "Unlock full access", unlimitedAccess: "Unlimited access to everything.",
    features: ["All 10 healing music tracks","All guided meditations","Unlimited custom playlists","New content added monthly"],
    monthly: "Monthly", yearly: "Yearly", save: "Save 40%", perMonth: "$4.17/month",
    cancelAnytime: "Cancel anytime", startTrial: "Begin — Try Free for 7 Days", welcome2: "✓ Welcome to Aza.",
    noCharge: "No charge until trial ends", track: "tracks", notifyMe: "Notify me",
    notifyDone: "We will let you know when this is ready", emailPlaceholder: "your@email.com",
    back: "← Back", backPlaylists: "← All Playlists",
    terms: "Terms of Service", privacy: "Privacy Policy",
    disclaimer: "Aza is not a medical product. Content is for wellness purposes only.",
    copyright: "© 2026 Aza House Company",
  },
  ar: {
    welcome: "أهلاً بك", tagline: "صوت وإرشاد للراحة والوضوح والعودة إلى نفسك.",
    begin: "ابدأ", trial: "٧ أيام مجانًا · بدون بطاقة",
    unlock: "افتح الوصول الكامل", member: "✓ عضو",
    home: "الرئيسية", meditate: "التأملات الموجَّهة", music: "نغمات", playlists: "قوائمي",
    chooseSection: "اختر مسارك إلى الداخل", allMusic: "كل النغمات", allTracks: "١٠ مقاطع · ترددات سولفيجيو ومقدسة",
    myPlaylists: "قوائمي", buildCollection: "ابنِ مجموعتك الخاصة",
    newPlaylist: "+ جديد", createPlaylist: "إنشاء", cancel: "إلغاء", playlistName: "اسم القائمة",
    playlistPlaceholder: "مثال: مساء هادئ", noPlaylists: "لا توجد قوائم بعد", noPlaylistsSub: "اضغط + جديد لإنشاء أولى قوائمك",
    emptyPlaylist: "هذه القائمة فارغة", browseMusic: "تصفّح النغمات", goToMusic: "اذهب إلى النغمات لإضافة مقاطع",
    shuffle: "⇌ عشوائي", soon: "قريبًا", meditation: "تأمّل",
    guidedMed: "التأمّل الموجَّه", musicLabel: "النغمات",
    search: "ابحث عن مقاطع، هرتز، مزاج...", noResults: "لا توجد نتائج",
    saveToPlaylist: "احفظ المقاطع في قائمة", createFirst: "أنشئ قائمة",
    addToPlaylist: "أضف إلى قائمة", added: "✓", add: "+",
    unlockFull: "افتح الوصول الكامل", unlimitedAccess: "وصول غير محدود لكل المحتوى.",
    features: ["جميع نغمات الموسيقى العلاجية العشر","جميع التأملات الموجّهة","قوائم تشغيل مخصصة غير محدودة","محتوى جديد يُضاف شهريًا"],
    monthly: "شهري", yearly: "سنوي", save: "وفّر ٤٠٪", perMonth: "٤.١٧ دولار/شهر",
    cancelAnytime: "إلغاء في أي وقت", startTrial: "ابدأ — جرّب مجانًا لمدة ٧ أيام", welcome2: "✓ أهلاً بك في أزا.",
    noCharge: "لا يُحسب أي مبلغ حتى انتهاء التجربة", track: "مقاطع", notifyMe: "أخبرني",
    notifyDone: "سنخبرك حين يصبح جاهزًا", emailPlaceholder: "بريدك@الإلكتروني.com",
    back: "رجوع →", backPlaylists: "كل القوائم →",
    terms: "شروط الخدمة", privacy: "سياسة الخصوصية",
    disclaimer: "هذا الموقع وما يقدمه ليس منتجًا طبيًا. المحتوى مخصص لأغراض الراحة فقط.",
    copyright: "© 2026 Aza House Company",
  }
};

function Footer({ ui, bodyFont, onTerms, onPrivacy }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 0 40px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 24 }}>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: bodyFont, lineHeight: 1.8, marginBottom: 10 }}>{ui.disclaimer}</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 10 }}>
        <button onClick={onTerms} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 10, cursor: "pointer", fontFamily: bodyFont, textDecoration: "underline" }}>{ui.terms}</button>
        <button onClick={onPrivacy} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 10, cursor: "pointer", fontFamily: bodyFont, textDecoration: "underline" }}>{ui.privacy}</button>
      </div>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", fontFamily: bodyFont }}>{ui.copyright}</p>
    </div>
  );
}

function SectionTags({ sections, lang }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
      {sections.map(s => (
        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 3, background: `${SECTIONS[s].accent}15`, border: `1px solid ${SECTIONS[s].accent}30`, color: SECTIONS[s].accent, fontSize: 9, padding: "2px 7px", borderRadius: 10 }}>
          {SECTIONS[s].icon} {SECTIONS[s][lang].label}
        </span>
      ))}
    </div>
  );
}

function WaveVisualizer({ color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 18 }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ width: 3, borderRadius: 2, background: color || "#4a9eff", height: "100%", animation: "wave 1.2s ease-in-out infinite", animationDelay: `${i*0.15}s` }} />
      ))}
    </div>
  );
}

function TrackRow({ track, isPlaying, onPlay, showAdd, onAdd, inPlaylist, lang }) {
  const t = track[lang];
  const primaryAccent = SECTIONS[track.sections[0]].accent;
  const isRTL = lang === "ar";
  return (
    <div onClick={() => onPlay(track)}
      style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: isPlaying ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)", border: `1px solid ${isPlaying ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)"}`, borderRadius: 14, marginBottom: 8, cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { if (!isPlaying) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { if (!isPlaying) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
    >
      <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: isPlaying ? primaryAccent : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
        {isPlaying ? <WaveVisualizer color="#050f23" /> : <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>▶</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontFamily: isRTL ? "'Noto Naskh Arabic', serif" : "'Fraunces', serif", fontWeight: 400, color: "#fff", marginBottom: 2 }}>{t.title}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{t.subtitle}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 4, fontStyle: "normal" }}>{t.desc}</div>
        <SectionTags sections={track.sections} lang={lang} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0, paddingTop: 2 }}>
        <span style={{ color: primaryAccent, fontSize: 10, letterSpacing: 1 }}>{track.hz}</span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{track.duration}</span>
        {showAdd && (
          <button onClick={e => { e.stopPropagation(); onAdd(track); }}
            style={{ background: inPlaylist ? "rgba(74,158,255,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${inPlaylist ? "rgba(74,158,255,0.4)" : "rgba(255,255,255,0.1)"}`, color: inPlaylist ? "#4a9eff" : "rgba(255,255,255,0.4)", borderRadius: 8, padding: "3px 9px", fontSize: 12, cursor: "pointer", transition: "all 0.2s", marginTop: 2 }}>
            {inPlaylist ? "✓" : "+"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AzaApp() {
  const [lang, setLang] = useState("en");
  const [onboarded, setOnboarded] = useState(false);
  const [nav, setNav] = useState("home");
  const [legalPage, setLegalPage] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [subscribed, setSubscribed] = useState(true);
  const [freeUsed, setFreeUsed] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState({});
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState(null);
  const [shuffled, setShuffled] = useState(null);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const ui = UI[lang];
  const isRTL = lang === "ar";
  const section = activeSection ? meditationSections[activeSection] : null;
  const sectionInfo = activeSection ? SECTIONS[activeSection] : null;
  const fontFamily = isRTL ? "'Noto Naskh Arabic', serif" : "'Fraunces', serif";
  const bodyFont = isRTL ? "'Noto Sans Arabic', sans-serif" : "'Plus Jakarta Sans', sans-serif";

  // Resolve audio URL for music track (item.audio) or meditation (item[lang].audio)
  const getAudioUrl = (item) => {
    if (!item) return null;
    if (item.audio) return `${R2_BASE}/${item.audio}`;
    const langData = item[lang];
    if (langData && langData.audio) return `${R2_BASE}/${langData.audio}`;
    return null;
  };
  const currentAudioUrl = getAudioUrl(playingTrack);

  useEffect(() => { document.documentElement.dir = isRTL ? "rtl" : "ltr"; }, [lang]);

  // Real audio playback control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentAudioUrl]);

  // Reset progress when switching tracks
  useEffect(() => { setProgress(0); }, [currentAudioUrl]);

  const handlePlay = (item) => {
    if (!subscribed && freeUsed) { setShowPaywall(true); return; }
    if (!subscribed && !freeUsed) setFreeUsed(true);
    if (playingTrack?.id === item.id) { setIsPlaying(p => !p); return; }
    setPlayingTrack(item); setIsPlaying(true); setProgress(0);
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const pl = { id: Date.now().toString(), name: newPlaylistName.trim(), tracks: [] };
    setPlaylists(p => [...p, pl]);
    setNewPlaylistName(""); setCreatingPlaylist(false); setActivePlaylist(pl.id);
  };

  const toggleTrackInPlaylist = (plId, track) => {
    setPlaylists(pls => pls.map(pl => {
      if (pl.id !== plId) return pl;
      const exists = pl.tracks.find(t => t.id === track.id);
      return { ...pl, tracks: exists ? pl.tracks.filter(t => t.id !== track.id) : [...pl.tracks, track] };
    }));
  };

  const isInAnyPlaylist = (trackId) => playlists.some(pl => pl.tracks.find(t => t.id === trackId));
  const isInPlaylist = (plId, trackId) => { const pl = playlists.find(p => p.id === plId); return pl ? !!pl.tracks.find(t => t.id === trackId) : false; };
  const currentPlaylist = playlists.find(p => p.id === activePlaylist);
  const shuffleArr = (arr) => { const a = [...arr]; for (let i = a.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };

  const filteredTracks = allTracks.filter(t => {
    const matchesSearch = !search || t[lang].title.toLowerCase().includes(search.toLowerCase()) || t[lang].subtitle.toLowerCase().includes(search.toLowerCase()) || t.hz.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterSection || t.sections.includes(filterSection);
    return matchesSearch && matchesFilter;
  });

  const primaryAccent = playingTrack ? SECTIONS[playingTrack.sections[0]].accent : "#4a9eff";
  const footerProps = { ui, bodyFont, onTerms: () => setLegalPage("terms"), onPrivacy: () => setLegalPage("privacy") };
  const GFONTS = "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500&family=Noto+Naskh+Arabic:wght@300;400;500&family=Noto+Sans+Arabic:wght@300;400&display=swap');";
  const BASE_CSS = `${GFONTS} *{box-sizing:border-box;margin:0;padding:0;} ::-webkit-scrollbar{width:0;} @keyframes wave{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)}} input::placeholder{color:rgba(255,255,255,0.2)} input:focus{outline:none;border-color:rgba(74,158,255,0.4)!important}`;

  if (!onboarded) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #050f23 0%, #0a1f3d 60%, #061628 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: bodyFont }} dir={isRTL ? "rtl" : "ltr"}>
      <style>{BASE_CSS}</style>
      <div style={{ textAlign: "center", padding: "0 32px", animation: "fadeUp 0.8s ease both", maxWidth: 400, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
          {["en","ar"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: lang===l ? "rgba(74,158,255,0.15)" : "transparent", border: `1px solid ${lang===l ? "rgba(74,158,255,0.4)" : "rgba(255,255,255,0.15)"}`, color: lang===l ? "#4a9eff" : "rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 18px", fontSize: 12, cursor: "pointer", fontFamily: l==="ar" ? "'Noto Sans Arabic'" : "'Plus Jakarta Sans'", transition: "all 0.2s" }}>
              {l === "en" ? "EN" : "عربي"}
            </button>
          ))}
        </div>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #4a9eff44, #1a3a5c22, transparent)", border: "1px solid rgba(74,158,255,0.2)", animation: "pulse 4s ease-in-out infinite", boxShadow: "0 0 60px rgba(74,158,255,0.1)", margin: "0 auto 36px" }} />
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 16, fontFamily: bodyFont }}>{ui.welcome}</div>
        <h1 style={{ fontSize: 72, fontFamily, fontWeight: 300, color: "#fff", lineHeight: 1, marginBottom: 20 }}>aza</h1>
        <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", margin: "0 auto 24px" }} />
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.8, fontWeight: 300, maxWidth: 280, margin: "0 auto 48px", fontFamily: bodyFont }}>{ui.tagline}</p>
        <button onClick={() => setOnboarded(true)} style={{ background: "linear-gradient(135deg, #4a9eff, #60c4ff)", border: "none", borderRadius: 30, padding: "14px 48px", color: "#050f23", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: bodyFont, letterSpacing: "0.08em", boxShadow: "0 8px 32px rgba(74,158,255,0.25)", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >{ui.begin}</button>
        <div style={{ marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: 1, fontFamily: bodyFont }}>{ui.trial}</div>
      </div>
    </div>
  );

  if (legalPage) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #050f23 0%, #0a1f3d 50%, #061628 100%)", color: "#fff", fontFamily: bodyFont, padding: "48px 24px" }} dir={isRTL ? "rtl" : "ltr"}>
      <style>{BASE_CSS}</style>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <button onClick={() => setLegalPage(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontFamily: bodyFont, marginBottom: 32, padding: 0 }}>{ui.back}</button>
        <h1 style={{ fontSize: 28, fontFamily, fontWeight: 300, marginBottom: 32 }}>{legalPage === "terms" ? ui.terms : ui.privacy}</h1>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.9, color: "rgba(255,255,255,0.55)", fontFamily: bodyFont }}>
          {legalPage === "terms" ? (isRTL ? LEGAL.terms_ar : LEGAL.terms_en) : (isRTL ? LEGAL.privacy_ar : LEGAL.privacy_en)}
        </pre>
        <Footer {...footerProps} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #050f23 0%, #0a1f3d 50%, #061628 100%)", color: "#fff", fontFamily: bodyFont, paddingBottom: playingTrack ? "148px" : "0" }} dir={isRTL ? "rtl" : "ltr"}>
      <style>{BASE_CSS}</style>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ paddingTop: 48, paddingBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 26, fontFamily, fontWeight: 300, letterSpacing: 4 }}>aza</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["en","ar"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ background: lang===l ? "rgba(74,158,255,0.15)" : "transparent", border: `1px solid ${lang===l ? "rgba(74,158,255,0.3)" : "rgba(255,255,255,0.1)"}`, color: lang===l ? "#4a9eff" : "rgba(255,255,255,0.3)", borderRadius: 14, padding: "4px 10px", fontSize: 10, cursor: "pointer", fontFamily: l==="ar" ? "'Noto Sans Arabic'" : "'Plus Jakarta Sans'", transition: "all 0.2s" }}>
                  {l === "en" ? "EN" : "عربي"}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPaywall(true)} style={{ background: subscribed ? "rgba(74,158,255,0.12)" : "none", border: `1px solid ${subscribed ? "rgba(74,158,255,0.3)" : "rgba(255,255,255,0.12)"}`, color: subscribed ? "#4a9eff" : "rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 14px", fontSize: 11, cursor: "pointer", fontFamily: bodyFont, transition: "all 0.2s" }}>
              {subscribed ? ui.member : ui.unlock}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 32, overflowX: "auto" }}>
          {[{id:"home",label:ui.home},{id:"meditate",label:ui.meditate},{id:"music",label:ui.music},{id:"playlists",label:ui.playlists}].map(t => (
            <button key={t.id} onClick={() => { setNav(t.id); setActiveSection(null); }}
              style={{ background: "none", border: "none", borderBottom: `2px solid ${nav===t.id ? "#4a9eff" : "transparent"}`, color: nav===t.id ? "#fff" : "rgba(255,255,255,0.3)", padding: "12px 14px", fontSize: 12, cursor: "pointer", fontFamily: bodyFont, marginBottom: -1, transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>

        {nav === "home" && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <div style={{ textAlign: "center", paddingBottom: 40 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #4a9eff44, #1a3a5c22, transparent)", border: "1px solid rgba(74,158,255,0.2)", animation: "pulse 4s ease-in-out infinite", boxShadow: "0 0 60px rgba(74,158,255,0.1)" }} />
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7, fontWeight: 300, fontFamily: bodyFont }}>{ui.tagline}</p>
            </div>
            {Object.entries(SECTIONS).map(([key, s]) => (
              <div key={key} onClick={() => { setNav("meditate"); setActiveSection(key); }}
                style={{ marginBottom: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 22, cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ color: s.accent, fontSize: 16 }}>{s.icon}</span>
                      <span style={{ fontSize: 16, fontFamily }}>{s[lang].label}</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: bodyFont }}>{s[lang].tagline}</p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>{isRTL ? "‹" : "›"}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <span style={{ background: `${s.accent}18`, color: s.accent, fontSize: 10, padding: "3px 10px", borderRadius: 20, fontFamily: bodyFont }}>1 {ui.meditation}</span>
                  <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontSize: 10, padding: "3px 10px", borderRadius: 20, fontFamily: bodyFont }}>{meditationSections[key].trackIds.length} {ui.track}</span>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
              <button onClick={() => setShowPaywall(true)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", borderRadius: 30, padding: "10px 24px", fontSize: 12, cursor: "pointer", fontFamily: bodyFont }}>{ui.unlockFull}</button>
            </div>
            <Footer {...footerProps} />
          </div>
        )}

        {nav === "meditate" && !activeSection && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h2 style={{ fontSize: 26, fontFamily, fontWeight: 300, marginBottom: 6 }}>{ui.meditate}</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24, fontFamily: bodyFont }}>{ui.chooseSection}</p>
            {Object.entries(SECTIONS).map(([key, s]) => (
              <div key={key} onClick={() => setActiveSection(key)}
                style={{ marginBottom: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 22, cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ color: s.accent, fontSize: 16 }}>{s.icon}</span>
                      <span style={{ fontSize: 16, fontFamily }}>{s[lang].label}</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: bodyFont }}>{s[lang].tagline}</p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>{isRTL ? "‹" : "›"}</span>
                </div>
              </div>
            ))}
            <Footer {...footerProps} />
          </div>
        )}

        {nav === "meditate" && activeSection && section && sectionInfo && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <button onClick={() => setActiveSection(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontFamily: bodyFont, marginBottom: 22, padding: 0 }}>{ui.back}</button>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: section.accent, textTransform: "uppercase", marginBottom: 6, fontFamily: bodyFont }}>{sectionInfo.icon} {sectionInfo[lang].label}</div>
            <h2 style={{ fontSize: 28, fontFamily, fontWeight: 300, marginBottom: 4 }}>{sectionInfo[lang].tagline}</h2>
            <div style={{ width: 30, height: 1, background: `${section.accent}66`, marginBottom: 28 }} />
            <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 12, fontFamily: bodyFont }}>{ui.guidedMed}</div>
            {[section.meditation].map(item => {
              const medData = item[lang];
              const isComingSoon = medData.comingSoon;
              return (
                <div key={item.id} onClick={() => !isComingSoon && handlePlay(item)}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px", marginBottom: 28, cursor: isComingSoon ? "default" : "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { if (!isComingSoon) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { if (!isComingSoon) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 15, fontFamily }}>{medData.title}</span>
                        <span style={{ background: `${section.accent}22`, color: section.accent, fontSize: 9, padding: "2px 8px", borderRadius: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: bodyFont }}>{isComingSoon ? ui.soon : ui.meditation}</span>
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 8, fontFamily: bodyFont }}>{item.duration}</div>
                      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.6, fontFamily: bodyFont }}>{medData.desc}</div>
                      {isComingSoon && (!notified[item.id] ? (
                        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                          <input value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder={ui.emailPlaceholder}
                            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12, fontFamily: bodyFont }} />
                          <button onClick={e => { e.stopPropagation(); if (notifyEmail) setNotified(n => ({...n, [item.id]: true})); }}
                            style={{ background: `${section.accent}22`, border: `1px solid ${section.accent}44`, color: section.accent, borderRadius: 8, padding: "8px 14px", fontSize: 11, cursor: "pointer", fontFamily: bodyFont, whiteSpace: "nowrap" }}>{ui.notifyMe}</button>
                        </div>
                      ) : <div style={{ fontSize: 12, color: section.accent, fontFamily: bodyFont, marginTop: 14 }}>{ui.notifyDone}</div>)}
                    </div>
                    {!isComingSoon && (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: playingTrack?.id === item.id ? section.accent : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: playingTrack?.id === item.id ? "#050f23" : "rgba(255,255,255,0.4)", marginLeft: 12, flexShrink: 0 }}>
                        {playingTrack?.id === item.id && isPlaying ? "⏸" : "▶"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 12, fontFamily: bodyFont }}>{ui.musicLabel}</div>
            {section.trackIds.map(tid => { const track = allTracks.find(t => t.id === tid); return <TrackRow key={tid} track={track} isPlaying={playingTrack?.id === tid && isPlaying} onPlay={handlePlay} lang={lang} />; })}
            <Footer {...footerProps} />
          </div>
        )}

        {nav === "music" && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h2 style={{ fontSize: 26, fontFamily, fontWeight: 300, marginBottom: 6 }}>{ui.allMusic}</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20, fontFamily: bodyFont }}>{ui.allTracks}</p>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{ position: "absolute", [isRTL ? "right" : "left"]: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={ui.search}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: isRTL ? "11px 36px 11px 14px" : "11px 14px 11px 36px", color: "#fff", fontSize: 13, fontFamily: bodyFont, direction: isRTL ? "rtl" : "ltr" }} />
              {search && <button onClick={() => setSearch("")} style={{ position: "absolute", [isRTL ? "left" : "right"]: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16 }}>×</button>}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              <button onClick={() => setFilterSection(null)} style={{ background: !filterSection ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${!filterSection ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`, color: !filterSection ? "#fff" : "rgba(255,255,255,0.35)", borderRadius: 20, padding: "7px 16px", fontSize: 11, cursor: "pointer", fontFamily: bodyFont }}>{isRTL ? "الكل" : "All"}</button>
              {Object.entries(SECTIONS).map(([key, s]) => (
                <button key={key} onClick={() => setFilterSection(filterSection === key ? null : key)}
                  style={{ background: filterSection===key ? `${s.accent}18` : "rgba(255,255,255,0.03)", border: `1px solid ${filterSection===key ? `${s.accent}40` : "rgba(255,255,255,0.08)"}`, color: filterSection===key ? s.accent : "rgba(255,255,255,0.35)", borderRadius: 20, padding: "7px 14px", fontSize: 11, cursor: "pointer", fontFamily: bodyFont, display: "flex", alignItems: "center", gap: 5 }}>
                  {s.icon} {s[lang].label}
                </button>
              ))}
            </div>
            {filteredTracks.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)", fontSize: 13, fontFamily: bodyFont }}>{ui.noResults}</div>}
            {filteredTracks.map(track => (
              <TrackRow key={track.id} track={track} isPlaying={playingTrack?.id === track.id && isPlaying} onPlay={handlePlay} lang={lang}
                showAdd={playlists.length > 0}
                onAdd={(t) => playlists.length === 1 ? toggleTrackInPlaylist(playlists[0].id, t) : setAddingToPlaylist(addingToPlaylist === t.id ? null : t.id)}
                inPlaylist={isInAnyPlaylist(track.id)} />
            ))}
            {playlists.length === 0 && <div style={{ textAlign: "center", padding: "20px 0 8px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 8 }}>
              <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginBottom: 10, fontFamily: bodyFont }}>{ui.saveToPlaylist}</div>
              <button onClick={() => setNav("playlists")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", borderRadius: 20, padding: "7px 18px", fontSize: 11, cursor: "pointer", fontFamily: bodyFont }}>{ui.createFirst}</button>
            </div>}
            {addingToPlaylist && (
              <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end" }} onClick={() => setAddingToPlaylist(null)}>
                <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", background: "#0a1f3d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px 20px 0 0", padding: 24 }} onClick={e => e.stopPropagation()}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontFamily: bodyFont }}>{ui.addToPlaylist}</div>
                  {playlists.map(pl => (
                    <div key={pl.id} onClick={() => { toggleTrackInPlaylist(pl.id, allTracks.find(t => t.id === addingToPlaylist)); setAddingToPlaylist(null); }}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
                      <span style={{ fontSize: 15, fontFamily }}>{pl.name}</span>
                      <span style={{ color: isInPlaylist(pl.id, addingToPlaylist) ? "#4a9eff" : "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: bodyFont }}>{isInPlaylist(pl.id, addingToPlaylist) ? ui.added : ui.add}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Footer {...footerProps} />
          </div>
        )}

        {nav === "playlists" && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            {!currentPlaylist ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h2 style={{ fontSize: 26, fontFamily, fontWeight: 300 }}>{ui.myPlaylists}</h2>
                  <button onClick={() => setCreatingPlaylist(true)} style={{ background: "rgba(74,158,255,0.1)", border: "1px solid rgba(74,158,255,0.3)", color: "#4a9eff", borderRadius: 20, padding: "6px 16px", fontSize: 11, cursor: "pointer", fontFamily: bodyFont }}>{ui.newPlaylist}</button>
                </div>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24, fontFamily: bodyFont }}>{ui.buildCollection}</p>
                {creatingPlaylist && (
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,158,255,0.2)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontFamily: bodyFont }}>{ui.playlistName}</div>
                    <input autoFocus value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} onKeyDown={e => e.key === "Enter" && createPlaylist()} placeholder={ui.playlistPlaceholder}
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: bodyFont, marginBottom: 12, direction: isRTL ? "rtl" : "ltr" }} />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={createPlaylist} style={{ flex: 1, background: "linear-gradient(135deg, #4a9eff, #60c4ff)", border: "none", borderRadius: 10, padding: 11, color: "#050f23", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: bodyFont }}>{ui.createPlaylist}</button>
                      <button onClick={() => { setCreatingPlaylist(false); setNewPlaylistName(""); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "11px 16px", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: bodyFont }}>{ui.cancel}</button>
                    </div>
                  </div>
                )}
                {playlists.length === 0 && !creatingPlaylist && (
                  <div style={{ textAlign: "center", padding: "56px 0", color: "rgba(255,255,255,0.2)" }}>
                    <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.25 }}>♪</div>
                    <div style={{ fontSize: 15, fontFamily, marginBottom: 6 }}>{ui.noPlaylists}</div>
                    <div style={{ fontSize: 12, fontFamily: bodyFont }}>{ui.noPlaylistsSub}</div>
                  </div>
                )}
                {playlists.map(pl => (
                  <div key={pl.id} onClick={() => { setActivePlaylist(pl.id); setShuffled(null); }}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px", marginBottom: 10, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 16, fontFamily, marginBottom: 4 }}>{pl.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: bodyFont }}>{pl.tracks.length} {ui.track}</div>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>{isRTL ? "‹" : "›"}</span>
                    </div>
                  </div>
                ))}
                <Footer {...footerProps} />
              </>
            ) : (
              <>
                <button onClick={() => { setActivePlaylist(null); setShuffled(null); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontFamily: bodyFont, marginBottom: 22, padding: 0 }}>{ui.backPlaylists}</button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <h2 style={{ fontSize: 26, fontFamily, fontWeight: 300 }}>{currentPlaylist.name}</h2>
                  {currentPlaylist.tracks.length > 1 && (
                    <button onClick={() => setShuffled(shuffleArr(currentPlaylist.tracks))}
                      style={{ background: shuffled ? "rgba(74,158,255,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${shuffled ? "rgba(74,158,255,0.3)" : "rgba(255,255,255,0.1)"}`, color: shuffled ? "#4a9eff" : "rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 14px", fontSize: 11, cursor: "pointer", fontFamily: bodyFont }}>{ui.shuffle}</button>
                  )}
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 24, fontFamily: bodyFont }}>{currentPlaylist.tracks.length} {ui.track}</p>
                {currentPlaylist.tracks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)" }}>
                    <div style={{ fontSize: 14, fontFamily, marginBottom: 8 }}>{ui.emptyPlaylist}</div>
                    <div style={{ fontSize: 12, marginBottom: 20, fontFamily: bodyFont }}>{ui.goToMusic}</div>
                    <button onClick={() => { setNav("music"); setActivePlaylist(null); }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", borderRadius: 20, padding: "8px 20px", fontSize: 12, cursor: "pointer", fontFamily: bodyFont }}>{ui.browseMusic}</button>
                  </div>
                ) : (shuffled || currentPlaylist.tracks).map(track => (
                  <TrackRow key={track.id} track={track} isPlaying={playingTrack?.id === track.id && isPlaying} onPlay={handlePlay} lang={lang}
                    showAdd onAdd={() => toggleTrackInPlaylist(currentPlaylist.id, track)} inPlaylist={true} />
                ))}
                <Footer {...footerProps} />
              </>
            )}
          </div>
        )}
      </div>

      {playingTrack && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,15,35,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px 22px" }}>
          {/* Real audio element — loops automatically */}
          <audio
            ref={audioRef}
            src={currentAudioUrl || undefined}
            loop={true}
            onTimeUpdate={e => { const a = e.currentTarget; if (a.duration) setProgress((a.currentTime / a.duration) * 100); }}
            onEnded={() => { /* loop handles repeat */ }}
            onError={() => setIsPlaying(false)}
          />
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ color: "#fff", fontSize: 14, fontFamily, marginBottom: 2 }}>{playingTrack[lang]?.title || playingTrack.en.title}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 4, fontFamily: bodyFont }}>{playingTrack[lang]?.subtitle || playingTrack.en.subtitle}</div>
                <SectionTags sections={playingTrack.sections} lang={lang} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }} title="Looping">🔁</span>
                <span style={{ color: primaryAccent, fontSize: 10, letterSpacing: 1 }}>{playingTrack.hz}</span>
                <button onClick={() => { setPlayingTrack(null); setIsPlaying(false); setProgress(0); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 20 }}>×</button>
              </div>
            </div>
            <div style={{ position: "relative", height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 10, cursor: "pointer" }}
              onClick={e => {
                const r = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - r.left) / r.width);
                setProgress(pct * 100);
                const a = audioRef.current;
                if (a && a.duration) a.currentTime = pct * a.duration;
              }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${primaryAccent}, #60c4ff)`, borderRadius: 2, transition: "width 0.3s" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>0:00</span>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 15 }}>{"⟨⟨"}</button>
                <button onClick={() => setIsPlaying(p => !p)} style={{ width: 46, height: 46, borderRadius: "50%", background: primaryAccent, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isPlaying ? 13 : 15, color: "#050f23", boxShadow: `0 0 20px ${primaryAccent}44`, transition: "all 0.2s" }}>
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 15 }}>{"⟩⟩"}</button>
              </div>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{playingTrack.duration}</span>
            </div>
            {isPlaying && <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}><WaveVisualizer color={primaryAccent} /></div>}
          </div>
        </div>
      )}

      {showPaywall && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,15,35,0.95)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeUp 0.3s ease both" }}>
          <div style={{ maxWidth: 360, width: "100%", textAlign: "center", position: "relative" }}>
            <button onClick={() => setShowPaywall(false)} style={{ position: "absolute", top: -16, right: 0, background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 22 }}>×</button>
            <div style={{ fontSize: 44, fontFamily, fontWeight: 300, marginBottom: 8 }}>aza</div>
            <div style={{ width: 30, height: 1, background: "rgba(255,255,255,0.2)", margin: "0 auto 20px" }} />
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontWeight: 300, fontFamily: bodyFont }}>{ui.unlimitedAccess}</p>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: isRTL ? "right" : "left" }}>
              {ui.features.map((f,i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i<3 ? "1px solid rgba(255,255,255,0.05)" : "none", flexDirection: isRTL ? "row-reverse" : "row" }}>
                  <span style={{ color: "#4a9eff", fontSize: 12, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: bodyFont }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 14px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 8, fontFamily: bodyFont }}>{ui.monthly}</div>
                <div style={{ fontSize: 38, fontFamily, fontWeight: 300, marginBottom: 4 }}>$7</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: bodyFont }}>{ui.cancelAnytime}</div>
              </div>
              <div style={{ flex: 1, background: "rgba(74,158,255,0.08)", border: "1px solid rgba(74,158,255,0.3)", borderRadius: 14, padding: "18px 14px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#4a9eff", textTransform: "uppercase", marginBottom: 4, fontFamily: bodyFont }}>{ui.yearly}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 4, fontFamily: bodyFont }}>{ui.save}</div>
                <div style={{ fontSize: 38, fontFamily, fontWeight: 300, marginBottom: 4 }}>$50</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: bodyFont }}>{ui.perMonth}</div>
              </div>
            </div>
            {!subscribed ? (
              <button onClick={() => { setSubscribed(true); setShowPaywall(false); }} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg, #4a9eff, #60c4ff)", border: "none", borderRadius: 14, color: "#050f23", fontSize: 14, fontWeight: 500, fontFamily: bodyFont, cursor: "pointer", boxShadow: "0 8px 32px rgba(74,158,255,0.3)", transition: "all 0.2s" }}>
                {ui.startTrial}
              </button>
            ) : <div style={{ padding: 16, fontFamily, fontSize: 20, color: "#4a9eff" }}>{ui.welcome2}</div>}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 12, fontFamily: bodyFont }}>{ui.noCharge}</div>
          </div>
        </div>
      )}
    </div>
  );
}
