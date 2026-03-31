// Motivationssprüche – Deutsch, Französisch, Arabisch
// Jeden Tag wird einer angezeigt bis Prüfungsende
export const QUOTES = [
  // Deutsch
  { text: 'Der Anfang ist die Hälfte des Ganzen.', lang: 'de' },
  { text: 'Es wird schwer, aber es wird sich lohnen.', lang: 'de' },
  { text: 'Jeder Experte war mal ein Anfänger.', lang: 'de' },
  { text: 'Disziplin schlägt Motivation.', lang: 'de' },
  { text: 'Kleine Schritte führen auch ans Ziel.', lang: 'de' },
  { text: 'Du bist stärker als deine Ausreden.', lang: 'de' },
  { text: 'Heute schon 10 Minuten gelernt? Fang an.', lang: 'de' },
  { text: 'Aufgeben ist keine Option. Pause machen schon.', lang: 'de' },
  { text: 'Was du heute lernst, rettet dich morgen.', lang: 'de' },
  { text: 'Der Weg zur 1.0 beginnt mit dem Aufschlagen des Buches.', lang: 'de' },
  { text: 'Fehler sind Beweise, dass du es versuchst.', lang: 'de' },
  { text: 'Nach der Prüfung ist vor dem Feiern.', lang: 'de' },
  { text: 'Wer nicht kämpft, hat schon verloren.', lang: 'de' },
  { text: 'Auch der längste Weg beginnt mit einem Schritt.', lang: 'de' },
  { text: 'Du hast es bis hierhin geschafft. Jetzt weitermachen.', lang: 'de' },
  { text: 'Lerne nicht härter, lerne klüger.', lang: 'de' },
  { text: 'Der Schmerz von Disziplin wiegt weniger als der Schmerz von Bedauern.', lang: 'de' },
  { text: 'Heute investieren, morgen ernten.', lang: 'de' },
  { text: 'Konsistenz ist der Schlüssel.', lang: 'de' },
  { text: 'Du bist eine Prüfungsmaschine. Vergiss das nicht.', lang: 'de' },
  { text: 'Glaub an dich, auch wenn es schwer fällt.', lang: 'de' },
  { text: 'Noch ein Semester, dann hast du es geschafft.', lang: 'de' },
  { text: 'Jede Stunde zählt. Jede Minute zählt.', lang: 'de' },
  { text: 'Stell dir vor, wie stolz du sein wirst.', lang: 'de' },
  { text: 'Das Ziel ist nah. Bleib dran.', lang: 'de' },

  // Français
  { text: 'Le succès commence par la volonté.', lang: 'fr' },
  { text: 'Crois en toi, même quand personne d\'autre ne le fait.', lang: 'fr' },
  { text: 'La réussite n\'est jamais un hasard.', lang: 'fr' },
  { text: 'Un jour ou jour un. C\'est toi qui décides.', lang: 'fr' },
  { text: 'Le plus dur c\'est de commencer. Le reste suivra.', lang: 'fr' },
  { text: 'Chaque page lue est un pas vers la victoire.', lang: 'fr' },
  { text: 'La discipline est le pont entre tes objectifs et tes résultats.', lang: 'fr' },
  { text: 'Tu es plus fort que tu ne le penses.', lang: 'fr' },
  { text: 'N\'abandonne pas ce que tu as commencé.', lang: 'fr' },
  { text: 'Le travail paie toujours. Toujours.', lang: 'fr' },
  { text: 'Fais aujourd\'hui ce que les autres ne veulent pas faire.', lang: 'fr' },
  { text: 'La douleur est temporaire, la fierté est éternelle.', lang: 'fr' },
  { text: 'Chaque jour est une nouvelle chance de progresser.', lang: 'fr' },
  { text: 'Tu n\'es pas fatigué, tu es en train de construire ton avenir.', lang: 'fr' },
  { text: 'Les résultats viennent avec le temps et l\'effort.', lang: 'fr' },
  { text: 'Qui veut, peut.', lang: 'fr' },
  { text: 'Le génie c\'est 1% de talent et 99% de travail.', lang: 'fr' },
  { text: 'Ne compte pas les jours, fais que les jours comptent.', lang: 'fr' },
  { text: 'Ce semestre sera ton meilleur.', lang: 'fr' },
  { text: 'Continue. Tu es sur la bonne voie.', lang: 'fr' },

  // العربية
  { text: 'من جدّ وجد، ومن زرع حصد.', lang: 'ar' },
  { text: 'لا تؤجل عمل اليوم إلى الغد.', lang: 'ar' },
  { text: 'العلم نور والجهل ظلام.', lang: 'ar' },
  { text: 'اطلبوا العلم ولو في الصين.', lang: 'ar' },
  { text: 'الصبر مفتاح الفرج.', lang: 'ar' },
  { text: 'بالعزيمة والإصرار تتحقق الأحلام.', lang: 'ar' },
  { text: 'كل يوم تتعلم فيه شيء جديد هو يوم لم يضع.', lang: 'ar' },
  { text: 'لا تستسلم، فالبداية دائماً أصعب.', lang: 'ar' },
  { text: 'النجاح ليس نهاية الطريق، بل بداية طريق جديد.', lang: 'ar' },
  { text: 'اجعل كل يوم تحدياً جديداً.', lang: 'ar' },
  { text: 'الطريق إلى النجاح يمر بالتعب.', lang: 'ar' },
  { text: 'أنت أقوى مما تظن.', lang: 'ar' },
  { text: 'لا يضيع جهد، مهما كان صغيراً.', lang: 'ar' },
  { text: 'إذا لم تستطع الطيران فاركض، وإذا لم تستطع الركض فامش.', lang: 'ar' },
  { text: 'قليل دائم خير من كثير منقطع.', lang: 'ar' },
  { text: 'العلم في الصغر كالنقش على الحجر.', lang: 'ar' },
  { text: 'مَن سار على الدرب وصل.', lang: 'ar' },
  { text: 'لا تنظر إلى الوراء، أنت لن تذهب في ذلك الاتجاه.', lang: 'ar' },
  { text: 'ثق بنفسك، النجاح قريب.', lang: 'ar' },
  { text: 'كل إنجاز عظيم بدأ بقرار.', lang: 'ar' },
];

// Deterministic daily pick based on date
export function getQuoteOfDay() {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return QUOTES[dayOfYear % QUOTES.length];
}
