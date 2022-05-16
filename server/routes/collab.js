const mongoose = require("mongoose")
const Document = require("../models/Document")

const SOCKET_PORT = 8001
const CLIENT_ADDR = 'localhost:3000'

const io = require("socket.io")(SOCKET_PORT, {
    cors: {
        origins: CLIENT_ADDR,
        methods: ["GET", "POST"],
    },
})

const defaultValue = ""

let doc_dict = {}

io.on("connection", socket => {
    socket.on("get-document", async documentId => {

        // needs to use DB for returning the same documentId when in same group (using groupId?)

        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)

        doc_dict[documentId] = document.data
        console.log(doc_dict)

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})

async function findOrCreateDocument(id) {
    if (id == null) return
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })
}