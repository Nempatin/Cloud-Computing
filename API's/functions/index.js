const functions = require("firebase-functions");

const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const { response } = require("express");
const app = express();

app.use(cors({ origin: true }));
const db = admin.firestore();
// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Hai there");
});
// create
// Post
app.post("/create", (req, res) => {
  (async () => {
    try {
      await db.collection("rumah").doc(`/${number.now()}/`).create({
        FOTO: req.body.FOTO,
        GRS: req.body.GRS,
        HARGA: req.body.HARGA,
        ID: req.body.ID,
        KM: req.body.KM,
        KOTA: req.body.KOTA,
        KT: req.body.KT,
        LAT: req.body.LAT,
        LB: req.body.LB,
        LONG: req.body.LONG,
        LT: req.body.LT,
        NAMA: req.body.NAMA,
        NOMOR: req.body.NOMOR,
        SERTIF: req.body.SERTIF
      });

      return res.status(200).send({ status: "Success", msg: "Data Saved" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// read specific user detail
// get
app.get("/get/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("rumah").doc(req.params.id);
      let userDetail = await reqDoc.get();
      let response = userDetail.data();

      return res.status(200).send({ status: "Success", data: response });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// read all user details
// get
app.get("/getAll", (req, res) => {
  (async () => {
    try {
      let query = db.collection("rumah");
      let response = [];
      let lastVisible;
      const pageLimit = 25;
      const currentPage = req.query.page ? parseInt(req.query.page) : 1;
      const startAfterDoc = req.query.startAfterDoc || null;

      if (startAfterDoc) {
        lastVisible = await query.doc(startAfterDoc).get();
      } else {
        const skip = (currentPage - 1) * pageLimit;

        const first = query.orderBy("HARGA").limit(pageLimit).offset(skip);
        const documentSnapshots = await first.get();

        lastVisible =
          documentSnapshots.docs[documentSnapshots.docs.length - 1];
      }

      const nextPage = query
        .orderBy("ID")
        .startAfter(lastVisible)
        .limit(pageLimit);

      const dataSnapshots = await nextPage.get();
      dataSnapshots.docs.map((doc) => {
        const selectedData = {
          FOTO: doc.data().FOTO,
          GRS: doc.data().GRS,
          HARGA: doc.data().HARGA,
          ID: doc.data().ID,
          KM: doc.data().KM,
          KOTA: doc.data().KOTA,
          KT: doc.data().KT,
          LAT: doc.data().LAT,
          LB: doc.data().LB,
          LONG: doc.data().LONG,
          LT: doc.data().LT,
          NAMA: doc.data().NAMA,
          NOMOR: doc.data().NOMOR,
          SERTIF: doc.data().SERTIF,
        };

        response.push(selectedData);
      });
      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// update
// put
app.put("/update/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("rumah").doc(req.params.id);
      await reqDoc.update({
        FOTO: req.body.FOTO,
        GRS: req.body.GRS,
        HARGA: req.body.HARGA,
        ID: req.body.ID,
        KM: req.body.KM,
        KOTA: req.body.KOTA,
        KT: req.body.KT,
        LAT: req.body.LAT,
        LB: req.body.LB,
        LONG: req.body.LONG,
        LT: req.body.LT,
        NAMA: req.body.NAMA,
        NOMOR: req.body.NOMOR,
        SERTIF: req.body.SERTIF,
      });
      return res.status(200).send({ status: "Success", msg: "Data Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// delete
// delete
app.delete("/delete/:id", (req, res) => {
  (async () => {
    try {
      const reqDoc = db.collection("rumah").doc(req.params.id);
      await reqDoc.delete();
      return res.status(200).send({ status: "Success", msg: "Data Removed" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

// Exports api to the firebase cloud functions
exports.app = functions.https.onRequest(app);