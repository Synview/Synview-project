import NavbarDropdown from "./NavbarDropdown.tsx";
import { useGetPayloadQuery } from "../services/apiSlice.ts";
import Drawer from "./UserDrawer.tsx";
export default function Navbar() {
  const { data } = useGetPayloadQuery();

  return (
    <div className="navbar bg-neutral-800 p-4">
      <div className="navbar-start">
        <Drawer />
      </div>
      <div className="navbar-end gap-10">
        <p>{data?.username}</p>
        <NavbarDropdown />
      </div>
    </div>
  );
}
