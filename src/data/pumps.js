export const LOBE_PUMPS = [
  { name:'PD200-0', disp:0.003, maxRPM:1400, maxFlow:3.0,  port:'0.5"' },
  { name:'PD200',   disp:0.008, maxRPM:1400, maxFlow:8.0,  port:'0.5" / 0.75"' },
  { name:'PD250',   disp:0.011, maxRPM:1400, maxFlow:11.0, port:'0.75"' },
  { name:'PD275',   disp:0.014, maxRPM:1400, maxFlow:14.0, port:'0.75" / 1.0"' },
  { name:'PD300',   disp:0.028, maxRPM:1000, maxFlow:28.0, port:'1.0" / 1.5"' },
  { name:'PD350',   disp:0.040, maxRPM:1000, maxFlow:40.0, port:'1.5" / 2.0"' },
  { name:'PD400',   disp:0.081, maxRPM:900,  maxFlow:72.9, port:'1.5"' },
  { name:'PD450',   disp:0.109, maxRPM:900,  maxFlow:98.1, port:'2.0"' },
  { name:'PD500',   disp:0.221, maxRPM:800,  maxFlow:176.8,port:'2.5"' },
  { name:'PD501',   disp:0.221, maxRPM:800,  maxFlow:176.8,port:'2.5"' },
  { name:'PD550',   disp:0.285, maxRPM:800,  maxFlow:228.0,port:'3.0"' },
  { name:'PD551',   disp:0.285, maxRPM:800,  maxFlow:228.0,port:'3.0"' },
  { name:'PD575',   disp:0.361, maxRPM:700,  maxFlow:252.7,port:'3.0" / 4.0"' },
  { name:'PD576',   disp:0.330, maxRPM:700,  maxFlow:231.0,port:'3.0" / 4.0"' },
  { name:'PD600',   disp:0.460, maxRPM:600,  maxFlow:276.0,port:'4.0"' },
  { name:'PD602',   disp:0.530, maxRPM:600,  maxFlow:318.0,port:'4.0"' },
  { name:'PD650',   disp:0.700, maxRPM:500,  maxFlow:350.0,port:'4.0" / 6.0"' },
  { name:'PD652',   disp:0.800, maxRPM:500,  maxFlow:400.0,port:'4.0" / 6.0"' },
  { name:'PD677',   disp:1.000, maxRPM:500,  maxFlow:500.0,port:'6.0" / 8.0"' },
];

export const GEAR_PUMPS = [
  { name:'GP200/07', disp:0.002, maxRPM:1400, maxFlow:2.8,  port:'0.5"' },
  { name:'GP200/10', disp:0.003, maxRPM:1400, maxFlow:4.2,  port:'0.75"' },
  { name:'GP175/22', disp:0.007, maxRPM:1400, maxFlow:9.8,  port:'1.0"' },
  { name:'GP175/38', disp:0.010, maxRPM:1400, maxFlow:14.0, port:'1.5"' },
  { name:'GP275/22', disp:0.007, maxRPM:1400, maxFlow:9.8,  port:'1.0"' },
  { name:'GP275/38', disp:0.010, maxRPM:1400, maxFlow:14.0, port:'1.5"' },
  { name:'GP300/28', disp:0.016, maxRPM:1200, maxFlow:19.2, port:'1.0"' },
  { name:'GP350/40', disp:0.023, maxRPM:1200, maxFlow:27.6, port:'1.5"' },
  { name:'GP375/52', disp:0.030, maxRPM:1200, maxFlow:36.0, port:'2.0"' },
];

export const ALL_PUMPS = [...LOBE_PUMPS, ...GEAR_PUMPS];

