import { adjPressure, getSlipRPM } from '../lib/calculations.js';

export default function PumpCurve({ result, width = 340, height = 210 }) {
  if (!result) return null;
  const { pump, slipRPM, dutyRPM, adjMaxRPM } = result;
  const PAD = {top:24, right:20, bottom:36, left:52};
  const W = width - PAD.left - PAD.right;
  const H = height - PAD.top - PAD.bottom;
  const maxRPM = pump.maxRPM;
  const maxFlow = pump.maxFlow * 1.1;
  const rpmToX = r => (r/maxRPM)*W;
  const flowToY = f => H - (f/maxFlow)*H;
  const points = [];
  for (let rpm = 0; rpm <= maxRPM; rpm += maxRPM/60) {
    const slip = Math.max(0, getSlipRPM(pump.name, adjPressure(0, 1), 1));
    const f = Math.max(0, (rpm - slip) * pump.disp);
    points.push([rpmToX(rpm), flowToY(f)]);
  }
  const pathD = points.map((p,i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const adjX = rpmToX(adjMaxRPM);
  const dutyX = rpmToX(dutyRPM);
  const dutyY = flowToY(Math.max(0,(dutyRPM-slipRPM)*pump.disp));
  const ticks = 5;
  return (
    <svg width={width} height={height} style={{display:'block',borderRadius:6,background:'var(--gray-light)',border:'1px solid var(--gray-border)'}}>
      <g transform={`translate(${PAD.left},${PAD.top})`}>
        {Array.from({length:ticks+1},(_,i)=>{
          const y = (i/ticks)*H;
          const v = ((1-i/ticks)*maxFlow).toFixed(0);
          return <g key={i}>
            <line x1={0} y1={y} x2={W} y2={y} stroke="var(--gray-border)" strokeWidth={0.8}/>
            <text x={-5} y={y+4} fontSize={9} fill="var(--gray)" textAnchor="end" fontFamily="DM Mono">{v}</text>
          </g>;
        })}
        {Array.from({length:ticks+1},(_,i)=>{
          const x = (i/ticks)*W;
          const v = Math.round((i/ticks)*maxRPM);
          return <g key={i}>
            <line x1={x} y1={0} x2={x} y2={H} stroke="var(--gray-border)" strokeWidth={0.8}/>
            <text x={x} y={H+14} fontSize={9} fill="var(--gray)" textAnchor="middle" fontFamily="DM Mono">{v}</text>
          </g>;
        })}
        {adjMaxRPM < maxRPM && <>
          <rect x={adjX} y={0} width={W-adjX} height={H} fill="rgba(200,16,46,0.07)"/>
          <line x1={adjX} y1={0} x2={adjX} y2={H} stroke="var(--red)" strokeWidth={1.5} strokeDasharray="4,3"/>
          <text x={adjX+3} y={10} fontSize={8} fill="var(--red)" fontWeight="700">Adj Max</text>
        </>}
        <path d={pathD} fill="none" stroke="var(--steel)" strokeWidth={2}/>
        <circle cx={dutyX} cy={dutyY} r={6} fill="var(--red)" stroke="white" strokeWidth={2}/>
        <text x={dutyX+9} y={dutyY+4} fontSize={9} fill="var(--red-dark)" fontWeight="700" fontFamily="DM Mono">
          {Math.round(Math.max(0,(dutyRPM-slipRPM)*pump.disp))} GPM @ {Math.round(dutyRPM)} RPM
        </text>
        <text x={-38} y={H/2} fontSize={9} fill="var(--gray)" textAnchor="middle"
              transform={`rotate(-90,-38,${H/2})`}>Flow (GPM)</text>
        <text x={W/2} y={H+26} fontSize={9} fill="var(--gray)" textAnchor="middle">Speed (RPM)</text>
      </g>
    </svg>
  );
}
