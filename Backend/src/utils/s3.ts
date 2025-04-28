import * as Minio from "minio";
const minioClient = new Minio.Client({
  endPoint: "bucket-production-896e.up.railway.app",
  port: 443,
  useSSL: true,
  accessKey: "nmFzmyPEdPMGl10ZVZaZ",
  secretKey: "iJ01Va4nPwfxc2vW8RUwlA3yYsvLZuoL2yCBeSY2",
});

const bucket = "imagesrealestate";


export async function uploadFile(fcompressedBase64:Buffer): Promise<string>   {
    const destination = crypto.randomUUID()+".jpeg";
    
  minioClient.putObject(bucket, destination, fcompressedBase64);
  const presignedUrl = await minioClient.presignedGetObject(bucket, destination, 60 * 60 * 24 * 7); 
  console.log(presignedUrl);
  return presignedUrl;
}