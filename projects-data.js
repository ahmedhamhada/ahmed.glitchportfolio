/**
 * ========================================================
 * بيانات معرض الأعمال — Ahmed Hamada | Video Editor
 * محتوى حقيقي متصل بالفيديوهات الموجودة في المشروع
 * ========================================================
 */

const PROJECTS_DATA = [
  {
    id: 1,
    title: "ريلز براند شخصي",
    category: "personal-brand",
    categoryName: "براند شخصي",
    description: "بناء حضور قوي وتوصيل الفكرة باحترافية وسلاسة مع هوك بصري سريع.",
    role: "مونتاج كامل وتلوين",
    videoUrl: "assets/reel-1.mp4",
    duration: "0:42",
    badge: "9:16 Reel",
    aspectRatio: "9/16"
  },
  {
    id: 2,
    title: "ريلز براند عقاري وبودكاست",
    category: "podcast",
    categoryName: "بودكاست وعقارات",
    description: "اقتطاع اللحظة الأهم من الحوار لشد انتباه المتابع وزيادة التفاعل.",
    role: "مونتاج واختيار اللقطات وسرد قصصي",
    videoUrl: "assets/reel-2.mp4",
    duration: "0:58",
    badge: "9:16 Shorts",
    aspectRatio: "9/16"
  },
  {
    id: 3,
    title: "ريلز سريع وتفاعلي للمنصات",
    category: "social-media",
    categoryName: "ريلز تفاعلي",
    description: "إيقاع سريع وتأثيرات بصرية تشد انتباه الجمهور من أول 3 ثوانٍ.",
    role: "مونتاج وسرعة إيقاع وحركات نصوص",
    videoUrl: "assets/reel-4.mp4",
    duration: "0:35",
    badge: "9:16 Reel",
    aspectRatio: "9/16"
  },
  {
    id: 4,
    title: "محتوى إبداعي وبصري حديث",
    category: "creative",
    categoryName: "محتوى إبداعي",
    description: "إبراز التفاصيل والرسالة بطريقة عصرية وواضحة تناسب البراندات العصرية.",
    role: "مونتاج وتنسيق المحتوى والمؤثرات الصوتية",
    videoUrl: "assets/reel-5.mp4",
    duration: "0:38",
    badge: "9:16 Reel",
    aspectRatio: "9/16"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PROJECTS_DATA;
}
