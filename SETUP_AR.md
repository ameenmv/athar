# 🔮 دليل تثبيت أثر — خطوة بخطوة

> **أثر** هي أداة ذكاء اصطناعي بتحفظلك الدروس اللي اتعلمتها من أخطائك البرمجية وبتفكرك بيها باستخدام نظام التكرار المتباعد (Spaced Repetition).

---

## 📋 المتطلبات

قبل ما تبدأ، تأكد إن عندك الحاجات دي:

| المتطلب | الحد الأدنى | طريقة التحقق |
|---------|------------|--------------|
| **Node.js** | الإصدار 20 أو أحدث | `node --version` |
| **npm** | الإصدار 10 أو أحدث | `npm --version` |
| **Antigravity IDE** | آخر إصدار | افتح التطبيق وتأكد إنه شغال |

> [!IMPORTANT]
> لازم يكون عندك **Node.js 20+** لأن الأداة بتستخدم `node:sqlite` اللي موجود بس في الإصدارات الجديدة.

---

## 🚀 الخطوات

### الخطوة 1: ثبّت أثر بأمر واحد

افتح التيرمنال واكتب:

```bash
npm install -g athar
```

خلاص! ✅ الأداة اتثبتت وجاهزة.

> [!TIP]
> لو طلعلك مشكلة صلاحيات، جرّب: `sudo npm install -g athar`

---

### الخطوة 2: ضبط Antigravity IDE تلقائياً

اكتب الأمر ده وهو هيعمل كل الإعدادات لوحده:

```bash
athar setup
```

هيطلعلك:

```
🔮 Athar Setup — Antigravity IDE Integration

  Config path: ~/.gemini/config/mcp_config.json
  Server path: /usr/lib/node_modules/athar/dist/index.js

✅ Athar MCP server configured successfully!

Next steps:
  1. Refresh MCP servers in Antigravity IDE
  2. Start coding — the AI will save lessons automatically
  3. Run `athar status` to check your progress
```

> [!NOTE]
> الأمر ده بيعدّل ملف `~/.gemini/config/mcp_config.json` تلقائياً. لو عاوز تعدّله يدوي، شوف قسم "الإعداد اليدوي" تحت.

---

### الخطوة 3: فعّل أثر في Antigravity IDE

**1.** افتح **Antigravity IDE**

**2.** روح على إعدادات MCP:
   - دوس على **"..."** (القائمة) في الشات
   - اختار **"Manage MCP Servers"**
   - أو من الإعدادات ابحث عن **MCP**

**3.** دوس **Refresh** عشان يقرا الإعدادات الجديدة

**4.** المفروض تلاقي **athar** ظاهر ومعاه أداتين:
   - 🟢 `save_lesson` — لحفظ الدروس
   - 🟢 `memory` — للبحث في الدروس القديمة

> [!TIP]
> لو مش ظاهر، جرّب تقفل Antigravity IDE **وتفتحه تاني**.

---

### الخطوة 4: اختبر إن كل حاجة شغالة ✅

افتح شات جديد في Antigravity IDE واكتب:

```
ابحث في الذاكرة عن أخطاء React
```

أو بالإنجليزي:

```
Search my memory for common mistakes
```

لو الأداة شغالة صح، المساعد الذكي هيستخدم أداة `memory` وهتشوف رسالة بالنتايج.

**مبروك! 🎉 أثر شغالة وجاهزة!**

---

## ⚙️ الإعداد اليدوي (لو `athar setup` مشتغلش)

**1.** اعرف مسار أثر:

```bash
which athar-mcp
```

**2.** افتح ملف الإعدادات:

```bash
nano ~/.gemini/config/mcp_config.json
```

**3.** ضيف `athar` جوه `mcpServers`:

```json
{
  "mcpServers": {
    "athar": {
      "command": "node",
      "args": [
        "--experimental-sqlite",
        "/المسار/اللي/طلع/من/which/athar-mcp"
      ]
    }
  }
}
```

