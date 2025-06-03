import { Avatar, Box, Chip, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Path } from "../../interfaces/Path";
import { RequestStatus, RequestWithRelations } from "../../interfaces/request";
import { RoleEnum } from "../../interfaces/role";

const API_URL = import.meta.env.VITE_API_URL;
export const RequestList = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [requests, setRequests] = useState<RequestWithRelations[]>([]);

  const getRequests = async () => {
    const requestResponse = await fetch(`${API_URL}/request/user/${user?.id}`, {
      credentials: 'include',
    })


    const { data: requestData } = await requestResponse.json();
    setRequests(requestData);
  }

  const handleNavigateRequests = (requestId: string) => () => {
    navigate(`${Path.DASHBOARD}${Path.REQUEST.replace(':requestId', requestId)}`);
  }

  useEffect(() => {
    getRequests();
  }, [user]);

  return (

    <Container maxWidth={false}
      sx={{
        py: 4,
        px: { xs: 2, sm: 4 },
        flex: 1,
        // overflow: 'scroll',
        bgcolor: 'rgba(255,255,255,0.8)',
      }}>

      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 500 }} gutterBottom>
        {
          user?.role?.name === RoleEnum.SHELTER ?
            'Demandes d\'accueil'
            : user?.role?.name === RoleEnum.FOSTER ?
              'Demandes envoyées'
              :
              'Liste des demandes'

        }</Typography>

      <Paper variant='outlined' sx={{
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Animal</TableCell>
                <TableCell>Date de la demande</TableCell>
                <TableCell>Statut</TableCell>
                {/* <TableCell align="right">Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request?.id} onClick={handleNavigateRequests(request?.id)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={request?.animal.picture}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1
                        }}
                      />
                      {request?.animal.name}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        request.status === RequestStatus.ACCEPTED ? 'Validée' :
                          request.status === RequestStatus.REFUSED ? 'Refusée' : 'En attente'
                      }
                      color={
                        request.status === RequestStatus.ACCEPTED ? 'success' :
                          request.status === RequestStatus.REFUSED ? 'error' : 'warning'
                      }
                      size="small"
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  {/* <TableCell align="right">
                        <IconButton size="small">
                          <MenuIcon />
                        </IconButton>
                      </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

    </Container >
  )
}