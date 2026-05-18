import { useEffect, useMemo } from 'react';
import { S } from '../styles.js';

// --- Data ---

const SERIES = [
  { label: '5000 — SS Gearbox',             code: '5000', pnPrefix: '5' },
  { label: '4000A — Alum. Bearing Housing', code: '4000A', pnPrefix: '4A' },
  { label: '4000B — Alum. Gearbox',         code: '4000B', pnPrefix: '4B' },
  { label: '3000 — Steel Gearbox',           code: '3000', pnPrefix: '3' },
];

const FLANGE_BY_SERIES = { 200: ['F1','F2'], 300: ['F1','F2'], 400: ['F2'], 500: ['F1'], 600: [] };

const COVER_TYPES = [
  { label: 'Standard',                        code: '10' },
  { label: 'Drain in Cover',                  code: '11' },
  { label: 'High Pressure',                   code: '12', hp: true },
  { label: 'Port in Cover',                   code: '13' },
  { label: 'HP with Port',                    code: '14', hp: true },
  { label: 'Jacketed',                        code: '15' },
  { label: 'FoodFirst HP w/ Dual Handles',    code: '16', ff: true, hp: true },
  { label: 'FoodFirst w/ Dual Handles',       code: '17', ff: true },
  { label: 'FoodFirst HP w/o Handles',        code: '18', ff: true, hp: true },
  { label: 'FoodFirst w/o Handles',           code: '19', ff: true },
  { label: 'Vented — Integral RV',            code: '20' },
  { label: 'Vented #46 Style — Integral RV', code: '21' },
  { label: 'Swing Arm',                       code: '22' },
];

const ROTOR_HOUSINGS = [
  { label: 'Standard Sanitary', code: '10' },
  { label: 'Plugged Outlet',    code: '11' },
  { label: 'Jacketed',         code: '15' },
];

const CONNECTION_TYPES = [
  { label: 'Tri-Clamp',        code: 'P' },
  { label: 'ACME Thread',      code: 'L' },
  { label: 'NPT Male',         code: 'KM' },
  { label: 'NPT Female',       code: 'KF' },
  { label: 'DIN',              code: 'D' },
  { label: 'DIN Flange',       code: 'DF' },
  { label: 'ANSI Flange 150#', code: 'AF' },
  { label: 'SMS',              code: 'SMS' },
  { label: 'Aseptic Union',    code: 'AS' },
];

const CONNECTION_SIZES = [
  { label: '3/8"', code: '037' },
  { label: '1/2"', code: '05' },
  { label: '3/4"', code: '07' },
  { label: '1.0"', code: '10' },
  { label: '1.5"', code: '15' },
  { label: '2.0"', code: '20' },
  { label: '2.5"', code: '25' },
  { label: '3.0"', code: '30' },
  { label: '4.0"', code: '40' },
  { label: '6.0"', code: '60' },
  { label: '8.0"', code: '80' },
];

