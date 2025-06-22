import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "سياسة الخصوصية - أكاديمية تزود",
};

const Page: React.FC = () => {
  return (
    <>
      <div className="h-px"></div>
      <main className="sm:m-12 m-4 sm:p-8 p-3 ps-8 rounded-lg bg-white">
        <p>
          تلتزم <strong>أكادمية تزود</strong> بحماية خصوصية المستخدمين وضمان
          سرية المعلومات التي يتم جمعها من خلال موقعنا. توضح هذه السياسة كيفية
          جمع واستخدام وحماية المعلومات الشخصية التي يتم تزويدنا بها.
        </p>

        <h2 className="text-xl font-semibold">1. المعلومات التي نقوم بجمعها</h2>
        <ul className="list-disc list-inside">
          <li>الاسم الكامل</li>
          <li>رقم الهاتف</li>
          <li>البريد الإلكتروني</li>
          <li>معلومات استخدام الموقع</li>
          <li>معلومات الجهاز والمتصفح</li>
        </ul>

        <h2 className="text-xl font-semibold">2. كيفية استخدام المعلومات</h2>
        <p>
          نستخدم المعلومات لتحسين تجربة المستخدم، وتقديم المحتوى التعليمي،
          والتواصل معك، وحماية الموقع.
        </p>

        <h2 className="text-xl font-semibold">3. مشاركة المعلومات</h2>
        <p>
          لا نشارك معلوماتك مع أي طرف ثالث إلا إذا تطلب الأمر قانونيًا أو
          بموافقتك.
        </p>

        <h2 className="text-xl font-semibold">
          4. تسجيل الدخول باستخدام فيسبوك
        </h2>
        <p>
          نحن لا ننشر شيئًا على حسابك، ونستخدم فقط المعلومات التي سمحت لنا
          بالوصول إليها مثل الاسم والبريد الإلكتروني.
        </p>

        <h2 className="text-xl font-semibold">5. حماية البيانات</h2>
        <p>نقوم بحماية بياناتك باستخدام تقنيات أمان مناسبة.</p>

        <h2 className="text-xl font-semibold">6. حقوقك</h2>
        <p>
          لك الحق في معرفة أو تعديل أو حذف بياناتك، أو إلغاء الاشتراك في
          التنبيهات.
        </p>

        <h2 className="text-xl font-semibold">7. تعديلات السياسة</h2>
        <p>
          قد نقوم بتحديث هذه السياسة. استمرارك في استخدام الموقع يعتبر قبولًا
          للتعديلات.
        </p>

        <h2 className="text-xl font-semibold">8. التواصل معنا</h2>
        <p>
          📧 البريد الإلكتروني: albywmy721@gmail.com <br />
          📞 الهاتف: (+201060512152)
        </p>
      </main>
    </>
  );
};

export default Page;
