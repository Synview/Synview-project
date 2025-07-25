import { Navigate } from "react-router-dom";
type Props = {
  children: React.JSX.Element;
};

export default function WithLogin({ children }: Props) {
  const hasAccess = !!localStorage.getItem("token");

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
