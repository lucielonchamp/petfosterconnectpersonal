import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import path from 'path';

// Vérification des variables d'environnement
if (!process.env.AWS_S3_BUCKET) {
    throw new Error('AWS_S3_BUCKET doit être défini dans les variables d\'environnement');
}

if (!process.env.AWS_REGION) {
    throw new Error('AWS_REGION doit être défini dans les variables d\'environnement');
}

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('Les identifiants AWS doivent être définis dans les variables d\'environnement');
}

// Configuration du client S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configuration de multer pour le stockage temporaire
const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite à 5MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Format de fichier non supporté'));
        }
    }
});

export const generateFileName = (animalName: string, originalName: string): string => {
    const timestamp = Date.now();
    const extension = path.extname(originalName);
    const sanitizedAnimalName = animalName.replace(/[^a-zA-Z0-9]/g, '_');
    return `animals/${sanitizedAnimalName}_${timestamp}${extension}`;
};

export const generateShelterLogoFileName = (shelterName: string, originalName: string): string => {
    const timestamp = Date.now();
    const extension = path.extname(originalName);
    const sanitizedShelterName = shelterName.replace(/[^a-zA-Z0-9]/g, '_');
    return `shelters/${sanitizedShelterName}_${timestamp}${extension}`;
};

export const uploadToS3 = async (file: Express.Multer.File, folder: string, fileName?: string): Promise<string> => {
    if (!process.env.AWS_S3_BUCKET) {
        throw new Error('AWS_BUCKET_NAME n\'est pas défini');
    }

    if (!file || !file.buffer) {
        console.error('Fichier invalide:', file);
        throw new Error('Fichier invalide');
    }

    const key = fileName || `${folder}/${Date.now()}_${file.originalname}`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    });

    try {
        await s3Client.send(command);

        const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return url;
    } catch (error) {
        console.error('Erreur détaillée lors de l\'upload vers S3:', error);
        throw new Error(`Erreur lors de l'upload du fichier vers S3: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
};

export const deleteFromS3 = async (url: string): Promise<void> => {
    if (!process.env.AWS_S3_BUCKET) {
        throw new Error('AWS_BUCKET_NAME n\'est pas défini');
    }

    try {
        // Extraction du nom de fichier de l'URL
        const urlParts = url.split('/');
        const key = urlParts.slice(3).join('/'); // Ignore le protocole, le domaine et le bucket


        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
        });

        await s3Client.send(command);
    } catch (error) {
        console.error('Erreur lors de la suppression du fichier S3:', error);
        throw new Error(`Erreur lors de la suppression du fichier S3: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
};