/**
 * GRIDFRAME V2 — CATALOG EXPANSION PIPELINE (2000+ ICONS)
 *
 * Curation & Ingestion Strategy:
 * 1. Primary Canonical Source: Iconoir (1,649 icons, MIT license).
 * 2. Secondary Curated Source: Tabler Icons (v3.46.0, MIT license, 24x24 viewBox, stroke-based).
 * 3. Semantic Deduplication: Filters direct collisions, near-duplicates, and state variations.
 * 4. Ingestion Quality Gate: Validates 24x24 viewBox, XML markup, sanitizes paths.
 * 5. Taxonomy Normalization: Maps all icons into the 44 official Gridframe categories.
 * 6. Emits verified src/data/icons/catalog.json.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeSvgMarkup, extractInnerSvg, extractViewBox } from '../src/lib/svg/sanitizeSvg';
import { validateSvg } from '../src/lib/svg/validateSvg';
import {
  OFFICIAL_CATEGORIES,
  normalizeCategorySlug,
  getCanonicalCategory,
  type CanonicalCategoryDefinition,
} from '../src/data/category-registry';
import type { Icon, IconVariant, SvgCapability, IconSource, IconStyle } from '../src/types/icon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.resolve(__dirname, '../src/data/icons/catalog.json');
const TABLER_PKG_DIR = path.resolve(__dirname, '../node_modules/@tabler/icons');
const TABLER_OUTLINE_DIR = path.join(TABLER_PKG_DIR, 'icons/outline');
const TABLER_FILLED_DIR = path.join(TABLER_PKG_DIR, 'icons/filled');
const TABLER_ICONS_JSON = path.join(TABLER_PKG_DIR, 'icons.json');
const TABLER_PKG_JSON = path.join(TABLER_PKG_DIR, 'package.json');

// --- RULE-BASED SEMANTIC CLASSIFIER ---
interface CategoryRule {
  slug: string;
  patterns: RegExp[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    slug: 'git',
    patterns: [/\bgit\b/i, /\bcommit\b/i, /\bmerge\b/i, /\bpull-request\b/i, /\bpr\b/i, /\bfork\b/i, /\brepository\b/i, /\brepo\b/i, /\bstash\b/i, /\bcherry-pick\b/i, /\bdiff\b/i, /\brebase\b/i, /\bbranch\b/i],
  },
  {
    slug: 'cloud',
    patterns: [/\bcloud\b/i, /\bserver-cloud\b/i, /\bhosting\b/i, /\bsync\b/i, /\bremote-storage\b/i, /\baws\b/i, /\bazure\b/i, /\bcloud-computing\b/i, /\bcdn\b/i],
  },
  {
    slug: 'clothing',
    patterns: [
      /\bshirt\b/i, /\bt-shirt\b/i, /\bshoe\b/i, /\bsneaker\b/i, /\bboot\b/i, /\bhat\b/i, /\bcap\b/i, /\bjacket\b/i,
      /\bcoat\b/i, /\bdress\b/i, /\bsunglasses\b/i, /\bglasses\b/i, /\bspectacles\b/i, /\bhanger\b/i,
      /\btie\b/i, /\bsuit\b/i, /\bsock\b/i, /\bglove\b/i, /\bbelt\b/i, /\bscarf\b/i, /\bhoodie\b/i, /\bapparel\b/i,
    ],
  },
  {
    slug: 'communication',
    patterns: [
      /\bmessage\b/i, /\bchat\b/i, /\bmail\b/i, /\bemail\b/i, /\bphone\b/i, /\bcall\b/i, /\binbox\b/i,
      /\bmegaphone\b/i, /\bbroadcast\b/i, /\bsms\b/i, /\benvelope\b/i, /\bspeech\b/i, /\bdialog\b/i, /\bbubble\b/i,
      /\bpost\b/i, /\bnewsletter\b/i, /\bvoicemail\b/i, /\bheadset\b/i, /\bcontact\b/i, /\bnotification\b/i,
    ],
  },
  {
    slug: 'business',
    patterns: [
      /\bbriefcase\b/i, /\boffice\b/i, /\bpresentation\b/i, /\bhandshake\b/i, /\bconference\b/i,
      /\bmeeting\b/i, /\bportfolio\b/i, /\bcontract\b/i, /\bagreement\b/i, /\bcorporate\b/i,
      /\bhierarchy\b/i, /\borg-chart\b/i, /\bteamwork\b/i, /\bleadership\b/i, /\bdesk\b/i,
    ],
  },
  {
    slug: 'buildings',
    patterns: [
      /\bbuilding\b/i, /\bhospital\b/i, /\bschool\b/i, /\bchurch\b/i, /\btower\b/i, /\bfactory\b/i,
      /\bwarehouse\b/i, /\bstadium\b/i, /\bcastle\b/i, /\bmonument\b/i, /\bmuseum\b/i, /\barchitecture\b/i,
    ],
  },
  {
    slug: 'audio',
    patterns: [
      /\bsound\b/i, /\bspeaker\b/i, /\bvolume\b/i, /\bmicrophone\b/i, /\bmic\b/i, /\baudio\b/i,
      /\bheadphones\b/i, /\bheadset\b/i, /\bequalizer\b/i, /\bwaveform\b/i, /\bdecibel\b/i, /\bpodcast\b/i,
    ],
  },
  {
    slug: 'animations',
    patterns: [
      /\btransition\b/i, /\bkeyframe\b/i, /\bframe-rate\b/i, /\banimation\b/i, /\beasing\b/i,
      /\bmotion\b/i, /\brotate-animation\b/i, /\bplayback-rate\b/i,
    ],
  },
  {
    slug: 'animals',
    patterns: [
      /\bdog\b/i, /\bcat\b/i, /\bbird\b/i, /\bfish\b/i, /\brabbit\b/i, /\bturtle\b/i, /\bbee\b/i,
      /\bbutterfly\b/i, /\bhorse\b/i, /\bbear\b/i, /\bwolf\b/i, /\bpaw\b/i, /\banimal\b/i, /\bpet\b/i,
    ],
  },
  {
    slug: 'activities',
    patterns: [
      /\bbasketball\b/i, /\bfootball\b/i, /\bsoccer\b/i, /\btennis\b/i, /\bgolf\b/i, /\bbowling\b/i,
      /\brunning\b/i, /\bswimming\b/i, /\bcycling\b/i, /\bskiing\b/i, /\bmeditation\b/i, /\byoga\b/i,
      /\bsport\b/i, /\bexercise\b/i, /\bfitness\b/i, /\bgym\b/i, /\bworkout\b/i,
    ],
  },
  {
    slug: 'actions',
    patterns: [
      /\bcursor\b/i, /\bpointer\b/i, /\bclick\b/i, /\bdrag\b/i, /\bdrop\b/i, /\bselect\b/i,
      /\bcheck\b/i, /\bxmark\b/i, /\bplus\b/i, /\bminus\b/i, /\brefresh\b/i, /\breload\b/i,
      /\bundo\b/i, /\bredo\b/i, /\bcopy\b/i, /\bcut\b/i, /\bpaste\b/i, /\btrash\b/i, /\bdelete\b/i,
      /\bsave\b/i, /\bdownload\b/i, /\bupload\b/i, /\bfilter\b/i, /\bsort\b/i, /\bsearch\b/i,
    ],
  },
  {
    slug: 'connectivity',
    patterns: [
      /\bwifi\b/i, /\bbluetooth\b/i, /\bsignal\b/i, /\bnetwork\b/i, /\brss\b/i, /\bradio\b/i,
      /\bantenna\b/i, /\bbroadcast\b/i, /\brouter\b/i, /\bmodem\b/i, /\bhotspot\b/i, /\bnfc\b/i,
    ],
  },
  {
    slug: 'database',
    patterns: [
      /\bdatabase\b/i, /\bsql\b/i, /\btable\b/i, /\brow\b/i, /\bcolumn\b/i, /\bpostgres\b/i,
      /\bmysql\b/i, /\bmongodb\b/i, /\bredis\b/i, /\bbackup\b/i, /\brestore\b/i, /\bschema\b/i,
    ],
  },
  {
    slug: 'design-tools',
    patterns: [
      /\bpalette\b/i, /\bbrush\b/i, /\bpaint\b/i, /\bpen\b/i, /\bpencil\b/i, /\blayers\b/i,
      /\bruler\b/i, /\bcolor-picker\b/i, /\beyedropper\b/i, /\bvector\b/i, /\bcanvas\b/i,
      /\bbezier\b/i, /\bswatch\b/i, /\bgradient\b/i, /\beraser\b/i, /\bscissors\b/i,
    ],
  },
  {
    slug: 'development',
    patterns: [
      /\bcode\b/i, /\bterminal\b/i, /\bbug\b/i, /\bcpu\b/i, /\bserver\b/i, /\bapi\b/i,
      /\bbrackets\b/i, /\bjson\b/i, /\bxml\b/i, /\bhtml\b/i, /\bcss\b/i, /\bscript\b/i,
      /\bfunction\b/i, /\bvariable\b/i, /\bregex\b/i, /\bwebhook\b/i, /\bdev\b/i, /\bcompiler\b/i,
    ],
  },
  {
    slug: 'devices',
    patterns: [
      /\bphone\b/i, /\blaptop\b/i, /\bcomputer\b/i, /\bmonitor\b/i, /\btablet\b/i, /\btv\b/i,
      /\bkeyboard\b/i, /\bmouse\b/i, /\bprinter\b/i, /\bcamera\b/i, /\bwatch\b/i, /\bhard-drive\b/i,
      /\busb\b/i, /\bchip\b/i, /\bbattery\b/i, /\bplug\b/i, /\bgadget\b/i, /\bhardware\b/i,
    ],
  },
  {
    slug: 'docs',
    patterns: [
      /\bdoc\b/i, /\bdocument\b/i, /\bfile\b/i, /\bpage\b/i, /\bpdf\b/i, /\btxt\b/i, /\bcsv\b/i,
      /\bnotes\b/i, /\bnotebook\b/i, /\bjournal\b/i, /\bpaper\b/i, /\bclipboard\b/i, /\barchive\b/i,
    ],
  },
  {
    slug: 'emojis',
    patterns: [
      /\bemoji\b/i, /\bsmile\b/i, /\bfrown\b/i, /\blaugh\b/i, /\bwink\b/i, /\bface\b/i,
      /\bsad\b/i, /\bhappy\b/i, /\bangry\b/i, /\bshocked\b/i, /\bexpression\b/i,
    ],
  },
  {
    slug: 'finance',
    patterns: [
      /\bwallet\b/i, /\bmoney\b/i, /\bcurrency\b/i, /\bcoin\b/i, /\bbank\b/i, /\bcard\b/i,
      /\bcredit\b/i, /\bcash\b/i, /\bdollar\b/i, /\beuro\b/i, /\bbitcoin\b/i, /\bcrypto\b/i,
      /\binvoice\b/i, /\bpayment\b/i, /\btax\b/i, /\bprofit\b/i, /\binvest\b/i, /\bfinance\b/i,
    ],
  },
  {
    slug: 'food',
    patterns: [
      /\bcoffee\b/i, /\btea\b/i, /\bcup\b/i, /\bfood\b/i, /\bpizza\b/i, /\bburger\b/i,
      /\bapple\b/i, /\bfruit\b/i, /\bbottle\b/i, /\bglass\b/i, /\brestaurant\b/i, /\bcooking\b/i,
      /\bchef\b/i, /\bkitchen\b/i, /\bdining\b/i, /\bdrink\b/i, /\bmeal\b/i,
    ],
  },
  {
    slug: 'gaming',
    patterns: [
      /\bgame\b/i, /\bgamepad\b/i, /\bcontroller\b/i, /\bjoystick\b/i, /\bconsole\b/i,
      /\bdice\b/i, /\bpoker\b/i, /\bchess\b/i, /\bplaystation\b/i, /\bxbox\b/i, /\barcade\b/i,
    ],
  },
  {
    slug: 'gestures',
    patterns: [
      /\bhand\b/i, /\bfinger\b/i, /\bswipe\b/i, /\bpinch\b/i, /\bscroll\b/i, /\btouch\b/i,
      /\bgesture\b/i, /\bpoint\b/i, /\bhold\b/i, /\bdrag\b/i, /\bpress\b/i,
    ],
  },
  {
    slug: 'health',
    patterns: [
      /\bheart\b/i, /\bhealth\b/i, /\bmedical\b/i, /\bhospital\b/i, /\bdoctor\b/i, /\bpill\b/i,
      /\bmedicine\b/i, /\bvirus\b/i, /\bdna\b/i, /\bambulance\b/i, /\bfirst-aid\b/i, /\bthermometer\b/i,
      /\bstethoscope\b/i, /\bvaccine\b/i, /\bpulse\b/i,
    ],
  },
  {
    slug: 'home',
    patterns: [
      /\bhome\b/i, /\bhouse\b/i, /\broom\b/i, /\bdoor\b/i, /\bwindow\b/i, /\bfurniture\b/i,
      /\bbed\b/i, /\bsofa\b/i, /\blamp\b/i, /\blightbulb\b/i, /\bfan\b/i, /\bshower\b/i,
      /\bbath\b/i, /\bgarage\b/i, /\bgarden\b/i, /\bkitchen\b/i,
    ],
  },
  {
    slug: 'identity',
    patterns: [
      /\buser-badge\b/i, /\bverified\b/i, /\bcredential\b/i, /\bpassport\b/i, /\bid-card\b/i,
      /\bcertificate\b/i, /\blicense\b/i, /\bfingerprint\b/i, /\bface-id\b/i, /\bauth\b/i,
    ],
  },
  {
    slug: 'layout',
    patterns: [
      /\bgrid\b/i, /\bcolumn\b/i, /\brow\b/i, /\bpanel\b/i, /\bsidebar\b/i, /\bheader\b/i,
      /\bfooter\b/i, /\bspacing\b/i, /\bmargin\b/i, /\bpadding\b/i, /\bcontainer\b/i, /\blayout\b/i,
    ],
  },
  {
    slug: 'maps',
    patterns: [
      /\bmap\b/i, /\bpin\b/i, /\bgps\b/i, /\blocation\b/i, /\bcompass\b/i, /\bnavigation\b/i,
      /\broute\b/i, /\bdirection\b/i, /\bmarker\b/i, /\bglobe\b/i, /\bworld\b/i,
    ],
  },
  {
    slug: 'music',
    patterns: [
      /\bmusic\b/i, /\bnote\b/i, /\bsong\b/i, /\btrack\b/i, /\balbum\b/i, /\bplaylist\b/i,
      /\bguitar\b/i, /\bpiano\b/i, /\bdrum\b/i, /\brhythm\b/i, /\bmelody\b/i,
    ],
  },
  {
    slug: 'nature',
    patterns: [
      /\bleaf\b/i, /\btree\b/i, /\bflower\b/i, /\bplant\b/i, /\bforest\b/i, /\bmountain\b/i,
      /\briver\b/i, /\bocean\b/i, /\bsea\b/i, /\benvironment\b/i, /\beco\b/i,
    ],
  },
  {
    slug: 'navigation',
    patterns: [
      /\barrow\b/i, /\bchevron\b/i, /\bcaret\b/i, /\bnext\b/i, /\bprev\b/i, /\bforward\b/i,
      /\bbackward\b/i, /\bup\b/i, /\bdown\b/i, /\bleft\b/i, /\bright\b/i, /\bmenu\b/i,
      /\bmore\b/i, /\bbreadcrumb\b/i, /\bpagination\b/i, /\bcompass\b/i,
    ],
  },
  {
    slug: 'organization',
    patterns: [
      /\bfolder\b/i, /\bdirectory\b/i, /\bcollection\b/i, /\bcategory\b/i, /\btag\b/i,
      /\blabel\b/i, /\bstructure\b/i, /\bgroup\b/i, /\bhierarchy\b/i, /\borganize\b/i,
    ],
  },
  {
    slug: 'photos-and-videos',
    patterns: [
      /\bphoto\b/i, /\bimage\b/i, /\bpicture\b/i, /\bgallery\b/i, /\bcamera\b/i, /\bvideo\b/i,
      /\bfilm\b/i, /\bmovie\b/i, /\bmedia\b/i, /\bplay\b/i, /\bpause\b/i, /\brecord\b/i,
    ],
  },
  {
    slug: 'science',
    patterns: [
      /\bflask\b/i, /\blab\b/i, /\bchemistry\b/i, /\bphysics\b/i, /\batom\b/i, /\bmolecule\b/i,
      /\bmicroscope\b/i, /\btelescope\b/i, /\bresearch\b/i, /\bformula\b/i, /\bscience\b/i,
    ],
  },
  {
    slug: 'security',
    patterns: [
      /\block\b/i, /\bunlock\b/i, /\bkey\b/i, /\bshield\b/i, /\bprotect\b/i, /\bsecurity\b/i,
      /\bpassword\b/i, /\bencryption\b/i, /\bperm\b/i, /\bfirewall\b/i, /\bvpn\b/i, /\bsafe\b/i,
    ],
  },
  {
    slug: 'shapes',
    patterns: [
      /\bsquare\b/i, /\bcircle\b/i, /\btriangle\b/i, /\bpolygon\b/i, /\bstar\b/i, /\bheart\b/i,
      /\bdiamond\b/i, /\bhexagon\b/i, /\boctagon\b/i, /\bgeometric\b/i, /\bshape\b/i,
    ],
  },
  {
    slug: 'shopping',
    patterns: [
      /\bshopping\b/i, /\bcart\b/i, /\bbag\b/i, /\bstore\b/i, /\bshop\b/i, /\bmarket\b/i,
      /\border\b/i, /\bcheckout\b/i, /\bproduct\b/i, /\bprice\b/i, /\bdiscount\b/i, /\bcoupon\b/i,
    ],
  },
  {
    slug: 'social',
    patterns: [
      /\bshare\b/i, /\bheart\b/i, /\blike\b/i, /\bfollow\b/i, /\bcomment\b/i, /\bfeed\b/i,
      /\bcommunity\b/i, /\bnetwork\b/i, /\bpost\b/i, /\btrending\b/i, /\bsocial\b/i,
    ],
  },
  {
    slug: 'system',
    patterns: [
      /\bsettings\b/i, /\bconfig\b/i, /\bcontrol\b/i, /\bpreference\b/i, /\boption\b/i,
      /\bsystem\b/i, /\bos\b/i, /\bstatus\b/i, /\bpower\b/i, /\bbattery\b/i, /\bclock\b/i, /\btimer\b/i,
    ],
  },
  {
    slug: 'tools',
    patterns: [
      /\btools\b/i, /\bhammer\b/i, /\bwrench\b/i, /\bscrewdriver\b/i, /\bconstruction\b/i,
      /\brepair\b/i, /\bmaintenance\b/i, /\butility\b/i, /\bpliers\b/i, /\bdrill\b/i,
    ],
  },
  {
    slug: 'transport',
    patterns: [
      /\bcar\b/i, /\bbus\b/i, /\btruck\b/i, /\btrain\b/i, /\bplane\b/i, /\bairplane\b/i,
      /\bbicycle\b/i, /\bbike\b/i, /\bship\b/i, /\bboat\b/i, /\btransport\b/i, /\bvehicle\b/i,
    ],
  },
  {
    slug: 'typography',
    patterns: [
      /\btext\b/i, /\bfont\b/i, /\bheading\b/i, /\balign\b/i, /\bbold\b/i, /\bitalic\b/i,
      /\bunderline\b/i, /\blist\b/i, /\bquote\b/i, /\bparagraph\b/i, /\btypography\b/i,
    ],
  },
  {
    slug: 'users',
    patterns: [
      /\buser\b/i, /\busers\b/i, /\bperson\b/i, /\bpeople\b/i, /\bprofile\b/i, /\baccount\b/i,
      /\bavatar\b/i, /\bteam\b/i, /\bmember\b/i, /\bgroup\b/i, /\bhuman\b/i,
    ],
  },
  {
    slug: 'weather',
    patterns: [
      /\bsun\b/i, /\bmoon\b/i, /\bcloud\b/i, /\brain\b/i, /\bsnow\b/i, /\bwind\b/i,
      /\blightning\b/i, /\bstorm\b/i, /\btemperature\b/i, /\bthermometer\b/i, /\bweather\b/i,
    ],
  },
];

function classify(slug: string, tags: string[] = []): string {
  const haystack = `${slug} ${tags.join(' ')}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(haystack)) {
        return rule.slug;
      }
    }
  }
  return 'other';
}

function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function runExpansion() {
  console.log('🚀 Starting Gridframe V2 Catalog Expansion Pipeline (Target: 2000+ Icons)...\n');

  // 1. Load canonical baseline (Iconoir)
  const existingCatalogRaw: Icon[] = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const baselineCatalog = existingCatalogRaw.filter(
    (i) => !i.source || i.source.id === 'iconoir' || i.source.id !== 'tabler'
  );

  console.log(`📦 Baseline Iconoir catalog: ${baselineCatalog.length} icons`);

  const existingIds = new Set<string>(baselineCatalog.map((i) => i.id));
  const existingSlugs = new Set<string>(baselineCatalog.map((i) => i.slug));
  const existingNames = new Set<string>(baselineCatalog.map((i) => i.name.toLowerCase()));

  // Normalize source attribution on baseline icons if missing
  for (const icon of baselineCatalog) {
    if (!icon.source) {
      icon.source = {
        id: 'iconoir',
        name: 'Iconoir',
        version: '7.12.1',
        sourcePath: `node_modules/iconoir/icons/regular/${icon.id}.svg`,
        license: 'MIT',
      };
    }
  }

  // 2. Read Tabler icons & metadata
  const tablerPkg = JSON.parse(fs.readFileSync(TABLER_PKG_JSON, 'utf8'));
  const tablerMeta: Record<string, { category?: string; tags?: (string | number)[] }> = JSON.parse(
    fs.readFileSync(TABLER_ICONS_JSON, 'utf8')
  );
  const tablerFiles = fs.readdirSync(TABLER_OUTLINE_DIR).filter((f) => f.endsWith('.svg'));

  console.log(`🔍 Tabler source library: ${tablerFiles.length} outline SVGs (v${tablerPkg.version}, License: ${tablerPkg.license})`);

  // 3. Curation and Deduplication Filters
  let directDuplicates = 0;
  let rejectedNoise = 0;
  let invalidSvgCount = 0;

  // Patterns for noisy / non-essential icons to reject
  const NOISE_PATTERNS = [
    /-(off|filled)$/, // avoid duplicate state toggles as concepts
    /-\d+$/, // avoid numbered duplicates like user-2, user-3 unless distinct
    /^(dice|cards|zodiac|flag|letter|number|math|square-letter|circle-letter|square-number|circle-number)-/,
    /^brand-(?!github|gitlab|docker|react|vue|python|nodejs|typescript|javascript|aws|figma|tailwind|nextjs|graphql|supabase|openai|vite|angular|rust|golang|flutter|android|apple|linux|ubuntu|debian|windows|npm|yarn|pnpm|vscode|cloudflare|vercel|stripe|slack|discord|youtube|twitter|x|linkedin|facebook|reddit|medium|spotify|netflix|zoom|notion|google|meta|amazon|microsoft)/,
  ];

  const ALLOWED_TABLER_CATEGORIES = new Set([
    'Development', 'Database', 'Version control', 'Logic', 'Extensions', 'Computers',
    'Devices', 'Electrical', 'Document', 'E-commerce', 'Charts', 'Currencies',
    'System', 'Design', 'Communication', 'Media', 'Health', 'Map', 'Vehicles', 'Buildings',
    'Food', 'Text', 'Arrows', 'Badges', 'Brand', 'Weather', 'Sport', 'Nature', 'Animals',
    'Gestures', 'Mood', 'Symbols'
  ]);

  const UTILITY_KEYWORDS = [
    'ui', 'code', 'data', 'cloud', 'server', 'database', 'security', 'shield', 'lock', 'key',
    'chart', 'analytics', 'graph', 'report', 'metric', 'user', 'account', 'team', 'member',
    'file', 'folder', 'doc', 'pdf', 'zip', 'text', 'edit', 'pencil', 'palette', 'layout',
    'payment', 'wallet', 'credit', 'card', 'currency', 'money', 'shop', 'cart', 'bag', 'tag',
    'message', 'mail', 'chat', 'phone', 'call', 'bell', 'alert', 'notification', 'share',
    'device', 'screen', 'laptop', 'desktop', 'mobile', 'hardware', 'usb', 'wifi', 'bluetooth',
    'map', 'pin', 'gps', 'route', 'navigation', 'compass', 'arrow', 'chevron', 'controls',
    'settings', 'tools', 'filter', 'sort', 'search', 'time', 'clock', 'calendar', 'timer',
    'health', 'medical', 'dna', 'science', 'atom', 'flask', 'ai', 'robot', 'brain', 'sparkles',
    'travel', 'plane', 'train', 'car', 'bus', 'ticket', 'passport', 'building', 'home'
  ];

  interface Candidate {
    filename: string;
    id: string;
    category: string;
    tags: string[];
    score: number;
  }

  const candidatePool: Candidate[] = [];

  for (const filename of tablerFiles) {
    const rawId = filename.replace('.svg', '');
    const cleanSlug = rawId.toLowerCase();

    // A. Check exact ID/slug collision with Iconoir
    if (existingIds.has(cleanSlug) || existingSlugs.has(cleanSlug)) {
      directDuplicates++;
      continue;
    }

    // B. Check noise patterns
    if (NOISE_PATTERNS.some((p) => p.test(cleanSlug))) {
      rejectedNoise++;
      continue;
    }

    // C. Check semantic near-duplicates of existing icons
    const nameLower = toTitleCase(cleanSlug).toLowerCase();
    if (existingNames.has(nameLower)) {
      directDuplicates++;
      continue;
    }

    const meta = tablerMeta[rawId] || {};
    const cat = meta.category || '';

    if (cat && !ALLOWED_TABLER_CATEGORIES.has(cat)) {
      rejectedNoise++;
      continue;
    }

    const tags = (meta.tags || []).map((t) => String(t).toLowerCase());
    const textBlob = `${cleanSlug} ${cat} ${tags.join(' ')}`.toLowerCase();

    let score = 0;
    if (cat === 'Brand') score += 10;
    if (['Development', 'Database', 'Version control', 'Charts', 'Document', 'E-commerce', 'System'].includes(cat)) score += 6;
    if (['Devices', 'Communication', 'Health', 'Security', 'Map'].includes(cat)) score += 4;

    for (const kw of UTILITY_KEYWORDS) {
      if (textBlob.includes(kw)) score += 2;
    }
    score += Math.min(5, tags.length);

    candidatePool.push({
      filename,
      id: cleanSlug,
      category: cat,
      tags,
      score,
    });
  }

  // Sort candidates by utility score descending
  candidatePool.sort((a, b) => b.score - a.score);

  // Target 550 curated icons from Tabler to reach ~2,200 total concepts
  const TARGET_ADDED_COUNT = 551;
  const selectedCandidates = candidatePool.slice(0, TARGET_ADDED_COUNT);

  console.log(`\nSelected top ${selectedCandidates.length} high-utility candidates from pool of ${candidatePool.length}`);

  const newCuratedIcons: Icon[] = [];

  for (const cand of selectedCandidates) {
    const svgPath = path.join(TABLER_OUTLINE_DIR, cand.filename);
    const rawSvg = fs.readFileSync(svgPath, 'utf8');

    // Validate SVG
    const validation = validateSvg(rawSvg);
    if (!validation.isValid) {
      invalidSvgCount++;
      continue;
    }

    const viewBox = extractViewBox(rawSvg) || '0 0 24 24';
    const innerSvg = extractInnerSvg(sanitizeSvgMarkup(rawSvg));

    if (!innerSvg || innerSvg.length < 10) {
      invalidSvgCount++;
      continue;
    }

    // Classify into Gridframe 44 official categories
    const primaryCategory = classify(cand.id, cand.tags);
    const canonicalCat = getCanonicalCategory(primaryCategory);

    // Default capabilities
    const regularCapabilities = {
      color: true,
      size: true,
      strokeWidth: true,
      lineCap: true,
      lineJoin: true,
      background: true,
      rotation: true,
      flip: true,
    };

    const filledCapabilities = {
      color: true,
      size: true,
      strokeWidth: false,
      lineCap: false,
      lineJoin: false,
      background: true,
      rotation: true,
      flip: true,
    };

    // Build variants
    const variants: IconVariant[] = [
      {
        id: `${cand.id}-regular`,
        style: 'regular',
        label: 'Regular',
        svg: innerSvg,
        viewBox,
        capabilities: regularCapabilities,
        supportsStroke: true,
        supportsColor: true,
        defaultStrokeWidth: 2,
        qualityStatus: 'validated',
      },
    ];

    // Check if Tabler has an authentic filled variant
    const filledPath = path.join(TABLER_FILLED_DIR, cand.filename);
    if (fs.existsSync(filledPath)) {
      const rawFilled = fs.readFileSync(filledPath, 'utf8');
      const filledValidation = validateSvg(rawFilled);
      if (filledValidation.isValid) {
        const filledInner = extractInnerSvg(sanitizeSvgMarkup(rawFilled));
        if (filledInner && filledInner.length > 10) {
          variants.push({
            id: `${cand.id}-filled`,
            style: 'filled',
            label: 'Filled',
            svg: filledInner,
            viewBox,
            capabilities: filledCapabilities,
            supportsStroke: false,
            supportsColor: true,
            defaultStrokeWidth: 0,
            qualityStatus: 'validated',
          });
        }
      }
    }

    // Build rich search tags and aliases
    const tagSet = new Set<string>([
      cand.id,
      ...cand.id.split('-'),
      canonicalCat.slug,
      canonicalCat.name.toLowerCase(),
      ...cand.tags,
    ]);

    const sourceAttribution: IconSource = {
      id: 'tabler',
      name: 'Tabler Icons',
      version: tablerPkg.version || '3.46.0',
      sourcePath: `@tabler/icons/icons/outline/${cand.filename}`,
      license: 'MIT',
    };

    const newIcon: Icon = {
      id: cand.id,
      name: toTitleCase(cand.id),
      slug: cand.id,
      category: canonicalCat.name,
      primaryCategory: canonicalCat.slug,
      secondaryCategories: [],
      style: 'regular',
      variants,
      svg: innerSvg,
      viewBox,
      capabilities: regularCapabilities,
      tags: Array.from(tagSet).filter((t) => t.length > 1),
      keywords: Array.from(tagSet),
      aliases: cand.id.includes('-') ? [cand.id.replace(/-/g, ' ')] : [],
      relatedIconIds: [],
      source: sourceAttribution,
      qualityScore: 100,
    };

    newCuratedIcons.push(newIcon);
    existingIds.add(cand.id);
    existingSlugs.add(cand.id);
    existingNames.add(newIcon.name.toLowerCase());
  }

  // Combine baseline + curated expansion
  const finalCatalog: Icon[] = [...baselineCatalog, ...newCuratedIcons];

  // Build bidirectional related icon links
  console.log('\n🔗 Computing related icon graphs across full catalog...');
  const categoryGroups = new Map<string, Icon[]>();
  for (const icon of finalCatalog) {
    const cat = icon.primaryCategory || 'other';
    if (!categoryGroups.has(cat)) categoryGroups.set(cat, []);
    categoryGroups.get(cat)!.push(icon);
  }

  for (const icon of finalCatalog) {
    const catIcons = categoryGroups.get(icon.primaryCategory || 'other') || [];
    const related = catIcons
      .filter((i) => i.id !== icon.id)
      .slice(0, 6)
      .map((i) => i.id);
    icon.relatedIconIds = related;
  }

  // Save expanded catalog
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(finalCatalog, null, 2), 'utf8');

  console.log(`\n--- IMPORT & CURATION BREAKDOWN ---`);
  console.log(`Primary Source (Iconoir):       ${baselineCatalog.length} icons (MIT)`);
  console.log(`Secondary Source (Tabler):      ${newCuratedIcons.length} icons (MIT)`);
  console.log(`Direct Duplicates Filtered:     ${directDuplicates}`);
  console.log(`Noise / Niche Assets Filtered:  ${rejectedNoise}`);
  console.log(`Invalid SVGs Filtered:          ${invalidSvgCount}`);
  console.log(`Total Unique Approved Concepts: ${finalCatalog.length.toLocaleString()}`);

  return {
    baselineCount: baselineCatalog.length,
    addedCount: newCuratedIcons.length,
    finalTotal: finalCatalog.length,
    directDuplicates,
    rejectedNoise,
    invalidSvgCount,
  };
}

if (process.argv[1]?.includes('expand-catalog-2000')) {
  runExpansion();
}
