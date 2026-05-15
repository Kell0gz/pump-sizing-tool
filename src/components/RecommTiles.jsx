import { nextMotorHP } from '../lib/calculations.js';

export default function RecommTiles({ result }) {
  if (!result) return null;
  const { pump, dutyRPM, adjMaxRPM, bhp, K } = result;
  const pct = dutyRPM / adjMaxRPM;
  const motorHP = nextMotorHP(bhp);
  const tiles = [
    { label:'Duty Point', val:`${Math.round(pct*100)}% of adj. max RPM`,
      note: pct > 0.85 ? 'Consider sizing up' : 'Good operating range',
      color:'#C8102E', bg:'#fff0f2' },
    { label:'Motor', val:`Min ${motorHP} HP`,
      note:`BHP × 1.2 = ${(bhp*1.2).toFixed(2)} HP minimum`,
      color:'var(--steel-dark)', bg:'var(--steel-light)' },
    { label:'K Factor', val:`K = ${K.toFixed(3)}`,
      note: K > 5 ? 'High vis — verify inlet & NPSH' : 'Standard conditions apply',
      color:'#92400e', bg:'#fffbeb' },
    { label:'Port Size', val:pump.port,
      note:'Verify inlet velocity ≤ 3 ft/s',
      color:'#166534', bg:'#f0fdf4' },
  ];
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:8, marginTop:8}}>
      {tiles.map(t => (
        <div key={t.label} style={{background:t.bg, border:`2px solid ${t.color}20`,
          borderLeft:`4px solid ${t.color}`, borderRadius:6, padding:'10px 12px'}}>
          <div style={{fontSize:10, fontWeight:700, letterSpacing:'0.07em', color:t.color, textTransform:'uppercase', marginBottom:4}}>{t.label}</div>
          <div style={{fontWeight:700, fontSize:14, color:'var(--charcoal)', marginBottom:2}}>{t.val}</div>
          <div style={{fontSize:11, color:'var(--gray)'}}>{t.note}</div>
        </div>
      ))}
    </div>
  );
}
