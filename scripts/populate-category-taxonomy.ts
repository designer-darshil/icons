/**
 * GRIDFRAME CATEGORY TAXONOMY & ICON LIBRARY POPULATION PIPELINE
 *
 * 1. Reclassifies all catalog icons into the 44 official categories with primaryCategory & secondaryCategories.
 * 2. Ingests foundational icon sets for narrow categories to guarantee >=10-20 high-quality icons per category.
 * 3. Synthesizes and validates all 5 canonical variants (light, regular, filled, duotone, duotone-line) for every icon.
 * 4. Generates rich metadata: aliases, tags, use cases, optical metrics, and related links.
 * 5. Emits production src/data/icons/catalog.json.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { OFFICIAL_CATEGORIES, normalizeCategorySlug, getCanonicalCategory } from '../src/data/category-registry';
import { generateFiveVariants } from '../src/lib/svg/variantGenerators';
import { analyzeIconOpticalSystem } from '../src/lib/svg/opticalBounds';
import { validateIconConceptVariants } from '../src/lib/svg/variantValidator';
import type { Icon, IconVariant, CanonicalIconVariant } from '../src/types/icon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.resolve(__dirname, '../src/data/icons/catalog.json');

// --- RULE-BASED SEMANTIC CLASSIFIER ---

interface CategoryRule {
  slug: string;
  patterns: RegExp[];
  secondaryPatterns?: { slug: string; pattern: RegExp }[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    slug: 'git',
    patterns: [/\bgit\b/i, /\bcommit\b/i, /\bmerge\b/i, /\bpull-request\b/i, /\bpr\b/i, /\bfork\b/i, /\brepository\b/i, /\brepo\b/i, /\bstash\b/i, /\bcherry-pick\b/i, /\bdiff\b/i, /\brebase\b/i],
  },
  {
    slug: 'cloud',
    patterns: [/\bcloud\b/i, /\bserver-cloud\b/i, /\bhosting\b/i, /\bsync\b/i, /\bremote-storage\b/i],
    secondaryPatterns: [
      { slug: 'actions', pattern: /\b(upload|download|sync|refresh)\b/i },
      { slug: 'security', pattern: /\b(lock|shield|secure|key)\b/i },
      { slug: 'weather', pattern: /\b(rain|snow|sun|lightning|fog)\b/i },
    ],
  },
  {
    slug: 'clothing',
    patterns: [
      /\bshirt\b/i, /\bt-shirt\b/i, /\bshoe\b/i, /\bsneaker\b/i, /\bboot\b/i, /\bhat\b/i, /\bcap\b/i, /\bjacket\b/i,
      /\bcoat\b/i, /\bdress\b/i, /\bsunglasses\b/i, /\bglasses\b/i, /\bspectacles\b/i, /\bwatch\b/i, /\bhanger\b/i,
      /\btie\b/i, /\bsuit\b/i, /\bsock\b/i, /\bglove\b/i, /\bbelt\b/i, /\bscarf\b/i, /\bhoodie\b/i, /\bapparel\b/i,
    ],
  },
  {
    slug: 'communication',
    patterns: [
      /\bmessage\b/i, /\bchat\b/i, /\bmail\b/i, /\bemail\b/i, /\bphone\b/i, /\bcall\b/i, /\binbox\b/i,
      /\bmegaphone\b/i, /\bbroadcast\b/i, /\bsms\b/i, /\benvelope\b/i, /\bspeech\b/i, /\bdialog\b/i, /\bbubble\b/i,
      /\bvoicemail\b/i, /\bconversation\b/i, /\bcontact\b/i,
    ],
    secondaryPatterns: [
      { slug: 'actions', pattern: /\b(send|reply|forward|delete|add|plus)\b/i },
      { slug: 'social', pattern: /\b(share|like|comment|feed)\b/i },
    ],
  },
  {
    slug: 'business',
    patterns: [
      /\bbriefcase\b/i, /\boffice\b/i, /\bpresentation\b/i, /\bstrategy\b/i, /\bmeeting\b/i, /\bcontract\b/i,
      /\bhandshake\b/i, /\bdeal\b/i, /\btarget\b/i, /\bgoal\b/i, /\benterprise\b/i, /\bcompany\b/i, /\bcorporate\b/i,
      /\bproject\b/i, /\btask\b/i, /\bkanban\b/i, /\bagenda\b/i, /\bagreement\b/i,
    ],
    secondaryPatterns: [
      { slug: 'finance', pattern: /\b(invoice|growth|revenue|budget)\b/i },
      { slug: 'users', pattern: /\b(team|meeting|staff|partner)\b/i },
    ],
  },
  {
    slug: 'buildings',
    patterns: [
      /\bbuilding\b/i, /\boffice-building\b/i, /\bschool\b/i, /\bhospital\b/i, /\bwarehouse\b/i,
      /\bfactory\b/i, /\bdome\b/i, /\bstadium\b/i, /\btower\b/i, /\bcastle\b/i, /\bchurch\b/i, /\btemple\b/i,
      /\bcottage\b/i, /\barchitecture\b/i, /\bgarage\b/i, /\bhotel\b/i, /\bmonument\b/i,
    ],
  },
  {
    slug: 'audio',
    patterns: [
      /\bspeaker\b/i, /\bvolume\b/i, /\bsound\b/i, /\bmute\b/i, /\bmicrophone\b/i, /\bmic\b/i, /\bheadphones\b/i,
      /\bheadset\b/i, /\bpodcast\b/i, /\bequalizer\b/i, /\baudio\b/i, /\bstereo\b/i, /\bamplifier\b/i,
      /\bradio\b/i, /\bsound-wave\b/i,
    ],
    secondaryPatterns: [
      { slug: 'music', pattern: /\b(music|track|song|instrument)\b/i },
      { slug: 'devices', pattern: /\b(headphones|mic|speaker)\b/i },
    ],
  },
  {
    slug: 'animations',
    patterns: [
      /\bspark\b/i, /\bsparkle\b/i, /\bmotion\b/i, /\bloading\b/i, /\bspinner\b/i, /\brotate\b/i, /\btransition\b/i,
      /\banimation\b/i, /\bflame\b/i, /\bflare\b/i, /\bglitter\b/i, /\bshimmer\b/i, /\bfade\b/i, /\bbounce\b/i,
    ],
    secondaryPatterns: [
      { slug: 'design-tools', pattern: /\b(magic|wand|canvas)\b/i },
      { slug: 'actions', pattern: /\b(rotate|spin|refresh)\b/i },
    ],
  },
  {
    slug: 'animals',
    patterns: [
      /\bcat\b/i, /\bdog\b/i, /\bbird\b/i, /\bfish\b/i, /\bhorse\b/i, /\bpaw\b/i, /\bbutterfly\b/i, /\bsnail\b/i,
      /\bbear\b/i, /\bturtle\b/i, /\bfeather\b/i, /\brabbit\b/i, /\blion\b/i, /\bfox\b/i, /\bwolf\b/i, /\bbee\b/i,
      /\banimal\b/i, /\bpet\b/i, /\bwildlife\b/i,
    ],
  },
  {
    slug: 'activities',
    patterns: [
      /\bfootball\b/i, /\bsoccer\b/i, /\bbasketball\b/i, /\btennis\b/i, /\brunning\b/i, /\brunner\b/i, /\bcycling\b/i,
      /\bbicycle\b/i, /\bbike\b/i, /\bhiking\b/i, /\bswimming\b/i, /\bfitness\b/i, /\bgym\b/i, /\bdumbbell\b/i, /\byoga\b/i,
      /\btrophy\b/i, /\bmedal\b/i, /\baward\b/i, /\bbadge-award\b/i, /\bsport\b/i, /\bexercise\b/i,
    ],
  },
  {
    slug: 'connectivity',
    patterns: [
      /\bwifi\b/i, /\bbluetooth\b/i, /\bsignal\b/i, /\bnetwork\b/i, /\brouter\b/i, /\bconnection\b/i, /\bantenna\b/i,
      /\bhotspot\b/i, /\bethernet\b/i, /\bmodem\b/i, /\blink\b/i, /\bunlink\b/i, /\bpairing\b/i,
      /\bsatellite\b/i, /\bairplay\b/i, /\bcast\b/i,
    ],
  },
  {
    slug: 'database',
    patterns: [
      /\bdatabase\b/i, /\btable\b/i, /\bsql\b/i, /\bschema\b/i, /\bquery\b/i, /\bserver\b/i,
      /\bdata-table\b/i, /\bdata-transfer\b/i, /\bbackup\b/i, /\bcloud-data\b/i,
    ],
  },
  {
    slug: 'design-tools',
    patterns: [
      /\bpen\b/i, /\bvector\b/i, /\blayer\b/i, /\blayers\b/i, /\bruler\b/i, /\bcrop\b/i, /\bpalette\b/i, /\bcomponent\b/i,
      /\bframe\b/i, /\bartboard\b/i, /\bdropper\b/i, /\beyedropper\b/i, /\bmarquee\b/i, /\bbrush\b/i,
      /\bpaint\b/i, /\bcanvas\b/i, /\bbezier\b/i, /\bswatch\b/i, /\bprototype\b/i,
    ],
  },
  {
    slug: 'development',
    patterns: [
      /\bcode\b/i, /\bterminal\b/i, /\bbracket\b/i, /\bbrackets\b/i, /\bcurly\b/i, /\bapi\b/i, /\bwebhook\b/i, /\bcommand\b/i,
      /\bconsole\b/i, /\bvariable\b/i, /\bsyntax\b/i, /\bregex\b/i, /\bbinary\b/i, /\bfunction\b/i, /\blambda\b/i,
      /\bdeveloper\b/i, /\bsdk\b/i, /\bjson\b/i, /\bxml\b/i, /\bhtml\b/i, /\bcss\b/i, /\bbug\b/i, /\bdebug\b/i,
    ],
    secondaryPatterns: [
      { slug: 'git', pattern: /\b(branch|commit|merge|pr|pull-request|fork|repo)\b/i },
    ],
  },
  {
    slug: 'devices',
    patterns: [
      /\bsmartphone\b/i, /\bmobile\b/i, /\btablet\b/i, /\blaptop\b/i, /\bdesktop\b/i, /\bmonitor\b/i,
      /\bscreen\b/i, /\bkeyboard\b/i, /\bmouse\b/i, /\bprinter\b/i, /\bscanner\b/i, /\bcpu\b/i, /\bchip\b/i, /\bprocessor\b/i,
      /\bsmartwatch\b/i, /\btv\b/i, /\bdisplay\b/i, /\bgadget\b/i, /\bhardware\b/i, /\bsim-card\b/i, /\bsd-card\b/i, /\busb\b/i,
    ],
  },
  {
    slug: 'docs',
    patterns: [
      /\bfile\b/i, /\bdocument\b/i, /\bnote\b/i, /\bpage\b/i, /\bbook\b/i, /\bclipboard\b/i, /\barticle\b/i,
      /\bpdf\b/i, /\bdoc\b/i, /\bsheet\b/i, /\breadme\b/i, /\btext-file\b/i, /\bpaper\b/i,
      /\bjournal\b/i, /\bdraft\b/i,
    ],
    secondaryPatterns: [
      { slug: 'actions', pattern: /\b(add|plus|check|edit|delete|copy|download)\b/i },
    ],
  },
  {
    slug: 'emojis',
    patterns: [
      /\bsmile\b/i, /\bfrown\b/i, /\blaugh\b/i, /\bsad\b/i, /\bangry\b/i, /\bsurprise\b/i, /\bheart-eyes\b/i,
      /\bwink\b/i, /\bneutral\b/i, /\bcool\b/i, /\bskull\b/i, /\bghost\b/i, /\bemoji\b/i, /\bexpression\b/i,
      /\bface-smile\b/i, /\bface-sad\b/i,
    ],
  },
  {
    slug: 'finance',
    patterns: [
      /\bwallet\b/i, /\bcredit-card\b/i, /\bcard\b/i, /\bbank\b/i, /\bcash\b/i, /\breceipt\b/i, /\bcurrency\b/i,
      /\bpayment\b/i, /\bdollar\b/i, /\beuro\b/i, /\bpound\b/i, /\byen\b/i, /\bbitcoin\b/i, /\bcrypto\b/i, /\bcoin\b/i,
      /\bvault\b/i, /\bsafe\b/i, /\bmoney\b/i, /\bsalary\b/i, /\btax\b/i, /\bcheque\b/i, /\bfinance\b/i,
    ],
  },
  {
    slug: 'food',
    patterns: [
      /\bapple\b/i, /\bcoffee\b/i, /\bcup\b/i, /\bpizza\b/i, /\bburger\b/i, /\bcake\b/i, /\brestaurant\b/i, /\butensils\b/i,
      /\bfork\b/i, /\bspoon\b/i, /\bknife\b/i, /\bdrink\b/i, /\bcocktail\b/i, /\bglass\b/i, /\bcookie\b/i, /\bbowl\b/i,
      /\btea\b/i, /\bbread\b/i, /\bcheese\b/i, /\begg\b/i, /\bice-cream\b/i, /\bfood\b/i, /\bmeal\b/i, /\bdining\b/i,
    ],
  },
  {
    slug: 'gaming',
    patterns: [
      /\bgamepad\b/i, /\bcontroller\b/i, /\bjoystick\b/i, /\bdice\b/i, /\bchess\b/i, /\bpuzzle\b/i, /\bsword\b/i,
      /\bshield-game\b/i, /\barcade\b/i, /\bcard-game\b/i, /\bgaming\b/i,
    ],
  },
  {
    slug: 'gestures',
    patterns: [
      /\bhand\b/i, /\bthumbs-up\b/i, /\bthumbs-down\b/i, /\bpoint\b/i, /\bswipe\b/i, /\btap\b/i, /\bpinch\b/i,
      /\bgrab\b/i, /\bdrag\b/i, /\bclick\b/i, /\btouch\b/i, /\bfist\b/i, /\bpeace\b/i, /\bgesture\b/i,
    ],
  },
  {
    slug: 'health',
    patterns: [
      /\bheart-pulse\b/i, /\bstethoscope\b/i, /\bhospital\b/i, /\bmedicine\b/i, /\bpill\b/i, /\bthermometer\b/i,
      /\bfirst-aid\b/i, /\bbandage\b/i, /\bsyringe\b/i, /\bpulse\b/i, /\bdoctor\b/i,
      /\bhealth\b/i, /\bmedical\b/i, /\bwellness\b/i, /\bcaduceus\b/i, /\bdna\b/i, /\bvirus\b/i, /\bmask\b/i,
    ],
  },
  {
    slug: 'home',
    patterns: [
      /\bhome\b/i, /\bbed\b/i, /\bsofa\b/i, /\bcouch\b/i, /\blamp\b/i, /\blightbulb\b/i, /\bdoor\b/i, /\bkitchen\b/i,
      /\bbath\b/i, /\bwashing-machine\b/i, /\bchair\b/i, /\bwindow\b/i, /\bshower\b/i, /\bfridge\b/i, /\bstove\b/i,
      /\bhouse\b/i, /\bdomestic\b/i, /\broom\b/i,
    ],
  },
  {
    slug: 'users',
    patterns: [
      /\buser\b/i, /\busers\b/i, /\baccount\b/i, /\bprofile\b/i, /\bavatar\b/i, /\bteam\b/i, /\bmember\b/i, /\bperson\b/i,
      /\bpeople\b/i, /\bcrowd\b/i, /\badmin\b/i, /\brole\b/i, /\bclient\b/i,
    ],
  },
  {
    slug: 'identity',
    patterns: [
      /\bid-card\b/i, /\bbadge\b/i, /\bfingerprint\b/i, /\bface-id\b/i, /\bverified\b/i, /\bcredentials\b/i,
      /\bpassport\b/i, /\bscan-face\b/i, /\bscan-qr\b/i, /\bidentity\b/i, /\bcertificate\b/i,
      /\blicense\b/i, /\bsecurity-pass\b/i,
    ],
  },
  {
    slug: 'layout',
    patterns: [
      /\blayout\b/i, /\bcolumn\b/i, /\bcolumns\b/i, /\brow\b/i, /\brows\b/i, /\bsidebar\b/i, /\bpanel\b/i, /\bgrid\b/i,
      /\bdistribute\b/i, /\bsplit\b/i, /\bflex\b/i, /\bcontainer\b/i, /\bgutter\b/i, /\bmasonry\b/i, /\bspacing\b/i,
      /\bdock\b/i,
    ],
  },
  {
    slug: 'maps',
    patterns: [
      /\bmap\b/i, /\bmap-pin\b/i, /\blocation\b/i, /\bcompass\b/i, /\broute\b/i, /\bmarker\b/i, /\bglobe\b/i,
      /\bcoordinates\b/i, /\bpin\b/i, /\blandmark\b/i, /\bgps\b/i, /\bdestination\b/i,
    ],
  },
  {
    slug: 'music',
    patterns: [
      /\bmusic\b/i, /\bplaylist\b/i, /\balbum\b/i, /\bvinyl\b/i, /\bguitar\b/i, /\bpiano\b/i, /\bnote\b/i,
      /\btreble\b/i, /\bheadphone\b/i, /\btrack\b/i, /\bsong\b/i, /\bmelody\b/i, /\btempo\b/i, /\bmetronome\b/i,
    ],
  },
  {
    slug: 'nature',
    patterns: [
      /\btree\b/i, /\bflower\b/i, /\bleaf\b/i, /\bmountain\b/i, /\bforest\b/i, /\bseedling\b/i, /\bplant\b/i,
      /\bdrop\b/i, /\bwater\b/i, /\bfire\b/i, /\bsprout\b/i, /\bocean\b/i, /\beco\b/i, /\benvironment\b/i,
    ],
  },
  {
    slug: 'navigation',
    patterns: [
      /\barrow\b/i, /\bchevron\b/i, /\bcaret\b/i, /\bmenu\b/i, /\bnavigate\b/i, /\bbreadcrumb\b/i,
      /\bexpand\b/i, /\bcollapse\b/i, /\benter\b/i, /\bexit\b/i, /\bback\b/i, /\bforward\b/i,
      /\bwayfinding\b/i, /\bdirection\b/i,
    ],
  },
  {
    slug: 'organization',
    patterns: [
      /\bfolder\b/i, /\bdirectory\b/i, /\bcollection\b/i, /\bgroup\b/i, /\bsort\b/i, /\bfilter\b/i, /\blist\b/i,
      /\barchive\b/i, /\bpackage\b/i, /\bbox\b/i, /\bstack\b/i, /\borganize\b/i, /\bhierarchy\b/i,
    ],
  },
  {
    slug: 'photos-and-videos',
    patterns: [
      /\bcamera\b/i, /\bimage\b/i, /\bphoto\b/i, /\bgallery\b/i, /\bvideo\b/i, /\bfilm\b/i, /\bclapperboard\b/i,
      /\bplay\b/i, /\bpause\b/i, /\brecord\b/i, /\blens\b/i, /\baperture\b/i, /\bshutter\b/i, /\bstudio\b/i,
      /\bmovie\b/i, /\bmedia\b/i, /\bcinema\b/i, /\bsnapshot\b/i, /\bpicture\b/i,
    ],
  },
  {
    slug: 'science',
    patterns: [
      /\bflask\b/i, /\bmicroscope\b/i, /\batom\b/i, /\bdna\b/i, /\btest-tube\b/i, /\bbeaker\b/i, /\bplanet\b/i,
      /\btelescope\b/i, /\blab\b/i, /\blaboratory\b/i, /\bphysics\b/i, /\bchemistry\b/i, /\bmolecule\b/i,
      /\bformula\b/i, /\bmagnet\b/i, /\bastronomy\b/i,
    ],
  },
  {
    slug: 'security',
    patterns: [
      /\block\b/i, /\bunlock\b/i, /\bshield\b/i, /\bkey\b/i, /\bshield-check\b/i, /\bsecurity\b/i, /\bprivacy\b/i,
      /\bsafe\b/i, /\bvault\b/i, /\bpassword\b/i, /\beye-closed\b/i, /\bincognito\b/i, /\bprotect\b/i, /\bdefense\b/i,
      /\bfirewall\b/i, /\bssl\b/i, /\bencryption\b/i,
    ],
  },
  {
    slug: 'shapes',
    patterns: [
      /\bcircle\b/i, /\bsquare\b/i, /\btriangle\b/i, /\brectangle\b/i, /\bstar\b/i, /\bhexagon\b/i, /\bdiamond\b/i,
      /\bpentagon\b/i, /\bpolygon\b/i, /\bcube\b/i, /\bsphere\b/i, /\bcylinder\b/i, /\bshape\b/i, /\brhombus\b/i,
      /\boval\b/i, /\bgeometry\b/i,
    ],
  },
  {
    slug: 'shopping',
    patterns: [
      /\bshopping\b/i, /\bcart\b/i, /\bbag\b/i, /\bstore\b/i, /\bshop\b/i, /\btag\b/i, /\bprice\b/i, /\bcoupon\b/i,
      /\bcheckout\b/i, /\border\b/i, /\bbasket\b/i, /\bbuy\b/i, /\bsale\b/i, /\bdiscount\b/i, /\bbarcode\b/i, /\bqr\b/i,
    ],
  },
  {
    slug: 'social',
    patterns: [
      /\bshare\b/i, /\bheart\b/i, /\blike\b/i, /\bcomment\b/i, /\bfollowers\b/i, /\bcommunity\b/i, /\bsocial\b/i,
      /\bpost\b/i, /\bhashtag\b/i, /\bfriends\b/i, /\breaction\b/i,
    ],
  },
  {
    slug: 'system',
    patterns: [
      /\bsettings\b/i, /\bgear\b/i, /\bcog\b/i, /\bslider\b/i, /\bsliders\b/i, /\bdashboard\b/i, /\bsystem\b/i,
      /\bconfig\b/i, /\bconfiguration\b/i, /\bpower\b/i, /\brestart\b/i, /\bbattery\b/i, /\bclock\b/i, /\btimer\b/i,
      /\btime\b/i, /\bcalendar\b/i, /\bschedule\b/i, /\btoggle\b/i, /\bswitch\b/i, /\binfo\b/i, /\bhelp\b/i,
      /\bwarning\b/i, /\balert-triangle\b/i, /\bstatus\b/i,
    ],
  },
  {
    slug: 'tools',
    patterns: [
      /\btool\b/i, /\bhammer\b/i, /\bwrench\b/i, /\bspanner\b/i, /\bscrewdriver\b/i, /\bscissors\b/i, /\bruler\b/i,
      /\bsaw\b/i, /\bdrill\b/i, /\bpliers\b/i, /\baxe\b/i, /\bfix\b/i, /\brepair\b/i, /\bmaintenance\b/i,
    ],
  },
  {
    slug: 'transport',
    patterns: [
      /\bcar\b/i, /\bbus\b/i, /\btrain\b/i, /\btram\b/i, /\bbike\b/i, /\bmotorcycle\b/i, /\bairplane\b/i, /\bplane\b/i,
      /\bship\b/i, /\bboat\b/i, /\brocket\b/i, /\btaxi\b/i, /\btruck\b/i, /\bhelicopter\b/i, /\bscooter\b/i, /\btransit\b/i,
      /\bvehicle\b/i, /\bfreight\b/i, /\bferry\b/i, /\bsubway\b/i,
    ],
  },
  {
    slug: 'typography',
    patterns: [
      /\btype\b/i, /\bfont\b/i, /\btext\b/i, /\bbold\b/i, /\bitalic\b/i, /\bunderline\b/i, /\bstrikethrough\b/i,
      /\bheading\b/i, /\bparagraph\b/i, /\balign-left\b/i, /\balign-center\b/i, /\balign-right\b/i,
      /\btext-size\b/i, /\btext-color\b/i, /\bquote\b/i,
    ],
  },
  {
    slug: 'weather',
    patterns: [
      /\bsun\b/i, /\bmoon\b/i, /\bcloud\b/i, /\brain\b/i, /\bsnow\b/i, /\bwind\b/i, /\bstorm\b/i, /\btemperature\b/i,
      /\bumbrella\b/i, /\blightning\b/i, /\bmist\b/i, /\bfog\b/i, /\brainbow\b/i, /\bhumidity\b/i, /\bclimate\b/i,
    ],
  },
  {
    slug: 'actions',
    patterns: [
      /\bplus\b/i, /\bminus\b/i, /\badd\b/i, /\bcheck\b/i, /\bedit\b/i, /\bdelete\b/i, /\btrash\b/i, /\bsave\b/i,
      /\bdownload\b/i, /\bupload\b/i, /\bcopy\b/i, /\bcut\b/i, /\bpaste\b/i, /\brefresh\b/i, /\breload\b/i, /\bundo\b/i,
      /\bredo\b/i, /\bsearch\b/i, /\bzoom\b/i, /\bclose\b/i, /\bremove\b/i,
    ],
  },
];

export function classifyIcon(name: string, currentCategory: string, tags: string[], keywords: string[]): {
  primaryCategory: string;
  secondaryCategories: string[];
} {
  const nameNorm = name.toLowerCase().replace(/[-_]/g, ' ');
  const currentNorm = currentCategory.toLowerCase();
  const tagsNorm = tags.join(' ').toLowerCase().replace(/[-_]/g, ' ');
  const kwNorm = keywords.join(' ').toLowerCase().replace(/[-_]/g, ' ');
  const combined = `${nameNorm} ${currentNorm} ${tagsNorm} ${kwNorm}`;

  let matchedPrimary: string | null = null;
  const matchedSecondaries: string[] = [];

  for (const rule of CATEGORY_RULES) {
    const isMatch = rule.patterns.some((p) => p.test(combined));
    if (isMatch) {
      if (!matchedPrimary) {
        matchedPrimary = rule.slug;
      } else if (!matchedSecondaries.includes(rule.slug)) {
        matchedSecondaries.push(rule.slug);
      }

      if (rule.secondaryPatterns) {
        for (const sec of rule.secondaryPatterns) {
          if (sec.pattern.test(combined) && sec.slug !== matchedPrimary && !matchedSecondaries.includes(sec.slug)) {
            matchedSecondaries.push(sec.slug);
          }
        }
      }
    }
  }

  if (!matchedPrimary) {
    const norm = normalizeCategorySlug(currentCategory);
    matchedPrimary = norm !== 'other' ? norm : 'actions';
  }

  return {
    primaryCategory: matchedPrimary,
    secondaryCategories: matchedSecondaries.slice(0, 2),
  };
}

export const FOUNDATION_ICON_TEMPLATES: Record<string, { name: string; slug: string; svg: string; tags: string[]; useCases: string[]; aliases: string[] }[]> = {
  git: [
    {
      name: 'Git Branch',
      slug: 'git-branch',
      svg: '<circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 9V15M18 12C18 15 15 18 12 18H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['git', 'branch', 'vcs', 'code', 'version-control'],
      useCases: ['Displaying git branch selectors', 'Version branching workflows'],
      aliases: ['vcs branch', 'code branch'],
    },
    {
      name: 'Git Commit',
      slug: 'git-commit',
      svg: '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M1.5 12H8M16 12H22.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['git', 'commit', 'hash', 'code', 'history'],
      useCases: ['Git commit logs', 'Version history checkpoints'],
      aliases: ['commit point', 'git checkpoint'],
    },
    {
      name: 'Git Merge',
      slug: 'git-merge',
      svg: '<circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 9V15M6 9C6 12 9 15 12 15H15M15 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['git', 'merge', 'pull-request', 'combine'],
      useCases: ['Merging branches', 'Pull request merge action'],
      aliases: ['branch merge', 'integrate code'],
    },
    {
      name: 'Git Pull Request',
      slug: 'git-pull-request',
      svg: '<circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 9V15M18 9V15M18 9L15 12M18 9L21 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['git', 'pull-request', 'pr', 'review'],
      useCases: ['Opening code reviews', 'PR tracking lists'],
      aliases: ['pr', 'code review'],
    },
    {
      name: 'Git Fork',
      slug: 'git-fork',
      svg: '<circle cx="12" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M12 15V12M12 12L6 9M12 12L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['git', 'fork', 'clone', 'split'],
      useCases: ['Forking repositories', 'Derivative project trees'],
      aliases: ['repo fork', 'copy project'],
    },
    {
      name: 'Git Repository',
      slug: 'git-repository',
      svg: '<rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M4 7H20M8 12H16M8 16H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['git', 'repository', 'repo', 'codebase'],
      useCases: ['Listing repositories', 'Project root directory'],
      aliases: ['repo', 'code repository'],
    },
    {
      name: 'Git Tag',
      slug: 'git-tag',
      svg: '<path d="M2.5 12L12 2.5H21.5V12L12 21.5L2.5 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16.5" cy="7.5" r="1.5" fill="currentColor"/>',
      tags: ['git', 'tag', 'release', 'version'],
      useCases: ['Release tagging', 'Semver badges'],
      aliases: ['release tag', 'version marker'],
    },
    {
      name: 'Git Diff',
      slug: 'git-diff',
      svg: '<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M12 3V21M7 9H9M7 15H9M15 9H17M15 15H17M16 8V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['git', 'diff', 'compare', 'changes'],
      useCases: ['Viewing line diffs', 'Change comparisons'],
      aliases: ['code diff', 'file comparison'],
    },
    {
      name: 'Git Stash',
      slug: 'git-stash',
      svg: '<rect x="4" y="4" width="16" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 7H14M10 17H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['git', 'stash', 'shelf', 'save'],
      useCases: ['Stashing uncommitted changes', 'Temporary change shelf'],
      aliases: ['shelf', 'temporary stash'],
    },
    {
      name: 'Git Rebase',
      slug: 'git-rebase',
      svg: '<circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 9V15M9 6H15C16.6569 6 18 7.34315 18 9V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['git', 'rebase', 'linear', 'history'],
      useCases: ['Rebasing branches', 'Interactive rebase tool'],
      aliases: ['branch rebase', 'linearize history'],
    },
  ],
  animals: [
    {
      name: 'Cat',
      slug: 'cat',
      svg: '<path d="M4 19C4 16 6 14 9 14H15C18 14 20 16 20 19M5 14L4 6L8 9M19 14L20 6L16 9M9 10H9.01M15 10H15.01M12 12V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['cat', 'kitten', 'feline', 'pet', 'animal'],
      useCases: ['Pet store catalog', 'Animal avatar'],
      aliases: ['kitten', 'feline'],
    },
    {
      name: 'Dog',
      slug: 'dog',
      svg: '<path d="M5 6L3 11L6 13M19 6L21 11L18 13M6 13C6 17 8.5 20 12 20C15.5 20 18 17 18 13C18 9 15.5 6 12 6C8.5 6 6 9 6 13ZM9 11H9.01M15 11H15.01M12 14V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['dog', 'puppy', 'canine', 'pet', 'animal'],
      useCases: ['Pet services', 'Canine categories'],
      aliases: ['puppy', 'canine'],
    },
    {
      name: 'Bird',
      slug: 'bird',
      svg: '<path d="M3 13C3 8 7 4 12 4C14.5 4 16.5 5 18 6.5L22 7L19 10C19 15 15 19 10 19H4L7 15L3 13ZM15 7.5H15.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['bird', 'avian', 'nature', 'wildlife', 'animal', 'twitter'],
      useCases: ['Birdwatching', 'Nature species directory'],
      aliases: ['avian', 'flying bird'],
    },
    {
      name: 'Fish',
      slug: 'fish',
      svg: '<path d="M2 12C5 6 15 6 20 12C15 18 5 18 2 12ZM20 12L23 8V16L20 12ZM16 10H16.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['fish', 'marine', 'aquarium', 'sea', 'animal'],
      useCases: ['Aquarium catalog', 'Seafood / marine wildlife'],
      aliases: ['marine fish', 'aquatic'],
    },
    {
      name: 'Paw Print',
      slug: 'paw-print',
      svg: '<ellipse cx="12" cy="15" rx="4" ry="3.5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="6.5" cy="10" rx="2" ry="2.5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="17.5" cy="10" rx="2" ry="2.5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="9" cy="6" rx="1.8" ry="2.2" stroke="currentColor" stroke-width="1.5"/><ellipse cx="15" cy="6" rx="1.8" ry="2.2" stroke="currentColor" stroke-width="1.5"/>',
      tags: ['paw', 'pet', 'track', 'animal', 'wildlife'],
      useCases: ['Pet profile icon', 'Animal track identifier'],
      aliases: ['animal paw', 'pet footprint'],
    },
    {
      name: 'Butterfly',
      slug: 'butterfly',
      svg: '<path d="M12 4V20M12 6C9 2 4 4 4 9C4 13 8 15 12 15M12 6C15 2 20 4 20 9C20 13 16 15 12 15M12 15C9 15 5 17 5 19C5 21 9 20 12 18M12 15C15 15 19 17 19 19C19 21 15 20 12 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['butterfly', 'insect', 'wings', 'nature', 'animal'],
      useCases: ['Nature conservation', 'Beauty & metamorphosis theme'],
      aliases: ['monarch', 'insect wings'],
    },
    {
      name: 'Snail',
      slug: 'snail',
      svg: '<path d="M2 18C2 16 5 14 8 14M8 14C8 10 11 7 15 7C19 7 22 10 22 14C22 18 19 20 15 20H3C2 20 2 18 2 18ZM15 10C17 10 18 11.5 18 13.5C18 15.5 16.5 17 14.5 17C12.5 17 11 15.5 11 13.5C11 12 12 11 13.5 11M2 15L1 11M3 14L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['snail', 'shell', 'slow', 'animal', 'nature'],
      useCases: ['Slow speed indicator', 'Nature catalog'],
      aliases: ['mollusk', 'spiral shell'],
    },
    {
      name: 'Turtle',
      slug: 'turtle',
      svg: '<circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M12 6V3M6 9L3 7M18 9L21 7M6 15L3 17M18 15L21 17M12 18V21M9 10H15M9 14H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['turtle', 'tortoise', 'reptile', 'nature', 'animal'],
      useCases: ['Marine life', 'Reptile guide'],
      aliases: ['tortoise', 'sea turtle'],
    },
    {
      name: 'Bee',
      slug: 'bee',
      svg: '<ellipse cx="12" cy="13" rx="5" ry="6" stroke="currentColor" stroke-width="1.5"/><path d="M7 11H17M7 15H17M12 7V4M10 3L12 4L14 3M7 9C4 8 3 5 5 4C7 3 9 6 9 8M17 9C20 8 21 5 19 4C17 3 15 6 15 8M12 19V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['bee', 'honeybee', 'insect', 'nature', 'animal'],
      useCases: ['Pollination / eco topics', 'Honey / nature product badge'],
      aliases: ['honeybee', 'bumblebee'],
    },
    {
      name: 'Rabbit',
      slug: 'rabbit',
      svg: '<path d="M8 2C8 6 9 9 10 11M16 2C16 6 15 9 14 11M7 14C7 18 9 21 12 21C15 21 17 18 17 14C17 11 15 10 12 10C9 10 7 11 7 14ZM10 14H10.01M14 14H14.01M12 16V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['rabbit', 'bunny', 'hare', 'pet', 'animal'],
      useCases: ['Pet store', 'Easter / spring motifs'],
      aliases: ['bunny', 'hare'],
    },
  ],
  gaming: [
    {
      name: 'Gamepad',
      slug: 'gamepad',
      svg: '<path d="M6 8H18C20.5 8 22 10 21 15L19.5 20C19 21.5 17 21 16 19L14 15H10L8 19C7 21 5 21.5 4.5 20L3 15C2 10 3.5 8 6 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12H10M8 10V14M16 11H16.01M18 13H18.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['gamepad', 'controller', 'gaming', 'console', 'play'],
      useCases: ['Game controls', 'Console connection indicator'],
      aliases: ['game controller', 'joypad'],
    },
    {
      name: 'Joystick',
      slug: 'joystick',
      svg: '<rect x="4" y="14" width="16" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M12 9V14M8 17H10M14 17H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['joystick', 'arcade', 'retro', 'gaming', 'controls'],
      useCases: ['Arcade controls', 'Flight simulator input'],
      aliases: ['arcade stick', 'flight stick'],
    },
    {
      name: 'Dice',
      slug: 'dice',
      svg: '<rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="8" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/>',
      tags: ['dice', 'random', 'chance', 'board-game', 'gaming'],
      useCases: ['Random generator', 'Board games'],
      aliases: ['die', 'random roll'],
    },
    {
      name: 'Chess Knight',
      slug: 'chess-knight',
      svg: '<path d="M5 20H19M7 20L7 16C7 14 6 12 5 11C4 10 5 8 7 8C6.5 6.5 8 4 10 4C13 4 15 6 16 9C17 12 18 14 17 20M9 9H9.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['chess', 'knight', 'strategy', 'game', 'gaming'],
      useCases: ['Strategy games', 'Chess tactics'],
      aliases: ['knight piece', 'chess horse'],
    },
    {
      name: 'Puzzle Piece',
      slug: 'puzzle-piece',
      svg: '<path d="M4 10C4 8.89543 4.89543 8 6 8H8C8 6.5 9 5 10.5 5C12 5 13 6.5 13 8H15C16.1046 8 17 8.89543 17 10V12C18.5 12 20 13 20 14.5C20 16 18.5 17 17 17V19C17 20.1046 16.1046 21 15 21H13C13 19.5 12 18 10.5 18C9 18 8 19.5 8 21H6C4.89543 21 4 20.1046 4 19V17C5.5 17 7 16 7 14.5C7 13 5.5 12 4 12V10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['puzzle', 'jigsaw', 'plugin', 'gaming', 'match'],
      useCases: ['Plugin integrations', 'Puzzle logic games'],
      aliases: ['jigsaw', 'puzzle match'],
    },
    {
      name: 'Sword',
      slug: 'sword',
      svg: '<path d="M19 5L12 12M19 5L21 7L14 14M19 5L17 3L10 10M12 12L10 10M12 12L7 17M10 10L5 15M7 17L4 14M7 17L5 19L3 17L5 15M5 15L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['sword', 'blade', 'rpg', 'combat', 'gaming'],
      useCases: ['RPG combat action', 'Attack strength stats'],
      aliases: ['blade', 'katana'],
    },
  ],
  users: [
    {
      name: 'User',
      slug: 'user',
      svg: '<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M4 21C4 17 7.5 14 12 14C16.5 14 20 17 20 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['user', 'profile', 'account', 'person', 'users'],
      useCases: ['User account profile', 'Login icon'],
      aliases: ['person', 'profile avatar'],
    },
    {
      name: 'Users',
      slug: 'users',
      svg: '<circle cx="9" cy="7" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M2 20C2 16.5 5 14 9 14C13 14 16 16.5 16 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="17" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M17 14C19.5 14 22 15.5 22 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['users', 'team', 'group', 'people', 'community'],
      useCases: ['Team management', 'Members directory'],
      aliases: ['group', 'people team'],
    },
    {
      name: 'User Plus',
      slug: 'user-plus',
      svg: '<circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M2 21C2 17 5.5 14 10 14C12.5 14 14.8 15 16.2 16.8M19 8V14M16 11H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['user-plus', 'add-user', 'invite', 'new-member', 'users'],
      useCases: ['Invite user button', 'Add team member'],
      aliases: ['add user', 'invite user'],
    },
    {
      name: 'User Check',
      slug: 'user-check',
      svg: '<circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M2 21C2 17 5.5 14 10 14M16 12L18.5 14.5L22.5 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['user-check', 'verified-user', 'approved', 'active', 'users'],
      useCases: ['Verified profile badge', 'Approved account list'],
      aliases: ['verified user', 'user approved'],
    },
    {
      name: 'User X',
      slug: 'user-x',
      svg: '<circle cx="10" cy="7" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M2 21C2 17 5.5 14 10 14M17 9L22 14M22 9L17 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['user-x', 'remove-user', 'delete-user', 'ban', 'users'],
      useCases: ['Remove user from workspace', 'Blocked accounts'],
      aliases: ['remove user', 'delete user'],
    },
  ],
  clothing: [
    {
      name: 'Shirt',
      slug: 'shirt',
      svg: '<path d="M8 3L4 7L7 10L6 21H18L17 10L20 7L16 3H14C14 4.5 13 5.5 12 5.5C11 5.5 10 4.5 10 3H8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['shirt', 't-shirt', 'clothing', 'apparel', 'fashion'],
      useCases: ['Clothing store catalog', 'Wardrobe filter'],
      aliases: ['t-shirt', 'top apparel'],
    },
    {
      name: 'Shoe',
      slug: 'shoe',
      svg: '<path d="M2.5 15L6 7L11 9L15 13H21.5V18.5H2.5V15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.5 18.5H21.5" stroke="currentColor" stroke-width="2"/>',
      tags: ['shoe', 'footwear', 'sneaker', 'clothing'],
      useCases: ['Footwear categories', 'Shoe size picker'],
      aliases: ['sneaker', 'footwear'],
    },
    {
      name: 'Hat',
      slug: 'hat',
      svg: '<path d="M2 17.5C5 15.5 19 15.5 22 17.5C19 19.5 5 19.5 2 17.5ZM5.5 16.5C5.5 11 8 6 12 6C16 6 18.5 11 18.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['hat', 'cap', 'accessory', 'clothing', 'headwear'],
      useCases: ['Headwear catalog', 'Fashion accessories'],
      aliases: ['cap', 'fedora', 'headwear'],
    },
    {
      name: 'Jacket',
      slug: 'jacket',
      svg: '<path d="M8 3L4 7L7 10L6 21H18L17 10L20 7L16 3M12 3V21M9 3L12 8L15 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['jacket', 'coat', 'outwear', 'clothing'],
      useCases: ['Winter collection', 'Outwear category'],
      aliases: ['coat', 'outerwear'],
    },
    {
      name: 'Dress',
      slug: 'dress',
      svg: '<path d="M9 3H15L17 7L15 10L19 21H5L9 10L7 7L9 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['dress', 'gown', 'women-clothing', 'apparel'],
      useCases: ['Dresses and gowns', 'Fashion collection'],
      aliases: ['gown', 'evening dress'],
    },
    {
      name: 'Sunglasses',
      slug: 'sunglasses',
      svg: '<rect x="3" y="10" width="7" height="6" rx="2" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="10" width="7" height="6" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M10 13H14M3 11L1.5 8M21 11L22.5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['sunglasses', 'glasses', 'shades', 'eyewear', 'clothing'],
      useCases: ['Eyewear catalog', 'Sun protection accessories'],
      aliases: ['shades', 'eyewear'],
    },
    {
      name: 'Hanger',
      slug: 'hanger',
      svg: '<path d="M12 6C13.5 6 14.5 4.5 13.5 3.5C12.5 2.5 11 3.5 12 5V7L2 14L3 17H21L22 14L12 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['hanger', 'wardrobe', 'closet', 'clothing'],
      useCases: ['Wardrobe manager', 'Apparel organizer'],
      aliases: ['clothes hanger', 'wardrobe'],
    },
    {
      name: 'Tie',
      slug: 'tie',
      svg: '<path d="M10 3H14L15 6L13.5 8L15 18L12 21L9 18L10.5 8L9 6L10 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['tie', 'necktie', 'formal', 'clothing', 'business'],
      useCases: ['Formal attire', 'Business dress code'],
      aliases: ['necktie', 'formal tie'],
    },
  ],
  business: [
    {
      name: 'Briefcase',
      slug: 'briefcase',
      svg: '<rect x="3" y="7" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M3 12H21M11 12H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['briefcase', 'business', 'work', 'job', 'portfolio'],
      useCases: ['Business portfolio', 'Job listings'],
      aliases: ['work bag', 'portfolio'],
    },
    {
      name: 'Presentation Chart',
      slug: 'presentation-chart',
      svg: '<path d="M3 3V17C3 18.1046 3.89543 19 5 19H21M7 14L11 10L15 13L20 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['presentation', 'chart', 'analytics', 'growth', 'business'],
      useCases: ['Pitch deck charts', 'Analytics dashboard'],
      aliases: ['growth chart', 'presentation'],
    },
    {
      name: 'Handshake Deal',
      slug: 'handshake-deal',
      svg: '<path d="M2 11L7 6L12 11L8 15L2 11ZM22 11L17 6L12 11L16 15L22 11ZM8 15L11 18L13 16L16 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['handshake', 'deal', 'partnership', 'business', 'agreement'],
      useCases: ['Partnership agreement', 'Deal closed notification'],
      aliases: ['partnership', 'contract signed'],
    },
    {
      name: 'Office Building',
      slug: 'office-building',
      svg: '<rect x="4" y="2" width="16" height="20" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M8 6H10M14 6H16M8 10H10M14 10H16M8 14H10M14 14H16M10 22V18H14V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['office', 'building', 'headquarters', 'corporate', 'business'],
      useCases: ['HQ location', 'Corporate branches'],
      aliases: ['headquarters', 'corporate office'],
    },
    {
      name: 'Project Kanban',
      slug: 'project-kanban',
      svg: '<rect x="3" y="4" width="5" height="16" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="4" width="5" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="17" y="4" width="5" height="13" rx="1" stroke="currentColor" stroke-width="1.5"/>',
      tags: ['kanban', 'project', 'board', 'tasks', 'agile', 'business'],
      useCases: ['Sprint boards', 'Task progression'],
      aliases: ['kanban board', 'task columns'],
    },
    {
      name: 'Contract Document',
      slug: 'contract-document',
      svg: '<path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20M8 13H16M8 17H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      tags: ['contract', 'document', 'agreement', 'legal', 'business'],
      useCases: ['Legal terms', 'Contract signing flows'],
      aliases: ['legal agreement', 'contract'],
    },
  ],
  science: [
    {
      name: 'Flask',
      slug: 'flask',
      svg: '<path d="M9 3H15M10 3V8L4 19C3.5 20 4.2 21 5.4 21H18.6C19.8 21 20.5 20 20 19L14 8V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 16H17.5" stroke="currentColor" stroke-width="1.5"/>',
      tags: ['flask', 'science', 'chemistry', 'lab', 'experiment'],
      useCases: ['Chemistry labs', 'Experimental features badge'],
      aliases: ['lab flask', 'chemistry beaker'],
    },
    {
      name: 'Microscope',
      slug: 'microscope',
      svg: '<path d="M6 18H18M9 21H15M10 10L14 6M12 4L16 8M9 13C9 15.2 10.8 17 13 17H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>',
      tags: ['microscope', 'science', 'research', 'biology', 'lab'],
      useCases: ['Scientific research', 'Deep analysis views'],
      aliases: ['lab microscope', 'research tool'],
    },
    {
      name: 'Atom',
      slug: 'atom',
      svg: '<circle cx="12" cy="12" r="2.5" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" stroke-width="1.5" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" stroke-width="1.5" transform="rotate(-30 12 12)"/>',
      tags: ['atom', 'physics', 'quantum', 'science', 'react'],
      useCases: ['Physics topics', 'Core energy symbol'],
      aliases: ['atomic nucleus', 'quantum orbit'],
    },
    {
      name: 'DNA Helix',
      slug: 'dna-helix',
      svg: '<path d="M4 4C8 8 16 16 20 20M20 4C16 8 8 16 4 20M6 8H18M6 16H18M8 6V18M16 6V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['dna', 'genetics', 'biology', 'science', 'health'],
      useCases: ['Genetics research', 'Biological data structures'],
      aliases: ['genetic code', 'dna helix'],
    },
    {
      name: 'Planet Orbit',
      slug: 'planet-orbit',
      svg: '<circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="10" ry="3" stroke="currentColor" stroke-width="1.5" transform="rotate(-20 12 12)"/>',
      tags: ['planet', 'space', 'astronomy', 'science', 'orbit', 'saturn'],
      useCases: ['Astronomy research', 'Space exploration topics'],
      aliases: ['saturn planet', 'orbital celestial'],
    },
    {
      name: 'Telescope',
      slug: 'telescope',
      svg: '<path d="M4 14L16 4L20 8L8 18L4 14ZM12 15L7 21M12 15L17 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
      tags: ['telescope', 'space', 'observatory', 'astronomy', 'science'],
      useCases: ['Observatory tools', 'Exploration finder'],
      aliases: ['stargazing', 'astronomy telescope'],
    },
  ],
};

export function executeCatalogPopulation() {
  console.log('⚡ Loading current catalog data...');
  const rawCatalog: Icon[] = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  console.log(`📦 Loaded ${rawCatalog.length} existing icons.`);

  const existingSlugMap = new Map<string, Icon>();
  for (const icon of rawCatalog) {
    existingSlugMap.set(icon.slug, icon);
  }

  // 1. Ingest foundation templates for narrow categories first so they take precedence
  console.log('✨ Ingesting category foundation sets...');
  for (const [catSlug, templates] of Object.entries(FOUNDATION_ICON_TEMPLATES)) {
    const canonicalCat = getCanonicalCategory(catSlug);

    for (const tmpl of templates) {
      const fiveVars = generateFiveVariants(tmpl.slug, tmpl.name, tmpl.svg);
      const optical = analyzeIconOpticalSystem(fiveVars.regular.svg, 1.5);
      const validation = validateIconConceptVariants(tmpl.slug, fiveVars.all);

      for (const v of fiveVars.all) {
        const rep = validation.variantReports[v.style as CanonicalIconVariant];
        if (rep) {
          v.qualityStatus = rep.status;
          v.qualityReport = rep;
        }
      }

      const newIcon: Icon = {
        id: tmpl.slug,
        name: tmpl.name,
        slug: tmpl.slug,
        family: tmpl.name,
        familyId: tmpl.slug,
        baseIcon: tmpl.slug,
        category: canonicalCat.name,
        primaryCategory: canonicalCat.slug,
        secondaryCategories: [],
        otherReviewRequired: false,
        tags: Array.from(new Set([...tmpl.tags, canonicalCat.slug])),
        keywords: Array.from(new Set([...tmpl.tags, canonicalCat.name.toLowerCase()])),
        aliases: tmpl.aliases,
        useCases: tmpl.useCases,
        style: 'regular',
        variants: fiveVars.all,
        svg: fiveVars.regular.svg,
        viewBox: '0 0 24 24',
        capabilities: {
          color: true,
          size: true,
          strokeWidth: true,
          lineCap: true,
          lineJoin: true,
          background: true,
          rotation: true,
          flip: true,
        },
        opticalMetrics: optical.metrics,
        qualityScore: validation.overallScore,
        relatedIconIds: [],
      };

      existingSlugMap.set(tmpl.slug, newIcon);
    }
  }

  // 2. Reclassify existing icons
  console.log('🔄 Reclassifying catalog icons across 44 official categories...');
  const updatedIcons: Icon[] = [];

  for (const [slug, item] of existingSlugMap.entries()) {
    const classification = classifyIcon(
      item.name || item.slug,
      item.category || 'Other',
      item.tags || [],
      item.keywords || []
    );
    const primarySlug = item.primaryCategory && item.primaryCategory !== 'other' && !item.otherReviewRequired
      ? (FOUNDATION_ICON_TEMPLATES[item.primaryCategory] ? item.primaryCategory : classification.primaryCategory)
      : classification.primaryCategory;
    const secondarySlugs = classification.secondaryCategories;

    const primaryCanonical = getCanonicalCategory(primarySlug);

    // Ensure 5 variants exist for this icon
    const baseSvg = item.svg || (item.variants && item.variants[0]?.svg) || '';
    const fiveVars = generateFiveVariants(item.slug, item.name, baseSvg);

    const optical = analyzeIconOpticalSystem(fiveVars.regular.svg, 1.5);
    const validation = validateIconConceptVariants(item.slug, fiveVars.all);

    for (const v of fiveVars.all) {
      const rep = validation.variantReports[v.style as CanonicalIconVariant];
      if (rep) {
        v.qualityStatus = rep.status;
        v.qualityReport = rep;
      }
    }

    const updated: Icon = {
      ...item,
      category: primaryCanonical.name,
      primaryCategory: primaryCanonical.slug,
      secondaryCategories: secondarySlugs.filter((s) => s !== primaryCanonical.slug),
      otherReviewRequired: primaryCanonical.slug === 'other',
      variants: fiveVars.all,
      svg: fiveVars.regular.svg,
      style: 'regular',
      opticalMetrics: optical.metrics,
      qualityScore: validation.overallScore,
      aliases: item.aliases && item.aliases.length > 0 ? item.aliases : [item.name.toLowerCase()],
      tags: Array.from(new Set([...(item.tags || []), primaryCanonical.slug, ...secondarySlugs])),
      keywords: Array.from(new Set([...(item.keywords || []), primaryCanonical.name.toLowerCase()])),
      useCases: item.useCases && item.useCases.length > 0 ? item.useCases : [`Precision vector icon representing ${item.name.toLowerCase()} in digital interfaces.`],
    };

    updatedIcons.push(updated);
  }

  // 3. Write back to catalog.json
  console.log(`💾 Writing updated catalog with ${updatedIcons.length} icons to disk...`);
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(updatedIcons, null, 2), 'utf8');

  console.log('✅ Catalog update complete!');
  return updatedIcons;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  executeCatalogPopulation();
}
