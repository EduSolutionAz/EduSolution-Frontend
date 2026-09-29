import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getTopCountries,
  getCountry,
  getCountryDetails,
  getCountryLogos,
  getUniversityDetails,
  getAllUniversities,
  getTopComments,
} from './contentApi';
import { attachFlags, mapCountryLogos, mapTopCountry } from './mappers';

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
 * Full admin country list.
 *
 * GET /country/top_countries is capped server side and only returns the top
 * handful, so a country outside that cap can never be listed, edited or
 * deleted. GET /country/country_logos returns every country, so the two are
 * merged: the top list supplies the rich fields and the logo list supplies
 * the names that are missing from it.
 */
export function useAllCountries() {
  const top = useTopCountries();
  const logos = useCountryLogos();

  const data = useMemo(() => {
    const rich = (top.data || []).map(mapTopCountry).filter(Boolean);
    const bySlug = new Map(rich.map((country) => [country.slug, country]));

    const inferred = Object.keys(mapCountryLogos(logos.data))
      .filter((slug) => !bySlug.has(slug))
      .map((slug) => {
        const name = slug.replace(/-/g, ' ');
        return {
          slug,
          name,
          flag: '',
          heroImage: '',
          heroAlt: name,
          card: { universityCount: 0, tuitionFee: 0, features: [] },
          countryBgUrl: '',
          visaHelp: false,
          dormitoryHelp: false,
          limited: true,
        };
      });

    return [...rich.map((c) => ({ ...c, limited: false })), ...inferred];
  }, [top.data, logos.data]);

  return {
    ...top,
    data,
    loading: top.loading || logos.loading,
    error: top.error || logos.error,
  };
}

export function useCountryLogos() {
  return useApiResource(() => getCountryLogos(), [], { fallback: EMPTY_LIST });
}

export function useCountry(countryName) {
  return useApiResource(() => getCountry(countryName), [countryName], {
    enabled: Boolean(countryName),
  });
}

/** All universities for the public header dropdown. */
export function useAllUniversities() {
  return useApiResource(() => getAllUniversities(), [], { fallback: EMPTY_LIST });
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
