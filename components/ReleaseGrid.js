import ReleaseCard from "./ReleaseCard";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";
import DateHelpers from '../helper/dateUtilities'
import { Center, Loader, TextInput } from "@mantine/core";
import AppContext from "./AppContext";
import { useRouter } from "next/router";
import { IconX } from "@tabler/icons";
import styles from '../styles/ReleaseGrid.module.css'
import { useMediaQuery } from "@mantine/hooks";
import Grid from "./styled/ReleaseGrid/Grid";
import dynamic from 'next/dynamic';
import { styled } from "styled-components";
import Carousel from "./carousel/Carousel";
import { AddReleaseButton, LoginToUploadButton } from "./styled/ReleaseGrid/Buttons";
import { ReleaseGrouper } from "../helper/ReleaseGrouper";
import { ReleaseSorter } from "../helper/ReleaseSorter";


const Modal = dynamic(() => import('@mantine/core').then(mod => mod.Modal), {
    ssr: false,
    loading: () => <p>Loading modal...</p>
});

const AddRelease = dynamic(() => import('./AddRelease'), {
    ssr: false,
    loading: () => <p>Loading form...</p>
});


const ReleaseGrid = ({ additionId, setAdditionId, setSelectedIndex, setSelectedYear }) => {

    const [releases, setReleases] = useState([])
    const [_, setUploadModalOpened] = useState(false)
    const [addReleaseModalOpened, setAddReleaseModalOpened] = useState(false)
    const [defaultValueYearSelect, setDefaultValueYearSelect] = useState(new Date().getFullYear())
    const { loggedUser, year, month, selectedDayNumber, setSelectedDayNumber, setUniqueDays } = useContext(AppContext)
    const [insertedData, setInsertedData] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [fetching, setFetching] = useState(false) // set initial state to false
    const matches = useMediaQuery('(max-width: 900px)');
    const isMobileView = useMediaQuery('(max-width: 767px)')
    const handleSearch = useCallback(event => setSearchTerm(event.target.value), []);

    const dateLabelRef = useRef(null);

    const router = useRouter()

 
    useEffect(() => {
        dateLabelRef?.current?.scrollIntoView({
            behavior: "instant", // or 'instant'
            block: "center"
        });
    }, [dateLabelRef?.current, selectedDayNumber])

    const getReleases = async () => {
        setFetching(true);
        const { data, error } = await supabase
          .from('releases')
          .select()
          .gte("releaseDate", `${year}-${DateHelpers.appendZero(month)}-01`)
          .lte("releaseDate", `${year}-${DateHelpers.appendZero(month)}-${DateHelpers.getDaysInMonth(year, month)}`)
          .order('releaseDate', { ascending: true })
          .or(searchTerm ? `artist.ilike.*${searchTerm}*,album.ilike.*${searchTerm}*` : '');
      
        if (!error) {
          setReleases(data);
          const releasesDates = data.map(el => el.releaseDate);
          // days without leading zero
          const days = releasesDates.map(date => date.split("-")[2]).map(day => day.replace(/^0+/, ''));
          const unique = days.filter((day, index) => days.indexOf(day) === index);
          setUniqueDays(unique);
        }
      
        setFetching(false);
      };

    useEffect(() => {
        getReleases()
    }, [year, month, additionId, searchTerm])

    const grouper = new ReleaseGrouper();
    const sorter = new ReleaseSorter();

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
            >
              <AddRelease
                setAdditionId={setAdditionId}
                setDefaultValueYearSelect={setDefaultValueYearSelect}
                setOpened={setAddReleaseModalOpened}
                setInsertedData={setInsertedData}
                setSelectedIndex={setSelectedIndex}
                setSelectedYear={setSelectedYear}
              />
            </Modal>
          )}
      
          <div className="has-text-centered">
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
      
          <Center>
            <TextInput
              sx={{ width: matches ? "25vh" : "50vh" }}
              value={searchTerm}
              rightSection={
                searchTerm !== "" && (
                  <IconX onClick={() => setSearchTerm("")} size="xs" />
                )
              }
              onChange={handleSearch}
              type="search"
              placeholder="Search..."
            />
          </Center>
      
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
                      `${selectedMonthName} ${selectedDayNumber} ${year}` ===
                      dayjs(date).format("MMMM D YYYY")
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