export const PUMP_ROTOR_LIMITS = {
  'PD200-0':{ A:{psi:90,tf:257},  B:{psi:90,tf:257},  C:{psi:90,tf:257},  D:{psi:150,tf:329}, E:{psi:165,tf:401}, F:{psi:200,tf:401} },
  'PD200':  { A:{psi:90,tf:257},  B:{psi:90,tf:257},  C:{psi:90,tf:257},  D:{psi:150,tf:329}, E:{psi:165,tf:401}, F:{psi:200,tf:401} },
  'PD250':  { A:{psi:90,tf:257},  B:{psi:90,tf:257},  C:{psi:90,tf:257},  D:{psi:120,tf:329}, E:{psi:150,tf:401}, F:{psi:185,tf:401} },
  'PD275':  { A:{psi:80,tf:257},  B:{psi:80,tf:257},  C:{psi:80,tf:257},  D:{psi:90,tf:329},  E:{psi:135,tf:401}, F:{psi:165,tf:401} },
  'PD300':  { A:{psi:90,tf:257},  B:{psi:90,tf:257},  C:{psi:90,tf:257},  D:{psi:165,tf:329}, E:{psi:200,tf:401}, F:{psi:250,tf:401} },
  'PD350':  { A:{psi:90,tf:257},  B:{psi:90,tf:257},  C:{psi:90,tf:257},  D:{psi:135,tf:329}, E:{psi:175,tf:401}, F:{psi:220,tf:401} },
  'PD400':  { A:{psi:150,tf:257}, B:{psi:150,tf:257}, C:{psi:150,tf:257}, D:{psi:200,tf:329}, E:{psi:220,tf:401}, F:{psi:275,tf:401} },
  'PD450':  { A:{psi:110,tf:257}, B:{psi:110,tf:257}, C:{psi:110,tf:257}, D:{psi:135,tf:329}, E:{psi:175,tf:401}, F:{psi:220,tf:401} },
  'PD500':  { A:{psi:150,tf:257}, B:{psi:150,tf:257}, C:{psi:150,tf:257}, D:{psi:250,tf:329}, E:{psi:300,tf:401}, F:{psi:375,tf:401} },
  'PD501':  { A:{psi:150,tf:257}, B:{psi:150,tf:257}, C:{psi:150,tf:257}, D:{psi:250,tf:329}, E:{psi:300,tf:401}, F:{psi:375,tf:401} },
  'PD550':  { A:{psi:150,tf:257}, B:{psi:150,tf:257}, C:{psi:150,tf:257}, D:{psi:200,tf:329}, E:{psi:225,tf:401}, F:{psi:280,tf:401} },
  'PD551':  { A:{psi:150,tf:257}, B:{psi:150,tf:257}, C:{psi:150,tf:257}, D:{psi:200,tf:329}, E:{psi:225,tf:401}, F:{psi:280,tf:401} },
  'PD575':  { A:{psi:120,tf:257}, B:{psi:120,tf:257}, C:{psi:120,tf:257}, D:{psi:150,tf:329}, E:{psi:150,tf:401}, F:{psi:185,tf:401} },
  'PD576':  { A:{psi:120,tf:257}, B:{psi:120,tf:257}, C:{psi:120,tf:257}, D:{psi:150,tf:329}, E:{psi:150,tf:401}, F:{psi:185,tf:401} },
  'PD602':  { A:{psi:200,tf:257}, B:{psi:200,tf:257}, C:{psi:200,tf:257}, D:{psi:350,tf:329}, E:{psi:500,tf:401}, F:{psi:500,tf:401} },
  'PD652':  { A:{psi:270,tf:257}, B:{psi:270,tf:257}, C:{psi:270,tf:257}, D:{psi:350,tf:329}, E:{psi:500,tf:401}, F:{psi:500,tf:401} },
};

export const GEAR_LIMITS = {
  'GP200/07':{psi:100,tf:212}, 'GP200/10':{psi:100,tf:212},
  'GP175/22':{psi:100,tf:212}, 'GP175/38':{psi:100,tf:212},
  'GP275/22':{psi:100,tf:212}, 'GP275/38':{psi:100,tf:212},
  'GP300/28':{psi:150,tf:212}, 'GP350/40':{psi:125,tf:212},
  'GP375/52':{psi:125,tf:212},
};

export const PUMP_SLIP_EQ = {
  'PD200-0':{a:0.00003,  b:-0.0076},
  'PD200':  {a:0.00008,  b:-0.0097},
  'PD250':  {a:0.0001,   b:-0.0277},
  'PD275':  {a:0.0001,   b:-0.0221},
  'PD300':  {a:0.00008,  b:-0.122},
  'PD350':  {a:0.0001,   b:-0.1305},
  'PD400':  {a:0.0016,   b:0.0428},
  'PD450':  {a:0.0011,   b:-0.1458},
  'PD500':  {a:0.0041,   b:0.008},
  'PD501':  {a:0.0041,   b:0.008},
  'PD550':  {a:0.0039,   b:-0.0679},
  'PD551':  {a:0.0039,   b:-0.0679},
  'PD575':  {a:0.0037,   b:-0.0354},
  'PD576':  {a:0.0037,   b:-0.0354},
  'PD602':  {a:0.0016,   b:0.0319},
  'PD652':  {a:0.004,    b:0.2484},
  'GP175/22':{a:0.00002, b:-0.0284},
  'GP175/38':{a:0.00002, b:-0.0284},
  'GP275/22':{a:0.0002,  b:-0.0379},
  'GP275/38':{a:0.0001,  b:-0.014},
  'GP300/28':{a:0.0003,  b:-0.012},
  'GP350/40':{a:0.0002,  b:-0.0151},
};

export const NO_SLIP_EQ = new Set(['PD600','PD650','PD677','GP200/07','GP200/10','GP375/52']);

export const PUMP_SLIP_EF = {
  'PD200-0':{E:1.31,F:1.70}, 'PD200':{E:1.31,F:1.70},
  'PD250':{E:1.31,F:1.70},   'PD275':{E:1.31,F:1.70},
  'PD300':{E:1.22,F:1.53},   'PD350':{E:1.22,F:1.53},
  'PD400':{E:1.17,F:1.38},   'PD450':{E:1.17,F:1.38},
  'PD500':{E:1.11,F:1.23},   'PD501':{E:1.11,F:1.23},
  'PD550':{E:1.11,F:1.23},   'PD551':{E:1.11,F:1.23},
  'PD575':{E:1.11,F:1.23},   'PD576':{E:1.11,F:1.23},
  'PD602':{E:1.11,F:1.23},   'PD652':{E:1.11,F:1.23},
  'PD677':{E:1.11,F:1.23},
};

export const ROTOR_DIMS = {
  'PD200-0':{id:29.87, od:52.01, depth:11.91},
  'PD450':  {id:46.73, od:108.47,depth:53.53},
};
