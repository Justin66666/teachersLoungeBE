import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { configDotenv } from "dotenv";

// Load environment variables from .env file
configDotenv();

//Initialize s3 info
const s3 = new S3Client({
  region: "us-east-2", // Hardcode the region to ensure it's always set
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: false,
  signatureVersion: 'v4',
});

// Set AWS region environment variable if not set
if (!process.env.AWS_REGION) {
  process.env.AWS_REGION = 'us-east-2';
}



//Functions for managing files

// Function to generate presigned URL for accessing private S3 objects
const generatePresignedUrl = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });
    
    // Generate presigned URL that expires in 1 hour
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return null;
  }
};

//Function to upload to s3
const s3Upload = async (req,res) => {   
    const file = req.file;
    
    // Log file
    console.log("\nFile: " + file + "\n");

    // Name file with timestamp
    const fileLoc = "uploads/" + file.originalname.split(' ').join('_');

    // Set up parameters for S3 upload
    const params = {
      Bucket: process.env.S3_BUCKET,
      Body: file.buffer,
      Key: fileLoc,
      ContentType: file.mimetype
    };

    // Upload file to S3
    console.log("Putting object in S3 with params: ", params);
    const command = new PutObjectCommand(params);

    try {
      console.log("Attempting S3 upload...");
      await s3.send(command);
      
      // Generate presigned URL for accessing the uploaded file
      const presignedUrl = await generatePresignedUrl(fileLoc);
      
      if (presignedUrl) {
        res.status(200).send({ 
          message: 'Image uploaded successfully', 
          bucket: process.env.S3_BUCKET, 
          file: fileLoc,
          url: presignedUrl 
        });
        console.log("File uploaded successfully with presigned URL: " + presignedUrl);
        return presignedUrl;
      } else {
        // Fallback to direct URL if presigned URL generation fails
        const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com/${fileLoc}`;
        res.status(200).send({ 
          message: 'Image uploaded successfully', 
          bucket: process.env.S3_BUCKET, 
          file: fileLoc,
          url: fileUrl 
        });
        console.log("File uploaded successfully: " + fileUrl);
        return fileUrl;
      }

    } catch (err) {
      console.error("S3 Upload Error:", err);
      console.error("Error details:", {
        message: err.message,
        code: err.code,
        name: err.name
      });
      
      // Send error response but don't crash the server
      if (!res.headersSent) {
        res.status(500).send({ 
          message: 'Image upload failed', 
          error: err.message,
          details: 'S3 configuration or network issue'
        });
      }
      return null;
    }
  }

const s3Delete = (req,res,next)=>{
  var regEx= new RegExp("uploads/(.*)")
  var fileID = regEx.exec(req.body.fileID);
  if(fileID != null){
    var fileUrl = fileID[0];
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileUrl
    }; 
    s3.deleteObject(params,function(err,data){
      if (err) {
        throw err;
    }
    return res.status(200).send({message:'File and post deleted succesfully'})
    })  
  }else{    
    return res.status(200).send({message:'Post deleted succesfully'})
  }
    
    
}

// Set up multer storage so it initially stores file in memory
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fieldSize: 50 * 1024 * 1024 } // Increase field size limit to 50MB
});

/* Function that parses file from http request body
const fileHelper = multer({
  limits:{fieldSize: 50 * 1024 * 1024},
  fileFilter(req, file, cb) {      
      cb(undefined, true)
  }
});*/

const fileUpload = s3Upload;

export { s3Upload, s3Delete, upload, fileUpload };