export default function (user = null, action) {
  if (action.type == "storeUser") {
    return action.user; // user envoyé dans le dispatch
  } else if (action.type == "storeUserReset") {
    var userReset = null;
    return userReset;
  } else {
    return user;
  }
}

// action storeUserReset dans avatar.js pour déconnexion
// action storeUser dans sscreens company/offers, login/register, profil/avater, welcome... pour mise à jour permanente du store