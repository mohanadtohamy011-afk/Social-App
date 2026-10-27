import { Button, FieldError, Input, Spinner, TextField } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, type LoginSchemaType } from "../../lib/schemas/Auth.schema";
import { LoginUser } from "../../Services/auth.service";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useTokenContext } from "../../Context/TokenContext";



export default function Login() {



  const navigate = useNavigate()
  const { setToken } = useTokenContext()


  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginSchemaType>({
    mode: "all",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function submitData(values: LoginSchemaType) {
    try {
      const response = await LoginUser(values)
      const token = response.data.data.token
      localStorage.setItem("userToken", token)
      setToken(token)
      toast.success(response.data.message, {
        duration: 4000,
        position: "top-right",
      });

      navigate("/feed", { replace: true })


    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Unable to log in. Please try again.", {
          duration: 4000,
          position: "top-right",
        })
      } else {
        toast.error("Unable to log in. Please try again.", {
          duration: 4000,
          position: "top-right",
        })

      }
    }
  }

  return (
    <>
      <main className="min-h-screen  flex items-center justify-center px-5 py-10">
        <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">

          <h1 className="text-main text-4xl font-black">
            Login in Arghy
          </h1>

          <p className="mt-2 text-gray-600">
            Log in and continue your social journey
          </p>

          <form className="space-y-4 pt-5" onSubmit={handleSubmit(submitData)} >
            <TextField
              aria-label="email"
              className="w-full"
              isInvalid={Boolean(errors.email)}>
              <Input
                {...register('email')}
                aria-label="Email"
                type="email"
                className="w-full"
                placeholder="Email"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </TextField>

            <TextField
              aria-label="password"
              className="w-full"
              isInvalid={Boolean(errors.password)}>
              <Input
                {...register('password')}
                aria-label="Password"
                type="password"
                className="w-full"
                placeholder="Password"
              />
              <FieldError>{errors.password?.message}</FieldError>
            </TextField>

            <Button
              type="submit"
              className="bg-main w-full rounded-md text-white"
            >
              {isSubmitting ? <div className="flex gap-2"> <Spinner className="text-white" /> <p>Loading.....</p> </div> : "Login"}
            </Button>

          </form>
        </section>
      </main>

    </>
  );
}
