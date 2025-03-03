import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../Shared/Logo";
import LoginPage from "../Shared/login";
import { isShowing } from "@/stores/isAuthVisible";
import { DefaultLang } from "@/stores/lang";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Service", href: "/service" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className=" justify-center flex">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-10 w-full lg:w-2/3 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <Logo />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm/6 font-semibold text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/* <button className="rounded-full overflow-hidden w-[30px] h-[30px] mr-5 border shadow">
            <img
              src={`https://flagsapi.com/${DefaultLang.toLocaleUpperCase()}/flat/64.png`}
              className="scale-150 object-contain"
            />
          </button> */}
          <button
            onClick={() => {
              isShowing.set(true);
              isShowing.notify();
            }}
            className="text-sm/6 font-semibold text-gray-900"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Logo />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <button className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                  Log in
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      <LoginPage />
    </header>
  );
};

export default Navbar;
