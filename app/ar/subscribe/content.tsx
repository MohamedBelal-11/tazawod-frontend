import Button from "@/app/components/button";

type Responset = {
  student: true;
};

const Content: React.FC = () => {
  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: "calc(100vh - 110px)" }}
    >
      <main className="p-5 rounded-2xl bg-white flex flex-col items-center">
        <div className="flex gap-3 flex-wrap justify-center">
          <Button className="w-56 text-xl" color="sky">
            الإشتراك عن طريق التواصل مع مشرف
          </Button>
          <Button className="w-56 text-xl" color="green">
            الإشتراك عن طريق المحفظة أو البطاقة المصرفية
          </Button>
          <Button className="w-56 text-xl" color="amber">
            الإسبوع المجاني
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Content;
