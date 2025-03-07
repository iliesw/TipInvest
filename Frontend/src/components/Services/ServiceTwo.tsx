import SimPlus from "@/components/Services/SimPlus"


export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base/7 font-semibold text-lime-600">Deploy faster</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
          Outils financiers et simulations avancées
          </p>
        </div>
        <SimPlus />
      </div>
    </div>
  )
}