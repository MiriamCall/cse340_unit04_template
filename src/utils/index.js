import { getCategories } from "../models/category/index.js";

const getNav = async () => {
  const categories = await getCategories();
  let nav = "<nav><ul>";
  categories.forEach((row) => {
    const id = row.category_id;
    const name = row.category_name;
    nav += `<li><a href="/category/view/${id}">${name}</a></li>`;
  });

  if (user) {
    nav += `
        <li><a href="/game/add">Add Game</a></li>
        <li><a href="/category/add">Add Category</a></li>
        <li><a href="/category/delete">Delete Category</a></li>
        <li><a href="/About">About Me</a></li>
        <li><a href="/account/logout">Logout</a></li>
        </ul>
    </nav>`;
    return nav;
  } else {
    nav += `
        <li><a href="/About">About Me</a></li>
        <li><a href="/account/login">Login</a></li>
        <li></li><a href="/account/register">Register</a></li>
        </ul>
    </nav>`;
    return nav;
  }

  return nav;
  // return `
  //   ${nav}
  //       <li><a href="/game/add">Add Game</a></li>
  //       <li><a href="/category/add">Add Category</a></li>
  //       <li><a href="/category/delete">Delete Category</a></li>
  //       <li><a href="/About">About Me</a></li>
  //       <li><a href="/account/login">Login</a></li>
  //       <li></li><a href="/account/register">Register</a></li>
  //       </ul>
  //   </nav>`;
};

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }
  next();
};

export { getNav, requireAuth };
