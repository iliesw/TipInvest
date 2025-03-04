import React, { useEffect, useState } from "react";
import { SelectedLang } from "@/stores/lang";

const content = {
  fr: {
    title: "Contactez-nous",
    heading: "PRENEZ CONTACT AVEC NOUS",
    description:
      "Vous avez des questions ou souhaitez en savoir plus sur TipInvest ? Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.",
    contactInfo: [
      {
        label: "Notre emplacement",
        value: "99 S.t Tunis , Tunisia",
        icon: "location",
      },
      {
        label: "Numéro de téléphone",
        value: "(+216) 98 765 432",
        icon: "phone",
      },
      {
        label: "Adresse e-mail",
        value: "contact@tipinvest.com",
        icon: "email",
      },
    ],
  },
  us: {
    title: "Contact Us",
    heading: "GET IN TOUCH WITH US",
    description:
      "Do you have questions or want to learn more about TipInvest? Our team is here to help. Contact us and we will get back to you as soon as possible.",
    contactInfo: [
      {
        label: "Our Location",
        value: "99 S.t Tunis , Tunisia",
        icon: "location",
      },
      {
        label: "Phone Number",
        value: "(+216) 98 765 432",
        icon: "phone",
      },
      {
        label: "Email Address",
        value: "contact@tipinvest.com",
        icon: "email",
      },
    ],
  },
};

const Contact = () => {
  const [userLang, setUserLang] = useState<string>(SelectedLang.get());
  useEffect(() => {
    SelectedLang.subscribe((n) => {
      setUserLang(n);
    });
  }, []);

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "location":
        return "📍";
      case "phone":
        return "📞";
      case "email":
        return "✉️";
      default:
        return "❓";
    }
  };

  return (
    <section className="relative z-10 overflow-hidden mx-auto w-2/3 bg-white py-20 lg:py-[120px]">
      <div className="container">
        <div className="flex gap-2">
          <div className="mb-12 w-full lg:mb-0 p-4">
            <span className="mb-4 block text-base font-semibold text-primary">
              {content[userLang].title}
            </span>
            <h2 className="mb-6 text-[32px] font-bold uppercase text-dark sm:text-[40px] lg:text-[36px] xl:text-[40px]">
              {content[userLang].heading}
            </h2>
            <p className="mb-9 text-base leading-relaxed text-body-color ">
              {content[userLang].description}
            </p>
            {content[userLang].contactInfo.map((info, index) => (
              <div key={index} className="mb-8 flex w-full max-w-[370px]">
                <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary/5 text-primary sm:h-[70px] sm:max-w-[70px]">
                  <span className="text-2xl">{renderIcon(info.icon)}</span>
                </div>
                <div className="w-full">
                  <h4 className="mb-1 text-xl font-bold text-dark ">
                    {info.label}
                  </h4>
                  <p className="text-base text-body-color ">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102239.59423939198!2d10.06070577265169!3d36.79485441228562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis!5e0!3m2!1sfr!2stn!4v1740865750057!5m2!1sfr!2stn"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "15px" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
