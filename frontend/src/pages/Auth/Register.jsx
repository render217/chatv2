/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { requestHandler } from "../../util";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";
export const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const { username, email, password } = formData;
  // handle input change
  const handleInputChange = (name) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };
  const handleRegisterForm = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("All Fields are required");
      return;
    }
    await requestHandler({
      api: async () => await api.register({ email, username, password }),
      setLoading: setIsSubmitting,
      onSuccess: (payload, message) => {
        toast.success(message);
        navigate("/login", { replace: true });
      },
      onError: (error) => {
        toast.error("Something went wrong. try again");
      },
    });
  };
  return (
    <>
      <div className="h-screen font-NotoSans">
        <div className="flex h-full items-center bg-clrSmokyBlack py-16">
          <main className="mx-auto w-full max-w-md p-6">
            <div className="mt-7 rounded-xl border border-gray-600 bg-clrBalticSea py-5 shadow-sm">
              <div className="p-4 sm:p-7 ">
                <div className="text-center">
                  <h1 className="block text-2xl font-bold text-white">Register</h1>
                  <p className="mt-2  text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?
                    <Link to={"/login"} className="ml-2  font-medium decoration-2 hover:underline">
                      Login here
                    </Link>
                  </p>
                </div>

                <div className="mt-10">
                  <form onSubmit={handleRegisterForm}>
                    <div className="grid gap-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="username" className="mb-2 block text-sm text-white">
                            Username
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            disabled={isSubmitting}
                            onChange={handleInputChange("username")}
                            className="block w-full rounded-md bg-clrBalticSea px-4 py-3  text-sm   text-gray-400 ring-1 ring-clrShipGrey"
                            required
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label htmlFor="email" className="mb-2 block text-sm text-white">
                            Email address
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            disabled={isSubmitting}
                            value={email}
                            onChange={handleInputChange("email")}
                            className="block w-full rounded-md bg-clrBalticSea px-4 py-3  text-sm   text-gray-400 ring-1 ring-clrShipGrey"
                            required
                            autoComplete="off"
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
                            value={password}
                            disabled={isSubmitting}
                            onChange={handleInputChange("password")}
                            className="block w-full rounded-md bg-clrBalticSea px-4 py-3  text-sm   text-gray-400 ring-1 ring-clrShipGrey"
                            required
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!isSubmitting}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-transparent bg-clrSmokyBlack/70 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-clrSmokyBlack/90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:bg-clrSmokyBlack/90 disabled:opacity-60">
                        {isSubmitting ? (
                          <LoaderCircle className="size-3 animate-spin" />
                        ) : (
                          <p>Register</p>
                        )}
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
