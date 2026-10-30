# Kurs Xaritasida 3D Qulflar va Ochilish Animatsiyasi Rejasi

## 1. Umumiy Maqsad
Kurs ichidagi 3D asfalt yo‘li (`CourseLevelsScreen`) bo‘ylab joylashgan hali o‘tilmagan (`LOCKED`) dars tugmalariga **3D oltin-kumush osma qulf va zanjir halqasi** dizaynini o‘rnatish, qulflangan dars bosilganda **qulf qimirlab ovoz va vibratsiya effekti** berish hamda dars tugallangach keyingi darsga o‘tishda **qulfning silkinib ochilishi, oltin zarralar sochilishi va asfalt yo‘lning yorishishi** animatsiyasini yaratish.

---

## 2. Asosiy O‘zgarishlar va Dizayn Yechimlari

### A. 3D Oltin-Kumush Osma Qulf va Zanjir Halqasi (`LockedNode3DPadlock`)
- **Zanjir halqasi**: Har bir yopiq (`LOCKED`) 3D dars tugmasi atrofida metall kumush-po‘lat zanjir halqasi (`SVG` 3D gradient va soya bilan) tugmani o‘rab turadi.
- **3D Oltin-Kumush Osma Qulf**: Tugma markazida va pastki qismida hajmli 3D osma qulf (kumush po‘lat ilmoq `shackle` + oltin korpus, yaltiroq nur chizig‘i va kalit teshigi bilan) joylashadi.
- **Asfalt Yo‘l Holati**:
  - O‘tilgan va joriy darsgacha bo‘lgan asfalt yo‘l yorqin sariq yo‘l chiziqlari va yashil/oltin nur bilan yoritilgan bo‘ladi.
  - Hali ochilmagan (`LOCKED`) darslar orasidagi asfalt yo‘l qismi esa qorong‘iroq tumanli asfalt va xira chiziqlar bilan farqlanib turadi.

### B. Yopiq Dars Bosilganda Interaktiv Effekt (Shake + Sound + Haptic)
- Foydalanuvchi hali ochilmagan (`LOCKED`) darsni bosganda pastki oyna (bottom sheet) ochilmaydi.
- Buning o‘rniga:
  1. **Tebranish animatsiyasi**: 3D qulf va zanjir halqasi chap-o‘ngga keskin silkinib (`lock-shake` keyframe animatsiyasi), qizg‘ish-oltin uchqun chiqaradi.
  2. **Ovoz effekti (Web Audio API)**: Sintez qilingan metall qulf va zanjir jarangi ovozi (`playLockRattleSound`) eshitiladi.
  3. **Vibratsiya (Haptics)**: Mobil qurilmalarda `navigator.vibrate([40, 50, 60])` orqali sezilarli taktil tebranish beriladi.

### C. Keyingi Darsga O‘tish va Qulf Ochilish Marosimi (Unlock Ceremony)
- Foydalanuvchi joriy darsni (`CURRENT`) tugatganda (mashq/test yakunlanganda yoki xaritadagi mukofot sandig‘i / dars tugallanganda):
  1. Xarita avtomatik ravishda yangi ochilayotgan keyingi dars tugmasiga silliq siljiydi (`scrollIntoView`).
  2. **Asfalt yo‘l yorishishi**: Oldingi darsdan keyingi darsga olib boruvchi asfalt yo‘l bo‘ylab oltin-yashil nur to‘lqini yuqoriga qarab oqib o‘tadi va yo‘l chiziqlari yorqin sariq rangga kiradi.
  3. **Qulf silkinib ochilishi**: Keyingi dars ustidagi 3D osma qulf kuchli silkinadi, zanjir halqalari uzilib atrofga sochiladi, qulfning kumush ilmog‘i (`shackle`) yuqoriga "pop" etib ochiladi va tantanali ochilish ovozi (`playUnlockFanfareSound`) yangraydi.
  4. **Zarralar va yog‘du**: Tugma atrofida oltin-yashil zarralar (sparkles + confetti) portlab sochiladi va tugma yopiq holatdan faol (`CURRENT` — `"BOSHLASH!"`) 3D yashil tugmasiga aylanadi.
  5. Shuningdek, foydalanuvchi darsni tugatib xaritaga qaytganda yoki dars oynasidan keyingi bosqichga o‘tganda ushbu animatsiya avtomatik ishga tushadi.

---

## 3. O‘zgartiriladigan Fayllar
1. **`/src/context/AppContext.tsx`**:
   - `recentlyUnlockedLevelId` holati va `clearRecentlyUnlockedLevel` funksiyasini qo‘shish — dars tugallanganda qaysi keyingi dars qulfi ochilishi kerakligini aniqlash va animatsiyani ishga tushirish uchun.
2. **`/src/screens/QuizScreen.tsx`** va **`/src/screens/LevelUnlockedScreen.tsx`**:
   - Dars yakunlanganda faqat statik `'lvl_4'` emas, balki tanlangan joriy `selectedLevelId` ni tugallanganlar ro‘yxatiga qo‘shish va xaritaga qaytganda keyingi darsning qulf ochilish animatsiyasini faollashtirish.
3. **`/src/screens/CourseLevelsScreen.tsx`**:
   - `LockedNode3DPadlock` (3D oltin-kumush osma qulf va zanjir halqasi) hamda `UnlockingCeremonyOverlay` (qulf silkinib ochilishi va zarralar sochilishi) komponentlarini qo‘shish.
   - Web Audio API orqali metall qulf qimirlashi (`playLockRattleSound`) va qulf ochilishi (`playUnlockSound`) ovoz синтезаторlarini qo‘shish.
   - Asfalt yo‘lni ochiq (yorug‘) va qulflangan (qorong‘iroq) qismlarga ajratish hamda o‘tish paytida yo‘lning yorishish animatsiyasini qo‘shish.
