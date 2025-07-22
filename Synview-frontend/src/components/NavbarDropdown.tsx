 
import { Menu, Button } from "@mantine/core";
import { Kbd } from "@mantine/core";
import { useLogoutMutation } from "../services/apiSlice.ts";
import {  useNavigate } from "react-router-dom";

export default function NavbarDropdown() {
  const [logoutUser] = useLogoutMutation();
  const navigate = useNavigate();
  const logout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="default"> ... </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item leftSection={<Kbd>⌘</Kbd>}>Light mode</Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item onClick={logout} color="red" leftSection={<Kbd>⌘</Kbd>}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
