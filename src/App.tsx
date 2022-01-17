import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Selects from "./Selects";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material";

function App() {
    const [d, setD] = useState<string[][]>([[""]]);
    const [shownD, setShownD] = useState<string[][]>([[""]]);
    const [isLoading, setIsLoading] = useState(false);
    const [major, setMajor] = useState("ams");
    const [courseTexts, setCourseTexts] = useState<string[]>([]);
    const [courseTitleTexts, setCourseTitleTexts] = useState<string[]>([]);
    const [searchCT, setSearchCT] = useState("");
    const [searchT, setSearchT] = useState("");
    const [nowDetail, setNowDetail] = useState([""]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        let _window = window as any;
        _window.d = d;
    }, [d]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const data = await axios.get(
                `https://sbu-course.herokuapp.com/stony-course/api/${major}/`
            );

            // console.log(data.data);

            const html = document.createElement("html");
            html.innerHTML = data.data;
            const classes = html.getElementsByClassName("course");
            const items = [];
            const cTexts = [];
            const cTTexts = [];
            for (let i = 0; i < classes.length; i++) {
                const item = classes[i];
                const itemElements = [];
                for (let j = 0; j < item.childNodes.length; j++) {
                    const itemEle =
                        (item.childNodes[j] as HTMLElement).textContent ??
                        (item.childNodes[j] as Text).wholeText;

                    // console.log(itemEle);
                    if (itemEle.match(/[\S]/)) {
                        itemElements.push(itemEle);
                    }
                }
                const modifiedItemElements = itemElements.filter(
                    (iEle) =>
                        iEle !== "\n                     " && iEle !== "\u200B"
                );
                items.push(modifiedItemElements);
                cTTexts.push(
                    modifiedItemElements[0].replace(/\u00a0/, " ").toLowerCase()
                );
                cTexts.push((item.textContent as string).toLowerCase());
            }

            setD(items);
            setCourseTitleTexts(cTTexts);
            setCourseTexts(cTexts);
            setIsLoading(false);
            console.log(cTexts);
        };

        fetchData();
    }, [major]);

    useEffect(() => {
        console.log(d);
        setShownD(d);
    }, [d]);

    const filterCourseTitle = (searchText: string) => {
        setShownD(
            d.filter((datum, idx) => {
                const isIncluded = courseTitleTexts[idx].includes(
                    searchText.toLowerCase()
                );
                console.log("------");
                console.log(courseTitleTexts[idx]);
                console.log(isIncluded);
                return isIncluded;
            })
        );
        setSearchCT(searchText);
    };

    const filterCourse = (searchText: string) => {
        setShownD(
            d.filter((datum, idx) => {
                const isIncluded = courseTexts[idx].includes(
                    searchText.toLowerCase()
                );
                console.log("------");
                console.log(courseTexts[idx]);
                console.log(isIncluded);
                return isIncluded;
            })
        );
        setSearchT(searchText);
    };

    return (
        <Box
            sx={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                minHeight: "100vh",
                display: "flex",
                mt: 8,
            }}
            className="App"
        >
            <Typography variant="h2">SBU Course Search</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 4 }}>
                <Selects major={major} setMajor={setMajor} />
                <TextField
                    sx={{ m: 2 }}
                    label="search by title"
                    variant="standard"
                    value={searchCT}
                    onChange={(e) => filterCourseTitle(e.target.value)}
                    disabled={isLoading}
                    helperText="ex) 101"
                />
                <TextField
                    label="search by contents"
                    variant="standard"
                    value={searchT}
                    onChange={(e) => filterCourse(e.target.value)}
                    disabled={isLoading}
                    helperText="ex) object-oriented"
                />
            </Box>
            {isLoading ? (
                <Box>
                    <CircularProgress size={100} />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignContent: "center",
                        justifyContent: "center",
                    }}
                >
                    {shownD.map((datum, idx) => {
                        // console.log(datum);
                        return (
                            <Paper
                                sx={{
                                    p: 4,
                                    m: 4,
                                    width: 250,
                                    height: 300,
                                    overflow: "scroll",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                                elevation={3}
                                key={`course-${idx}`}
                            >
                                <Typography
                                    sx={{ textAlign: "center" }}
                                    variant="h4"
                                >
                                    {datum[0].replace(/:[\s|\S]*/, "")}
                                </Typography>
                                <Typography
                                    sx={{ textAlign: "center" }}
                                    variant="h5"
                                >
                                    {datum[0].replace(/^[\s|\S].*?:+/, "")}
                                </Typography>

                                <Button
                                    onClick={() => {
                                        setNowDetail(datum);
                                        setIsDetailModalOpen(true);
                                    }}
                                >
                                    See Details
                                </Button>
                            </Paper>
                        );
                    })}
                </Box>
            )}
            <Modal
                open={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                }}
            >
                <Paper
                    sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        maxHeight: 600,
                        overflow: "auto",
                    }}
                >
                    {nowDetail.map((text, i) => {
                        if (i === 0) {
                            return (
                                <Box key={`in-details-${i}`}>
                                    <Typography
                                        sx={{ textAlign: "center", m: 2 }}
                                        variant="h4"
                                    >
                                        {text.replace(/:[\s|\S]*/, "")}
                                    </Typography>
                                    <Typography
                                        sx={{ textAlign: "center" }}
                                        variant="h5"
                                    >
                                        {text.replace(/^[\s|\S].*?:+/, "")}
                                    </Typography>
                                </Box>
                            );
                        } else if (
                            text.includes("Advisory Prerequisite:") ||
                            text.includes("Advisory Prerequisites:")
                        ) {
                            return (
                                <Typography
                                    key={`in-details-${i}`}
                                    variant="h6"
                                    sx={{
                                        color: theme.palette.info.main,
                                        m: 1,
                                    }}
                                >
                                    {text}
                                </Typography>
                            );
                        } else if (
                            text.includes("Prerequisite:") ||
                            text.includes("Prerequisites:")
                        ) {
                            return (
                                <Typography
                                    key={`in-details-${i}`}
                                    variant="h6"
                                    sx={{
                                        color: theme.palette.success.dark,
                                        m: 1,
                                    }}
                                >
                                    {text}
                                </Typography>
                            );
                        } else if (
                            text.includes("Anti-requisite:") ||
                            text.includes("Anti-requisites:")
                        ) {
                            return (
                                <Typography
                                    key={`in-details-${i}`}
                                    variant="h6"
                                    sx={{
                                        color: theme.palette.error.dark,
                                        m: 1,
                                    }}
                                >
                                    {text}
                                </Typography>
                            );
                        } else if (text.includes(":")) {
                            return (
                                <Typography
                                    key={`in-details-${i}`}
                                    variant="h6"
                                >
                                    {text}
                                </Typography>
                            );
                        } else if (
                            text.includes(" credits") &&
                            text.length < 12
                        ) {
                            return (
                                <Chip
                                    sx={{
                                        m: 2,
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                    }}
                                    color="secondary"
                                    key={`in-details-${i}`}
                                    label={text}
                                />
                            );
                        }
                        return (
                            <Typography
                                sx={{ m: 2 }}
                                key={`in-details-${i}`}
                                variant="body1"
                            >
                                {text}
                            </Typography>
                        );
                    })}
                </Paper>
            </Modal>
        </Box>
    );
}

export default App;
