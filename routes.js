import express from "express";
import { handleSocialLogin, handleLinkedInAuth, handleGoogleAuth } from "./socialAuth.js";
import { userAuth, verifyAdmin, verifyAdminOrOwner, verifyAdminOrCommentOwner } from './middleware/authMiddleware.js';
import { upload } from "./fileManagement.js";
import {
  createNewPost,
  getAllApprovedPosts,
  getAllApprovedPostsByUser,
  getPendingPosts,
  getUserPosts,
  deletePost,
  createNewCommunityPost,
  getCommunityApprovedPosts,
  verifyUserLogin,
  registerNewUser,
  getApprovedUsers,
  getPendingUsers,
  approveUser,
  deleteUser,
  createNewUser,
  fileUpload,
  //getSpecificUser,
  //promoteUser,
  updateUserInfo,
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
  getUserCommunities,
  getCommunityName,
  searchUser,
  findUser,
  addComment,
  getComment,
  getCommentByCommentID,
  getCommentsByPostID,
  updateComment,
  deleteComment,
  createConversation,
  getConversations,
  sendMessage,
  getMessages,
  getLastMessage,
  getConversationDetails,
  updateConversationTitle,
  getUserInfo,
  checkIfFriended,
  friendUser,
  unfriendUser,
  getFriendsList,
  getPendingFriendRequests,
  getTest,
  createNewCommunity,
  getSentFriendRequests,
  changeColor,
  likePost,
  unlikePost,
  getPostLikes,
  checkLikedPost,
  muteUser,
  unmuteUser,
  getMuteList,
  checkIfMuted,
  blockUser,
  unblockUser,
  checkIfBlocked,
  createPrivateSpace,
  getUserPrivateSpaces,
  getPrivateSpaceDetails,
  inviteToPrivateSpace,
  acceptPrivateSpaceInvitation,
  getPendingInvitations,
  createPrivateSpacePost,
  getPrivateSpacePosts,
  addPrivateSpaceComment,
  getPrivateSpaceComments,
  getPrivateSpaceMembers,
  removePrivateSpaceMember,
  deletePrivateSpacePost,
  getInvitableUsers,
  searchInvitableUsers,
  dissolvePrivateSpace
} from "./dbLogic.js";

const router = express.Router();

// Authentication Routes (open)
router.post("/login", verifyUserLogin);
router.post("/register", registerNewUser);
router.post("/api/auth/social", handleSocialLogin);
router.post("/api/auth/google", handleGoogleAuth);
router.post("/api/auth/linkedin", handleLinkedInAuth);
// Protected user routes
router.patch("/updateUserInfo", userAuth, updateUserInfo);

// User Management Routes
router.post("/createNewUser", userAuth, verifyAdmin, createNewUser);
router.get("/getApprovedUsers", userAuth, verifyAdmin, getApprovedUsers);
router.get("/getPendingUsers", userAuth, verifyAdmin, getPendingUsers);
router.post("/approveUser", userAuth, verifyAdmin, approveUser);
router.post("/changeUserColor", userAuth, changeColor);
router.delete("/deleteUser/:email", deleteUser);
// router.get("/getSpecificUser", ...);
// router.post("/promoteUser", ...);

// Post Routes
router.post("/fileUpload", upload.single('file'), fileUpload);
router.post("/createNewPost", createNewPost);
router.get("/getAllApprovedPosts", getAllApprovedPosts);
router.get("/getAllApprovedPostsByUser/:username", getAllApprovedPostsByUser);
router.get("/getPendingPosts", getPendingPosts);
router.get("/getUserPosts", getUserPosts);
router.delete("/deletePost/:postId", userAuth, verifyAdminOrOwner, deletePost);


// Community Post Routes
router.post("/createNewCommunityPost", createNewCommunityPost);
router.get("/getCommunityApprovedPosts", getCommunityApprovedPosts);

