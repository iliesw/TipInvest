
import Navbar from "@/components/Home/Navbar";
import { Footer } from "@/components/Home/Footer";
import { ServiceOne } from "@/components/Services/ServiceOne";
import ServiceTwo from "@/components/Services/ServiceTwo";
import ServiceThree from "@/components/Services/ServiceThree";
import ServiceFoor from "@/components/Services/ServiceFoor";
import ServiceFive from "@/components/Services/ServiceFive";
import Cta from "@/components/Home/CTA";
import Layout from "@/components/layout";

export default function Service() {
  return (
    <Layout>
    <div>
      <Navbar/>
      <ServiceOne             />
      <ServiceTwo             />
      <ServiceThree           />
      <ServiceFoor            />
      <ServiceFive            />
      <Cta/>
      <Footer/>
    </div>
    </Layout>
  );
}
