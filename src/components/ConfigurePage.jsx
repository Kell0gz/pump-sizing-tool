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

const ROTOR_MATERIALS = [
  { label: 'Non-Galling N60 SS',   code: 'N60',        group: 'metal' },
  { label: '316L SS (Legacy)',      code: '316L',       group: 'metal' },
  { label: 'Alloy 88 SS',          code: 'A88',        group: 'metal' },
  { label: 'Hydex',                code: 'Hydex',      group: 'polymer' },
  { label: 'Metal Det. Hydex',     code: 'MDHydex',    group: 'polymer' },
  { label: 'PEEK',                 code: 'PEEK',       group: 'polymer' },
  { label: 'PTFE',                 code: 'PTFE',       group: 'polymer' },
  { label: 'PTFE/SS',              code: 'PTFE-SS',    group: 'polymer' },
  { label: 'PolyFlex Acetal MD',   code: 'PolyFlex',   group: 'polymer' },
  { label: 'DuraCore',             code: 'DuraCore',   group: 'polymer' },
  { label: 'DuraCore MD',          code: 'DuraCoreHD', group: 'polymer' },
  { label: 'DuraCore HP',          code: 'DuraCoreHP', group: 'polymer' },
  { label: 'DuraCore HP MD',       code: 'DuraCoreHPMD', group: 'polymer' },
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

function resolveFCode(cls, mat, lobeStyle, isHP, isFF, isLF, isHC) {
  let code;
  if (mat === '316L') {
    if (isHP)                  code = ({C:65,D:66,E:67})[cls];
    else if (lobeStyle==='Tri-Lobe') code = ({C:40,D:41,E:42,F:43})[cls];
    else                       code = ({C:60,D:61,E:62,F:63,G:64})[cls];
    if (code != null && isLF) code = `${code}L`;
    if (code != null && isHC) code = `${code}HC`;
  } else if (mat === 'N60') {
    if (isFF) {
      if (isHP && lobeStyle==='Tri-Lobe' && cls==='F') code = 94;
      else if (isHP && cls==='E') code = 96;
      else if (isHP && cls==='F') code = '96F';
      else code = 95;
    } else if (isHP)                   code = ({C:85,D:86,E:87,F:'87F'})[cls];
    else if (lobeStyle==='Tri-Lobe')   code = ({C:90,D:91,E:92,F:93})[cls];
    else                               code = ({C:80,D:81,E:82,F:83,G:84})[cls];
    if (code != null && isLF) code = `${code}L`;
    if (code != null && isHC) code = `${code}HC`;
  } else if (mat === 'A88') {
    code = ({B:88,C:89})[cls];
  } else if (mat === 'Hydex') {
    code = lobeStyle==='Tri-Lobe' ? ({A:27,B:28})[cls] : ({A:25,B:26})[cls];
  } else if (mat === 'MDHydex')   { code = ({A:23,B:24})[cls]; }
  else if (mat === 'PEEK')        { code = ({A:50,B:51})[cls]; }
  else if (mat === 'PTFE')        { code = ({A:70,B:71})[cls]; }
  else if (mat === 'PTFE-SS')     { code = ({A:72,B:73})[cls]; }
  else if (mat === 'PolyFlex')    { code = cls==='A' ? 52 : null; }
  else if (mat === 'DuraCore')    { code = 30; }
  else if (mat === 'DuraCoreHD')  { code = 32; }
  else if (mat === 'DuraCoreHP')  { code = 34; }
  else if (mat === 'DuraCoreHPMD'){ code = 36; }
  return code != null ? String(code) : '??';
}

function buildPN(cfg, pump, cls, isGear) {
  const ser = SERIES.find(s => s.code === cfg.series);
  const modelNum = (pump.name.match(/\d+/) || ['???'])[0];
  const A = ser ? `${ser.pnPrefix}${modelNum}${cfg.flangeMount||''}` : '???';
  const E = `${cfg.connectionType||'??'}${cfg.connectionSize||'??'}${cfg.portOrientation||'H'}`;
  const isFF = COVER_TYPES.find(c=>c.code===cfg.coverType)?.ff || false;
  const F = isGear ? '—' : resolveFCode(cls, cfg.rotorMaterial, cfg.lobeStyle, cfg.rotorVariant==='High Pressure', isFF, cfg.materialGrade==='Low Ferrite', cfg.materialGrade==='Hastelloy C');
  const G = `${cfg.shaft||'??'}${cfg.driveOrientation||'T'}`;
  return `UNIBLOC-PD ${A}-${cfg.coverType||'??'}-${cfg.rotorHousing||'??'}-${E}-${F}-${G}-${cfg.seal||'??'}-${cfg.elastomer||'??'}`;
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
  const setMulti = obj => setConfig(c => ({...c, ...obj}));

  // Derived booleans from string config values
  const isHP    = config.rotorVariant === 'High Pressure';
  const isLF    = config.materialGrade === 'Low Ferrite';
  const isHC    = config.materialGrade === 'Hastelloy C';
  const selCover = COVER_TYPES.find(c => c.code === config.coverType) || {};
  const isFF    = selCover.ff || false;
  const isHPCover = selCover.hp || false;
  const selSeal = SEALS.find(s => s.code === config.seal) || {};
  const needsHardened = selSeal.needsHardened || false;
  const selMat  = ROTOR_MATERIALS.find(m => m.code === config.rotorMaterial) || {};
  const isMetal = selMat.group === 'metal';
  const dGroup  = driveGroup(config.drive);

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

  const availMaterials = useMemo(() => {
    if (isGear) return ROTOR_MATERIALS.filter(m => m.code === 'N60' || m.code === '316L');
    if (isFF)   return ROTOR_MATERIALS.filter(m => m.code === 'N60');
    return ROTOR_MATERIALS;
  }, [isGear, isFF]);

  const availLobeStyles = useMemo(() => {
    if (isGear) return [{label:'Gear',code:'Gear'}];
    const hasTri = ['N60','316L','Hydex'].includes(config.rotorMaterial);
    return hasTri
      ? [{label:'Bi-Lobe',code:'Bi-Lobe'},{label:'Tri-Lobe',code:'Tri-Lobe'}]
      : [{label:'Bi-Lobe',code:'Bi-Lobe'}];
  }, [isGear, config.rotorMaterial]);

  // --- Dependency effects ---

  // 3.3 — HP rotor ↔ HP cover enforcement
  useEffect(() => {
    if (isHP && !isHPCover) set('coverType', '12');
    if (!isHP && isHPCover && !isFF) set('coverType', '10');
  }, [config.rotorVariant]);

  // 3.7 — FoodFirst cover → force N60 rotor
  useEffect(() => {
    if (isFF && config.rotorMaterial !== 'N60') set('rotorMaterial', 'N60');
  }, [config.coverType]);

  // 3.2b — Seal type → auto-switch shaft to hardened
  useEffect(() => {
    const curShaft = SHAFT_OPTS.find(s => s.code === config.shaft);
    if (needsHardened && curShaft && !curShaft.hardened) {
      set('shaft', defaultShaft(dGroup, isMetal, true));
    }
  }, [config.seal]);

  // 3.2 + 3.2a — Rotor material or drive change → reset shaft if now invalid
  useEffect(() => {
    const still = availShafts.find(s => s.code === config.shaft);
    if (!still) set('shaft', defaultShaft(dGroup, isMetal, needsHardened));
  }, [config.rotorMaterial, config.drive]);

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

  // --- Derived values ---
  const fCode = isGear ? '—' : resolveFCode(cls, config.rotorMaterial, config.lobeStyle, isHP, isFF, isLF, isHC);
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
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
            <Field label="Gearbox Series">
              <Sel value={config.series} onChange={v => set('series', v)} opts={SERIES}/>
            </Field>
            {availFlange.length > 0 && (
              <Field label="Flange Mount">
                <Sel value={config.flangeMount||''}
                  onChange={v => set('flangeMount', v)}
                  opts={[{label:'None',code:''}, ...availFlange.map(f => ({label:f===`F1`?'F1 — Direct Mount':'F2 — Flex Mount', code:f}))]}/>
              </Field>
            )}
          </div>
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

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:8}}>
            <Field label="Rotor Material">
              <Sel value={config.rotorMaterial} onChange={v => set('rotorMaterial', v)} opts={availMaterials}/>
            </Field>
            <Field label="Lobe Style">
              <Sel value={config.lobeStyle} onChange={v => set('lobeStyle', v)} opts={availLobeStyles}/>
            </Field>
          </div>

          {!isGear && (
            <div style={{display:'flex', gap:16, flexWrap:'wrap'}}>
              <Field label="Rotor Variant">
                <Toggle value={config.rotorVariant||'Standard'}
                  onChange={v => set('rotorVariant', v)}
                  opts={[{label:'Standard',code:'Standard'},{label:'High Pressure',code:'High Pressure'}]}/>
              </Field>
              <Field label="Material Grade">
                <Toggle value={config.materialGrade||'Standard'}
                  onChange={v => set('materialGrade', v)}
                  opts={[
                    {label:'Standard',      code:'Standard'},
                    {label:'Low Ferrite (L)',code:'Low Ferrite'},
                    {label:'Hastelloy C',   code:'Hastelloy C'},
                  ]}/>
              </Field>
            </div>
          )}
        </div>

        <div style={S.divider}/>

        {/* G — Shaft & Drive */}
        <div style={{marginBottom:14}}>
          <SectionHeader>G — Shaft &amp; Drive</SectionHeader>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:8}}>
            <Field label="Drive Type">
              <Sel value={config.drive} onChange={v => set('drive', v)} opts={DRIVE_TYPES}/>
            </Field>
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
