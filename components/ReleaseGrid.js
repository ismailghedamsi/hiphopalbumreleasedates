import ReleaseCard from "./ReleaseCard";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";
import DateHelpers from '../helper/dateUtilities'
import { Center, Loader } from "@mantine/core";
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
import ModalBase from "./ModalBase";


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
    const { loggedUser, year, month, selectedDayNumber, setSelectedDayNumber, setUniqueDays } = useContext(AppContext)
    const [insertedData, setInsertedData] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
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
        getReleases(searchTerm);
    }, [year, month, additionId, searchTerm, getReleases]);

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

    const sortedGroupedReleases = sorter.sortByDate(grouper.groupByDate(releases));

    return (
        <>
          {loggedUser && (
            <ModalBase
              opened={addReleaseModalOpened}
              title="Add release"
              size="xl"
              onClose={() => setAddReleaseModalOpened(false)}
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
            </ModalBase>
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

          <Search
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            placeholder="Filter this month’s releases..."
          />

          {fetching ? (
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
