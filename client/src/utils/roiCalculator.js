/**
 * Capital Expenditure & Factory Reconfiguration ROI Calculator
 */

export const RoiCalculator = {
  /**
   * Calculate Payback Period and NPV of layout optimization
   * @param {Object} params
   * @param {number} params.rearrangementCost Capex in USD
   * @param {number} params.monthlyMaterialHandlingSavings Monthly savings in USD
   * @param {number} params.monthlyScrapReductionSavings Monthly savings in USD
   * @param {number} params.discountRateAnnual Annual interest rate (e.g., 0.08 for 8%)
   * @param {number} params.horizonMonths Project lifespan in months
   */
  calculateRoi: ({
    rearrangementCost = 15000,
    monthlyMaterialHandlingSavings = 2200,
    monthlyScrapReductionSavings = 800,
    discountRateAnnual = 0.08,
    horizonMonths = 36
  }) => {
    const totalMonthlySavings = monthlyMaterialHandlingSavings + monthlyScrapReductionSavings;
    const paybackMonths = totalMonthlySavings > 0 ? (rearrangementCost / totalMonthlySavings) : Infinity;

    const monthlyDiscountRate = discountRateAnnual / 12;
    let npv = -rearrangementCost;

    for (let m = 1; m <= horizonMonths; m++) {
      npv += totalMonthlySavings / Math.pow(1 + monthlyDiscountRate, m);
    }

    const roiPercentage = ((totalMonthlySavings * horizonMonths - rearrangementCost) / rearrangementCost) * 100;

    return {
      paybackMonths: Number(paybackMonths.toFixed(1)),
      totalMonthlySavings: Number(totalMonthlySavings.toFixed(2)),
      npv: Number(npv.toFixed(2)),
      roiPercentage: Number(roiPercentage.toFixed(1)),
      isFeasible: npv > 0 && paybackMonths < 24
    };
  }
};

export default RoiCalculator;
