/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */


const Intro = () => {
  return (
    <div className=" overflow-hidden h-[500px] sm:h-[700px] w-full mt-[-30vh] flex items-end justify-center relative">
      <div className="justify-center px-10 md:flex w-full mt-[-0%] relative">
      <div className="bg-orange-400 blur-3xl -translate-y-3/4 delay-100 duration-700 translate-x-96  w-1/6 rounded-br-lg absolute left-0 h-16"></div>
      <div className="bg-purple-400 blur-3xl -translate-y-3/4 delay-100 duration-700 -translate-x-96  w-1/6 rounded-br-lg absolute right-0 h-48 opacity-30"></div>
      <div className="bg-cyan-400 opacity-40 blur-3xl -translate-y-full delay-100 duration-700  w-1/6 translate-x-28 rounded-br-lg absolute right-1/2 h-48 "></div>
        
        <div className="imga d0 w-full  md:w-[65vw] h-[35vh] bg-gradient-to-t from-[#008e2650] to-transparent rounded-lg overflow-visible flex d1 relative">
          <div className="hidden sm:flex w-full items-center justify-center h-full -translate-y-32 overflow-visible">
            <Chart />
          </div>
          <img
            className=" imga d2 hidden md:block z-20 h-[30vh] md:h-[55vh] absolute bottom-0 w-[90%] left-[-25%]"
            src="/assets/images/right.png"
          />
          <img
            className="imgm imga h-[60vh] md:h-[70vh] absolute bottom-0 left-[-5%] md:left-[65%] z-10"
            src="/assets/images/left.png"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-20vh) scale(1);
            opacity: 0;
          }
        }

        .particle {
          background: linear-gradient(to right, #008e26, #00ff4c);
          border-radius: 50%;
          animation: floatUp 7s infinite linear;
        }
        @keyframes moveUp {
          from {
            transform: translateY(100%);
            filter: blur(5px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            filter: blur(0px);
            opacity: 1;
          }
        }

        .imgm {
          mask-image: linear-gradient(
            to top,
            rgba(0, 0, 0, 1),
            rgba(0, 0, 0, 0)
          ); /* Mask on mobile */
        }

        @media (min-width: 768px) {
          .imgm {
            mask-image: none !important; /* Ensures override */
          }
        }

        .imga {
          opacity: 0; /* Hide initially */
          animation: moveUp 0.7s ease forwards;
        }

        .d0 {
          animation-delay: 0ms;
        }

        .d1 {
          animation-delay: 200ms;
        }

        .d2 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
};


import { Area, AreaChart, CartesianGrid } from "recharts"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

function Chart() {
  return (
    <Card className="border-none overflow-visible shadow-none p-0 h-full z-10 relative w-full"> 
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
            }}
          >
            <CartesianGrid vertical={false} />

            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="green"
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor="transparent"
                  stopOpacity={1}
                />
              </linearGradient>
              
            </defs>
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={.6}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Intro;
