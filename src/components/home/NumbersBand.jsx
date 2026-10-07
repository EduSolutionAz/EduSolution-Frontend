import { funNumbers } from '../../data/home';
import { useWebProperties } from '../../services/contentHooks';

// Sıra vizual tərtibi, dəyərlər isə GET /property/all-dan gəlir.
const TILES = [
  { key: 'admissions_sent', label: 'Admission Sent', suffix: '' },
  { key: 'successful_admission', label: 'Successful Admission', suffix: '' },
  { key: 'visa_help', label: 'Visa Help', suffix: '' },
  { key: 'successful_visa_help', label: 'Successful Visa Help', suffix: '' },
  { key: 'visa_success_rate', label: 'Visa Success Rate', suffix: '%' },
];

function isZero(value) {
  return !Number.isFinite(Number(value)) || Number(value) === 0;
}

/**
 * Backend rəqəm sətri yaratmayıbsa GET /property/all 400 qaytarır, ona görə
 * o halda statik funNumbers göstərilir. Sətri varsa 5 rəqəm göstərilir —
 * visa_success_rate yalnız backend tərəfdə hesablanır və mətn formatında
 * gəldiyi üçün Number() ilə yoxlanılır.
 */
function buildTiles(properties) {
  if (!properties) return funNumbers;

  const tiles = TILES.map((tile) => ({
    key: tile.key,
    label: tile.label,
    value: `${properties[tile.key] ?? 0}${tile.suffix}`,
    // Faiz dəyəri boş/0 gəlirsə tile-i göstərməmək daha doğrudur.
    present: !isZero(properties[tile.key]),
  })).filter((tile) => tile.present);

  return tiles.length > 0 ? tiles : funNumbers;
}

export default function NumbersBand() {
  const { data: properties } = useWebProperties();
  const tiles = buildTiles(properties);
  const columns = tiles.length === 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-4';

  return (
    <section
      className="py-6 sm:py-8"
      style={{
        backgroundImage: `linear-gradient(rgba(246,238,238,0.95), rgba(246,238,238,0.95)), url('/assets/topographic.png')`,
        backgroundRepeat: 'repeat',
        backgroundSize: '650px auto',
      }}
    >
      <div
        className={`max-w-[900px] mx-auto px-4 grid grid-cols-2 ${columns} gap-4 text-center`}
        role="list"
      >
        {tiles.map((tile) => (
          <div key={tile.label} role="listitem">
            <div className="text-[#080d4a] font-heading font-bold text-[26px] sm:text-[32px] leading-none">
              {tile.value}
            </div>
            <div className="text-[#323643] text-[11px] sm:text-[12px] mt-1.5 font-accent">
              {tile.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
