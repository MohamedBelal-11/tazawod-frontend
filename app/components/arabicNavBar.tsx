/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  SVGProps,
  useEffect,
  useState,
} from "react";
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
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { backendUrl } from "../utils/auth";
import axios from "axios";
import { motion, Variants } from "framer-motion";

const classes = [
  "text-sm font-semibold leading-6 text-gray-900 hover:text-green-500",
  "font-semibold leading-7 text-gray-900 hover:bg-gray-100",
];

type option =
  | {
      name: string;
      description: string;
      href: string;
      useID?: false;
    }
  | {
      name: string;
      description: string;
      href: [string, string];
      useID: true;
    };

const nDV: Variants = {
  hov: {
    scale: 1.2,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 200,
    },
  },
};

const nIV: Variants = {
  hov: {
    rotate: [0, 40, -40, 10, 0],
    transition: {
      duration: 2,
      times: [0, 0.25, 0.5, 0.75, 1],
      ease: "easeInOut",
    },
  },
};

const adminOptionList: option[] = [
  {
    name: "المعلمين",
    description: "قائمة المعلمين الموافقين عليهم و قائمة دروسهم",
    href: "/ar/teachers",
  },
  {
    name: "الطلاب",
    description: "عرض جميع الطلاب المشتركين وغير المشتركين وتفاريرك الخاصة بهم",
    href: "/ar/students",
  },
  {
    name: "الدروس والمقابلات",
    description: "عرض جميع الدروس والمقابلات المباشرة وغير المباشرة",
    href: "/ar/meetings",
  },
  {
    name: "الدروس المقطعية",
    description: "شاهد دروس مقطية في أي وقت",
    href: "/ar/watch/playlists",
  },
];

const superAdminOptionList: option[] = [
  ...adminOptionList,
  {
    name: "المشرفين",
    description: "قائمة المشرفين الموافقين عليهم و قائمة دروسهم",
    href: "/ar/admins",
  },
];

const unlogedOptionList: option[] = [
  {
    name: "تسجيل الدخول",
    description: "لديك حساب بالفعل؟ قم بتسجيل الدخول",
    href: "/ar/auth/login",
  },
  {
    name: "إنشاء حساب كمعلم",
    description: "إنضم إلينا كمعلم",
    href: "/ar/auth/register/teacher",
  },
  {
    name: "إنشاء حساب مشرف",
    description: "إنضم إلينا كمشرف",
    href: "/ar/auth/register/admin",
  },
  {
    name: "الدروس المقطعية",
    description: "شاهد دروس مقطية في أي وقت",
    href: "/ar/watch/playlists",
  },
];

const studentOptionList: option[] = [
  {
    name: "التقارير",
    description: "آخر التقييمات والملاحظات الخاصة بك",
    href: ["/ar/students/student", "notes"],
    useID: true,
  },
  {
    name: "الإشتراك",
    description: "إشترك لنفسك أو لغيرك",
    href: "/ar/subscribe",
  },
  {
    name: "الدروس المقطعية",
    description: "شاهد دروس مقطية في أي وقت",
    href: "/ar/watch/playlists",
  },
];

const teacherOptionList: option[] = [
  {
    name: "الدروس المقطعية",
    description: "شاهد دروس مقطية في أي وقت",
    href: "/ar/watch/playlists",
  },
  {
    name: "التقارير",
    description: "آخر التقييمات والملاحظات الخاصة بك",
    href: ["/ar/teachers/teacher", "notes"],
    useID: true,
  },
];

const callsToAction: {
  name: string;
  href: string;
  useID?: false;
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
}[] = [
  { name: "شاهد الإعلان الترويجي", href: "#", icon: PlayCircleIcon },
  { name: "تواصل معنا", href: "#", icon: PhoneIcon },
];

