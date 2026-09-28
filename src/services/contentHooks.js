import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getTopCountries,
  getCountry,
  getCountryLogos,
  getUniversityDetails,
  getTopComments,
} from './contentApi';
import { attachFlags, mapCountryLogos, mapTopCountry as mapTopCountryDto } from './mappers';

export function useApiResource(loader, deps = [], { enabled = true, fallback = null } = {}) {
  const [state, setState] = useState({ data: fallback, loading: enabled, error: null });
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setState({ data: fallback, loading: false, error: null });
      return undefined;
    }

    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    loader()
      .then((data) => {
        if (active) setState({ data: data ?? fallback, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: fallback, loading: false, error });
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, nonce, ...deps]);

  return { ...state, reload };
}

const EMPTY_LIST = [];

export function useTopCountries() {
  return useApiResource(() => getTopCountries(), [], { fallback: EMPTY_LIST });
}

export function useCountryLogos() {
  return useApiResource(() => getCountryLogos(), [], { fallback: EMPTY_LIST });
}

export function useCountry(countryName) {
  return useApiResource(() => getCountry(countryName), [countryName], {
    enabled: Boolean(countryName),
  });
}

export function useUniversityDetails(universityName) {
  return useApiResource(() => getUniversityDetails(universityName), [universityName], {
    enabled: Boolean(universityName),
  });
}

export function useTopComments() {
  return useApiResource(() => getTopComments(), [], { fallback: EMPTY_LIST });
}

async function mapTopCountry(entry) {
  const base = mapTopCountryDto(entry);
  if (!base) return null;

  const detail = await getCountry(base.name).catch(() => null);

  return {
    ...base,
    heroImage: detail?.photo_url || base.countryBgUrl || '',
    universities: (Array.isArray(detail?.universities) ? detail.universities : [])
      .map((entry2) => (typeof entry2 === 'string' ? entry2 : entry2?.name))
      .filter(Boolean)
      .map((universityName) => ({ id: universityName, universityName })),
  };
}

/**
 * Top countries plus each country's university list.
 * The backend has no bulk university endpoint, so country details are
 * fetched per country and a failure degrades that country to an empty list.
 */
export function useCountriesWithUniversities() {
  const { data, ...rest } = useApiResource(async () => {
    const entries = await getTopCountries();
    const results = await Promise.all(entries.map(mapTopCountry));
    return results.filter(Boolean);
  }, [], { fallback: EMPTY_LIST });

  const { data: logoItems } = useCountryLogos();

  const countries = useMemo(
    () => attachFlags(data, mapCountryLogos(logoItems)),
    [data, logoItems],
  );

  return { ...rest, data: countries };
}
