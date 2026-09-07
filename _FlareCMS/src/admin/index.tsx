import { RouteObject, redirect } from "react-router-dom";

import Layout from "./Layout";
import Posts from "./Posts";
import { Editor } from "./Editor";
import Media from "./Media";

const router: RouteObject[] = [
  {
    path: "",
    element: <Layout />,
    id: "adminRoot",
    children: [
      {
        path: "",
        loader: () => redirect("/admin/pages"),
      },
      {
        path: "pages",
        element: <Posts />,
      },
      {
        path: "pages/:id",
        element: <Editor />,
      },
      {
        path: "media",
        element: <Media />,
      },
    ],
  },
];

export default router;
