import { useCallback, useEffect, useState } from 'react';
import {
  getTopCountries,
  getAllCountries,
  getCountry,
  getCountryDetails,
  getCountryEntity,
  getCountryLogos,
  getUniversityDetails,
  getAllUniversities,
  getUniversitiesByCountry,
  getTopComments,
} from './contentApi';
import { getAllAds } from './adApi';
import { getWebProperties } from './propertyApi';
import { getPrizes } from './spinApi';
import {
  attachFlags,
  mapAllCountry,
  mapCountryLogos,
  mapTopCountry,
} from './mappers';

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

/**
 * Every country for the admin list. GET /country/top_countries is capped at
 * six server side, so anything outside that cap could not be edited or
 * deleted. Flags are attached from /country/country_logos.
 */
export function useAllCountries() {
  const { data, ...rest } = useApiResource(() => getAllCountries(), [], {
    fallback: EMPTY_LIST,
  });
  const { data: logoItems } = useCountryLogos();

  const countries = attachFlags(
    (data || []).map(mapAllCountry).filter(Boolean),
    mapCountryLogos(logoItems),
  );

  return { ...rest, data: countries };
}

export function useCountryLogos() {
  return useApiResource(() => getCountryLogos(), [], { fallback: EMPTY_LIST });
}

export function useCountry(countryName) {
  return useApiResource(() => getCountry(countryName), [countryName], {
    enabled: Boolean(countryName),
  });
}

export function useCountryEntity(countryName) {
  return useApiResource(() => getCountryEntity(countryName), [countryName], {
    enabled: Boolean(countryName),
  });
}

/** All universities for the public header dropdown. */
export function useAllUniversities() {
  return useApiResource(() => getAllUniversities(), [], { fallback: EMPTY_LIST });
}

/**
 * Universities of one country for the public country page.
 * GET /country/country_detail often carries an empty universities list, so the
 * dedicated endpoint is used as the source of truth.
 */
export function useUniversitiesByCountry(countryName) {
  return useApiResource(() => getUniversitiesByCountry(countryName), [countryName], {
    enabled: Boolean(countryName),
    fallback: EMPTY_LIST,
  });
}

export function useCountryDetails(countryName, { enabled = true } = {}) {
  return useApiResource(() => getCountryDetails(countryName), [countryName], {
    enabled: Boolean(countryName) && enabled,
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

/**
 * GET /spin/prizes -> [{ prize_name, prize_weight }]. Public.
 * Mapped to { name, weight } so the wheel and the admin table read the same
 * shape as before.
 */
export function useSpinPrizes() {
  const { data, ...rest } = useApiResource(() => getPrizes(), [], { fallback: EMPTY_LIST });

  const prizes = (data || [])
    .map((item, index) => {
      const name = typeof item?.prize_name === 'string' ? item.prize_name.trim() : '';
      if (!name) return null;
      const weight = Number(item?.prize_weight);
      return { id: name, name, weight: Number.isFinite(weight) ? weight : 0, key: `${name}-${index}` };
    })
    .filter(Boolean);

  return { ...rest, data: prizes };
}

/**
 * GET /ad/all -> [{ title, photo_url }].
 *
 * The endpoint answers 401 without a token, so on a signed out visitor the
 * request is skipped entirely instead of firing a request that is known to
 * fail. The caller falls back to its stored ads.
 */
export function useAllAds({ enabled = true } = {}) {
  return useApiResource(() => getAllAds(), [], { enabled, fallback: EMPTY_LIST });
}

/**
 * GET /property/all. Returns null (not an error) while the backend has no
 * row, which is what lets the home page keep showing static numbers.
 */
export function useWebProperties() {
  return useApiResource(() => getWebProperties(), [], { fallback: null });
}

/**
 * Country list with flags. Deliberately does not call GET /country/{name}:
 * that endpoint answers 401 without a token, and firing it on every public
 * page made the browser show its native Basic-auth dialog on each load.
 */
export function useCountriesWithUniversities() {
  const { data, ...rest } = useApiResource(() => getTopCountries(), [], {
    fallback: EMPTY_LIST,
  });
  const { data: logoItems } = useCountryLogos();

  const countries = (data || []).map(mapTopCountry).filter(Boolean);
  const withFlags = attachFlags(countries, mapCountryLogos(logoItems));

  return { ...rest, data: withFlags, loadingUniversities: false, loadUniversities: () => {} };
}
