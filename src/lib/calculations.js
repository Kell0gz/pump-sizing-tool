import {
  ALL_PUMPS, PUMP_ROTOR_LIMITS, GEAR_LIMITS,
  PUMP_SLIP_EQ, NO_SLIP_EQ, PUMP_SLIP_EF, ROTOR_DIMS, PUMP_HP_CONST,
} from '../data/pumps.js';

export const toUS = (val, qty, units) => {
  if (units === 'US') return val;
  if (qty === 'flow') return val / 3.78541;
  if (qty === 'pressure') return val / 0.0689476;
  if (qty === 'temp') return val * 1.8 + 32;
  return val;
};

export const toDisplay = (val, qty, units) => {
  if (units === 'US') return val;
  if (qty === 'flow') return val * 3.78541;
  if (qty === 'pressure') return val * 0.0689476;
  if (qty === 'temp') return (val - 32) / 1.8;
  return val;
};

export const unitLabel = (qty, units) => {
  if (units === 'SI') {
    if (qty === 'flow') return 'LPM';
    if (qty === 'pressure') return 'Bar';
    if (qty === 'temp') return '°C';
  }
  if (qty === 'flow') return 'GPM';
  if (qty === 'pressure') return 'PSI';
  if (qty === 'temp') return '°F';
  return '';
};

export const getK = (visc) => {
  const L = Math.log10(Math.max(visc, 1));
  const K = 1.263 - 0.384*L + 0.314*L*L + 0.076*L*L*L;
  return Math.max(K, 2.0);
};

export const adjPressure = (psi, visc) => {
  let correction;
  if (visc >= 1000) correction = psi;
  else correction = 0.1486 * psi * Math.log(visc);
  return Math.max(0, psi - correction);
};

export const getSlipRPM = (pumpName, aP, slipFactor) => {
  const eq = PUMP_SLIP_EQ[pumpName];
  if (!eq) return 0;
  const isGear = pumpName.startsWith('G');
  const sf = isGear ? 1.0 : slipFactor;
  const disc = eq.b*eq.b + 4*eq.a*aP;
  if (disc < 0) return 0;
  const slip = ((-eq.b + Math.sqrt(disc)) / (2*eq.a)) * sf;
  return Math.max(0, slip);
};

export const getRC = (pump, cls) => {
  if (pump.name.startsWith('G')) {
    const lim = GEAR_LIMITS[pump.name] || {psi:100, tf:212};
    return { maxPSI: lim.psi, maxTF: lim.tf, maxBar: +(lim.psi * 0.069).toFixed(1),
             maxTC: Math.round((lim.tf-32)/1.8), slip: 1.0 };
  }
  const limits = PUMP_ROTOR_LIMITS[pump.name];
  const fallback = {psi:110, tf:257};
  const lim = limits ? (limits[cls] || fallback) : fallback;
  const ef = PUMP_SLIP_EF[pump.name];
  let slip = 1.0;
  if (cls === 'E' && ef) slip = ef.E;
  else if (cls === 'F' && ef) slip = ef.F;
  return { maxPSI: lim.psi, maxTF: lim.tf, maxBar: +(lim.psi * 0.069).toFixed(1),
           maxTC: Math.round((lim.tf-32)/1.8), slip };
};

