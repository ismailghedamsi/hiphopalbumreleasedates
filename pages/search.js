import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { Loader } from "@mantine/core";
import { IconSearch } from "@tabler/icons";
import { supabase } from "../supabaseClient";
import styles from "../styles/SearchPage.module.css";

const SearchPage = () => {
  const router = useRouter();
  const queryTerm = typeof router.query.q === "string" ? router.query.q : "";
  const [inputValue, setInputValue] = useState(queryTerm);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setInputValue(queryTerm);
  }, [queryTerm]);

  useEffect(() => {
    let ignore = false;
    const runSearch = async () => {
      const trimmed = queryTerm.trim();
      if (trimmed.length < 2) {
        setResults([]);
        setLoading(false);
        setErrorMessage("");
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("releases")
        .select()
        .or(`artist.ilike.*${trimmed}*,album.ilike.*${trimmed}*`)
        .order("releaseDate", { ascending: true })
        .limit(100);
      if (ignore) {
        return;
      }
      if (error) {
        setErrorMessage("Unable to fetch releases right now. Please try again in a moment.");
        setResults([]);
      } else {
        setErrorMessage("");
        setResults(data ?? []);
      }
      setLoading(false);
    };

    runSearch();

    return () => {
      ignore = true;
    };
  }, [queryTerm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  const handleNavigate = (release) => {
    const releaseDate = dayjs(release.releaseDate);
    router.push({
      pathname: "/",
      query: {
        year: releaseDate.year(),
        month: releaseDate.month() + 1,
        day: releaseDate.date(),
      },
    });
  };

  const trimmedQuery = queryTerm.trim();

  return (
    <div className={styles.page}>
      <Head>
        <title>Search Hip Hop Releases</title>
        <meta
          name="description"
          content="Search upcoming and past hip hop releases by artist or album across the entire archive."
        />
      </Head>
      <h1 className={styles.title}>Search releases</h1>
      <p className={styles.subtitle}>
        Find any album in the archive by artist name or album title.
      </p>
      <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <IconSearch size={18} />
          <input
            className={styles.searchInput}
            type="search"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Try “Baby Smoove” or “The College Dropout”"
            aria-label="Search all hip hop releases"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Search
        </button>
      </form>

      {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

      {loading ? (
        <div className={styles.loader}>
          <Loader size="lg" />
        </div>
      ) : trimmedQuery.length < 2 ? (
        <div className={styles.emptyState}>
          Type at least two characters to search the full release archive.
        </div>
      ) : results.length === 0 ? (
        <div className={styles.emptyState}>
          No releases match “{trimmedQuery}”.
        </div>
      ) : (
        <ul className={styles.resultsList}>
          {results.map((release) => (
            <li key={release.id} className={styles.searchCard}>
              <div className={styles.searchBody}>
                <p className={styles.searchArtist}>{release.artist}</p>
                <p className={styles.searchAlbum}>{release.album}</p>
                <p className={styles.searchMeta}>
                  {dayjs(release.releaseDate).format("MMMM D, YYYY")}
                </p>
              </div>
              <button
                className={styles.viewButton}
                type="button"
                onClick={() => handleNavigate(release)}
              >
                View month
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;

