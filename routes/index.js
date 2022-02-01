import express, { Router } from "express";
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const blogSnapshot = await db.collection("blog").get();
    const blogposts = [];
    blogSnapshot.forEach((blogpost) => {
      blogposts.push({
        id: blogpost.id,
        data: blogpost.data(),
      });
    });
    res.json(blogposts);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("id is blank");
    const blogpost = await db.collection("blog").doc(id).get();
    if (!blogpost.exists) {
      throw new Error("selected blogpost does not exist");
    }
    res.json({
      id: blogpost.id,
      data: blogpost.data(),
    });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const title = req.body.title;
    const bodyText = req.body.bodyText;
    const authorName = req.body.authorName;
    if (!title) throw new Error("Title is blank");
    if (!bodyText) throw new Error("Body text is blank");
    if (!authorName) throw new Error("Author name is blank");
    const data = { title, bodyText, authorName };
    const ref = await db.collection("blog").add(data);
    res.json({
      id: ref.id,
      data,
    });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const bodyText = req.body.bodyText;
    const authorName = req.body.authorName;
    if (!id) throw new Error("id is blank");
    if (!title) throw new Error("Title is blank");
    if (!bodyText) throw new Error("Body text is blank");
    if (!authorName) throw new Error("Author name is blank");

    const data = { title, bodyText, authorName };
    const ref = await db.collection("blog").doc(id).set(data, { merge: true });
    res.json({
      id,
      data,
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("id is blank");
    await db.collection("blog").doc(id).delete();
    res.json({
      id,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
