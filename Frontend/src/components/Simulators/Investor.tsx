/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ArrowDownUp,
  ArrowRight,
  Calendar,
  ChartColumnDecreasing,
  DollarSign,
  Dot,
  Ellipsis,
  RotateCcw,
  Sparkle,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { use, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import InputR from "../Shared/ui/InputR";
import InputO from "../Shared/ui/InputO";
import AnimatedNumber from "../Shared/ui/AnimatedNumber";
import TypeWriter from "../Shared/ui/TypeWriter";
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
    model: "gemini-2.0-pro-exp-02-05",
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

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 205 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = (_label: string) => ({
  desktop: {
    label: _label,
    color: "hsl(var(--chart-1))",
  },
});

function MetricSerction() {
  const store = useStore(Properties);
  const [chartData, setChartData] = useState([]);
  const Data = useMemo(() => {
    return store.map((element: { get: () => any }) => element.get());
  }, [store]);

  const GetNext6Mounths = () => {
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
    const months = GetNext6Mounths();

    // Initialize RevChart with months and desktop revenue set to 0
    for (let i = 0; i < months.length; i++) {
      RevChart.push({ month: months[i], desktop: 0 });
    }

    // Loop through each data entry (each property)
    for (let i = 0; i < Data.length; i++) {
      for (let t = 0; t < RevChart.length; t++) {
        const R = Math.floor(
          Data[i].Capital * Math.pow(1 + Data[i].IntrestRate / 100 / 12, t + 1)
        );
        RevChart[t].desktop += R; // Accumulate value instead of overwriting
      }
    }

    // Compute total revenue
    RevT = RevChart.reduce((sum, entry) => sum + entry.desktop, 0);

    return {
      RevT: RevT,
      RevChart: RevChart,
    };
  };

  const GetCashFlow = () => {
    const CashFlowChart = [];
    const months = GetNext6Mounths();

    // Initialize CashFlowChart with months and net cash flow set to 0
    for (let i = 0; i < months.length; i++) {
      CashFlowChart.push({ month: months[i], desktop: 0 });
    }

    // Loop through each property in Data
    for (let i = 0; i < Data.length; i++) {
      for (let t = 0; t < CashFlowChart.length; t++) {
        // Rental income (assumed provided in Data)
        const income = Data[i].Monthly || 0;

        // Interest-based expense calculation
        const expense =
          (Data[i].Capital * (Data[i].IntrestRate / 100)) / 12 / Math.max(1, t);

        // Net Cash Flow = Income - Expense
        const netFlow = Math.floor(income - expense);

        // Accumulate in chart
        CashFlowChart[t].desktop += netFlow;
      }
    }

    // Compute total net cash flow over 6 months
    const TotalCashFlow = CashFlowChart.reduce(
      (sum, entry) => sum + entry.desktop,
      0
    );

    return {
      TotalCashFlow: TotalCashFlow,
      CashFlowChart: CashFlowChart,
    };
  };

  const GetRiskAdjustedReturns = () => {
    const RiskChart = [];
    const months = GetNext6Mounths();

    // Initialize RiskChart with months and adjusted returns set to 0
    for (let i = 0; i < months.length; i++) {
      RiskChart.push({ month: months[i], desktop: 0 });
    }

    // Loop through each property in Data
    for (let i = 0; i < Data.length; i++) {
      // Adjust interest rate based on risk factor
      const adjustedRate = Data[i].IntrestRate * (1 - Data[i].Risk / 10);

      for (let t = 0; t < RiskChart.length; t++) {
        // Calculate risk-adjusted growth
        const adjustedValue = Math.floor(
          Data[i].Capital * Math.pow(1 + adjustedRate / 100 / 12, t + 1)
        );

        // Accumulate adjusted return per month
        RiskChart[t].desktop += adjustedValue;
      }
    }

    // Compute total risk-adjusted portfolio return
    const TotalRiskAdjustedReturn = RiskChart.reduce(
      (sum, entry) => sum + entry.desktop,
      0
    );

    return {
      TotalRiskAdjustedReturn: TotalRiskAdjustedReturn,
      RiskChart: RiskChart,
    };
  };

  const CalculateData = () => {
    return [
      {
        title: "Revenue",
        icon: ArrowDownUp,
        valueD: "Based on your investment",
        value: GetRev().RevT,
        chartData: GetRev().RevChart,
      },
      {
        title: "Cash Flow",
        icon: ArrowDownUp,
        valueD: "Based on your investment",
        value: GetCashFlow().TotalCashFlow,
        chartData: GetCashFlow().CashFlowChart,
      },
      {
        title: "Risk-Adjusted Return",
        icon: ArrowDownUp,
        valueD: "Based on your investment",
        value: GetRiskAdjustedReturns().TotalRiskAdjustedReturn,
        chartData: GetRiskAdjustedReturns().RiskChart,
      },
    ];
  };

  // Calculate metrics data whenever Data changes
  useEffect(() => {
    // @ts-ignore
    setChartData(CalculateData());
    // console.log("Data Changed", Data);
  }, [Data]);

  return (
    <div className="flex gap-[10px] mt-5">
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
  };
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl bg-gray-100 border hover:bg-gray-200 transition cursor-pointer gap-10 flex flex-col justify-between items-start p-6 overflow-hidden h-[250px] max-h-[250px] min-w-[500px] w-full"
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
          <h1 className="text-3xl sm:text-5xl">{data.value}$</h1>
          <p className="text-xs sm:text-sm opacity-60 my-2">{data.valueD}</p>
        </div>
        <div className="flex-grow">
          <Chart values={data.chartData} label={data.title} />
        </div>
      </div>
    </motion.div>
  );
}

