import NewUpdate from "./NewUpdate.tsx";
import Timeline from "./Timeline.tsx";
export default function ProjectViewUpdates() {
  return (
    <div className=" bg-neutral-700 flex-1 cursor-[url(/star.svg),_auto] overflow-y-scroll [scrollbar-width:none]">
      <div className="animation-fade-up  mt-10">
        <NewUpdate />
        <Timeline />
      </div>
    </div>
  );
}
