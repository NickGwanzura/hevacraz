# Sizing Tool: Fact Sheet

**Page:** `/sizing-tool`  |  **Roles with access:** `technician`, `contractor`

## Purpose
Gives a first estimate of the cooling load of a cold room or freezer, suggests the size of the main equipment and copper pipework, and includes the field calculators a technician reaches for most: superheat and subcooling, pressure-temperature lookups, leak impact and unit conversion.

## Who it's for
Technicians and contractors planning or checking a cold room, freezer or blast freezer installation.

> The load and the equipment sizes are **estimates for planning**. They do not replace a manufacturer's selection software, a site survey or a qualified refrigeration engineer. Say so to customers.

## The five calculators

| Tab | What it does |
|---|---|
| **Cooling Load Wizard** | Three steps to a cooling load in kW, then equipment and pipe sizes. |
| **Superheat & Subcooling** | Works out superheat and subcooling from gauge readings. |
| **P-T Chart** | Pressure and saturation temperature curves for four refrigerants. |
| **Leak Rate & CO2-eq** | Turns a yearly leak into tonnes of CO2-equivalent. |
| **Unit Converter** | Converts temperature, pressure, mass, airflow and energy. |

## Cooling Load Wizard

### Step 1: Dimensions
- Choose a job type (Cold Room, Freezer Room, C40, C60 or C90 Freezer) and a processing mode: **Freezing**, **Blast Freezing** or **Holding / Storage**. The job type is a label and a starting preset only. The load comes from the figures you enter, with no hidden multiplier.
- Room width, length and height in metres.
- Overall U-values for the walls, ceiling and floor, and the temperatures next to the ceiling and floor. Use the panel maker's overall U-value, not insulation conductivity. The starting figures are examples, so replace them.
- Mode-specific controls appear for blast freezing, holding and freezing, such as air temperature and velocity, defrost cycles and humidity.

### Step 2: Operating conditions
- Outdoor air temperature, humidity and site pressure.
- Product: mass, entering and final temperature, specific heat above and below freezing, freezing point, water fraction and the hours over which it is loaded.
- Infiltration airflow, internal load (people, lighting, equipment), defrost heater power and an optional design margin.

### Step 3: Summary
Shows the total load and a breakdown you can open line by line:
- **Transmission** (walls, ceiling and floor, with the area and the working shown).
- **Product load** (sensible heat above freezing, latent heat of freezing, sensible heat below freezing).
- **Infiltration**, from the moist-air enthalpy difference.
- **Internal loads** and the **daily-average defrost** load.
- The **design margin** you chose, which is 0% unless you set one.

A **Live estimate** card stays on screen while you fill in the steps, so you see the total change as you type. On a phone it is pinned at the top.

### Input checks
The wizard refuses to calculate, and says why, when:
- a dimension, U-value, specific heat or site pressure is zero or less;
- mass, airflow, internal load or defrost power is negative;
- the final product temperature is warmer than the entering one;
- water fraction is outside 0 to 1, or humidity is outside 0 to 100%;
- site pressure is outside 60 to 110 kPa, or the freezing point is outside -30 to 5 °C;
- the design margin is outside 0 to 100%, or a load period is zero.

Zero airflow or zero internal load is treated as zero, not as missing, and the tool warns you to confirm that is intended.

### Equipment and pipe sizes (indicative)
On the Summary step, under "Engineering handoff", choose:
- **Refrigerant:** R-22, R-134a, R-404A, R-290 or R-32.
- **Run time (h/day):** hours the compressor may run, 8 to 24. Default 18. The required capacity is the load scaled up for the hours it is not running.
- **Evaporator TD (K):** room air minus refrigerant temperature. Default by room temperature: 8 K at or above 0 °C, 7 K down to -25 °C, 6 K below that.
- **Condenser TD (K):** condensing temperature above outdoor air. Default 12 K.

It then shows:

