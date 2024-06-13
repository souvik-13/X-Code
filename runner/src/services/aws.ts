import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import fs, { createWriteStream } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";

export default class AwsService {
  private bucket: string;
  private s3Client: S3Client;

  constructor() {
    this.bucket = process.env.S3_BUCKET_NAME ?? "";
    this.s3Client = new S3Client({
      region: process.env.S3_BUCKET_REGION ?? "",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
        secretAccessKey: process.env.AWS_SECRET_KEY ?? "",
      },
    });
  }

  async uploadFile(key: string, body: Buffer) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: body,
        }),
      );
    } catch (error) {
      console.error("Error uploading file to S3", error);
      throw error;
    }
  }

  async downloadS3Folder(s3FolderKey: string, localFolderPath: string) {
    // List all objects in the folder
    const { Contents: objects } = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: this.bucket,
        Prefix: s3FolderKey,
      }),
    );

    if (!objects) {
      throw new Error("No objects found in the S3 folder");
    }
    

    // Download each object (file) in the folder, ascyncronously using Promise.all
    await Promise.all(
      objects.map(async (object) => {
        const { Key: objectKey } = object;
        const { Body: objectBody } = await this.s3Client.send(
          new GetObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
          }),
        );

        if (!objectBody) {
          throw new Error("No body found in the S3 object");
        }

        const localFilePath = join(
          localFolderPath,
          objectKey!.replace(s3FolderKey, ""),
        );

        // if the path contains a folder, create the folders; eg: /new_folder_1/new_folder_2/file.txt
        const localFolder = localFilePath.split("/").slice(0, -1).join("/");
        // console.log("Creating folder", localFolder);
        await fs.promises
          .mkdir(localFolder, { recursive: true })
          .catch(console.error);

        const localFileWriteStream = createWriteStream(localFilePath);

        const readableStream = Readable.from(objectBody as Readable);
        readableStream.pipe(localFileWriteStream);

        return new Promise((resolve, reject) => {
          readableStream.on("end", resolve);
          readableStream.on("error", reject);
        });
      }),
    );
  }

  async getFolder(key: string) {
    console.log("Getting folder from S3", key);
    try {
      const data = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: key.endsWith("/") ? key : `${key}/`,
          Delimiter: "/",
        }),
      );
      console.log(data);
      return {
        files: data.Contents,
        folders: data.CommonPrefixes,
      };
    } catch (error) {
      console.error("Error getting folder from S3", error);
      throw error;
    }
  }

  async getFile(key: string) {
    try {
      const data = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      // console.log(data.Body?.toString());
      return data.Body;
    } catch (error) {
      console.error("Error getting file from S3", error);
      throw error;
    }
  }
}

// const awsServiceSingleton = () => {
//   return new AwsService();
// };

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof awsServiceSingleton>;
// } & typeof global;

// const awsService = globalThis.prismaGlobal ?? awsServiceSingleton();

// export default awsService;

// if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = awsService;
