import ReleaseCard from "./ReleaseCard";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";
import DateHelpers from '../helper/dateUtilities'
import { Center, Loader, Paper, Text, Group, SegmentedControl, Stack, ScrollArea, Button } from "@mantine/core";
import AppContext from "./AppContext";
import { useRouter } from "next/router";
import styles from '../styles/ReleaseGrid.module.css'
import { useMediaQuery } from "@mantine/hooks";
import Grid from "./styled/ReleaseGrid/Grid";
import dynamic from 'next/dynamic';
import Carousel from "./carousel/Carousel";
import { AddReleaseButton, LoginToUploadButton, ExportButton } from "./styled/ReleaseGrid/Buttons";
import { ReleaseGrouper } from "../helper/ReleaseGrouper";
import { ReleaseSorter } from "../helper/ReleaseSorter";
import Search from "./Search";
import useDidMountEffect from "./hooks/useDidMountEffect";
import { Tabs } from "@mantine/core";


const Modal = dynamic(() => import('@mantine/core').then(mod => mod.Modal), {
    ssr: false,
    loading: () => <p>Loading modal...</p>
});

const AddRelease = dynamic(() => import('./AddRelease'), {
    ssr: false,
    loading: () => <p>Loading form...</p>
});

const BulkAddRelease = dynamic(() => import('./BulkAddRelease'), {
    ssr: false,
    loading: () => <p>Loading bulk form...</p>
});


