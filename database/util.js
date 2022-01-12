
// error in function console.log
function errorInFunc(name, description="") {
    console.log(`Error in: ${name}()`)
    if (description) console.log(`-- ${description}`)
}

// Turn all values in object to strings
function toString(o) {
    Object.keys(o).forEach(k => {
        if (typeof o[k] === 'object')
            return toString(o[k]);
        o[k] = '' + o[k];
    });
    return o;
}

// make json of params with props as values
function makeUserProps(props, params) {
    if (props.length !== params.length) {
        console.log(`makeUserProps: Got ${props.length} arguments, but needed ${params.length}`)
        return undefined
    }
    let object = {}
    params.forEach((key, idx) => {
        object[key] = props[idx]
    })
    return toString(object)
}

module.exports = {
    errorInFunc,
    makeUserProps,
    toString
}
