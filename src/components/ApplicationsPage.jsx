import { S } from '../styles.js';

export default function ApplicationsPage() {
  return (
    <div style={{maxWidth:900, margin:'0 auto'}}>
      <div style={{...S.card, textAlign:'center', padding:60}}>
        <div style={{fontSize:40, marginBottom:14}}>🗂</div>
        <div style={{fontSize:18, fontWeight:700, marginBottom:8}}>Applications Database</div>
        <div style={{fontSize:13, color:'var(--gray)', maxWidth:480, margin:'0 auto 16px', lineHeight:1.6}}>
          This tab will display all saved pump sizings and allow you to search and filter by customer,
          pump model, product, quote number, and more.
        </div>
        <span style={{...S.pill('amber'), fontSize:11, padding:'5px 12px'}}>
          Coming Soon — Database Integration Pending
        </span>
      </div>
    </div>
  );
}
