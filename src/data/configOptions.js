// Build-code option lists and per-series configuration restrictions.
// Cross-config constraints (HP rotor ↔ HP cover, seal type → shaft hardening, etc.)
// are enforced as component logic since they depend on other config selections,
// not on the pump model.

export const SERIES = [
  { label: '5000 — SS Gearbox',             code: '5000', pnPrefix: '5' },
  { label: '4000A — Alum. Bearing Housing', code: '4000A', pnPrefix: '4A' },
  { label: '4000B — Alum. Gearbox',         code: '4000B', pnPrefix: '4B' },
  { label: '3000 — Steel Gearbox',           code: '3000', pnPrefix: '3' },
];

export const COVER_TYPES = [
  { label: 'Standard',                        code: '10' },
  { label: 'Drain in Cover',                  code: '11' },
  { label: 'High Pressure',                   code: '12', hp: true },
  { label: 'Port in Cover',                   code: '13' },
  { label: 'HP with Port',                    code: '14', hp: true },
  { label: 'Jacketed',                        code: '15' },
  { label: 'FoodFirst HP w/ Dual Handles',    code: '16', ff: true, hp: true },
  { label: 'FoodFirst w/ Dual Handles',       code: '17', ff: true },
  { label: 'FoodFirst HP w/o Handles',        code: '18', ff: true, hp: true },
  { label: 'FoodFirst w/o Handles',           code: '19', ff: true },
  { label: 'Vented — Integral RV',            code: '20' },
  { label: 'Vented #46 Style — Integral RV', code: '21' },
  { label: 'Swing Arm',                       code: '22' },
];

export const ROTOR_HOUSINGS = [
  { label: 'Standard Sanitary', code: '10' },
  { label: 'Plugged Outlet',    code: '11' },
  { label: 'Jacketed',         code: '15' },
];

export const CONNECTION_TYPES = [
  { label: 'Tri-Clamp',        code: 'P' },
  { label: 'ACME Thread',      code: 'L' },
  { label: 'NPT Male',         code: 'KM' },
  { label: 'NPT Female',       code: 'KF' },
  { label: 'DIN',              code: 'D' },
  { label: 'DIN Flange',       code: 'DF' },
  { label: 'ANSI Flange 150#', code: 'AF' },
  { label: 'SMS',              code: 'SMS' },
  { label: 'Aseptic Union',    code: 'AS' },
];

export const CONNECTION_SIZES = [
  { label: '3/8"', code: '037' },
  { label: '1/2"', code: '05' },
  { label: '3/4"', code: '07' },
  { label: '1.0"', code: '10' },
  { label: '1.5"', code: '15' },
  { label: '2.0"', code: '20' },
  { label: '2.5"', code: '25' },
  { label: '3.0"', code: '30' },
  { label: '4.0"', code: '40' },
  { label: '6.0"', code: '60' },
  { label: '8.0"', code: '80' },
];

