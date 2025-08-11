import PageTitle from "../PageTitle";
import SidebarMenu from "../SidebarMenu";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex w-screen min-h-screen">
      <aside className="w-fit h-screen fixed p-5">
        <SidebarMenu />
      </aside>

      <main className="flex-1 mt-10 ml-[calc(theme(space.20))]">
        <PageTitle />
        <div className="flex items-center justify-center mt-4">
          <div className="max-w-3xl md:max-w-2xl sm:max-w-xl w-full min-h-screen p-6 bg-base-100 rounded-4xl shadow-2xl border border-base-300 mb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
