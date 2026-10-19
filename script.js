/* ===== Modul Tema ===== */
const Theme = (() => {
  const root = document.documentElement, btn = document.getElementById('themeBtn');
  const set = d => { root.classList.toggle('dark', d); btn.textContent = d ? '☀️ Mode' : '🌙 Mode'; };
  set(window.matchMedia('(prefers-color-scheme: dark)').matches);
  btn.addEventListener('click', () => set(!root.classList.contains('dark')));
})();

/* ===== Modul Halaman (tab) ===== */
const Pages = (() => {
  const pages = [['hero','🏠 Beranda'],['simulator','🧪 Simulator'],['perspektif','🔎 Perspektif'],['mitigasi','🛡️ Mitigasi'],['galeri','📷 Galeri']];
  const bar = document.getElementById('pageTabs');
  const go = id => {
    pages.forEach(p => document.getElementById(p[0]).classList.toggle('active', p[0] === id));
    [...bar.children].forEach(b => {
      const on = b.dataset.page === id; b.setAttribute('aria-selected', on);
      b.className = 'shrink-0 px-4 py-2 text-sm font-semibold rounded-full ' + (on ? 'bg-amber-400 text-emerald-950' : 'text-emerald-100 hover:bg-emerald-700');
    });
    window.scrollTo({ top: 0 });
  };
  pages.forEach(p => { const b = document.createElement('button'); b.dataset.page = p[0]; b.setAttribute('role','tab'); b.textContent = p[1]; b.onclick = () => go(p[0]); bar.appendChild(b); });
  document.querySelectorAll('[data-goto]').forEach(el => el.addEventListener('click', () => go(el.dataset.goto)));
  go('hero');
})();

/* ===== Modul Simulator ===== */
const Simulator = (() => {
  const $ = id => document.getElementById(id);
  const ids = ['inMoist','inTemp','inFlow','inMulch'];
  const STATUS = {
    aman:    { label:'✅ AMAN',    mean:'Tanah cukup air.', badge:'bg-emerald-100 text-emerald-800', bar:'bg-emerald-500', tile:'#10b981',
               reco:'Siram seperti biasa di pagi hari.',
               spirit:'Syukuri air, tetap hemat, dan berdoa.' },
    waspada: { label:'⚠️ WASPADA', mean:'Tanah mulai kering.', badge:'bg-amber-100 text-amber-800',    bar:'bg-amber-500',   tile:'#d97706',
               reco:'Siram 2× sehari (pagi & sore) dan pasang mulsa.',
               spirit:'Tambah ikhtiar, lalu bertawakal. Jangan boros air.' },
    kritis:  { label:'🚨 KRITIS',  mean:'Tanah sangat kering. Tanaman bisa layu.', badge:'bg-red-100 text-red-800',        bar:'bg-red-500',     tile:'#a16207',
               reco:'Siram tepat di akar, pakai air embung, dan kabari kelompok tani.',
               spirit:'Perbanyak doa dan saling menolong sesama petani.' }
  };

  const hitungRisiko = (k, s, d, mulsa) => {
    let r = (100 - k) * 0.5 + Math.max(0, s - 28) * 3 + (1 - d / 20) * 30;
    if (mulsa) r *= 0.85;
    return Math.max(0, Math.min(100, Math.round(r)));
  };
  const statusDari = r => r < 30 ? 'aman' : r < 60 ? 'waspada' : 'kritis';

  // Saran praktis untuk petani: [ikon, judul, isi]
  const langkah = (k, s, d, m, key) => {
    const liter = Math.round(Math.max(0, 60 - k) * 0.2 * (s > 32 ? 1.2 : 1) * (m ? 0.8 : 1));
    const air = key === 'aman' || liter < 1
      ? ['💧', 'Siram', 'Belum perlu siram hari ini.']
      : ['💧', 'Siram', `Sekitar ${liter} liter per m².` + (key === 'kritis' ? ' Bagi jadi 2 kali siram.' : '')];
    const waktu = key === 'aman' ? ['🕔', 'Waktu', 'Cek lagi besok pagi.']
      : key === 'waspada' ? ['🕔', 'Waktu', 'Pagi 05.30–08.00.']
      : ['🕔', 'Waktu', 'Pagi 05.30–08.00 dan sore 16.00–17.30.'];
    const tambah = d < 3 ? ['🏞️', 'Air sumber', 'Debit kecil. Atur giliran air dan pakai air embung.']
      : (!m && key !== 'aman') ? ['🍂', 'Mulsa', 'Tutup tanah dengan jerami setebal ±5 cm.']
      : key === 'kritis' ? ['🌱', 'Prioritas', 'Utamakan tanaman muda dan bernilai tinggi.']
      : ['✅', 'Lanjutkan', 'Pertahankan cara bertani Anda.'];
    return [air, waktu, tambah];
  };

  const render = () => {
    const k = +$('inMoist').value, s = +$('inTemp').value, d = +$('inFlow').value, m = $('inMulch').checked;
    $('vMoist').textContent = k + '%'; $('vTemp').textContent = s + '°C'; $('vFlow').textContent = d + ' L/dtk';
    const r = hitungRisiko(k, s, d, m), key = statusDari(r), st = STATUS[key];
    $('badge').className = 'mt-2 rounded-2xl px-4 py-4 text-center ' + st.badge; $('bLabel').textContent = st.label; $('bMean').textContent = st.mean;
    $('steps').innerHTML = langkah(k, s, d, m, key).map(x => `<li class="flex gap-3 items-start rounded-xl bg-emerald-50 dark:bg-emerald-900/40 p-3"><span class="text-2xl leading-none">${x[0]}</span><div><p class="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">${x[1]}</p><p class="text-base font-medium">${x[2]}</p></div></li>`).join('');
    $('spirit').textContent = st.spirit;
  };
  ids.forEach(id => $(id).addEventListener('input', render));
  render();
})();

