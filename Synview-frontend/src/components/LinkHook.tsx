import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

export default function LinkHook() {
  return (
    <div>
      <p className="text-xl mb-2">
        If you want to recieve commits instantly into you project, add this
        github app into it
      </p>
      <Button
        className="cursor-pointer bg-gradient-to-b from-neutral-500 to-neutral-600 shadow-[0px_4px_32px_0_rgba(99,102,241,.70)] px-6 py-3 rounded-xl border-[1px] border-slate-500 text-white font-medium group"
        component={Link}
        target="_blank"
        to="https://github.com/apps/synview"
      >
        Link here
      </Button>
    </div>
  );
}
