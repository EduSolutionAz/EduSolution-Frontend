import { Link } from 'react-router-dom';

export default function UniversitiesList({ universities }) {
  // Dizaynda 2 sütun, tən ortadan bölünür. Tək sayda olsa sola bir artıq düşür.
  const mid = Math.ceil(universities.length / 2);
  const left = universities.slice(0, mid);
  const right = universities.slice(mid);

  // Dizaynda sağ sütun bir az qısa olur (H yoxdur kimi) — amma data eynidirsə eyni göstəririk.
  // Şəkildəki kimi 2 sütunu ayrı kolonda render edirik.
  return (
    <section className="w-full">
      <h2 className="text-center text-[#2f3f80] text-[20px] sm:text-[26px] font-normal tracking-wide mb-5 sm:mb-6">
        Universities in Germany
      </h2>

      <div className="flex justify-center gap-10 sm:gap-20 text-[12px] sm:text-[13px] text-black/90 leading-6">
        <ul className="list-disc list-inside space-y-0.5">
          {left.map((u) => (
            <li key={`l-${u}`}>
              <Link to="#" className="hover:text-[#2f3f80] hover:underline underline-offset-2 transition">
                {u}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc list-inside space-y-0.5">
          {right.map((u) => (
            <li key={`r-${u}`}>
              <Link to="#" className="hover:text-[#2f3f80] hover:underline underline-offset-2 transition">
                {u}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-center italic text-[#2f3f80] text-[11px] sm:text-[12px] mt-6 sm:mt-8">
        *click on university name to get detailed information
      </p>
    </section>
  );
}
