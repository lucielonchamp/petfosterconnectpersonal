import { Container, SxProps } from "@mui/material"
import Header from "./Header"

export const Layout = ({ children, sx }: { children: React.ReactNode, sx?: SxProps }) => {
  return (
    <Container maxWidth="lg" sx={{ minHeight: "90vh", width: "100vw", ...sx }}>
      <Header />
      {children}
    </Container>
  )
}