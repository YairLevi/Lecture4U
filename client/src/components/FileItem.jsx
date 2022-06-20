const EXTENSIONS = {
    'txt': 'bxs-file-txt',
    'pdf': 'bxs-file-pdf',
    'doc': 'bxs-file-doc',
    'docx': 'bxs-file-doc',
    'png': 'bxs-file-png',
    'jpg': 'bxs-file-jpg',
    'js': 'bxs-file-js',
    'html': 'bxs-file-html',
    'css': 'bxs-file-css',
}


export default function FileItem({ name, url }) {
    const extension = name.split('.')[name.split('.').length - 1]

    return (
        <>
            <div className={'border border-1 ps-2 pe-3 pt-2 pb-2 m-2'} style={{
                borderRadius: 10,
                width: "fit-content"
            }}>
                <a href={url} className={'d-flex align-items-center'} style={{ color: "black", textDecoration: "none" }}>
                    <i className={`bx ${EXTENSIONS[extension]} me-2`} style={{fontSize: '1.8rem'}}/>
                    {name}
                </a>
            </div>
        </>
    )
}