type responset = {
  username: string;
  usertype: "student" | "teacher" | "admin" | "superadmin";
  notification_count: number;
  id: string;
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ArabicNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [response, setResponse] = useState<responset>();
  let userType = response ? response.usertype : "unloged";

  useEffect(() => {
    // Define an asynchronous function named fetchData.
    // This function will make an HTTP GET request to the server to retrieve data.
    // The request includes an Authorization header with a token.
    // The token is retrieved from the local storage.
    const fetchData = async () => {
      // Retrieve the token from the local storage.
      const token = localStorage.getItem("token");

      try {
        // Make an HTTP GET request to the server.
        // The request includes an Authorization header with the token.
        const respons = await axios.get(backendUrl + "/api/nav/", {
          headers: {
            // Set the Authorization header to include the token.
            Authorization: `Token ${token}`,
          },
        });

        // If the request is successful, update the response state with the data received from the server.
        setResponse(respons.data);
      } catch (error) {
        // If there is an error, log the error to the console.
        console.error(error);
      }
    };
    if (!response) {
      fetchData();
    }
  }, [response]);

  const list =
    userType === "student"
      ? studentOptionList
      : userType === "teacher"
      ? teacherOptionList
      : userType === "admin"
      ? adminOptionList
      : userType === "superadmin"
      ? superAdminOptionList
      : unlogedOptionList;

  return (
    <header
      className={`bg-white fixed w-full border-b-2 border-gray-300 border-solid top-0`}
      style={{ zIndex: "3" }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1 gap-4">
          <Link href="/ar">
            <img className="h-12 min-w-12" src="/static/imgs/quraan.png" />
          </Link>
          {response ? (
            <Link href="/ar/notifications">
              <motion.div
                variants={nDV}
                whileHover="hov"
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
                className="cursor-pointer"
              >
                <motion.div
                  className="w-min h-min"
                  variants={nIV}
                  initial={{ rotate: 0 }}
                >
                  <BellIcon width={50} />
                </motion.div>

                {response.notification_count !== 0 && (
                  <p
                    className={
                      "absolute left-0 bottom-2 text-sm bold text-white w-6 h-6 rounded-full " +
                      "bg-red-500 text-center flex items-center justify-center"
                    }
                  >
                    {response.notification_count}
                  </p>
                )}
              </motion.div>
            </Link>
          ) : null}
        </div>
        <div className="flex lg:hidden sm:gap-4 gap-2">
          {response ? (
            <div>
              <p className="text-center">{response.username}</p>
            </div>
          ) : null}
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
              الخيارات
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
                  {list.map((item) => (
                    <Link
                      href={
                        item.useID
                          ? item.href.join(`/${response?.id}/`)
                          : item.href
                      }
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex-auto">
                        <p className="block font-semibold text-gray-900">
                          {item.name}
                          <span className="absolute inset-0" />
                        </p>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </Link>
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

          {userType !== "student" && (
            <Link
              href={userType === "unloged" ? "#" : "/ar/meetings"}
              className={classes[0]}
            >
              {userType !== "unloged" ? "المقابلات" : "ما هي أكاديمية تزود ؟"}
            </Link>
          )}
          {userType !== "superadmin" && (
            <Link
              href={
                userType === "student"
                  ? "#"
                  : userType === "teacher"
                  ? "#"
                  : userType === "admin"
                  ? "#"
                  : "#"
              }
              className={classes[0]}
            >
              {userType === "student"
                ? "دليل الطالب"
                : userType === "teacher"
                ? "دليل المعلم"
                : userType === "admin"
                ? "دليل المشرف"
                : "لماذا أكاديمية تزود ؟"}
            </Link>
          )}
          {userType !== "unloged" ? (
            <Link
              href={
                userType === "admin" || userType === "superadmin"
                  ? "/ar/admin-acount"
                  : `/ar/${userType}s/${userType}/${response?.id}`
              }
              className={classes[0]}
            >
              الحساب
            </Link>
          ) : null}
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4 items-center">
          {response ? (
            <p className="font-bold">{response.username}</p>
          ) : (
            <>
              <Link href="/ar/auth/login" className={classes[0]}>
                تسجيل دخول <span aria-hidden="true">&larr;</span>
              </Link>
              <Link
                href="/ar/auth/register/student"
                className={`text-sm font-semibold leading-6 text-gray-900 hover:text-white bg-green-400 py-2 px-3 rounded-3xl transition-all hover:scale-110`}
              >
                إنشاء حساب
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
        <DialogPanel
          className={
            "fixed inset-y-0 right-0 z-10 w-full overflow-y-auto " +
            "bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
          }
        >
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
                        الخيارات
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
                        {[...list, ...callsToAction].map((item) => (
                          <DisclosureButton
                            key={item.name}
                            as="a"
                            href={
                              item.useID
                                ? item.href.join(`/${response?.id}/`)
                                : item.href
                            }
                            className={`block rounded-lg py-2 pl-6 pr-3 text-sm ${classes[1]}`}
                          >
                            {item.name}
                          </DisclosureButton>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
                {userType !== "student" && (
                  <Link
                    href={userType === "unloged" ? "#" : "/ar/meetings"}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base ${classes[1]}`}
                  >
                    {userType !== "unloged"
                      ? "المقابلات"
                      : "ما هي أكاديمية تزود ؟"}
                  </Link>
                )}
                {userType !== "superadmin" && (
                  <Link
                    href={
                      userType === "student"
                        ? "#"
                        : userType === "teacher"
                        ? "#"
                        : userType === "admin"
                        ? "#"
                        : "#"
                    }
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base ${classes[1]}`}
                  >
                    {userType === "student"
                      ? "دليل الطالب"
                      : userType === "teacher"
                      ? "دليل المعلم"
                      : userType === "admin"
                      ? "دليل المشرف"
                      : "لماذا أكاديمية تزود ؟"}
                  </Link>
                )}
                <Link
                  href={
                    userType.includes("admin")
                      ? "/ar/admin-acount"
                      : `/ar/${userType}s/${userType}/${response?.id}`
                  }
                  className={`-mx-3 block rounded-lg px-3 py-2 text-base ${classes[1]}`}
                >
                  الحساب
                </Link>
              </div>
              <div className="py-6">
                {response ? (
                  <p className="font-bold">{response.username}</p>
                ) : (
                  <>
                    <Link
                      href="/ar/auth/login"
                      className={`-mx-3 block rounded-lg px-3 py-2.5 text-base ${classes[1]}`}
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/ar/auth/register/student"
                      className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 bg-green-500`}
                    >
                      إنشاء حساب
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
