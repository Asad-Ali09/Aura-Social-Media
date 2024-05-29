import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getLoginStatus } from "../redux/auth/authServices";
import { setIsLoggedIn } from "../redux/auth/authSlice";

const useRedirectUser = (path) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const redirectUser = async () => {
      const isLoggedIn = await getLoginStatus();
      dispatch(setIsLoggedIn(isLoggedIn));
      if (!isLoggedIn) {
        navigate(path);
        return;
      }
    };
    redirectUser();
  }, [dispatch, path, navigate]);
};

export default useRedirectUser;
