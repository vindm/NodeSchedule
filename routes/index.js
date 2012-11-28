
/*
 * GET home page.
 */

exports.index = function(req, res){
    var q = req.query,
        uId = q.viewer_id;
    res.redirect('/index.html?user=' + uId);
};