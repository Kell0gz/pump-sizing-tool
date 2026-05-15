import { useState } from 'react';
import { S } from '../styles.js';
import { KB_ARTICLES } from '../data/knowledgeBase.js';

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [pumpFilter, setPumpFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [openId, setOpenId] = useState(null);

  const cats = ['All','General','Sizing','Seals','Installation','Maintenance','Troubleshooting'];
  const catColors = {All:'var(--gray)',General:'#1d4ed8',Sizing:'#166534',Seals:'#9d174d',
    Installation:'#6b21a8',Maintenance:'#92400e',Troubleshooting:'var(--red)'};

  const highlight = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((p,i) =>
      p.toLowerCase() === term.toLowerCase()
        ? <mark key={i} style={{background:'#fef08a',padding:0}}>{p}</mark>
        : p
    );
  };

  const filtered = KB_ARTICLES.filter(a => {
    if (pumpFilter !== 'All' && !a.pumpTypes.includes(pumpFilter)) return false;
    if (catFilter !== 'All' && a.category !== catFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return a.title.toLowerCase().includes(s) || a.summary.toLowerCase().includes(s) || a.content.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div style={{maxWidth:900, margin:'0 auto'}}>
      <div style={S.card}>
        <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:10}}>
          <div style={{flex:1, minWidth:200}}>
            <input style={{...S.input, paddingLeft:28}} placeholder="🔍 Search articles..."
              value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <span style={S.pill('steel')}>{filtered.length} article{filtered.length!==1?'s':''}</span>
        </div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <div style={S.toggleGroup}>
            {['All','Lobe','Gear'].map(t=>(
              <button key={t} style={S.toggle(pumpFilter===t)} onClick={()=>setPumpFilter(t)}>{t}</button>
            ))}
          </div>
          <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
            {cats.map(c=>(
              <button key={c} style={{
                ...S.toggle(catFilter===c),
                background: catFilter===c ? catColors[c] : 'transparent',
                color: catFilter===c ? 'white' : 'var(--gray)',
                border:'none', padding:'5px 9px', borderRadius:4, fontSize:11, fontWeight:600,
                cursor:'pointer', transition:'all 0.12s'
              }} onClick={()=>setCatFilter(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{...S.card, background:'#fffbeb', borderColor:'#fde68a', padding:'8px 14px', marginBottom:12}}>
        <span style={{fontSize:12, color:'#92400e'}}>
          ⚠ Information drawn from the Unibloc Engineering Manual (EMPD200-677, Rev. 12/2016).
          Verify critical applications with Unibloc engineering.
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={{...S.card, textAlign:'center', padding:40, color:'var(--gray)'}}>
          <div style={{fontSize:28, marginBottom:8}}>📭</div>
          <div>No articles match your search</div>
        </div>
      ) : filtered.map(a => (
        <div key={a.id} style={{...S.card, padding:0, overflow:'hidden',
          border: openId===a.id ? '1.5px solid var(--red)' : '1px solid var(--gray-border)'}}>
          <div style={{
            padding:'12px 16px', cursor:'pointer', display:'flex', justifyContent:'space-between',
            alignItems:'center', gap:10,
            background: openId===a.id ? 'var(--steel-light)' : 'white',
            transition:'background 0.15s'
          }} onClick={()=>setOpenId(openId===a.id ? null : a.id)}>
            <div style={{flex:1}}>
              <div style={{display:'flex', alignItems:'center', gap:6, marginBottom:3}}>
                <span style={{fontWeight:700, fontSize:13}}>{highlight(a.title, search)}</span>
                <span style={{...S.pill('steel'), fontSize:9}}>{a.category}</span>
                {a.pumpTypes.map(t=><span key={t} style={{...S.pill('red'), fontSize:9, background:'#f0f0f0', color:'var(--gray)'}}>{t}</span>)}
              </div>
              <div style={{fontSize:12, color:'var(--gray)'}}>{highlight(a.summary, search)}</div>
            </div>
            <span style={{color:'var(--gray)', fontSize:14}}>{openId===a.id ? '▲' : '▼'}</span>
          </div>
          {openId===a.id && (
            <div style={{padding:'14px 16px', borderTop:'1px solid var(--gray-border)',
              borderLeft:'4px solid var(--red)', background:'white', fontSize:12,
              whiteSpace:'pre-wrap', lineHeight:1.7, color:'var(--charcoal)'}}>
              {highlight(a.content, search)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
