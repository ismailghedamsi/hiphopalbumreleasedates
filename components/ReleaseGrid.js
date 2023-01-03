import ReleaseCard from "./ReleaseCard";
import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";
import DateHelpers from '../helper/dateUtilities'
import { Center, Modal, TextInput, useMantineTheme } from "@mantine/core";
import AppContext from "./AppContext";
import AddRelease from "./AddRelease";
import { useRouter } from "next/router";
import LocalSearch from "./LocalSearch";
import { IconX } from "@tabler/icons";
import styles from '../styles/ReleaseGrid.module.css'
import { useMediaQuery } from "@mantine/hooks";


const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    justify-content: center;
`;

const AddButton = styled.button`
     border-radius: 20px;
     background-color: #FFD700;
     margin-bottom: 4vh;
     margin-top : 4vh;
     border-style: solid;
     height : 5vh;
     width: 20vh;
     :hover {
        background-image: linear-gradient(rgb(0 0 0/30%) 0 0);
     }
`

const LoginToUploadButton = styled.button`
     border-radius: 20px;
     background-color: #FFD700;
     margin-bottom: 4vh;
     margin-top : 4vh;
     border-style: solid;
     height : 5vh;
     width: 20vh;
     :hover {
         background-image: linear-gradient(rgb(0 0 0/40%) 0 0);
     }
`



const ReleaseGrid = ({ additionId, setAdditionId, setSelectedIndex, setSelectedYear }) => {

    const [releases, setReleases] = useState([])
    const [uploadModalOpened, setUploadModalOpened] = useState(false)
    const [addReleaseModalOpened, setAddReleaseModalOpened] = useState(false)
    const [defaultValueYearSelect, setDefaultValueYearSelect] = useState(new Date().getFullYear())
    const { loggedUser, year, month } = useContext(AppContext)
    const [insertedData, setInsertedData] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const matches = useMediaQuery('(max-width: 900px)');

    const router = useRouter()

    const getReleases = async () => {

        let query = supabase.from('releases').select()
        query = query.gte("releaseDate", `${year}-${DateHelpers.appendZero(month)}-01`)
        .lte("releaseDate", `${year}-${DateHelpers.appendZero(month)}-${DateHelpers.getDaysInMonth(year, month)}`)
            .order('releaseDate', { ascending: true })

        if( searchTerm != "" ){
            console.log("earchterm ", searchTerm)
            query = query.or(`artist.ilike.*${searchTerm}*,album.ilike.*${searchTerm}*`)
        }
        const { data, error } = await query
        if (!error) {
            setReleases(data)
        }
    }

    useEffect(() => {
        getReleases()
    }, [year, month, additionId, searchTerm])

    // Group your items
    let grouped = releases.reduce((acc, el) => {
        if (!acc[dayjs(el.releaseDate).format('YYYY-MM-DD')]) acc[dayjs(el.releaseDate).format('YYYY-MM-DD')] = [];
        acc[dayjs(el.releaseDate).format('YYYY-MM-DD')].push(el);
        return acc;
    }, {});


    const sorted = Object.entries(grouped).sort((d1, d2) => {
        var parseDate = function parseDate(dateAsString) {
            var dateParts = dateAsString.split(" ");
            return new Date(parseInt(dateParts[2], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0], 10));
        };

        return parseDate(d1[0]) - parseDate(d2[0]);
    })

    const handleChange = event => {
        setSearchTerm(event.target.value);
      };

    return (
        <>
            {loggedUser && <Modal
                opened={addReleaseModalOpened}
                centere
                onClose={() => setAddReleaseModalOpened(false)}
                transition="fade"
                transitionDuration={600}
                transitionTimingFunction="ease"
                title="Add release"
            >
                <AddRelease setAdditionId={setAdditionId} setDefaultValueYearSelect={setDefaultValueYearSelect} setOpened={setAddReleaseModalOpened} setInsertedData={setInsertedData} setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} />
            </Modal>
            }

            <div className="has-text-centered">
                {loggedUser ? <AddButton onClick={() => setAddReleaseModalOpened(true)}>Add  release</AddButton> : <LoginToUploadButton onClick={() => router.push("/signIn")}>Login to add a release</LoginToUploadButton>}
            </div>

            <Center><TextInput sx={{width : matches ? "25vh" : "50vh"}} value={searchTerm} rightSection={searchTerm != "" && <IconX onClick={() => setSearchTerm('')} size="xs" />} onChange={handleChange} type="search" placeholder="Search..." /></Center> 

            {sorted.length > 0 ? sorted.map(([date, options]) => {
                return (
                    <>
                        <h1 className="has-text-centered mt-3"><span className={styles.date}>{dayjs(date).format('MMMM D YYYY')}</span></h1>
                        <Grid>
                            {options.map((el, index) => {
                                return (<ReleaseCard key={index} setReleases={setReleases} releases={releases} setUploadModalOpened={setUploadModalOpened} release={el} />)

                            })}
                        </Grid>
                    </>
                );
            }) : <Center><h1>No release date was announced for this month</h1></Center>}
        </>
    );
};

export default ReleaseGrid;
