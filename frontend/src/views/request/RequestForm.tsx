import { useState, ChangeEvent, FormEvent } from "react";
import { Stack, Alert } from "@mui/material";
import PetFosterInput from "../../components/PetFosterTextField/PetFosterTextField";
import ButtonBlue from "../../components/ui/ButtonBlue";

interface RequestFormProps {
  onSubmit: (data: { fosterComment: string }) => Promise<void>;
  isLoading: boolean;
}

const RequestForm = ({ onSubmit, isLoading }: RequestFormProps) => {
  const [comment, setComment] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!comment.trim()) {
      setSubmitError("Veuillez ajouter un commentaire pour le refuge.");
      return;
    }

    try {
      await onSubmit({ fosterComment: comment });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <Stack component="form" onSubmit={handleFormSubmit} spacing={2}>
      <PetFosterInput
        label="Votre message pour le refuge"
        name="fosterComment"
        multiline
        rows={4}
        value={comment}
        onChange={handleCommentChange}
        required
      />

      {submitError && <Alert severity="error">{submitError}</Alert>}

      <Stack direction="row" justifyContent="flex-end">
        <ButtonBlue type="submit" disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
        </ButtonBlue>
      </Stack>
    </Stack>
  );
};

export default RequestForm;