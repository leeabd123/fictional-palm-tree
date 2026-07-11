# Phonetics audit — ذ / ث / ظ sound shifts (Section 20)

Audit of all vocabulary/phonetic data for the three documented Sudanese sound
shifts beyond the systematically-applied ق → g. **92 entries** contain at least
one of the three letters. Per the curriculum doc: no blanket substitution —
each flagged word needs native-speaker confirmation.

## ظ (Dhaa') — ✅ consistent, no action needed
Every occurrence already uses the shifted "z":
`3azeem, fazee3, ta3zeem, nazar/nazri, al-zuroof, mu3zzam, 3aziima, nazrtak`

## ذ (dhaal) — mostly shifted, 2 words flagged
Already shifted (✓): `bil-zat, khuz, zat, lazeeza, haza, biyaakhuz, zahaaymir`

**Flagged for native verification (currently MSA-style "th"):**
| Word | Current | Likely Sudanese | Where |
|---|---|---|---|
| متذكر | mithakkir (×4) | mitzakkir / middakkir? | conversations.js |
| بتذكّر | bittithakkir | bitzakkir? | conversations.js |
| تاخذ | mixed: biyaakhuz ✓ / bita-khud | pick one per word | conversations.js |

## ث (thaal) — the messy one: both forms coexist
Already shifted (✓): `tani/tanya (ثاني), kateer/kitir (كثير, some places), aktar
(أكثر, some places), yumassalunna (يمثلوننا), kattar khayrkum (كثر — curriculum.js),
masalan (مثلاً)`

**Internal inconsistencies — same word, both spellings (fix after verification):**
| Word | MSA-style occurrences | Shifted occurrences |
|---|---|---|
| كثير/كثيرة | kathiira, kathiir, katira | kiteer, kateer |
| أكثر | akthar (×6) | aktar (×3) |
| نمثّل / بأمثّل | numaththil, bammaththil | numassil, yumassalunna |
| كثر خيرك | kathar khayrak (vocabulary.js) | kattar khayrkum (curriculum.js ✓ native-corrected) |

**Consistently MSA-style — confirm whether these shift in Sudanese speech:**
`thaqaaftna (ثقافتنا), ath-thiqa (الثقة), thiqa, waathiq (واثق), aththar (أثّر),
thabit (ثابت), ath-thabaat (الثبات), muthiira (مثيرة), tuthbit (تثبت),
al-itnayn (الاثنين ✓ already t), haytho (حيث), athna (أثناء)`

## Recommended process
1. Hand this list to the native reviewer who corrected the scenario content.
2. For each word, record the confirmed Sudanese form once, then apply it
   everywhere that word appears (the inconsistent pairs above are the priority —
   they're wrong in at least one place by definition).
3. كثر خيرك: the native-corrected curriculum content already says **kattar** —
   the vocabulary.js "kathar" entry is the likeliest confirmed fix here.
