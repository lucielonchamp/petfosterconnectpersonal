import { useEffect, useState } from "react";
import { AnimalListCard } from "../../components/animal/AnimalListCard";
import { useAuth } from "../../hooks/useAuth";
import { Animal, AnimalWithRelations } from "../../interfaces/animal";
import { Container, Stack, Typography } from "@mui/material";
import BoxStyle from "../../components/style/BoxStyle";
import { RoleEnum } from "../../interfaces/role";
import ButtonBlue from "../../components/ui/ButtonBlue";
import { useNavigate } from "react-router";
import { Path } from "../../interfaces/Path";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const MyAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const navigate = useNavigate();

  const { user } = useAuth();

  const fetchAnimals = async () => {
    const urlFoster = `${VITE_API_URL}/animal/foster/${user?.foster?.id}`;
    const urlShelter = `${VITE_API_URL}/animal/shelter/${user?.shelter?.id}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any;
    try {
      if (user?.role.name === RoleEnum.SHELTER) {
        response = await fetch(urlShelter, {
          credentials: "include",
        });
      }
      if (user?.role.name === RoleEnum.FOSTER) {
        response = await fetch(urlFoster, {
          credentials: "include",
        });
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAnimals(data.data);

    }
    catch (error) {
      console.error("Error fetching animals:", error);
    }
  }

  useEffect(() => {
    fetchAnimals();
  }, [user]);

  const getButton = (role: RoleEnum, animal: Animal) => {
    if (role === RoleEnum.SHELTER) {
      return <ButtonBlue onClick={() => {
        navigate(`${Path.DASHBOARD}${Path.ANIMAL_EDIT.replace(':id', animal.id)}`)
      }}>
        Modifier l'animal
      </ButtonBlue>;
    }

    return null;
  }


  return (
    <Container
      maxWidth={false}
      sx={{
        py: 4,
        px: { xs: 2, sm: 4 },
        flex: 1,
        // overflow: 'scroll',
        bgcolor: '#f5f5f5'
      }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 500 }} gutterBottom> Mes animaux</Typography>
      <BoxStyle>
        {animals?.map((animal: AnimalWithRelations) => (
          <Stack gap={2} key={animal.id}>
            <AnimalListCard key={animal.id} animal={animal} />
            {getButton(user?.role.name || RoleEnum.ADMIN, animal)}
          </Stack>
        ))}
      </BoxStyle>
    </Container>
  );
}