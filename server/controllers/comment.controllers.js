import { populate } from "dotenv";
import Blog from "../Schema/Blog.js";
import Comment from "../Schema/Comment.js";
import Notification from "../Schema/Notification.js";

const AddComment = (req, res) => {
  let user_id = req.user;
  let { blog_id, blog_author, comment, replying_to } = req.body;

  if (!comment.length) {
    return res.status(403).json({
      error: "Write something to leave a comment",
    });
  }
  let commentObj = {
    blog_id,
    blog_author,
    comment,
    commented_by: user_id,
  };
  if (replying_to) {
    commentObj.parent = replying_to;
    commentObj.isReply = true;
  }

  new Comment(commentObj)
    .save()
    .then(async (commentFile) => {
      let { comment, commentedAt, children } = commentFile;
      Blog.findOneAndUpdate(
        { _id: blog_id },
        {
          $push: { comments: commentFile._id },
          $inc: {
            "activity.total_comments": 1,
            "activity.total_parent_comments": replying_to ? 0 : 1,
          },
        }
      ).then((blog) => {
        console.log(blog);
      });
      let notificationObj = {
        type: replying_to ? "reply" : "comment",
        blog: blog_id,
        notification_for: blog_author,
        user: user_id,
        comment: commentFile._id,
      };

      if (replying_to) {
        notificationObj.replied_on_comment = replying_to;

        await Comment.findOneAndUpdate(
          { _id: replying_to },
          { $push: { children: commentFile._id } }
        ).then(
          (repliedParentCommentDoc) =>
            (notificationObj.notification_for =
              repliedParentCommentDoc.commented_by)
        );
      }

      new Notification(notificationObj).save().then((notification) => {
        console.log(notification);
      });
      return res
        .status(200)
        .json({
          comment,
          commentedAt,
          children,
          _id: commentFile._id,
          user_id,
        });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const GetBlogComments = (req, res) => {
  let { blog_id, skip } = req.body;

  let maxLimit = 5;
  Comment.find({ blog_id, isReply: false })
    .populate(
      "commented_by",
      "personal_info.username personal_info.fullname personal_info.profile_img"
    )
    .skip(skip)
    .limit(maxLimit)
    .sort({ commentedAt: -1 })
    .then((comment) => {
      return res.status(200).json(comment);
    })
    .catch((err) => {
      console.log("blog_id", blog_id);

      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};

const GetReplies = (req, res) => {
  let { _id, skip } = req.body;

  let maxLimit = 5;
  Comment.findOne({ _id })
    .populate({
      path: "children",
      options: {
        limit: maxLimit,
        skip,
        sort: { commentedAt: -1 },
      },
      populate: {
        path: "commented_by",
        select:
          "personal_info.fullname personal_info.profile_img personal_info.username",
      },
      select: "-blog_id -updatedAt",
    })
    .select("children")
    .then((doc) => {
      return res.status(200).json({ replies: doc.children });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

const DeleteComment = (req, res) => {
  let user_id = req.user;
  let { _id } = req.body;

  const removeComment = (_id) => {
    Comment.findOne({ _id }).then((comment) => {
      if (comment.parent) {
        Comment.findOneAndUpdate(
          { _id: comment.parent },
          { $pull: { children: _id } }
        ).then((comment) => console.log("comment is deleted"));
      }
      Notification.findOneAndDelete({ comment: _id }).then((Notification) =>
        console.log("Notification is deleted successfully")
      );
      Notification.findOneAndDelete({ reply: _id }).then((Notification) =>
        console.log("Notification is deleted successfully")
      );
      Blog.findOneAndUpdate(
        { _id: comment.blog_id },
        {
          $pull: { comments: _id },
          $inc: {
            "activity.total_comments": -1,
            total_parent_comments: comment.parent ? 0 : -1,
          },
        }
      ).then((blogDoc) => {
        if (comment.children.length) {
          comment.children.map((replies) => {
            removeComment(replies);
          });
        }
      });
    });
  };
  Comment.findOne({ _id })
    .then((comment) => {
      if (user_id == comment.commented_by || user_id == comment.blog_author) {
        removeComment(_id);

        return res.status(200).json("comment is deleted successfully");
      } else {
        return res.status(403).json({ error: " You can't delete comment" });
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export { AddComment, GetBlogComments, GetReplies, DeleteComment };
