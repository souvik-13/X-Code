import {
  CopyObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

class AwsService {
  private s3: S3Client;

  constructor() {
    console.log(
      "Creating S3 client",
      process.env.S3_BUCKET_NAME,
      process.env.S3_BUCKET_REGION,
    );
    this.s3 = new S3Client({
      region: process.env.S3_BUCKET_REGION ?? "",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
        secretAccessKey: process.env.AWS_SECRET_KEY ?? "",
      },
    });
  }

  async createFolder(folderPrefix: string) {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME ?? "",
          Key: folderPrefix.endsWith("/") ? folderPrefix : `${folderPrefix}/`,
        }),
      );
    } catch (error) {
      console.error("Error creating folder in S3", error);
      throw error;
    }
  }

  async copyFolder(srcFolderPrefix: string, destFolderPrefix: string) {
    try {
      // list the files in the source folder
      const srcFiles = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: process.env.S3_BUCKET_NAME ?? "",
          Prefix: srcFolderPrefix,
        }),
      );

      if (!srcFiles.Contents || srcFiles.Contents.length === 0) return;

      // console.log("Files in the source folder:", srcFiles);

      // copy the files to the destination folder
      await Promise.all(
        srcFiles.Contents?.map(async (file) => {
          if (!file.Key) return;
          const destinationKey = file.Key.replace(
            srcFolderPrefix,
            destFolderPrefix,
          );
          // console.log("Copying file:", file.Key, "to", destinationKey);
          await this.s3.send(
            new CopyObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME ?? "",
              CopySource: `${process.env.S3_BUCKET_NAME}/${file.Key}`,
              Key: destinationKey,
            }),
          );
          // console.log("Copied file:", file.Key, "to", destinationKey);
        }) ?? [],
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * TODO: Copy a Github repo to S3
   * !! Not implemented yet
   * @param repoUrl
   * @param destFolderPrefix
   * @returns
   */
  async copyGithubRepoToS3(repoUrl: string, destFolderPrefix: string) {
    try {
      const repoName = repoUrl.split("/").pop();
      console.log("Repo name:", repoName);
      if (!repoName) return;
      // const srcFolderPrefix = `github/${repoName}`;
      // await copyFolder(srcFolderPrefix, destFolderPrefix);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

const awsServiceSingleton = () => {
  return new AwsService();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof awsServiceSingleton>;
} & typeof global;

const awsService = globalThis.prismaGlobal ?? awsServiceSingleton();

export default awsService;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = awsService;