const ReleaseGrid = ({ additionId, initialReleases = [], setAdditionId, setSelectedIndex, setSelectedYear }) => {

    const [releases, setReleases] = useState(initialReleases)
    const [_, setUploadModalOpened] = useState(false)
    const [addReleaseModalOpened, setAddReleaseModalOpened] = useState(false)
    const [defaultValueYearSelect, setDefaultValueYearSelect] = useState(new Date().getFullYear())
    const { loggedUser, year, month, setMonth, setYear, selectedDayNumber, setSelectedDayNumber, setUniqueDays } = useContext(AppContext)
    const [insertedData, setInsertedData] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [searchScope, setSearchScope] = useState("month");
    const [globalResults, setGlobalResults] = useState([]);
    const [globalFetching, setGlobalFetching] = useState(false);
    const [fetching, setFetching] = useState(false)
    const isMobileView = useMediaQuery('(max-width: 767px)')
    const handleSearch = useCallback(event => setSearchTerm(event.target.value), []);

    const dateLabelRef = useRef(null);

    const router = useRouter()

 
    useDidMountEffect(() => {
        dateLabelRef?.current?.scrollIntoView({
            behavior: "instant",
            block: "center"
        });
    }, [selectedDayNumber])

    const updateUniqueDays = useCallback((data = []) => {
        if (!setUniqueDays) {
            return;
        }
        const releasesDates = data.map(el => el.releaseDate)
        const days = releasesDates
            .map(date => date.split("-")[2])
            .map(day => day.replace(/^0+/, ''));
        const unique = days.filter((day, index) => days.indexOf(day) === index);
        setUniqueDays(unique);
    }, [setUniqueDays]);

    useEffect(() => {
        if (initialReleases.length > 0) {
            updateUniqueDays(initialReleases);
        }
    }, [initialReleases, updateUniqueDays]);

    useEffect(() => {
        let ignore = false;

        const runGlobalSearch = async () => {
            if (searchScope !== "all") {
                setGlobalResults([]);
                setGlobalFetching(false);
                return;
            }
            const term = searchTerm.trim();
            if (term.length < 2) {
                setGlobalResults([]);
                setGlobalFetching(false);
                return;
            }
            setGlobalFetching(true);
            const { data, error } = await supabase
                .from("releases")
                .select()
                .or(`artist.ilike.*${term}*,album.ilike.*${term}*`)
                .order('releaseDate', { ascending: true })
                .limit(100);
            if (ignore) {
                return;
            }
            if (!error && data) {
                setGlobalResults(data);
            } else {
                setGlobalResults([]);
            }
            setGlobalFetching(false);
        };

        runGlobalSearch();

        return () => {
            ignore = true;
        };
    }, [searchScope, searchTerm]);

    const getReleases = useCallback(async (term = "") => {
        setFetching(true);
        let query = supabase.from('releases').select()
            .gte("releaseDate", `${year}-${DateHelpers.appendZero(month)}-01`)
            .lte("releaseDate", `${year}-${DateHelpers.appendZero(month)}-${DateHelpers.getDaysInMonth(year, month)}`)
            .order('releaseDate', { ascending: true });

        const trimmedTerm = term.trim();
        if (trimmedTerm !== "") {
            query = query.or(`artist.ilike.*${trimmedTerm}*,album.ilike.*${trimmedTerm}*`);
        }
        const { data, error } = await query;
        if (!error && data) {
            setReleases(data);
            updateUniqueDays(data);
        } else if (!error) {
            setReleases([]);
            updateUniqueDays([]);
        }
        setFetching(false);
    }, [month, updateUniqueDays, year]);

    useEffect(() => {
        if (searchScope === "month") {
            getReleases(searchTerm);
        } else {
            getReleases("");
        }
    }, [year, month, additionId, searchScope, searchTerm, getReleases]);

    const grouper = new ReleaseGrouper();
    const sorter = new ReleaseSorter();
    const handleExportCurrentMonth = () => {
        if (!releases || releases.length === 0) {
            window.alert("No releases available to export for this month.");
            return;
        }

        const escapeCSV = (value) => {
            if (value === null || value === undefined) {
                return '""';
            }
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
        };

        const headers = [
            "Artist",
            "Album",
            "Release Date",
            "Spotify",
            "Bandcamp",
            "Apple Music",
            "Cover",
            "Added By"
        ];

        const rows = releases.map((release) => {
            const links = release.links || {};
            return [
                escapeCSV(release.artist),
                escapeCSV(release.album),
                escapeCSV(dayjs(release.releaseDate).format("YYYY-MM-DD")),
                escapeCSV(links.spotify ?? ""),
                escapeCSV(links.bandcamp ?? ""),
                escapeCSV(links.apple_music ?? ""),
                escapeCSV(release.cover ?? ""),
                escapeCSV(release.addedBy ?? "")
            ];
        });

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const formattedMonth = dayjs(`${year}-${DateHelpers.appendZero(month)}-01`).format("MMMM-YYYY");
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `releases-${formattedMonth}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleSelectSearchResult = useCallback((release) => {
        if (!release?.releaseDate) {
            return;
        }
        const releaseDate = dayjs(release.releaseDate);
        setYear(releaseDate.year());
        setMonth(releaseDate.month() + 1);
        setSelectedDayNumber(releaseDate.format("D"));
        setSearchScope("month");
        setSearchTerm("");
    }, [setMonth, setSelectedDayNumber, setYear]);

    const sortedGroupedReleases = sorter.sortByDate(grouper.groupByDate(releases));

    return (
        <>
          {loggedUser && (
            <Modal
              opened={addReleaseModalOpened}
              centere
              onClose={() => setAddReleaseModalOpened(false)}
              transition="fade"
              transitionDuration={600}
              transitionTimingFunction="ease"
              title="Add release"
              size="lg"
            >
              <Tabs defaultValue="single">
                <Tabs.List>
                  <Tabs.Tab value="single">Single Add</Tabs.Tab>
                  <Tabs.Tab value="bulk">Bulk Add (JSON)</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="single" pt="xs">
                  <AddRelease
                    setAdditionId={setAdditionId}
                    setDefaultValueYearSelect={setDefaultValueYearSelect}
                    setOpened={setAddReleaseModalOpened}
                    setInsertedData={setInsertedData}
                    setSelectedIndex={setSelectedIndex}
                    setSelectedYear={setSelectedYear}
                  />
                </Tabs.Panel>

                <Tabs.Panel value="bulk" pt="xs">
                  <BulkAddRelease
                    setAdditionId={setAdditionId}
                    setInsertedData={setInsertedData}
                    setSelectedIndex={setSelectedIndex}
                    setSelectedYear={setSelectedYear}
                  />
                </Tabs.Panel>
              </Tabs>
            </Modal>
          )}
      
          <div className="has-text-centered" style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <ExportButton onClick={handleExportCurrentMonth}>
              Export Month CSV
            </ExportButton>
            {loggedUser ? (
              <AddReleaseButton onClick={() => setAddReleaseModalOpened(true)}>
                Add release
              </AddReleaseButton>
            ) : (
              <LoginToUploadButton onClick={() => router.push("/signIn")}>
                Login to add a release
              </LoginToUploadButton>
            )}
          </div>

          <Center mt="md" mb="xs">
            <SegmentedControl
              value={searchScope}
              onChange={setSearchScope}
              data={[
                { label: "This month", value: "month" },
                { label: "All releases", value: "all" },
              ]}
              size="sm"
            />
          </Center>

          <Search
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder={
              searchScope === "all"
                ? "Search every release by artist or album..."
                : "Filter this month’s releases..."
            }
          />

          {searchScope === "all" ? (
            <Paper shadow="sm" radius="md" p="md" withBorder mt="md" mx="auto" style={{ maxWidth: 800 }}>
              {searchTerm.trim().length < 2 ? (
                <Text size="sm" color="dimmed">
                  Type at least 2 characters to search the full release archive.
                </Text>
              ) : globalFetching ? (
                <Center>
                  <Loader size="lg" />
                </Center>
              ) : globalResults.length > 0 ? (
                <ScrollArea.Autosize mah={360}>
                  <Stack spacing="sm">
                    {globalResults.map((result) => (
                      <Group key={result.id} position="apart" align="flex-start" spacing="md">
                        <div>
                          <Text fw={600}>{result.artist}</Text>
                          <Text size="sm" color="dimmed">
                            {result.album}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {dayjs(result.releaseDate).format("MMMM D, YYYY")}
                          </Text>
                        </div>
                        <Button size="xs" variant="light" onClick={() => handleSelectSearchResult(result)}>
                          Go to month
                        </Button>
                      </Group>
                    ))}
                  </Stack>
                </ScrollArea.Autosize>
              ) : (
                <Text size="sm">No releases match “{searchTerm.trim()}”.</Text>
              )}
            </Paper>
          ) : fetching ? (
            <Center>
              <Loader size="lg" />
            </Center>
          ) : sortedGroupedReleases.length > 0 ? (
            sortedGroupedReleases.map(([date, options]) => {
              const selectedMonthName = dayjs().month(month - 1).format("MMMM");
              return (
                <Fragment key={date}>
                    <h1
                    ref={
                      options.some(el => el.releaseDate.split("-")[2].replace(/^0+/, '') === selectedDayNumber) ||
                      `${selectedMonthName} ${selectedDayNumber} ${year}` === dayjs(date).format("MMMM D YYYY")
                        ? dateLabelRef
                        : null
                    }
                    className="has-text-centered mt-3"
                  >
                    <span className={styles.date}>
                      {dayjs(date).format("MMMM D YYYY")}
                    </span>
                  </h1>

                  {!isMobileView ? (
                    <Grid>
                      {options.map((el, index) => (
                        <ReleaseCard
                          fetching={fetching}
                          index={index}
                          key={index}
                          setReleases={setReleases}
                          releases={releases}
                          setUploadModalOpened={setUploadModalOpened}
                          release={el}
                        />
                      ))}
                    </Grid>
                  ) : (
                    <Carousel cards={options} />
                  )}
                </Fragment>
              );
            })
          ) : (
            <Center>
              <h1>No release date was announced for this month</h1>
            </Center>
          )}
        </>
      );
}
export default ReleaseGrid;
