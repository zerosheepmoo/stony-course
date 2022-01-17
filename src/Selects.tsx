import React from "react";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { majorList } from "./majorList";

interface SelectsProps {
    major: string;
    setMajor: React.Dispatch<React.SetStateAction<string>>;
}

const Selects: React.VFC<SelectsProps> = ({ major, setMajor }) => {
    const handleMajor = (e: any) => {
        setMajor(e.target.value);
    };
    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="major-select-label">Major</InputLabel>
                <Select
                    labelId="major-select-label"
                    id="major-select"
                    value={major}
                    onChange={handleMajor}
                    label="Age"
                >
                    {majorList.map((item, idx) => (
                        <MenuItem key={`major-item-${idx}`} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default Selects;
