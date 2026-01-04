import { Component, createSignal, Show, JSX } from "solid-js";
import { usePB } from "../../config/pocketbase";
import { Button, Card, Input } from "@solidpb/ui-kit";
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
      <Show when={error()}>
        <p class="text-error">{error()}</p>
      </Show>

      <form onSubmit={handleSubmit} class="flex flex-col items-center w-full">
        <Input
          required
          name="email"
          label="Email or username"
          class="mb-2 w-full"
          value={email()}
          onChange={setEmail}
          inputProps={{ type: "text" }}
        />

        <Input
          required
          label="Password"
          name="password"
          class="w-full"
          value={password()}
          onChange={setPassword}
          inputProps={{ type: "password" }}
        />

        <Button type="submit" appearance="primary" modifier="block" class="mt-4 mb-2" disabled={isLoading()}>
          {isLoading() ? "Logging in..." : "Login"}
        </Button>
      </form>
    </>
  );
};

export default AuthEmail;
