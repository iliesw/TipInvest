/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowDownUp,
  ArrowRight,
  ChartColumnDecreasing,
  Download,
  RotateCcw,
  Building,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "../Shared/ui/AnimatedNumber";
import Spinner from "../Shared/ui/Spinner";
import MarkdownRenderer from "../Shared/ui/MarkdownRenderer";
import FinancialTooltip from "../Shared/ui/FinancialTooltip";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "../ui/button";

async function Chat(prompt: string, onChunk?: (chunk: string) => void) {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCKQzob4du2lWW_10YelhHfpsM45YthEq0"
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    systemInstruction: `You are an expert real estate investment analyst. Based on the provided investment data, give specific actionable advice to maximize returns and minimize risks. Focus on concrete steps the investor should take, potential pitfalls to avoid, and strategic opportunities to explore. Include numerical targets and timing recommendations where relevant. Keep your response focused on practical guidance, limited to 4 key action points,your responce should be vry consise,max 4 sentances`,
  });

  // If no callback is provided, use the non-streaming version
  if (!onChunk) {
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  // Use streaming version when callback is provided
  const result = await model.generateContentStream(prompt);
  let fullText = "";

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;
    onChunk(fullText);
  }

  return fullText;
}

const chartConfig = (_label: string) => ({
  desktop: {
    label: _label,
    color: "orangered",
  },
});

function MetricSerction() {
  const store = useStore(Properties);
  const [chartData, setChartData] = useState<
    {
      title: string;
      icon: React.FC;
      valueD: string;
      value: number;
      chartData: any;
      prefix:string;
    }[]
  >([]);
  const [Data, setData] = useState<
    {
      IntrestRate: number;
      TotalCost: number;
      MonthlyRent: number;
      LoanAmount: number;
      Duration: number;
      Risk: number;
      Quality: number;
      Monthly: number;
      MortgagePayment: number;
      Gain: number;
      Rapport: string;
    }[]
  >([]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const sto: any = [];
      store.forEach((e, i) => {
        sto.push(e.get());
      });
      setData(sto);
    }, 500);
    return () => clearInterval(intervalId);
  }, [store]);
  useEffect(() => {
    setChartData(CalculateData());
  }, [Data]);

  const GetNext6Months = () => {
    const currentDate = new Date();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const next6Months = [];
    for (let i = 0; i < 4; i++) {
      const monthIndex = (currentDate.getMonth() + i) % months.length;
      next6Months.push(months[monthIndex]);
    }
    return next6Months;
  };

  const GetRev = () => {
    let RevT = 0;
    const RevChart = [];
    const months = GetNext6Months();

    // Loop through each data entry (each property)
    for (let i = 0; i < Data.length; i++) {
      // Monthly rental income is the primary revenue source
      RevT += Data[i].TotalCost;
    }

    const annualRate = 0.03;
    const monthlyRate = (1 + annualRate) ** (1 / 12) - 1;

    for (let i = 0; i < months.length; i++) {
      RevChart.push({
        month: months[i],
        desktop: RevT * (1 + monthlyRate) ** i,
      });
    }

    return {
      RevT: RevT,
      RevChart: RevChart,
    };
  };

  const GetCashFlow = () => {
    let RevT = 0;
    const RevChart = [];
    const months = GetNext6Months();

    // Loop through each data entry (each property)
    for (let i = 0; i < Data.length; i++) {
      // Monthly rental income is the primary revenue source
      RevT += Data[i].MortgagePayment;
    }

    const annualRate = 0.03;
    const monthlyRate = (1 + annualRate) ** (1 / 12) - 1;

    for (let i = 0; i < months.length; i++) {
      RevChart.push({
        month: months[i],
        desktop: RevT * (1 + monthlyRate) ** i,
      });
    }

    return {
      TotalCashFlow: RevT,
      CashFlowChart: RevChart,
    };
  };

  const GetRiskAdjustedReturns = () => {
    let RevT = 0;
    const RevChart = [];
    const months = GetNext6Months();

    // Loop through each data entry (each property)
    for (let i = 0; i < Data.length; i++) {
      // Monthly rental income is the primary revenue source
      RevT += (Data[i].MortgagePayment * 120) / (Data[i].TotalCost);
    }

    const annualRate = 0.09;
    const monthlyRate = (1 + annualRate) ** (1 / 12) - 1;

    for (let i = 0; i < months.length; i++) {
      RevChart.push({
        month: months[i],
        desktop: RevT * (1 + monthlyRate) ** i,
      });
    }

    return {
      TotalRiskAdjustedReturn: RevT,
      RiskChart: RevChart,
    };
  };

  const CalculateData = () => {
    return [
      {
        title: "Total Investment Value",
        icon: ArrowDownUp,
        valueD: "Based on your investment",
        value: GetRev().RevT,
        chartData: GetRev().RevChart,
        prefix:"$",
      },
      {
        title: "Total Monthly Rental Income rent",
        icon: ArrowDownUp,
        valueD: "Based on your investment",
        value: GetCashFlow().TotalCashFlow,
        chartData: GetCashFlow().CashFlowChart,
        prefix:"$",
      },
      {
        title: "Overall Gross Profitability",
        icon: ArrowDownUp,
        valueD: "Based on your investment",
        value: GetRiskAdjustedReturns().TotalRiskAdjustedReturn,
        chartData: GetRiskAdjustedReturns().RiskChart,
        prefix:"%",
      },
    ];
  };

  return (
    <div className="flex gap-[10px] mt-5 flex-row w-full">
      {chartData.map((item, index) => (
        <Metric key={index} data={item} />
      ))}
    </div>
  );
}

