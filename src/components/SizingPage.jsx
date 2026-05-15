import { useState, useMemo } from 'react';
import { S } from '../styles.js';
import { LOBE_PUMPS, GEAR_PUMPS, ALL_PUMPS, NO_SLIP_EQ } from '../data/pumps.js';
import { PRODUCT_DB } from '../data/products.js';
import { toUS, unitLabel, getRC, calcResult, sizePumps, calcFric } from '../lib/calculations.js';
import ResultsPanel from './ResultsPanel.jsx';
import RecommTiles from './RecommTiles.jsx';

const CLASSES = ['A','B','C','D','E','F'];

export default function SizingPage({ state, setState, onConfigure }) {
  const {
    units, flow, pressure, viscosity, temp, pumpTypeFilter, manualMode,
    manualPump, manualCls, customerName, quoteNumber, advOpen,
    recResult, recCls, candidates,
  } = state;

  const set = (k, v) => setState(s => ({...s, [k]:v}));

  const flowUS   = useMemo(() => +toUS(+flow,           'flow',     units), [flow, units]);
  const pressUS  = useMemo(() => +toUS(+pressure,       'pressure', units), [pressure, units]);
  const tempUS   = useMemo(() => +toUS(+(temp||70),     'temp',     units), [temp, units]);
  const visc = +(viscosity || 0);

  const manPump = ALL_PUMPS.find(p => p.name === manualPump);
  const manResult = useMemo(() => {
    if (!manPump || !flowUS || !pressUS || !visc) return null;
    return calcResult(manPump, manualCls, flowUS, pressUS, visc, tempUS);
  }, [manPump, manualCls, flowUS, pressUS, visc, tempUS]);

  const handleSizePumps = () => {
    if (!flowUS || !pressUS || !visc) return;
    const cands = sizePumps(flowUS, pressUS, visc, tempUS, pumpTypeFilter);
    let sel = null, selCls = 'D';
    if (cands.length > 0) {
      sel = cands[0].pump;
      selCls = sel.name.startsWith('G') ? 'A' : 'D';
    }
    setState(s => ({
      ...s, candidates: cands,
      recResult: sel ? calcResult(sel, selCls, flowUS, pressUS, visc, tempUS) : null,
      recCls: selCls, recPump: sel?.name,
    }));
  };

  const handleSelectCandidate = (cand) => {
    const cls = cand.pump.name.startsWith('G') ? 'A' : 'D';
    const r = calcResult(cand.pump, cls, flowUS, pressUS, visc, tempUS);
    setState(s => ({...s, recResult: r, recCls: cls, recPump: cand.pump.name}));
  };

  const handleSelectRecCls = (cls) => {
    if (!state.recPump) return;
    const pump = ALL_PUMPS.find(p => p.name === state.recPump);
    if (!pump) return;
    const r = calcResult(pump, cls, flowUS, pressUS, visc, tempUS);
    setState(s => ({...s, recResult: r, recCls: cls}));
  };

  const handleUnitToggle = (u) => {
    if (u === units) return;
    setState(s => {
      const cf = qty => {
        const v = +s[qty];
        if (!v) return s[qty];
        const usVal = u==='US' ? toUS(v, qty, 'SI') : (v * (qty==='flow'?3.78541:qty==='pressure'?0.0689476:0) + (qty==='temp'?(v-32)/1.8:0));
        return isNaN(usVal) ? s[qty] : usVal.toFixed(2);
      };
      return {...s, units:u, flow:cf('flow'), pressure:cf('pressure'), temp:cf('temp')};
    });
  };

  // Friction loss
  const [fric, setFric] = useState({sDia:'',sLen:'',sHead:'',dDia:'',dLen:'',dHead:'',density:'62.4'});
  const sResult = useMemo(() => calcFric(+fric.sDia,+fric.sLen,+fric.sHead,flowUS,+fric.density||62.4,visc||1), [fric,flowUS,visc]);
  const dResult = useMemo(() => calcFric(+fric.dDia,+fric.dLen,+fric.dHead,flowUS,+fric.density||62.4,visc||1), [fric,flowUS,visc]);

  // Product DB search
  const [prodSearch, setProdSearch] = useState('');
  const filteredProds = PRODUCT_DB.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()));

  const availableLobes = LOBE_PUMPS.filter(p => !NO_SLIP_EQ.has(p.name) && pumpTypeFilter !== 'Gear');
  const availableGears = GEAR_PUMPS.filter(p => !NO_SLIP_EQ.has(p.name) && pumpTypeFilter !== 'Lobe');
  const availablePumps = pumpTypeFilter === 'Lobe' ? availableLobes
                       : pumpTypeFilter === 'Gear' ? availableGears
                       : [...availableLobes, ...availableGears];

  const rcInfo = manPump ? CLASSES.reduce((acc,c) => ({...acc,[c]:getRC(manPump,c)}), {}) : {};
  const selRC  = manPump && manualCls ? getRC(manPump, manualCls) : null;
  const result = manualMode ? manResult : recResult;

  return (
    <div style={{display:'flex', gap:16, flexWrap:'wrap', alignItems:'flex-start'}}>
      {/* LEFT PANEL */}
      <div style={{flex:'0 0 270px', minWidth:240}}>

        {/* Process Inputs */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            Process Inputs
            <div style={S.toggleGroup}>
              {['US','SI'].map(u => <button key={u} style={S.toggle(units===u)} onClick={()=>handleUnitToggle(u)}>{u}</button>)}
            </div>
          </div>
          <div style={S.row}>
            <div style={S.col()}>
              <label style={S.label}>Customer</label>
              <input style={S.input} placeholder="Acme Dairy Co." value={customerName}
                onChange={e=>set('customerName',e.target.value)}/>
            </div>
          </div>
          <div style={S.row}>
            <div style={S.col()}>
              <label style={S.label}>Quote #</label>
              <input style={S.input} placeholder="Q-2026-0042" value={quoteNumber}
                onChange={e=>set('quoteNumber',e.target.value)}/>
            </div>
          </div>
          <div style={S.row}>
            <div style={S.col()}>
              <label style={S.label}>Flow ({unitLabel('flow',units)})</label>
              <input style={S.input} type="number" placeholder="0" value={flow}
                onChange={e=>set('flow',e.target.value)}/>
            </div>
            <div style={S.col()}>
              <label style={S.label}>Pressure ({unitLabel('pressure',units)})</label>
              <input style={S.input} type="number" placeholder="0" value={pressure}
                onChange={e=>set('pressure',e.target.value)}/>
            </div>
          </div>
          <div style={S.row}>
            <div style={S.col()}>
              <label style={S.label}>Viscosity (cPs)</label>
              <input style={S.input} type="number" placeholder="1" value={viscosity}
                onChange={e=>set('viscosity',e.target.value)}/>
            </div>
            <div style={S.col()}>
              <label style={S.label}>Temp ({unitLabel('temp',units)})</label>
              <input style={S.input} type="number" placeholder="70" value={temp}
                onChange={e=>set('temp',e.target.value)}/>
            </div>
          </div>
          <div style={{marginTop:4}}>
            <label style={S.label}>Pump Type</label>
            <div style={S.toggleGroup}>
              {['All','Lobe','Gear'].map(t => (
                <button key={t} style={S.toggle(pumpTypeFilter===t)} onClick={()=>set('pumpTypeFilter',t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Mode + Pump Selection */}
        <div style={S.card}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12}}>
            <span style={{fontWeight:600, fontSize:12}}>Mode</span>
            <label style={{display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:12}}>
              <span style={{color: manualMode ? 'var(--charcoal)' : 'var(--gray)'}}>Manual</span>
              <div style={{position:'relative', width:36, height:20}} onClick={()=>set('manualMode',!manualMode)}>
                <div style={{width:36,height:20,borderRadius:10, background: manualMode ? 'var(--gray-border)' : 'var(--red)',
                  transition:'background 0.2s'}}/>
                <div style={{position:'absolute',top:3,left: manualMode ? 3 : 19, width:14, height:14,
                  borderRadius:'50%', background:'white', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}/>
              </div>
              <span style={{color: !manualMode ? 'var(--charcoal)' : 'var(--gray)'}}>Recommend</span>
            </label>
          </div>

          {manualMode ? (
            <>
              <label style={S.label}>Pump Model</label>
              <select style={{...S.input, marginBottom:8}} value={manualPump}
                onChange={e=>{set('manualPump',e.target.value); set('manualCls','D');}}>
                {availablePumps.map(p=>(
                  <option key={p.name} value={p.name}>{p.name} — Max {p.maxFlow} GPM</option>
                ))}
              </select>
              {manPump && !manPump.name.startsWith('G') && (
                <>
                  <label style={S.label}>Rotor Class</label>
                  <div style={{display:'flex', gap:4, flexWrap:'wrap', marginBottom:6}}>
                    {CLASSES.map(c => {
                      const rc2 = rcInfo[c];
                      return (
                        <button key={c} style={{
                          flex:1, minWidth:36, padding:'5px 2px', border:'1.5px solid', borderRadius:4,
                          fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.12s',
                          borderColor: manualCls===c ? 'var(--red)' : 'var(--gray-border)',
                          background: manualCls===c ? 'var(--red)' : 'white',
                          color: manualCls===c ? 'white' : 'var(--charcoal)',
                          display:'flex', flexDirection:'column', alignItems:'center', gap:1
                        }} onClick={()=>set('manualCls',c)}>
                          <span>{c}</span>
                          <span style={{fontSize:9, fontWeight:400}}>{rc2?.maxPSI} PSI</span>
                        </button>
                      );
                    })}
                  </div>
                  {selRC && (
                    <div style={{fontSize:11, color:'var(--gray)', fontStyle:'italic'}}>
                      Class {manualCls}: Max {selRC.maxPSI} PSI · {selRC.maxTF}°F · Slip ×{selRC.slip.toFixed(2)}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <button style={{...S.btn('primary','lg'), width:'100%'}} onClick={handleSizePumps}>
              ⚙ Calculate Size
            </button>
          )}
        </div>

        {/* Advanced Options */}
        <div style={S.card}>
          <button style={{...S.btn('ghost','sm'), width:'100%'}}
            onClick={()=>set('advOpen',!advOpen)}>
            {advOpen ? '▲ Hide' : '▼ Show'} Advanced Options
          </button>
          {advOpen && (
            <>
              <div style={S.divider}/>
              <div style={{...S.cardHeader, marginBottom:8}}>Product Database</div>
              <input style={{...S.input, marginBottom:6}} placeholder="🔍 Search products..."
                value={prodSearch} onChange={e=>setProdSearch(e.target.value)}/>
              <div style={{maxHeight:160, overflowY:'auto', border:'1px solid var(--gray-border)',
                borderRadius:5, fontSize:11}}>
                {filteredProds.map(p=>(
                  <div key={p.name} style={{padding:'5px 8px', cursor:'pointer', display:'flex',
                    justifyContent:'space-between', gap:8, borderBottom:'1px solid var(--gray-light)',
                    transition:'background 0.1s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--gray-light)'}
                    onMouseLeave={e=>e.currentTarget.style.background='white'}
                    onClick={()=>set('viscosity',String(p.viscosity))}>
                    <span style={{fontWeight:600}}>{p.name}</span>
                    <span style={{color:'var(--gray)'}}>{p.viscosity} cPs</span>
                    {p.shear > 0 && <span style={{color:'var(--red)'}}>⚡ {p.shear} Pa</span>}
                  </div>
                ))}
              </div>

              <div style={{...S.divider, marginTop:12}}/>
              <div style={{...S.cardHeader, marginBottom:8}}>Friction Loss</div>

              <div style={{fontSize:10, fontWeight:700, color:'var(--steel)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em'}}>Suction</div>
              <div style={S.row}>
                {[['Dia (in)','sDia'],['Length (ft)','sLen'],['Head (ft)','sHead']].map(([l,k])=>(
                  <div key={k} style={S.col()}>
                    <label style={S.label}>{l}</label>
                    <input style={S.input} type="number" value={fric[k]}
                      onChange={e=>setFric(f=>({...f,[k]:e.target.value}))}/>
                  </div>
                ))}
              </div>
              {sResult && (
                <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:4,padding:'5px 8px',fontSize:11,marginBottom:6,fontFamily:'DM Mono,monospace'}}>
                  Loss: {sResult.pressLoss.toFixed(3)} PSI · Vel: {sResult.velocity.toFixed(2)} ft/s · Re: {Math.round(sResult.reynolds)}
                </div>
              )}

              <div style={{fontSize:10, fontWeight:700, color:'var(--steel)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em'}}>Discharge</div>
              <div style={S.row}>
                {[['Dia (in)','dDia'],['Length (ft)','dLen'],['Head (ft)','dHead']].map(([l,k])=>(
                  <div key={k} style={S.col()}>
                    <label style={S.label}>{l}</label>
                    <input style={S.input} type="number" value={fric[k]}
                      onChange={e=>setFric(f=>({...f,[k]:e.target.value}))}/>
                  </div>
                ))}
              </div>
              {dResult && (
                <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:4,padding:'5px 8px',fontSize:11,marginBottom:6,fontFamily:'DM Mono,monospace'}}>
                  Loss: {dResult.pressLoss.toFixed(3)} PSI · Vel: {dResult.velocity.toFixed(2)} ft/s · Re: {Math.round(dResult.reynolds)}
                </div>
              )}
              <div style={S.row}>
                <div style={S.col()}>
                  <label style={S.label}>Fluid Density (lb/ft³)</label>
                  <input style={S.input} type="number" value={fric.density}
                    onChange={e=>setFric(f=>({...f,density:e.target.value}))}/>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{flex:1, minWidth:300}}>

        {/* Candidates (Recommend mode) */}
        {!manualMode && candidates && candidates.length > 0 && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              Candidates
              <span style={S.pill('steel')}>{candidates.length} matches</span>
            </div>
            <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:10}}>
              {candidates.map(c=>{
                const isSelected = state.recPump === c.pump.name;
                const pct = Math.round(c.result.dutyRPM/c.result.adjMaxRPM*100);
                return (
                  <button key={c.pump.name} onClick={()=>handleSelectCandidate(c)}
                    style={{padding:'7px 12px', borderRadius:6, fontSize:12, fontWeight:700,
                      cursor:'pointer', transition:'all 0.12s', border:'1.5px solid',
                      borderColor: isSelected ? 'var(--red)' : 'var(--gray-border)',
                      background: isSelected ? 'var(--red)' : 'white',
                      color: isSelected ? 'white' : 'var(--charcoal)',
                      display:'flex', flexDirection:'column', alignItems:'center', gap:2}}>
                    <span>{c.pump.name}</span>
                    <span style={{fontSize:10, fontWeight:400}}>{pct}% adj RPM</span>
                  </button>
                );
              })}
            </div>
            {state.recPump && !state.recPump.startsWith('G') && (
              <>
                <div style={{...S.label, marginBottom:6}}>Rotor Class</div>
                <div style={{display:'flex', gap:4}}>
                  {CLASSES.map(c => {
                    const rPump = ALL_PUMPS.find(p => p.name === state.recPump);
                    const rc2 = rPump ? getRC(rPump, c) : null;
                    const invalid = rc2 && (pressUS > rc2.maxPSI || tempUS > rc2.maxTF);
                    return (
                      <button key={c} disabled={invalid}
                        style={{flex:1, minWidth:36, padding:'5px 2px', border:'1.5px solid', borderRadius:4,
                          fontSize:11, fontWeight:700, cursor: invalid ? 'not-allowed' : 'pointer',
                          opacity: invalid ? 0.4 : 1, transition:'all 0.12s',
                          borderColor: recCls===c ? 'var(--red)' : 'var(--gray-border)',
                          background: recCls===c ? 'var(--red)' : 'white',
                          color: recCls===c ? 'white' : 'var(--charcoal)',
                          display:'flex', flexDirection:'column', alignItems:'center', gap:1}}
                        onClick={()=>!invalid && handleSelectRecCls(c)}>
                        <span>{c}</span>
                        <span style={{fontSize:9, fontWeight:400}}>{rc2?.maxPSI} PSI</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Results */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            Results
            {result && <span style={S.pill('steel')}>{manualMode ? `Manual — ${result.pump.name}` : `Recommended — ${result.pump.name}`}</span>}
          </div>
          {result ? (
            <>
              {result.warnings.length > 0 && (
                <div style={S.warn}>
                  <div style={S.warnTitle}>⚠ Out-of-Range Warnings</div>
                  {result.warnings.map(w=><div key={w} style={{fontSize:12}}>• {w}</div>)}
                </div>
              )}
              <ResultsPanel result={result} units={units} onConfigure={()=>onConfigure(result)} showBtn={true}/>
              <div style={S.divider}/>
              <RecommTiles result={result}/>
            </>
          ) : (
            <div style={{textAlign:'center', padding:'40px 20px', color:'var(--gray)'}}>
              <div style={{fontSize:32, marginBottom:10}}>⚙️</div>
              <div style={{fontSize:14, fontWeight:500}}>
                {manualMode ? 'Enter process conditions to see results' : 'Enter conditions and click Calculate Size'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
