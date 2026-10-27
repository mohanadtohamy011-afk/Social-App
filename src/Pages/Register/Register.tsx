import { Button, FieldError, Input, Label, ListBox, Select, Spinner, TextField } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { registerSchema, type RegisterSchemaType } from "../../lib/schemas/Auth.schema";
import { registerUser } from "../../Services/auth.service";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";



export default function Register() {



  const navigate = useNavigate()


  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterSchemaType>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
  });
  async function submitData(values: RegisterSchemaType) {
    try {
      const response = await registerUser(values)
      toast.success(response.data.message, {
        duration: 4000,
        position: "top-right",
      });
      navigate("/auth/login");


    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Unable to create your account. Please try again.", {
          duration: 4000,
          position: "top-right",
        });
      } else {
        toast.error(error instanceof Error ? error.message : "Unable to create your account.");
      }
    }
  }

  return (
    <>
      <main className="min-h-screen  flex items-center justify-center px-5 py-10">
        <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">

          <h1 className="text-main text-4xl font-black">
            Create a new account
          </h1>

          <p className="mt-2 text-gray-600">
            It is quick and easy.
          </p>

          <form className="space-y-4 pt-5" onSubmit={handleSubmit(submitData)} >
            <TextField
              aria-label="name"
              className="w-full"
              isInvalid={Boolean(errors.name)}>
              <Input
                {...register('name')}
                aria-label="Full Name"
                className="w-full"
                placeholder="Full Name"
              />
              <FieldError>{errors.name?.message}</FieldError>
            </TextField>


            <TextField
              aria-label="username"
              className="w-full"
              isInvalid={Boolean(errors.username)}>
              <Input
                {...register('username')}
                aria-label="Username"
                className="w-full"
                placeholder="Username"
              />
              <FieldError>{errors.username?.message}</FieldError>
            </TextField>


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
              aria-label="gender"
              className="w-full"
              isInvalid={Boolean(errors.gender)}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    className="w-full"
                    placeholder="Select Gender"
                    selectedKey={field.value}
                    onSelectionChange={(key) => {
                      field.onChange(key);
                    }}
                    onBlur={field.onBlur}
                  >
                    <Label>Gender</Label>

                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item
                          id="male"
                          textValue="Male"
                        >
                          Male
                          <ListBox.ItemIndicator />
                        </ListBox.Item>

                        <ListBox.Item
                          id="female"
                          textValue="Female"
                        >
                          Female
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              />
              <FieldError>{errors.gender?.message}</FieldError>
            </TextField>

            <TextField
              aria-label="dateOfBirth"
              className="w-full"
              isInvalid={Boolean(errors.dateOfBirth)}>
              <Input
                {...register('dateOfBirth')}
                aria-label="Date of Birth"
                type="date"
                className="w-full"
              />
              <FieldError>{errors.dateOfBirth?.message}</FieldError>
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


            <TextField
              aria-label="rePassword"
              className="w-full"
              isInvalid={Boolean(errors.rePassword)}>
              <Input
                {...register('rePassword')}
                aria-label="Confirm Password"
                type="password"
                className="w-full"
                placeholder="Confirm Password"
              />
              <FieldError>{errors.rePassword?.message}</FieldError>
            </TextField>

            <Button
              type="submit"
              className="bg-main w-full rounded-md text-white"
            >
              {isSubmitting ? <div className="flex gap-2"> <Spinner className="text-white" /> <p>Loading.....</p> </div> : "Create New Account"}
            </Button>

          </form>
        </section>
      </main>

    </>
  );
}