// Single source of truth for all rotor options.
// cls: rotor class from sizing (null = no class restriction).
// allowsSuffix: L or HC material grade suffix valid for this rotor (SS metal only).
// hp: High Pressure variant — requires HP cover.
// ff: FoodFirst only — requires FoodFirst cover (16–19).
const ROTOR_CODES = [
  // N60 SS (Non-Galling) — Class C
  { code:'80',  cls:'C', label:'80 — Class C, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  { code:'90',  cls:'C', label:'90 — Class C, N60 SS, non-galling, Tri-Lobe',     group:'metal', allowsSuffix:true },
  { code:'85',  cls:'C', label:'85 — Class C, N60 SS, non-galling, Bi-Lobe HP',   group:'metal', allowsSuffix:true, hp:true },
  // N60 SS — Class D
  { code:'81',  cls:'D', label:'81 — Class D, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  { code:'91',  cls:'D', label:'91 — Class D, N60 SS, non-galling, Tri-Lobe',     group:'metal', allowsSuffix:true },
  { code:'86',  cls:'D', label:'86 — Class D, N60 SS, non-galling, Bi-Lobe HP',   group:'metal', allowsSuffix:true, hp:true },
  // N60 SS — Class E
  { code:'82',  cls:'E', label:'82 — Class E, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  { code:'92',  cls:'E', label:'92 — Class E, N60 SS, non-galling, Tri-Lobe',     group:'metal', allowsSuffix:true },
  { code:'87',  cls:'E', label:'87 — Class E, N60 SS, non-galling, Bi-Lobe HP',   group:'metal', allowsSuffix:true, hp:true },
  // N60 SS — Class F
  { code:'83',  cls:'F', label:'83 — Class F, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  { code:'93',  cls:'F', label:'93 — Class F, N60 SS, non-galling, Tri-Lobe',     group:'metal', allowsSuffix:true },
  { code:'87F', cls:'F', label:'87F — Class F, N60 SS, non-galling, Bi-Lobe HP',  group:'metal', allowsSuffix:true, hp:true },
  // N60 SS — Class G
  { code:'84',  cls:'G', label:'84 — Class G, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  // 316L SS — Class C
  { code:'60',  cls:'C', label:'60 — Class C, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  { code:'40',  cls:'C', label:'40 — Class C, 316L SS, Tri-Lobe',                 group:'metal', allowsSuffix:true },
  { code:'65',  cls:'C', label:'65 — Class C, 316L SS, Bi-Lobe HP',               group:'metal', allowsSuffix:true, hp:true },
  // 316L SS — Class D
  { code:'61',  cls:'D', label:'61 — Class D, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  { code:'41',  cls:'D', label:'41 — Class D, 316L SS, Tri-Lobe',                 group:'metal', allowsSuffix:true },
  { code:'66',  cls:'D', label:'66 — Class D, 316L SS, Bi-Lobe HP',               group:'metal', allowsSuffix:true, hp:true },
  // 316L SS — Class E
  { code:'62',  cls:'E', label:'62 — Class E, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  { code:'42',  cls:'E', label:'42 — Class E, 316L SS, Tri-Lobe',                 group:'metal', allowsSuffix:true },
  { code:'67',  cls:'E', label:'67 — Class E, 316L SS, Bi-Lobe HP',               group:'metal', allowsSuffix:true, hp:true },
  // 316L SS — Class F
  { code:'63',  cls:'F', label:'63 — Class F, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  { code:'43',  cls:'F', label:'43 — Class F, 316L SS, Tri-Lobe',                 group:'metal', allowsSuffix:true },
  // 316L SS — Class G
  { code:'64',  cls:'G', label:'64 — Class G, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  // Alloy 88 SS
  { code:'88',  cls:'B', label:'88 — Class B, Alloy 88 SS',                       group:'metal', allowsSuffix:false },
  { code:'89',  cls:'C', label:'89 — Class C, Alloy 88 SS',                       group:'metal', allowsSuffix:false },
  // Polymer — Class A
  { code:'25',  cls:'A', label:'25 — Class A, Hydex, Bi-Lobe',                    group:'polymer', allowsSuffix:false },
  { code:'27',  cls:'A', label:'27 — Class A, Hydex, Tri-Lobe',                   group:'polymer', allowsSuffix:false },
  { code:'23',  cls:'A', label:'23 — Class A, Metal Det. Hydex',                  group:'polymer', allowsSuffix:false },
  { code:'50',  cls:'A', label:'50 — Class A, PEEK',                               group:'polymer', allowsSuffix:false },
  { code:'70',  cls:'A', label:'70 — Class A, PTFE',                               group:'polymer', allowsSuffix:false },
  { code:'72',  cls:'A', label:'72 — Class A, PTFE/SS',                            group:'polymer', allowsSuffix:false },
  { code:'52',  cls:'A', label:'52 — Class A, PolyFlex Acetal MD',                group:'polymer', allowsSuffix:false },
  // Polymer — Class B
  { code:'26',  cls:'B', label:'26 — Class B, Hydex, Bi-Lobe',                    group:'polymer', allowsSuffix:false },
  { code:'28',  cls:'B', label:'28 — Class B, Hydex, Tri-Lobe',                   group:'polymer', allowsSuffix:false },
  { code:'24',  cls:'B', label:'24 — Class B, Metal Det. Hydex',                  group:'polymer', allowsSuffix:false },
  { code:'51',  cls:'B', label:'51 — Class B, PEEK',                               group:'polymer', allowsSuffix:false },
  { code:'71',  cls:'B', label:'71 — Class B, PTFE',                               group:'polymer', allowsSuffix:false },
  { code:'73',  cls:'B', label:'73 — Class B, PTFE/SS',                            group:'polymer', allowsSuffix:false },
  // DuraCore (no class restriction)
  { code:'30',  cls:null, label:'30 — DuraCore (PTFE/SS/PTFE)',                    group:'polymer', allowsSuffix:false },
  { code:'32',  cls:null, label:'32 — DuraCore MD',                               group:'polymer', allowsSuffix:false },
  { code:'34',  cls:null, label:'34 — DuraCore HP',                               group:'polymer', allowsSuffix:false, hp:true },
  { code:'36',  cls:null, label:'36 — DuraCore HP MD',                            group:'polymer', allowsSuffix:false, hp:true },
  // FoodFirst — N60 SS only, requires FoodFirst cover (16–19)
  { code:'95',  cls:null, label:'95 — FoodFirst, N60 SS',                         group:'metal', allowsSuffix:false, ff:true },
  { code:'96',  cls:'E',  label:'96 — FoodFirst HP, Class E, N60 SS',             group:'metal', allowsSuffix:false, ff:true, hp:true },
  { code:'96F', cls:'F',  label:'96F — FoodFirst HP, Class F, N60 SS',            group:'metal', allowsSuffix:false, ff:true, hp:true },
  { code:'94',  cls:'F',  label:'94 — FoodFirst HP Tri-Lobe, Class F, N60 SS',   group:'metal', allowsSuffix:false, ff:true, hp:true },
];

const SHAFT_OPTS = [
  { label: 'Metal — Standard',              code: '10', drive: 'std',       metal: true  },
  { label: 'Metal — Hardened Seal Area',    code: '11', drive: 'std',       metal: true,  series200300: true },
  { label: 'Metal — Hardened Wear Sleeve',  code: '12', drive: 'std',       metal: true,  hardened: true },
  { label: 'Metal — Standard Wear Sleeve',  code: '13', drive: 'std',       metal: true  },
  { label: 'Non-Metal — Standard',          code: '15', drive: 'std',       metal: false },
  { label: 'Non-Metal — Hardened Seal Area',code: '16', drive: 'std',       metal: false, hardened: true },
  { label: 'Non-Metal — Hardened Sleeve',   code: '17', drive: 'std',       metal: false, hardened: true },
  { label: 'Non-Metal — Standard Sleeve',   code: '18', drive: 'std',       metal: false },
  { label: 'Charlynn + Metal — Standard',           code: '20', drive: 'charlynn', metal: true  },
  { label: 'Charlynn + Metal — Hardened Seal Area', code: '21', drive: 'charlynn', metal: true,  hardened: true },
  { label: 'Charlynn + Metal — Hardened Sleeve',    code: '22', drive: 'charlynn', metal: true,  hardened: true },
  { label: 'Charlynn + Metal — Standard Sleeve',    code: '23', drive: 'charlynn', metal: true  },
  { label: 'Charlynn + Non-Metal — Standard',       code: '25', drive: 'charlynn', metal: false },
  { label: 'Charlynn + Non-Metal — Hardened Seal',  code: '26', drive: 'charlynn', metal: false, hardened: true },
  { label: 'Charlynn + Non-Metal — Hardened Sleeve',code: '27', drive: 'charlynn', metal: false, hardened: true },
  { label: 'Charlynn + Non-Metal — Std Sleeve',     code: '28', drive: 'charlynn', metal: false },
  { label: 'Danfoss + Metal — Standard',            code: '30', drive: 'danfoss',  metal: true  },
  { label: 'Danfoss + Metal — Hardened Seal Area',  code: '31', drive: 'danfoss',  metal: true,  hardened: true },
  { label: 'Danfoss + Metal — Hardened Sleeve',     code: '32', drive: 'danfoss',  metal: true,  hardened: true },
  { label: 'Danfoss + Metal — Standard Sleeve',     code: '33', drive: 'danfoss',  metal: true  },
  { label: 'Danfoss + Non-Metal — Standard',        code: '35', drive: 'danfoss',  metal: false },
  { label: 'Danfoss + Non-Metal — Hardened Seal',   code: '36', drive: 'danfoss',  metal: false, hardened: true },
  { label: 'Danfoss + Non-Metal — Hardened Sleeve', code: '37', drive: 'danfoss',  metal: false, hardened: true },
  { label: 'Danfoss + Non-Metal — Std Sleeve',      code: '38', drive: 'danfoss',  metal: false },
];

const SEALS = [
  { label: 'Single Mech — Carbon / SS',          code: '10',   group: 'Single Mech', r200: true },
  { label: 'Single Mech — Carbon / TC',          code: '11a',  group: 'Single Mech' },
  { label: 'Single Mech — Carbon / SiC',         code: '11b',  group: 'Single Mech' },
  { label: 'Single Mech — SiC / TC',             code: '12a',  group: 'Single Mech', r200: true },
  { label: 'Single Mech — SiC / SiC',            code: '12b',  group: 'Single Mech', r200: true },
  { label: 'Single Mech — TC / TC',              code: '13',   group: 'Single Mech', r200: true },
  { label: 'Single Mech — C/SS + Flush',         code: '40',   group: 'Single Mech Flush' },
  { label: 'Single Mech — C/TC + Flush',         code: '41a',  group: 'Single Mech Flush' },
  { label: 'Single Mech — C/SiC + Flush',        code: '41b',  group: 'Single Mech Flush' },
  { label: 'Single Mech — SiC/TC + Flush',       code: '42a',  group: 'Single Mech Flush' },
  { label: 'Single Mech — SiC/SiC + Flush',      code: '42b',  group: 'Single Mech Flush' },
  { label: 'Double Mech — C/SS + C/TC',          code: '30',   group: 'Double Mech' },
  { label: 'Double Mech — SiC/TC + C/TC',        code: '31',   group: 'Double Mech' },
  { label: 'Double Mech — SiC/SiC + C/TC',       code: '32',   group: 'Double Mech' },
  { label: 'Double Mech — TC/TC',                code: '33',   group: 'Double Mech' },
  { label: 'O-LIP Seal, Double',                 code: '70',   group: 'O-LIP', needsHardened: true },
  { label: 'O-LIP Seal, Double, Front Load',     code: '70FL', group: 'O-LIP', needsHardened: true },
  { label: 'O-LIP Seal, Flushed',                code: '71',   group: 'O-LIP', needsHardened: true },
  { label: 'O-LIP Seal, Triple',                 code: '72',   group: 'O-LIP', needsHardened: true },
  { label: 'Single O-Ring',                      code: '60',   group: 'O-Ring', needsHardened: true },
  { label: 'Double O-Ring',                      code: '61',   group: 'O-Ring', needsHardened: true },
  { label: 'Double O-Ring, Front Load',          code: '61FL', group: 'O-Ring', needsHardened: true },
  { label: 'Gland Packing PTFE',                 code: '50',   group: 'Gland Packing' },
  { label: 'Gland Packing + Lantern Ring',       code: '51',   group: 'Gland Packing' },
];

const ELASTOMERS = [
  { label: 'Viton (V)',                  code: 'V' },
  { label: 'EPDM (E)',                   code: 'E' },
  { label: 'EPDM USP Class VI (EUSP)',   code: 'EUSP' },
  { label: 'Viton USP Class VI (VUSP)',  code: 'VUSP' },
  { label: 'Buna N (N)',                 code: 'N' },
  { label: 'Silicone (S)',               code: 'S' },
  { label: 'FFKM (K)',                   code: 'K' },
  { label: 'Teflon Encapsulated Viton',  code: 'TV' },
];

const DRIVE_TYPES = [
  { label: 'Direct Drive',              code: 'Direct Drive',              driveGroup: 'std' },
  { label: 'Compac® FMS',               code: 'Compac® FMS',               driveGroup: 'std' },
  { label: 'Gearbox',                   code: 'Gearbox',                   driveGroup: 'std' },
  { label: 'VFD Ready',                 code: 'VFD Ready',                 driveGroup: 'std' },
  { label: 'Air Motor',                 code: 'Air Motor',                 driveGroup: 'std' },
  { label: 'Hydraulic Motor — Charlynn',code: 'Hydraulic Motor — Charlynn',driveGroup: 'charlynn' },
  { label: 'Hydraulic Motor — Danfoss', code: 'Hydraulic Motor — Danfoss', driveGroup: 'danfoss' },
];

// --- Helpers ---

function pumpModelSeries(pumpName) {
  const n = parseInt((pumpName.match(/\d+/) || ['0'])[0]);
  if (n < 300) return 200;
  if (n < 400) return 300;
  if (n < 500) return 400;
  if (n < 600) return 500;
  return 600;
}

function driveGroup(driveCode) {
  return DRIVE_TYPES.find(d => d.code === driveCode)?.driveGroup || 'std';
}

function defaultShaft(dGroup, isMetal, needsHardened) {
  if (dGroup === 'charlynn') return isMetal ? (needsHardened ? '22' : '20') : (needsHardened ? '27' : '25');
  if (dGroup === 'danfoss')  return isMetal ? (needsHardened ? '32' : '30') : (needsHardened ? '37' : '35');
  return isMetal ? (needsHardened ? '12' : '10') : (needsHardened ? '17' : '15');
}

function buildPN(cfg, pump, cls, isGear) {
  const ser = SERIES.find(s => s.code === cfg.series);
  const modelNum = (pump.name.match(/\d+/) || ['???'])[0];
  const A = ser ? `${ser.pnPrefix}${modelNum}${cfg.flangeMount||''}` : '???';
  const E = `${cfg.connectionType||'??'}${cfg.connectionSize||'??'}${cfg.portOrientation||'H'}`;
  const matSuffix = cfg.materialGrade === 'Low Ferrite' ? 'L' : cfg.materialGrade === 'Hastelloy C' ? 'HC' : '';
  const selRotor = ROTOR_CODES.find(r => r.code === cfg.rotorCode);
  const C = `${cfg.coverType||'??'}${matSuffix}`;
  const D = `${cfg.rotorHousing||'??'}${matSuffix}`;
  const F = isGear ? '—' : `${cfg.rotorCode||'??'}${selRotor?.allowsSuffix ? matSuffix : ''}`;
  const G = `${cfg.shaft||'??'}${matSuffix}${cfg.driveOrientation||'T'}`;
  return `UNIBLOC-PD ${A}-${C}-${D}-${E}-${F}-${G}-${cfg.seal||'??'}-${cfg.elastomer||'??'}`;
}

// --- Sub-components ---

function Field({ label, children }) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}

function Sel({ value, onChange, opts }) {
  return (
    <select style={S.input} value={value} onChange={e => onChange(e.target.value)}>
      {opts.map(o => <option key={o.code} value={o.code}>{o.label}</option>)}
    </select>
  );
}

function Toggle({ value, onChange, opts }) {
  return (
    <div style={S.toggleGroup}>
      {opts.map(o => (
        <button key={o.code} style={S.toggle(value === o.code)} onClick={() => onChange(o.code)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{fontSize:10, fontWeight:800, color:'var(--steel)', textTransform:'uppercase',
                 letterSpacing:'0.1em', marginBottom:8}}>
      {children}
    </div>
  );
}

// --- Main Component ---

export default function ConfigurePage({ sizing, config, setConfig, projectName, setProjectName, onConfirm, onBack }) {
  if (!sizing) return (
    <div style={{...S.card, textAlign:'center', padding:40}}>
      <div style={{fontSize:13, color:'var(--gray)', marginBottom:12}}>Please complete pump sizing first.</div>
      <button style={S.btn('outline')} onClick={onBack}>← Back to Sizing</button>
    </div>
  );

  const pump   = sizing.pump;
  const cls    = sizing.cls;
  const isGear = sizing.isGear;
  const modelSeries = pumpModelSeries(pump.name);

  const set = (k, v) => setConfig(c => ({...c, [k]: v}));

  // Derived values from selected rotor code
  const selRotor = ROTOR_CODES.find(r => r.code === config.rotorCode);
  const isMetal  = selRotor ? selRotor.group === 'metal' : true;
  const isHP     = selRotor?.hp || false;

  // Derived booleans from other config values
  const isLF       = config.materialGrade === 'Low Ferrite';
  const isHC       = config.materialGrade === 'Hastelloy C';
  const matSuffix  = isLF ? 'L' : isHC ? 'HC' : '';
  const selCover   = COVER_TYPES.find(c => c.code === config.coverType) || {};
  const isFF       = selCover.ff || false;
  const isHPCover  = selCover.hp || false;
  const selSeal    = SEALS.find(s => s.code === config.seal) || {};
  const needsHardened = selSeal.needsHardened || false;
  const dGroup     = driveGroup(config.drive);

  // fCode shown in Section F header (base code + material suffix if applicable)
  const fCode = isGear ? '—' : `${config.rotorCode||'??'}${selRotor?.allowsSuffix ? matSuffix : ''}`;

  // --- Filtered option lists (silent filtering per Section 3) ---

  const availCovers = useMemo(() => COVER_TYPES.filter(ct => {
    if (modelSeries === 200 && (ct.hp || ct.ff)) return false;
    if (modelSeries === 300 && ct.hp) return false;
    if (isHP && !ct.hp) return false;
    if (!isHP && ct.hp && !ct.ff) return false;
    return true;
  }), [modelSeries, isHP]);

  const availHousings = useMemo(() =>
    ROTOR_HOUSINGS.filter(h => !(modelSeries === 200 && h.code === '15'))
  , [modelSeries]);

  const availSeals = useMemo(() =>
    SEALS.filter(s => !(modelSeries === 200 && s.r200))
  , [modelSeries]);

  const availShafts = useMemo(() => SHAFT_OPTS.filter(s => {
    if (s.drive !== dGroup) return false;
    if (isMetal && !s.metal) return false;
    if (!isMetal && s.metal) return false;
    if (s.series200300 && modelSeries !== 200 && modelSeries !== 300) return false;
    return true;
  }), [dGroup, isMetal, modelSeries]);

  const availFlange = useMemo(() => FLANGE_BY_SERIES[modelSeries] || [], [modelSeries]);

  // Rotor dropdown: filter by class and FoodFirst cover
  const availRotors = useMemo(() => {
    if (isFF) return ROTOR_CODES.filter(r => r.ff && (r.cls === cls || r.cls === null));
    return ROTOR_CODES.filter(r => !r.ff && (r.cls === cls || r.cls === null));
  }, [cls, isFF]);

  // --- Dependency effects ---

  // 3.3 — HP rotor ↔ HP cover enforcement
  useEffect(() => {
    if (isHP && !isHPCover) set('coverType', '12');
    if (!isHP && isHPCover && !isFF) set('coverType', '10');
  }, [config.rotorCode]);

  // 3.7 — FoodFirst cover → reset rotor if no longer in available list
  useEffect(() => {
    const still = availRotors.find(r => r.code === config.rotorCode);
    if (!still && availRotors.length > 0) set('rotorCode', availRotors[0].code);
  }, [config.coverType]);

  // 3.2b — Seal type → auto-switch shaft to hardened
  useEffect(() => {
    const curShaft = SHAFT_OPTS.find(s => s.code === config.shaft);
    if (needsHardened && curShaft && !curShaft.hardened) {
      set('shaft', defaultShaft(dGroup, isMetal, true));
    }
  }, [config.seal]);

  // 3.2 + 3.2a — Rotor or drive change → reset shaft if now invalid
  useEffect(() => {
    const still = availShafts.find(s => s.code === config.shaft);
    if (!still) set('shaft', defaultShaft(dGroup, isMetal, needsHardened));
  }, [config.rotorCode, config.drive]);

  // Keep cover valid if model series changes
  useEffect(() => {
    const still = availCovers.find(c => c.code === config.coverType);
    if (!still) set('coverType', '10');
  }, [modelSeries]);

  // Keep housing valid if model series changes
  useEffect(() => {
    const still = availHousings.find(h => h.code === config.rotorHousing);
    if (!still) set('rotorHousing', '10');
  }, [modelSeries]);

  const partialPN = buildPN(config, pump, cls, isGear);
  const jacketedMismatch = config.rotorHousing === '15' && config.coverType !== '15';

  return (
    <div style={{maxWidth:720, margin:'0 auto'}}>

      {/* PN Preview */}
      <div style={{background:'var(--charcoal)', borderRadius:8, padding:'10px 14px', marginBottom:8}}>
        <div style={{fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4}}>
          Part Number Preview
        </div>
        <div style={{fontFamily:'DM Mono,monospace', fontSize:12, color:'white', wordBreak:'break-all', letterSpacing:'0.04em'}}>
          {partialPN}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>
          Configure Pump
          <span style={S.pill('steel')}>{pump.name} — Class {cls}</span>
        </div>

        <div style={{marginBottom:14}}>
          <label style={S.label}>Project / Job Name</label>
          <input style={S.input} placeholder="e.g. Dairy Line 3 — Feed Pump"
            value={projectName} onChange={e => setProjectName(e.target.value)}/>
        </div>

        <div style={S.divider}/>

        {/* A — Series */}
        <div style={{marginBottom:14}}>
          <SectionHeader>A — Series</SectionHeader>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:8}}>
            <Field label="Gearbox Series">
              <Sel value={config.series} onChange={v => set('series', v)} opts={SERIES}/>
            </Field>
            {availFlange.length > 0 && (
              <Field label="Flange Mount">
                <Sel value={config.flangeMount||''}
                  onChange={v => set('flangeMount', v)}
                  opts={[{label:'None',code:''}, ...availFlange.map(f => ({label:f==='F1'?'F1 — Direct Mount':'F2 — Flex Mount', code:f}))]}/>
              </Field>
            )}
          </div>
          <Field label="Material Grade">
            <Toggle value={config.materialGrade||'Standard'}
              onChange={v => set('materialGrade', v)}
              opts={[
                {label:'Standard',        code:'Standard'},
                {label:'Low Ferrite (L)', code:'Low Ferrite'},
                {label:'Hastelloy C (HC)',code:'Hastelloy C'},
              ]}/>
          </Field>
          {(isLF || isHC) && (
            <div style={{marginTop:6, padding:'7px 10px', background:'#fef3c7', border:'1px solid #f59e0b', borderRadius:4, fontSize:12, color:'#92400e'}}>
              <span style={{fontWeight:700}}>Custom Material — {isHC ? 'HC' : 'L'} suffix</span> applied to positions C, D, F, G
            </div>
          )}
        </div>

        <div style={S.divider}/>

        {/* C — Cover Type */}
        <div style={{marginBottom:14}}>
          <SectionHeader>C — Cover Type</SectionHeader>
          <Field label="Cover Type">
            <Sel value={config.coverType} onChange={v => set('coverType', v)} opts={availCovers}/>
          </Field>
          {jacketedMismatch && (
            <div style={{...S.warn, marginTop:6, padding:'7px 10px'}}>
              Jacketed housing selected — consider also selecting Jacketed cover for a fully jacketed pump.
            </div>
          )}
        </div>

        <div style={S.divider}/>

        {/* D — Rotor Housing */}
        <div style={{marginBottom:14}}>
          <SectionHeader>D — Rotor Housing</SectionHeader>
          <Field label="Rotor Housing">
            <Sel value={config.rotorHousing} onChange={v => set('rotorHousing', v)} opts={availHousings}/>
          </Field>
        </div>

        <div style={S.divider}/>

        {/* E — Connection */}
        <div style={{marginBottom:14}}>
          <SectionHeader>E — Connection</SectionHeader>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:8}}>
            <Field label="Connection Type">
              <Sel value={config.connectionType} onChange={v => set('connectionType', v)} opts={CONNECTION_TYPES}/>
            </Field>
            <Field label="Connection Size">
              <Sel value={config.connectionSize} onChange={v => set('connectionSize', v)} opts={CONNECTION_SIZES}/>
            </Field>
          </div>
          <Field label="Port Orientation">
            <Toggle value={config.portOrientation||'H'} onChange={v => set('portOrientation', v)}
              opts={[{label:'Horizontal (H)',code:'H'},{label:'Vertical (V)',code:'V'}]}/>
          </Field>
        </div>

        <div style={S.divider}/>

        {/* F — Rotor */}
        <div style={{marginBottom:14}}>
          <SectionHeader>
            F — Rotor Type
            {fCode !== '??' && (
              <span style={{...S.pill('steel'), marginLeft:8, verticalAlign:'middle'}}>
                Code: {fCode}
              </span>
            )}
          </SectionHeader>
          {isGear ? (
            <div style={{fontSize:12, color:'var(--gray)'}}>Gear pump — rotor type fixed.</div>
          ) : (
            <Field label="Rotor">
              <Sel value={config.rotorCode||''} onChange={v => set('rotorCode', v)}
                opts={availRotors.map(r => ({code:r.code, label:r.label}))}/>
            </Field>
          )}
        </div>

        <div style={S.divider}/>

        {/* G — Shaft & Drive */}
        <div style={{marginBottom:14}}>
          <SectionHeader>G — Shaft &amp; Drive</SectionHeader>
          <div style={{fontSize:12, color:'var(--gray)', marginBottom:8}}>
            Drive Type: <span style={{fontWeight:600, color:'var(--charcoal)'}}>{config.drive || 'Direct Drive'}</span>
            <span style={{marginLeft:6, fontSize:11, fontStyle:'italic'}}>(set on Sizing page)</span>
          </div>
          <div style={{marginBottom:8}}>
            <Field label="Shaft Type">
              <Sel value={config.shaft} onChange={v => set('shaft', v)} opts={availShafts}/>
            </Field>
          </div>
          <Field label="Drive Shaft Orientation">
            <Toggle value={config.driveOrientation||'T'} onChange={v => set('driveOrientation', v)}
              opts={[{label:'Top (T)',code:'T'},{label:'Bottom (B)',code:'B'}]}/>
          </Field>
        </div>

        <div style={S.divider}/>

        {/* H — Shaft Seal */}
        <div style={{marginBottom:14}}>
          <SectionHeader>H — Shaft Seal</SectionHeader>
          <Field label="Seal Type">
            <Sel value={config.seal} onChange={v => set('seal', v)} opts={availSeals}/>
          </Field>
          {needsHardened && (
            <div style={{fontSize:11, color:'var(--steel)', marginTop:5}}>
              O-Ring / O-LIP seal requires hardened shaft or sleeve variant.
            </div>
          )}
        </div>

        <div style={S.divider}/>

        {/* J — Elastomer */}
        <div style={{marginBottom:14}}>
          <SectionHeader>J — Elastomer</SectionHeader>
          <Field label="Elastomer Material">
            <Sel value={config.elastomer} onChange={v => set('elastomer', v)} opts={ELASTOMERS}/>
          </Field>
        </div>

        <div style={S.divider}/>

        <div style={{display:'flex', gap:8}}>
          <button style={{...S.btn('outline'), flex:1}} onClick={onBack}>← Back to Sizing</button>
          <button style={{...S.btn('primary'), flex:2}} onClick={onConfirm}>✓ Confirm &amp; Generate Datasheet</button>
        </div>
      </div>
    </div>
  );
}
