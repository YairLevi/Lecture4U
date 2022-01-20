module.exports = {
    getQueryParams: function (req) {
        var params = {};
        var baseUrl = req.protocol + '://' + req.get('host') + '/';
        var rawUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var url = new URL(rawUrl, baseUrl);
        var keyIter = url.searchParams.keys();
        var valIter = url.searchParams.values();
        var current = null;
        while ((current = keyIter.next().value) !== undefined)
            params[current] = valIter.next().value;
        return params;
    },
}