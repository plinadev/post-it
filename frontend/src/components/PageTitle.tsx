import { useLocation } from "react-router-dom";

function PageTitle() {
  const { pathname } = useLocation();
  const menuItems = [
    { title: "Feed", to: "/" },
    { title: "Search Posts", to: "/search" },
    { title: "Create Post", to: "/create" },
    { title: "Profile", to: "/profile" },
    { title: "Settings", to: "/settings" },
  ];
  const currentTitle = menuItems.find((item) => item.to === pathname);
  if (currentTitle)
    return (
      <h1 className="text-center font-semibold text-lg">
        {currentTitle.title}
      </h1>
    );
  return null;
}

export default PageTitle;
