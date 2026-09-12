import { Link } from 'react-router-dom';

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default function UniversityList({ left = [], right = [] }) {
  const renderColumn = (list) => (
    <ul className="flex flex-col gap-1.5 text-[14px] sm:text-[15px] text-black">
      {list.map((name) => (
        <li key={name} className="flex items-start gap-2">
          <span aria-hidden="true" className="leading-6">
            •
          </span>
          <Link
            to={`/university/${slugify(name)}`}
            className="hover:text-[#2f4486] hover:underline underline-offset-4 transition"
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <div className="flex justify-center gap-10 sm:gap-24">
        {renderColumn(left)}
        {renderColumn(right)}
      </div>
      <p className="mt-8 text-left text-[#2f4486] italic text-[13px] sm:text-[14px]">
        *click on university name to get detailed information
      </p>
    </div>
  );
}
