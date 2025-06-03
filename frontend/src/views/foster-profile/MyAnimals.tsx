import { Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AnimalListCard } from "../../components/animal/AnimalListCard";
import BoxStyle from "../../components/style/BoxStyle";
import ButtonPurple from "../../components/ui/ButtonPurple";
import { useAuth } from "../../hooks/useAuth";
import { Animal, AnimalWithRelations } from "../../interfaces/animal";
import { Path } from "../../interfaces/Path";
import { RoleEnum } from "../../interfaces/role";

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
      return <ButtonPurple onClick={() => {
        navigate(`${Path.DASHBOARD}${Path.ANIMAL_EDIT.replace(':id', animal.id)}`)
      }}>
        Modifier l'animal
      </ButtonPurple>;
    }

    return null;
  }


  return (
    <Container
      maxWidth={false}
      sx={{
        bgcolor: 'rgba(255,255,255,0.8)',
        py: 4,
        px: { xs: 2, sm: 4 },
        flex: 1,
        overflow: 'scroll',
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