/* ===== Modul Tab Perspektif ===== */
const Perspektif = (() => {
  const data = [
    { icon:'☪️', title:'Sudut Pandang Islam', sub:'Maqashid Syariah', points:[
      ['Hifz al-Nafs (menjaga jiwa)','Kekeringan yang berulang mengancam ketahanan pangan dan kesehatan keluarga petani. Mitigasi dini adalah bentuk ikhtiar menjaga jiwa.'],
      ['Hifz al-Mal (menjaga harta)','Air dan sumber daya adalah amanah. Irigasi presisi mencegah israf (pemborosan) dan melindungi hasil panen.'],
      ['Khalifah fil ’Ardh','Manusia diberi amanah memakmurkan bumi, bukan merusaknya (QS. Al-A’raf: 56; QS. Ar-Rum: 41).']] },
    { icon:'🔬', title:'Sudut Pandang Sains/Teknologi', sub:'Karbon, perangkat, air vulkanik', points:[
      ['Jejak karbon','Sensor berdaya rendah dan tenaga surya menekan emisi; pompa irigasi berbasis jadwal lebih hemat energi daripada penyiraman manual berlebih.'],
      ['Siklus hidup perangkat','Pilih modul tahan cuaca, mudah diperbaiki, dan daur ulang baterai agar limbah elektronik tidak menjadi masalah baru.'],
      ['Air vulkanik Semeru','Tanah vulkanik berpori cepat meloloskan air. Mata air dan resapan di lereng perlu dikonservasi lewat embung dan vegetasi penutup.']] },
    { icon:'🤝', title:'Sudut Pandang Sosial', sub:'Empati komunitas', points:[
      ['Petani lokal Lumajang','Gagal panen berarti hilangnya penghasilan. Teknologi harus murah, mudah dipahami, dan dilatihkan bersama kelompok tani.'],
      ['Masyarakat rentan','Kekeringan berdampak pada air bersih rumah tangga, lansia, dan anak-anak. Peringatan dini perlu menjangkau semua.'],
      ['Gotong royong','Berbagi data, air, dan pengetahuan memperkuat ketahanan bersama.']] }
  ];
  const tabs = document.getElementById('tabs'), panel = document.getElementById('tabPanel');
  const show = i => {
    [...tabs.children].forEach((b, j) => {
      const on = i === j; b.setAttribute('aria-selected', on);
      b.className = 'shrink-0 px-4 py-2 rounded-full text-sm font-semibold border ' + (on ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800');
    });
    const d = data[i];
    panel.innerHTML = `<h3 class="text-xl font-bold">${d.icon} ${d.title}</h3><p class="text-amber-700 dark:text-amber-300 text-sm font-medium">${d.sub}</p>
      <div class="mt-4 grid md:grid-cols-3 gap-4">${d.points.map(p => `<div class="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 p-4"><h4 class="font-semibold text-emerald-900 dark:text-emerald-200">${p[0]}</h4><p class="mt-1 text-sm text-slate-600 dark:text-slate-300">${p[1]}</p></div>`).join('')}</div>`;
  };
  data.forEach((d, i) => { const b = document.createElement('button'); b.setAttribute('role','tab'); b.textContent = d.icon + ' ' + d.title; b.onclick = () => show(i); tabs.appendChild(b); });
  show(0);
})();

/* ===== Modul Mitigasi ===== */
const Mitigasi = (() => {
  const items = [
    ['🏞️','Embung Digital','Penampung air hujan di lereng dengan sensor level air. Notifikasi ke ponsel saat volume turun di bawah ambang, sehingga pembagian air bisa diatur adil.'],
    ['🍂','Mulsa Organik Berbasis Sensor','Jerami dan daun kering menahan penguapan. Sensor kelembapan menunjukkan kapan mulsa perlu ditambah dan kapan penyiraman benar-benar diperlukan.'],
    ['📣','Sistem Peringatan Dini','Ambang kelembapan, suhu, dan debit memicu pesan peringatan lewat grup WhatsApp kelompok tani agar petani bisa menyesuaikan jadwal tanam.']
  ];
  document.getElementById('mitigasiGrid').innerHTML = items.map(i => `
    <details class="group rounded-2xl bg-white dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 p-5 shadow-sm">
      <summary class="cursor-pointer list-none flex items-center gap-3"><span class="text-3xl">${i[0]}</span><span class="font-semibold flex-1">${i[1]}</span><span class="text-amber-600 group-open:rotate-45 transition text-2xl">+</span></summary>
      <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${i[2]}</p></details>`).join('');
})();

/* ===== Modul Galeri (5 slot) ===== */
// Galeri terisi otomatis melalui struktur HTML statis
const Gallery = (() => {
  // Inisialisasi atau fitur pendukung galeri jika diperlukan di masa mendatang
  console.log("Galeri 5 Foto Dokumentasi Lapangan Berhasil Dimuat.");
})();

/* ===== Modul Jam & Waktu Sholat (Lumajang, WIB) ===== */
const Prayer = (() => {
  const LAT = -8.1337, LON = 113.2246, TZ = 7;            // Lumajang, UTC+7
  const rad = d => d * Math.PI / 180, deg = r => r * 180 / Math.PI;
  const mod = (a, n) => ((a % n) + n) % n;
  const pad = n => String(n).padStart(2, '0');
  const LIST = [['subuh', 'Subuh'], ['terbit', 'Terbit'], ['dzuhur', 'Dzuhur'], ['ashar', 'Ashar'], ['maghrib', 'Maghrib'], ['isya', 'Isya']];
  const SHOLAT = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];

  const julian = (y, m, d) => {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  };

  // Hitung jam (desimal, WIB) untuk satu tanggal. Subuh 20°, Isya 18°, Ashar mazhab Syafi'i, ihtiyat 2 menit.
  function compute(y, m, d) {
    const D = julian(y, m, d) + (12 - TZ) / 24 - 2451545.0;
    const g = mod(357.529 + 0.98560028 * D, 360), q = mod(280.459 + 0.98564736 * D, 360);
    const L = mod(q + 1.915 * Math.sin(rad(g)) + 0.020 * Math.sin(rad(2 * g)), 360);
    const e = 23.439 - 0.00000036 * D;
    const RA = mod(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15, 24);
    const decl = deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L))));
    let eqt = q / 15 - RA; if (eqt > 12) eqt -= 24; if (eqt < -12) eqt += 24;
    const noon = 12 + TZ - LON / 15 - eqt;
    const cosLD = Math.cos(rad(LAT)) * Math.cos(rad(decl)), sinLD = Math.sin(rad(LAT)) * Math.sin(rad(decl));
    const t = a => deg(Math.acos(Math.min(1, Math.max(-1, (-Math.sin(rad(a)) - sinLD) / cosLD)))) / 15;
    const asrAngle = -deg(Math.atan(1 / (1 + Math.tan(rad(Math.abs(LAT - decl))))));
    const ih = 2 / 60;
    return { subuh: noon - t(20) + ih, terbit: noon - t(0.833) - ih, dzuhur: noon + ih, ashar: noon + t(asrAngle) + ih, maghrib: noon + t(0.833) + ih, isya: noon + t(18) + ih };
  }

  // Waktu Lumajang selalu dibaca sebagai WIB, apa pun zona waktu perangkat.
  const wib = () => new Date(Date.now() + TZ * 3600e3);
  const forDay = (n, plus) => compute(n.getUTCFullYear(), n.getUTCMonth() + 1, n.getUTCDate() + plus);
  const fmt = h => { const m = Math.round(h * 60); return pad(Math.floor(m / 60) % 24) + '.' + pad(m % 60); };

  const clockEl = document.getElementById('clock'), listEl = document.getElementById('prayerList'), nextEl = document.getElementById('nextPrayer');
  let dayKey = '', today = null, tomorrow = null, shownNext = '';

  function render(next) {
    listEl.innerHTML = LIST.map(([k, label]) => {
      const active = k === next;
      const cls = active ? 'bg-amber-300 text-emerald-950 font-semibold ring-2 ring-amber-200'
        : k === 'terbit' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-800/60';
      return `<li class="rounded-xl py-2 ${cls}"><span class="block text-xs">${label}</span><span class="block text-base tabular-nums">${fmt(today[k])}</span></li>`;
    }).join('');
  }

  function tick() {
    const n = wib(), key = n.getUTCFullYear() + '-' + n.getUTCMonth() + '-' + n.getUTCDate();
    if (key !== dayKey) { dayKey = key; today = forDay(n, 0); tomorrow = forDay(n, 1); shownNext = ''; }
    const nowH = n.getUTCHours() + n.getUTCMinutes() / 60 + n.getUTCSeconds() / 3600;
    clockEl.textContent = pad(n.getUTCHours()) + ':' + pad(n.getUTCMinutes()) + ':' + pad(n.getUTCSeconds()) + ' WIB';

    let next = SHOLAT.find(k => today[k] > nowH), diff;
    if (next) diff = today[next] - nowH; else { next = 'subuh'; diff = tomorrow.subuh + 24 - nowH; }
    if (next !== shownNext) { shownNext = next; render(next); }

    const s = Math.max(0, Math.round(diff * 3600)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sc = s % 60;
    const label = LIST.find(x => x[0] === next)[1];
    nextEl.textContent = label + ' pukul ' + fmt(next === 'subuh' && diff + nowH >= 24 ? tomorrow.subuh : today[next]) + ' · ' +
      (h > 0 ? h + ' jam ' + m + ' menit lagi' : m + ' menit ' + sc + ' detik lagi');
  }
  tick();
  setInterval(tick, 1000);
  return { compute, forDay };
})();
