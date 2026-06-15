import { Subject } from "./types";

export const CURRICULUM: Subject[] = [
  {
    id: "quant",
    name: "Quantitative Methods",
    weight: "6-9%",
    color: "emerald",
    modules: [
      { id: "qm-1", name: "Rates and Returns", order: 1 },
      { id: "qm-2", name: "The Time Value of Money in Finance", order: 2 },
      { id: "qm-3", name: "Statistical Measures of Asset Return", order: 3 },
      { id: "qm-4", name: "Probability Trees and Conditional Expectations", order: 4 },
      { id: "qm-5", name: "Portfolio Mathematics", order: 5 },
      { id: "qm-6", name: "Simulation Methods", order: 6 },
      { id: "qm-7", name: "Estimation and Inference", order: 7 },
      { id: "qm-8", name: "Hypothesis Testing", order: 8 },
      { id: "qm-9", name: "Parametric and Non-Parametric Tests of Independence", order: 9 },
      { id: "qm-10", name: "Simple Linear Regression", order: 10 },
      { id: "qm-11", name: "Introduction to Big Data Techniques", order: 11 }
    ]
  },
  {
    id: "econ",
    name: "Economics",
    weight: "6-9%",
    color: "blue",
    modules: [
      { id: "ec-1", name: "The Firm and Market Structures", order: 12 },
      { id: "ec-2", name: "Understanding Business Cycles", order: 13 },
      { id: "ec-3", name: "Fiscal Policy", order: 14 },
      { id: "ec-4", name: "Monetary Policy", order: 15 },
      { id: "ec-5", name: "Introduction to Geopolitics", order: 16 },
      { id: "ec-6", name: "International Trade", order: 17 },
      { id: "ec-7", name: "Capital Flows and the FX Market", order: 18 },
      { id: "ec-8", name: "Exchange Rate Calculations", order: 19 }
    ]
  },
  {
    id: "corporate",
    name: "Corporate Issuers",
    weight: "6-9%",
    color: "cyan",
    modules: [
      { id: "ci-1", name: "Organizational Forms, Corporate Issuer Features, and Ownership", order: 20 },
      { id: "ci-2", name: "Investors and Other Stakeholders", order: 21 },
      { id: "ci-3", name: "Corporate Governance: Conflicts, Mechanisms, Risks, and Benefits", order: 22 },
      { id: "ci-4", name: "Working Capital and Liquidity", order: 23 },
      { id: "ci-5", name: "Capital Investments and Capital Allocation", order: 24 },
      { id: "ci-6", name: "Capital Structure", order: 25 },
      { id: "ci-7", name: "Business Models", order: 26 }
    ]
  },
  {
    id: "fsa",
    name: "Financial Statement Analysis",
    weight: "11-14%",
    color: "indigo",
    modules: [
      { id: "fsa-1", name: "Introduction to Financial Statement Analysis", order: 27 },
      { id: "fsa-2", name: "Understanding Income Statements", order: 28 },
      { id: "fsa-3", name: "Understanding Balance Sheets", order: 29 },
      { id: "fsa-4", name: "Analyzing Statements of Cash Flow I", order: 30 },
      { id: "fsa-5", name: "Analyzing Statements of Cash Flow II", order: 31 },
      { id: "fsa-6", name: "Analysis of Inventories", order: 32 },
      { id: "fsa-7", name: "Analysis of Long-Term Assets", order: 33 },
      { id: "fsa-8", name: "Topics in Long-Term Liabilities and Equity", order: 34 },
      { id: "fsa-9", name: "Analysis of Income Taxes", order: 35 },
      { id: "fsa-10", name: "Financial Reporting Quality", order: 36 },
      { id: "fsa-11", name: "Financial Analysis Techniques", order: 37 },
      { id: "fsa-12", name: "Introduction to Financial Statement Modeling", order: 38 }
    ]
  },
  {
    id: "equity",
    name: "Equity Investments",
    weight: "11-14%",
    color: "pink",
    modules: [
      { id: "eq-1", name: "Market Organization and Structure", order: 39 },
      { id: "eq-2", name: "Security Market Indexes", order: 40 },
      { id: "eq-3", name: "Market Efficiency", order: 41 },
      { id: "eq-4", name: "Overview of Equity Securities", order: 42 },
      { id: "eq-5", name: "Company Analysis: Past and Present", order: 43 },
      { id: "eq-6", name: "Industry and Competitive Analysis", order: 44 },
      { id: "eq-7", name: "Company Analysis: Forecasting", order: 45 },
      { id: "eq-8", name: "Equity Valuation: Concepts and Basic Tools", order: 46 }
    ]
  },
  {
    id: "fixed",
    name: "Fixed Income",
    weight: "11-14%",
    color: "rose",
    modules: [
      { id: "fi-1", name: "Bond Features (Fixed-Income Instrument Features)", order: 47 },
      { id: "fi-2", name: "Types of Fixed-Income Instruments (Fixed-Income Cash Flows and Types)", order: 48 },
      { id: "fi-3", name: "Fixed-Income Issuance and Trading", order: 49 },
      { id: "fi-4", name: "Bond Markets for Corporate Issuers", order: 50 },
      { id: "fi-5", name: "Bond Markets for Government Issuers", order: 51 },
      { id: "fi-6", name: "Bond Valuation (Fixed-Income Bond Valuation: Prices and Yields)", order: 52 },
      { id: "fi-7", name: "Fixed-Rate Bonds: Yields and Yield Spreads", order: 53 },
      { id: "fi-8", name: "Floating-Rate Instruments: Yields and Yield Spreads", order: 54 },
      { id: "fi-9", name: "Term Structure of Interest Rates (Spot, Par, and Forward Curves)", order: 55 },
      { id: "fi-10", name: "Risk Associated with Bonds - Introduction (Interest Rate Risk and Return)", order: 56 },
      { id: "fi-11", name: "Yield-Based Bond Duration", order: 57 },
      { id: "fi-12", name: "Yield-Based Bond Convexity", order: 58 },
      { id: "fi-13", name: "Curve-Based and Empirical Fixed-Income Risk Measures", order: 59 },
      { id: "fi-14", name: "Credit Risk", order: 60 },
      { id: "fi-15", name: "Credit Analysis: Government Issuers", order: 61 },
      { id: "fi-16", name: "Credit Analysis: Corporate Issuers", order: 62 },
      { id: "fi-17", name: "Securitization (Fixed-Income Securitization)", order: 63 },
      { id: "fi-18", name: "Asset-Backed Securities", order: 64 },
      { id: "fi-19", name: "Mortgage-Backed Securities", order: 65 }
    ]
  },
  {
    id: "derivatives",
    name: "Derivatives",
    weight: "5-8%",
    color: "violet",
    modules: [
      { id: "de-1", name: "Derivative Instrument and Derivative Market Features", order: 66 },
      { id: "de-2", name: "Forward Commitment and Contingent Claim Features and Instruments", order: 67 },
      { id: "de-3", name: "Derivative Benefits, Risks, and Issuer and Investor Uses", order: 68 },
      { id: "de-4", name: "Arbitrage, Replication, and the Cost of Carry in Pricing Derivatives", order: 69 },
      { id: "de-5", name: "Pricing and Valuation of Forward Contracts", order: 70 },
      { id: "de-6", name: "Pricing and Valuation of Futures Contracts", order: 71 },
      { id: "de-7", name: "Pricing and Valuation of Interest Rate and Other Swaps", order: 72 },
      { id: "de-8", name: "Pricing and Valuation of Options", order: 73 },
      { id: "de-9", name: "Option Replication Using Put-Call Parity", order: 74 },
      { id: "de-10", name: "Valuing a Derivative Using a One-Period Binomial Model", order: 75 }
    ]
  },
  {
    id: "alt",
    name: "Alternative Investments",
    weight: "7-10%",
    color: "amber",
    modules: [
      { id: "ai-1", name: "Alternative Investment Features, Methods, and Structures", order: 76 },
      { id: "ai-2", name: "Alternative Investment Performance and Returns", order: 77 },
      { id: "ai-3", name: "Investments in Private Capital: Equity and Debt", order: 78 },
      { id: "ai-4", name: "Real Estate and Infrastructure", order: 79 },
      { id: "ai-5", name: "Natural Resources", order: 80 },
      { id: "ai-6", name: "Hedge Funds", order: 81 },
      { id: "ai-7", name: "Introduction to Digital Assets", order: 82 }
    ]
  },
  {
    id: "portfolio",
    name: "Portfolio Management",
    weight: "5-8%",
    color: "teal",
    modules: [
      { id: "pm-1", name: "Portfolio Risk & Return: Part I", order: 83 },
      { id: "pm-2", name: "Portfolio Risk & Return: Part II", order: 84 },
      { id: "pm-3", name: "Portfolio Management: An Overview", order: 85 },
      { id: "pm-4", name: "Basics of Portfolio Planning & Construction", order: 86 },
      { id: "pm-5", name: "The Behavioral Biases of Individuals", order: 87 },
      { id: "pm-6", name: "Introduction to Risk Management", order: 88 }
    ]
  },
  {
    id: "ethics",
    name: "Ethical and Professional Standards",
    weight: "15-20%",
    color: "purple",
    modules: [
      { id: "et-1", name: "Ethics and Trust in the Investment Profession", order: 89 },
      { id: "et-2", name: "Code of Ethics and Standards of Professional Conduct", order: 90 },
      { id: "et-3", name: "Guidance for Standards I-VII", order: 91 },
      { id: "et-4", name: "Introduction to the Global Investment Performance Standards (GIPS)", order: 92 },
      { id: "et-5", name: "Ethics Application", order: 93 }
    ]
  }
];

