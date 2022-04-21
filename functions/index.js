const functions = require("firebase-functions");
const Filter = require("bad-words");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
    .document("messages/{msgId}")
    .onCreate((doc, ctx) => {
        const filter = new Filter();
        const { text, uid } = doc.data();

        if (filter.isProfane(text)) {
            const cleaned = filter.clean(text);
            doc.ref.update({text: `I got banned for life for saying... ${cleaned}`});

            db.collection("banned").doc(uid).set({});
        }
    })