import ReleaseCard from "./ReleaseCard";
import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";
import DateHelpers from '../helper/dateUtilities'
import {  Modal, useMantineTheme } from "@mantine/core";
import AppContext from "./AppContext";
import AddRelease from "./AddRelease";

const Grid = styled.div`
display: flex;
flex-wrap: wrap;
padding: 5px;
justify-content: center;
`;


const ReleaseGrid = ({ additionId, setAdditionId, setSelectedIndex, setSelectedYear }) => {

    const [releases, setReleases] = useState([])
    const [uploadModalOpened, setUploadModalOpened] = useState(false)
    const [addReleaseModalOpened, setAddReleaseModalOpened] = useState(false)
    const [defaultValueYearSelect, setDefaultValueYearSelect] = useState(new Date().getFullYear())
    const { loggedUser, year, month } = useContext(AppContext)
    const [insertedData, setInsertedData] = useState([])

    const theme = useMantineTheme();

    const getReleases = async () => {

        let query = supabase.from('releases_duplicate').select()
        query = query.gte("releaseDate", `${year}-${DateHelpers.appendZero(month)}-01`).lte("releaseDate", `${year}-${DateHelpers.appendZero(month)}-${DateHelpers.getDaysInMonth(year, month)}`)
            .order('releaseDate', { ascending: true })
        const { data, error } = await query
        if (!error) {
            setReleases(data)
        }
    }

    useEffect(() => {
        console.log('ca rentre')
        getReleases()
    }, [year, month,additionId])

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

    return (
        <>
            {loggedUser && <Modal
                opened={addReleaseModalOpened}
                centere
                onClose={() => setAddReleaseModalOpened(false)}
                transition="fade"
                transitionDuration={600}
                transitionTimingFunction="ease"
                title="Add a release"
            >
                <AddRelease setAdditionId={setAdditionId} setDefaultValueYearSelect={setDefaultValueYearSelect} setOpened={setAddReleaseModalOpened} setInsertedData={setInsertedData} setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} />
            </Modal>
            }
            <div className="has-text-centered">
                {loggedUser ? <button style={{ marginBottom: "20px" }} onClick={() => setAddReleaseModalOpened(true)}>Add a release</button> : <button onClick={() => router.push("/signIn")}>Login to add a release</button>}
            </div>
            
            {sorted.map(([date, options]) => {
                return (
                    <>
                        <h1 className="has-text-centered">{dayjs(date).format('MMMM D YYYY')}</h1>
                        <Grid>
                            {options.map((el,index) => {
                                return (<ReleaseCard key={index} setReleases={setReleases} releases={releases} setUploadModalOpened={setUploadModalOpened} release={el} />)

                            })}
                        </Grid>
                    </>
                );
            })}
        </>
    );
};

export default ReleaseGrid;
