/**
 * RampCrew Static Prerenderer
 * Generates static HTML snapshots for SEO landing pages using React SSR.
 * Runs after `vite build`. Injects rendered HTML into dist/index.html shells.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, 'dist')
const baseHTML = readFileSync(join(distDir, 'index.html'), 'utf8')

// Static content for each SEO page — mirrors the JSX components
// This is the crawler-visible content; React hydrates on top in the browser
const PAGES = [
  {
    route: 'launch/lake-coeur-dalene',
    title: "Boat Launch Help on Lake Coeur d'Alene | RampCrew",
    description: "RampCrew provides verified launch helpers, live ramp conditions, and slot booking at Higgens Point, City Park, and Blackwell Island on Lake Coeur d'Alene, Idaho.",
    canonical: 'https://rampcrew.com/launch/lake-coeur-dalene',
    h1: "Boat Launch Help on Lake Coeur d'Alene",
    intro: "RampCrew provides verified launch helpers, live ramp conditions, and slot booking at all three Lake Coeur d'Alene boat ramps — Higgens Point, City Park, and Blackwell Island.",
    ramps: [
      { name: "Higgens Point Boat Ramp", desc: "Largest ramp on CDA Lake — 4 lanes, ample parking, paved surface. Busy on weekends; arrive early." },
      { name: "City Park Boat Ramp", desc: "Centrally located in downtown Coeur d'Alene. Walking distance to restaurants and marina." },
      { name: "Blackwell Island Ramp", desc: "Near Riverstone, shaded parking. Great for anglers heading to the northern reaches of the lake." },
    ],
    about: "At 30 miles long and over 25,000 acres, Lake Coeur d'Alene is one of Idaho's premier recreational lakes. Summer weekends bring heavy traffic at all three public ramps. RampCrew was built specifically for CDA — helping boaters skip the chaos, launch confidently, and spend more time on the water.",
    services: ['Guide your trailer to the ramp lane','Coach first-time launchers step by step','Hold your vessel at the dock while you park','Assist with retrieval and load coordination','Provide dock support during busy periods'],
  },
  {
    route: 'launch/hayden-lake',
    title: 'Boat Launch Help at Hayden Lake Idaho | RampCrew',
    description: 'RampCrew connects boaters on Hayden Lake with verified local helpers for launch guidance, dock support, and retrieval coordination at Honeysuckle Beach Ramp.',
    canonical: 'https://rampcrew.com/launch/hayden-lake',
    h1: 'Boat Launch Help on Hayden Lake',
    intro: "RampCrew connects boaters on Hayden Lake with verified local helpers for launch guidance, dock support, and retrieval coordination at Honeysuckle Beach Ramp.",
    ramps: [
      { name: "Honeysuckle Beach Boat Ramp", desc: "The primary public ramp on Hayden Lake. Well-maintained paved lanes with a sandy beach area nearby." },
    ],
    about: "Hayden Lake is a 3,500-acre gem just minutes north of Coeur d'Alene. Known for its crystal-clear water and quieter atmosphere compared to CDA, it's a favorite for families and wake sports. The Honeysuckle Beach ramp can get crowded on summer weekends — RampCrew helps you navigate it stress-free.",
    services: ['Lane guidance at the ramp','Step-by-step coaching for new boaters','Dock-side vessel hold while you park','Load coordination on retrieval','Ramp etiquette tips and local knowledge'],
  },
  {
    route: 'launch/sandpoint',
    title: 'Boat Launch Help in Sandpoint Idaho | Lake Pend Oreille | RampCrew',
    description: 'RampCrew provides verified launch helpers and live ramp conditions at Sandpoint City Ramp and Hope Boat Basin on Lake Pend Oreille — Idaho\'s largest lake.',
    canonical: 'https://rampcrew.com/launch/sandpoint',
    h1: 'Boat Launch Help in Sandpoint, Idaho',
    intro: "RampCrew provides verified launch helpers and live ramp conditions at Sandpoint City Ramp and Hope Boat Basin on Lake Pend Oreille — Idaho's deepest and largest lake.",
    ramps: [
      { name: "Sandpoint City Boat Ramp", desc: "Downtown Sandpoint's main public ramp on Lake Pend Oreille. Large staging area, 3 lanes, close to the Long Bridge." },
      { name: "Hope Boat Basin", desc: "Quieter alternative east of Sandpoint near the town of Hope. Ideal for anglers and those exploring the eastern basin." },
    ],
    about: "Lake Pend Oreille is Idaho's largest lake at 148 square miles and over 1,100 feet deep. Sandpoint sits at its northern tip and is one of North Idaho's most popular summer destinations. The city ramp handles serious boat traffic during July and August — RampCrew helps you launch without the headache.",
    services: ['Ramp lane guidance and staging','Trailer backing coaching for beginners','Dock hold during peak launch windows','Retrieval and load-out coordination','Local intel on lake conditions and hazards'],
  },
  {
    route: 'launch/priest-lake',
    title: 'Boat Launch Help at Priest Lake Idaho | RampCrew',
    description: 'RampCrew is expanding to Priest Lake with verified local helpers for launch guidance and ramp coordination at Dickensheet Campground Ramp and Outlet Bay.',
    canonical: 'https://rampcrew.com/launch/priest-lake',
    h1: 'Boat Launch Help at Priest Lake, Idaho',
    intro: "RampCrew is expanding to Priest Lake with verified local helpers for launch guidance, dock support, and ramp coordination at Idaho's most scenic wilderness lake.",
    ramps: [
      { name: "Dickensheet Campground Ramp", desc: "USFS-managed ramp on the main lake near Coolin. Paved, well-maintained, good staging area." },
      { name: "Outlet Bay Ramp", desc: "Public ramp at the southern end of Priest Lake. Less crowded alternative with easy highway access." },
    ],
    about: "Priest Lake sits in the Selkirk Mountains of Bonner County — 19 miles long, surrounded by old-growth forest and managed by the USFS. Its remote beauty draws boaters, kayakers, and anglers from across the Pacific Northwest. RampCrew is building a local helper network to serve the Coolin and Nordman communities.",
    services: ['Ramp lane and staging guidance','Coaching for remote/wilderness launches','Dock support and vessel hold','Retrieval coordination','Local knowledge of Priest Lake ramps and hazards'],
  },
  {
    route: 'launch/spirit-lake',
    title: 'Boat Launch Help at Spirit Lake Idaho | RampCrew',
    description: 'RampCrew is coming to Spirit Lake, Idaho with verified local helpers for launch assistance and dock support at the Spirit Lake City Ramp.',
    canonical: 'https://rampcrew.com/launch/spirit-lake',
    h1: 'Boat Launch Help at Spirit Lake, Idaho',
    intro: "RampCrew is coming to Spirit Lake with verified local helpers for launch assistance and dock support at the Spirit Lake City Ramp.",
    ramps: [
      { name: "Spirit Lake City Ramp", desc: "Town-managed ramp off Maine Street. Easy access, single lane, good for smaller boats and pontoons." },
    ],
    about: "Spirit Lake is a 1,400-acre lake in Kootenai County, known for excellent bass and trout fishing and a tight-knit small-town community. At just 20 miles north of Coeur d'Alene, it's a popular local getaway that sees steady traffic on summer weekends.",
    services: ['Launch lane guidance','Coaching for first-time launchers','Dock hold while you park','Load and retrieval coordination','Local ramp tips'],
  },
  {
    route: 'launch/twin-lakes',
    title: 'Boat Launch Help at Twin Lakes Idaho | RampCrew',
    description: 'RampCrew is building a helper network at Twin Lakes (Upper and Lower) in Kootenai County for launch guidance, dock support, and ramp coordination.',
    canonical: 'https://rampcrew.com/launch/twin-lakes',
    h1: 'Boat Launch Help at Twin Lakes, Idaho',
    intro: "RampCrew is building a helper network at Twin Lakes (Upper and Lower) to provide launch guidance and dock support for local boaters and anglers.",
    ramps: [
      { name: "Twin Lakes Village Ramp", desc: "Community ramp serving both Upper and Lower Twin Lakes. Small but functional — best for trailered boats under 24 ft." },
    ],
    about: "Twin Lakes — Upper and Lower — sit just west of Rathdrum in Kootenai County. Together they cover about 700 acres and are a favorite for bass fishing, paddleboarding, and family boating. RampCrew is bringing professional launch support to this local favorite.",
    services: ['Ramp lane guidance','Coaching for new boaters and anglers','Dock hold while you park your trailer','Load-out and retrieval coordination','Local lake tips and ramp etiquette'],
  },
]

function buildPageHTML(page) {
  const rampsHTML = page.ramps.map(r => `
    <div class="ramp-card">
      <h3>${r.name}</h3>
      <p>${r.desc}</p>
    </div>`).join('')

  const servicesHTML = page.services.map(s =>
    `<li>✓ ${s}</li>`
  ).join('')

  return `
    <main id="seo-content">
      <h1>${page.h1}</h1>
      <p>${page.intro}</p>

      <section>
        <h2>Boat Ramps We Serve</h2>
        ${rampsHTML}
      </section>

      <section>
        <h2>What RampCrew Helpers Do</h2>
        <ul>${servicesHTML}</ul>
      </section>

      <section>
        <h2>Safety Policy</h2>
        <p>RampCrew helpers assist with guidance, preparation, dock support, and launch/load coordination. Boat owners remain responsible for operating their vehicle, trailer, and vessel. Helpers do not drive trucks, back trailers, or operate boats on behalf of customers.</p>
      </section>

      <section>
        <h2>About This Lake</h2>
        <p>${page.about}</p>
      </section>

      <nav>
        <p>Book a helper or check live conditions at <a href="https://rampcrew.com">rampcrew.com</a></p>
      </nav>
    </main>
  `
}

function injectIntoHTML(base, page) {
  let html = base

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${page.title}</title>`
  )

  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/>/,
    `<meta name="description" content="${page.description}" />`
  )

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href=".*?"\s*\/>/,
    `<link rel="canonical" href="${page.canonical}" />`
  )

  // Replace og:url
  html = html.replace(
    /<meta property="og:url" content=".*?"\s*\/>/,
    `<meta property="og:url" content="${page.canonical}" />`
  )

  // Replace og:title
  html = html.replace(
    /<meta property="og:title" content=".*?"\s*\/>/,
    `<meta property="og:title" content="${page.title}" />`
  )

  // Replace og:description
  html = html.replace(
    /<meta property="og:description" content=".*?"\s*\/>/,
    `<meta property="og:description" content="${page.description}" />`
  )

  // Replace twitter:title
  html = html.replace(
    /<meta name="twitter:title" content=".*?"\s*\/>/,
    `<meta name="twitter:title" content="${page.title}" />`
  )

  // Replace twitter:description
  html = html.replace(
    /<meta name="twitter:description" content=".*?"\s*\/>/,
    `<meta name="twitter:description" content="${page.description}" />`
  )

  // Inject static HTML into #root div for crawlers
  // React will hydrate over it in the browser
  const staticBody = buildPageHTML(page)
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${staticBody}</div>`
  )

  return html
}

// Generate static HTML files for each SEO route
let generated = 0
for (const page of PAGES) {
  const dir = join(distDir, page.route)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  const html = injectIntoHTML(baseHTML, page)
  writeFileSync(join(dir, 'index.html'), html, 'utf8')
  console.log(`✓ Generated /${page.route}/index.html`)
  generated++
}

console.log(`\n✅ Prerendered ${generated} SEO pages into dist/`)
