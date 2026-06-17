import { describe, it, expect } from "vitest";
import { calculateImpact, getComparativeEquivalencePhrase, EMISSION_FACTORS } from "../utils/carbonCalculator.ts";

describe("EcoPulse AI Climate Metrics Calculator Tests", () => {
  
  it("should calculate correct carbon footprints for dietary entries", () => {
    // A single beef serving has high footprint (7.2 kg CO2e)
    const beefImpact = calculateImpact("diet", "beefServing", 1);
    expect(beefImpact.carbonKg).toBe(7.2);
    expect(beefImpact.waterLitres).toBe(4500); // 4500 liters of water
    expect(beefImpact.wasteKg).toBe(0.15);

    // Three vegan servings should calculate to 3 * 0.35 = 1.05
    const veganImpact = calculateImpact("diet", "veganServing", 3);
    expect(veganImpact.carbonKg).toBe(1.05);
    expect(veganImpact.waterLitres).toBe(540); // 3 * 180 = 540
  });

  it("should calculate correct outputs matching travel transit scenarios", () => {
    // 100 km transit via high-output Gas Car
    const carImpact = calculateImpact("travel", "gasCarKm", 100);
    const gasFactor = EMISSION_FACTORS.travel.gasCarKm;
    expect(carImpact.carbonKg).toBe(Number((gasFactor * 100).toFixed(2)));

    // 50 km transit via clean hybrid
    const hybridImpact = calculateImpact("travel", "hybridCarKm", 50);
    expect(hybridImpact.carbonKg).toBe(5.5); // 0.11 * 50 = 5.5
  });

  it("should handle boundary conditions and zero quantities gracefully", () => {
    const zeroImpact = calculateImpact("diet", "beefServing", 0);
    expect(zeroImpact.carbonKg).toBe(0);
    expect(zeroImpact.waterLitres).toBe(0);
    expect(zeroImpact.wasteKg).toBe(0);

    const negativeImpact = calculateImpact("travel", "gasCarKm", -5);
    expect(negativeImpact.carbonKg).toBe(0);
    expect(negativeImpact.waterLitres).toBe(0);
  });

  it("should compile accurate comparison equivalents", () => {
    const microPhrase = getComparativeEquivalencePhrase(0.1);
    expect(microPhrase).toContain("Negligible footprint");

    const highPhrase = getComparativeEquivalencePhrase(5.5);
    expect(highPhrase).toContain("Heavy footprint");
    expect(highPhrase).toContain("oak tree");
  });

  it("should map default inputs for unclassified categories", () => {
    const otherImpact = calculateImpact("other" as any, "random_key", 2);
    expect(otherImpact.carbonKg).toBe(2.4);  // 1.2 * 2
    expect(otherImpact.waterLitres).toBe(100); // 50 * 2
  });
});
