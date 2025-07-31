import NewUpdate from "./NewUpdate.tsx";
import Timeline from "./Timeline.tsx";
export default function ProjectViewUpdates() {
  return (
    <div className=" bg-neutral-800 flex-1 h-full cursor-[url(/star.svg),_auto] overflow-y-scroll [scrollbar-width:none]">
      <div className="animation-fade-up h-full  mt-10">
        <NewUpdate />
        <Timeline />
      </div>
    </div>
  );
}