function Chart({ values, label }: { values: any[]; label: string }) {
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

function PropertyDiv({ data }: { data: any }) {
  const $D = useStore(data);
  const [IntrestRate, SetIntrestRate] = useState($D.IntrestRate);
  const [Capital, SetCapital] = useState($D.Capital);
  const [Duration, SetDuration] = useState($D.Duration);
  const [PropertyType, SetPropertyType] = useState($D.PropertyType);
  const [riskScore, setRiskScore] = useState($D.Risk);
  const [qualityScore, setQualityScore] = useState($D.Quality);
  const [Monthly, SetMonthly] = useState($D.Monthly);

  // Update the store whenever any property value changes
  useEffect(() => {
    const currentData = {
      Capital: Capital,
      Duration: Duration,
      IntrestRate: IntrestRate,
      PropertyType: propertyTypes[PropertyType].name,
      Risk: riskScore,
      Quality: qualityScore,
      Monthly: Monthly,
    };

    data.set(currentData);
  }, [
    IntrestRate,
    Capital,
    Duration,
    PropertyType,
    riskScore,
    qualityScore,
    Monthly,
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
    const currentProperty = propertyTypes[PropertyType];

    // Base quality factors
    const durationFactor = Math.min(1, Duration / 60);
    const interestFactor = 1 - IntrestRate / 20;
    const capitalFactor = Math.min(1, Capital / 50000);

    // Calculate quality score (0-10 scale)
    const qualityScore =
      (durationFactor * 3 +
        interestFactor * 3 +
        capitalFactor * 2 +
        currentProperty.appreciationRate * 50) /
      currentProperty.riskFactor;

    setQualityScore(Math.min(10, Math.max(1, Math.round(qualityScore))));
  }, [propertyTypes, PropertyType, Duration, IntrestRate, Capital]);

  // Calculate risk level (0-10 scale)
  useEffect(() => {
    const currentProperty = propertyTypes[PropertyType];

    // Risk factors
    const durationRisk = Duration > 60 ? 0.8 : Duration > 24 ? 1.0 : 1.2;
    const interestRisk = IntrestRate / 10;
    const capitalRisk = Math.max(0.5, 1 - Capital / 100000);

    // Calculate risk score (0-10 scale)
    const riskScore =
      (durationRisk * 2 + interestRisk * 3 + capitalRisk * 2) *
      currentProperty.riskFactor;

    setRiskScore(Math.min(10, Math.max(1, Math.round(riskScore))));
  }, [propertyTypes, PropertyType, Duration, IntrestRate, Capital]);

  useEffect(() => {
    const monthlyInterestRate = IntrestRate / 100 / 12;
    const numberOfPayments = Duration;

    // Base PMT formula:
    const numerator =
      Capital *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    const baseMonthlyPayment = denominator === 0 ? 0 : numerator / denominator;

    // Adjustments based on property type:
    const currentProperty = propertyTypes[PropertyType];
    const multiplier = currentProperty.returnMultiplier;

    SetMonthly(Math.floor(baseMonthlyPayment * multiplier));
  }, [IntrestRate, Duration, Capital, propertyTypes, PropertyType]);

  const qualityColor = `hsl(${qualityScore * 12}, 100%, 40%)`;
  const riskColor = `hsl(${(10 - riskScore) * 12}, 100%, 40%)`;

  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [OverviewData, SetOverviewData] = useState("");

  const Overview = async () => {
    const Data = {
      Capital: Capital,
      Duration: Duration,
      IntrestRate: IntrestRate,
      PropertyType: propertyTypes[PropertyType].name,
      Risk: riskScore,
      Quality: qualityScore,
      Monthly: Monthly,
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
    <div className="rounded-lg hover:bg-gray-200 transition w-full min-w-1/3  bg-gray-100 gap-16 relative overflow-hidden flex flex-col items-start p-6 m-0 justify-between border" style={{borderRadius:"10px"}}>
      {/* Rest of the JSX remains unchanged */}
      <div
        className="w-full absolute h-full top-0 left-0 opacity-35"
        style={{
          background: `radial-gradient(circle at 0% 0%,${qualityColor},transparent)`,
        }}
      ></div>
      <div className="flex justify-between items-start w-full relative">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <FinancialTooltip term="Investment Quality">
              <p
                className={`text-sm px-3 mb-2 py-1 w-fit rounded-full text-white`}
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
                className={`text-sm px-3 mb-2 py-1 w-fit rounded-full text-white`}
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

          <h1 className="text-4xl font-bold text-gray-900">
            {propertyTypes[PropertyType].name} Property
          </h1>
          <div className="flex gap-2 mt-1">
            <FinancialTooltip term="Return Multiplier">
              <p className="text-sm text-gray-500">
                Return Multiplier:{" "}
                <AnimatedNumber
                  value={propertyTypes[PropertyType].returnMultiplier}
                  suffix="x"
                  duration={0.5}
                  formatOptions={{
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }}
                />
              </p>
            </FinancialTooltip>
            <FinancialTooltip term="Risk Factor">
              <p className="text-sm text-gray-500">
                Risk Factor:{" "}
                <AnimatedNumber
                  value={propertyTypes[PropertyType].riskFactor}
                  duration={0.5}
                  formatOptions={{
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }}
                />
              </p>
            </FinancialTooltip>
            <FinancialTooltip term="Appreciation">
              <p className="text-sm text-gray-500">
                Appreciation:{" "}
                <AnimatedNumber
                  value={propertyTypes[PropertyType].appreciationRate * 100}
                  suffix="%/year"
                  duration={0.5}
                  formatOptions={{
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }}
                />
              </p>
            </FinancialTooltip>
          </div>
        </div>
        <button className="rounded-lg p-1  hover:bg-white transition">
          <Ellipsis size={16} />
        </button>
      </div>
      <div className="flex gap-5 justify-between w-full items-end relative">
        <div className="flex flex-col gap-2 w-3/5">
          {OverviewData.length > 0 ? (
            <div className="bg-[#ffffffd0] rounded-xl p-3 text-sm flex flex-col">
              <div className="flex w-full mb-2 justify-between pr-2">
                <p className="text-xl font-bold">AI Report</p>
                <button onClick={Overview} disabled={isLoading}>
                  <RotateCcw
                    size={16}
                    className={isLoading ? "animate-spin" : ""}
                  />
                </button>
              </div>

              <div className="text-sm">
                <MarkdownRenderer markdown={OverviewData} />
              </div>
            </div>
          ) : (
            <Button
              className="bg-white rounded-full text-black hover:bg-neutral-100 w-fit group"
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
                  <ChartColumnDecreasing />
                  Generate AI Report
                </>
              )}
            </Button>
          )}
          <InputO onChange={SetPropertyType} />
          <div className="flex items-center gap-2">
            <InputR
              title={"Period"}
              min={6}
              max={120}
              steps={6}
              small={true}
              Icon={Calendar}
              initialValue={Duration}
              onChange={SetDuration}
            />
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="bg-white text-black w-fit h-9 flex items-center border text-sm text-nowrap rounded-full py-1 px-4"
              >
                <FinancialTooltip term="Interest Rate">
                  {IntrestRate}% Interest
                </FinancialTooltip>
                <span className="ml-2">
                  <ArrowDownUp className="rotate-45" size={16} />
                </span>
              </button>
              {dropdownOpen && (
                <div
                  className="absolute bottom-[120%] mt-1 bg-white rounded-lg shadow-lg z-20 py-1 min-w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[7, 8, 12].map((rate) => (
                    <button
                      key={rate}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        IntrestRate === rate ? "font-bold" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        SetIntrestRate(rate);
                        setDropdownOpen(false);
                      }}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <FinancialTooltip term="Capital" className="w-full">
            <InputR
              title={"Investment"}
              min={5000}
              max={100000}
              steps={5000}
              initialValue={Capital}
              Icon={DollarSign}
              onChange={SetCapital}
            />
          </FinancialTooltip>
        </div>
        <div className="flex flex-col items-end gap-2">
          <h3 className="text-xl font-bold font-[Code] text-gray-900">
            <FinancialTooltip term="Duration">
              <AnimatedNumber
                value={Duration}
                suffix=" Months"
                duration={0.5}
              />
            </FinancialTooltip>
          </h3>
          <h3 className="text-xl font-bold font-[Code] text-gray-900">
            <FinancialTooltip term="Monthly Payment">
              <AnimatedNumber
                value={Monthly}
                prefix="$"
                suffix=" / Month"
                duration={0.5}
                formatOptions={{
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }}
              />
            </FinancialTooltip>
          </h3>
          <p className="text-sm text-gray-500">Estimated Total Price</p>
          <FinancialTooltip term="Total Price">
            <h1 className="text-5xl font-bold">
              <AnimatedNumber
                value={Monthly * Duration}
                prefix="$"
                duration={0.5}
              />
            </h1>
          </FinancialTooltip>
        </div>
      </div>
    </div>
  );
}