export const calcResult = (pump, cls, flow, pressure, visc, temp, sizeOnly=false) => {
  const K = getK(visc);
  const aP = adjPressure(pressure, visc);
  const isGear = pump.name.startsWith('G');
  const rc = getRC(pump, cls);
  const slipFactor = sizeOnly ? 1.0 : rc.slip;
  const slipRPM = getSlipRPM(pump.name, aP, slipFactor);
  const dutyRPM = flow / pump.disp + slipRPM;
  const adjMaxRPM = Math.max(pump.maxRPM * (2/K), pump.maxRPM * 0.25);
  const hpConst = PUMP_HP_CONST[pump.name] || 1080;
  const bhp = (pressure/8 + K) * (dutyRPM/hpConst);
  const kw = bhp * 0.7457;
  const warnings = [];
  if (pressure > rc.maxPSI) warnings.push(`Pressure exceeds rotor class limit (${rc.maxPSI} PSI max)`);
  if (flow > pump.maxFlow) warnings.push(`Flow exceeds pump maximum (${pump.maxFlow} GPM max)`);
  if (dutyRPM > adjMaxRPM) warnings.push('RPM exceeds viscosity-adjusted limit');
  if (dutyRPM > pump.maxRPM) warnings.push(`RPM exceeds mechanical maximum (${pump.maxRPM} RPM)`);
  const dims = ROTOR_DIMS[pump.name];
  let shear = null;
  if (dims && !isGear) {
    const IR = (dims.id/2)/1000, OR = (dims.od/2)/1000, hd = (dims.depth/2)/1000;
    const gap = OR - IR;
    const vo = dutyRPM * 2*Math.PI * OR / 60;
    const vi = dutyRPM * 2*Math.PI * IR / 60;
    const vp = visc * 0.001;
    const P1 = vp * (vo/gap);
    const P2 = vp * (vi/hd);
    const P3 = vp * (vo/hd) + P1;
    shear = (P1+P2+P3)/4;
  }
  return { pump, cls, rc, isGear, slipRPM, dutyRPM, adjMaxRPM, bhp, kw, K, aP, warnings, shear };
};

export const sizePumps = (flow, pressure, visc, temp, typeFilter) => {
  return ALL_PUMPS
    .filter(p => {
      if (NO_SLIP_EQ.has(p.name)) return false;
      if (typeFilter === 'Lobe' && p.name.startsWith('G')) return false;
      if (typeFilter === 'Gear' && !p.name.startsWith('G')) return false;
      const isGear = p.name.startsWith('G');
      if (isGear) {
        const lim = GEAR_LIMITS[p.name];
        if (lim && pressure > lim.psi) return false;
      } else {
        const limits = PUMP_ROTOR_LIMITS[p.name];
        if (limits) {
          const maxPSI = Math.max(...Object.values(limits).map(v=>v.psi));
          if (pressure > maxPSI) return false;
        }
      }
      return true;
    })
    .map(p => {
      const cls = p.name.startsWith('G') ? 'A' : 'D';
      const r = calcResult(p, cls, flow, pressure, visc, temp, true);
      const score = Math.abs(r.dutyRPM/r.adjMaxRPM - 0.60);
      const nonPressureWarnings = r.warnings.filter(w => !w.includes('Pressure exceeds'));
      if (nonPressureWarnings.length > 0) return null;
      return { pump: p, cls, result: r, score };
    })
    .filter(Boolean)
    .sort((a,b) => a.score - b.score)
    .slice(0, 3);
};

export const calcFric = (dia, len, head, flow, density, visc) => {
  if (!dia || !len || !flow) return null;
  const area = Math.PI * Math.pow(dia/24, 2);
  const velocity = (flow/448.83) / area;
  const reynolds = (density * velocity * (dia/12)) / (visc * 0.000672);
  let ff;
  if (reynolds < 2300) ff = 64/reynolds;
  else ff = 0.316 / Math.pow(reynolds, 0.25);
  const headFric = ff * (len/(dia/12)) * velocity*velocity / (2*32.174);
  const pressLoss = ((headFric + (+head||0)) * density) / 144;
  return { pressLoss, reynolds, velocity };
};

export const generateSizingId = () => {
  const d = new Date();
  const ds = d.getFullYear().toString() +
    String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
  const r = Math.floor(Math.random()*9000)+1000;
  return `UNI-${ds}-${r}`;
};

export const nextMotorHP = (bhp) => {
  const standards = [0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30];
  const min = bhp * 1.2;
  return standards.find(hp => hp >= min) || Math.ceil(min);
};