// Flat list for easy key operations
export const FLAT_MODULES = CURRICULUM.flatMap(subj => 
  subj.modules.map(mod => ({
    ...mod,
    subjectId: subj.id,
    subjectName: subj.name,
    color: subj.color,
    weight: subj.weight
  }))
);

export function getModuleById(id: string) {
  return FLAT_MODULES.find(m => m.id === id);
}

// Generate some sample practice questions for each subject
export interface Question {
  id: string;
  subjectId: string;
  moduleId: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q-qm-1",
    subjectId: "quant",
    moduleId: "qm-1",
    question: "An investor places $10,000 into a mutual fund with an annual nominal rate of 6% compounded monthly. What is the effective annual rate (EAR)?",
    options: ["6.00%", "6.17%", "6.18%", "6.24%"],
    correctAnswerIndex: 1,
    explanation: "EAR = (1 + r/m)^m - 1 = (1 + 0.06/12)^12 - 1 = (1.005)^12 - 1 ≈ 6.1678% ≈ 6.17%."
  },
  {
    id: "q-qm-2",
    subjectId: "quant",
    moduleId: "qm-2",
    question: "Which of the following is most accurate regarding the Time Value of Money?",
    options: [
      "The value of a future dollar increases as the discount rate increases.",
      "The present value of a future cash flow decreases as the discount rate increases.",
      "An annuity due has cash flows at the end of each compounding period.",
      "A perpetuity has a finite lifespan."
    ],
    correctAnswerIndex: 1,
    explanation: "Present value is inversely related to the discount rate. As the discount rate increases, present value decreases. An annuity due has cash flows at the beginning of each period, and perpetuities are infinite."
  },
  {
    id: "q-ec-1",
    subjectId: "econ",
    moduleId: "ec-1",
    question: "If the price of a good increases by 10% and the quantity demanded decreases by 20%, the good's price elasticity of demand is:",
    options: ["Perfectely inelastic", "Inelastic", "Elastic", "Unit elastic"],
    correctAnswerIndex: 2,
    explanation: "Price elasticity of demand = % change in quantity demanded / % change in price = -20% / 10% = -2.0. Since the absolute value is greater than 1, it is elastic."
  },
  {
    id: "q-ec-2",
    subjectId: "econ",
    moduleId: "ec-2",
    question: "Which market structure is characterized by a single unique seller, no close substitutes, and extremely high barriers to entry?",
    options: ["Monopolistic competition", "Oligopoly", "Pure monopoly", "Perfect competition"],
    correctAnswerIndex: 2,
    explanation: "A pure monopoly is characterized by a single producer of a good with no close substitutes and very high blockades to entrance."
  },
  {
    id: "q-fsa-1",
    subjectId: "fsa",
    moduleId: "fsa-3",
    question: "Which of the following would be classified as an operating activity under US GAAP but could be operating or financing under IFRS?",
    options: [
      "Payment of dividends",
      "Receipt of interest",
      "Purchase of equipment",
      "Payment of taxes"
    ],
    correctAnswerIndex: 1,
    explanation: "Under US GAAP, interest received must be classified as an operating activity. Under IFRS, interest received can be either operating or investing."
  },
  {
    id: "q-fsa-2",
    subjectId: "fsa",
    moduleId: "fsa-5",
    question: "An analyst discovers that a firm capitalized a cost that should have been expensed. Under US GAAP, compared to correct expensing, this error results in:",
    options: [
      "Higher cash flow from operations and higher net income in the current year.",
      "Lower cash flow from investing and lower net income in the current year.",
      "Higher cash flow from investing and higher net income in the current year.",
      "No change to net income but higher cash flow from operations."
    ],
    correctAnswerIndex: 0,
    explanation: "Capitalization moves the cash flow from Operating Activities to Investing Activities (re-classified as CAPEX), thus boosting current Operating Cash Flow. Expensing capital increases expenses, lowering current Net Income; hence, capitalization results in higher net income."
  },
  {
    id: "q-equity-1",
    subjectId: "equity",
    moduleId: "eq-4",
    question: "Which of the following equity security types represents direct ownership in a firm with dividends paid at the discretion of the board and residual claim on assets?",
    options: ["Preferred share", "Common share", "Participating preferred share", "Treasury share"],
    correctAnswerIndex: 1,
    explanation: "Common shares represent ownership, have residual claim on assets during liquidation, and get discretionary dividends voted by the Board of Directors."
  },
  {
    id: "q-fixed-1",
    subjectId: "fixed",
    moduleId: "fi-3",
    question: "A bond has a coupon rate of 5%, pays interest semi-annually, and has 10 years to maturity. If the yield to maturity (YTM) is 6%, the bond will trade at:",
    options: ["A discount", "Par", "A premium", "Face value"],
    correctAnswerIndex: 0,
    explanation: "If YTM (6%) > Coupon Rate (5%), investors require a higher return than what the coupon offers. Therefore, the bond price must drop below its par value to sell at a discount."
  },
  {
    id: "q-derivatives-1",
    subjectId: "derivatives",
    moduleId: "de-2",
    question: "What is the difference between an forward contract and a futures contract?",
    options: [
      "Forwards are standardized, while futures are highly customized.",
      "Forwards trade on exchanges, whereas futures are over-the-counter (OTC).",
      "Futures are marked-to-market daily, while forwards are settled only at maturity.",
      "Forwards have zero default risk, whereas futures have significant counterparty risk."
    ],
    correctAnswerIndex: 2,
    explanation: "Futures are standardized contract units traded on exchanges and marked-to-market daily with margin accounts. Forwards are custom credit agreements over-the-counter with single settlement at maturity."
  },
  {
    id: "q-ethics-1",
    subjectId: "ethics",
    moduleId: "et-2",
    question: "According to the CFA Institute Standards of Professional Conduct, an analyst who receives a material nonpublic tip represents a violation if they trade on it. This refers to Standard:",
    options: ["I(A) Knowledge of the Law", "II(A) Material Nonpublic Information", "III(B) Fair Dealing", "VI(A) Disclosure of Conflicts"],
    correctAnswerIndex: 1,
    explanation: "Standard II(A) Material Nonpublic Information forbids members who possess material nonpublic information from trading or causing others to trade on that information."
  }
];
