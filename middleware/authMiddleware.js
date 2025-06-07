/*import jwt from "jsonwebtoken";

import connection from '../database.js';

const userAuth = async (req, res, next) => {
  // Get token from header
  const token = req.headers.authorization;

  // Check if the token is present and properly formatted
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const tokenValue = token.split(' ')[1]; // Extract the token part


    // Get email from the token
    const { email } = jwt.verify(tokenValue, process.env.JWT_SECRET);

    // Attach user id for further requests
    connection.query("select * from USER where USER.email=\""+email+"\";", function(error, results){

        // Return error if any
        if(error){
            console.error(error.stack);
            return res.status(500).json({message:"Server error: "+error.stack});
        }

        // Return error if no user is found
        if(results[0]==null){
            return res.status(401).json({message:"No user found with this email"});
        }else{
            req.userEmail = email; 
        }
    }
    );

    // Move forward with request
    next();
};

export {userAuth};*/
import jwt from "jsonwebtoken";
import connection from '../database.js';

const userAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  const tokenValue = token.split(" ")[1];

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET); 

    const email = decoded.email;
    const role = decoded.role;
    console.log("Email from token:", email); // ✅ debug log
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "No user found with this email" });
    }

    // ✅ Attach to request
    req.userEmail = email;
    req.userRole = role;

    console.log("Decoded user:", email, role); // ✅ debug log
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};



const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ message: 'Admin role required' });
  }
  next();
};

import pool from '../database.js';

const verifyAdminOrOwner = async (req, res, next) => {
  const postId = req.params.postId;
  console.log("Post ID:", postId); // Log the postId for debugging
  console.log("Request path:", req.path);
  console.log("Post ID from params:", req.params.postId);
  console.log("User role:", req.userRole);

  try {
    const result = await pool.query('SELECT * FROM post WHERE postid = $1', [postId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = result.rows[0];
    console.log("Post owner:", post.email);
    if (req.userRole === 'Admin' || post.email === req.userEmail) {
      return next();
    } else {
      return res.status(403).json({ message: "You are not authorized to delete this post" });
    }

  } catch (error) {
    console.error("verifyAdminOrOwner error:", error.stack);
    return res.status(500).json({ message: "Server error: " + error.stack });
  }
};

const verifyAdminOrCommentOwner = async (req, res, next) => {
  const commentId = req.params.commentId;

  console.log("Comment ID from params:", commentId);

  try {
    const result = await pool.query(
      'SELECT * FROM comment WHERE commentid = $1',
      [commentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = result.rows[0];

    if (req.userRole === 'Admin' || comment.email === req.userEmail) {
      return next();
    } else {
      return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }

  } catch (error) {
    console.error("verifyAdminOrCommentOwner error:", error.stack);
    return res.status(500).json({ message: "Server error: " + error.stack });
  }
};


export { userAuth, verifyAdmin, verifyAdminOrOwner, verifyAdminOrCommentOwner };

