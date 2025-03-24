import Prices from "@/components/Pricing/Prices";
import Navbar from "@/components/Home/Navbar";
import { Footer } from "@/components/Home/Footer";
import Brands from "@/components/Home/Brands";
import Detail from "@/components/Pricing/Detail";
import Layout from "@/components/layout";

export default function Pricing() {
  return (
    <Layout>
    <div>
      <Navbar />
      <Prices />
      <Brands />
      <Detail />
      <Footer />
    </div>
    </Layout>
  );
}
