import { Component, createSignal, Show, JSX } from "solid-js";
import { usePB } from "../../config/pocketbase";
import { Button, Input } from "../../components";
import { useNavigate } from "@solidjs/router";

const AuthEmail: Component = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const { login } = usePB();
  const navigate = useNavigate();

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email() || !password()) {
        throw new Error("Please fill in all fields");
      }

      await login(email(), password());
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 class="mb-5">Sign in</h2>

      <Show when={error()}>
        <div class="text-light-error dark:text-dark-error">{error()}</div>
      </Show>

      <form onSubmit={handleSubmit} class="flex flex-col items-center w-full">
        <Input
          required
          name="email"
          label="Email or username"
          class="w-[95%] mb-2"
          value={email()}
          onChange={setEmail}
          inputProps={{ type: "text" }}
        />

        <Input
          required
          label="Password"
          name="password"
          class="w-[95%]"
          value={password()}
          onChange={setPassword}
          inputProps={{ type: "password" }}
        />

        <Button type="submit" appearance="primary" class="w-[95%] mt-6 mb-2" disabled={isLoading()}>
          {isLoading() ? "Logging in..." : "Login"}
        </Button>
      </form>
    </>
  );
};

export default AuthEmail;
