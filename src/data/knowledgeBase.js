export const KB_ARTICLES = [
  {id:1,title:'How Rotary Lobe Pumps Work',category:'General',pumpTypes:['Lobe','Gear'],
   summary:'Overview of positive displacement operation, rotor mechanics, and flow characteristics.',
   content:`Rotary lobe pumps are positive displacement pumps that move fluid using two or more lobed rotors that counter-rotate inside a pump casing. As the rotors turn, they create expanding cavities on the suction side, drawing fluid in. The fluid is transported around the outside of the rotors and expelled on the discharge side as the cavities contract.

Key characteristics:
• Flow is proportional to speed — doubling RPM doubles flow
• Capable of handling viscous, shear-sensitive, and particulate-laden fluids
• Self-priming when properly installed
• Reversible flow direction by reversing rotation
• Pulsation increases with fewer lobes (bi-wing has more pulsation than tri-lobe)

The PD series uses bi-wing rotors as standard, with tri-lobe available as an option for smoother flow and reduced pulsation at the cost of slightly lower displacement per revolution.`},
  {id:2,title:'Fluid Flow Fundamentals',category:'General',pumpTypes:['Lobe','Gear'],
   summary:'Reynolds number, laminar vs turbulent flow, viscosity basics, and pipe velocity guidelines.',
   content:`Understanding fluid behavior is essential for proper pump selection and system design.

Reynolds Number (Re):
Re = (density × velocity × diameter) / viscosity
• Re < 2300: Laminar flow — smooth, predictable; high friction losses
• Re 2300–4000: Transitional flow
• Re > 4000: Turbulent flow — lower friction loss per unit length

Viscosity:
• Dynamic (absolute) viscosity — cPs or mPa·s — is used in all Unibloc calculations
• Kinematic viscosity (cSt) = dynamic / density — not used directly
• Viscosity decreases with temperature for most fluids
• Shear-thinning fluids have lower viscosity at high shear rates

Recommended pipe velocities:
• Suction: 1–3 ft/s (to avoid cavitation)
• Discharge: 3–8 ft/s (to avoid excessive pressure loss)
• High-viscosity: reduce velocity limits by 30–50%`},
  {id:3,title:'NPSH — Net Positive Suction Head',category:'Sizing',pumpTypes:['Lobe','Gear'],
   summary:'NPSH fundamentals, available vs required, and prevention of cavitation.',
   content:`NPSH (Net Positive Suction Head) determines whether the pump will cavitate — a damaging condition where fluid vaporizes in the suction cavity.

NPSH Available (NPSHa) — determined by the system:
NPSHa = (Patm + Pstatic − Pvapor) / (ρg) − friction losses

NPSH Required (NPSHr) — determined by the pump:
• Published by the manufacturer from test data
• Increases with pump speed
• For positive displacement pumps, NPSHr is typically 2–5 ft at rated speed

Rule: NPSHa must exceed NPSHr by at least 2–3 ft safety margin.

Practical guidelines:
• Keep suction pipe short and as large as practical
• Avoid sharp bends and restrictions on suction side
• For hot fluids or volatile products, calculate NPSHa carefully
• Elevated tanks improve NPSHa; submerged pump inlets are ideal
• This tool does not calculate NPSH — verify critical applications manually`},
  {id:4,title:'Pump Selection Procedure',category:'Sizing',pumpTypes:['Lobe'],
   summary:'Step-by-step guide to sizing a lobe pump from process conditions to model selection.',
   content:`Standard pump selection procedure:

1. Define process conditions:
   • Required flow rate (GPM or LPM)
   • Maximum discharge pressure (PSI or Bar)
   • Fluid viscosity at process temperature (cPs)
   • Product temperature (°F or °C)

2. Calculate K Factor from viscosity (see article: Viscosity & the K Factor)

3. Determine adjusted pressure (viscosity correction on effective slip pressure)

4. For each candidate pump, calculate:
   • Slip RPM from quadratic slip equation
   • Duty RPM = (Flow / Displacement) + Slip RPM
   • Adjusted Max RPM = pump max RPM × (2 / K), minimum 25% of max RPM
   • BHP = (Pressure / 8 + K) × (Duty RPM / 1080)

5. Verify:
   • Duty RPM ≤ Adjusted Max RPM ✓
   • Flow ≤ pump max flow ✓
   • Pressure ≤ rotor class max pressure ✓
   • Temperature ≤ rotor class max temperature ✓

6. Minimum motor HP = BHP × 1.2 (20% service factor)

7. Ideal operating point: 50–70% of adjusted max RPM`},
  {id:5,title:'Rotor Class Selection Guide',category:'Sizing',pumpTypes:['Lobe'],
   summary:'Understanding classes A–F: pressure ratings, temperature limits, and slip factors.',
   content:`Rotor classes define the physical rotor material and geometry, determining pressure rating, temperature limit, and internal clearances.

Class summary:
• A, B, C — Standard service; up to 257°F; identical limits for all models
• D — Heavy duty; higher pressure rating; up to 329°F
• E — High pressure/temperature; elevated slip factor (1.11–1.31×); up to 401°F
• F — Maximum pressure/temperature; highest slip factor (1.23–1.70×); up to 401°F

Selection guidance:
• Start with Class D — covers most industrial applications
• Use Class A/B/C only when lower cost is required and pressures are modest
• Class E or F required when: temperature > 329°F, or pressure exceeds Class D limits
• Higher classes have more internal clearance → more slip → higher duty RPM
• For shear-sensitive products, avoid unnecessarily high rotor classes

The tool automatically greys out invalid classes based on process pressure and temperature.`},
  {id:6,title:'Viscosity & the K Factor',category:'Sizing',pumpTypes:['Lobe','Gear'],
   summary:'How the K factor corrects for viscosity effects on pump speed and power.',
   content:`The K Factor accounts for viscosity effects on pump performance — primarily the increased torque required to turn the pump through a viscous fluid.

K Factor formula:
L = log₁₀(max(viscosity, 1))
K = 1.263 − (0.384 × L) + (0.314 × L²) + (0.076 × L³)
K = max(K, 2.0)  ← minimum value enforced

Typical values:
• Water (1 cPs): K = 2.0 (minimum)
• 100 cPs: K ≈ 2.6
• 1,000 cPs: K ≈ 3.5
• 10,000 cPs: K ≈ 5.5

Effects of K Factor:
1. Reduces adjusted max RPM: adjMaxRPM = pumpMaxRPM × (2/K)
   → At K=2: no reduction; at K=4: 50% reduction
2. Increases BHP: BHP = (P/8 + K) × (dutyRPM/1080)
   → Higher K → more power required
3. Reduces effective slip pressure (high viscosity plugs clearances)

For very high viscosity (>10,000 cPs), verify inlet conditions and NPSH carefully — the pump may struggle to fill at higher speeds.`},
  {id:7,title:'Shaft Seal Selection Guide',category:'Seals',pumpTypes:['Lobe','Gear'],
   summary:'Single mechanical, double mechanical, lip seal, and QuickStrip — when to use each.',
   content:`Shaft seals prevent product leakage at the pump shaft. Seal selection depends on product characteristics, pressure, temperature, and hygiene requirements.

Single Mechanical Seal:
• Standard choice for most food and beverage applications
• Suitable for viscosities up to ~1,000 cPs
• Lower cost and simpler maintenance
• Requires product to be compatible with seal face materials

Double Mechanical Seal:
• Required for toxic, volatile, or high-value products
• Recommended above ~5,000 cPs viscosity
• Barrier fluid between seals prevents product leakage and lubricates faces
• Higher cost; requires barrier fluid management

Lip Seal:
• Simple, low-cost option for low-pressure applications
• Not recommended above 150 PSI or for abrasive products
• Easy field replacement
• Not acceptable for 3-A sanitary applications in most cases

QuickStrip® Mechanical Seal:
• Unibloc proprietary design for rapid seal replacement
• Tool-free removal without dismantling pump
• Ideal for applications requiring frequent CIP cycles or seal changes
• Specify when downtime cost is high

General guidelines:
• viscosity > 5,000 cPs → Double Mechanical
• viscosity > 1,000 cPs → monitor carefully; consider Double Mech
• High-pressure applications → confirm seal pressure rating
• Always confirm seal material compatibility with product`},
  {id:8,title:'Safety Equipment',category:'Installation',pumpTypes:['Lobe','Gear'],
   summary:'Relief valves, pressure gauges, and safety requirements for positive displacement pump systems.',
   content:`Positive displacement pumps can generate very high pressures if the discharge is blocked. Safety equipment is mandatory.

Relief Valve (PSV):
• REQUIRED on all PD pump installations
• Protects pump, piping, and equipment from over-pressure
• Set at 10–15% above maximum operating pressure
• Must be located on the discharge side, before any isolation valve
• Bypass type (returns flow to suction) or pop-off type
• Never throttle or block the relief valve outlet

Pressure Gauges:
• Install on both suction and discharge
• Helps identify: suction restrictions, discharge blockages, excessive pressure drop
• Use glycerin-filled gauges to dampen pulsation

Pressure Safety:
• Know the maximum system pressure before selecting a pump
• Gear pumps and lobe pumps can easily stall a motor before a relief valve opens — size motor and relief valve together

Temperature Monitoring:
• For products above 150°F, verify seal and elastomer temperature ratings
• Thermal relief may be needed on blocked lines

Electrical:
• Ensure motor overload protection matches full load amps
• VFD installations require motor rated for inverter duty
• Ground all equipment per local electrical codes`},
  {id:9,title:'Motor & Drive Selection',category:'Installation',pumpTypes:['Lobe'],
   summary:'Selecting motor HP, frame, and drive type for lobe pump applications.',
   content:`Motor and drive selection directly affects pump reliability, energy efficiency, and flexibility.

Motor Horsepower:
• Minimum motor HP = BHP × 1.2 (20% service factor)
• Round up to next standard frame: 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20 HP
• For variable viscosity, size motor for worst-case (highest viscosity) condition
• Do not undersize — an overloaded motor will fail prematurely

Drive Types:
Direct Drive:
• Simplest; pump runs at motor speed (1750 or 1450 RPM typically)
• No intermediate losses; most efficient
• Fixed speed unless combined with VFD

Gearbox:
• Reduces speed to match required duty RPM
• Ideal when duty RPM is well below motor speed
• Efficiency: 94–96%; generates heat — ensure adequate ventilation

VFD Drive (Variable Frequency Drive):
• Allows variable speed and flow control
• Use inverter-duty rated motor
• Energy savings at part load
• Best for applications requiring flow adjustment without mechanical changes

Compac® FMS:
• Unibloc integral gearmotor package
• Pre-engineered, compact, easy to specify

Air Motor:
• Suitable for hazardous (ATEX) environments
• Inherently speed-variable; stall-safe
• Less efficient than electric; requires clean, dry air supply`},
  {id:10,title:'CIP / SIP & Cleaning',category:'Maintenance',pumpTypes:['Lobe','Gear'],
   summary:'CIP and SIP compatibility, cleaning velocities, and recommended procedures.',
   content:`Hygienic pumps must be cleanable in place (CIP) or sterilizable in place (SIP) without disassembly.

CIP (Clean-In-Place):
• Minimum CIP velocity: 5 ft/s (1.5 m/s) through pump and pipework
• For lobe pumps: run pump at speed to achieve this velocity in the system
• Typical CIP sequence: pre-rinse → caustic wash → intermediate rinse → acid wash → final rinse
• CIP solution temperatures: typically 160–185°F (71–85°C) — verify against rotor class limits
• Caustic and acid concentrations per chemical supplier recommendations

SIP (Sterilize-In-Place):
• Steam at 250°F (121°C) minimum for 20+ minutes
• Class E or F rotors required for steam SIP applications
• Verify all seal and elastomer materials for steam compatibility

Best Practices:
• Always drain pump after CIP — stagnant cleaning solution is corrosive
• Inspect seals and elastomers regularly — CIP chemicals accelerate wear
• Use CIP-compatible lubricants on gearboxes and timing gear cases
• Document CIP parameters — flow, time, temperature, chemical concentration
• For aseptic applications, SIP before every production run

3-A Sanitary Standards:
• Unibloc PD series pumps are designed to 3-A standards
• Smooth internal surfaces (Ra ≤ 32 µin / 0.8 µm) minimize microbial adhesion
• All product-contact materials must be listed in 3-A standards`},
  {id:11,title:'Common Performance Issues',category:'Troubleshooting',pumpTypes:['Lobe','Gear'],
   summary:'Diagnosing low flow, noisy operation, overheating, and seal leakage.',
   content:`Common problems and their causes:

Low Flow:
• Suction restriction — check for closed valve, blocked strainer, kinked hose
• Excessive slip — worn rotors or seals, higher viscosity than specified
• Speed too low — check VFD setpoint, gearbox ratio, belt slip
• Relief valve partially open — check set pressure vs system pressure
• Air entrainment — check suction line integrity, shaft seal condition

Noisy Operation / Cavitation:
• Insufficient NPSH — suction pipe too long, too small, or head too low
• High fluid temperature reducing vapor pressure margin
• Viscous fluid causing sluggish cavity fill at high speed — reduce speed
• Worn or damaged rotors contacting housing
• Loose coupling or misalignment

Overheating:
• Fluid viscosity much higher than specified — reduces K-corrected max RPM
• Running against closed discharge — causes fluid to recirculate and heat
• Insufficient cooling (jacketed housing may be needed)
• Motor overloaded

Seal Leakage:
• Worn seal faces — inspect and replace
• Incorrect seal material for product or temperature
• Shaft runout exceeding seal tolerance — check bearing condition
• System pressure exceeding seal rating

Rotor Contact:
• Timing gear wear — rotors lose synchronization and contact
• Check timing gear lubricant level and condition
• Replace timing gears in matched sets`},
  {id:12,title:'Rotor & Gear Material Selection',category:'General',pumpTypes:['Lobe','Gear'],
   summary:'316SS, Non-Galling Alloy, Polyflex®, Polyflex MD®, and DuraCore® — properties and applications.',
   content:`Rotor material selection affects chemical compatibility, wear resistance, and product handling characteristics.

316 Stainless Steel (316SS):
• Standard material for food and beverage
• Good corrosion resistance to most CIP chemicals
• Not suitable for abrasive products or products with chlorides > 200 ppm
• FDA/3-A compliant

Non-Galling Alloy:
• Used when product or CIP chemicals could cause galling (cold welding between metal surfaces)
• Higher hardness than 316SS
• Required for dry-run protection applications
• Higher cost

Polyflex®:
• Elastomeric rotor material
• Provides gentle, low-shear pumping action
• Ideal for whole fruit, delicate emulsions, fragile cell structures
• Self-compensating for minor clearance variations
• Temperature limit lower than metal rotors — verify before specifying

Polyflex MD®:
• Enhanced Polyflex formulation
• Improved chemical resistance to aggressive CIP chemicals
• Higher temperature rating than standard Polyflex
• Preferred when frequent caustic CIP cycles are required

DuraCore®:
• Rigid composite core with elastomeric outer surface
• Combines dimensional stability of metal with gentle product handling of elastomers
• Suitable for higher pressure than standard Polyflex
• Good choice for high-viscosity products requiring positive sealing

Selection matrix (general guidance):
• Standard liquids, CIP: 316SS
• Abrasive or galling products: Non-Galling Alloy
• Fragile/delicate products: Polyflex® or DuraCore®
• Aggressive CIP with delicate products: Polyflex MD®`},
];
