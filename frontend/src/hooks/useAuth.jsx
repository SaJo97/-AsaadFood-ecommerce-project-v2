import { useSelector } from "react-redux"

const useAuth = () => {
 const { email, role } = useSelector((state) => state.auth);
//  console.log(email)
//  console.log(role)
  const isAuthenticated = !!email; // True if email exists (user is logged in)

  return { user: email, role, isAuthenticated };
}
export default useAuth