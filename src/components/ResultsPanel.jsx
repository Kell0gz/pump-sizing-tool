import { S } from '../styles.js';
import { unitLabel } from '../lib/calculations.js';
import PumpCurve from './PumpCurve.jsx';

export default function ResultsPanel({ result, units, onConfigure, showBtn = true }) {
  if (!result) return null;
  const { pump, cls, rc, isGear, slipRPM, dutyRPM, adjMaxRPM, bhp, kw, K, aP, warnings, shear } = result;
  const pctAdj = Math.round(dutyRPM/adjMaxRPM*100);
  const fmtN = (v, d=1) => isNaN(v) ? '—' : v.toFixed(d);
  const dispUnits = units === 'SI';
  const flowDisp = dispUnits ? (dutyRPM - slipRPM) * pump.disp * 3.78541 : (dutyRPM - slipRPM) * pump.disp;
  const rows = [
    ['Model', pump.name],
    ['Type', isGear ? 'Sanitary Gear' : 'Rotary Lobe'],
    ['Rotor Class', isGear ? '—' : cls],
    ['Port Size', pump.port],
    ['Adj. Pressure', `${fmtN(aP)} PSI`],
    ['Slip RPM', `${Math.round(slipRPM)} RPM`],
    ['Duty RPM', `${Math.round(dutyRPM)} RPM`],
    ['Adj. Max RPM', `${Math.round(adjMaxRPM)} RPM`],
    ['% Adj. Max', `${pctAdj}%`],
    ['Power', `${fmtN(bhp)} HP`],
    ['Power (alt)', `${fmtN(kw)} kW`],
    ['K Factor', fmtN(K,3)],
    ['Max Flow', `${dispUnits ? fmtN(pump.maxFlow*3.78541) : pump.maxFlow} ${unitLabel('flow',units)}`],
    ['Max Pressure', `${dispUnits ? fmtN(rc.maxPSI*0.0689476) : rc.maxPSI} ${unitLabel('pressure',units)}`],
    ['Shear Rate', shear != null ? `${fmtN(shear,1)} Pa` : 'N/A'],
  ];
  return (
    <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
      <div style={{flex:'0 0 220px'}}>
        {rows.map(([l,v]) => (
          <div key={l} style={S.dataRow}>
            <span style={S.dataLabel}>{l}</span>
            <span style={{...S.dataVal, color: l==='Shear Rate' && shear!=null ? 'var(--steel-dark)' : 'var(--charcoal)'}}>{v}</span>
          </div>
        ))}
        {showBtn && onConfigure && (
          <button style={{...S.btn('primary','md'), width:'100%', marginTop:10}} onClick={onConfigure}>
            Configure This Pump →
          </button>
        )}
      </div>
      <div style={{flex:1, minWidth:260}}>
        <PumpCurve result={result} width={340} height={210}/>
      </div>
    </div>
  );
}
