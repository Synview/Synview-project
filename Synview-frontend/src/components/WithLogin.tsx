import { Navigate } from "react-router-dom";
import { useGetPayloadQuery } from "../services/apiSlice.ts";
import Loading from "./HelperComponents/Loading.tsx";
type Props = {
  children: React.JSX.Element;
};

export default function WithLogin({ children }: Props) {
  const hasToken = !!localStorage.getItem("token");

  const { data, error, isLoading } = useGetPayloadQuery(undefined, {
    skip: !hasToken
  });

  const hasAccess = hasToken && !!data && !error;
  if (isLoading) {
    return <Loading />;
  }

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
