import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Selects from "./Selects";

function App() {
    const [d, setD] = useState<string[][]>([[""]]);
    const [shownD, setShownD] = useState<string[][]>([[""]]);
    const [isLoading, setIsLoading] = useState(false);
    const [major, setMajor] = useState("ams");
    const [courseText, setCourseText] = useState<string[]>([]);
    const [searchT, setSearchT] = useState("");

    useEffect(() => {
        let _window = window as any;
        _window.d = d;
    }, [d]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const details: any = {
                type: "abbrevation",
                abbreviation: major,
                search: "",
            };

            const formBody = [];
            for (const property in details) {
                const encodedKey = encodeURIComponent(property);
                const encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            const formBodyStr = formBody.join("&");

            const data = await axios.post(
                "/api/sb/bulletin/current/search/byabbreviation/index.php",
                formBodyStr,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                }
            );

            console.log(data.data);

            const html = document.createElement("html");
            html.innerHTML = data.data;
            const classes = html.getElementsByClassName("course");
            const items = [];
            const cTexts = [];
            for (let i = 0; i < classes.length; i++) {
                const item = classes[i];
                const itemElements = [];
                for (let j = 0; j < item.childNodes.length; j++) {
                    const itemEle =
                        (item.childNodes[j] as HTMLElement).textContent ??
                        (item.childNodes[j] as Text).wholeText;
                    console.log(itemEle);
                    itemElements.push(itemEle);
                }
                items.push(itemElements.filter((iEle) => iEle !== "\n  "));
                cTexts.push(item.textContent as string);
            }

            setD(items);
            setCourseText(cTexts);
            setIsLoading(false);
        };

        fetchData();
    }, [major]);

    useEffect(() => {
        setShownD(d);
    }, [d]);

    const filterCourse = (searchText: string) => {
        setShownD(
            d.filter((datum, idx) => courseText[idx].includes(searchText))
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
            }}
            className="App"
        >
            <Typography variant="h2">SBU Course Search</Typography>
            <Box sx={{ display: "flex" }}>
                <Selects major={major} setMajor={setMajor} />
                <TextField
                    value={searchT}
                    onChange={(e) => filterCourse(e.target.value)}
                    disabled={isLoading}
                />
            </Box>
            {isLoading ? (
                <Box>
                    <CircularProgress size={100} />
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    {shownD.map((datum, idx) => {
                        console.log(datum);
                        return (
                            <Paper
                                sx={{
                                    p: 4,
                                    m: 4,
                                    width: 250,
                                    height: 200,
                                    overflow: "scroll",
                                }}
                                elevation={2}
                                key={`course-${idx}`}
                            >
                                <Typography
                                    sx={{ textAlign: "center" }}
                                    variant="h4"
                                >
                                    {datum[0].replace(/:[\s|\S]*/g, "")}
                                </Typography>
                                <Typography variant="h5">
                                    {datum[0].replace(/[\s|\S]*:/g, "")}
                                </Typography>
                                <details>
                                    <summary>details...</summary>

                                    {datum.map((text, i) => {
                                        if (i === 0) {
                                            console.log(text);
                                            return;
                                        } else if (
                                            text.includes("Prerequisite:") ||
                                            text.includes("Prerequisites:")
                                        ) {
                                            return (
                                                <Typography
                                                    key={`inner-${idx}-${i}`}
                                                    variant="h6"
                                                    sx={{ color: "blue" }}
                                                >
                                                    {text}
                                                </Typography>
                                            );
                                        } else if (text.includes(":")) {
                                            return (
                                                <Typography
                                                    key={`inner-${idx}-${i}`}
                                                    variant="h6"
                                                >
                                                    {text}
                                                </Typography>
                                            );
                                        } else if (text.includes(" credits")) {
                                            return <Chip label={text} />;
                                        }
                                        return (
                                            <Typography
                                                key={`inner-${idx}-${i}`}
                                                variant="body1"
                                            >
                                                {text}
                                            </Typography>
                                        );
                                    })}
                                </details>
                            </Paper>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
}

export default App;
