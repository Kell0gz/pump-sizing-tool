import { useEffect, useMemo } from 'react';
import { S } from '../styles.js';
import {
  SERIES, COVER_TYPES, ROTOR_HOUSINGS, CONNECTION_TYPES, CONNECTION_SIZES,
  ROTOR_CODES, SHAFT_OPTS, SEALS, ELASTOMERS, DRIVE_TYPES, SERIES_RESTRICTIONS,
} from '../data/configOptions.js';

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
  const sr = SERIES_RESTRICTIONS[modelSeries] || SERIES_RESTRICTIONS[600];

  const set = (k, v) => setConfig(c => ({...c, [k]: v}));

  // Derived values from selected rotor code
  const selRotor = ROTOR_CODES.find(r => r.code === config.rotorCode);
  const isMetal  = selRotor ? selRotor.group === 'metal' : true;
  const isHP     = selRotor?.hp || false;

  // Derived booleans from other config values
  const isLF      = config.materialGrade === 'Low Ferrite';
  const isHC      = config.materialGrade === 'Hastelloy C';
  const matSuffix = isLF ? 'L' : isHC ? 'HC' : '';
  const selCover  = COVER_TYPES.find(c => c.code === config.coverType) || {};
  const isFF      = selCover.ff || false;
  const isHPCover = selCover.hp || false;
  const selSeal   = SEALS.find(s => s.code === config.seal) || {};
  const needsHardened = selSeal.needsHardened || false;
  const dGroup    = driveGroup(config.drive);

  const fCode = isGear ? '—' : `${config.rotorCode||'??'}${selRotor?.allowsSuffix ? matSuffix : ''}`;

  // --- Filtered option lists (driven by SERIES_RESTRICTIONS + cross-config rules) ---

  const availCovers = useMemo(() => COVER_TYPES.filter(ct => {
    if (sr.excludedCovers.includes(ct.code)) return false;
    if (isHP && !ct.hp) return false;
    if (!isHP && ct.hp && !ct.ff) return false;
    return true;
  }), [sr, isHP]);

  const availHousings = useMemo(() =>
    ROTOR_HOUSINGS.filter(h => !sr.excludedHousings.includes(h.code))
  , [sr]);

  const availSeals = useMemo(() =>
    SEALS.filter(s => !sr.excludedSeals.includes(s.code))
  , [sr]);

  const availShafts = useMemo(() => SHAFT_OPTS.filter(s => {
    if (s.drive !== dGroup) return false;
    if (isMetal && !s.metal) return false;
    if (!isMetal && s.metal) return false;
    if (s.series200300 && !sr.shaftCode11) return false;
    return true;
  }), [dGroup, isMetal, sr]);

  const availFlange = sr.flangeMounts;

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

  // Keep cover valid when model series changes
  useEffect(() => {
    const still = availCovers.find(c => c.code === config.coverType);
    if (!still) set('coverType', '10');
  }, [modelSeries]);

  // Keep housing valid when model series changes
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
