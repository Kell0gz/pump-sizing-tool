export const S = {
  page: { minHeight:'100vh', background:'var(--gray-light)' },
  nav: { background:'var(--charcoal)', padding:'0 16px', display:'flex', alignItems:'center',
         justifyContent:'space-between', flexWrap:'wrap', gap:4, position:'sticky', top:0, zIndex:100,
         boxShadow:'0 2px 8px rgba(0,0,0,0.3)', borderBottom:'3px solid var(--red)' },
  navLogo: { display:'flex', alignItems:'center', gap:8, padding:'10px 0' },
  navTitle: { color:'white', fontSize:13, fontWeight:700, letterSpacing:'0.08em', lineHeight:1.2 },
  navSub: { color:'rgba(255,255,255,0.55)', fontSize:10, letterSpacing:'0.05em' },
  navTabs: { display:'flex', gap:2, flexWrap:'wrap' },
  navTab: (active) => ({
    padding:'12px 14px', fontSize:12, fontWeight:600, letterSpacing:'0.06em',
    cursor:'pointer', border:'none', background: active ? 'var(--red)' : 'transparent',
    color: active ? 'white' : 'rgba(255,255,255,0.7)',
    transition:'all 0.15s', borderRadius:4
  }),
  content: { padding:'20px', maxWidth:1200, margin:'0 auto' },
  card: { background:'white', border:'1px solid var(--gray-border)', borderRadius:8,
          padding:16, marginBottom:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' },
  cardHeader: { fontSize:11, fontWeight:700, letterSpacing:'0.1em', color:'var(--steel)',
                textTransform:'uppercase', marginBottom:12, display:'flex',
                alignItems:'center', justifyContent:'space-between' },
  label: { fontSize:11, fontWeight:600, color:'var(--gray)', marginBottom:4, display:'block',
           letterSpacing:'0.04em', textTransform:'uppercase' },
  input: { width:'100%', padding:'7px 10px', border:'1px solid var(--gray-border)',
           borderRadius:5, fontSize:13, outline:'none', transition:'border 0.15s',
           fontFamily:'inherit', background:'white' },
  row: { display:'flex', gap:8, marginBottom:10 },
  col: (flex=1) => ({ flex }),
  btn: (variant='primary', size='md') => {
    const base = { border:'none', borderRadius:5, cursor:'pointer', fontFamily:'inherit',
                   fontWeight:600, letterSpacing:'0.04em', transition:'all 0.15s', display:'inline-flex',
                   alignItems:'center', justifyContent:'center', gap:5 };
    const sizes = { sm:{padding:'5px 10px',fontSize:11}, md:{padding:'8px 14px',fontSize:12}, lg:{padding:'11px 18px',fontSize:13} };
    const variants = {
      primary: {background:'var(--red)', color:'white', boxShadow:'0 2px 6px rgba(200,16,46,0.3)'},
      outline: {background:'transparent', color:'var(--red)', border:'1.5px solid var(--red)'},
      ghost: {background:'var(--gray-light)', color:'var(--charcoal)', border:'1px solid var(--gray-border)'},
      steel: {background:'var(--steel)', color:'white'},
    };
    return {...base, ...sizes[size], ...variants[variant]};
  },
  warn: { background:'var(--red-light)', border:'1px solid rgba(200,16,46,0.3)', borderRadius:6,
          padding:'10px 12px', marginBottom:10, fontSize:12 },
  warnTitle: { fontWeight:700, color:'var(--red-dark)', marginBottom:4, fontSize:12 },
  pill: (color='red') => {
    const colors = {
      red:   {bg:'#fef2f2',   text:'var(--red)'},
      steel: {bg:'var(--steel-light)', text:'var(--steel-dark)'},
      green: {bg:'#f0fdf4',   text:'#166534'},
      amber: {bg:'#fffbeb',   text:'#92400e'},
    };
    return {display:'inline-block',padding:'2px 8px',borderRadius:20,fontSize:10,fontWeight:700,
            letterSpacing:'0.05em',...colors[color]};
  },
  toggle: (active) => ({
    padding:'5px 11px', fontSize:11, fontWeight:700, cursor:'pointer', border:'none',
    borderRadius:4, background: active ? 'var(--red)' : 'transparent',
    color: active ? 'white' : 'var(--gray)', transition:'all 0.12s'
  }),
  toggleGroup: { display:'inline-flex', background:'var(--gray-light)',
                  border:'1px solid var(--gray-border)', borderRadius:6, padding:2, gap:1 },
  divider: { height:1, background:'var(--gray-border)', margin:'12px 0' },
  dataRow: { display:'flex', justifyContent:'space-between', alignItems:'center',
             padding:'5px 0', borderBottom:'1px solid var(--gray-light)', fontSize:12 },
  dataLabel: { color:'var(--gray)', flex:1 },
  dataVal: { fontWeight:600, color:'var(--charcoal)', fontFamily:'DM Mono,monospace', fontSize:11 },
};
