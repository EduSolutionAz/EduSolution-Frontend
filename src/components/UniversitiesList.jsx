import { Link } from 'react-router-dom';

export default function UniversitiesList({ universities, countryName = 'Germany' }) {
  const mid = Math.ceil(universities.length / 2);
  const left = universities.slice(0, mid);
  const right = universities.slice(mid);

  // Dizaynda sağ sütun bir az qısa olur (H yoxdur kimi) — amma data eynidirsə eyni göstəririk.
  // Şəkildəki kimi 2 sütunu ayrı kolonda render edirik.
  return (
    <section className="w-full">
         <h2 className="text-center text-[#2f3f80] font-normal text-[20px] sm:text-[26px] tracking-wide mb-5 sm:mb-6">
           Universities in {countryName}
         </h2>

      <div className="flex justify-center gap-10 sm:gap-20 text-[12px] sm:text-[13px] text-black/90 leading-6">
        <ul className="list-disc list-inside space-y-0.5">
          {left.map((u) => {
            const name = typeof u === 'string' ? u : u.name;
            const key = typeof u === 'string' ? `l-${u}` : u.id;
            return (
              <li key={key}>
                <Link to="#" className="hover:text-[#2f3f80] hover:underline underline-offset-2 transition">
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="list-disc list-inside space-y-0.5">
          {right.map((u) => {
            const name = typeof u === 'string' ? u : u.name;
            const key = typeof u === 'string' ? `r-${u}` : u.id;
            return (
              <li key={key}>
                <Link to="#" className="hover:text-[#2f3f80] hover:underline underline-offset-2 transition">
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-center italic text-[#2f3f80] text-[11px] sm:text-[12px] mt-6 sm:mt-8">
        *click on university name to get detailed information
      </p>
    </section>
  );
}
