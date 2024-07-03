/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

const classes = [
  "text-sm font-semibold leading-6 text-gray-900 hover:text-green-500",
  "font-semibold leading-7 text-gray-900 hover:bg-gray-100",
];

const products = [
  {
    name: "تحفيظ",
    description: "إحفظ وحفظ أطفالك القرآن الكريم",
    href: "#",
  },
  {
    name: "تجويد",
    description:
      "دروسًا متخصصة في قواعد التجويد لتعليم النطق الصحيح للقرآن الكريم، مع التركيز على تحسين مهارات التلاوة لدى الطلاب.",
    href: "#",
  },
  {
    name: "فقه",
    description: "فقه الطهارة، الصلاة، الزكاة، الصيام، والحج.",
    href: "#",
  },
  {
    name: "السنة النبوية",
    description:
      "شرح الأحاديث النبوية، مع التركيز على صحيح البخاري ومسلم، بالإضافة إلى كتب السنة الأخرى.",
    href: "#",
  },
  {
    name: "السيرة النبوية",
    description:
      "تغطي حياة الرسول محمد صلى الله عليه وسلم، بدءًا من ميلاده وحتى وفاته",
    href: "#",
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ArabicNavBar({
  username,
}: {
  username?: string | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`bg-white fixed w-full border-b-2 border-gray-300 border-solid top-0`}
      style={{ zIndex: "3" }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/">
            <img className="h-12 w-auto" src="/static/imgs/quran.gif" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 hover:text-green-500">
              الدروس
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </PopoverButton>

            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <PopoverPanel className="absolute -right-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex-auto">
                        <Link
                          href={item.href}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </Link>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                  {callsToAction.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100"
                    >
                      <item.icon
                        className="h-5 w-5 flex-none text-gray-400"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </PopoverPanel>
            </Transition>
          </Popover>

          <Link href="#" className={classes[0]}>
            دروسي
          </Link>
          <Link href="#" className={classes[0]}>
            المميزات
          </Link>
          <Link href="#" className={classes[0]}>
            عنا
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center">
          {username ? (
            <p className="font-bold">{username}</p>
          ) : (
            <>
              <Link href="#" className={classes[0]}>
                تسجيل دخول <span aria-hidden="true">&larr;</span>
              </Link>
              <Link
                href="/auth/register"
                className={`text-sm font-semibold leading-6 text-gray-900 hover:text-white bg-green-400 py-2 px-3 rounded-3xl transition-all hover:scale-110`}
              >
                تسجيل حساب
              </Link>
            </>
          )}
        </div>
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <img className="h-12 w-auto" src="/static/imgs/quran.gif" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <DisclosureButton
                        className={`flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base ${classes[1]} transition-all`}
                      >
                        الدروس
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "h-5 w-5 flex-none"
                          )}
                          style={{ transition: "0.5s" }}
                          aria-hidden="true"
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="mt-2 space-y-2">
                        {[...products, ...callsToAction].map((item) => (
                          <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            className={`block rounded-lg py-2 pl-6 pr-3 text-sm ${classes[1]}`}
                          >
                            {item.name}
                          </DisclosureButton>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
                <Link
                  href="#"
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base ${classes[1]}`}
                >
                  دروسي
                </Link>
                <Link
                  href="#"
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base ${classes[1]}`}
                >
                  المميزات
                </Link>
                <Link
                  href="#"
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base ${classes[1]}`}
                >
                  عنا
                </Link>
              </div>
              <div className="py-6">
                {username ? (
                  <p className="font-bold">{username}</p>
                ) : (
                  <>
                    <Link
                      href="#"
                      className={`-mx-3 block rounded-lg px-3 py-2.5 text-base ${classes[1]}`}
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/auth/register"
                      className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 bg-green-500`}
                    >
                      تسجيل حساب
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
