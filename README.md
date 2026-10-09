# EduSolution Academy — Frontend

Tələbələrin xaricdə təhsil, viza və universitet axtarışının yardımçı platforması.

React SPA. Bütün məzmun Spring Boot backend-dən gəlir; admin paneli həmin
məlumatı yazır.

**Backend:** `https://edusolution-backend-obby.onrender.com/api/v1`
**Swagger:** `https://edusolution-backend-obby.onrender.com/swagger-ui/index.html`

---

## Texnologiya yığını

| Paket | Rol |
| --- | --- |
| React 19 | UI qatı |
| Vite 8 | Dev server və production build |
| Tailwind CSS 4 | Stil |
| React Router 7 | Routing |
| Oxlint | Linting |

## Qurulma

```bash
npm install
cp .env.example .env      # istəyə bağlı, dev-da Vite proxy işləyir
npm run dev               # development server
npm run build             # production build -> dist/
npm run preview           # build nəticəsini yoxla
npm run lint              # oxlint
```

**Node 20+** tələb olunur.

### Mühit dəyişənləri

| Dəyişən | Standart | İzah |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://edusolution-backend-obby.onrender.com/api/v1` | Production-da birbaşa URL |
| `VITE_API_TIMEOUT_MS` | `45000` | Sorğu timeout-u |
| `VITE_USE_MOCK` | `false` | `true` isə cavablar mock kimi işarələnir |

Dev-da `API_BASE_URL` `/api/v1`-dir və Vite proxy-si onu yönləndirir, çünki
backend CORS başlığı göndərmir. Production-da birbaşa URL gedir və **backend
tərəfdə CORS qurulmalıdır** (bax: "Problemlər").

---

## Səhifələr

| Route | Təyinat |
| --- | --- |
| `/` | Ana səhifə |
| `/country/:slug` | Ölkə səhifəsi (universitetlər, xərclər) |
| `/country/:slug/university/:id` | Universitet səhifəsi |
| `/faq` | FAQ |
| `/login`, `/register` | İstifadəçi girişi / 3 addımlı qeydiyyat |
| `/comment/:token` | Rəy yazma (tək istifadəlik link) |
| `/spin` | Fırlatma çarxı |
| `/reklam/:id` | Reklam səhifəsi |
| `/admin/login` | Admin girişi |
| `/admin/*` | Admin paneli (admin token tələb edir) |

## Admin paneli

| Menu | Endpointlər |
| --- | --- |
| Countries | `/country/*` |
| Universities | `/university/*` |
| Faculties | `/faculty/*` |
| FAQ | **localStorage** — backend endpointi yoxdur |
| Ad Board | `/ad/*` |
| Spin Prizes | `/spin/*` (nağıllar + qaliblar) |
| Web Config | `/property/all`, `/property/add` |
| Comment URLs | `/applicant/*` |
| Admins | `/admin/add` |

Redaktə zamanı **ad sahələri kilidlənir** (`PATCH` endpoint-ləri qeydi adla
tanıyır, ona görə dəyişdirilsə sessizcə səhv qeydə yazılırdı):

- Ölkə → `Ölkə adı`
- Universitet → `Universitet adı` və `Ölkə adı`

Yeni qeyd əlavə edəndə hər ikisi açıqdır.

---

## Struktur

```
src/
  components/
    home/            Ana səhifə bölmələri
    admin/           Admin panel komponentləri
    Header.jsx       Yuxarı menyu
    Footer.jsx       Altlıq + sabit WhatsApp düyməsi
    WhatsAppButton.jsx
  config/
    api.js           API bazası, token açarları
    contact.js       WhatsApp nömrəsi
  pages/             Route səhifələri
  services/
    httpClient.js    fetch wrapper, token, timeout, xəta mesajları
    contentApi.js    ölkə / universitet / faculty / applicant / contact
    authApi.js       qeydiyyat, giriş
    spinApi.js       çarx, nağıllar, qaliblar
    adApi.js         reklamlar
    propertyApi.js   sayt rəqəmləri
    contentHooks.js  useApiResource və hazır hook-lar
    mappers.js       API DTO -> UI model
    session.js       token və sessiya
  store/adminStore.js  FAQ üçün localStorage store (və köhnə fallback)
  utils/             format, id, şəkil emalı
```

---

## Hazır olanlar ✅

- **Swagger'dakı 47 endpoint-in hamısı** API qatına bağlıdır.
- Ölkə / universitet / fakültə **tam CRUD** (əlavə, redaktə, sil).
- İstifadəçi qeydiyyatı (3 addım: e-poçt → kod → şifrə) və giriş.
- Admin girişi və yeni admin yaratma.
- **Çarx** — nağıllar `GET /spin/prizes`-dən gəlir, qazanmaq
  `POST /spin/play` ilə **server** tərəfdə həll olunur, çarx həmin
  segmentdə dayanır. Mükafatı e-poçta göndərmək (`POST /spin/send`).
- **Qaliblar cədvəli** — admin / Spin bölümündə email, mükafat və `prize_id`
  UUID-si (kopyalama düyməsi ilə).
- **Reklam lövhəsi** — `GET /ad/all`, `POST /ad/add`, `PATCH /ad/update`,
  `DELETE /ad/delete/{title}`, təfərrüat səhifəsi `GET /ad/info/{title}`.