> [!WARNING]
> **مهم:** غيّر المسار بالمسار الحقيقي اللي طلعلك من أمر `which`.

**4.** احفظ واقفل الملف، وأعد تشغيل Antigravity IDE.

---

## 🎮 أوامر CLI

بعد ما تثبّت أثر وتستخدمها فترة، ممكن تستخدم الأوامر دي:

### شوف إحصائياتك

```bash
athar status
```

```
📊 Athar Memory Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Lessons:    5
  Due Today:        2 ⚠️
  Due This Week:    3
  By Status:
    🆕  New:         2
    📖  Learning:    1
    ✅  Learned:     1
    🏆  Mastered:    1
```

### استعرض كل الدروس

```bash
athar list
```

### فلتر حسب اللغة أو التاج

```bash
athar list --language typescript
athar list --tag react
athar list --search "useEffect"
```

### ابدأ جلسة مراجعة

```bash
athar review
```

الأمر ده بيعرضلك الدروس المستحقة للمراجعة واحد واحد:
1. بيسألك سؤال
2. تدوس Enter عشان تشوف الإجابة
3. تقيّم نفسك من 0 لـ 5
4. النظام بيحسب إمتى يفكّرك تاني

---

## 🧠 إزاي بتشتغل؟

```
أنت بتكود في Antigravity IDE
        ↓
المساعد الذكي بيساعدك تحل باج حقيقي
        ↓
الباج مش تافه؟ (مش فورماتنج أو تايبو)
        ↓  أيوه
المساعد تلقائياً بيحفظ الدرس ← save_lesson
        ↓
الدرس بيتحفظ في SQLite على جهازك
        ↓
بعد يوم / 6 أيام / شهر ← النظام بيفكّرك
        ↓
بتراجع وبتقيّم نفسك
        ↓
مع الوقت ← ما بتكررش نفس الأخطاء 🎉
```

---

## ❓ أسئلة شائعة

### فين بتتحفظ البيانات؟

كل البيانات محلية 100% على جهازك:

| النظام | المسار |
|--------|--------|
| Linux | `~/.local/share/athar/lessons.db` |
| macOS | `~/Library/Application Support/athar/lessons.db` |
| Windows | `%APPDATA%/athar/lessons.db` |

**مفيش أي بيانات بتتبعت لأي سيرفر خارجي.**

### الأداة بتكلف حاجة؟

لأ. أثر **مجانية ومفتوحة المصدر** بالكامل. ومفيهاش أي API خارجي مدفوع.

### بتدعم عربي؟

أيوه! المساعد الذكي بيحفظ الدروس بنفس اللغة اللي بتكلمه بيها.

### لو عاوز أمسح كل الدروس وأبدأ من الأول؟

```bash
rm ~/.local/share/athar/lessons.db
```

### لو عاوز أحدّث لآخر إصدار؟

```bash
npm update -g athar
```

### لو الأداة مش ظاهرة في Antigravity؟

1. تأكد من `athar --version` — لو شغال يبقى مثبت صح
2. شغّل `athar setup` تاني
3. أعد تشغيل Antigravity IDE
4. لو لسه مش شغال، اختبر السيرفر يدوي:
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | timeout 5 athar-mcp 2>/dev/null
   ```
   لو طلعلك JSON فيه `"name":"athar"` يبقى شغال صح ✅

---

## 📝 ملخص سريع

| الخطوة | الأمر |
|--------|-------|
| 1. ثبّت | `npm install -g athar` |
| 2. ضبط IDE | `athar setup` |
| 3. أعد تشغيل | اقفل Antigravity وافتحه |
| 4. ابدأ اشتغل! | كود عادي والأداة هتحفظ الدروس تلقائياً |

**4 خطوات بس. مفيش clone، مفيش build، مفيش تعقيد.** 🔮

---

<div align="center">

**🔮 أثر — كل خطأ بيسيب أثر، وكل درس بيسيب تأثير**

[GitHub](https://github.com/ameenmv/athar) · [npm](https://www.npmjs.com/package/athar)

</div>
