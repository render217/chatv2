/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import Cookies from "js-cookie";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useAuth } from "../../context/AuthProvider";
import { requestHandler } from "../../util";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
const INITIAL_FORM_DATA = {
  email: "",
  password: "",
};
export const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsAuthenticated, setUser } = useAuth();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const { email, password } = formData;
  // handle login submit
  const handleLoginForm = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    await requestHandler({
      api: async () => await api.login({ email, password }),
      setLoading: setIsSubmitting,
      onSuccess: (payload, message) => {
        setUser({
          _id: payload.user._id,
          email: payload.user.email,
          username: payload.user.username,
          bio: payload.user?.bio,
        });

        // save token and user to cookie
        Cookies.set("chat_token", payload.token);
        Cookies.set(
          "chat_user",
          JSON.stringify({
            _id: payload.user._id,
            email: payload.user.email,
            username: payload.user.username,
            bio: payload.user?.bio,
          })
        );
        if (message) {
          toast.success(message);
        }
        setIsAuthenticated(true);
        navigate("/", { replace: true });
      },
      onError: (error) => {
        toast.error("Invalid email or password");
      },
    });
  };

  // handle input change
  const handleInputChange = (name) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };
  return (
    <>
      <div className="h-screen font-NotoSans">
        <div className="flex h-full items-center bg-clrSmokyBlack py-16">
          <main className="mx-auto w-full max-w-md p-6">
            <div className="mt-7 rounded-xl border border-gray-600 bg-clrBalticSea py-5 shadow-sm">
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-white">Login</h1>
                  <p className="mt-2  text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account yet?
                    <Link
                      to={"/register"}
                      className="ml-2  font-medium decoration-2 hover:underline">
                      Register here
                    </Link>
                  </p>
                </div>

                <div className="mt-10">
                  <form onSubmit={handleLoginForm}>
                    <div className="grid gap-y-4">
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm text-white">
                          Email address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            disabled={isSubmitting}
                            onChange={handleInputChange("email")}
                            className="block w-full rounded-md bg-clrBalticSea px-4 py-3  text-sm   text-gray-400 ring-1 ring-clrShipGrey"
                            required
                            autoComplete="off"
                            aria-autocomplete="off"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="mb-2 block text-sm dark:text-white">
                            Password
                          </label>
                        </div>

                        <div className="relative">
                          <input
                            type="password"
                            id="password"
                            name="password"
                            disabled={isSubmitting}
                            onChange={handleInputChange("password")}
                            className="block w-full rounded-md bg-clrBalticSea px-4 py-3  text-sm   text-gray-400 ring-1 ring-clrShipGrey"
                            required
                            autoComplete={false}
                          />
                        </div>
                      </div>

                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-clrSmokyBlack/70 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-clrSmokyBlack/90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:bg-clrSmokyBlack/90 disabled:opacity-50">
                        {isSubmitting ? <LoaderCircle className="animate-spin" /> : "Login"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
