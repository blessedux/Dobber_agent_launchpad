import { createTheme } from "@mui/material/styles";

// Vision UI Dashboard base styles
import colors from "./base/colors";
import borders from "./base/borders";

// Vision UI Dashboard helper functions
import linearGradient from "./functions/linearGradient";

export default createTheme({
  palette: { ...colors },
  borders: { ...borders },
  functions: {
    linearGradient,
  },
}); 