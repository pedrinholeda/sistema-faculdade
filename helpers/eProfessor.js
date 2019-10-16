module.exports = {
  eAdmin: function(req, res, next) {
    if (req.isAuthenticated() && req.user.eProfessor == 1) {
      return next();
    }
    req.flash("error_msg", "Você precisa ter autorização de um Professor!");
    res.redirect("/");
  }
};