import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { Properties } from "@/stores/Sim";

function PropertiesSection() {
  const $P = useStore(Properties);

  return (
    <div
      className={`w-full gap-3 h-full ${
        $P.length == 0
          ? "items-center justify-center flex flex-col"
          : "grid grid-cols-2"
      }  `}
    >
      {$P.map((item, index) => {
        return <PropertyDiv key={index} data={item} />;
      })}
      <div
        onClick={() => {
          const PS = atom({
            IntrestRate: 8,
            Capital: 10000,
            Duration: 12,
            PropertyType: 0,
            Risk: 1,
            Quality: 1,
            Monthly: 1000,
          });
          // @ts-expect-error
          Properties.set([...$P, PS]);
        }}
        className="rounded-lg cursor-pointer hover:bg-gray-200 transition w-96 h-fit bg-gray-100 relative overflow-hidden flex flex-col items-start p-6 justify-between border" style={{borderRadius:"10px"}}
      >
        <div className="absolute top-0 left-0 w-full h-full"></div>
        <div className="flex relative w-full z-10 justify-end">
          <ArrowRight></ArrowRight>
        </div>
        <div className="z-10 relative h-40 flex flex-col justify-end" style={{borderRadius:"10px"}}>
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

  return (
    <>
      {/* <button className="py-4" onClick={OnBack}>
        ← Back
      </button> */}
      <h1 className="text-4xl">Investor Simulator</h1>
      <p className="text-sm opacity-70">
        Overview the market trends and analyze the best properties to invest in.
      </p>

      {$P.length == 0 ? <div></div> : <MetricSerction />}
      <br />
      <div className="overflow-y-auto h-full w-full">
        <PropertiesSection />
      </div>
    </>
  );
}
