export default function (categorieslist = [], action) {
  if (action.type === "setcategoriesList") {
    var newcategorieslist = action.categorieslist;  // setcategoriesList envoyé dans le dispatch
    return newcategorieslist;
  } else {
    return categorieslist;
  }
}

// dispatch dans HomeScreen