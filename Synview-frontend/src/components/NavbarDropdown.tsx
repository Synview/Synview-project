import { Menu, Button } from "@mantine/core";
import { Kbd } from "@mantine/core";
import { useLogoutMutation } from "../services/apiSlice.ts";
import {  useNavigate } from "react-router-dom";

export default function NavbarDropdown() {
  const [logoutUser, {isLoading : isLogoutLodaing}] = useLogoutMutation();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await logoutUser().unwrap();
    // Clear the auth token from localStorage
    localStorage.removeItem("token");
      navigate("/");
    } catch (error){
      alert(`error : ${error}`);
    }
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
        <Menu.Item onClick={logout} color="red" disabled={isLogoutLodaing} leftSection={<Kbd>⌘</Kbd>}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
