import { Box, styled } from "@mui/material";

const BoxStyle = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '16px',
  paddingBottom: 5,

})

export default BoxStyle;