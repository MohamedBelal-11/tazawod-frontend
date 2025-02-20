const Footer: React.FC<{ arabic: boolean }> = ({ arabic }) => {
  return (
    <footer className="bg-white p-4 mt-40">
      <div className="mb-4">
        <h4 className="text-2xl mb-2">
          {arabic
            ? "أكاديمية تزوَد لتحفيظ القرءان الكريم"
            : "Tazwad Academy for Memorizing the Holy Quran"}
        </h4>
        <p className="text-lg">
          {arabic
            ? "منصة إلكترونية لتحفيظ وتعلم القرءان الكريم بطرق عصرية مبتكرة."
            : "An electronic platform for memorizing and teaching " +
              "the Holy Quran ininnovative, modern ways."}
        </p>
      </div>
      <div className="text-xl mb-4">
        <p>
          {arabic ? "تصميم وبرمجة المهندس" : "Designed and programmed by the engineer"}{" "}
          <a
            href="https://www.linkedin.com/in/mohamedbelal11/"
            className="text-green-500 hover:underline"
            target="_blank"
          >
            {arabic ? "محمد بلال" : "Mohamed Belal"}
          </a>
        </p>
      </div>
      <div>
        <p>{arabic ? "© 2024 أكاديمية تزود. جميع الحقوق محفوظة." : "© 2024 Tazood Academy. All rights reserved."}</p>
        <ul className="">
          <li>
            <a href="" className="text-green-500 hover:underline">
              {arabic? "سياسة الخصوصية" : "Privacy policy"}
            </a>
          </li>
          <li>
            <a href="" className="text-green-500 hover:underline">
              {arabic ? "الشروط والأحكام" : "Terms and Conditions"}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
