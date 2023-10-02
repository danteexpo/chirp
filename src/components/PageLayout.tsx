import type { PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="special-scrollbar h-full w-full overflow-y-scroll md:max-w-2xl md:border-x md:border-x-slate-400">
        {props.children}
      </div>
    </main>
  );
};

export default PageLayout;
