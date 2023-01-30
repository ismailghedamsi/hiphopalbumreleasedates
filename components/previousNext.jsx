import { Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useContext, useEffect } from "react";
import AppContext from "./AppContext";
import styles from '../styles/previousNext.module.css'
import { MonthChangeButton } from "./styled/MonthChangeButton";

const PreviousNext = ({ additionId }) => {
    const { year, setMonth, month, setYear } = useContext(AppContext)
    const matches = useMediaQuery('(min-width: 500px)');

    useEffect(() => {
        moment(new Date(year, month - 1, 1)).format("MMMM")
    }, [month, year, additionId])


    return (
        <Flex
            mih={50}
            gap="md"
            justify="center"
            align="center"
            direction={matches ? "row" : "column"}
            wrap="nowrap"
        >
            <MonthChangeButton onClick={handlePreviousMonth()} variant="outline">Previous</MonthChangeButton>
            <div className={styles.month_label}>{moment(new Date(year, month - 1, 1)).format(matches ? "MMMM" : "MMM")}</div>
            <MonthChangeButton variant="outline" onClick={handleNextMonth()}>Next</MonthChangeButton>
        </Flex>
    )

    function handleNextMonth() {
        return () => {
            if (month - 1 === 11) {
                setMonth(1);
                setYear(year + 1);
            } else {
                setMonth(month + 1);
            }
        };
    }

    function handlePreviousMonth() {
        return () => {
            if (month - 1 === 0) {
                setMonth(12);
                setYear(year - 1);
            } else {
                setMonth(month - 1);
            }
        };
    }
}

export default PreviousNext