// Community Management Routes
router.post("/createNewCommunity", createNewCommunity); // Assuming this was implemented as per dbLogic.js
router.get("/getAllCommunities", getAllCommunities);
router.post("/joinCommunity", joinCommunity);
router.delete("/leaveCommunity", leaveCommunity);
router.get("/getUserCommunities", getUserCommunities);
router.get("/getCommunityName", getCommunityName);

// User Search Routes
router.get("/searchUser", userAuth, searchUser);
router.get("/findUser", userAuth, findUser);

// Comment Routes
router.post("/addComment", addComment);
router.get("/getComment", getComment);
router.get("/getCommentByCommentID", getCommentByCommentID);
router.get("/getCommentsByPostID", getCommentsByPostID);
router.put("/updateComment", updateComment);
router.delete("/deleteComment/:commentId", userAuth, verifyAdminOrCommentOwner, deleteComment);

// Messaging Routes
router.post("/createConversation", createConversation);
router.get("/getConversations", getConversations);
router.post("/sendMessage", sendMessage);
router.get("/getMessages", getMessages);
router.get("/getLastMessage", getLastMessage);
router.get("/getConversationDetails", getConversationDetails);
router.post("/updateConversationTitle", updateConversationTitle);

// Friend Routes
router.get("/getUserInfo", userAuth, getUserInfo);
router.get("/checkIfFriended", userAuth, checkIfFriended);
router.post("/friendUser", userAuth, friendUser);
router.delete("/unfriendUser", userAuth, unfriendUser);
router.get("/getFriendsList", userAuth, getFriendsList);
router.get("/getSentFriendRequests", userAuth, getSentFriendRequests);
router.get("/getPendingFriendRequests", userAuth, getPendingFriendRequests);

// Liking Post Routes
router.post("/likePost", userAuth, likePost);
router.post("/getPostLikes", getPostLikes);
router.post("/checkLikedPost", userAuth, checkLikedPost);
router.post("/unlikePost", userAuth, unlikePost);

// Muting Routes
router.post("/muteUser", muteUser);
router.delete("/unmuteUser", unmuteUser);
router.get("/getMuteList", getMuteList);
router.get("/checkIfMuted", checkIfMuted)

// Blocking Routes
router.post("/blockUser", blockUser);
router.delete("/unblockUser", unblockUser);
router.get("/checkIfBlocked", checkIfBlocked);

// Private Spaces Routes
router.post("/createPrivateSpace", userAuth, createPrivateSpace);
router.get("/getUserPrivateSpaces", userAuth, getUserPrivateSpaces);
router.get("/getPrivateSpaceDetails/:spaceId", userAuth, getPrivateSpaceDetails);
router.post("/inviteToPrivateSpace/:spaceId", userAuth, inviteToPrivateSpace);
router.post("/acceptPrivateSpaceInvitation/:invitationId", userAuth, acceptPrivateSpaceInvitation);
router.get("/getPendingInvitations", userAuth, getPendingInvitations);
router.post("/createPrivateSpacePost/:spaceId", userAuth, createPrivateSpacePost);
router.get("/getPrivateSpacePosts/:spaceId", userAuth, getPrivateSpacePosts);
router.post("/addPrivateSpaceComment/:postId", userAuth, addPrivateSpaceComment);
router.get("/getPrivateSpaceComments/:postId", userAuth, getPrivateSpaceComments);
router.get("/getPrivateSpaceMembers/:spaceId", userAuth, getPrivateSpaceMembers);
router.delete("/removePrivateSpaceMember/:spaceId/:memberEmail", userAuth, removePrivateSpaceMember);
router.delete("/deletePrivateSpacePost/:postId", userAuth, deletePrivateSpacePost);
router.get("/getInvitableUsers/:spaceId", userAuth, getInvitableUsers);
router.get("/searchInvitableUsers/:spaceId", userAuth, searchInvitableUsers);
router.delete("/dissolvePrivateSpace/:spaceId", userAuth, dissolvePrivateSpace);

// Test Route
router.get("/getTest", getTest);

export default router;
