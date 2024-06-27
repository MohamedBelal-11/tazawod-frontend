import Link from "next/link";
import ArabicLayout from "./components/arabicLayout";

const NotFound = () => {
  return (
    <ArabicLayout className="overflow-hidden">
      <div
        className="flex justify-center items-center"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="bg-white rounded-3xl md:px-20 px-4 py-20 flex flex-col items-center gap-8">
          <p className="w-max text-nowrap md:text-5xl text-4xl font-black">404</p>
          <p className="w-max text-nowrap md:text-3xl sm:text-2xl text-sm font-black flex flex-nowrap md:gap-8 gap-4">
            <span>الصفحة غير موجودة</span>
            <span>Page not found</span>
          </p>
          <div className="*:py-2 *:px-4 *:rounded-xl *:bg-green-600 *:text-white flex sm:flex-nowrap md:gap-8 sm:gap-4 gap-2">
            <Link href="/">الصفحة الرئيسية</Link>
            <Link href="/en">Home Page</Link>
          </div>
        </div>
      </div>
    </ArabicLayout>
  );
};

export default NotFound;
