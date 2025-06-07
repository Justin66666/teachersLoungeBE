import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { configDotenv } from "dotenv";

// Load environment variables from .env file
configDotenv();

//Initialize s3 info
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  region: process.env.S3_REGION,
});



//Functions for managing files

// Was getting errors related to double response, so moved to dbLogic
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
     
    await s3.send(command);

    try {
      await s3.send(command);
      res.status(200).send({ message: 'Image uploaded successfully', bucket: process.env.S3_BUCKET, file: fileLoc });
      console.log("File uploaded successfully: " + process.env.S3_BUCKET + "/" + fileLoc);
      return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${fileLoc}`; // Return the file URL

    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Image upload failed', error: err.message });
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

export {s3Upload, s3Delete, upload};