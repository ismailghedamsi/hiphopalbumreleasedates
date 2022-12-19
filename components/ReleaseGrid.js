import ReleaseCard from "./ReleaseCard";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { format } from "date-fns";
import dayjs from "dayjs";


const Grid = styled.div`
display: flex;
flex-wrap: wrap;
padding: 5px;
justify-content: center;
`;


const ReleaseGrid = ({ month, setMonth, year, setYear, selectedIndex, setSelectedIndex, setSelectedYear, selectedYear }) => {

    const [releases, setReleases] = useState([])

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    const appendZero = (month) => {
        if (month < 10) {
            return "0" + month
        }
        return month
    }


    const getReleases = async () => {

        let query = supabase.from('releases').select()
        query = query.gte("releaseDate", `${year}-${appendZero(month) + 1}-01`).lte("releaseDate", `${year}-${appendZero(month + 1)}-${getDaysInMonth(selectedYear, selectedIndex)}`)
            .order('releaseDate', { ascending: true })
        const { data, error } = await query
        if (!error) {
            setReleases(data)
        }
    }

    useEffect(() => {
        getReleases()
    }, [year, month])

    // Group your items
    let grouped = releases.reduce((acc, el) => {
        if (!acc[dayjs(el.releaseDate).format('YYYY-MM-DD')]) acc[dayjs(el.releaseDate).format('YYYY-MM-DD')] = [];
        acc[dayjs(el.releaseDate).format('YYYY-MM-DD')].push(el);
        return acc;
    }, {});

    function getSortedKeys(obj) {
        var keys = Object.keys(obj);
        return keys.sort(function (a, b) { return obj[b] - obj[a] });
    }


    const sorted = Object.entries(grouped).sort((d1, d2) => {
        var parseDate = function parseDate(dateAsString) {
            var dateParts = dateAsString.split(" ");
            return new Date(parseInt(dateParts[2], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[0], 10));
        };

        return parseDate(d1[0]) - parseDate(d2[0]);
    })

    console.log("sorted ",sorted)

    return (
        <div>

            {sorted.map(([date, options]) => {
                return (
                    <>
                        <h1 className="has-text-centered">{dayjs(date).format('MMMM D YYYY')}</h1>
                        <Grid>
                            {options.map((el) => {
                                return (<ReleaseCard release={el} />)

                            })}
                        </Grid>


                    </>
                );
            })}



        </div>
    );
};

export default ReleaseGrid;
