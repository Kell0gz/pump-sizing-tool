import { S } from '../styles.js';
import { unitLabel, toDisplay } from '../lib/calculations.js';
import Logo from './Logo.jsx';
import PumpCurve from './PumpCurve.jsx';

export default function DatasheetPage({ sizing, config, projectName, customerName, quoteNumber, units, saved, sizingId, onBack }) {
  if (!sizing || !saved) return (
    <div style={{...S.card, textAlign:'center', padding:40}}>
      <div style={{fontSize:13, color:'var(--gray)', marginBottom:12}}>
        No saved datasheet yet. Complete sizing and configuration first.
      </div>
      <button style={S.btn('outline')} onClick={onBack}>← Back to Sizing</button>
    </div>
  );

  const { pump, cls, rc, isGear, slipRPM, dutyRPM, adjMaxRPM, bhp, kw, K, aP, warnings } = sizing;
  const pct = Math.round(dutyRPM/adjMaxRPM*100);
  const today = new Date().toLocaleDateString();
  const dispU = units === 'SI';
  const fv = (v, d=1) => isNaN(v) ? '—' : (+v).toFixed(d);
  const uLabel = qty => unitLabel(qty, units);
  const toCfg = k => k.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c=>c.toUpperCase());

  return (
    <div style={{maxWidth:700, margin:'0 auto'}}>
      <div style={{...S.card, padding:24}}>
        {/* Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:10}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <Logo size={36}/>
            <div>
              <div style={{fontWeight:800, fontSize:18, letterSpacing:'0.12em', color:'var(--charcoal)'}}>UNIBLOC</div>
              <div style={{fontSize:11, color:'var(--gray)', letterSpacing:'0.05em'}}>Hygienic Technologies</div>
              <div style={{fontSize:11, fontWeight:600, color:'var(--steel)'}}>Application Sizing Datasheet</div>
            </div>
          </div>
          <div style={{textAlign:'right', fontSize:11}}>
            <div style={{fontWeight:700, fontSize:14}}>{projectName || 'Unnamed Project'}</div>
            {customerName && <div style={{color:'var(--gray)'}}>{customerName}</div>}
            {quoteNumber && <div style={{color:'var(--gray)'}}>Quote: {quoteNumber}</div>}
            <div style={{color:'var(--gray)'}}>{today}</div>
            <div style={{fontFamily:'DM Mono,monospace', fontWeight:700, color:'var(--steel-dark)', marginTop:2}}>{sizingId}</div>
            <div style={{...S.pill('red'), marginTop:4}}>Internal Use Only</div>
          </div>
        </div>

        <div style={{height:1, background:'var(--red)', marginBottom:16}}/>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16}}>
          <div>
            <div style={{fontSize:10, fontWeight:800, color:'var(--steel)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8}}>Process Conditions</div>
            {[
              customerName && ['Customer', customerName],
              quoteNumber && ['Quote No.', quoteNumber],
              ['Sizing ID', sizingId],
              ['Flow Rate', `${dispU ? fv(toDisplay(sizing._flow||0,'flow',units)) : fv(sizing._flow||0)} ${uLabel('flow')}`],
              ['Discharge Pressure', `${dispU ? fv(toDisplay(sizing._pressure||0,'pressure',units)) : fv(sizing._pressure||0)} ${uLabel('pressure')}`],
              ['Viscosity', `${sizing._visc||0} cPs`],
              ['Product Temp', `${dispU ? fv(toDisplay(sizing._temp||70,'temp',units)) : fv(sizing._temp||70)} ${uLabel('temp')}`],
            ].filter(Boolean).map(([l,v])=>(
              <div key={l} style={S.dataRow}><span style={S.dataLabel}>{l}</span><span style={S.dataVal}>{v}</span></div>
            ))}
            <div style={{marginTop:16, fontSize:10, fontWeight:800, color:'var(--steel)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8}}>Calculated Performance</div>
            {[
              ['Model', pump.name],
              ['Type', isGear ? 'Sanitary Gear' : 'Rotary Lobe'],
              ['Rotor Class', isGear ? '—' : cls],
              ['Adj. Pressure', `${fv(aP)} PSI`],
              ['Slip RPM', `${Math.round(slipRPM)} RPM`],
              ['Duty RPM', `${Math.round(dutyRPM)} RPM`],
              ['Adj. Max RPM', `${Math.round(adjMaxRPM)} RPM`],
              ['% Adj. Max', `${pct}%`],
              ['Power', `${fv(bhp)} HP`],
              ['Power (alt)', `${fv(kw)} kW`],
              ['K Factor', fv(K,3)],
            ].map(([l,v])=>(
              <div key={l} style={S.dataRow}><span style={S.dataLabel}>{l}</span><span style={S.dataVal}>{v}</span></div>
            ))}
          </div>
          <div>
            <div style={{fontSize:10, fontWeight:800, color:'var(--steel)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8}}>Pump Specifications</div>
            {[
              ['Max Flow', `${dispU ? fv(pump.maxFlow*3.78541) : pump.maxFlow} ${uLabel('flow')}`],
              ['Max Pressure', `${dispU ? fv(rc.maxPSI*0.0689476) : rc.maxPSI} ${uLabel('pressure')}`],
              ['Max RPM', `${pump.maxRPM} RPM`],
              ['Max Temp', `${dispU ? Math.round((rc.maxTF-32)/1.8) : rc.maxTF} ${uLabel('temp')}`],
              ['Displacement', `${pump.disp} gal/rev`],
              ['Port Size', pump.port],
            ].map(([l,v])=>(
              <div key={l} style={S.dataRow}><span style={S.dataLabel}>{l}</span><span style={S.dataVal}>{v}</span></div>
            ))}
            <div style={{marginTop:16, fontSize:10, fontWeight:800, color:'var(--steel)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8}}>Configuration</div>
            {Object.entries(config).map(([k,v])=>(
              <div key={k} style={S.dataRow}>
                <span style={S.dataLabel}>{toCfg(k)}</span>
                <span style={S.dataVal}>{k==='reliefValve' ? (v ? 'Included' : 'Not included') : v}</span>
              </div>
            ))}
          </div>
        </div>

        {warnings.length > 0 && (
          <div style={{...S.warn, marginBottom:12}}>
            <div style={S.warnTitle}>⚠ Warnings</div>
            {warnings.map(w=><div key={w} style={{fontSize:12}}>• {w}</div>)}
          </div>
        )}

        <div style={{display:'flex', justifyContent:'center', marginBottom:16}}>
          <PumpCurve result={sizing} width={460} height={270}/>
        </div>

        <div style={{fontSize:10, color:'var(--gray)', textAlign:'center', borderTop:'1px solid var(--gray-border)', paddingTop:10}}>
          Unibloc Engineering Manual (EMPD200-677, Rev. 12/2016) · Verify critical applications with Unibloc engineering · Internal use only
        </div>
      </div>

      <div className="no-print" style={{display:'flex', gap:8, marginTop:8}}>
        <button style={{...S.btn('outline'), flex:1}} onClick={onBack}>← Edit Configuration</button>
        <button style={{...S.btn('primary'), flex:2}} onClick={()=>window.print()}>🖨 Print / Save as PDF</button>
      </div>
    </div>
  );
}