function Metric({
  data,
}: {
  data: {
    title: string;
    icon: any;
    valueD: string;
    value: number;
    chartData: any[];
    prefix:string;
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl bg-gray-100 border hover:bg-gray-200 transition cursor-pointer gap-10 flex flex-col justify-between items-start p-6 overflow-hidden  w-full"
    >
      <div className="flex w-full justify-between">
        <div className="flex flex-col relative">
          <p className="text-base sm:text-lg">{data.title}</p>
          <p className="absolute top-5 text-xs sm:text-sm opacity-45">
            Monthly
          </p>
        </div>
        <data.icon />
      </div>
      <div className="flex justify-between w-full items-end h-full relative gap-4 sm:gap-8">
        <div className="flex flex-col relative z-10">
          <h1 className="text-3xl sm:text-5xl">{data.value}{data.prefix}</h1>
          <p className="text-xs sm:text-sm opacity-60 my-2">{data.valueD}</p>
        </div>
        <div className="flex-grow">
          <Chart values={data.chartData} label={data.title} />
        </div>
      </div>
    </motion.div>
  );
}

export function Chart({ values, label }: { values: any[]; label: string }) {
  return (
    <div className="w-full h-full">
      <ChartContainer config={chartConfig(label)}>
        <LineChart
          accessibilityLayer
          data={values}
          margin={{
            left: 0,
            right: 0,
            top: 12,
          }}
          width={200}
          height={100}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="desktop"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
import { marked } from "marked";
// Dictionary of banks with their interest rates and features
const banksList = [
  {
    id: 1,
    name: "TipInvest Bank",
    interestRate: 7,
    description: "Our standard offering with competitive rates",
    color: "#0088FE",
  },
  {
    id: 2,
    name: "National Trust",
    interestRate: 8,
    description: "Established bank with strong security features",
    color: "#00C49F",
  },
  {
    id: 3,
    name: "Global Finance",
    interestRate: 6.5,
    description: "International bank with flexible terms",
    color: "#FFBB28",
  },
  {
    id: 4,
    name: "City Credit Union",
    interestRate: 7.2,
    description: "Community-focused with personalized service",
    color: "#FF8042",
  },
  {
    id: 5,
    name: "Premier Savings",
    interestRate: 8.5,
    description: "Premium rates for high-value investments",
    color: "#8884d8",
  },
  {
    id: 6,
    name: "Coastal Bank",
    interestRate: 6.8,
    description: "Regional bank with local expertise",
    color: "#82ca9d",
  },
];

function PropertyDiv({ data }: { data: any }) {
  const $D = useStore(data);
  const [IntrestRate, SetIntrestRate] = useState($D.IntrestRate);
  const [selectedBank, setSelectedBank] = useState(
    banksList.find((bank) => bank.interestRate === IntrestRate) || banksList[0]
  );
  const [TotalCost, SetTotalCost] = useState($D.TotalCost || $D.Capital || 0); // Coût total du projet
  const [MonthlyRent, SetMonthlyRent] = useState($D.MonthlyRent || 0); // Loyer mensuel brut
  const [LoanAmount, SetLoanAmount] = useState($D.LoanAmount || 0); // Montant du prêt
  const [Duration, SetDuration] = useState($D.Duration);
  const [riskScore, setRiskScore] = useState($D.Risk);
  const [qualityScore, setQualityScore] = useState($D.Quality);
  const [OverviewData, SetOverviewData] = useState($D.Rapport);
  const [MortgagePayment, SetMortgagePayment] = useState(0); // Mensualité du crédit à rembourser
  // Update the store whenever any property value changes
  useEffect(() => {
    const currentData = {
      TotalCost: TotalCost,
      MonthlyRent: MonthlyRent,
      LoanAmount: LoanAmount,
      Duration: Duration,
      IntrestRate: IntrestRate,
      Risk: riskScore,
      Quality: qualityScore,
      MortgagePayment: MortgagePayment,
      Gain: gain,
      Rapport: marked.parse(OverviewData),
      Bank: selectedBank.name,
    };

    data.set(currentData);
  }, [
    IntrestRate,
    TotalCost,
    MonthlyRent,
    LoanAmount,
    Duration,
    riskScore,
    qualityScore,
    MortgagePayment,
    OverviewData,
    selectedBank,
  ]);

  const propertyTypes = [
    {
      name: "House",
      returnMultiplier: 1.0,
      riskFactor: 0.7,
      appreciationRate: 0.03,
    },
    {
      name: "Apartment",
      returnMultiplier: 1.2,
      riskFactor: 0.8,
      appreciationRate: 0.025,
    },
    {
      name: "Land",
      returnMultiplier: 0.8,
      riskFactor: 1.2,
      appreciationRate: 0.04,
    },
  ];

  // Calculate investment quality (0-10 scale)
  useEffect(() => {
    // Property type factor - default to House if not specified
    const selectedPropertyType = "House"; // This would ideally come from user selection
    const propertyTypeFactor =
      propertyTypes.find((type) => type.name === selectedPropertyType)
        ?.returnMultiplier || 1.0;

    // Base quality factors
    const durationFactor = Math.min(1, Duration / 60); // Longer duration is better (up to 5 years)
    const interestFactor = 1 - IntrestRate / 20; // Lower interest rate is better

    // Rental yield factor (annual rent / property cost)
    const rentalYieldFactor =
      TotalCost > 0 ? Math.min(1.5, ((MonthlyRent * 12) / TotalCost) * 5) : 0;

    // Loan-to-value ratio factor (lower is better for quality)
    const ltvRatio = TotalCost > 0 ? LoanAmount / TotalCost : 0;
    const ltvFactor = 1 - ltvRatio * 0.5; // Lower LTV means higher quality

    // Calculate quality score (0-10 scale) with weighted components
    const qualityScore =
      (durationFactor * 2 +
        interestFactor * 2 +
        rentalYieldFactor * 3 +
        ltvFactor * 2 +
        propertyTypeFactor) /
      1.0; // Adjusted divisor to get a reasonable range

    setQualityScore(Math.min(10, Math.max(1, Math.round(qualityScore))));
  }, [
    propertyTypes,
    Duration,
    IntrestRate,
    TotalCost,
    MonthlyRent,
    LoanAmount,
  ]);

  // Calculate risk level (0-10 scale)
  useEffect(() => {
    // Property type risk factor
    const selectedPropertyType = "House"; // This would ideally come from user selection
    const propertyTypeRiskFactor =
      propertyTypes.find((type) => type.name === selectedPropertyType)
        ?.riskFactor || 0.7;

    // Risk factors
    const durationRisk = Duration > 60 ? 0.6 : Duration > 24 ? 0.8 : 1.2; // Longer duration reduces risk
    const interestRisk = IntrestRate / 15; // Higher interest rate increases risk

    // Loan-to-value ratio risk (higher ratio = higher risk)
    const ltvRatio = TotalCost > 0 ? LoanAmount / TotalCost : 0;
    const ltvRisk = ltvRatio * 5; // Higher LTV means higher risk

    // Debt service coverage ratio (DSCR) - lower is riskier
    const annualRent = MonthlyRent * 12;
    const annualMortgage = MortgagePayment * 12;
    const dscr = annualMortgage > 0 ? annualRent / annualMortgage : 3; // Default to low risk if no mortgage
    const dscrRisk = dscr < 1 ? 3 : dscr < 1.25 ? 2 : dscr < 1.5 ? 1 : 0.5;

    // Calculate risk score (0-10 scale) with weighted components
    const calculatedRiskScore =
      (durationRisk * 1.5 +
        interestRisk * 2 +
        ltvRisk * 2 +
        dscrRisk * 3 +
        propertyTypeRiskFactor * 1.5) /
      1.0; // Adjusted divisor to get a reasonable range

    // Ensure risk score is within 1-10 range and is a whole number
    const newRiskScore = Math.min(
      10,
      Math.max(1, Math.round(calculatedRiskScore))
    );

    // Only update if the risk score has actually changed
    if (newRiskScore !== riskScore) {
      setRiskScore(newRiskScore);
    }
  }, [
    Duration,
    IntrestRate,
    TotalCost,
    LoanAmount,
    MonthlyRent,
    MortgagePayment,
    propertyTypes,
    riskScore,
  ]);

  useEffect(() => {
    if (
      !LoanAmount ||
      !IntrestRate ||
      !Duration ||
      LoanAmount <= 0 ||
      IntrestRate <= 0 ||
      Duration <= 0
    ) {
      SetMortgagePayment(0);
      return;
    }

    const C = parseFloat(LoanAmount); // Capital
    const T = parseFloat(IntrestRate) / 100 / 12; // Monthly interest rate
    const N = parseFloat(Duration); // Number of months

    try {
      const numerator = C * T;
      const denominator = 1 - Math.pow(1 + T, -N);

      const M = denominator !== 0 ? numerator / denominator : 0;

      SetMortgagePayment(Math.floor(M));
    } catch (error) {
      console.error("Erreur dans le calcul de la mensualité :", error);
      SetMortgagePayment(0);
    }
  }, [IntrestRate, Duration, LoanAmount]);

  const [gain, setGain] = useState(0);
  useEffect(() => {
    // Prevent division by zero by using a default value when TotalCost is 0
    const f = TotalCost > 0 ? ((MonthlyRent * 12.0) / TotalCost) * 100.0 : 0;
    setGain(f);
  }, [MonthlyRent, TotalCost]);

  const qualityColor = `hsl(${qualityScore * 12}, 100%, 40%)`;
  const riskColor = `hsl(${(10 - riskScore) * 12}, 100%, 40%)`;

  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const Overview = async () => {
    const Data = {
      TotalCost: TotalCost,
      MonthlyRent: MonthlyRent,
      LoanAmount: LoanAmount,
      Duration: Duration,
      IntrestRate: IntrestRate,
      Risk: riskScore,
      Quality: qualityScore,
      Monthly: MonthlyRent,
      MortgagePayment: MortgagePayment,
      Gain: gain,
      Rapport: OverviewData,
    };

    setIsLoading(true);
    SetOverviewData("");

    await Chat(JSON.stringify(Data), (chunk) => {
      SetOverviewData(chunk);
    });

    setIsLoading(false);
  };

  // Rest of the component remains the same...
  return (
    <div
      className="rounded-lg hover:bg-gray-200 transition w-full bg-gray-100 gap-4 relative overflow-hidden flex flex-col md:flex-row items-start p-4 md:p-6 m-0 justify-between border   "
      style={{ borderRadius: "10px" }}
    >
      <div className="w-full flex-col flex justify-between h-full md:w-1/2 lg:w-3/5">
        <div
          className="w-full absolute h-full top-0 left-0 opacity-35"
          style={{
            background: `radial-gradient(circle at 0% 0%,${qualityColor},transparent)`,
          }}
        ></div>
        <div className="flex flex-col sm:flex-row justify-between items-start w-full relative">
          <div className="flex flex-col justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <FinancialTooltip term="Investment Quality">
                <p
                  className={`text-xs sm:text-sm px-2 sm:px-3 mb-2 py-1 w-fit rounded-full text-white`}
                  style={{ background: qualityColor }}
                >
                  Investment Quality{" "}
                  <AnimatedNumber
                    value={qualityScore}
                    suffix=" / 10"
                    duration={0.5}
                  />
                </p>
              </FinancialTooltip>
              <FinancialTooltip term="Risk Level">
                <p
                  className={`text-xs sm:text-sm px-2 sm:px-3 mb-2 py-1 w-fit rounded-full text-white`}
                  style={{ background: riskColor }}
                >
                  Risk Level{" "}
                  <AnimatedNumber
                    value={riskScore}
                    suffix=" / 10"
                    duration={0.5}
                  />
                </p>
              </FinancialTooltip>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Property
            </h1>
          </div>
        </div>
        <div className="flex flex-col mt-16 md:flex-row gap-5 justify-between w-full items-start md:items-end relative">
          <div className="flex flex-col gap-2 w-full md:w-3/5">
            {OverviewData.length > 0 ? (
              <div className="bg-[#ffffffd0] rounded-xl p-2 sm:p-3 text-sm flex flex-col">
                <div className="flex w-full mb-2 justify-between pr-2">
                  <p className="text-lg sm:text-xl font-bold">AI Report</p>
                  <button onClick={Overview} disabled={isLoading}>
                    <RotateCcw
                      size={16}
                      className={isLoading ? "animate-spin" : ""}
                    />
                  </button>
                </div>

                <div className="text-xs sm:text-sm">
                  <MarkdownRenderer markdown={OverviewData} />
                </div>
              </div>
            ) : (
              <Button
                className="bg-white rounded-full text-black hover:bg-neutral-100 w-fit group text-xs sm:text-sm"
                onClick={Overview}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <ChartColumnDecreasing className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                    Generate AI Report
                  </>
                )}
              </Button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              <div className="col-span-2">
                {/* <h3 className="text-sm font-semibold mb-1">Type de propriété</h3> */}
                {/* <InputO onChange={SetPropertyType} /> */}
              </div>

              <FinancialTooltip term="Coût total" className="w-full">
                <InputN
                  placeholder="Coût total"
                  value={TotalCost.toString()}
                  onChange={SetTotalCost}
                />
              </FinancialTooltip>

              <FinancialTooltip term="Loyer mensuel" className="w-full">
                <InputN
                  placeholder="Loyer mensuel souhiaté"
                  value={MonthlyRent.toString()}
                  onChange={SetMonthlyRent}
                />
              </FinancialTooltip>

              <FinancialTooltip term="Montant du prêt" className="w-full">
                <InputN
                  placeholder="Montant du prêt"
                  value={LoanAmount.toString()}
                  onChange={SetLoanAmount}
                />
              </FinancialTooltip>
              <InputN
                placeholder="Durée (mois)"
                value={Duration.toString()}
                onChange={SetDuration}
              />

              <div className="col-span-2">
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                    className="bg-white text-black w-full h-9 flex items-center border text-sm rounded-full py-1 px-4 justify-between"
                  >
                    <FinancialTooltip term="Interest Rate">
                      <div className="flex items-center">
                        <Building size={16} className="mr-1" />
                        {selectedBank.name} ({selectedBank.interestRate}%)
                      </div>
                    </FinancialTooltip>
                    <span>
                      <ArrowDownUp className="rotate-45" size={16} />
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute bottom-[120%] mt-1 bg-white rounded-lg shadow-lg z-20 py-1 min-w-[250px] w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {banksList.map((bank) => (
                        <button
                          key={bank.id}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                            selectedBank.id === bank.id ? "font-bold" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            SetIntrestRate(bank.interestRate);
                            setSelectedBank(bank);
                            setDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span
                                className="h-3 w-3 rounded-full mr-2"
                                style={{ backgroundColor: bank.color }}
                              ></span>
                              {bank.name}
                            </div>
                            <span className="text-gray-500">
                              {bank.interestRate}%
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto mt-4 md:mt-0">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border w-full">
              <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
                Résultats
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    1. Mensualité du crédit à rembourser
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold font-[Code] text-gray-900">
                    <FinancialTooltip term="Mensualité du crédit">
                      <AnimatedNumber
                        value={MortgagePayment}
                        prefix="$"
                        suffix=" / mois"
                        duration={0.5}
                        formatOptions={{
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                      />
                    </FinancialTooltip>
                  </h3>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    2. Rentabilité brute
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold font-[Code] text-gray-900">
                    <FinancialTooltip term="Rentabilité brute">
                      <AnimatedNumber
                        value={gain}
                        suffix="%"
                        duration={0.5}
                        formatOptions={{
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </FinancialTooltip>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full relative h-full mt-4 md:mt-0 md:w-1/2 lg:w-2/5">
        {
          <div className="bg-white flex flex-col justify-between rounded-xl p-3 sm:p-4 shadow-sm border w-full h-full">
            <h3 className="text-base sm:text-lg font-bold mb-2 sm:mb-3">
              Bank Comparison
            </h3>
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 sm:py-2 pl-3 sm:pl-0">
                      Bank
                    </th>
                    <th className="text-right py-1 sm:py-2">Rate</th>
                    <th className="text-right py-1 sm:py-2">Monthly</th>
                    <th className="text-right py-1 sm:py-2 hidden sm:table-cell">
                      Total
                    </th>
                    <th className="text-right py-1 sm:py-2">Gain %</th>
                    <th className="text-right py-1 sm:py-2 pr-3 sm:pr-0">
                      Quality
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {banksList.map((bank) => {
                    // Calculate monthly payment for this bank
                    const monthlyInterestRate =
                      bank.interestRate / 100.0 / 12.0;
                    const numberOfPayments = Duration;
                    // Use LoanAmount instead of Capital for mortgage calculation
                    const loanAmountToUse = LoanAmount > 0 ? LoanAmount : 0;
                    const numerator =
                      loanAmountToUse *
                      monthlyInterestRate *
                      Math.pow(1 + monthlyInterestRate, numberOfPayments);
                    const denominator =
                      Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
                    const baseMonthlyPayment =
                      denominator === 0 ? 0 : numerator / denominator;
                    const monthlyPayment = Math.floor(baseMonthlyPayment);
                    const totalPayment = monthlyPayment * Duration;

                    // Calculate quality score for this bank
                    // Duration factor - longer duration is better (up to 5 years)
                    const durationFactor = Math.min(1, Duration / 60);

                    // Interest factor - lower interest rate is better
                    const interestFactor = 1 - bank.interestRate / 20;

                    // Rental yield factor - higher yield is better
                    const rentalYieldFactor =
                      TotalCost > 0
                        ? Math.min(1.5, ((MonthlyRent * 12) / TotalCost) * 5)
                        : 0;

                    // Loan-to-value ratio factor - lower LTV is better for quality
                    const ltvRatio = TotalCost > 0 ? LoanAmount / TotalCost : 0;
                    const ltvFactor = 1 - ltvRatio * 0.5;

                    // Debt service coverage ratio - higher is better
                    const monthlyPaymentForDscr =
                      monthlyPayment > 0 ? monthlyPayment : 1;
                    const dscr = MonthlyRent / monthlyPaymentForDscr;
                    const dscrFactor =
                      dscr >= 1.5
                        ? 1.2
                        : dscr >= 1.25
                        ? 1.0
                        : dscr >= 1.0
                        ? 0.8
                        : 0.5;

                    // Calculate weighted quality score
                    const qualityScore =
                      (durationFactor * 1.5 + // 15% weight
                        interestFactor * 2.5 + // 25% weight
                        rentalYieldFactor * 2.5 + // 25% weight
                        ltvFactor * 2.0 + // 20% weight
                        dscrFactor * 1.5) /
                      1.0; // 15% weight

                    const bankQualityScore = Math.min(
                      10,
                      Math.max(1, Math.round(qualityScore))
                    );

                    return (
                      <tr
                        key={bank.id}
                        className={`border-b hover:bg-gray-50 ${
                          selectedBank.id === bank.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="py-1 sm:py-2 pl-3 sm:pl-0">
                          <div className="flex items-center">
                            <span
                              className="h-2 w-2 sm:h-3 sm:w-3 rounded-full mr-1 sm:mr-2"
                              style={{ backgroundColor: bank.color }}
                            ></span>
                            {bank.name}
                          </div>
                        </td>
                        <td className="text-right py-1 sm:py-2">
                          {bank.interestRate}%
                        </td>
                        <td className="text-right py-1 sm:py-2">
                          ${monthlyPayment}
                        </td>
                        <td className="text-right py-1 sm:py-2 hidden sm:table-cell">
                          ${totalPayment}
                        </td>
                        <td className="text-right py-1 sm:py-2">
                          {MonthlyRent > 0 && TotalCost > 0
                            ? (((MonthlyRent * 12) / TotalCost) * 100).toFixed(
                                2
                              ) + "%"
                            : "0.00%"}
                        </td>
                        <td className="text-right py-1 sm:py-2 pr-3 sm:pr-0">
                          <span
                            className="px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs text-white"
                            style={{
                              backgroundColor: `hsl(${
                                bankQualityScore * 12
                              }, 100%, 40%)`,
                            }}
                          >
                            {bankQualityScore}/10
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-2 sm:mt-3 text-xs text-gray-500 px-3 sm:px-0">
              <p>
                * Calculations based on current property type and investment
                amount
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { Properties } from "@/stores/Sim";
import Input from "../Shared/ui/Input";
import InputN from "../Shared/ui/InputN";

function PropertiesSection() {
  const $P = useStore(Properties);

  return (
    <div id="printable" className={`w-full gap-3 h-full flex flex-col`}>
      {$P.map((item, index) => {
        return <PropertyDiv key={index} data={item} />;
      })}
      <div
        onClick={() => {
          const PS = atom({
            IntrestRate: 7,
            TotalCost: 0,
            MonthlyRent: 0,
            LoanAmount: 0,
            Duration: 0,
            PropertyType: 0,
            Risk: 0,
            Quality: 0,
            Monthly: 0,
            MortgagePayment: 0,
            Gain: 0,
            Rapport: "",
          });
          Properties.set([...$P, PS]);
        }}
        className="rounded-lg cursor-pointer hover:bg-gray-200 transition w-full sm:w-96 h-fit bg-gray-100 relative overflow-hidden flex flex-col items-start p-4 sm:p-6 justify-between"
        style={{ borderRadius: "10px" }}
      >
        <div className="absolute top-0 left-0 w-full h-full"></div>
        <div className="flex relative w-full z-10 justify-end">
          <ArrowRight></ArrowRight>
        </div>
        <div
          className="z-10 relative h-40 flex flex-col justify-end"
          style={{ borderRadius: "10px" }}
        >
          <h1 className="text-3xl">Add Property</h1>
          <p className="text-gray-500 text-sm ">
            Add a property to see market trends
          </p>
        </div>
      </div>
    </div>
  );
}

// export default function InvestorSim({ OnBack }: { OnBack: () => void }) {
export default function InvestorSim() {
  const $P = useStore(Properties);

  const Page = (i: {
    PropertyType: string;
    Rapport: string;
    TotalCost?: string;
    MonthlyRent?: string;
    LoanAmount?: string;
    Capital: string;
    Duration: string;
    IntrestRate: string;
    Risk: string;
    Quality: string;
    Monthly: string;
    MortgagePayment?: number;
    GrossYield?: number;
    Gain: number;
  }) => {
    return (
      "<house><h1>" +
      i.PropertyType +
      " Property</h1><h2 style='margin-top:10px;margin-bottom:10px'>Ai Rapport :</h2><p>" +
      i.Rapport +
      "</p><h2 style='margin-top:10px;margin-bottom:10px'>Investissement :</h2>" +
      "<div>" +
      "<p class='stat'><b>Coût total du projet:</b> $" +
      (i.TotalCost || i.Capital) +
      "</p>" +
      "<p class='stat'><b>Loyer mensuel brut:</b> $" +
      (i.MonthlyRent || i.Monthly) +
      "</p>" +
      "<p class='stat'><b>Montant du prêt:</b> $" +
      (i.LoanAmount || i.Capital) +
      "</p>" +
      "<p class='stat'><b>Durée du crédit:</b> " +
      i.Duration +
      " mois</p>" +
      "<p class='stat'><b>Taux d'intérêt:</b> " +
      i.IntrestRate +
      "%</p>" +
      "<p class='stat'><b>Type de propriété:</b> " +
      i.PropertyType +
      "</p>" +
      "<p class='stat'><b>Mensualité du crédit:</b> $" +
      (i.MortgagePayment || 0) +
      "</p>" +
      "<p class='stat'><b>Rentabilité brute:</b> " +
      (i.Gain ? i.Gain.toFixed(2) : "0") +
      "%</p>" +
      "<p class='stat'><b>Niveau de risque:</b> " +
      i.Risk +
      "/10</p>" +
      "<p class='stat'><b>Score de qualité:</b> " +
      i.Quality +
      "/10</p>" +
      "</div>" +
      "</house>"
    );
  };

  const PrintPage = () => {
    const w = window.open("", "", "width=500");
    const P = $P.map((item) => {
      //@ts-ignore
      return Page(item.value);
    });
    w?.document.write(
      `<html><head>
      <link rel="stylesheet" href="/assets/css/fonts.css">
      <link rel="stylesheet" href="/assets/css/globals.css">
      <title>Ai Report</title></head><body>${P}
      <script>
      setTimeout(() => {
print({orientation: 'portrait'})
      },500)

      </script>
      <style>
      *{
      margin:0;
      box-sizing: border-box;
      }
      body{
        padding: 16px;
      }

      house{
        display: flex;
        flex-direction: column;
        background: #f7f7f7;
        border-radius: 10px;
        padding: 16px;
        width: 100%;
        
      }
        .stat{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        padding: 0 25px;
        font-family: 'Milk';
        font-size:20px;

        b{
        font-size:18px;
        font-family:'Figtree';
        }
        }
      </style>
      </body></html>`
    );
  };

  return (
    <>
      {/* <button className="py-4" onClick={OnBack}>
        ← Back
      </button> */}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col">
          <h1 className="text-4xl">Investor Simulator</h1>
          <p className="text-sm opacity-70">
            Overview the market trends and analyze the best properties to invest
            in.
          </p>
        </div>
        {$P.length == 0 ? (
          <div></div>
        ) : (
          <Button onClick={PrintPage} className="border">
            Downoad Reports <Download />
          </Button>
        )}
      </div>

      {$P.length == 0 ? <div></div> : <MetricSerction />}
      <br />
      <div className="overflow-y-auto h-full w-full">
        <PropertiesSection />
      </div>
    </>
  );
}
