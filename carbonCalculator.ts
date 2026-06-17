/**
 * Carbon & Environment footprint calculator utility.
 * Houses state-of-the-art parameters aligned with greenhouse gas equivalents
 * and Paris Agreement targets.
 */

export interface EnvironmentalImpact {
  carbonKg: number;
  waterLitres: number;
  wasteKg: number;
  explanation: string;
}

/**
 * Standard EPA, DEFRA, and IPCC emission factors
 */
export const EMISSION_FACTORS = {
  // Travel transport limits (kg CO2e per unit)
  travel: {
    gasCarKm: 0.22,      // Standard gasoline-powered vehicle
    hybridCarKm: 0.11,   // Hybrid vehicle
    electricCarKm: 0.05, // EV (grid average)
    busKm: 0.08,         // Public transit bus passenger
    trainKm: 0.041,      // Train journey passenger
    bikeKm: 0.005,       // High intensity cycling (respiration/lifecycle)
    flightKm: 0.15,      // Standard commercial short/long haul flight average
  },
  // Food & Diet choices (kg CO2e per standard serving)
  diet: {
    beefServing: 7.2,       // Reflected 300g portion (beef has ~24kg per kg)
    chickenServing: 1.6,    // Reflected 300g portion poultry
    fishServing: 1.8,       // Reflected portion seafood
    vegetarianServing: 0.6, // Legumes, grains, eggs portion
    veganServing: 0.35,     // Complete plant based portion
    dairyServing: 1.25,     // Standard dairy serving (milk, cheese, yogurt)
  },
  // Utilities / House energy usage
  energy: {
    electricityKwh: 0.38,  // Grid emission average
    gasKwh: 0.18,          // Natural gas fuel energy
    greenEnergyKwh: 0.02,  // Solar, Wind, Hydro lifecycle emission
  },
  // Waste variables (kg CO2e per kg material)
  waste: {
    foodScraps: 1.1,       // Organic landfilled scraps anaerobically
    plasticMaterial: 1.9,  // Single use plastic bottle lifecycle average
    paperCardboard: 0.5,   // Paper processing average
  }
};

/**
 * Water footprint coefficients (Litres of fresh water per standard serving / unit)
 */
export const WATER_FACTORS = {
  diet: {
    beefServing: 4500,     // Water footprint of 300g beef is extremely high
    chickenServing: 1200,
    fishServing: 600,
    vegetarianServing: 350,
    veganServing: 180,
    dairyServing: 300,
  },
  travel: {
    gasCarKm: 0.3,         // Extraction, manufacturing refinery inputs
    hybridCarKm: 0.2,
    electricCarKm: 0.5,    // Cooling water in power generation grids
    busKm: 0.1,
    trainKm: 0.05,
    bikeKm: 0.0,
    flightKm: 0.4,
  },
  energy: {
    electricityKwh: 2.1,   // Coal/Gas cooling towers
    gasKwh: 0.5,
    greenEnergyKwh: 0.05,  // Hydro evaporation / panel washing
  },
  waste: {
    foodScraps: 15.0,      // Pre-consumer irrigation loss embedded
    plasticMaterial: 10.0, // Water used in PET bottle creation
    paperCardboard: 25.0,  // High water pull during paper pulping
  }
};

/**
 * Waste legacy inputs (kg of physical landfill material generated)
 */
export const WASTE_FACTORS = {
  diet: {
    beefServing: 0.15,
    chickenServing: 0.12,
    fishServing: 0.10,
    vegetarianServing: 0.04,
    veganServing: 0.03,
    dairyServing: 0.08,
  },
  travel: {
    gasCarKm: 0.002,
    hybridCarKm: 0.002,
    electricCarKm: 0.005, // Battery and motor rare metals
    busKm: 0.0001,
    trainKm: 0.0001,
    bikeKm: 0.00005,
    flightKm: 0.015,
  },
  energy: {
    electricityKwh: 0.005, // Coal Ash equivalent
    gasKwh: 0.001,
    greenEnergyKwh: 0.0001,
  },
  waste: {
    foodScraps: 1.0,       // Literal food mass
    plasticMaterial: 1.0,  // Standard weight conversion
    paperCardboard: 1.0,
  }
};

/**
 * Calculate absolute environmental impact for a single manual item input.
 */
