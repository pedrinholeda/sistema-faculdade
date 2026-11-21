// Which menu entries a user sees. Computed per request from the user in
// the session; it used to live in process-wide globals, so every visitor
// saw the menu of whoever logged in last.
function menuFlags(user) {
  const adm = Boolean(user && user.eAdmin == 1);
  const prof = Boolean(user && user.eProfessor == 1);
  return { adm, prof, aluno: Boolean(user) && !adm && !prof };
}

module.exports = { menuFlags };
