"use client"

/* eslint-disable @next/next/no-img-element */

import { SelectedLang } from "@/stores/lang";
import { useEffect, useState } from "react";
import Sim from "./Sim";
import { motion } from "framer-motion";
type Lang = 'fr' | 'us';

export default function Example() {
  const [userLang, setUserLang] = useState<Lang>(SelectedLang.get() as Lang);
      useEffect(() => {
        SelectedLang.subscribe((n) => {
          setUserLang(n as Lang);
        });
      }, []);

  const content = {
    fr: {
      title1: "Fonctionnalités Clés de TipInvest",
      title2: "Investissement facilité",
      text2: "Accès à un marché collaboratif avec des opportunités à haute valeur ajoutée.",
      title3: "Visualisation immersive 3D",
      text3: "Visites virtuelles et modélisation des biens.",
    },
    us: {
      title1: "Key Features of TipInvest",
      title2: "Facilitated Investment",
      text2: "Access to a collaborative market with high value-added opportunities.",
      title3: "Immersive 3D Visualization",
      text3: "Virtual tours and property modeling.",
    },
  };

  return (
    <motion.div className="py-24 sm:py-32">
      <div className="mx-auto px-4 lg:max-w-7xl w-full lg:px-0 lg:w-2/3">
        {/* Title Section with Animation */}
        <motion.p
          className="mx-auto mt-6 text-center text-3xl font-semibold tracking-tight text-gray-950 sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {content[userLang].title1}
        </motion.p>

        {/* Main Flex Section */}
        <motion.div
          className="mt-10 flex flex-col gap-4 sm:mt-16 lg:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* First Card with Image */}
          <motion.div
            className="relative w-full lg:w-3/5 bg-white rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative flex h-full flex-col overflow-hidden">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <motion.p
                  className="mt-2 text-lg font-medium tracking-tight text-gray-950 text-center lg:text-left leading-tight"
                  style={{
                    fontFamily: "Figtree",
                    fontSize: "36px",
                    fontWeight: "1000",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {content[userLang].title2}
                </motion.p>
                <motion.p
                  className="text-gray-700 mt-4 text-center lg:text-left"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {content[userLang].text2}
                </motion.p>
              </div>
              <motion.div
                className="relative min-h-[20rem] w-full grow mx-auto lg:max-w-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div
                  className="absolute inset-x-10 top-10 bottom-0 overflow-hidden shadow-2xl bg-white"
                  style={{
                    borderRadius: "45px 45px 0 0",
                    border: "8px solid black",
                    borderBottom: "none",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      height: "20px",
                      background: "black",
                      position: "absolute",
                      top: "10px",
                      left: "50%",
                      transform: "translate(-50%,0)",
                      borderRadius: "100px",
                    }}
                  ></div>
                  <img
                    className="w-full h-full object-cover object-top"
                    src="/assets/images/Market.png"
                    alt=""
                  />
                </div>
              </motion.div>
            </div>
            <div
              className="pointer-events-none absolute inset-px ring-1 shadow-sm ring-black/5"
              style={{ borderRadius: "10px 10px 10px 10px" }}
            ></div>
          </motion.div>

          {/* Second Card with Image */}
          <motion.div
            className="relative w-full lg:w-5/5"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative flex h-full flex-col rounded-xl bg-white overflow-hidden">
              <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                <motion.p
                  className="mt-2 text-lg font-medium tracking-tight text-gray-950 text-center leading-tight lg:text-left"
                  style={{
                    fontFamily: "Figtree",
                    fontSize: "36px",
                    fontWeight: "1000",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {content[userLang].title3}
                </motion.p>
                <motion.p
                  className="text-gray-700 mt-4 text-center lg:text-left"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {content[userLang].text3}
                </motion.p>
              </div>
              <motion.div
                className="relative min-h-[20rem] w-full grow"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center"
                    src="/assets/images/3D.png"
                    alt=""
                    style={{
                      transform: "scale(1)",
                      position: "relative",
                      left: "-50px",
                      bottom: "50px",
                    }}
                  />
                </div>
              </motion.div>
            </div>
            <div
              className="pointer-events-none absolute inset-px ring-1 shadow-sm ring-black/5"
              style={{ borderRadius: "10px 10px 10px 10px" }}
            ></div>
          </motion.div>
        </motion.div>

        <Sim />
      </div>
    </motion.div>
  );
}