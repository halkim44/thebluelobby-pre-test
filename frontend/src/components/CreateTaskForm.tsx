import TextField from "@mui/material/TextField";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { createTask } from "../api/tasks";
import { ChangeEvent, useState } from "react";
import { Priority } from "../types/tasks";
interface IFormData {
  description: string;
  priority?: Priority;
}

export const CreateTaskForm = ({
  successFunction,
}: {
  successFunction?: () => void;
}) => {
  const [formData, setFormData] = useState<IFormData>({
    description: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData?.description?.length) {
      alert("please provide task description.");
    } else {
      createTask(formData).then(() => {
        setFormData({
          description: "",
        });
        if (successFunction) successFunction();
      });
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        margin: "20px 0",
      }}
    >
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="priority-select">Priority</InputLabel>
        <Select
          labelId="priority-select"
          onChange={handleChange}
          value={formData?.priority || ""}
          label="priority"
          name="priority"
        >
          <MenuItem value={"LOW"}>Low</MenuItem>
          <MenuItem value={"MEDIUM"}>Medium</MenuItem>
          <MenuItem value={"HIGH"}>High</MenuItem>
        </Select>
      </FormControl>

      <TextField
        sx={{ ml: 1, flex: 1 }}
        placeholder="Add Task"
        inputProps={{ "aria-label": "Add Task" }}
        onChange={handleChange}
        name="description"
        value={formData.description}
        multiline
        maxRows={5}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="submit">
        <ArrowUpwardIcon />
      </IconButton>
    </Paper>
  );
};
