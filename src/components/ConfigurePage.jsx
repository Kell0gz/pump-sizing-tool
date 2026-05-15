import { S } from '../styles.js';

export default function ConfigurePage({ sizing, config, setConfig, projectName, setProjectName, onConfirm, onBack }) {
  if (!sizing) return (
    <div style={{...S.card, textAlign:'center', padding:40}}>
      <div style={{fontSize:13, color:'var(--gray)', marginBottom:12}}>Please complete pump sizing first.</div>
      <button style={S.btn('outline')} onClick={onBack}>← Back to Sizing</button>
    </div>
  );

  const pump = sizing.pump;
  const connections = pump.port.split('/').map(p => `${p.trim()} Tri-Clamp`);
  const fields = [
    { key:'rotorStyle',    label:'Rotor Style',    opts:['Bi-Wing','Tri-Lobe','Gear'] },
    { key:'rotorMaterial', label:'Rotor Material',  opts:['316SS','Non-Galling Alloy','Polyflex®','Polyflex MD®','DuraCore®'] },
    { key:'connection',    label:'Port Connection', opts: connections },
    { key:'housing',       label:'Housing',         opts:['Standard Aluminum','316L SS','Jacketed'] },
    { key:'seal',          label:'Seal Type',        opts:['Single Mechanical','Double Mechanical','Lip Seal','QuickStrip® Mech'] },
    { key:'shaft',         label:'Shaft',            opts:['Standard','Hardened Sleeved','Extended'] },
    { key:'drive',         label:'Drive Type',       opts:['Direct Drive','Compac® FMS','Gearbox','VFD Drive','Air Motor'] },
  ];

  return (
    <div style={{maxWidth:680, margin:'0 auto'}}>
      <div style={S.card}>
        <div style={S.cardHeader}>
          Configure Pump
          <span style={S.pill('steel')}>{pump.name} — Class {sizing.cls}</span>
        </div>
        <div style={{marginBottom:14}}>
          <label style={S.label}>Project / Job Name</label>
          <input style={S.input} placeholder="e.g. Dairy Line 3 — Feed Pump"
            value={projectName} onChange={e=>setProjectName(e.target.value)}/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          {fields.map(f=>(
            <div key={f.key}>
              <label style={S.label}>{f.label}</label>
              <select style={S.input} value={config[f.key]||''} onChange={e=>setConfig(c=>({...c,[f.key]:e.target.value}))}>
                {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <input type="checkbox" id="rv" checked={config.reliefValve||false}
              onChange={e=>setConfig(c=>({...c,reliefValve:e.target.checked}))}
              style={{width:16,height:16,accentColor:'var(--red)',cursor:'pointer'}}/>
            <label htmlFor="rv" style={{fontWeight:600, fontSize:12, cursor:'pointer'}}>Include Relief Valve</label>
          </div>
        </div>
        <div style={{...S.divider, marginTop:14}}/>
        <div style={{display:'flex', gap:8}}>
          <button style={{...S.btn('outline'), flex:1}} onClick={onBack}>← Back to Sizing</button>
          <button style={{...S.btn('primary'), flex:2}} onClick={onConfirm}>✓ Confirm & Generate Datasheet</button>
        </div>
      </div>
    </div>
  );
}
