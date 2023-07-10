// frontend\src\screens\auth\RegisterScreen.tsx

import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FormContainer } from "../../components/layout/FormContainer";
import { Loader } from "../../components/common/Loader";
import { createPost } from "../../services/api";

export const PostNewScreen = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!description) {
      toast.error("description do not empty");
      return;
    }
    setLoading(true);
    try {
      if (description) {
        const post = await createPost({
          description,
        });
        console.log("post", post);
        toast.success("Create post successful");
        // Profile screenに移動する
        navigate("/profile");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Register
      </h1>
      {loading && <Loader />}
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-custom-blue-dark">
            description
          </label>
          <input
            name="description"
            type="description"
            placeholder={`Enter Post`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block h-10 w-full rounded-md border-custom-blue-dark px-2 shadow-sm focus:border-custom-blue-darker"
          />
        </div>
        <button
          data-testid="post"
          type="submit"
          className="w-full rounded-md border border-transparent bg-custom-blue-dark px-4 py-2 text-base font-medium text-white hover:bg-custom-blue-darkest focus:outline-none focus:ring-2 focus:ring-custom-blue-darker focus:ring-offset-2 md:w-1/2 lg:w-1/3"
        >
          Post
        </button>
      </form>
      <div className="py-3">
        <div>
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-custom-blue-dark underline hover:text-custom-blue-darker"
          >
            Login
          </Link>
        </div>
      </div>
    </FormContainer>
  );
};