- **Web Config** — 5 sayğac (`students_helped`, `admissions_sent`,
  `successful_admission`, `visa_help`, `successful_visa_help`) ana səhifədə
  göstərilir. `visa_success_rate` backend tərəfdə hesablanır və **yalnız
  oxunur**.
- **WhatsApp** `+48 572 497 098` — bütün ictimai səhifələrdə sabit düymə,
  footer və Contact bölməsində. Nömrəni dəyişmək üçün yalnız
  `src/config/contact.js`.
- Ana səhifənin yuxarı sağında **Login / Register yoxdur** (giriş etmiş
  istifadəçi üçün Logout qalır).
- Bütün şəkil yükləmələri arxa planda kiçildilir (bayraq 96px, loqo 320px,
  hero 1400px); PNG/WebP şəffaflığı qorunur.
- `npm run lint` → 0 xəta, `npm run build` → uğurlu.

### Köhnə lokal məlumatın köçürülməsi

Panel əvvəllər reklam və nağılları **yalnız localStorage**-a yazırdı. Yeni
admin həm backend-dən, həm lokal oxuyur. Fərq görünən hər yerə sarı
**"lokal"** etiketi düşür və yuxarıda **"Backend-ə göndər"** düyməsi çıxır.

> **Bu düyməni bir dəfə basın.** Reklamları və nağılları serverə yazmadan
> spin işləmir və reklamlar yalnız o brauzerdə görünür.

---

## Problemlər ⚠️

### Backend tərəfdə (frontend-də düzəldilə bilməz)

1. **`POST /spin/play` → 400 `SPIN_PLAY_ERROR`**
   `Prize weights are invalid, Weight cannot be less than 0`
   `GET /spin/prizes` boş qaytarır, backend bütün çəkilərin cəmini hesablayıb
   0 gördüyü halda bu xətanı atır. **Mesaj yanıltıcıdır** — neqativ çəki yoxdur,
   sadəcə nağıl yoxdur.
   *Həll:* Nağıl əlavə edin (çəki > 0). Müştəri idarə panelindən verilir,
   frontend yalnız ad göndərir (`prize_weight` opsiyoneldir, default 10).

2. **`POST /spin/check` → 500 `UNEXPECTED_ERROR`**
   Ehtimal ki 1-ci problemlə eyni kökdən. Frontend bunu yutqun içində tutur,
   oyun limiti yoxlanılmır, düymə açıq qalır.

3. **`GET /property/all` → 400 `WEB_PROPERTY_NOT_FOUND`**
   Sətir yaradılmayıb. **Web Config**-də bir dəfə "Yadda saxla" basın —
   ana səhifədəki rəqəmlər o vaxtdan əsl məlumat olacaq.

4. **`GET /ad/all`** — ictimai endpoint
   Ana səhifə bu endpoint-i auth olmadan çağırır (Authorization başlığı yoxdur).
   Uğursuz olarsa localStorage-dakı ehtiyat siyahıya düşür. Admin panel isə
   öz tokeni ilə çağırır.

5. **`GET /spin/winners` → 401**
   Rol fərq etmir, `authenticated()`-dır. Frontend əvvəlcə admin, sonra
   istifadəçi tokeni ilə cəhd edir.

6. **`GET /country/country_detail/{name}` → 401 və Swagger-da YOXDUR**
   Endpoint real işləyir, amma sənəddə yazılmayıb. Auth tələb edir.
   İstifadəçi tokeni göndərilir.

7. **Yazma endpoint-ləri çox zaman `200` + boş body qaytarır**
   Cavab yoxdur, ona görə hər əməliyyatdan sonra siyahı **yenidən yüklənir** və
   nəticə siyahı ilə yoxlanılır. Backend boş body qaytarmasın.

8. **`POST /ad/add` və `PATCH /ad/update` sənədi qarışıqdır**
   Swagger DTO-nu **query parametri** kimi göstərir, amma `image`
   `format: binary` (fayl). Spring `@ModelAttribute` hər ikisindən doldurur,
   ona görə frontend **həm query, həm multipart** göndərir. Düzgün qurulma
   lazımdır.

9. **`PATCH /spin/update` gövdesi massivdir** (`[{...}]`), tək obje deyil.
   Yeni endpoint yazanlar bunu gözə almalıdır.

10. **`visa_success_rate` yazıla bilmir**
    `AddWebPropertiesRequestDTO`-da bu sahə yoxdur; yalnız cavab DTO-sunda var.
    Server hesablayır.

11. **CORS başlığı göndərilmir**
    Production-da `VITE_API_BASE_URL` birbaşa istifadə olunur, ona görə
    deployment origin-i backend-də `allow` edilməlidir.

### Frontend tərəfdə

1. **FAQ hələ localStorage-dadır** — Swagger-da FAQ endpointi yoxdur. Yeni
   ekip üçün problem yaradır (data hər brauzerə xas). Backend CRUD lazımdır.
2. **`store/adminStore.js` hələ də mövcuddur** — reklam və nağıl üçün
   fallback, FAQ üçün isə yeganə mənbədir.
3. **Çarx oyun limiti işləmir** (1-ci backend problemi səbəbindən).
4. **Sayt rəqəmləri statik fallback** göstərir, 3-cü problem qalana qədər.
5. `npm run lint` 16 xəbərdarlıq verir — hamısı `set-state-in-effect`
   (data yükləmə) patternıdır, xəta yoxdur.