| Item | What you get |
|---|---|
| Design point | Evaporating and condensing temperatures and pressures, and the pressure ratio. |
| Compressor | Capacity needed, swept volume (m³/h), estimated electrical input and COP, and a type to look at. |
| Condenser | Heat rejection in kW at the chosen TD. |
| Evaporator | Capacity, airflow (m³/h) and the air temperature drop (4 K in freezers, 6 K otherwise). |
| Expansion device | Valve capacity in kW and tons of refrigeration, a typical nominal class (with a 25% allowance), and TXV or electronic valve. |
| Copper lines | Suction, discharge and liquid line sizes as ACR tube sizes, with the velocity in each. |

The pipe sizes use these velocity limits: suction 12 m/s, discharge 15 m/s, liquid 1.2 m/s.

**Warnings** appear for poor combinations, for example R-134a at freezer temperatures (below atmospheric pressure), a very high pressure ratio, R-32 at low evaporating temperatures, flammable refrigerants (R-290 and R-32), the phase-out of R-22, the high warming potential of R-404A, low suction velocity (oil return in risers), and flow beyond the largest standard copper tube.

### How the equipment estimate is made
The refrigerant properties are estimated from standard equations, not read from a manufacturer's tables. Lines are sized on velocity only, with no pressure-drop check for your actual route and length. Compressor power is on the cautious side, so the compressor and the heat rejection can come out larger than a maker would quote. **Confirm every item in the manufacturer's selection software at your design conditions before ordering.** R-744 (CO2) is not included.

### Saving and reporting
- **Save sizing case** keeps the inputs and the load on this device. The last 20 cases are kept. They are not sent to the server.
- **Generate Engineering Report** asks for an AI review of the arithmetic and missing information, then **Download Technical Sheet** makes a PDF. The AI review needs an API key on the server. Until one is set, the report page shows a message that AI verification is unavailable, and the PDF can still be downloaded without it.
- The PDF contains: technician, job configuration, room dimensions, envelope and boundary conditions, operating conditions, calculated results, the **transmission load breakdown**, the **indicative equipment and line sizes**, design limitations, and references and sources.

## Superheat and Subcooling
- Choose the refrigerant (R-290, R-32, R-744 or R-22) and enter the suction pressure and temperature, and the liquid pressure and temperature.
- The tool looks up the saturation temperature for each pressure on its reference curve and subtracts to give superheat and subcooling.
- Superheat is shown as **Low** below 5 K, **Optimal** from 5 to 12 K and **High** above 12 K. Subcooling is **Low** below 3 K, **Optimal** from 3 to 10 K and **High** above 10 K.
- These bands are a general guide. Follow the equipment maker's figures where they differ.
- Check that the pressure you type matches the tool's labelled unit (bar) and the type of pressure the curve uses before relying on a result.

## P-T Chart
Plots pressure against saturation temperature for R-290, R-32, R-744 and R-22. Choose a refrigerant to highlight it and see its ASHRAE safety class (R-290 A3, R-32 A2L, R-744 A1). The curves are reference values for field estimates.

## Leak Rate and CO2-eq
Enter a yearly leak rate in kg and choose a refrigerant. The tool shows tonnes of CO2-equivalent (leak in kg times the gas's warming potential, divided by 1000), an everyday comparison in car journeys, and the gas's handling precautions.

## Unit Converter
| Quantity | Units |
|---|---|
| Temperature | °C, °F, K |
| Pressure | bar, psi, Pa |
| Mass | kg, lb |
| Airflow | m³/h, CFM |
| Energy | kW, BTU/h |

## Resources
The standards and handbooks behind the tool are listed on the **Resources** page (`/resources`), including ASHRAE handbook chapters, NIST REFPROP, manufacturer selection tools and Zimbabwe S.I. 49 of 2023.

## Notes for the fact sheet
- The Sizing Tool is for Technicians and Contractors only. Trainers, students, suppliers and administrators do not see it in their menus.
- The cooling load is an **average** load, not a peak design capacity. Door-opening and defrost coincidence, packaging heat, produce respiration and freezing time are not modelled. The report says so.
- Saved cases and the work in progress live in the browser. Switching devices or clearing browser data loses them.