export function calculateImpact(
  type: "diet" | "travel" | "energy" | "other" | "waste",
  subtype: string,
  quantity: number
): EnvironmentalImpact {
  let carbonKg = 0;
  let waterLitres = 0;
  let wasteKg = 0;
  let explanation = "";

  if (quantity <= 0) {
    return { carbonKg: 0, waterLitres: 0, wasteKg: 0, explanation: "Zero quantity logged." };
  }

  // DIET category
  if (type === "diet") {
    const key = subtype as keyof typeof EMISSION_FACTORS.diet;
    const factorCo = EMISSION_FACTORS.diet[key] || 0.6;
    const waterCo = WATER_FACTORS.diet[key] || 350;
    const wasteCo = WASTE_FACTORS.diet[key] || 0.04;

    carbonKg = factorCo * quantity;
    waterLitres = waterCo * quantity;
    wasteKg = wasteCo * quantity;
    explanation = `Diet event: ${quantity} serving(s) of ${subtype} choice. Calculated at ${factorCo} kg CO2e per serving.`;
  }
  // TRAVEL category
  else if (type === "travel") {
    const key = subtype as keyof typeof EMISSION_FACTORS.travel;
    const factorCo = EMISSION_FACTORS.travel[key] || 0.11;
    const waterCo = WATER_FACTORS.travel[key] || 0.2;
    const wasteCo = WASTE_FACTORS.travel[key] || 0.002;

    carbonKg = factorCo * quantity;
    waterLitres = waterCo * quantity;
    wasteKg = wasteCo * quantity;
    explanation = `Travel transit: ${quantity} km via ${subtype} mode. Standard carbon output coefficient is ${factorCo} kg/km.`;
  }
  // ENERGY category
  else if (type === "energy") {
    const key = subtype as keyof typeof EMISSION_FACTORS.energy;
    const factorCo = EMISSION_FACTORS.energy[key] || 0.18;
    const waterCo = WATER_FACTORS.energy[key] || 0.5;
    const wasteCo = WASTE_FACTORS.energy[key] || 0.001;

    carbonKg = factorCo * quantity;
    waterLitres = waterCo * quantity;
    wasteKg = wasteCo * quantity;
    explanation = `${quantity} kWh carbon equivalent on local utility ${subtype}. Green grid offsets may apply.`;
  }
  // WASTE category
  else if (type === "waste" || subtype === "foodScraps" || subtype === "plasticMaterial" || subtype === "paperCardboard") {
    const key = subtype as keyof typeof EMISSION_FACTORS.waste;
    const factorCo = EMISSION_FACTORS.waste[key] || 0.8;
    const waterCo = WATER_FACTORS.waste[key] || 15.0;
    const wasteCo = WASTE_FACTORS.waste[key] || 1.0;

    carbonKg = factorCo * quantity;
    waterLitres = waterCo * quantity;
    wasteKg = wasteCo * quantity;
    explanation = `Organic/Synthetic Waste: ${quantity} kg of ${subtype}. Results in post-extraction or municipal landfill emissions.`;
  }
  // OTHER category fallback
  else {
    carbonKg = 1.2 * quantity;
    waterLitres = 50 * quantity;
    wasteKg = 0.5 * quantity;
    explanation = `Unclassified custom action of scale value ${quantity}. Estimated standard factors applied.`;
  }

  return {
    carbonKg: Number(carbonKg.toFixed(2)),
    waterLitres: Number(waterLitres.toFixed(1)),
    wasteKg: Number(wasteKg.toFixed(2)),
    explanation
  };
}

/**
 * Compiles a relative natural comparison gauge for emissions.
 */
export function getComparativeEquivalencePhrase(carbonKg: number): string {
  if (carbonKg <= 0.2) {
    return "Negligible footprint. Equivalent to leaving a compact LED lightbulb on for just 2 hours.";
  }
  if (carbonKg <= 1.0) {
    return `Mild footprint. Equivalent to charging a modern laptop battery 15 times fully.`;
  }
  if (carbonKg <= 3.0) {
    return `Significant footprint. Equivalent to burning 1.5 kg of hard coal. Standard trees take 6 days to offset this.`;
  }
  const treeDays = Math.round(carbonKg * 24);
  return `Heavy footprint. Equivalent to producing a complete denim jeans garment. Requires a fully matured oak tree ${treeDays} hour(s) of continuous photosynthesizing to absorb.`;
}