// Single source of truth for all rotor options.
// cls: rotor class from sizing (null = no class restriction).
// allowsSuffix: L or HC material grade suffix valid for this rotor (SS metal only).
// hp: High Pressure variant — requires HP cover.
// ff: FoodFirst only — requires FoodFirst cover (16–19).
export const ROTOR_CODES = [
  // N60 SS (Non-Galling) — Class C
  { code:'80',  cls:'C', label:'80 — Class C, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  { code:'90',  cls:'C', label:'90 — Class C, N60 SS, non-galling, Tri-Lobe',     group:'metal', allowsSuffix:true },
  { code:'85',  cls:'C', label:'85 — Class C, N60 SS, non-galling, Bi-Lobe HP',   group:'metal', allowsSuffix:true, hp:true },
  // N60 SS — Class D
  { code:'81',  cls:'D', label:'81 — Class D, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  { code:'91',  cls:'D', label:'91 — Class D, N60 SS, non-galling, Tri-Lobe',     group:'metal', allowsSuffix:true },
  { code:'86',  cls:'D', label:'86 — Class D, N60 SS, non-galling, Bi-Lobe HP',   group:'metal', allowsSuffix:true, hp:true },
  // N60 SS — Class E
  { code:'82',  cls:'E', label:'82 — Class E, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  { code:'92',  cls:'E', label:'92 — Class E, N60 SS, non-galling, Tri-Lobe',     group:'metal', allowsSuffix:true },
  { code:'87',  cls:'E', label:'87 — Class E, N60 SS, non-galling, Bi-Lobe HP',   group:'metal', allowsSuffix:true, hp:true },
  // N60 SS — Class F
  { code:'83',  cls:'F', label:'83 — Class F, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  { code:'93',  cls:'F', label:'93 — Class F, N60 SS, non-galling, Tri-Lobe',     group:'metal', allowsSuffix:true },
  { code:'87F', cls:'F', label:'87F — Class F, N60 SS, non-galling, Bi-Lobe HP',  group:'metal', allowsSuffix:true, hp:true },
  // N60 SS — Class G
  { code:'84',  cls:'G', label:'84 — Class G, N60 SS, non-galling, Bi-Lobe',      group:'metal', allowsSuffix:true },
  // 316L SS — Class C
  { code:'60',  cls:'C', label:'60 — Class C, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  { code:'40',  cls:'C', label:'40 — Class C, 316L SS, Tri-Lobe',                 group:'metal', allowsSuffix:true },
  { code:'65',  cls:'C', label:'65 — Class C, 316L SS, Bi-Lobe HP',               group:'metal', allowsSuffix:true, hp:true },
  // 316L SS — Class D
  { code:'61',  cls:'D', label:'61 — Class D, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  { code:'41',  cls:'D', label:'41 — Class D, 316L SS, Tri-Lobe',                 group:'metal', allowsSuffix:true },
  { code:'66',  cls:'D', label:'66 — Class D, 316L SS, Bi-Lobe HP',               group:'metal', allowsSuffix:true, hp:true },
  // 316L SS — Class E
  { code:'62',  cls:'E', label:'62 — Class E, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  { code:'42',  cls:'E', label:'42 — Class E, 316L SS, Tri-Lobe',                 group:'metal', allowsSuffix:true },
  { code:'67',  cls:'E', label:'67 — Class E, 316L SS, Bi-Lobe HP',               group:'metal', allowsSuffix:true, hp:true },
  // 316L SS — Class F
  { code:'63',  cls:'F', label:'63 — Class F, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  { code:'43',  cls:'F', label:'43 — Class F, 316L SS, Tri-Lobe',                 group:'metal', allowsSuffix:true },
  // 316L SS — Class G
  { code:'64',  cls:'G', label:'64 — Class G, 316L SS, Bi-Lobe',                  group:'metal', allowsSuffix:true },
  // Alloy 88 SS
  { code:'88',  cls:'B', label:'88 — Class B, Alloy 88 SS',                       group:'metal', allowsSuffix:false },
  { code:'89',  cls:'C', label:'89 — Class C, Alloy 88 SS',                       group:'metal', allowsSuffix:false },
  // Polymer — Class A
  { code:'25',  cls:'A', label:'25 — Class A, Hydex, Bi-Lobe',                    group:'polymer', allowsSuffix:false },
  { code:'27',  cls:'A', label:'27 — Class A, Hydex, Tri-Lobe',                   group:'polymer', allowsSuffix:false },
  { code:'23',  cls:'A', label:'23 — Class A, Metal Det. Hydex',                  group:'polymer', allowsSuffix:false },
  { code:'50',  cls:'A', label:'50 — Class A, PEEK',                               group:'polymer', allowsSuffix:false },
  { code:'70',  cls:'A', label:'70 — Class A, PTFE',                               group:'polymer', allowsSuffix:false },
  { code:'72',  cls:'A', label:'72 — Class A, PTFE/SS',                            group:'polymer', allowsSuffix:false },
  { code:'52',  cls:'A', label:'52 — Class A, PolyFlex Acetal MD',                group:'polymer', allowsSuffix:false },
  // Polymer — Class B
  { code:'26',  cls:'B', label:'26 — Class B, Hydex, Bi-Lobe',                    group:'polymer', allowsSuffix:false },
  { code:'28',  cls:'B', label:'28 — Class B, Hydex, Tri-Lobe',                   group:'polymer', allowsSuffix:false },
  { code:'24',  cls:'B', label:'24 — Class B, Metal Det. Hydex',                  group:'polymer', allowsSuffix:false },
  { code:'51',  cls:'B', label:'51 — Class B, PEEK',                               group:'polymer', allowsSuffix:false },
  { code:'71',  cls:'B', label:'71 — Class B, PTFE',                               group:'polymer', allowsSuffix:false },
  { code:'73',  cls:'B', label:'73 — Class B, PTFE/SS',                            group:'polymer', allowsSuffix:false },
  // DuraCore (no class restriction)
  { code:'30',  cls:null, label:'30 — DuraCore (PTFE/SS/PTFE)',                    group:'polymer', allowsSuffix:false },
  { code:'32',  cls:null, label:'32 — DuraCore MD',                               group:'polymer', allowsSuffix:false },
  { code:'34',  cls:null, label:'34 — DuraCore HP',                               group:'polymer', allowsSuffix:false, hp:true },
  { code:'36',  cls:null, label:'36 — DuraCore HP MD',                            group:'polymer', allowsSuffix:false, hp:true },
  // FoodFirst — N60 SS only, requires FoodFirst cover (16–19)
  { code:'95',  cls:null, label:'95 — FoodFirst, N60 SS',                         group:'metal', allowsSuffix:false, ff:true },
  { code:'96',  cls:'E',  label:'96 — FoodFirst HP, Class E, N60 SS',             group:'metal', allowsSuffix:false, ff:true, hp:true },
  { code:'96F', cls:'F',  label:'96F — FoodFirst HP, Class F, N60 SS',            group:'metal', allowsSuffix:false, ff:true, hp:true },
  { code:'94',  cls:'F',  label:'94 — FoodFirst HP Tri-Lobe, Class F, N60 SS',   group:'metal', allowsSuffix:false, ff:true, hp:true },
];

// drive: 'std' | 'charlynn' | 'danfoss'
// metal: true = metal rotor shaft; false = non-metal rotor shaft
// hardened: true = satisfies O-Ring/O-LIP seal requirement
// series200300: true = only available on series 200 and 300 pumps
export const SHAFT_OPTS = [
  { label: 'Metal — Standard',              code: '10', drive: 'std',       metal: true  },
  { label: 'Metal — Hardened Seal Area',    code: '11', drive: 'std',       metal: true,  series200300: true },
  { label: 'Metal — Hardened Wear Sleeve',  code: '12', drive: 'std',       metal: true,  hardened: true, wearSleeve: true },
  { label: 'Metal — Standard Wear Sleeve',  code: '13', drive: 'std',       metal: true,  wearSleeve: true },
  { label: 'Non-Metal — Standard',          code: '15', drive: 'std',       metal: false },
  { label: 'Non-Metal — Hardened Seal Area',code: '16', drive: 'std',       metal: false, hardened: true },
  { label: 'Non-Metal — Hardened Sleeve',   code: '17', drive: 'std',       metal: false, hardened: true, wearSleeve: true },
  { label: 'Non-Metal — Standard Sleeve',   code: '18', drive: 'std',       metal: false, wearSleeve: true },
  { label: 'Charlynn + Metal — Standard',           code: '20', drive: 'charlynn', metal: true  },
  { label: 'Charlynn + Metal — Hardened Seal Area', code: '21', drive: 'charlynn', metal: true,  hardened: true },
  { label: 'Charlynn + Metal — Hardened Sleeve',    code: '22', drive: 'charlynn', metal: true,  hardened: true },
  { label: 'Charlynn + Metal — Standard Sleeve',    code: '23', drive: 'charlynn', metal: true  },
  { label: 'Charlynn + Non-Metal — Standard',       code: '25', drive: 'charlynn', metal: false },
  { label: 'Charlynn + Non-Metal — Hardened Seal',  code: '26', drive: 'charlynn', metal: false, hardened: true },
  { label: 'Charlynn + Non-Metal — Hardened Sleeve',code: '27', drive: 'charlynn', metal: false, hardened: true },
  { label: 'Charlynn + Non-Metal — Std Sleeve',     code: '28', drive: 'charlynn', metal: false },
  { label: 'Danfoss + Metal — Standard',            code: '30', drive: 'danfoss',  metal: true  },
  { label: 'Danfoss + Metal — Hardened Seal Area',  code: '31', drive: 'danfoss',  metal: true,  hardened: true },
  { label: 'Danfoss + Metal — Hardened Sleeve',     code: '32', drive: 'danfoss',  metal: true,  hardened: true },
  { label: 'Danfoss + Metal — Standard Sleeve',     code: '33', drive: 'danfoss',  metal: true  },
  { label: 'Danfoss + Non-Metal — Standard',        code: '35', drive: 'danfoss',  metal: false },
  { label: 'Danfoss + Non-Metal — Hardened Seal',   code: '36', drive: 'danfoss',  metal: false, hardened: true },
  { label: 'Danfoss + Non-Metal — Hardened Sleeve', code: '37', drive: 'danfoss',  metal: false, hardened: true },
  { label: 'Danfoss + Non-Metal — Std Sleeve',      code: '38', drive: 'danfoss',  metal: false },
];

// r200: true = excluded on series 200 pumps
// needsHardened: true = requires hardened shaft or sleeve variant
export const SEALS = [
  { label: 'Single Mech — Carbon / SS',          code: '10',   group: 'Single Mech', r200: true },
  { label: 'Single Mech — Carbon / TC',          code: '11a',  group: 'Single Mech' },
  { label: 'Single Mech — Carbon / SiC',         code: '11b',  group: 'Single Mech' },
  { label: 'Single Mech — SiC / TC',             code: '12a',  group: 'Single Mech', r200: true },
  { label: 'Single Mech — SiC / SiC',            code: '12b',  group: 'Single Mech', r200: true },
  { label: 'Single Mech — TC / TC',              code: '13',   group: 'Single Mech', r200: true },
  { label: 'Single Mech — C/SS + Flush',         code: '40',   group: 'Single Mech Flush' },
  { label: 'Single Mech — C/TC + Flush',         code: '41a',  group: 'Single Mech Flush' },
  { label: 'Single Mech — C/SiC + Flush',        code: '41b',  group: 'Single Mech Flush' },
  { label: 'Single Mech — SiC/TC + Flush',       code: '42a',  group: 'Single Mech Flush' },
  { label: 'Single Mech — SiC/SiC + Flush',      code: '42b',  group: 'Single Mech Flush' },
  { label: 'Double Mech — C/SS + C/TC',          code: '30',   group: 'Double Mech' },
  { label: 'Double Mech — SiC/TC + C/TC',        code: '31',   group: 'Double Mech' },
  { label: 'Double Mech — SiC/SiC + C/TC',       code: '32',   group: 'Double Mech' },
  { label: 'Double Mech — TC/TC',                code: '33',   group: 'Double Mech' },
  { label: 'O-LIP Seal, Double',                 code: '70',   group: 'O-LIP', needsHardened: true },
  { label: 'O-LIP Seal, Double, Front Load',     code: '70FL', group: 'O-LIP', needsHardened: true },
  { label: 'O-LIP Seal, Flushed',                code: '71',   group: 'O-LIP', needsHardened: true },
  { label: 'O-LIP Seal, Triple',                 code: '72',   group: 'O-LIP', needsHardened: true },
  { label: 'Single O-Ring',                      code: '60',   group: 'O-Ring', needsHardened: true },
  { label: 'Double O-Ring',                      code: '61',   group: 'O-Ring', needsHardened: true },
  { label: 'Double O-Ring, Front Load',          code: '61FL', group: 'O-Ring', needsHardened: true },
  { label: 'Gland Packing PTFE',                 code: '50',   group: 'Gland Packing' },
  { label: 'Gland Packing + Lantern Ring',       code: '51',   group: 'Gland Packing' },
];

export const ELASTOMERS = [
  { label: 'Viton (V)',                  code: 'V' },
  { label: 'EPDM (E)',                   code: 'E' },
  { label: 'EPDM USP Class VI (EUSP)',   code: 'EUSP' },
  { label: 'Viton USP Class VI (VUSP)',  code: 'VUSP' },
  { label: 'Buna N (N)',                 code: 'N' },
  { label: 'Silicone (S)',               code: 'S' },
  { label: 'FFKM (K)',                   code: 'K' },
  { label: 'Teflon Encapsulated Viton',  code: 'TV' },
];

export const DRIVE_TYPES = [
  { label: 'Direct Drive',              code: 'Direct Drive',              driveGroup: 'std' },
  { label: 'Compac® FMS',               code: 'Compac® FMS',               driveGroup: 'std' },
  { label: 'Gearbox',                   code: 'Gearbox',                   driveGroup: 'std' },
  { label: 'VFD Ready',                 code: 'VFD Ready',                 driveGroup: 'std' },
  { label: 'Air Motor',                 code: 'Air Motor',                 driveGroup: 'std' },
  { label: 'Hydraulic Motor — Charlynn',code: 'Hydraulic Motor — Charlynn',driveGroup: 'charlynn' },
  { label: 'Hydraulic Motor — Danfoss', code: 'Hydraulic Motor — Danfoss', driveGroup: 'danfoss' },
];

// Per-model seal allowlist: seals excluded at the series level but permitted on specific models.
// Key = seal code, value = array of model numbers (numeric) that override the series exclusion.
export const MODEL_SEAL_ALLOWLIST = {
  '60': [501, 551, 576],  // Single O-Ring — PD500 exceptions alongside PD200 series
};

// Per-model seal excludelist: seals allowed at the series level but blocked on specific models.
// Key = seal code, value = array of model numbers (numeric) that are excluded despite series availability.
export const MODEL_SEAL_EXCLUDELIST = {
  '30': [501, 551, 576],  // Double Mechanical — not available on these PD500 models
  '31': [501, 551, 576],
  '32': [501, 551, 576],
  '33': [501, 551, 576],
};

// Per-series configuration restrictions. All pumps within a series share the same
// constraints — there are no per-model variations within a series.
// excludedCovers/Housings/Seals: option codes that are NOT available for this series.
// shaftCode11: whether shaft code '11' (Hardened Seal Area) is available (200 and 300 only).
// flangeMounts: which flange mount options are available (replaces FLANGE_BY_SERIES).
export const SERIES_RESTRICTIONS = {
  200: {
    excludedSeries:    ['4000A','4000B','3000'],
    excludedCovers:    ['12','14','16','17','18','19','20','21'],
    excludedHousings:  ['15'],
    excludedSeals:     ['10','12a','12b','13','30','31','32','33','40','41a','41b','42a','42b','61','61FL','70FL','71','72'],
    shaftCode11:       true,
    wearSleeveShafts:  false,
    hydraulicShafts:   false,
    flangeMounts:      ['F1','F2'],
  },
  300: {
    excludedSeries:    ['3000'],
    excludedCovers:    ['12','14','20'],
    excludedHousings:  [],
    excludedSeals:     ['60'],
    shaftCode11:       true,
    wearSleeveShafts:  false,
    hydraulicShafts:   false,
    flangeMounts:      ['F1','F2'],
  },
  400: {
    excludedSeries:    ['3000'],
    excludedCovers:    ['20'],
    excludedHousings:  [],
    excludedSeals:     ['60'],
    shaftCode11:       false,
    wearSleeveShafts:  true,
    hydraulicShafts:   false,
    flangeMounts:      ['F2'],
  },
  500: {
    excludedSeries:    ['3000'],
    excludedCovers:    [],
    excludedHousings:  [],
    excludedSeals:     ['60'],
    shaftCode11:       false,
    wearSleeveShafts:  true,
    hydraulicShafts:   true,
    flangeMounts:      ['F1'],
  },
  600: {
    excludedSeries:    ['4000A','4000B'],
    excludedCovers:    ['20'],
    excludedHousings:  [],
    excludedSeals:     ['60','30','31','32','33'],
    shaftCode11:       false,
    wearSleeveShafts:  true,
    hydraulicShafts:   false,
    flangeMounts:      [],
  },
};
