import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import './Editor.scss'
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"
import { Button, Container } from "react-bootstrap";

import { saveAs } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';

const TOOLBAR = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], [{ font: [] }], [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"], [{ color: [] }, { background: [] }], [{ script: "sub" }, { script: "super" }],
    [{ align: [] }], ["image", "blockquote", "code-block"], ["clean"],]
const SAVE_INTERVAL = 2000

export default function Editor() {
    const { docId: docID } = useParams()
    const [sock, setSock] = useState()
    const [quill, setQuill] = useState()

    useEffect(() => {
        const server_socket = io("http://localhost:8000")
        setSock(server_socket)
        return () => {server_socket.disconnect()}
    }, [])

    useEffect(() => {
        if (sock == null || quill == null) return
        sock.once("load-document", doc => {
            quill.setContents(doc)
            quill.enable()
        })
        sock.emit("get-document", docID)
    }, [sock, quill, docID])

    useEffect(() => {
        if (sock == null || quill == null) return
        const handler = delta => {quill.updateContents(delta)}
        sock.on("receive-changes", handler)
        return () => {sock.off("receive-changes", handler)}
    }, [sock, quill])

    // detects changes in the file's text
    useEffect(() => {
        if (sock == null || quill == null) return
        const handler = (contentDelta, prevDelta, src) => {
            if (src !== "user") return // notify about changes to all but me
            sock.emit("send-changes", contentDelta)
        }
        quill.on("text-change", handler)
        return () => {quill.off("text-change", handler)}
    }, [sock, quill])

    useEffect(() => {
        if (sock == null || quill == null) return
        const interv = setInterval(() => {
            sock.emit("save-document", quill.getContents())
        }, SAVE_INTERVAL)
        return () => {clearInterval(interv)}
    }, [sock, quill])

    const wrap = useCallback(editorWrap => {
        if (editorWrap == null) return
        editorWrap.innerHTML = ""
        const editorDiv = document.createElement("div")
        editorWrap.append(editorDiv)
        const quill_obj = new Quill(editorDiv, {theme: "snow", modules: { toolbar: TOOLBAR },})
        quill_obj.disable()
        quill_obj.setText("Loading...")
        setQuill(quill_obj)
    }, [])

    async function ExportToPdf() {
        const delta = quill.getContents(); // gets the Quill delta
        const pdfAsBlob = await pdfExporter.generatePdf(delta); // converts to PDF
        saveAs(pdfAsBlob, `${docID}.pdf`); // downloads from the browser
    }

    return <Container fluid className={'h-100 d-flex flex-column'}>
        <div className="container w-75" ref={wrap} style={{ height: '95%'}}></div>
        <Button className={'w-25 me-auto ms-auto'} onClick={ExportToPdf}>Export to PDF</Button>
    </Container>
}
