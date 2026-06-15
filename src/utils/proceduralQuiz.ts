import { Question } from "../curriculum";

// Standard Subject ID Mapping
const SUBJECTS = ["quant", "econ", "portfolio", "corporate", "fsa", "equity", "fixed", "derivatives", "alt", "ethics"];

const SUBJECT_NAMES: Record<string, string> = {
  quant: "Quantitative Methods",
  econ: "Economics",
  portfolio: "Portfolio Management",
  corporate: "Corporate Issuers",
  fsa: "Financial Statement Analysis",
  equity: "Equity Investments",
  fixed: "Fixed Income",
  derivatives: "Derivatives",
  alt: "Alternative Investments",
  ethics: "Ethical and Professional Standards"
};

export function getProceduralQuestion(subjectId: string, difficulty: string): Question {
  // If "all" is selected, choose a random subject
  const activeSubject = subjectId === "all" ? SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)] : subjectId;
  const subjId = activeSubject || "quant";

  const randomId = `proc-${subjId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Generate based on subject
  switch (subjId) {
    case "quant":
      return generateQuantQuestion(randomId, difficulty);
    case "econ":
      return generateEconQuestion(randomId, difficulty);
    case "portfolio":
      return generatePortfolioQuestion(randomId, difficulty);
    case "corporate":
      return generateCorporateQuestion(randomId, difficulty);
    case "fsa":
      return generateFsaQuestion(randomId, difficulty);
    case "equity":
      return generateEquityQuestion(randomId, difficulty);
    case "fixed":
      return generateFixedIncomeQuestion(randomId, difficulty);
    case "derivatives":
      return generateDerivativesQuestion(randomId, difficulty);
    case "alt":
      return generateAltInvestmentsQuestion(randomId, difficulty);
    case "ethics":
    default:
      return generateEthicsQuestion(randomId, difficulty);
  }
}

// Help format options
function formatOptionsWithCorrect(correctVal: number, scale: string, formatDecimals = 2): { options: string[], correctIdx: number } {
  const deviation = correctVal * 0.15 + 0.05;
  const incorrect1 = correctVal + deviation;
  const incorrect2 = correctVal - deviation;
  const incorrect3 = correctVal * 1.5;

  const vals = [correctVal, incorrect1, incorrect2, incorrect3].map(v => `${v.toFixed(formatDecimals)}${scale}`);
  // Shuffle options
  const items = vals.map((val, idx) => ({ val, idx }));
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  
  const options = shuffled.map(s => s.val);
  const correctIdx = shuffled.findIndex(s => s.idx === 0);

  return { options, correctIdx };
}

// 1. QUANT METHODS GENERATORS
function generateQuantQuestion(id: string, diff: string): Question {
  const r = parseFloat((4 + Math.random() * 8).toFixed(2)); // annual rate 4%-12%
  const numYears = Math.floor(5 + Math.random() * 15);
  
  if (diff === "easy") {
    // Basic conversion or terminology question
    return {
      id,
      subjectId: "quant",
      moduleId: "qm-1",
      question: "Which of the following scales of measurement classifies data into mutually exclusive categories without any qualitative ranking or numeric order?",
      options: ["Ordinal scale", "Nominal scale", "Interval scale", "Ratio scale"],
      correctAnswerIndex: 1,
      explanation: "A Nominal scale simply classifies data into distinct groups with no ranking or quantitative status (e.g. Group A/Group B). Ordinal has ranking; Interval has exact numerical differences with an arbitrary zero; Ratio has a true absolute zero."
    };
  } else if (diff === "medium") {
    // EAR compounding calculation
    const compFrequency = 12; // Monthly
    const ear = (Math.pow(1 + (r / 100) / compFrequency, compFrequency) - 1) * 100;
    const { options, correctIdx } = formatOptionsWithCorrect(ear, "%", 3);

    return {
      id,
      subjectId: "quant",
      moduleId: "qm-2",
      question: `An investment product advertises an annual nominal interest rate of ${r}% with monthly compounding. What is the equivalent Effective Annual Rate (EAR)?`,
      options,
      correctAnswerIndex: correctIdx,
      explanation: `EAR is calculated using compounding frequency (m = 12). Formula: EAR = (1 + r/m)^m - 1. In this scenario, EAR = (1 + ${r / 100}/12)^12 - 1 = ${(ear / 100).toFixed(5)} = ${ear.toFixed(3)}%.`
    };
  } else {
    // Hard/Expert/Superhuman TVM calculations
    const fv = Math.floor(10000 + Math.random() * 90000); // 10k - 100k
    const discountFactor = Math.pow(1 + (r / 100), numYears);
    const pv = fv / discountFactor;
    const { options, correctIdx } = formatOptionsWithCorrect(pv, "", 0);

    return {
      id,
      subjectId: "quant",
      moduleId: "qm-3",
      question: `An institutional asset allocator must fund a lump-sum liability of $${fv.toLocaleString()} in exactly ${numYears} years. Assuming a constant annual discount rate of ${r}% compounded annually, what is the Present Value (PV) that must be allocated today?`,
      options: options.map(o => `$${parseFloat(o).toLocaleString()}`),
      correctAnswerIndex: correctIdx,
      explanation: `The Present Value is calculated by discounting the single Future Value back: PV = FV / (1 + r)^N. PV = $${fv.toLocaleString()} / (1 + ${r/100})^${numYears} = $${Math.round(pv).toLocaleString()}.`
    };
  }
}

// 2. ECONOMICS GENERATOR
function generateEconQuestion(id: string, diff: string): Question {
  if (diff === "easy" || diff === "medium") {
    return {
      id,
      subjectId: "econ",
      moduleId: "ec-1",
      question: "Which of the following is most accurate regarding the long-run market equilibrium of a firm operating in a perfectly competitive industry?",
      options: [
        "Firms produce where Price exceeds Marginal Cost and earn economic profits.",
        "Firms produce at the minimum point of their Average Total Cost curve and earn zero economic profits.",
        "Economic barrier structures prevent new capital entrances, creating long run monopoly rents.",
        "Monopolistic product differentiation allows perpetual control over output prices."
      ],
      correctAnswerIndex: 1,
      explanation: "In perfectly competitive long-run equilibrium, entry of new firms drives economic profit to zero. Firms produce where P = MC = min ATC, capturing only normal profit."
    };
  } else {
    const pIncreasePct = Math.floor(5 + Math.random() * 10); // 5%-15%
    const qDecreasePct = Math.floor(pIncreasePct * (1.2 + Math.random() * 1.5));
    const elasticity = qDecreasePct / pIncreasePct;
    const isElastic = elasticity > 1;

    return {
      id,
      subjectId: "econ",
      moduleId: "ec-2",
      question: `A consumer goods manufacturing firm measures that a price increase of ${pIncreasePct}% for its luxury line results in a corresponding reduction in quantity demanded of ${qDecreasePct}%. Calculate the absolute Price Elasticity of Demand and determine if the good is elastic or inelastic.`,
      options: [
        `Elasticity = -${elasticity.toFixed(2)} (Inelastic)`,
        `Elasticity = ${elasticity.toFixed(1)} (Unit Elastic)`,
        `Elasticity = ${elasticity.toFixed(2)} (Elastic)`,
        `Elasticity = ${(1/elasticity).toFixed(2)} (Highly Inelastic)`
      ],
      correctAnswerIndex: 2,
      explanation: `Price Elasticity of Demand is absolute % change in quantity divided by % change in price: Elasticity = |-${qDecreasePct}% / ${pIncreasePct}%| = ${elasticity.toFixed(2)}. Since this is greater than 1.0, the luxury product demonstrates elastic demand.`
    };
  }
}

// 3. PORTFOLIO MANAGEMENT GENERATOR
function generatePortfolioQuestion(id: string, diff: string): Question {
  const rf = parseFloat((2 + Math.random() * 3).toFixed(2)); // risk-free rate 2%-5%
  const mkt = parseFloat((rf + 4 + Math.random() * 6).toFixed(2)); // market return 6%-15%
  const beta = parseFloat((0.8 + Math.random() * 0.8).toFixed(2)); // Beta 0.8 - 1.6
  
  const capmReturn = rf + beta * (mkt - rf);
  const { options, correctIdx } = formatOptionsWithCorrect(capmReturn, "%");

  if (diff === "easy") {
    return {
      id,
      subjectId: "portfolio",
      moduleId: "pm-1",
      question: "According to modern portfolio theory, which of the following risks can be eliminated by constructing a widely diversified asset portfolio?",
      options: ["Systematic risk", "Market risk", "Nonsystematic risk", "Beta risk"],
      correctAnswerIndex: 2,
      explanation: "Nonsystematic risk (also called idiosyncratic, unique, or diversifiable risk) is specific to individual firms and is diversified away. Systematic risk (market risk) is non-diversifiable."
    };
  } else {
    return {
      id,
      subjectId: "portfolio",
      moduleId: "pm-2",
      question: `Using the Capital Asset Pricing Model (CAPM), calculate the expected rate of return for an equity portfolio with a Beta of ${beta}, assuming a risk-free interest rate of ${rf}% and an expected market index return of ${mkt}%.`,
      options,
      correctAnswerIndex: correctIdx,
      explanation: `CAPM expected return formula: E(R) = Rf + beta * [E(Rm) - Rf]. Under these inputs: E(R) = ${rf}% + ${beta} * (${mkt}% - ${rf}%) = ${rf}% + ${(beta * (mkt - rf)).toFixed(2)}% = ${capmReturn.toFixed(2)}%.`
    };
  }
}

// 4. CORPORATE ISSUERS GENERATOR
function generateCorporateQuestion(id: string, diff: string): Question {
  const wd = Math.floor(30 + Math.random() * 20); // debt weight 30%-50%
  const we = 100 - wd;
  const rd = parseFloat((4 + Math.random() * 3).toFixed(2)); // pretax cost of debt 4%-7%
  const tax = Math.floor(20 + Math.random() * 15); // tax rate 20%-35%
  const re = parseFloat((8 + Math.random() * 6).toFixed(2)); // cost of equity 8%-14%
  
  const wacc = (wd / 100) * rd * (1 - tax / 100) + (we / 100) * re;
  const { options, correctIdx } = formatOptionsWithCorrect(wacc, "%");

  if (diff === "easy") {
    return {
      id,
      subjectId: "corporate",
      moduleId: "ci-1",
      question: "Which of the following capital budgeting decision criteria is defined as the present value of cash inflows divided by the initial cash outlay?",
      options: ["Internal Rate of Return (IRR)", "Profitability Index (PI)", "Net Present Value (NPV)", "Payback Period"],
      correctAnswerIndex: 1,
      explanation: "The Profitability Index (PI) is the PV of future cash flows divided by the initial investment. A PI > 1.0 indicates positive Net Present Value."
    };
  } else {
    return {
      id,
      subjectId: "corporate",
      moduleId: "ci-2",
      question: `A corporation's capital structure consists of ${we}% equity and ${wd}% debt. The cost of equity is estimated at ${re}%, and the pretax cost of debt is ${rd}%. With a corporate tax rate of ${tax}%, what is the firm's Weighted Average Cost of Capital (WACC)?`,
      options,
      correctAnswerIndex: correctIdx,
      explanation: `WACC = (We * Re) + [Wd * Rd * (1 - T)]. WACC = (${we / 100} * ${re}%) + [${wd / 100} * ${rd}% * (1 - ${tax / 100})] = ${(we / 100 * re).toFixed(3)}% + ${(wd / 100 * rd * (1 - tax / 100)).toFixed(3)}% = ${wacc.toFixed(2)}%.`
    };
  }
}

// 5. FSA (FINANCIAL STATEMENT ANALYSIS) GENERATOR
function generateFsaQuestion(id: string, diff: string): Question {
  if (diff === "easy") {
    return {
      id,
      subjectId: "fsa",
      moduleId: "fsa-1",
      question: "Under US GAAP, which of the following costs must be capitalized as part of raw inventory value rather than expensed as incurred?",
      options: [
        "Selling and marketing expenses",
        "Abnormal waste of materials and labor",
        "Freight-in transportation costs",
        "Administrative general overhead"
      ],
      correctAnswerIndex: 2,
      explanation: "Freight-in transportation costs represent necessary costs to bring inventory to its present location and condition and must be capitalized under both GAAP and IFRS. Marketing and abnormal waste are expensed."
    };
  } else if (diff === "medium") {
    return {
      id,
      subjectId: "fsa",
      moduleId: "fsa-2",
      question: "Using the traditional DuPont framework, a firm's Return on Equity (ROE) formula is decomposed into which three multiplicative ratios?",
      options: [
        "Gross Margin, Asset Turnover, debt-to-equity ratio",
        "Net Profit Margin, Asset Turnover, Financial Leverage multiplier",
        "Operating Margin, Inventory Turnover, interest coverage ratio",
        "Net Profit Margin, Working Capital ratio, debt-to-assets ratio"
      ],
      correctAnswerIndex: 1,
      explanation: "Under the 3-step DuPont model: ROE = Net Profit Margin (Net Income / Revenue) * Asset Turnover (Revenue / Assets) * Financial Leverage Multiplier (Assets / Equity)."
    };
  } else {
    // Math ratio question
    const netIncome = Math.floor(50000 + Math.random() * 50000);
    const revenue = netIncome * 10;
    const assets = revenue * 0.8;
    const equity = assets / 2;
    
    const margin = (netIncome / revenue) * 100;
    const turnover = revenue / assets;
    const leverage = assets / equity;
    const roe = (netIncome / equity) * 100;
    const { options, correctIdx } = formatOptionsWithCorrect(roe, "%");

    return {
      id,
      subjectId: "fsa",
      moduleId: "fsa-3",
      question: `A retailer reports annual Revenue of $${revenue.toLocaleString()}, Net Income of $${netIncome.toLocaleString()}, Total Assets of $${assets.toLocaleString()}, and Total Equity of $${equity.toLocaleString()}. Calculate the Return on Equity (ROE) using DuPont Decomposition.`,
      options,
      correctAnswerIndex: correctIdx,
      explanation: `ROE = (Net Income / Equity) = $${netIncome.toLocaleString()} / $${equity.toLocaleString()} = ${roe.toFixed(2)}%.\nDeconstructed DuPont analysis:\n1. Net Profit Margin = Income/Revenue = ${margin.toFixed(1)}%\n2. Asset Turnover = Revenue/Assets = ${turnover.toFixed(2)}x\n3. Leverage Multiplier = Assets/Equity = ${leverage.toFixed(2)}x\nMultiplying these yields ROE = (${(margin/100).toFixed(4)} * ${turnover.toFixed(2)} * ${leverage.toFixed(2)}) = ${roe.toFixed(2)}%.`
    };
  }
}

// 6. EQUITY INVESTMENTS GENERATOR
function generateEquityQuestion(id: string, diff: string): Question {
  const d0 = parseFloat((1 + Math.random() * 3).toFixed(2)); // dividend $1 - $4
  const g = parseFloat((2 + Math.random() * 3).toFixed(2)); // dividend growth 2%-5%
  const ke = parseFloat((d0 + g + 2 + Math.random() * 5).toFixed(2)); // discount rate 6%-14%
  const d1 = d0 * (1 + g / 100);
  const p0 = d1 / ((ke - g) / 100);
  
  const { options, correctIdx } = formatOptionsWithCorrect(p0, "", 2);

  if (diff === "easy") {
    return {
      id,
      subjectId: "equity",
      moduleId: "eq-1",
      question: "An equity analysis technique that estimates the baseline cost of capital based on standard arbitrage theory is best defined as:",
      options: ["Gordon Growth model", "Capital Asset Pricing Model (CAPM)", "Arbitrage Pricing Theory (APT)", "Liquidity preference model"],
      correctAnswerIndex: 2,
      explanation: "Arbitrage Pricing Theory (APT) defines a multi-factor asset pricing model built upon no-arbitrage equilibriums. CAPM is single-factor; Gordon is a dividend discount model."
    };
  } else {
    return {
      id,
      subjectId: "equity",
      moduleId: "eq-2",
      question: `A company paid a dividend of $${d0.toFixed(2)} yesterday. Dividends are projected to grow at a constant annual rate of ${g}% indefinitely. If investors require an expected return of ${ke}%, calculate the current intrinsic value of the share using the Gordon Growth Model.`,
      options: options.map(o => `$${parseFloat(o).toFixed(2)}`),
      correctAnswerIndex: correctIdx,
      explanation: `Gordon constant dividend growth valuation: V0 = D1 / (Ke - g) = D0 * (1 + g) / (Ke - g). Here, D1 = $${d0.toFixed(2)} * (1.0${g.toString().replace(".","")}) = $${d1.toFixed(4)}. Intrinsic value V0 = $${d1.toFixed(4)} / (${ke/100} - ${g/100}) = $${p0.toFixed(2)}.`
    };
  }
}

// 7. FIXED INCOME GENERATOR
function generateFixedIncomeQuestion(id: string, diff: string): Question {
  if (diff === "easy" || diff === "medium") {
    return {
      id,
      subjectId: "fixed",
      moduleId: "fi-1",
      question: "Which of the following bonds is characteristically priced at a premium above par value relative to interest rates?",
      options: [
        "A bond whose coupon rate exceeds its required yield to maturity (YTM).",
        "A bond whose coupon rate matches its current market yield.",
        "A zero-coupon bond with five years remaining.",
        "A bond whose coupon rate falls below its required market discount rate."
      ],
      correctAnswerIndex: 0,
      explanation: "If coupon rate > YTM (required yield), investors pay more than face value to capture that higher coupon cash stream, pricing the bond at a premium. Coupon < YTM is priced at a discount; zero-coupon is always a discount."
    };
  } else {
    const couponRate = Math.floor(4 + Math.random() * 4); // 4% - 8%
    const currentPricePct = Math.floor(92 + Math.random() * 7); // 92% - 99%
    const currentYield = couponRate / (currentPricePct / 100);
    const { options, correctIdx } = formatOptionsWithCorrect(currentYield, "%");

    return {
      id,
      subjectId: "fixed",
      moduleId: "fi-2",
      question: `A corporate bond has a coupon rate of ${couponRate}% paid annually and is currently trading in secondary markets at a price of $${(currentPricePct * 10).toLocaleString()} (representing ${currentPricePct}% of par value). Calculate its Current Yield.`,
      options,
      correctAnswerIndex: correctIdx,
      explanation: `Current Yield = Annual Coupon Payment / Current Market Price. Annual Coupon per $1,000 Bond = $${couponRate * 10}. Market Price = $${currentPricePct * 10}. Current Yield = $${couponRate * 10} / $${currentPricePct * 10} = ${currentYield.toFixed(2)}%.`
    };
  }
}

// 8. DERIVATIVES GENERATOR
function generateDerivativesQuestion(id: string, diff: string): Question {
  return {
    id,
    subjectId: "derivatives",
    moduleId: "de-1",
    question: "In the context of standard options markets, which of the following is most accurate regarding the principle of put-call parity?",
    options: [
      "Fiduciary call (long call + riskless bond) must equal protective put (long put + long underlying stock).",
      "Fiduciary call (short call + long put) must equal protective put (long underlying + bond).",
      "A long collar allows risk-free arbitrage under all option pairings.",
      "An out-of-the-money call option has positive intrinsic pricing."
    ],
    correctAnswerIndex: 0,
    explanation: "Put-call parity states: C + X / (1+r)^T = P + S0. This means a Fiduciary Call (C + riskless bond X) has the identical payoff at maturity as a Protective Put (P + Stock S0), and must trade at equal current price."
  };
}

// 9. ALTERNATIVE INVESTMENTS GENERATOR
function generateAltInvestmentsQuestion(id: string, diff: string): Question {
  const cap = parseFloat((4 + Math.random() * 4).toFixed(2)); // cap rate 4%-8%
  const noi = Math.floor(100000 + Math.random() * 150000); // NOI $100k-$250k
  const value = noi / (cap / 100);
  const { options, correctIdx } = formatOptionsWithCorrect(value, "", 0);

  if (diff === "easy") {
    return {
      id,
      subjectId: "alt",
      moduleId: "ai-1",
      question: "Which of the following investment assets is categorized under Alternative Investments in standard asset selection?",
      options: ["Corporate bonds", "Blue-chip common equities", "Real estate investment trusts (REITs) and Private Equity", "Municipal notes"],
      correctAnswerIndex: 2,
      explanation: "Alternative investments include private equity, real estate, hedge funds, commodities, and infrastructure. Tradable capital debt/equity represents traditional assets."
    };
  } else {
    return {
      id,
      subjectId: "alt",
      moduleId: "ai-2",
      question: `A commercial property produces a stabilized Net Operating Income (NOI) of $${noi.toLocaleString()} per year. Commercial market capitalization rates for comparable properties are currently sitting at ${cap}%. Calculate the estimated property valuation using direct capitalization.`,
      options: options.map(o => `$${parseFloat(o).toLocaleString()}`),
      correctAnswerIndex: correctIdx,
      explanation: `Real estate Direct Capitalization value formula: Property value = NOI / Capitalization Rate. Value = $${noi.toLocaleString()} / 0.0${cap.toString().replace(".", "")} = $${Math.round(value).toLocaleString()}.`
    };
  }
}

// 10. ETHICS GENERATOR
function generateEthicsQuestion(id: string, diff: string): Question {
  return {
    id,
    subjectId: "ethics",
    moduleId: "et-1",
    question: "Under the CFA Institute Code of Ethics, which of the following actions represents a violation under Standard I(C): Misrepresentation?",
    options: [
      "Providing a full list of sources when referencing third-party historical financial models.",
      "Citing general market benchmarks without attributing standard indices directly in promotional material.",
      "Plagiarizing another researcher's economic analysis and presenting it as one's own proprietary work.",
      "Disclosing prior underperformance records of private accounts to new prospects."
    ],
    correctAnswerIndex: 2,
    explanation: "Standard I(C) Misrepresentation prohibits plagiarism (the use of another researcher's material without attribution) as well as making false promises or misstating qualifications."
  };
}
