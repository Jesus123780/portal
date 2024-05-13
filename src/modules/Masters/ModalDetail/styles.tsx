import { styled, TextField as Input } from "@mui/material";

export const TextField = styled(Input)(
    () => `
      display: flex;
      flex: 1;
      flex-direction: column;
  `
  );