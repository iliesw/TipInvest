"use client";
import SimPlus from "@/components/Services/SimPlus";

export default function Example() {
  return (
    <div className="p-4 py-32">
      <div className="mx-auto w-full sm:w-2/3 p-0 sm:p-4">
        <div className=" lg:text-center mb-16">
          <h2 className="text-base/7 font-semibold text-lime-600">
            Invest Smarter
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Outils financiers et simulations avancées
          </p>
        </div>

        <SimPlus />
      </div>
    </div>
  );
}
